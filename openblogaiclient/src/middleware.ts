import { auth } from "@/auth/auth";
import { NextResponse } from "next/server";

const LOGIN = "/login";
const ROOT = "/";
const PUBLIC_ROUTES = ["/login", "/register", "/products", "/401", "/404", "/500", "/blogs"] as const;
const PROTECTED_SUB_ROUTES = ["/checkout", "/myblogs"] as const;

export default auth((req) => {
  const session = req.auth;
  const isAuthenticated = !!session?.user;
  const { nextUrl } = req;

  // Skip middleware for API routes
  if (nextUrl.pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const isPublicRoute =
    (PUBLIC_ROUTES.some((route) => nextUrl.pathname.startsWith(route)) ||
      nextUrl.pathname === ROOT) &&
    !PROTECTED_SUB_ROUTES.some((route) => nextUrl.pathname.includes(route));

  const isLoginOrRegister =
    nextUrl.pathname === LOGIN || nextUrl.pathname === "/register";

  // Redirect authenticated users away from login/register to /myblogs
  if (isAuthenticated && isLoginOrRegister) {
    return NextResponse.redirect(new URL("/myblogs", nextUrl));
  }

  // Redirect unauthenticated users from protected routes to login
  if (!isAuthenticated && !isPublicRoute) {
    return NextResponse.redirect(new URL(LOGIN, nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)", "/", "/(trpc)(.*)"],
};