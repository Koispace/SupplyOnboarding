"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, Save } from 'lucide-react'

/**
 * StepActionBar
 *
 * Sticky bottom bar with Back, Save Draft, Continue.
 * Premium docked footer with blur + shadow.
 */
export default function StepActionBar({
  onBack,
  onSaveDraft,
  onContinue,
  isFirstStep = false,
  isLastStep = false,
  submitLabel = 'Submit',
  isSaving = false,
}) {
  return (
    <div
      className="sticky bottom-0 z-30 w-full bg-white/80 backdrop-blur-md border-t border-[#E2E8D8]"
      style={{ boxShadow: '0 -4px 20px rgba(14,64,50,0.04)' }}
    >
      <div className="max-w-[1100px] mx-auto flex items-center justify-between px-6 md:px-10 py-4">
        {/* Left: Back */}
        <div>
          {!isFirstStep && (
            <Button
              type="button"
              variant="ghost"
              onClick={onBack}
              disabled={isSaving}
              className="text-[#5A6B5A] hover:text-[#0E4032] gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          )}
        </div>

        {/* Right: Save Draft + Continue */}
        <div className="flex items-center gap-3">
          {onSaveDraft && (
            <Button
              type="button"
              variant="outline"
              onClick={onSaveDraft}
              disabled={isSaving}
              className="border-[#E2E8D8] text-[#0E4032] hover:bg-[#EDF2E6] gap-2"
            >
              <Save className="w-4 h-4" />
              <span className="hidden sm:inline">Save Draft</span>
            </Button>
          )}

          <Button
            type="button"
            onClick={onContinue}
            disabled={isSaving}
            className="text-white gap-2 px-6 h-11 font-semibold rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
            style={{ background: "#0E4032", fontFamily: "var(--font-koi-body)" }}
          >
            {isLastStep ? submitLabel : 'Continue'}
            {!isLastStep && <ArrowRight className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
