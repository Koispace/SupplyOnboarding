import React from 'react'
import { CheckCircle2, Circle } from 'lucide-react'

export default function DocumentChecklist({ items, type = "required" }) {
  return (
    <div className="space-y-2.5 w-full">
      {items.map((item, index) => (
        <div
          key={index}
          className="flex items-start gap-3 pb-2 border-b border-[#E2E8D8] last:border-0 last:pb-0"
        >
          {type === "required" ? (
            <CheckCircle2 className="w-4 h-4 text-[#2D7A5E] shrink-0 mt-0.5" />
          ) : (
            <Circle className="w-4 h-4 text-[#5A6B5A] shrink-0 mt-0.5" />
          )}

          <div className="flex flex-col">
            <span className="text-[14px] font-normal text-[#0E4032]">
              {item.label}
            </span>

            {item.hint && (
              <span className="text-[12px] text-[#5A6B5A] mt-0.5">
                {item.hint}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}