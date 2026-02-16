"use client"

import type { LucideIcon } from "lucide-react"
import { ChevronDown } from "lucide-react"

interface ProfileSectionProps {
  title: string
  description: string
  icon: LucideIcon
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
}

export function ProfileSection({
  title,
  description,
  icon: Icon,
  isOpen,
  onToggle,
  children,
}: ProfileSectionProps) {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-muted/50"
      >
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="size-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-card-foreground">
              {title}
            </h3>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
        <ChevronDown
          className={`size-5 text-muted-foreground transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="border-t border-border p-5">
          {children}
        </div>
      )}
    </div>
  )
}
