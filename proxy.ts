import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/admin/constants";

// Next 16 renombró la convención `middleware` → `proxy` (misma API).
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE_NAME)?.value);
  const isLogin = pathname === "/admin/login";

  // Sin cookie de sesión: a la pantalla de login (excepto la propia login).
  // No redirigimos login → /admin cuando hay cookie: la validez real del token
  // la verifica el layout del panel (getOptionalAdminUser), y un redirect aquí
  // con una cookie inválida provocaría un bucle login ⇄ panel.
  if (!hasSession && !isLogin) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
