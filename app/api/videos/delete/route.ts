import { NextRequest, NextResponse } from "next/server";
import { unlink, readFile, writeFile } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { requireAuth } from "@/lib/middleware";

const ASSIGNMENTS_FILE = join(process.cwd(), "data", "video-assignments.json");

export async function DELETE(request: NextRequest) {
  // Check authentication
  const authCheck = await requireAuth(request);
  if (authCheck) return authCheck;

  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get("filename");

    if (!filename) {
      return NextResponse.json(
        { error: "Geen bestandsnaam opgegeven" },
        { status: 400 }
      );
    }

    // Security: sanitize filename to prevent directory traversal
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filepath = join(process.cwd(), "public", "videos", sanitizedFilename);

    // Check if file exists
    if (!existsSync(filepath)) {
      return NextResponse.json(
        { error: "Bestand niet gevonden" },
        { status: 404 }
      );
    }

    // Delete the file
    await unlink(filepath);

    // Also remove from assignments
    try {
      let assignments = [];
      try {
        const data = await readFile(ASSIGNMENTS_FILE, "utf-8");
        assignments = JSON.parse(data);
      } catch {
        // File doesn't exist
      }

      // Remove assignment for this video
      assignments = assignments.filter((a: any) => a.filename !== filename);

      // Save updated assignments
      await writeFile(ASSIGNMENTS_FILE, JSON.stringify(assignments, null, 2));
    } catch (assignmentError) {
      console.error("Error removing assignment:", assignmentError);
      // Continue even if assignment removal fails
    }

    return NextResponse.json({
      success: true,
      message: `Video ${sanitizedFilename} succesvol verwijderd`,
    });
  } catch (error) {
    console.error("Delete video error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return NextResponse.json(
      { error: `Fout bij verwijderen: ${errorMessage}` },
      { status: 500 }
    );
  }
}
