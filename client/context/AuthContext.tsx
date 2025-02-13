"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { API_ROUTES } from "@/config/api"
import { encrypt, decrypt } from "@/utils/crypto"
import { setCookie, getCookie, deleteCookie } from "cookies-next"

interface AuthContextType {
  isAuthenticated: boolean
  accessToken: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (email: string, password: string) => Promise<void>
  refreshTokens: () => Promise<void>
  error: string | null
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const storedAccessToken = getCookie("accessToken")
    const storedRefreshToken = localStorage.getItem("refreshToken")

    const decryptedAccessToken = decrypt(storedAccessToken as string)
    const decryptedRefreshToken = decrypt(storedRefreshToken || "")

    if (decryptedAccessToken && decryptedRefreshToken) {
      setAccessToken(decryptedAccessToken)
      setRefreshToken(decryptedRefreshToken)
      setIsAuthenticated(true)
    } else {
      // Clear potentially corrupted tokens
      deleteCookie("accessToken")
      localStorage.removeItem("refreshToken")
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(API_ROUTES.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      if (!data.accessToken || !data.refreshToken) {
        throw new Error("Access token or refresh token not received from server")
      }

      setAccessToken(data.accessToken)
      setRefreshToken(data.refreshToken)
      setIsAuthenticated(true)
      setCookie("accessToken", encrypt(data.accessToken))
      localStorage.setItem("refreshToken", encrypt(data.refreshToken))
      router.push("/dashboard")
    } catch (error) {
      console.error("Login error:", error)
      setError(error instanceof Error ? error.message : "An unexpected error occurred during login")
      throw error
    }
  }

  const register = async (email: string, password: string) => {
    try {
      const response = await fetch(API_ROUTES.REGISTER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      if (!data.accessToken || !data.refreshToken) {
        throw new Error("Access token or refresh token not received from server")
      }

      setAccessToken(data.accessToken)
      setRefreshToken(data.refreshToken)
      setIsAuthenticated(true)
      setCookie("accessToken", encrypt(data.accessToken))
      localStorage.setItem("refreshToken", encrypt(data.refreshToken))
      router.push("/dashboard")
    } catch (error) {
      console.error("Registration error:", error)
      setError(error instanceof Error ? error.message : "An unexpected error occurred during registration")
      throw error
    }
  }

  const logout = async () => {
    try {
      if (!refreshToken) {
        throw new Error("No refresh token available")
      }

      const response = await fetch(API_ROUTES.LOGOUT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      setAccessToken(null)
      setRefreshToken(null)
      setIsAuthenticated(false)
      deleteCookie("accessToken")
      localStorage.removeItem("refreshToken")
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
      setError("Failed to logout. Please try again.")
    }
  }

  const refreshTokens = async () => {
    try {
      if (!refreshToken) {
        throw new Error("No refresh token available")
      }

      const response = await fetch(API_ROUTES.REFRESH, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      if (!data.newAccessToken || !data.newRefreshToken) {
        throw new Error("New access token or refresh token not received from server")
      }

      setAccessToken(data.newAccessToken)
      setRefreshToken(data.newRefreshToken)
      setIsAuthenticated(true)
      setCookie("accessToken", encrypt(data.newAccessToken))
      localStorage.setItem("refreshToken", encrypt(data.newRefreshToken))
    } catch (error) {
      console.error("Token refresh error:", error)
      setError("Session expired. Please login again.")
      setAccessToken(null)
      setRefreshToken(null)
      setIsAuthenticated(false)
      deleteCookie("accessToken")
      localStorage.removeItem("refreshToken")
      router.push("/login")
    }
  }

  const clearError = () => setError(null)

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, accessToken, login, logout, register, refreshTokens, error, clearError }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

