"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  CheckCircle2,
  Cpu,
  UserCheck,
  Rocket,
  Clock,
  ArrowLeft,
  Mail,
} from 'lucide-react'

/* ────────────────────────────────────────────────
 *  Timeline data
 * ──────────────────────────────────────────────── */
const TIMELINE = [
  {
    title: 'Submitted',
    status: 'completed',
    icon: CheckCircle2,
    text: 'Your onboarding details have been securely submitted.',
  },
  {
    title: 'AI Verification in Progress',
    status: 'active',
    icon: Cpu,
    text: 'Our verification engine is reviewing your brand, certifications, and product claims for completeness and compliance.',
  },
  {
    title: 'Expert Review',
    status: 'pending',
    icon: UserCheck,
    text: "Once verification is complete, KOI's health and compliance team will assess your submission for quality, trust, and marketplace fit.",
  },
  {
    title: 'Approval & Go Live',
    status: 'pending',
    icon: Rocket,
    text: "If approved, we'll contact you with onboarding confirmation and dashboard access.",
  },
]

/* ════════════════════════════════════════════════
 *  SubmissionSuccess
 * ════════════════════════════════════════════════ */
export default function SubmissionSuccess() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div
        className="w-full max-w-3xl bg-card rounded-3xl px-8 md:px-12 py-12"
        style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.06)' }}
      >

        {/* ─── Success Header ────────────── */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-16 h-16 rounded-full bg-success/12 flex items-center justify-center mb-5">
            <CheckCircle2 className="w-8 h-8 text-success" strokeWidth={2} />
          </div>
          <h1 className="text-2xl md:text-[28px] font-display font-bold text-foreground tracking-tight leading-tight">
            Submission Received Successfully 🎉
          </h1>
          <p className="text-sm text-muted mt-2 max-w-md leading-relaxed">
            Thank you for completing KOI supplier onboarding.
          </p>
        </div>

        {/* ─── Status Timeline ───────────── */}
        <div
          className="bg-[#FDFCFA] border border-[#E5E7EB] rounded-2xl px-6 md:px-8 py-7 mb-6"
          style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.02)' }}
        >
          <div className="space-y-0">
            {TIMELINE.map((item, idx) => (
              <TimelineItem
                key={item.title}
                {...item}
                isLast={idx === TIMELINE.length - 1}
              />
            ))}
          </div>
        </div>

        {/* ─── Review ETA ────────────────── */}
        <div
          className="flex items-center gap-4 bg-primary/[0.06] border border-primary/10 rounded-xl px-5 py-4 mb-10"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Clock className="w-[18px] h-[18px]" strokeWidth={2} />
          </div>
          <div>
            <p className="text-[13px] text-muted mb-0.5">Expected Review Time</p>
            <p className="text-lg font-display font-bold text-foreground tracking-tight">
              24–72 Hours
            </p>
            <p className="text-[12px] text-muted mt-0.5">
              Review time may vary based on documentation completeness.
            </p>
          </div>
        </div>

        {/* ─── Closing Message ────────────── */}
        <div className="text-center mb-8">
          <h2 className="text-lg md:text-xl font-display font-bold text-foreground tracking-tight leading-snug">
            Building healthier choices for India starts with brands like yours.
          </h2>
          <p className="text-sm text-muted mt-2">
            Thank you for choosing trust, transparency, and better nutrition.
          </p>
        </div>

        {/* ─── CTAs ──────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            onClick={() => router.push('/')}
            className="bg-primary hover:bg-primary/90 text-white gap-2 px-8 h-11 font-semibold rounded-xl shadow-sm hover:shadow-md transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
          <Button
            variant="ghost"
            onClick={() => window.open('mailto:support@koi.health', '_blank')}
            className="text-muted hover:text-foreground gap-2"
          >
            <Mail className="w-4 h-4" />
            Contact Support
          </Button>
        </div>

      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────
 *  Timeline item (internal)
 * ──────────────────────────────────────────────── */
function TimelineItem({ title, status, icon: Icon, text, isLast }) {
  const isCompleted = status === 'completed'
  const isActive = status === 'active'

  return (
    <div className="flex gap-4">
      {/* Left: node + connector */}
      <div className="flex flex-col items-center">
        <div
          className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all',
            isCompleted && 'bg-success/15 text-success',
            isActive && 'bg-primary/12 text-primary animate-pulse',
            !isCompleted && !isActive && 'bg-[#E5E7EB] text-muted',
          )}
        >
          <Icon className="w-4 h-4" strokeWidth={2} />
        </div>
        {!isLast && (
          <div
            className={cn(
              'w-0.5 flex-1 min-h-[32px] my-1.5',
              isCompleted ? 'bg-success/30' : 'bg-[#E5E7EB]',
            )}
          />
        )}
      </div>

      {/* Right: content */}
      <div className={cn('pb-6', isLast && 'pb-0')}>
        <h3
          className={cn(
            'text-[15px] font-semibold tracking-tight leading-tight',
            isCompleted && 'text-success',
            isActive && 'text-primary',
            !isCompleted && !isActive && 'text-muted',
          )}
        >
          {title}
        </h3>
        <p className="text-[13px] text-muted mt-1 leading-relaxed max-w-lg">
          {text}
        </p>
      </div>
    </div>
  )
}
