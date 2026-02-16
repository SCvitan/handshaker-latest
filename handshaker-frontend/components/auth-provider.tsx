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
  type User,
  type UserRole,
  loginUser,
  registerUser,
  getCurrentUser,
  logoutUser,
} from "@/lib/auth"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, role: UserRole) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Restore session from HttpOnly cookie on mount
  useEffect(() => {
    getCurrentUser()
      .then((u) => setUser(u))
      .finally(() => setIsLoading(false))
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const u = await loginUser(email, password)
    setUser(u)
  }, [])

  const register = useCallback(
    async (email: string, password: string, role: UserRole) => {
      const u = await registerUser(email, password, role)
      setUser(u)
    },
    []
  )

  const logout = useCallback(async () => {
    await logoutUser()
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
