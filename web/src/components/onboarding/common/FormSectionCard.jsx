import React from 'react'
import { cn } from '@/lib/utils'

/**
 * FormSectionCard
 *
 * Premium white card wrapper for grouping form fields.
 *
 * @param {string}            title       – section heading
 * @param {string}            description – helper text below heading
 * @param {React.ElementType} icon        – Lucide icon component
 * @param {string}            className   – additional class overrides
 * @param {React.ReactNode}   children    – form fields rendered inside
 */
export default function FormSectionCard({
  title,
  description,
  icon: Icon,
  className,
  children,
}) {
  return (
    <section
      className={cn(
        'bg-white border border-[#E2E8D8] px-7 pt-6 pb-7 md:px-8 md:pt-7 md:pb-8 rounded-[20px]',
        className,
      )}
      style={{ boxShadow: '0 4px 20px rgba(14,64,50,0.03)' }}
    >
      {/* Section header */}
      {(title || Icon) && (
        <div className="flex items-start gap-3.5 mb-5">
          {Icon && (
            <div className="w-10 h-10 rounded-xl bg-[#0E4032]/8 text-[#0E4032] flex items-center justify-center shrink-0">
              <Icon className="w-[18px] h-[18px]" strokeWidth={2} />
            </div>
          )}
          <div className="pt-0.5">
            <h2 className="text-[17px] font-bold text-[#0E4032] tracking-tight leading-tight" style={{ fontFamily: "var(--font-koi-heading)" }}>
              {title}
            </h2>
            {description && (
              <p className="text-[13px] text-[#5A6B5A] mt-0.5 leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Form content */}
      {children}
    </section>
  )
}
