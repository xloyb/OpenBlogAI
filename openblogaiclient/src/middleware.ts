import { auth } from "@/auth/auth";
import { NextResponse } from "next/server";

const LOGIN = "/login";
const ROOT = "/";
const PUBLIC_ROUTES = ["/login", "/register", "/products"] as const;
const PROTECTED_SUB_ROUTES = ["/checkout", "/blogs"] as const;

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

  // Redirect authenticated users away from login/register to /blogs
  if (isAuthenticated && isLoginOrRegister) {
    return NextResponse.redirect(new URL("/blogs", nextUrl));
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