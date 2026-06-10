import { NextRequest, NextResponse } from "next/server";
import { readdir, unlink, readFile } from "fs/promises";
import { join } from "path";
import { statSync } from "fs";
import { requireAuth } from "@/lib/middleware";

interface VideoFile {
  name: string;
  path: string;
  size: number;
  uploadedAt: string;
}

interface VideoAssignment {
  filename: string;
  page: string;
  title?: string;
  description?: string;
  isActive: boolean;
  updatedAt: string;
}

const ASSIGNMENTS_FILE = join(process.cwd(), "data", "video-assignments.json");

export async function GET() {
  try {
    // Read all files in videos directory
    const videosDir = join(process.cwd(), "public", "videos");
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

    // Read assignments
    let assignments: VideoAssignment[] = [];
    try {
      const data = await readFile(ASSIGNMENTS_FILE, "utf-8");
      assignments = JSON.parse(data);
    } catch {
      // File doesn't exist yet
    }

    // Merge assignments with video files
    const videosWithAssignments = videoFiles.map(video => {
      const assignment = assignments.find(a => a.filename === video.name);
      return {
        ...video,
        assignedPage: assignment?.page || "general",
        title: assignment?.title || "",
        description: assignment?.description || "",
        isActive: assignment?.isActive !== false,
        assignmentUpdatedAt: assignment?.updatedAt
      };
    });

    return NextResponse.json({ videos: videosWithAssignments });
  } catch (error) {
    console.error("Error reading videos:", error);
    return NextResponse.json(
      { error: "Fout bij ophalen van video's" },
      { status: 500 }
    );
  }
}
