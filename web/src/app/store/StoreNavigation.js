"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Store, ShoppingCart, Package, User } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

export default function StoreNavigation() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const items = useCartStore(state => state.items);

  useEffect(() => setMounted(true), []);

  // Hide global navigation entirely on checkout page
  if (pathname === "/store/checkout") return null;

  const totalItems = mounted ? items.reduce((sum, i) => sum + i.quantity, 0) : 0;
  const hasActiveOrder = true; // Mock logic to display dot

  const NAV_ITEMS = [
    { label: "Home", href: "/", icon: Home },
    { label: "Store", href: "/store/shop", icon: Store },
    { label: "Cart", href: "/store/cart", icon: ShoppingCart },
    { label: "Orders", href: "/store/orders", icon: Package },
    { label: "Profile", href: "/store/profile", icon: User },
  ];

  return (
    <>
      {/* ─── DESKTOP TOP NAVBAR ─── */}
      <nav className="hidden md:block sticky top-0 z-50 backdrop-blur-xl bg-[#F2F6EC]/85 border-b border-[#E2E8D8]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-8">
             <Link href="/" className="text-3xl font-bold tracking-tighter text-[#0E4032]" style={{ fontFamily: "var(--font-koi-heading)" }}>
               KOI
             </Link>
             <div className="flex items-center gap-6 mt-1">
                <Link href="/" className="text-[13px] font-bold text-[#5A6B5A] hover:text-[#0E4032] transition-colors uppercase tracking-wider">Discover</Link>
                <Link href="/store/shop" className={`text-[13px] font-bold transition-colors uppercase tracking-wider ${pathname === "/store/shop" ? "text-[#0E4032]" : "text-[#5A6B5A] hover:text-[#0E4032]"}`}>Store</Link>
                <Link href="/store/orders" className={`text-[13px] font-bold transition-colors uppercase tracking-wider flex items-center gap-1.5 ${pathname === "/store/orders" ? "text-[#0E4032]" : "text-[#5A6B5A] hover:text-[#0E4032]"}`}>
                  Orders
                  {hasActiveOrder && <span className="w-1.5 h-1.5 rounded-full bg-[#C8F23E] shadow-[0_0_8px_rgba(200,242,62,0.8)]" />}
                </Link>
                <Link href="/store/profile" className={`text-[13px] font-bold transition-colors uppercase tracking-wider ${pathname === "/store/profile" ? "text-[#0E4032]" : "text-[#5A6B5A] hover:text-[#0E4032]"}`}>Profile</Link>
             </div>
          </div>
          
          <Link href="/store/cart" className="flex items-center gap-2.5 px-5 py-2.5 bg-white border border-[#E2E8D8] rounded-full shadow-[0_2px_10px_rgba(14,64,50,0.02)] hover:border-[#0E4032]/30 hover:bg-[#F2F6EC] transition-all relative">
             <ShoppingCart className="w-4 h-4 text-[#0E4032]" />
             <span className="text-[13px] font-bold text-[#0E4032] uppercase tracking-wider">{totalItems > 0 ? `${totalItems} items` : "Cart"}</span>
          </Link>
        </div>
      </nav>

      {/* ─── MOBILE BOTTOM NAVBAR ─── */}
      <nav className="md:hidden fixed bottom-4 left-4 right-4 z-[60] animate-in slide-in-from-bottom duration-500 pb-safe">
        <div className="bg-white/95 backdrop-blur-xl border border-[#E2E8D8]/80 shadow-[0_8px_30px_rgba(14,64,50,0.15)] rounded-2xl flex items-center justify-between px-2 py-1.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (pathname === "/store" && item.href === "/store/shop");
            
            return (
              <Link 
                key={item.label}
                href={item.href}
                className="relative flex-1 flex flex-col items-center justify-center py-2 group"
              >
                <div className={`relative flex items-center justify-center transition-all duration-300 ${isActive ? "text-[#0E4032]" : "text-[#5A6B5A]/50 group-hover:text-[#5A6B5A]"}`}>
                  <Icon className={`w-[22px] h-[22px] transition-transform duration-300 ${isActive ? "scale-110" : "scale-100"}`} />
                  
                  {/* Badge for Cart */}
                  {item.label === "Cart" && totalItems > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-[#C8F23E] text-[#0E4032] text-[10px] font-bold px-1.5 min-w-[16px] h-[16px] rounded-full flex items-center justify-center shadow-sm">
                      {totalItems}
                    </span>
                  )}

                  {/* Pulsing Dot for Orders */}
                  {item.label === "Orders" && hasActiveOrder && (
                    <span className="absolute top-0 -right-0.5 w-2.5 h-2.5 bg-[#C8F23E] border-2 border-white rounded-full shadow-[0_0_8px_rgba(200,242,62,0.8)]" />
                  )}
                </div>
                {isActive && (
                  <span className="text-[8px] font-bold uppercase tracking-wider mt-1 text-[#0E4032] animate-in fade-in slide-in-from-bottom-1 duration-300">
                    {item.label}
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      </nav>

      <style jsx global>{`
        .pb-safe {
          padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>
    </>
  );
}
