"use client"

import React from 'react'
import { usePathname } from 'next/navigation'
import { Search, Bell } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function DashboardTopbar() {
  const pathname = usePathname()
  
  // Format the title from pathname
  let pageTitle = 'Overview'
  if (pathname !== '/dashboard') {
    const segments = pathname.split('/').filter(Boolean)
    if (segments.length > 1) {
      pageTitle = segments[1].charAt(0).toUpperCase() + segments[1].slice(1)
    }
  }

  return (
    <div className="h-[72px] flex items-center justify-between w-full">
      {/* Left: Page Title */}
      <h1 className="text-2xl font-display font-bold text-[#231C2D]">
        {pageTitle}
      </h1>

      {/* Right: Search, Notifications, Avatar */}
      <div className="flex items-center gap-4 md:gap-6">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#6B6473]" />
          <Input 
            type="text" 
            placeholder="Search products, SKUs, documents..." 
            className="w-[320px] h-[44px] pl-10 bg-white border-[#E6DED4] rounded-xl text-[14px] focus-visible:ring-[#4F3863]"
          />
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative text-[#6B6473] hover:text-[#231C2D] hover:bg-black/5 rounded-full">
            <Bell className="w-[20px] h-[20px]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#F8F4EC]"></span>
          </Button>

          <div className="w-10 h-10 border border-[#E6DED4] rounded-full overflow-hidden cursor-pointer hover:opacity-90 transition-opacity bg-[#EBE6EF] flex items-center justify-center text-[#4F3863] font-semibold">
            B
          </div>
        </div>
      </div>
    </div>
  )
}
