import { getToken } from "./auth"
import type {
  PersonalInfo,
  LegalStatus,
  JobPreferences,
  Language,
  Accommodation,
} from "./cv-types"

const API_BASE = "http://localhost:8083"

async function authFetch(url: string, options: RequestInit = {}) {
  const token = getToken()
  if (!token) throw new Error("Not authenticated")

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  })

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(errorText || "Request failed")
  }

  return res
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
