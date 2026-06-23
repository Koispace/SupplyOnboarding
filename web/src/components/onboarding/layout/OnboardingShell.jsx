import React from 'react';
import { cn } from "@/lib/utils";

export default function OnboardingShell({ leftPanel, rightPanel, className }) {
  return (
    <div className={cn("flex flex-col lg:flex-row min-h-screen lg:h-screen bg-background text-foreground lg:overflow-hidden", className)}>
      {/* Left Panel - 44% on Desktop */}
      <div className="w-full lg:w-[44%] relative overflow-hidden flex flex-col p-6 md:p-8 lg:px-12 lg:py-8">
        {/* Molecular Background Pattern */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.15]"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, var(--color-primary) 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }}
        />
        <div className="relative z-10 flex-1 flex flex-col justify-center h-full">
          {leftPanel}
        </div>
      </div>

      {/* Right Panel - 56% on Desktop */}
      <div className="w-full lg:w-[56%] h-full flex items-center justify-center p-4 md:p-6 lg:px-8 lg:py-6 relative">
        <div className="w-full max-w-[600px] z-10 relative">
          {rightPanel}
        </div>
      </div>
    </div>
  );
}
