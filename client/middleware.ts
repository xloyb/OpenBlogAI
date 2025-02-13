import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// List of public routes that don't require authentication
const publicRoutes = ["/test", "/login", "/register"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isPublicRoute = publicRoutes.includes(pathname)

  // Check for the authentication token in localStorage
  const accessToken = request.cookies.get("accessToken")?.value

  if (!isPublicRoute && !accessToken) {
    // Redirect to login if trying to access a protected route without authentication
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (isPublicRoute && accessToken) {
    // Redirect to dashboard if trying to access a public route while authenticated
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Continue with the request if everything is fine
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}


