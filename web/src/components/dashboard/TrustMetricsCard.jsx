import React from 'react'

export default function TrustMetricsCard({ metrics }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] h-full">
      <h2 className="text-xl font-display font-bold text-[#111827] mb-6" style={{ fontFamily: "var(--font-koi-heading)" }}>
        Trust Metrics
      </h2>
      <div className="space-y-5">
        {metrics.map((metric, idx) => {
          let colorClass = 'bg-[#0E4032]'
          if (metric.score >= 90) colorClass = 'bg-green-500'
          else if (metric.score < 80) colorClass = 'bg-red-500'
          else if (metric.score < 90 && metric.score >= 80) colorClass = 'bg-green-400'

          return (
            <div key={idx} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-semibold text-[#111827]">
                  {metric.label}
                </span>
                <span className="text-[14px] font-bold text-[#6B7280]">
                  {metric.score}%
                </span>
              </div>
              <div className="h-2 w-full bg-[#E5E7EB]/50 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${colorClass} rounded-full transition-all duration-1000 ease-out`}
                  style={{ width: `${metric.score}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
