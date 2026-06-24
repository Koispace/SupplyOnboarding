"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function RecentProductsTable({ products }) {
  const router = useRouter()

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden h-full flex flex-col">
      <div className="flex items-center justify-between p-6 border-b border-[#E5E7EB]">
        <h2 className="text-xl font-display font-bold text-[#111827]" style={{ fontFamily: "var(--font-koi-heading)" }}>
          Recent Products
        </h2>
        <button 
          onClick={() => router.push('/dashboard/products')}
          className="text-[14px] font-medium text-[#0E4032] hover:text-[#0a2e24] flex items-center gap-1 transition-colors"
        >
          View All <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr className="border-b border-[#E5E7EB] bg-[#F2F6EC]/50">
              <th className="px-6 py-3 text-[13px] font-semibold text-[#6B7280] uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-[13px] font-semibold text-[#6B7280] uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-[13px] font-semibold text-[#6B7280] uppercase tracking-wider">Trust Score</th>
              <th className="px-6 py-3 text-[13px] font-semibold text-[#6B7280] uppercase tracking-wider text-right">Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]">
            {products.map((product) => {
              let badgeColor = 'bg-gray-100 text-gray-700'
              if (product.status === 'Approved') badgeColor = 'bg-green-100 text-green-700'
              if (product.status === 'AI Review') badgeColor = 'bg-amber-100 text-amber-700'
              if (product.status === 'Action Needed') badgeColor = 'bg-red-100 text-red-700'

              return (
                <tr 
                  key={product.id}
                  onClick={() => router.push(`/dashboard/products/${product.id}`)}
                  className="hover:bg-[#F2F6EC]/40 cursor-pointer transition-colors duration-200"
                >
                  <td className="px-6 py-4">
                    <span className="font-semibold text-[#111827] text-[15px]">{product.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn("px-2.5 py-1 rounded-md text-[12px] font-bold tracking-wide uppercase", badgeColor)}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {product.trustScore ? (
                      <span className="font-bold text-[#0E4032]">{product.trustScore}</span>
                    ) : (
                      <span className="text-[#6B7280]">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-[14px] text-[#6B7280]">{product.updated}</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
