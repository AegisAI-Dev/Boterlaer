import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { requireAuth } from "@/lib/middleware";

// Configure route to accept large file uploads (up to 10GB)
export const maxDuration = 60; // Vercel hobby plan max is 60 (or up to 300 depending on exact plan)
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic'; // Disable static optimization

export async function POST(request: NextRequest) {
  // Check authentication
  const authCheck = await requireAuth(request);
  if (authCheck) return authCheck;

  try {
    console.log("Upload request received, parsing formData...");
    const formData = await request.formData();
    console.log("FormData parsed successfully");
    const file = formData.get("file") as File;
    const categoryInput = formData.get("category") as string || "gallery"; // gallery, plants, blog

    // Strict category validation to prevent path traversal
    const allowedCategories = ["gallery", "plants", "blog", "videos"];
    const category = allowedCategories.includes(categoryInput) ? categoryInput : "gallery";

    if (!file) {
      return NextResponse.json(
        { error: "Geen bestand geüpload" },
        { status: 400 }
      );
    }

    // Validate file type - support both images and videos
    const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    const allowedVideoTypes = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"];
    const allowedTypes = [...allowedImageTypes, ...allowedVideoTypes];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Alleen afbeeldingen (JPEG, PNG, WebP, GIF) of video's (MP4, WebM, OGG) zijn toegestaan" },
        { status: 400 }
      );
    }

    // Determine if it's a video or image
    const isVideo = allowedVideoTypes.includes(file.type);

    // Validate file size - no limit for videos, 50MB for images
    const maxSize = isVideo ? Infinity : 50 * 1024 * 1024; // No limit for videos, 50MB for images
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "Bestand is te groot (max 50MB)" },
        { status: 400 }
      );
    }

    // Create unique filename - strictly sanitize to prevent path traversal
    const timestamp = Date.now();
    const safeOriginalName = (file.name || "upload").split(/[\\/]/).pop() || "upload";
    const sanitizedName = safeOriginalName.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${timestamp}_${sanitizedName}`;

    // Determine upload directory based on file type and category
    const publicDir = join(process.cwd(), "public");
    let uploadDir: string;
    let publicPath: string;

    if (isVideo) {
      // Videos go to /public/videos/
      uploadDir = join(publicDir, "videos");
      publicPath = `/videos/${filename}`;
    } else {
      // Images go to /public/images/[category]/
      uploadDir = join(publicDir, "images", category);
      publicPath = `/images/${category}/${filename}`;
    }

    // Safety check: Ensure uploadDir is still within publicDir (defense in depth)
    if (!uploadDir.startsWith(publicDir)) {
      throw new Error("Ongeldig uploadpad");
    }

    // Create directory if it doesn't exist
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Save file using arrayBuffer for maximum compatibility
    console.log(`Saving file: ${filename}, size: ${file.size} bytes to ${uploadDir}`);
    const filepath = join(uploadDir, filename);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await writeFile(filepath, buffer);
    console.log(`File saved successfully: ${filepath}`);

    return NextResponse.json({
      success: true,
      path: publicPath,
      filename: filename,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error("Upload error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    const statusCode = errorMessage.includes('413') || errorMessage.includes('too large') ? 413 : 500;

    return NextResponse.json(
      {
        error: errorMessage.includes('413') || errorMessage.includes('too large')
          ? "Bestand is te groot. Nginx limiet moet worden verhoogd (zie update-nginx-upload-limit.sh)"
          : `Fout bij uploaden: ${errorMessage}`
      },
      { status: statusCode }
    );
  }
}
