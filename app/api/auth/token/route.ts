import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

// Endpoint om token op te halen na login (voor localStorage)
// Dit werkt omdat Next.js de token property filtert uit de login response
export async function GET(request: NextRequest) {
  // Haal sessionId uit header
  const sessionId = request.headers.get("X-Session-Id");
  const globalAny = global as any;
  
  if (sessionId && globalAny.tokenStore) {
    const token = globalAny.tokenStore.get(sessionId);
    const expiry = globalAny.tokenStore.get(sessionId + '_expiry');
    
    // Check of token nog geldig is
    if (token && expiry && Date.now() < expiry) {
      // Verwijder uit store na gebruik
      globalAny.tokenStore.delete(sessionId);
      globalAny.tokenStore.delete(sessionId + '_expiry');
      
      // Return token zodat frontend het kan opslaan in localStorage
      return NextResponse.json({ 
        success: true,
        token: token 
      });
    }
  }
  
  return NextResponse.json(
    { success: false, message: "Geen geldige sessie" },
    { status: 401 }
  );
}

