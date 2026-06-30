import { NextRequest, NextResponse } from "next/server";
import {
  adminAuthErrorResponse,
  createAdminSession,
  requireAdminUser,
} from "@/lib/admin/auth";
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE_MS } from "@/lib/admin/constants";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await requireAdminUser();
    return NextResponse.json({ user });
  } catch (error) {
    return adminAuthErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { idToken } = (await request.json()) as { idToken?: string };
    if (!idToken) {
      return NextResponse.json({ error: "Falta el token de Google." }, { status: 400 });
    }

    const { sessionCookie, user } = await createAdminSession(idToken);
    const response = NextResponse.json({ user });
    response.cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
      maxAge: Math.floor(SESSION_MAX_AGE_MS / 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (error) {
    return adminAuthErrorResponse(error);
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return response;
}
