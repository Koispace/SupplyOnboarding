"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShieldCheck, FileText, TrendingUp, Droplet, Clock, Cloud, Info, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import OnboardingShell from '../layout/OnboardingShell';
import BenefitCard from '../common/BenefitCard';
import DocumentChecklist from '../common/DocumentChecklist';
import { useOnboardingStore } from '@/store/onboardingStore';

export default function Step0Welcome() {
  const router = useRouter();
  const nextStep = useOnboardingStore((state) => state.nextStep);

  const handleStart = () => {
    nextStep();
    router.push('/onboarding/step-1');
  };

  const leftPanel = (
    <motion.div 
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45 }}
      className="flex flex-col h-full"
    >
      <div className="flex items-center gap-2 text-primary font-bold text-xl mb-10">
        <Droplet className="w-6 h-6 fill-current" />
        <span>KOI Health-first Commerce</span>
      </div>

      <div className="mb-8">
        <h1 className="text-[36px] lg:text-[40px] leading-[1.08] font-display font-bold text-primary mb-4 tracking-tight">
          Join KOI Supplier Network
        </h1>
        <p className="text-lg text-muted max-w-[90%] leading-relaxed">
          Get your products listed on India's most trusted health-first quick commerce platform.
        </p>
      </div>

      <div className="mt-4 max-w-[480px]">
        <BenefitCard 
          icon={ShieldCheck}
          title="Trusted Health Verification"
          description="AI + expert review ensures only quality products get approved."
          delay={0.1}
        />
        <BenefitCard 
          icon={FileText}
          title="Smart Label Extraction"
          description="Upload packaging once. KOI auto-fills product data."
          delay={0.2}
        />
        <BenefitCard 
          icon={TrendingUp}
          title="Reach High-Intent Buyers"
          description="Sell to health-conscious consumers seeking better alternatives."
          delay={0.3}
        />
      </div>
    </motion.div>
  );

  const rightPanel = (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="bg-card rounded-2xl shadow-sm border border-border p-6 md:p-8 w-full flex flex-col"
    >
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <Badge variant="secondary" className="bg-[#F5F2F7] text-primary hover:bg-[#EBE6EF] flex items-center gap-1.5 py-1.5 px-3 rounded-full font-medium border-0">
          <Clock className="w-3.5 h-3.5" />
          10–15 mins
        </Badge>
        <Badge variant="secondary" className="bg-[#F5F2F7] text-primary hover:bg-[#EBE6EF] flex items-center gap-1.5 py-1.5 px-3 rounded-full font-medium border-0">
          <Cloud className="w-3.5 h-3.5" />
          Auto-save enabled
        </Badge>
      </div>

      <h2 className="text-[32px] md:text-[40px] leading-[1.1] font-display font-bold text-primary mb-1.5 tracking-tight">
        Before you begin
      </h2>
      <p className="text-[17px] text-muted mb-6">
        Keep these details ready for a smooth onboarding process.
      </p>

      <div className="flex flex-col sm:flex-row gap-6 mb-6">
        <div className="flex-1">
          <h3 className="text-xs font-bold text-muted uppercase tracking-wider mb-5">Required Documents</h3>
          <DocumentChecklist 
            type="required"
            items={[
              { label: "GST certificate" },
              { label: "FSSAI license" },
              { label: "Product packaging images" },
              { label: "Ingredient & Nutrition labels" }
            ]}
          />
        </div>

        {/* Separator */}
        <div className="hidden sm:block w-0 border-l-[2px] border-dotted border-border" />

        <div className="flex-1 pt-6 sm:pt-0 border-t-[2px] border-dotted border-border sm:border-0">
          <h3 className="text-xs font-bold text-muted uppercase tracking-wider mb-5">Optional</h3>
          <DocumentChecklist 
            type="optional"
            items={[
              { label: "Lab certifications", hint: "(increases trust score)" },
              { label: "Brand assets / story" }
            ]}
          />
        </div>
      </div>

      <Button onClick={handleStart} size="lg" className="w-full bg-primary hover:bg-primary/90 text-white h-[56px] text-[17px] font-semibold rounded-[14px] group relative overflow-hidden transition-all shadow-md hover:shadow-lg mt-2">
        <span className="relative z-10 flex items-center justify-center gap-2">
          Start onboarding
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </span>
      </Button>

      <div className="flex items-center justify-center gap-2 mt-6 text-sm text-muted text-center">
        <Info className="w-4 h-4 shrink-0" />
        <p>You can save progress and continue anytime.</p>
      </div>
    </motion.div>
  );

  return (
    <OnboardingShell leftPanel={leftPanel} rightPanel={rightPanel} />
  );
}
