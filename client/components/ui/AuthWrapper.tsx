"use client"

import type React from "react"
import { AuthProvider } from "@/context/AuthContext"

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}

