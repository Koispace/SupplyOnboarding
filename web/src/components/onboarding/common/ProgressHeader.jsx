"use client"

import React from 'react'
import { Loader2, CheckCircle2 } from 'lucide-react'

/**
 * ProgressHeader
 *
 * Compact premium onboarding header.
 *
 * Layout:
 *   Top-left:   Step X of Y         Top-right:  Save status
 *   Title (large)
 *   Subtitle (muted)
 *   Progress bar (animated fill)
 */
export default function ProgressHeader({
  step = 1,
  totalSteps = 6,
  title,
  subtitle,
  saveStatus = 'idle',
}) {
  const progressPercent = Math.round((step / totalSteps) * 100)

  return (
    <header className="w-full bg-card border-b border-border px-6 md:px-10 pt-4 pb-4">
      {/* Top row */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-semibold text-muted tracking-widest uppercase">
          Step {step} of {totalSteps}
        </span>
        <SaveIndicator status={saveStatus} />
      </div>

      {/* Title */}
      <h1 className="text-xl md:text-[26px] font-display font-bold text-foreground tracking-tight leading-tight">
        {title}
      </h1>
      {subtitle && (
        <p className="text-sm text-muted mt-0.5 max-w-xl leading-relaxed">
          {subtitle}
        </p>
      )}

      {/* Progress bar */}
      <div className="mt-4 w-full h-[5px] rounded-full bg-[#E5E7EB] overflow-hidden">
        <div
          className="h-full rounded-full bg-[#0E4032] transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </header>
  )
}

/* ────────────────────────────────────────────────
 *  Save indicator (internal)
 * ──────────────────────────────────────────────── */
function SaveIndicator({ status }) {
  const map = {
    idle: null,
    saving: (
      <span className="flex items-center gap-1.5 text-xs text-muted animate-pulse">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        Saving…
      </span>
    ),
    saved: (
      <span className="flex items-center gap-1.5 text-xs text-success">
        <CheckCircle2 className="w-3.5 h-3.5" />
        Saved just now
      </span>
    ),
    error: (
      <span className="flex items-center gap-1.5 text-xs text-danger">
        Save failed
      </span>
    ),
  }

  return map[status] ?? null
}
