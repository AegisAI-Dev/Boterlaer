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

export async function GET() {
  try {
    const stops = readWalk();
    return NextResponse.json(stops);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to read walk stops" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const authCheck = await requireAuth(request);
  if (authCheck) return authCheck;

  try {
    const stop = await request.json();
    const stops = readWalk();
    
    // Generate new ID
    const newId = stops.length > 0 ? Math.max(...stops.map((s: any) => s.id)) + 1 : 1;
    stop.id = newId;
    
    stops.push(stop);
    writeWalk(stops);
    
    return NextResponse.json(stop, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create walk stop" },
      { status: 500 }
    );
  }
}

