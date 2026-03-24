"use client"

import type React from "react"
import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Loader2, X, User } from "lucide-react"
import { uploadProfilePicture } from "@/lib/cv-api"

interface ProfilePictureUploadProps {
  currentUrl: string | null
  onUploaded: (url: string) => void
  onRemove: () => void
  initials?: string
  size?: "sm" | "md" | "lg"
}

export function ProfilePictureUpload({
  currentUrl,
  onUploaded,
  onRemove,
  initials = "",
  size = "lg",
}: ProfilePictureUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState("")
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const sizeClasses = {
    sm: "size-16",
    md: "size-24",
    lg: "size-32",
  }

  const displayUrl = previewUrl || currentUrl

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB")
      return
    }

    setError("")

    // Show preview immediately
    const localPreview = URL.createObjectURL(file)
    setPreviewUrl(localPreview)

    try {
      setIsUploading(true)
      const uploadedUrl = await uploadProfilePicture(file)
      onUploaded(uploadedUrl)
      setPreviewUrl(null) // Clear preview, use actual URL now
    } catch {
      setError("Upload failed. Please try again.")
      setPreviewUrl(null)
    } finally {
      setIsUploading(false)
      // Clean up local preview URL
      URL.revokeObjectURL(localPreview)
    }
  }

  function handleRemove() {
    setPreviewUrl(null)
    onRemove()
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <Avatar className={`${sizeClasses[size]} border-2 border-border`}>
          {displayUrl ? (
            <AvatarImage src={displayUrl} alt="Profile picture" />
          ) : null}
          <AvatarFallback className="bg-muted text-muted-foreground">
            {initials ? (
              <span className="text-xl font-semibold">{initials}</span>
            ) : (
              <User className="size-8" />
            )}
          </AvatarFallback>
        </Avatar>

        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-background/80">
            <Loader2 className="size-6 animate-spin text-primary" />
          </div>
        )}

        {displayUrl && !isUploading && (
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -right-1 -top-1 size-6 rounded-full"
            onClick={handleRemove}
          >
            <X className="size-3" />
          </Button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        className="gap-2 bg-transparent"
      >
        <Camera className="size-4" />
        {displayUrl ? "Change Photo" : "Upload Photo"}
      </Button>

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
