//const API_BASE = "https://croworker.app"
const API_BASE = "http://localhost:8080"

const API_BASE_PROFILES = "http://localhost:8083"
//const API_BASE_PROFILES = "https://croworker.app"

export type UserRole = "USER" | "COMPANY"

export interface User {
  id: string
  email: string
  role: UserRole
  profileImageUrl?: string | null
}

/**
 * Enriches a User with profileImageUrl from the users service (8083)
 * profileImageUrl is at the top level of the profile response
 */
async function enrichWithProfileImage(user: User): Promise<User> {
  if (user.role !== "USER") return user
  try {
    const profileRes = await fetch(`${API_BASE_PROFILES}/api/users/me`, {
      credentials: "include",
    })
    if (profileRes.ok) {
      const profile = await profileRes.json()
      if (profile.profileImageUrl) {
        user.profileImageUrl = profile.profileImageUrl
      }
    }
  } catch {
    // Not critical, continue without image
  }
  return user
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
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  })

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(errorText || "Login failed")
  }

  const user = (await res.json()) as User
  return enrichWithProfileImage(user)
}

/**
 * REGISTER
 * - backend sends verification email, does NOT auto-login
 * - returns void; user must verify email before logging in
 */
export async function registerUser(
  email: string,
  password: string,
  role: UserRole
): Promise<void> {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, role }),
  })

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(errorText || "Registration failed")
  }
}


/**
 * RESTORE SESSION
 * - uses HttpOnly cookie automatically
 * - called on app boot / page refresh
 * - fetches profile image from users service (8083)
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const res = await fetch(`${API_BASE}/api/auth/me`, {
      credentials: "include",
    })

    if (!res.ok) return null
    const user = (await res.json()) as User
    return enrichWithProfileImage(user)
  } catch {
    return null
  }
}

/**
 * LOGOUT
 * - backend clears the HttpOnly cookie
 */
export async function logoutUser(): Promise<void> {
  await fetch(`${API_BASE}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  })
}

/**
 * CHANGE PASSWORD
 * TODO: Implement your backend endpoint
 * Expected endpoint: POST /auth/change-password
 * Expected body: { currentPassword, newPassword }
 */
export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<void> {
  const res = await fetch(`${API_BASE}/api/auth/change-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ currentPassword, newPassword }),
  })

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(errorText || "Failed to change password")
  }
}

/**
 * REQUEST PASSWORD RESET
 * TODO: Implement your backend endpoint
 * Expected endpoint: POST /auth/forgot-password
 * Expected body: { email }
 */
export async function requestPasswordReset(email: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  })

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(errorText || "Failed to send reset email")
  }
}

/**
 * DELETE ACCOUNT
 * TODO: Implement your backend endpoint
 * Expected endpoint: DELETE /auth/account
 */
export async function deleteAccount(): Promise<void> {
  const res = await fetch(`${API_BASE}/api/auth/account`, {
    method: "DELETE",
    credentials: "include",
  })

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(errorText || "Failed to delete account")
  }
}
