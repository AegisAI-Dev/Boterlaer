import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/middleware";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const plant = await prisma.plant.findUnique({
      where: { id: parseInt(id) },
      include: {
        photos: true,
      },
    });

    if (!plant) {
      return NextResponse.json({ error: "Plant not found" }, { status: 404 });
    }

    const sortedPhotos = [...plant.photos].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
    const image = sortedPhotos[0]?.path || "";
    const images = sortedPhotos.slice(1).map((p) => p.path);

    return NextResponse.json({
      ...plant,
      image,
      images,
    });
  } catch (error) {
    console.error("Fetch plant error:", error);
    return NextResponse.json(
      { error: "Failed to fetch plant" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authCheck = await requireAuth(request);
  if (authCheck) return authCheck;

  try {
    const { id } = await params;
    const data = await request.json();

    const plant = await prisma.plant.update({
      where: { id: parseInt(id) },
      data: {
        commonName: data.commonName,
        latinName: data.latinName,
        description: data.description,
        category: data.category,
        family: data.family,
        origin: data.origin,
        floweringPeriod: data.floweringPeriod,
        heightCm: typeof data.heightCm === "string" ? parseInt(data.heightCm) : data.heightCm,
        light: data.light,
        locationCode: data.locationCode,
        beeFriendly: !!data.beeFriendly,
      },
    });

    // Delete existing photos to rebuild them
    await prisma.photo.deleteMany({
      where: { plantId: plant.id },
    });

    // Create main photo (order: 0) if provided
    if (data.image) {
      const filename = data.image.split("/").pop() || "image.jpg";
      await prisma.photo.create({
        data: {
          filename,
          path: data.image,
          category: "plants",
          order: 0,
          plantId: plant.id,
        },
      });
    }

    // Create additional photos (order: index + 1) if provided
    if (data.additionalImages && Array.isArray(data.additionalImages)) {
      for (let i = 0; i < data.additionalImages.length; i++) {
        const imgPath = data.additionalImages[i];
        if (imgPath) {
          const filename = imgPath.split("/").pop() || `image_${i}.jpg`;
          await prisma.photo.create({
            data: {
              filename,
              path: imgPath,
              category: "plants",
              order: i + 1,
              plantId: plant.id,
            },
          });
        }
      }
    }

    // Fetch plant again with updated photos to return mapped structure
    const updatedPlant = await prisma.plant.findUnique({
      where: { id: plant.id },
      include: { photos: true },
    });

    if (updatedPlant) {
      const sortedPhotos = [...updatedPlant.photos].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
      const image = sortedPhotos[0]?.path || "";
      const images = sortedPhotos.slice(1).map((p) => p.path);
      return NextResponse.json({
        ...updatedPlant,
        image,
        images,
      });
    }

    return NextResponse.json(plant);
  } catch (error) {
    console.error("Update plant error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: `Failed to update plant: ${errorMessage}` },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authCheck = await requireAuth(request);
  if (authCheck) return authCheck;

  try {
    const { id } = await params;
    const plantId = parseInt(id);

    // Delete associated photos first
    await prisma.photo.deleteMany({
      where: { plantId },
    });

    // Delete the plant
    await prisma.plant.delete({
      where: { id: plantId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete plant error:", error);
    return NextResponse.json(
      { error: "Failed to delete plant" },
      { status: 500 }
    );
  }
}



