"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/store/onboardingStore";
import Step0Welcome from "@/components/onboarding/steps/Step0Welcome";
import { getSupabaseClient } from "@/lib/supabase/client";

export default function OnboardingPage() {
  const router = useRouter();
  const currentStep = useOnboardingStore((state) => state.currentStep);
  const loadDraft = useOnboardingStore((state) => state.loadDraft);
  const [isHydrating, setIsHydrating] = useState(true);

  useEffect(() => {
    async function hydrateDraft() {
      const draftId = localStorage.getItem('koi_onboarding_draft_id');
      if (draftId) {
        try {
          const supabase = getSupabaseClient();
          const { data, error } = await supabase
            .from('onboarding_submissions')
            .select('*')
            .eq('id', draftId)
            .single();

          if (!error && data) {
            loadDraft(data);
            
            // Redirect to appropriate step if a draft exists and we are not on welcome
            // In a full implementation we'd track the exact last step, but for now we route to step-1
            router.push('/onboarding/step-1');
          }
        } catch (err) {
          console.error("Failed to load draft:", err);
        }
      }
      setIsHydrating(false);
    }
    
    hydrateDraft();
  }, [loadDraft]);

  if (isHydrating) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <>
      {currentStep === 'welcome' && <Step0Welcome />}
      {currentStep !== 'welcome' && (
        <div className="flex flex-col min-h-screen">
          <main className="flex-1 flex flex-col items-center justify-center p-6">
            <h1 className="text-3xl font-display font-bold text-primary">Step: {currentStep}</h1>
            <p className="text-muted mt-2">Implementation pending.</p>
          </main>
        </div>
      )}
    </>
  );
}
