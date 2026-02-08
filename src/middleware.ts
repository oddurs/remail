import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const SESSION_COOKIE = "session_id";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function middleware(request: NextRequest) {
  // 1. Handle Supabase session refresh
  const response = await updateSession(request);

  // 2. Ensure anonymous session cookie exists
  const existingSession = request.cookies.get(SESSION_COOKIE);

  if (!existingSession) {
    const sessionId = crypto.randomUUID();
    response.cookies.set(SESSION_COOKIE, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE,
      path: "/",
    });
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - public folder assets
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
