"use client"

import React from 'react'
import { cn } from '@/lib/utils'

/**
 * InfoBanner
 *
 * Soft contextual banner with a left accent border.
 * Used to surface trust / guidance messaging.
 *
 * @param {string}            title       – bold heading
 * @param {string}            description – supporting copy
 * @param {React.ElementType} icon        – Lucide icon component
 * @param {string}            className   – additional class overrides
 */
export default function InfoBanner({ title, description, icon: Icon, className }) {
  return (
    <div
      className={cn(
        'flex items-start gap-4 rounded-xl border-l-4 border-primary bg-primary/[0.06] px-5 py-4',
        className,
      )}
      style={{ boxShadow: '0 2px 12px rgba(79,56,99,0.06)' }}
    >
      {Icon && (
        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
          <Icon className="w-[18px] h-[18px]" strokeWidth={2} />
        </div>
      )}
      <div className="min-w-0">
        {title && (
          <h3 className="text-[15px] font-display font-bold text-foreground tracking-tight leading-snug">
            {title}
          </h3>
        )}
        {description && (
          <p className="text-[13px] text-muted mt-0.5 leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  )
}
