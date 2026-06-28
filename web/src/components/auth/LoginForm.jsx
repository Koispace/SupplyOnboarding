"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Leaf,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import OnboardingShell from "@/components/onboarding/layout/OnboardingShell";
import BenefitCard from "@/components/onboarding/common/BenefitCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import {
  getAuthErrorMessage,
  signInWithEmail,
  signInWithGoogle,
  signUpWithEmail,
} from "@/lib/firebase/auth";

// ─── STORE DESIGN TOKENS ───
const C = {
  green: "#0E4032",
  lime: "#C8F23E",
  bg: "#F2F6EC",
  card: "#FFFFFF",
  text: "#0E4032",
  muted: "#5A6B5A",
  border: "#E2E8D8",
  light: "#EDF2E6",
};

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading, configured } = useAuth();
  //console.log("Firebase configured:", configured, "| loading:", loading); 
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTo = searchParams.get("redirect") || "/dashboard";

  useEffect(() => {
    if (!loading && user) {
      router.replace(redirectTo);
    }
  }, [user, loading, router, redirectTo]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      if (mode === "signin") {
        await signInWithEmail(email, password);
        toast.success("Welcome back!");
      } else {
        await signUpWithEmail(email, password);
        toast.success("Account created successfully.");
      }

      router.replace(redirectTo);
    } catch (error) {
      toast.error(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);

    try {
      await signInWithGoogle();
      toast.success("Signed in with Google.");
      router.replace(redirectTo);
    } catch (error) {
      toast.error(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: C.bg }}>
        <p className="animate-pulse text-[15px]" style={{ color: C.muted, fontFamily: "var(--font-koi-body)" }}>Loading...</p>
      </div>
    );
  }

  const leftPanel = (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45 }}
      className="flex h-full flex-col"
    >
      <div className="mb-10 flex items-center gap-2.5">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-[15px] tracking-tight text-white"
          style={{ background: C.green, fontFamily: "var(--font-koi-heading)" }}
        >
          K
        </div>
        <span
          className="text-xl font-bold tracking-tight"
          style={{ color: C.green, fontFamily: "var(--font-koi-heading)" }}
        >
          KOI
        </span>
      </div>

      <div className="mb-8">
        <h1 
          className="mb-4 text-[36px] font-bold leading-[1.08] tracking-tight lg:text-[40px]"
          style={{ fontFamily: "var(--font-koi-heading)", color: C.green }}
        >
          Sign in to your supplier account
        </h1>
        <p className="max-w-[90%] text-lg leading-relaxed" style={{ color: C.muted }}>
          Access your dashboard, manage products, and track verification status
          in one secure place.
        </p>
      </div>

      <div className="mt-4 max-w-[480px]">
        <BenefitCard
          icon={ShieldCheck}
          title="Secure supplier access"
          description="Firebase Authentication keeps your brand data protected."
          delay={0.1}
        />
        <BenefitCard
          icon={LockKeyhole}
          title="One account for everything"
          description="Use the same login for onboarding, dashboard, and store tools."
          delay={0.2}
        />
        <BenefitCard
          icon={Sparkles}
          title="Pick up where you left off"
          description="Your progress stays synced across sessions."
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
      className="flex w-full flex-col rounded-2xl border bg-white p-6 md:p-8"
      style={{ borderColor: C.border, boxShadow: "0 8px 30px rgba(14,64,50,0.06)" }}
    >
      <h2 
        className="mb-1.5 text-[32px] font-bold leading-[1.1] tracking-tight md:text-[40px]"
        style={{ fontFamily: "var(--font-koi-heading)", color: C.green }}
      >
        {mode === "signin" ? "Welcome back" : "Create your account"}
      </h2>
      <p className="mb-8 text-[17px]" style={{ color: C.muted }}>
        {mode === "signin"
          ? "Sign in to continue to your KOI supplier dashboard."
          : "Register to start managing your brand on KOI."}
      </p>

      {!configured && (
        <div className="mb-6 rounded-xl border px-4 py-3 text-sm" style={{ borderColor: "#D9A44130", background: "#D9A44115", color: C.text }}>
          Firebase is not configured yet. Copy{" "}
          <code className="rounded px-1.5 py-0.5 text-xs" style={{ background: C.light }}>
            .env.local.example
          </code>{" "}
          to{" "}
          <code className="rounded px-1.5 py-0.5 text-xs" style={{ background: C.light }}>
            .env.local
          </code>{" "}
          and add your project credentials.
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        disabled={isSubmitting || !configured}
        onClick={handleGoogleSignIn}
        className="mb-6 h-[52px] w-full rounded-[14px] bg-white text-[16px] font-semibold hover:bg-[#EDF2E6]"
        style={{ borderColor: C.border, color: C.text }}
      >
        <GoogleIcon />
        Continue with Google
      </Button>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" style={{ borderColor: C.border }} />
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-wider">
          <span className="bg-white px-3" style={{ color: C.muted }}>or use email</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-semibold" style={{ color: C.text }}>
            Email
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@brand.com"
            className="h-[48px] rounded-xl bg-white px-4 text-[15px]"
            style={{ borderColor: C.border }}
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="password"
            className="text-sm font-semibold"
            style={{ color: C.text }}
          >
            Password
          </Label>
          <Input
            id="password"
            type="password"
            autoComplete={
              mode === "signin" ? "current-password" : "new-password"
            }
            required
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            className="h-[48px] rounded-xl bg-white px-4 text-[15px]"
            style={{ borderColor: C.border }}
          />
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting || !configured}
          className="group relative mt-2 h-[56px] w-full overflow-hidden rounded-[14px] text-[17px] font-semibold text-white transition-all hover:shadow-[0_8px_24px_rgba(14,64,50,0.25)] hover:-translate-y-0.5"
          style={{ background: C.green, fontFamily: "var(--font-koi-body)" }}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {mode === "signin" ? "Sign in" : "Create account"}
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </span>
        </Button>
      </form>

      <p className="mt-6 text-center text-sm" style={{ color: C.muted }}>
        {mode === "signin" ? "New to KOI?" : "Already have an account?"}{" "}
        <button
          type="button"
          onClick={() =>
            setMode((current) => (current === "signin" ? "signup" : "signin"))
          }
          className="font-semibold underline-offset-4 hover:underline"
          style={{ color: C.green }}
        >
          {mode === "signin" ? "Create an account" : "Sign in instead"}
        </button>
      </p>
    </motion.div>
  );

  return <OnboardingShell leftPanel={leftPanel} rightPanel={rightPanel} />;
}
