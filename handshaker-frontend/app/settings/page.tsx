"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Loader2, KeyRound, Trash2, Shield, Mail } from "lucide-react"
import { changePassword, deleteAccount } from "@/lib/auth"

export default function SettingsPage() {
  const { user, isLoading: authLoading, logout } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState("")
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const [deleteConfirmation, setDeleteConfirmation] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState("")

  // Redirect if not authenticated
  if (!authLoading && !user) {
    router.push("/auth?mode=login")
    return null
  }

  if (authLoading) {
    return (
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="size-5 animate-spin" />
          <span>{t("common.loading")}</span>
        </div>
      </main>
    )
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    setPasswordError("")
    setPasswordSuccess("")

    if (newPassword !== confirmPassword) {
      setPasswordError(t("settings.passwordMismatch"))
      return
    }

    if (newPassword.length < 8) {
      setPasswordError(t("settings.passwordTooShort"))
      return
    }

    setIsChangingPassword(true)
    try {
      await changePassword(currentPassword, newPassword)
      setPasswordSuccess(t("settings.passwordChanged"))
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : t("settings.passwordChangeFailed"))
    } finally {
      setIsChangingPassword(false)
    }
  }

  async function handleDeleteAccount() {
    if (deleteConfirmation !== "DELETE") {
      setDeleteError(t("settings.deleteConfirmError"))
      return
    }

    setIsDeleting(true)
    setDeleteError("")
    try {
      await deleteAccount()
      await logout()
      router.push("/")
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : t("settings.deleteFailed"))
      setIsDeleting(false)
    }
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-background py-8 px-4">
      <div className="mx-auto max-w-2xl space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("settings.title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("settings.subtitle")}</p>
        </div>

        {/* Account Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Mail className="size-5 text-muted-foreground" />
              {t("settings.accountInfo")}
            </CardTitle>
            <CardDescription>{t("settings.accountInfoDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground">{t("settings.email")}</Label>
              <p className="text-sm font-medium">{user?.email}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">{t("settings.accountType")}</Label>
              <p className="text-sm font-medium">
                {user?.role === "COMPANY" ? t("nav.companyAccount") : t("nav.userAccount")}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <KeyRound className="size-5 text-muted-foreground" />
              {t("settings.changePassword")}
            </CardTitle>
            <CardDescription>{t("settings.changePasswordDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">{t("settings.currentPassword")}</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">{t("settings.newPassword")}</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t("settings.confirmPassword")}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              {passwordError && (
                <p className="text-sm text-destructive">{passwordError}</p>
              )}
              {passwordSuccess && (
                <p className="text-sm text-green-600">{passwordSuccess}</p>
              )}

              <Button type="submit" disabled={isChangingPassword}>
                {isChangingPassword ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    {t("settings.changing")}
                  </>
                ) : (
                  t("settings.changePasswordBtn")
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-destructive">
              <Shield className="size-5" />
              {t("settings.dangerZone")}
            </CardTitle>
            <CardDescription>{t("settings.dangerZoneDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-2 size-4" />
                  {t("settings.deleteAccount")}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("settings.deleteAccountTitle")}</AlertDialogTitle>
                  <AlertDialogDescription className="space-y-4">
                    <span className="block">{t("settings.deleteAccountWarning")}</span>
                    <span className="block font-medium">
                      {t("settings.deleteAccountConfirmText")}
                    </span>
                    <Input
                      placeholder="DELETE"
                      value={deleteConfirmation}
                      onChange={(e) => setDeleteConfirmation(e.target.value)}
                      className="mt-2"
                    />
                    {deleteError && (
                      <span className="block text-sm text-destructive">{deleteError}</span>
                    )}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => {
                    setDeleteConfirmation("")
                    setDeleteError("")
                  }}>
                    {t("common.cancel")}
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    disabled={isDeleting || deleteConfirmation !== "DELETE"}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        {t("settings.deleting")}
                      </>
                    ) : (
                      t("settings.deleteAccountBtn")
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
