import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { requireAuth } from "@/lib/middleware";

const SETTINGS_FILE = join(process.cwd(), "data", "settings.json");

function readSettings() {
  const fileContent = readFileSync(SETTINGS_FILE, "utf-8");
  return JSON.parse(fileContent);
}

function writeSettings(settings: any) {
  writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), "utf-8");
}

export async function GET() {
  try {
    const settings = readSettings();
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to read settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const authCheck = await requireAuth(request);
  if (authCheck) return authCheck;

  try {
    const settings = await request.json();
    writeSettings(settings);
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
