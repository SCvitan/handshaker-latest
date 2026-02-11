"use client"

import React from "react"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FileText, Loader2, User, Building2 } from "lucide-react"
import type { UserRole } from "@/lib/auth"

export default function AuthPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, login, register } = useAuth()

  const [mode, setMode] = useState<"login" | "register">(
    searchParams.get("mode") === "register" ? "register" : "login"
  )
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<UserRole>("USER")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (user) {
      router.push("/")
    }
  }, [user, router])

  useEffect(() => {
    const modeParam = searchParams.get("mode")
    if (modeParam === "register" || modeParam === "login") {
      setMode(modeParam)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      if (mode === "login") {
        await login(email, password)
      } else {
        await register(email, password, role)
      }
      router.push("/")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleMode = () => {
    const newMode = mode === "login" ? "register" : "login"
    setMode(newMode)
    setError("")
    router.replace(`/auth?mode=${newMode}`)
  }

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <FileText className="size-5" />
          </div>
          <CardTitle className="text-2xl">
            {mode === "login" ? "Welcome back" : "Create an account"}
          </CardTitle>
          <CardDescription>
            {mode === "login"
              ? "Log in to your CVBuilder account"
              : "Sign up to start building your professional CV"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {mode === "register" && (
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium">Account type</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("USER")}
                    className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors ${
                      role === "USER"
                        ? "border-primary bg-primary/5 text-foreground"
                        : "border-border bg-card text-muted-foreground hover:border-muted-foreground/30"
                    }`}
                  >
                    <User className="size-6" />
                    <span className="text-sm font-medium">User</span>
                    <span className="text-xs text-muted-foreground">
                      Personal account
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("COMPANY")}
                    className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors ${
                      role === "COMPANY"
                        ? "border-primary bg-primary/5 text-foreground"
                        : "border-border bg-card text-muted-foreground hover:border-muted-foreground/30"
                    }`}
                  >
                    <Building2 className="size-6" />
                    <span className="text-sm font-medium">Company</span>
                    <span className="text-xs text-muted-foreground">
                      Business account
                    </span>
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={mode === "login" ? "current-password" : "new-password"}
              />
            </div>

            {error && (
              <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  {mode === "login" ? "Logging in..." : "Creating account..."}
                </>
              ) : mode === "login" ? (
                "Log in"
              ) : (
                "Create account"
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              {mode === "login" ? (
                <>
                  {"Don't have an account? "}
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="font-medium text-primary underline-offset-4 hover:underline"
                  >
                    Register
                  </button>
                </>
              ) : (
                <>
                  {"Already have an account? "}
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="font-medium text-primary underline-offset-4 hover:underline"
                  >
                    Log in
                  </button>
                </>
              )}
            </p>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
