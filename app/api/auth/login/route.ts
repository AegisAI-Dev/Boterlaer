import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_ADMIN, generateToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Check credentials
    if (username === DEFAULT_ADMIN.username && password === DEFAULT_ADMIN.password) {
      const token = generateToken({ username });
      
      // Stuur token in response body als plain text
      // Next.js filtert JSON properties, dus gebruik plain text
      // Cookie warning kunnen we negeren - later wordt het HTTPS
      return new Response(
        `SUCCESS:${token}`,
        {
          status: 200,
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
          },
        }
      );
    }

    return NextResponse.json(
      { success: false, message: "Ongeldige gebruikersnaam of wachtwoord" },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Er is een fout opgetreden" },
      { status: 500 }
    );
  }
}
