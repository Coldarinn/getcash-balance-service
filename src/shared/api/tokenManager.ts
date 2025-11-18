import Cookies from "js-cookie"

export const accessTokenName = "accessToken"
export const refreshTokenName = "refreshToken"

export const getAccessToken = (cookieHeader?: string | null) => {
  if (cookieHeader) {
    const cookies = new Map(cookieHeader.split("; ").map((c) => c.split("=") as [string, string]))

    return cookies.get(accessTokenName) || null
  }

  return Cookies.get(accessTokenName) || null
}

export const saveAccessToken = (accessToken: string) => {
  Cookies.set(accessTokenName, accessToken, {
    domain: import.meta.env.VITE_DOMAIN,
    sameSite: "strict",
    secure: true,
  })
}

export const removeAccessToken = () => {
  Cookies.remove(accessTokenName)
}
