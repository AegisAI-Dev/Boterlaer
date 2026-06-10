import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  // Check eerst cookie, dan Authorization header (voor localStorage fallback)
  let token = request.cookies.get("auth-token")?.value;
  
  // Als geen cookie, check Authorization header (van localStorage)
  if (!token) {
    const authHeader = request.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }
  }

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const user = verifyToken(token);
  
  if (!user) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true, user });
}

