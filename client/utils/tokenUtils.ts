import { jwtDecode } from "jwt-decode"

export interface DecodedToken {
  exp: number
  id: string
  isAdmin: boolean
  isModerator: boolean
  isBlocked: boolean
}

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<DecodedToken>(token)
    return decoded.exp < Date.now() / 1000
  } catch {
    return true
  }
}

export const setRefreshTokenCookie = (refreshToken: string) => {
  document.cookie = `refreshToken=${refreshToken}; HttpOnly; Secure; SameSite=Strict; Path=/`
}

