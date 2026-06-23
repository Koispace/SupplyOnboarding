"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  ShoppingBag,
  MapPin,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  ScanLine,
  Leaf,
  Zap,
  Moon,
  Droplets,
  Dumbbell,
  Brain,
  Plus,
  Check,
  ArrowRight,
  Star,
  FlaskConical,
  Eye,
  ChevronDown,
} from "lucide-react";

// ─── DESIGN TOKENS ───
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

// ─── MOCK DATA ───
const GOALS = [
  { label: "More Protein", icon: Dumbbell, color: "#0E4032" },
  { label: "Gut Health", icon: Leaf, color: "#2D7A5E" },
  { label: "More Energy", icon: Zap, color: "#B8860B" },
  { label: "Better Sleep", icon: Moon, color: "#4A5568" },
  { label: "Clean Skin", icon: Droplets, color: "#6B7280" },
  { label: "Less Sugar", icon: Brain, color: "#9B2C2C" },
];

const PRODUCTS = [
  {
    id: 1,
    brand: "True Elements",
    name: "Whey Protein Isolate – Vanilla",
    price: 2499,
    score: 94,
    image: null,
    claims: ["No added sugar", "No preservatives", "24g protein"],
    nutrition: { protein: "24g", sugar: "0.5g", calories: "120 kcal" },
  },
  {
    id: 2,
    brand: "Yogabar",
    name: "Peanut Butter – Crunchy Dark Chocolate",
    price: 449,
    score: 87,
    image: null,
    claims: ["No palm oil", "High protein", "No trans fat"],
    nutrition: { protein: "10g", sugar: "4g", calories: "195 kcal" },
  },
  {
    id: 3,
    brand: "Oziva",
    name: "Plant Protein – Unflavoured",
    price: 1699,
    score: 91,
    image: null,
    claims: ["100% plant-based", "No artificial flavour", "20g protein"],
    nutrition: { protein: "20g", sugar: "1g", calories: "110 kcal" },
  },
  {
    id: 4,
    brand: "Epigamia",
    name: "Greek Yogurt — Blueberry",
    price: 85,
    score: 82,
    image: null,
    claims: ["No preservatives", "High protein", "Low fat"],
    nutrition: { protein: "8g", sugar: "6g", calories: "90 kcal" },
  },
];

const TRUST_CARDS = [
  {
    icon: ScanLine,
    title: "Ingredient Transparency",
    body: "Every product is decoded at the ingredient level. No hidden fillers, no misleading labels.",
  },
  {
    icon: FlaskConical,
    title: "Nutrition Intelligence",
    body: "AI-powered analysis of nutrition panels, claims, and certifications — not marketing copy.",
  },
  {
    icon: Eye,
    title: "No Marketing Fluff",
    body: "Products earn placement through evidence, not ad spend. What you see is what the science says.",
  },
];

// ─── KOI SCORE RING ───
function KoiScore({ score, size = 44 }) {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color =
    score >= 90 ? "#0E4032" : score >= 75 ? "#2D7A5E" : "#B8860B";
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0 -rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#E2E8D8"
          strokeWidth="3"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <span
        className="text-[11px] font-bold"
        style={{ color, fontFamily: "var(--font-koi-heading)" }}
      >
        {score}
      </span>
    </div>
  );
}

