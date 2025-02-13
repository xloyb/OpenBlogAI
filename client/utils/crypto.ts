import CryptoJS from "crypto-js"

const SECRET_KEY = "change-this-key-mother-fucker" 

export const encrypt = (text: string): string => {
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString()
}

export const decrypt = (ciphertext: string | null): string | null => {
  if (!ciphertext) return null
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY)
    return bytes.toString(CryptoJS.enc.Utf8)
  } catch (error) {
    console.error("Decryption error:", error)
    return null
  }
}

