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
  type User,
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

  /**
   * Restore session on page refresh
   * Cookie is sent automatically
   */
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
      } finally {
        setIsLoading(false)
      }
    }

    restoreSession()
  }, [])

  /**
   * LOGIN
   */
  const login = useCallback(async (email: string, password: string) => {
    const user = await loginUser(email, password)
    setUser(user)
  }, [])

  /**
   * REGISTER
   */
  const register = useCallback(
    async (email: string, password: string, role: UserRole) => {
      const user = await registerUser(email, password, role)
      setUser(user)
    },
    []
  )

  /**
   * LOGOUT
   */
  const logout = useCallback(async () => {
    await logoutUser()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
