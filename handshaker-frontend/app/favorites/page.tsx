"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { ProfileDetailSheet } from "@/components/search-profiles/profile-detail-sheet"
import { getFavorites, removeFromFavorites, fetchProfileById } from "@/lib/cv-api"
import type { ProfileSummary, UserProfile } from "@/lib/cv-types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Loader2, MapPin, Briefcase, X } from "lucide-react"

function FavoriteCard({
  profile,
  onCardClick,
  onRemove,
  isRemoving,
}: {
  profile: ProfileSummary
  onCardClick: (profile: ProfileSummary) => void
  onRemove: (id: string) => void
  isRemoving: boolean
}) {
  const initials =
    `${profile.firstName?.[0] ?? ""}${profile.lastName?.[0] ?? ""}`.toUpperCase() || "?"

  return (
    <Card
      className="group cursor-pointer transition-shadow hover:shadow-md"
      onClick={() => onCardClick(profile)}
    >
      <CardContent className="flex items-start gap-4 p-4">
        <Avatar className="size-14 shrink-0">
          <AvatarImage src={profile.profileImageUrl ?? undefined} alt={`${profile.firstName} ${profile.lastName}`} />
          <AvatarFallback className="text-base font-semibold">{initials}</AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <p className="font-semibold text-foreground leading-tight">
            {profile.firstName || profile.lastName
              ? `${profile.firstName ?? ""} ${profile.lastName ?? ""}`.trim()
              : "Unknown"}
          </p>
          {profile.profession && (
            <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              <Briefcase className="size-3.5 shrink-0" />
              <span className="truncate">{profile.profession}</span>
            </div>
          )}
          {profile.countryOfResidence && (
            <div className="mt-0.5 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="size-3.5 shrink-0" />
              <span className="truncate">{profile.countryOfResidence}</span>
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          disabled={isRemoving}
          onClick={(e) => {
            e.stopPropagation()
            onRemove(profile.id)
          }}
        >
          {isRemoving ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <X className="size-4" />
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

export default function FavoritesPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  const [favorites, setFavorites] = useState<ProfileSummary[]>([])
  const [isFetching, setIsFetching] = useState(true)
  const [removingId, setRemovingId] = useState<string | null>(null)

  // Sheet state — holds full UserProfile loaded on demand
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [isLoadingProfile, setIsLoadingProfile] = useState(false)

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "COMPANY")) {
      router.push("/")
    }
  }, [user, isLoading, router])

  const fetchFavoritesList = useCallback(async () => {
    setIsFetching(true)
    try {
      const data = await getFavorites()
      setFavorites(data)
    } catch (err) {
      console.error("Failed to fetch favorites:", err)
    } finally {
      setIsFetching(false)
    }
  }, [])

  useEffect(() => {
    if (user?.role === "COMPANY") {
      fetchFavoritesList()
    }
  }, [user, fetchFavoritesList])

  const handleCardClick = async (summary: ProfileSummary) => {
    setIsLoadingProfile(true)
    setSheetOpen(true)
    try {
      const fullProfile = await fetchProfileById(summary.id)
      setSelectedProfile(fullProfile)
    } catch (err) {
      console.error("Failed to load profile:", err)
      setSheetOpen(false)
    } finally {
      setIsLoadingProfile(false)
    }
  }

  const handleRemove = async (id: string) => {
    setRemovingId(id)
    try {
      await removeFromFavorites(id)
      setFavorites((prev) => prev.filter((f) => f.id !== id))
    } catch (err) {
      console.error("Failed to remove favorite:", err)
    } finally {
      setRemovingId(null)
    }
  }

  const handleSheetClose = (open: boolean) => {
    setSheetOpen(open)
    if (!open) setSelectedProfile(null)
  }

  // After removing from sheet, re-fetch and close
  const handleFavoriteChange = () => {
    fetchFavoritesList()
    setSheetOpen(false)
    setSelectedProfile(null)
  }

  if (isLoading || !user || user.role !== "COMPANY") {
    return (
      <>
        <div className="flex min-h-[80vh] items-center justify-center">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Loader2 className="size-6 animate-spin" />
            <span>Loading...</span>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="min-h-[calc(100vh-4rem)] bg-muted/30">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">

          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-1">
              <Heart className="size-6 text-primary fill-primary" />
              <h1 className="text-2xl font-bold text-foreground">Favorite Profiles</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              {isFetching
                ? "Loading..."
                : favorites.length === 0
                ? "You have not added any profiles to favorites yet."
                : `${favorites.length} saved profile${favorites.length !== 1 ? "s" : ""}`}
            </p>
          </div>

          {/* Loading state */}
          {isFetching ? (
            <div className="flex items-center justify-center py-16">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Loader2 className="size-6 animate-spin" />
                <span>Loading favorites...</span>
              </div>
            </div>
          ) : favorites.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Heart className="size-14 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No favorites yet</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                Open any profile from the search page and click the heart button to save it here.
              </p>
              <Button onClick={() => router.push("/search-profiles")}>
                Search Profiles
              </Button>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {favorites.map((profile) => (
                <FavoriteCard
                  key={profile.id}
                  profile={profile}
                  onCardClick={handleCardClick}
                  onRemove={handleRemove}
                  isRemoving={removingId === profile.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Profile detail sheet — shows spinner while full profile loads */}
      {isLoadingProfile && sheetOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Loader2 className="size-6 animate-spin" />
            <span>Loading profile...</span>
          </div>
        </div>
      ) : (
        <ProfileDetailSheet
          profile={selectedProfile}
          open={sheetOpen}
          onOpenChange={handleSheetClose}
          isFavorite={true}
          onFavoriteChange={handleFavoriteChange}
        />
      )}
    </>
  )
}
