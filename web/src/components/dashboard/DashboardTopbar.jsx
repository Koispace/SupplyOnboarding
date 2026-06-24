"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Search, Bell } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { signOutUser } from "@/lib/firebase/auth";

export default function DashboardTopbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  let pageTitle = "Overview";
  if (pathname !== "/dashboard") {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length > 1) {
      pageTitle = segments[1].charAt(0).toUpperCase() + segments[1].slice(1);
    }
  }
  const initials =
    user?.displayName?.charAt(0) ||
    user?.email?.charAt(0)?.toUpperCase() ||
    "U";

  const handleSignOut = async () => {
    setIsSigningOut(true);

    try {
      await signOutUser();
      toast.success("Signed out successfully.");
      router.replace("/login");
    } catch (error) {
      toast.error("Unable to sign out. Please try again.");
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <div className="flex h-[72px] w-full items-center justify-between">
      <h1 className="font-display text-2xl font-bold text-[#231C2D]">
        {pageTitle}
      </h1>

      <div className="flex items-center gap-4 md:gap-6">
        <div className="relative hidden md:block">
          <Search className="absolute top-1/2 left-3 h-[18px] w-[18px] -translate-y-1/2 text-[#6B6473]" />
          <Input
            type="text"
            placeholder="Search products, SKUs, documents..."
            className="h-[44px] w-[320px] rounded-xl border-[#E6DED4] bg-white pl-10 text-[14px] focus-visible:ring-[#4F3863]"
          />
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-full text-[#6B6473] hover:bg-black/5 hover:text-[#231C2D]"
          >
            <Bell className="h-[20px] w-[20px]" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full border-2 border-[#F8F4EC] bg-red-500" />
          </Button>

          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-[#231C2D]">
              {user?.displayName || "Supplier"}
            </p>
            <p className="max-w-[180px] truncate text-xs text-[#6B6473]">
              {user?.email}
            </p>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-[#E6DED4] bg-[#EBE6EF] text-sm font-semibold text-[#4F3863] transition-opacity hover:opacity-90 disabled:opacity-60"
            title="Sign out"
          >
            {user?.photoURL ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.photoURL}
                alt={user.displayName || "User avatar"}
                className="h-full w-full object-cover"
              />
            ) : (
              initials
            )}
          </button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="rounded-full text-[#6B6473] hover:bg-black/5 hover:text-[#231C2D]"
            title="Sign out"
          >
            <LogOut className="h-[18px] w-[18px]" />
          </Button>
        </div>
      </div>
    </div>
  );
}
