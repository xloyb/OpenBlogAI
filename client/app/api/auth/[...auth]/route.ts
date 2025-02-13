import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

// This is a mock user for demonstration. In a real app, you'd fetch this from a database.
const MOCK_USER = {
  email: "user@example.com",
  password: "password123",
}

export async function POST(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  if (pathname.endsWith("/login")) {
    return handleLogin(request)
  } else if (pathname.endsWith("/logout")) {
    return handleLogout()
  } else {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
}

export async function GET(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  if (pathname.endsWith("/status")) {
    return handleStatus()
  } else {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
}

async function handleLogin(request: NextRequest) {
  const body = await request.json()
  const { email, password } = body

  if (email === MOCK_USER.email && password === MOCK_USER.password) {
    const response = NextResponse.json({ success: true })
    response.cookies.set("auth_token", "mock_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600, // 1 hour
    })
    return response
  } else {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }
}

function handleLogout() {
  const response = NextResponse.json({ success: true })
  response.cookies.set("auth_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
  })
  return response
}

async function handleStatus() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")

  if (token) {
    return NextResponse.json({ isAuthenticated: true })
  } else {
    return NextResponse.json({ isAuthenticated: false })
  }
}

