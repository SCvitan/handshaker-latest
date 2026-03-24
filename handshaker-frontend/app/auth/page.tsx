"use client"

import React from "react"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { useLanguage } from "@/components/language-provider"
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
import { FileText, Loader2, User, Building2, ArrowLeft, MailCheck } from "lucide-react"
import type { UserRole } from "@/lib/auth"
import { requestPasswordReset } from "@/lib/auth"

export default function AuthPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, login, register } = useAuth()
  const { t } = useLanguage()

  const [mode, setMode] = useState<"login" | "register" | "forgot-password">(
    searchParams.get("mode") === "register" ? "register" : "login"
  )
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<UserRole>("USER")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const [registerSent, setRegisterSent] = useState(false)

  useEffect(() => {
    if (user && !isSubmitting) {
      router.push("/")
    }
  }, [user, isSubmitting, router])

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
        router.push("/")
      } else if (mode === "register") {
        await register(email, password, role)
        setRegisterSent(true)
        setIsSubmitting(false)
      } else if (mode === "forgot-password") {
        await requestPasswordReset(email)
        setResetSent(true)
        setIsSubmitting(false)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.error"))
      setIsSubmitting(false)
    }
  }

  const toggleMode = () => {
    const newMode = mode === "login" ? "register" : "login"
    setMode(newMode)
    setError("")
    router.replace(`/auth?mode=${newMode}`)
  }

  const goToForgotPassword = () => {
    setMode("forgot-password")
    setError("")
    setResetSent(false)
  }

  const goBackToLogin = () => {
    setMode("login")
    setError("")
    setResetSent(false)
    router.replace("/auth?mode=login")
  }

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
            {(mode === "forgot-password" && resetSent) || registerSent
              ? <MailCheck className="size-5" />
              : <FileText className="size-5" />
            }
          </div>
          <CardTitle className="text-2xl">
            {registerSent
              ? t("auth.checkYourEmail")
              : mode === "login"
              ? t("auth.welcomeBack")
              : mode === "register"
              ? t("auth.createAccount")
              : resetSent
              ? t("auth.checkYourEmail")
              : t("auth.resetPassword")}
          </CardTitle>
          <CardDescription>
            {registerSent
              ? t("auth.verifyEmailSent") + " " + email
              : mode === "login"
              ? t("auth.loginSubtitle")
              : mode === "register"
              ? t("auth.registerSubtitle")
              : resetSent
              ? t("auth.resetEmailSent") + " " + email
              : t("auth.resetSubtitle")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Register verification email sent */}
          {registerSent ? (
            <div className="flex flex-col gap-4">
              <p className="text-center text-sm text-muted-foreground">
                {t("auth.verifyEmailHint")}
              </p>
              <Button variant="outline" className="w-full" onClick={() => {
                setRegisterSent(false)
                setMode("login")
                router.replace("/auth?mode=login")
              }}>
                <ArrowLeft className="mr-2 size-4" />
                {t("auth.backToLogin")}
              </Button>
            </div>
          ) : mode === "forgot-password" && resetSent ? (
            <div className="flex flex-col gap-4">
              <Button variant="outline" className="w-full" onClick={goBackToLogin}>
                <ArrowLeft className="mr-2 size-4" />
                {t("auth.backToLogin")}
              </Button>
            </div>
          ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {mode === "register" && (
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium">{t("auth.accountType")}</Label>
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
                    <span className="text-sm font-medium">{t("auth.user")}</span>
                    <span className="text-xs text-muted-foreground">
                      {t("auth.personalAccount")}
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
                    <span className="text-sm font-medium">{t("auth.company")}</span>
                    <span className="text-xs text-muted-foreground">
                      {t("auth.businessAccount")}
                    </span>
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <Label htmlFor="email">{t("auth.email")}</Label>
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

            {mode !== "forgot-password" && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">{t("auth.password")}</Label>
                  {mode === "login" && (
                    <button
                      type="button"
                      onClick={goToForgotPassword}
                      className="text-xs text-primary underline-offset-4 hover:underline"
                    >
                      {t("auth.forgotPassword")}
                    </button>
                  )}
                </div>
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
            )}

            {error && (
              <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  {mode === "login"
                    ? t("auth.loggingIn")
                    : mode === "register"
                    ? t("auth.creatingAccount")
                    : t("auth.sendingReset")}
                </>
              ) : mode === "login" ? (
                t("nav.logIn")
              ) : mode === "register" ? (
                t("auth.createAccount")
              ) : (
                t("auth.sendResetLink")
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              {mode === "login" ? (
                <>
                  {t("auth.noAccount") + " "}
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="font-medium text-primary underline-offset-4 hover:underline"
                  >
                    {t("nav.register")}
                  </button>
                </>
              ) : mode === "register" ? (
                <>
                  {t("auth.alreadyHaveAccount") + " "}
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="font-medium text-primary underline-offset-4 hover:underline"
                  >
                    {t("nav.logIn")}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={goBackToLogin}
                  className="inline-flex items-center gap-1 font-medium text-primary underline-offset-4 hover:underline"
                >
                  <ArrowLeft className="size-3" />
                  {t("auth.backToLogin")}
                </button>
              )}
            </p>
          </form>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
