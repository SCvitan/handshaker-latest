const API_BASE = "http://localhost:8080"

export type UserRole = "USER" | "COMPANY"

export interface AuthResponse {
  token: string
}

export interface DecodedToken {
  sub: string
  role: UserRole
  iat: number
  exp: number
}

function decodeJWT(token: string): DecodedToken | null {
  try {
    const base64Url = token.split(".")[1]
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    )
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

export async function registerUser(
  email: string,
  password: string,
  role: UserRole
): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, role }),
  })

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(errorText || "Registration failed")
  }

  return res.json()
}

export async function loginUser(
  email: string,
  password: string
): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(errorText || "Login failed")
  }

  return res.json()
}

export function saveToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_token", token)
  }
}

export function getToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token")
  }
  return null
}

export function removeToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token")
  }
}

export function getUser(): { email: string; role: UserRole; id: string } | null {
  const token = getToken()
  if (!token) return null

  const decoded = decodeJWT(token)
  if (!decoded) return null

  if (decoded.exp * 1000 < Date.now()) {
    removeToken()
    return null
  }

  return {
    id: decoded.sub,
    role: decoded.role,
    email: "",
  }
}

export function isAuthenticated(): boolean {
  return getUser() !== null
}
