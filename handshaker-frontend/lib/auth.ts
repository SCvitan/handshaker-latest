// const API_BASE = "http://142.132.181.45:8080"
const API_BASE = "http://localhost:8080"

export type UserRole = "USER" | "COMPANY"

export interface User {
  id: string
  email: string
  role: UserRole
}

/**
 * LOGIN
 * - backend sets HttpOnly JWT cookie
 * - backend returns user object
 */
export async function loginUser(
  email: string,
  password: string
): Promise<User> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  })

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(errorText || "Login failed")
  }

  return res.json()
}

/**
 * REGISTER
 * - backend sets HttpOnly JWT cookie
 * - backend returns user object
 */
export async function registerUser(
  email: string,
  password: string,
  role: UserRole
): Promise<User> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password, role }),
  })

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(errorText || "Registration failed")
  }

  return res.json()
}

/**
 * RESTORE SESSION
 * - uses HttpOnly cookie automatically
 * - called on app boot / page refresh
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const res = await fetch(`${API_BASE}/me`, {
      credentials: "include",
    })

    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

/**
 * LOGOUT
 * - backend clears the HttpOnly cookie
 */
export async function logoutUser(): Promise<void> {
  await fetch(`${API_BASE}/auth/logout`, {
    method: "POST",
    credentials: "include",
  })
}
