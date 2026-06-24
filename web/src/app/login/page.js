import { Suspense } from "react";
import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: "Sign In | KOI Health",
  description: "Sign in to your KOI supplier account",
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <p className="text-muted animate-pulse">Loading...</p>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
