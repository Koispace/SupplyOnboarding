"use client"

import React, { useState } from 'react'
import { Menu } from 'lucide-react'
import DashboardSidebar from './DashboardSidebar'
import DashboardTopbar from './DashboardTopbar'
import { Button } from '@/components/ui/button'

export default function DashboardShell({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="flex h-screen bg-[#F8F4EC] overflow-hidden text-[#111827]">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-[280px] shrink-0 h-full">
        <DashboardSidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative w-[280px] h-full bg-[#F2F6EC] shadow-xl z-50">
            <DashboardSidebar onClose={() => setIsMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Topbar Wrapper */}
        <div className="flex items-center w-full px-4 md:px-8 shrink-0">
          <div className="md:hidden mr-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-[#6B7280] hover:text-[#111827] hover:bg-black/5"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
          <div className="flex-1">
            <DashboardTopbar />
          </div>
        </div>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto px-4 md:px-8 pb-12 pt-4">
          <div className="max-w-[1200px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
