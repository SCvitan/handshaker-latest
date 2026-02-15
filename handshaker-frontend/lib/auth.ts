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
 * - backend returns user
 */
export async function loginUser(
  email: string,
  password: string
): Promise<User> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // ⭐ VERY IMPORTANT
    body: JSON.stringify({ email, password }),
  })

  if (!res.ok) {
    throw new Error(await res.text())
  }

  return res.json()
}

/**
 * REGISTER
 * - backend sets HttpOnly JWT cookie
 * - backend returns user
 */
export async function registerUser(
  email: string,
  password: string,
  role: UserRole
): Promise<User> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // ⭐ VERY IMPORTANT
    body: JSON.stringify({ email, password, role }),
  })

  if (!res.ok) {
    throw new Error(await res.text())
  }

  return res.json()
}

/**
 * RESTORE SESSION
 * - uses cookie automatically
 * - called on app boot / refresh
 */
export async function getCurrentUser(): Promise<User | null> {
  const res = await fetch(`${API_BASE}/me`, {
    credentials: "include",
  })

  if (!res.ok) {
    return null
  }

  return res.json()
}

/**
 * LOGOUT
 * - backend should clear cookie
 */
export async function logoutUser(): Promise<void> {
  await fetch(`${API_BASE}/auth/logout`, {
    method: "POST",
    credentials: "include",
  })
}
