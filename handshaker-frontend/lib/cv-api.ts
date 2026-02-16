import type {
  PersonalInfo,
  LegalStatus,
  JobPreferences,
  Language,
  Accommodation,
  UserProfile,
  EmploymentCurrent,
} from "./cv-types"

// const API_BASE = "http://142.132.181.45:8083"
const API_BASE = "http://localhost:8083"

/**
 * Authenticated fetch
 * - JWT is sent automatically via HttpOnly cookie
 * - NO Authorization header needed
 * - credentials: "include" is required for cookies
 */
async function authFetch(url: string, options: RequestInit = {}) {
  const res = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  })

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Not authenticated")
    }
    const errorText = await res.text()
    throw new Error(errorText || "Request failed")
  }

  return res
}

export async function fetchProfile(): Promise<UserProfile> {
  const res = await authFetch(`${API_BASE}/users/me`)
  return res.json()
}

export async function savePersonalInfo(data: PersonalInfo) {
  return authFetch(`${API_BASE}/users/me/personal`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export async function saveLegalStatus(data: LegalStatus) {
  return authFetch(`${API_BASE}/users/me/legal`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export async function saveJobPreferences(data: JobPreferences) {
  return authFetch(`${API_BASE}/users/me/job-preferences`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export async function saveLanguages(data: Language[]) {
  return authFetch(`${API_BASE}/users/me/languages`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export async function saveAccommodation(data: Accommodation) {
  return authFetch(`${API_BASE}/users/me/accommodation`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export async function saveEmploymentCurrent(data: EmploymentCurrent) {
  return authFetch(`${API_BASE}/users/me/employment-current`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}
