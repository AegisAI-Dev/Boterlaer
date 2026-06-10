import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/middleware";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const plants = await prisma.plant.findMany({
      include: {
        photos: true,
      },
      orderBy: {
        latinName: "asc",
      },
    });

    const mappedPlants = plants.map((plant) => {
      const sortedPhotos = [...plant.photos].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
      const image = sortedPhotos[0]?.path || "";
      const images = sortedPhotos.slice(1).map((p) => p.path);
      return {
        ...plant,
        image,
        images,
      };
    });

    return NextResponse.json(mappedPlants);
  } catch (error) {
    console.error("Fetch plants error:", error);
    return NextResponse.json(
      { error: "Failed to fetch plants" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const authCheck = await requireAuth(request);
  if (authCheck) return authCheck;

  try {
    const data = await request.json();
    
    // Map properties from incoming data to match schema
    const plant = await prisma.plant.create({
      data: {
        commonName: data.commonName || "",
        latinName: data.latinName || "",
        description: data.description || null,
        category: data.category || null,
        family: data.family || null,
        origin: data.origin || null,
        floweringPeriod: data.floweringPeriod || null,
        heightCm: typeof data.heightCm === "string" ? parseInt(data.heightCm) : data.heightCm || null,
        light: data.light || null,
        locationCode: data.locationCode || null,
        beeFriendly: !!data.beeFriendly,
      },
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

    // Fetch newly created plant with photos to return the mapped structure
    const createdPlant = await prisma.plant.findUnique({
      where: { id: plant.id },
      include: { photos: true },
    });

    if (createdPlant) {
      const sortedPhotos = [...createdPlant.photos].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
      const image = sortedPhotos[0]?.path || "";
      const images = sortedPhotos.slice(1).map((p) => p.path);
      return NextResponse.json({
        ...createdPlant,
        image,
        images,
      }, { status: 201 });
    }

    return NextResponse.json(plant, { status: 201 });
  } catch (error) {
    console.error("Create plant error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: `Failed to create plant: ${errorMessage}` },
      { status: 500 }
    );
  }
}



