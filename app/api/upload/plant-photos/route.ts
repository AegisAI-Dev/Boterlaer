import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { verifyToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  // Check authentication: cookie first, then Authorization header (localStorage fallback)
  let token = request.cookies.get("auth-token")?.value;

  if (!token) {
    const authHeader = request.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }
  }

  if (!token || !verifyToken(token)) {
    return NextResponse.json(
      { error: "Niet geautoriseerd. Log opnieuw in." },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "Geen bestanden geselecteerd" },
        { status: 400 }
      );
    }

    // Validate file types
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    const invalidFiles = files.filter(file => !allowedTypes.includes(file.type));

    if (invalidFiles.length > 0) {
      return NextResponse.json(
        {
          error: "Ongeldig bestandsformaat. Alleen JPG, PNG, WebP en GIF zijn toegestaan.",
          invalidFiles: invalidFiles.map(f => f.name)
        },
        { status: 400 }
      );
    }

    // Create upload directory if it doesn't exist
    const publicDir = join(process.cwd(), "public");
    const uploadDir = join(publicDir, "images", "plants");
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch {
      // Directory might already exist
    }

    const imageUrls: string[] = [];

    // Process each uploaded file
    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate unique filename with proper extension - strictly sanitize
      const timestamp = Date.now();

      // Use a safer way to strip directory info from the client-provided name
      const safeOriginalName = (file.name || "upload").split(/[\\/]/).pop() || "upload";
      const sanitizedName = safeOriginalName.replace(/[^a-zA-Z0-9.-]/g, "_").toLowerCase();

      // Ensure correct file extension
      let extension = '';
      if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
        extension = '.jpg';
      } else if (file.type === 'image/png') {
        extension = '.png';
      } else if (file.type === 'image/webp') {
        extension = '.webp';
      } else if (file.type === 'image/gif') {
        extension = '.gif';
      }

      const filename = `${timestamp}_${sanitizedName}${extension}`;
      const filepath = join(uploadDir, filename);

      // Safety check: Ensure filepath is still within uploadDir (defense in depth)
      if (!filepath.startsWith(uploadDir)) {
        throw new Error("Invalid file path");
      }

      // Save file
      await writeFile(filepath, buffer);

      // Generate URL
      const imageUrl = `/images/plants/${filename}`;
      imageUrls.push(imageUrl);
    }

    return NextResponse.json({
      success: true,
      message: `${files.length} foto('s) succesvol geüpload`,
      imageUrls: imageUrls,
      uploadedFiles: files.map(f => ({ name: f.name, type: f.type, size: f.size }))
    });

  } catch (error) {
    console.error("Plant photos upload error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);

    return NextResponse.json(
      { error: `Upload mislukt: ${errorMessage}` },
      { status: 500 }
    );
  }
}
