"use client"

import { useState, useCallback } from "react"
import { useAuth } from "@/context/AuthContext"
import { decrypt } from "@/utils/crypto"

export const useAuthenticatedFetch = () => {
  const { accessToken, refreshTokens } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const authFetch = useCallback(
    async (url: string, options: RequestInit = {}) => {
      setIsLoading(true)
      try {
        const headers = new Headers(options.headers)
        const decryptedToken = decrypt(accessToken || "")
        if (decryptedToken) {
          headers.set("Authorization", `Bearer ${decryptedToken}`)
        }

        const response = await fetch(url, { ...options, headers })

        if (response.status === 401) {
          await refreshTokens()
          const newDecryptedToken = decrypt(accessToken || "")
          if (newDecryptedToken) {
            headers.set("Authorization", `Bearer ${newDecryptedToken}`)
          }
          return fetch(url, { ...options, headers })
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        return response
      } catch (error) {
        console.error("Fetch error:", error)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [accessToken, refreshTokens],
  )

  return { authFetch, isLoading }
}

