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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; id: string }> }
) {
  const authCheck = await requireAuth(request);
  if (authCheck) return authCheck;

  try {
    const { slug, id } = await params;
    const galleries = readGallery();

    if (!galleries[slug]) {
      return NextResponse.json({ error: "Gallery not found" }, { status: 404 });
    }

    const photoId = parseInt(id);
    galleries[slug] = galleries[slug].filter(
      (p: any) => p.id !== photoId
    );

    writeGallery(galleries);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete photo" },
      { status: 500 }
    );
  }
}
