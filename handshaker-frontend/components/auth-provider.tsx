"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react"
import {
  type UserRole,
  getToken,
  getUser,
  saveToken,
  removeToken,
  loginUser,
  registerUser,
} from "@/lib/auth"

interface User {
  id: string
  email: string
  role: UserRole
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, role: UserRole) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const existingUser = getUser()
    if (existingUser) {
      const token = getToken()
      if (token) {
        try {
          const base64Url = token.split(".")[1]
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
          const payload = JSON.parse(
            decodeURIComponent(
              atob(base64)
                .split("")
                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
            )
          )
          setUser({
            id: existingUser.id,
            role: existingUser.role,
            email: payload.email || payload.sub?.split("@")[0] || "",
          })
        } catch {
          setUser(existingUser)
        }
      }
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const data = await loginUser(email, password)
    saveToken(data.token)
    const decoded = getUser()
    if (decoded) {
      setUser({ ...decoded, email })
    }
  }, [])

  const register = useCallback(
    async (email: string, password: string, role: UserRole) => {
      const data = await registerUser(email, password, role)
      saveToken(data.token)
      const decoded = getUser()
      if (decoded) {
        setUser({ ...decoded, email })
      }
    },
    []
  )

  const logout = useCallback(() => {
    removeToken()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
