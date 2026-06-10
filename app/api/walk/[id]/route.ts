import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { requireAuth } from "@/lib/middleware";

const WALK_FILE = join(process.cwd(), "data", "walk.json");

function readWalk() {
  const fileContent = readFileSync(WALK_FILE, "utf-8");
  return JSON.parse(fileContent);
}

function writeWalk(stops: any[]) {
  writeFileSync(WALK_FILE, JSON.stringify(stops, null, 2), "utf-8");
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const stops = readWalk();
    const stop = stops.find((s: any) => s.id === parseInt(id));

    if (!stop) {
      return NextResponse.json({ error: "Walk stop not found" }, { status: 404 });
    }

    return NextResponse.json(stop);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to read walk stop" },
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
    const updatedStop = await request.json();
    const stops = readWalk();
    const index = stops.findIndex((s: any) => s.id === parseInt(id));

    if (index === -1) {
      return NextResponse.json({ error: "Walk stop not found" }, { status: 404 });
    }

    // Merge with existing stop to preserve fields that weren't sent
    const existingStop = stops[index];

    // Start with existing stop and only update fields that were provided
    const mergedStop: any = {
      ...existingStop,
      id: parseInt(id),
      slug: updatedStop.slug || existingStop.slug,
      title: updatedStop.title || existingStop.title,
      description: updatedStop.description || existingStop.description,
      relatedPlantIds: updatedStop.relatedPlantIds || existingStop.relatedPlantIds || [],
    };

    // Handle imageSummer: only update if explicitly provided
    if ('imageSummer' in updatedStop) {
      // Field was provided in request
      if (updatedStop.imageSummer && updatedStop.imageSummer.trim() !== "") {
        // Non-empty value: update it
        mergedStop.imageSummer = updatedStop.imageSummer;
      } else {
        // Empty string: clear it (user removed the image)
        mergedStop.imageSummer = "";
      }
    } else {
      // Field not provided: keep existing value
      if (existingStop.imageSummer) {
        mergedStop.imageSummer = existingStop.imageSummer;
      }
    }

    // Handle imageWinter: only update if explicitly provided
    if ('imageWinter' in updatedStop) {
      // Field was provided in request
      if (updatedStop.imageWinter && updatedStop.imageWinter.trim() !== "") {
        // Non-empty value: update it
        mergedStop.imageWinter = updatedStop.imageWinter;
      } else {
        // Empty string: clear it (user removed the image)
        mergedStop.imageWinter = "";
      }
    } else {
      // Field not provided: keep existing value
      if (existingStop.imageWinter) {
        mergedStop.imageWinter = existingStop.imageWinter;
      }
    }

    stops[index] = mergedStop;
    writeWalk(stops);

    return NextResponse.json(mergedStop);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update walk stop" },
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
    const stops = readWalk();
    const filteredStops = stops.filter((s: any) => s.id !== parseInt(id));

    if (stops.length === filteredStops.length) {
      return NextResponse.json({ error: "Walk stop not found" }, { status: 404 });
    }

    writeWalk(filteredStops);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete walk stop" },
      { status: 500 }
    );
  }
}

