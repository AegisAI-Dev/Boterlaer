import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { requireAuth } from "@/lib/middleware";

const GALLERY_FILE = join(process.cwd(), "data", "walk-galleries.json");

function readGallery() {
  try {
    const fileContent = readFileSync(GALLERY_FILE, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    return {};
  }
}

function writeGallery(data: any) {
  writeFileSync(GALLERY_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const galleries = readGallery();
    const photos = galleries[slug] || [];
    return NextResponse.json({ photos });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to read gallery" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const authCheck = await requireAuth(request);
  if (authCheck) return authCheck;

  try {
    const { slug } = await params;
    const { path, alt, title } = await request.json();
    const galleries = readGallery();

    if (!galleries[slug]) {
      galleries[slug] = [];
    }

    // Generate new ID
    const existingPhotos = galleries[slug];
    const newId = existingPhotos.length > 0
      ? Math.max(...existingPhotos.map((p: any) => p.id)) + 1
      : 1;

    const newPhoto = {
      id: newId,
      path,
      alt: alt || "",
      title: title || "",
    };

    galleries[slug].push(newPhoto);
    writeGallery(galleries);

    return NextResponse.json(newPhoto, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add photo" },
      { status: 500 }
    );
  }
}
