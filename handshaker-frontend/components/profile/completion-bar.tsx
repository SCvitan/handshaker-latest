"use client"

import { CheckCircle2 } from "lucide-react"

interface ProfileCompletionBarProps {
  completion: number
}

export function ProfileCompletionBar({
  completion,
}: ProfileCompletionBarProps) {
  const percent = Math.round(completion * 100)

  const getColor = () => {
    if (percent >= 80) return "bg-emerald-500"
    if (percent >= 50) return "bg-amber-500"
    return "bg-red-500"
  }

  const getTextColor = () => {
    if (percent >= 80) return "text-emerald-600"
    if (percent >= 50) return "text-amber-600"
    return "text-red-600"
  }

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className={`size-5 ${getTextColor()}`} />
          <span className="text-sm font-semibold text-card-foreground">
            Profile Completion
          </span>
        </div>
        <span className={`text-lg font-bold ${getTextColor()}`}>
          {percent}%
        </span>
      </div>
      <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${getColor()}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        {percent === 100
          ? "Your profile is complete!"
          : `Fill in the remaining sections to reach 100%.`}
      </p>
    </div>
  )
}
