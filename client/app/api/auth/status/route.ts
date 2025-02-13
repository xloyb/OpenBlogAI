import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  const cookieStore = await cookies()
  const authToken = cookieStore.get("auth_token")

  return NextResponse.json({ isAuthenticated: !!authToken })
}