// ─── PRODUCT CARD ───
function ProductCard({ product }) {
  const [added, setAdded] = useState(false);

  return (
    <div className="group bg-white rounded-2xl border border-[#E2E8D8] overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgba(14,64,50,0.08)] hover:-translate-y-0.5 flex flex-col w-[260px] md:w-full flex-shrink-0 snap-start">
      {/* Image area */}
      <div className="relative bg-gradient-to-br from-[#F2F6EC] to-[#E8EFE0] h-44 flex items-center justify-center overflow-hidden">
        <div className="w-24 h-24 rounded-full bg-white/60 backdrop-blur-sm flex items-center justify-center border border-[#E2E8D8]">
          <Leaf className="w-10 h-10 text-[#0E4032]/30" />
        </div>
        {/* Score badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-0.5 shadow-sm border border-[#E2E8D8]/50">
          <KoiScore score={product.score} size={40} />
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <p
          className="text-[11px] tracking-[0.08em] uppercase font-medium mb-1"
          style={{ color: C.muted }}
        >
          {product.brand}
        </p>
        <h4
          className="text-[15px] font-semibold leading-snug mb-3 line-clamp-2"
          style={{
            color: C.text,
            fontFamily: "var(--font-koi-heading)",
          }}
        >
          {product.name}
        </h4>

        {/* Mini label lens */}
        <div className="space-y-1.5 mb-4 flex-1">
          {product.claims.map((c, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 text-[12px] font-medium"
              style={{ color: "#2D7A5E" }}
            >
              <Check className="w-3 h-3 flex-shrink-0" />
              {c}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-[#E2E8D8]">
          <span
            className="text-lg font-bold"
            style={{
              color: C.green,
              fontFamily: "var(--font-koi-heading)",
            }}
          >
            ₹{product.price}
          </span>
          <button
            onClick={() => setAdded(!added)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-semibold transition-all duration-300 ${
              added
                ? "bg-[#0E4032] text-white"
                : "bg-[#0E4032]/5 text-[#0E4032] hover:bg-[#0E4032] hover:text-white"
            }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Added
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════

export default function StoreHomePage() {
  const router = useRouter();
  const [proteinVal, setProteinVal] = useState(15);
  const [sugarVal, setSugarVal] = useState(5);
  const [caloriesVal, setCaloriesVal] = useState(180);

  return (
    <div className="min-h-screen" style={{ background: C.bg }}>
      {/* ── SECTION 1 — STICKY TOP BAR ── */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#F2F6EC]/80 border-b border-[#E2E8D8]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-[15px] tracking-tight text-white"
                style={{
                  background: C.green,
                  fontFamily: "var(--font-koi-heading)",
                }}
              >
                K
              </div>
              <span
                className="text-xl font-bold tracking-tight hidden sm:block"
                style={{
                  color: C.green,
                  fontFamily: "var(--font-koi-heading)",
                }}
              >
                KOI
              </span>
            </div>

            {/* Location */}
            <button className="hidden md:flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full bg-white/60 border border-[#E2E8D8] hover:bg-white transition-colors"
              style={{ color: C.green }}
            >
              <MapPin className="w-3.5 h-3.5" />
              Bengaluru
              <ChevronDown className="w-3 h-3 opacity-50" />
            </button>

            {/* Search */}
            <div className="flex-1 max-w-md mx-4 hidden md:block">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5A6B5A]" />
                <input
                  type="text"
                  placeholder="Search products, brands, goals..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white/70 border border-[#E2E8D8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0E4032]/10 focus:border-[#0E4032]/30 placeholder:text-[#5A6B5A]/60 transition-all"
                  style={{ fontFamily: "var(--font-koi-body)" }}
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <button className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white/60 border border-[#E2E8D8] hover:bg-white transition-colors">
                <Search className="w-4.5 h-4.5" style={{ color: C.green }} />
              </button>
              <button className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-white/60 border border-[#E2E8D8] hover:bg-white transition-colors">
                <ShoppingBag className="w-4.5 h-4.5" style={{ color: C.green }} />
                <span className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full text-[10px] font-bold text-white flex items-center justify-center" style={{ background: C.lime, color: C.green }}>
                  2
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* ── SECTION 2 — HERO ── */}
        <section className="relative overflow-hidden">
          {/* Subtle gradient orbs */}
          <div className="absolute top-10 -left-32 w-96 h-96 bg-[#C8F23E]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#0E4032]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left: Copy */}
              <div>
                <div
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[13px] font-semibold mb-6 border"
                  style={{
                    background: `${C.lime}15`,
                    color: C.green,
                    borderColor: `${C.lime}40`,
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Trust-first commerce
                </div>
                <h1
                  className="text-[clamp(2.25rem,5vw,4rem)] font-extrabold leading-[1.05] tracking-tight mb-6"
                  style={{
                    color: C.green,
                    fontFamily: "var(--font-koi-heading)",
                  }}
                >
                  The Better
                  <br />
                  Choices Store.
                </h1>
                <p
                  className="text-lg md:text-xl leading-relaxed mb-10 max-w-lg"
                  style={{
                    color: C.muted,
                    fontFamily: "var(--font-koi-body)",
                  }}
                >
                  Every product here earned its place.
                  <br className="hidden md:block" />
                  We decoded ingredients, labels and nutrition so you
                  don&apos;t have to.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => router.push("/store/shop")}
                    className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-semibold text-[15px] transition-all duration-300 hover:shadow-[0_8px_24px_rgba(14,64,50,0.25)] hover:-translate-y-0.5"
                    style={{
                      background: C.green,
                      color: "#FFFFFF",
                      fontFamily: "var(--font-koi-body)",
                    }}
                  >
                    Start Shopping
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-semibold text-[15px] border transition-all duration-300 hover:bg-white/80"
                    style={{
                      background: "transparent",
                      color: C.green,
                      borderColor: C.border,
                      fontFamily: "var(--font-koi-body)",
                    }}
                  >
                    <Sparkles className="w-4 h-4" />
                    Try Need Finder
                  </button>
                </div>
              </div>

              {/* Right: Floating product visuals */}
              <div className="hidden lg:flex items-center justify-center relative h-[400px]">
                {/* Score card 1 */}
                <div className="absolute top-4 left-8 bg-white rounded-2xl border border-[#E2E8D8] p-4 shadow-[0_8px_30px_rgba(14,64,50,0.06)] animate-[float_6s_ease-in-out_infinite]">
                  <div className="flex items-center gap-3 mb-2">
                    <KoiScore score={94} size={48} />
                    <div>
                      <p className="text-[11px] text-[#5A6B5A] uppercase tracking-wider font-medium">
                        True Elements
                      </p>
                      <p
                        className="text-sm font-bold"
                        style={{
                          color: C.green,
                          fontFamily: "var(--font-koi-heading)",
                        }}
                      >
                        Whey Isolate
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#F2F6EC] text-[#2D7A5E]">
                      24g protein
                    </span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#F2F6EC] text-[#2D7A5E]">
                      No sugar
                    </span>
                  </div>
                </div>

                {/* Score card 2 */}
                <div className="absolute bottom-8 right-4 bg-white rounded-2xl border border-[#E2E8D8] p-4 shadow-[0_8px_30px_rgba(14,64,50,0.06)] animate-[float_6s_ease-in-out_infinite_1.5s]">
                  <div className="flex items-center gap-3 mb-2">
                    <KoiScore score={87} size={48} />
                    <div>
                      <p className="text-[11px] text-[#5A6B5A] uppercase tracking-wider font-medium">
                        Yogabar
                      </p>
                      <p
                        className="text-sm font-bold"
                        style={{
                          color: C.green,
                          fontFamily: "var(--font-koi-heading)",
                        }}
                      >
                        Peanut Butter
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#F2F6EC] text-[#2D7A5E]">
                      No palm oil
                    </span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#F2F6EC] text-[#2D7A5E]">
                      High protein
                    </span>
                  </div>
                </div>

                {/* Central product visual */}
                <div className="w-56 h-56 rounded-3xl bg-gradient-to-br from-[#0E4032]/5 to-[#C8F23E]/10 border border-[#E2E8D8] flex items-center justify-center">
                  <div className="w-28 h-28 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm">
                    <ShieldCheck className="w-14 h-14 text-[#0E4032]/20" />
                  </div>
                </div>

                {/* Floating badge */}
                <div className="absolute top-1/2 right-24 -translate-y-1/2 bg-[#C8F23E] text-[#0E4032] rounded-full px-3 py-1.5 text-[11px] font-bold shadow-lg animate-[float_6s_ease-in-out_infinite_3s]"
                  style={{ fontFamily: "var(--font-koi-heading)" }}
                >
                  KOI Verified ✓
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 3 — GOAL DISCOVERY ── */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2
              className="text-2xl md:text-3xl font-bold mb-8"
              style={{
                color: C.green,
                fontFamily: "var(--font-koi-heading)",
              }}
            >
              What are you optimizing today?
            </h2>

            {/* Mobile: horizontal scroll / Desktop: grid */}
            <div className="flex md:grid md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto pb-4 md:pb-0 snap-x -mx-4 px-4 md:mx-0 md:px-0 hide-scrollbar">
              {GOALS.map((goal) => {
                const Icon = goal.icon;
                return (
                  <button
                    key={goal.label}
                    className="group flex-shrink-0 w-[140px] md:w-full snap-start bg-white rounded-2xl border border-[#E2E8D8] p-5 flex flex-col items-center gap-3 hover:border-[#0E4032]/20 hover:shadow-[0_4px_20px_rgba(14,64,50,0.06)] transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300"
                      style={{ background: `${goal.color}08` }}
                    >
                      <Icon
                        className="w-5.5 h-5.5 transition-colors"
                        style={{ color: goal.color }}
                      />
                    </div>
                    <span
                      className="text-[13px] font-semibold text-center"
                      style={{
                        color: C.green,
                        fontFamily: "var(--font-koi-heading)",
                      }}
                    >
                      {goal.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── SECTION 4 — NEED FINDER ── */}
        <section className="py-16" style={{ background: `${C.green}05` }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-3xl border border-[#E2E8D8] p-8 md:p-10 shadow-[0_12px_40px_rgba(14,64,50,0.05)]">
                {/* Header */}
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${C.lime}30` }}
                  >
                    <Sparkles className="w-5 h-5" style={{ color: C.green }} />
                  </div>
                  <div>
                    <h3
                      className="text-xl font-bold"
                      style={{
                        color: C.green,
                        fontFamily: "var(--font-koi-heading)",
                      }}
                    >
                      Need Finder
                    </h3>
                    <p className="text-[13px]" style={{ color: C.muted }}>
                      AI-powered nutrition assistant
                    </p>
                  </div>
                </div>

                <div className="my-8 space-y-6">
                  {/* Protein slider */}
                  <div>
                    <div className="flex justify-between items-center mb-2.5">
                      <span
                        className="text-sm font-semibold"
                        style={{ color: C.green }}
                      >
                        Protein
                      </span>
                      <span
                        className="text-sm font-bold px-2.5 py-0.5 rounded-full"
                        style={{
                          background: `${C.lime}25`,
                          color: C.green,
                          fontFamily: "var(--font-koi-heading)",
                        }}
                      >
                        ≥ {proteinVal}g
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="40"
                      value={proteinVal}
                      onChange={(e) => setProteinVal(e.target.value)}
                      className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, ${C.green} ${(proteinVal / 40) * 100}%, #E2E8D8 ${(proteinVal / 40) * 100}%)`,
                      }}
                    />
                  </div>

                  {/* Sugar slider */}
                  <div>
                    <div className="flex justify-between items-center mb-2.5">
                      <span
                        className="text-sm font-semibold"
                        style={{ color: C.green }}
                      >
                        Sugar
                      </span>
                      <span
                        className="text-sm font-bold px-2.5 py-0.5 rounded-full"
                        style={{
                          background: "#FEF3C7",
                          color: "#92400E",
                          fontFamily: "var(--font-koi-heading)",
                        }}
                      >
                        ≤ {sugarVal}g
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="30"
                      value={sugarVal}
                      onChange={(e) => setSugarVal(e.target.value)}
                      className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #B8860B ${(sugarVal / 30) * 100}%, #E2E8D8 ${(sugarVal / 30) * 100}%)`,
                      }}
                    />
                  </div>

                  {/* Calories slider */}
                  <div>
                    <div className="flex justify-between items-center mb-2.5">
                      <span
                        className="text-sm font-semibold"
                        style={{ color: C.green }}
                      >
                        Calories
                      </span>
                      <span
                        className="text-sm font-bold px-2.5 py-0.5 rounded-full"
                        style={{
                          background: "#EDE9FE",
                          color: "#5B21B6",
                          fontFamily: "var(--font-koi-heading)",
                        }}
                      >
                        ≤ {caloriesVal} kcal
                      </span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="500"
                      value={caloriesVal}
                      onChange={(e) => setCaloriesVal(e.target.value)}
                      className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #5B21B6 ${((caloriesVal - 50) / 450) * 100}%, #E2E8D8 ${((caloriesVal - 50) / 450) * 100}%)`,
                      }}
                    />
                  </div>
                </div>

                {/* CTA */}
                <button
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl font-semibold text-[15px] transition-all duration-300 hover:shadow-[0_8px_24px_rgba(14,64,50,0.2)]"
                  style={{
                    background: C.green,
                    color: C.lime,
                    fontFamily: "var(--font-koi-body)",
                  }}
                >
                  <Sparkles className="w-4 h-4" />
                  Find products for me
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 5 — FEATURED COLLECTION ── */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p
                  className="text-[13px] uppercase tracking-[0.1em] font-semibold mb-1"
                  style={{ color: C.muted }}
                >
                  Curated
                </p>
                <h2
                  className="text-2xl md:text-3xl font-bold"
                  style={{
                    color: C.green,
                    fontFamily: "var(--font-koi-heading)",
                  }}
                >
                  Earned its place this week
                </h2>
              </div>
              <button
                className="hidden md:flex items-center gap-1.5 text-sm font-semibold hover:gap-2.5 transition-all"
                style={{ color: C.green }}
              >
                View all <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile: scroll / Desktop: grid */}
            <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-5 overflow-x-auto pb-4 md:pb-0 snap-x -mx-4 px-4 md:mx-0 md:px-0 hide-scrollbar">
              {PRODUCTS.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 6 — TRUST SECTION ── */}
        <section
          className="py-20"
          style={{
            background: C.green,
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p
                className="text-[13px] uppercase tracking-[0.15em] font-semibold mb-3"
                style={{ color: `${C.lime}80` }}
              >
                The KOI difference
              </p>
              <h2
                className="text-3xl md:text-4xl font-bold text-white"
                style={{ fontFamily: "var(--font-koi-heading)" }}
              >
                Why trust KOI?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TRUST_CARDS.map((card, i) => {
                const Icon = card.icon;
                return (
                  <div
                    key={i}
                    className="rounded-2xl p-8 border transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)]"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      borderColor: "rgba(255,255,255,0.08)",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                      style={{ background: `${C.lime}20` }}
                    >
                      <Icon className="w-5.5 h-5.5" style={{ color: C.lime }} />
                    </div>
                    <h3
                      className="text-lg font-bold text-white mb-3"
                      style={{ fontFamily: "var(--font-koi-heading)" }}
                    >
                      {card.title}
                    </h3>
                    <p
                      className="text-[15px] leading-relaxed"
                      style={{ color: "rgba(255,255,255,0.65)" }}
                    >
                      {card.body}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="py-12 border-t" style={{ borderColor: C.border }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold text-white"
                  style={{ background: C.green, fontFamily: "var(--font-koi-heading)" }}
                >
                  K
                </div>
                <span
                  className="text-sm font-bold"
                  style={{ color: C.green, fontFamily: "var(--font-koi-heading)" }}
                >
                  KOI
                </span>
              </div>
              <p className="text-sm" style={{ color: C.muted }}>
                © 2026 KOI Health First Platform. Every product earns its
                place.
              </p>
            </div>
          </div>
        </footer>
      </main>

      {/* ── GLOBAL STYLES ── */}
      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-12px);
          }
        }

        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        /* Custom range slider thumb */
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: white;
          border: 2px solid #0E4032;
          box-shadow: 0 2px 6px rgba(14, 64, 50, 0.2);
          cursor: pointer;
        }
        input[type="range"]::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: white;
          border: 2px solid #0E4032;
          box-shadow: 0 2px 6px rgba(14, 64, 50, 0.2);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
