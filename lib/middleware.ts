import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./auth";

export async function requireAuth(request: NextRequest) {
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
    // Return JSON error instead of redirect for API routes
    return NextResponse.json(
      { error: "Unauthorized", message: "Authentication required" },
      { status: 401 }
    );
  }

  const user = verifyToken(token);
  
  if (!user) {
    // Return JSON error instead of redirect for API routes
    return NextResponse.json(
      { error: "Unauthorized", message: "Invalid token" },
      { status: 401 }
    );
  }

  return null; // User is authenticated
}

