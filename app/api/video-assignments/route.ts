import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile } from "fs/promises";
import { join } from "path";
import { requireAuth } from "@/lib/middleware";

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
    const data = await readFile(ASSIGNMENTS_FILE, "utf-8");
    const assignments = JSON.parse(data);
    return NextResponse.json({ assignments });
  } catch (error) {
    // If file doesn't exist, return empty array
    return NextResponse.json({ assignments: [] });
  }
}

export async function POST(request: NextRequest) {
  // Check authentication
  const authCheck = await requireAuth(request);
  if (authCheck) return authCheck;

  try {
    const { filename, page, title, description, isActive } = await request.json();

    if (!filename || !page) {
      return NextResponse.json(
        { error: "Filename en page zijn verplicht" },
        { status: 400 }
      );
    }

    // Read existing assignments
    let assignments: VideoAssignment[] = [];
    try {
      const data = await readFile(ASSIGNMENTS_FILE, "utf-8");
      assignments = JSON.parse(data);
    } catch {
      // File doesn't exist yet
    }

    // Update or add assignment
    const existingIndex = assignments.findIndex(a => a.filename === filename);
    const assignment: VideoAssignment = {
      filename,
      page,
      title: title || "",
      description: description || "",
      isActive: isActive !== false,
      updatedAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      assignments[existingIndex] = assignment;
    } else {
      assignments.push(assignment);
    }

    // Save assignments
    await writeFile(ASSIGNMENTS_FILE, JSON.stringify(assignments, null, 2));

    return NextResponse.json({
      success: true,
      assignment
    });
  } catch (error) {
    console.error("Save assignment error:", error);
    return NextResponse.json(
      { error: "Fout bij opslaan toewijzing" },
      { status: 500 }
    );
  }
}
