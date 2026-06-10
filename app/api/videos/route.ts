import { NextResponse } from "next/server";
import { readdir } from "fs/promises";
import { join } from "path";
import { statSync } from "fs";

export async function GET() {
  try {
    const videosDir = join(process.cwd(), "public", "videos");
    
    // Read all files in videos directory
    const files = await readdir(videosDir);
    
    // Filter for video files and get their info
    const videoFiles = files
      .filter((file) => {
        const ext = file.toLowerCase();
        return ext.endsWith(".mp4") || ext.endsWith(".webm") || ext.endsWith(".ogg");
      })
      .map((file) => {
        const filePath = join(videosDir, file);
        const stats = statSync(filePath);
        
        return {
          name: file,
          path: `/videos/${file}`,
          size: stats.size,
          uploadedAt: stats.mtime.toISOString(),
        };
      })
      .sort((a, b) => {
        // Sort by upload date (newest first)
        return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
      });

    return NextResponse.json({ videos: videoFiles });
  } catch (error) {
    console.error("Error reading videos:", error);
    return NextResponse.json(
      { error: "Fout bij ophalen van video's" },
      { status: 500 }
    );
  }
}


