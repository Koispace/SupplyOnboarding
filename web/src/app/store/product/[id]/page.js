"use client";

import React, { useState, useEffect, use } from "react";
import { fetchAllProducts } from "@/lib/data/productFetcher";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ShoppingBag,
  ShieldCheck,
  Check,
  AlertTriangle,
  ChevronRight,
  Plus,
  Minus,
  Star,
  Zap,
  Dumbbell,
  Flame,
  Leaf,
  Heart,
  TrendingUp,
  ArrowUpRight,
  Info,
  ThumbsUp,
  Sparkles,
  CircleDot,
} from "lucide-react";

const iconMap = {
  ArrowLeft, ShoppingBag, ShieldCheck, Check, AlertTriangle, ChevronRight,
  Plus, Minus, Star, Zap, Dumbbell, Flame, Leaf, Heart, TrendingUp,
  ArrowUpRight, Info, ThumbsUp, Sparkles, CircleDot
};

// ─── DESIGN TOKENS ───
const C = {
  green: "#0E4032",
  lime: "#C8F23E",
  bg: "#F2F6EC",
  card: "#FFFFFF",
  text: "#0E4032",
  muted: "#5A6B5A",
  border: "#E2E8D8",
};

// Data fetched dynamically.

// ─── KOI SCORE RING ───
function KoiScore({ score, size = 52 }) {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 85 ? "#0E4032" : score >= 70 ? "#2D7A5E" : "#B8860B";
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="absolute inset-0 -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E2E8D8" strokeWidth="3" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="3" strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-700 ease-out" />
      </svg>
      <span className="text-[13px] font-bold" style={{ color, fontFamily: "var(--font-koi-heading)" }}>{score}</span>
    </div>
  );
}

// ═══════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════
export default function ProductDetailPage({ params }) {
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [activeTag, setActiveTag] = useState("All");
  const [activeImage, setActiveImage] = useState("hero");
  const [p, setProduct] = useState(null);

  useEffect(() => {
    async function load() {
      const data = await fetchAllProducts();
      const match = data.find(item => item.id === id);
      setProduct(match);
    }
    load();
  }, [id]);

  if (!p) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: C.bg }}>
        <div className="animate-pulse flex flex-col items-center">
          <Leaf className="w-8 h-8 text-[#0E4032] mb-4 animate-bounce" />
          <p className="text-[#0E4032] font-medium" style={{ fontFamily: "var(--font-koi-body)" }}>Loading Product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 md:pb-8" style={{ background: C.bg }}>

      {/* ── SECTION 1 — STICKY TOP BAR ── */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#F2F6EC]/85 border-b border-[#E2E8D8]/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <button onClick={() => router.back()} className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/60 border border-[#E2E8D8] hover:bg-white transition-colors">
              <ArrowLeft className="w-4 h-4" style={{ color: C.green }} />
            </button>
            <span className="text-sm font-semibold" style={{ color: C.green, fontFamily: "var(--font-koi-heading)" }}>
              Product Details
            </span>
            <button className="relative w-9 h-9 rounded-xl flex items-center justify-center bg-white/60 border border-[#E2E8D8] hover:bg-white transition-colors">
              <ShoppingBag className="w-4 h-4" style={{ color: C.green }} />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold text-[#0E4032] flex items-center justify-center" style={{ background: C.lime }}>2</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* ── SECTION 2 — PRODUCT HERO ── */}
        <section className="py-6 md:py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Image Gallery */}
            <div className="flex flex-col gap-4">
              <div className="relative bg-[#F2F6EC] rounded-3xl border border-[#E2E8D8] h-[320px] md:h-[420px] flex items-center justify-center overflow-hidden">
                {p.image?.[activeImage] ? (
                  <img 
                    src={p.image[activeImage]} 
                    alt={`${p.name} - ${activeImage}`} 
                    className="w-full h-full object-cover transition-all duration-300"
                  />
                ) : (
                  <div className="w-40 h-40 rounded-full bg-white/60 backdrop-blur-sm flex items-center justify-center border border-[#E2E8D8]">
                    <Leaf className="w-16 h-16 text-[#0E4032]/15" />
                  </div>
                )}
                {/* KOI Badge */}
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full pl-1 pr-3.5 py-1 border border-[#E2E8D8]/60 shadow-sm">
                  <KoiScore score={p.score} size={36} />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: C.green }}>KOI {p.koiStatus}</p>
                  </div>
                </div>
              </div>

              {/* Thumbnails */}
              {p.image && (
                <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar pb-2">
                  {["hero", "lifestyle", "label"].map((imgKey) => (
                    p.image[imgKey] && (
                      <button
                        key={imgKey}
                        onClick={() => setActiveImage(imgKey)}
                        className={`relative w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-2xl border-2 overflow-hidden transition-all duration-200 ${
                          activeImage === imgKey ? "border-[#0E4032] opacity-100 shadow-sm" : "border-[#E2E8D8] opacity-60 hover:opacity-100"
                        }`}
                      >
                        <img src={p.image[imgKey]} alt={imgKey} className="w-full h-full object-cover" />
                        {activeImage !== imgKey && <div className="absolute inset-0 bg-black/5 hover:bg-transparent transition-colors" />}
                      </button>
                    )
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col">
              <p className="text-[12px] tracking-[0.1em] uppercase font-semibold mb-1.5" style={{ color: C.muted }}>{p.brand}</p>
              <h1 className="text-2xl md:text-3xl font-bold leading-tight mb-3" style={{ color: C.green, fontFamily: "var(--font-koi-heading)" }}>
                {p.name}
              </h1>
              <p className="text-sm mb-6" style={{ color: C.muted }}>{p.weight}</p>

              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-3xl font-bold" style={{ color: C.green, fontFamily: "var(--font-koi-heading)" }}>₹{p.price}</span>
              </div>

              {/* Quantity + Add to Cart */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border rounded-xl overflow-hidden" style={{ borderColor: C.border }}>
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-[#F2F6EC] transition-colors">
                    <Minus className="w-4 h-4" style={{ color: C.green }} />
                  </button>
                  <span className="w-10 text-center font-bold text-sm" style={{ color: C.green, fontFamily: "var(--font-koi-heading)" }}>{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="w-10 h-10 flex items-center justify-center hover:bg-[#F2F6EC] transition-colors">
                    <Plus className="w-4 h-4" style={{ color: C.green }} />
                  </button>
                </div>
                <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-[15px] transition-all duration-300 hover:shadow-[0_8px_24px_rgba(14,64,50,0.2)]" style={{ background: C.green, color: "#fff", fontFamily: "var(--font-koi-body)" }}>
                  <ShoppingBag className="w-4 h-4" />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 3 — KOI VERDICT ── */}
        <section className="mb-8">
          <div className="bg-white rounded-2xl border border-[#E2E8D8] p-6 md:p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${C.lime}25` }}>
                <ShieldCheck className="w-5 h-5" style={{ color: C.green }} />
              </div>
              <h2 className="text-lg font-bold" style={{ color: C.green, fontFamily: "var(--font-koi-heading)" }}>KOI Verdict</h2>
            </div>
            <p className="text-[15px] leading-relaxed mb-6" style={{ color: C.muted }}>
              {p.verdict.summary}
            </p>
            <div className="border-t pt-5" style={{ borderColor: C.border }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: C.muted }}>Why it earned its place</p>
              <div className="space-y-2.5">
                {p.verdict.pros.map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-[14px] font-medium" style={{ color: "#2D7A5E" }}>
                    <Check className="w-4 h-4 flex-shrink-0" />
                    {item}
                  </div>
                ))}
                {p.verdict.cons.map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-[14px] font-medium" style={{ color: "#B8860B" }}>
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 4 — LABEL LENS ── */}
        <section className="mb-8">
          <div className="bg-white rounded-2xl border border-[#E2E8D8] overflow-hidden">
            <div className="p-6 md:p-8 pb-4">
              <h2 className="text-lg font-bold mb-1" style={{ color: C.green, fontFamily: "var(--font-koi-heading)" }}>Label Lens</h2>
              <p className="text-[13px]" style={{ color: C.muted }}>We decoded the label for you</p>
            </div>
            <div className="divide-y" style={{ borderColor: `${C.border}80` }}>
              {p.labelLens.map((row, i) => (
                <div key={i} className="flex items-center justify-between px-6 md:px-8 py-4 hover:bg-[#F2F6EC]/40 transition-colors">
                  <span className="text-[14px] font-medium" style={{ color: C.green }}>{row.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-semibold" style={{ color: row.status === "good" ? "#2D7A5E" : C.muted }}>
                      {row.value}
                    </span>
                    {row.status === "good" && <Check className="w-3.5 h-3.5 text-[#2D7A5E]" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 5 — NUTRITION BREAKDOWN ── */}
        <section className="mb-8">
          <h2 className="text-lg font-bold mb-4" style={{ color: C.green, fontFamily: "var(--font-koi-heading)" }}>Nutrition Breakdown</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {p.nutrition.map((n, i) => {
              const Icon = iconMap[n.icon] || Info;
              return (
                <div key={i} className="bg-white rounded-2xl border border-[#E2E8D8] p-4 flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${C.green}08` }}>
                      <Icon className="w-4 h-4" style={{ color: C.green }} />
                    </div>
                    <span className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: C.muted }}>{n.label}</span>
                  </div>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-2xl font-bold" style={{ color: C.green, fontFamily: "var(--font-koi-heading)" }}>{n.value}</span>
                    <span className="text-sm font-medium" style={{ color: C.muted }}>{n.unit}</span>
                  </div>
                  {n.insight && (
                    <p className="text-[11px] font-medium mt-1 px-2 py-1 rounded-md" style={{ background: `${C.lime}15`, color: "#2D7A5E" }}>
                      {n.insight}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ── SECTION 6 — HEALTH BENEFITS ── */}
        <section className="mb-8">
          <h2 className="text-lg font-bold mb-4" style={{ color: C.green, fontFamily: "var(--font-koi-heading)" }}>Why people choose this</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {p.benefits.map((b, i) => {
              const Icon = iconMap[b.icon] || Info;
              return (
                <div key={i} className="bg-white rounded-2xl border border-[#E2E8D8] p-5 hover:-translate-y-0.5 transition-all duration-300">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `${C.lime}20` }}>
                    <Icon className="w-5 h-5" style={{ color: C.green }} />
                  </div>
                  <h3 className="text-[15px] font-bold mb-2" style={{ color: C.green, fontFamily: "var(--font-koi-heading)" }}>{b.title}</h3>
                  <p className="text-[13px] leading-relaxed" style={{ color: C.muted }}>{b.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── SECTION 7 — INGREDIENT INTELLIGENCE ── */}
        <section className="mb-8">
          <h2 className="text-lg font-bold mb-4" style={{ color: C.green, fontFamily: "var(--font-koi-heading)" }}>Ingredient Intelligence</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Good Ingredients */}
            <div className="bg-white rounded-2xl border border-[#E2E8D8] p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-2 h-2 rounded-full bg-[#2D7A5E]" />
                <span className="text-[13px] font-bold uppercase tracking-wider" style={{ color: "#2D7A5E" }}>Good Ingredients</span>
              </div>
              <div className="space-y-4">
                {p.goodIngredients.map((ing, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-[#2D7A5E] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[14px] font-semibold" style={{ color: C.green }}>{ing.name}</p>
                      <p className="text-[12px]" style={{ color: C.muted }}>{ing.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Watch-outs */}
            <div className="bg-white rounded-2xl border border-[#E2E8D8] p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-2 h-2 rounded-full bg-[#B8860B]" />
                <span className="text-[13px] font-bold uppercase tracking-wider" style={{ color: "#B8860B" }}>Watch-outs</span>
              </div>
              <div className="space-y-4">
                {p.watchOuts.map((ing, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-[#B8860B] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[14px] font-semibold" style={{ color: C.green }}>{ing.name}</p>
                      <p className="text-[12px]" style={{ color: C.muted }}>{ing.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 8 — COMPARE ALTERNATIVES ── */}
        <section className="mb-8">
          <h2 className="text-lg font-bold mb-4" style={{ color: C.green, fontFamily: "var(--font-koi-heading)" }}>Compare Alternatives</h2>
          <div className="flex md:grid md:grid-cols-3 gap-4 overflow-x-auto pb-4 md:pb-0 snap-x -mx-4 px-4 md:mx-0 md:px-0 hide-scrollbar">
            {p.alternatives.map((alt, i) => (
              <div key={i} className="bg-white rounded-2xl border border-[#E2E8D8] p-5 flex-shrink-0 w-[240px] md:w-full snap-start hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border mb-4"
                  style={{ borderColor: C.border, color: C.green }}
                >
                  {alt.label}
                </span>
                <p className="text-[11px] uppercase tracking-wider font-medium mb-0.5" style={{ color: C.muted }}>{alt.brand}</p>
                <h4 className="text-[14px] font-bold mb-4 leading-snug" style={{ color: C.green, fontFamily: "var(--font-koi-heading)" }}>{alt.name}</h4>
                <div className="space-y-1.5 mb-4">
                  <div className="flex justify-between text-[13px]">
                    <span style={{ color: C.muted }}>Protein</span>
                    <span className="font-semibold" style={{ color: C.green }}>{alt.protein}</span>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <span style={{ color: C.muted }}>Calories</span>
                    <span className="font-semibold" style={{ color: C.green }}>{alt.calories}</span>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <span style={{ color: C.muted }}>KOI Score</span>
                    <span className="font-bold" style={{ color: C.green }}>{alt.score}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: C.border }}>
                  <span className="font-bold" style={{ color: C.green, fontFamily: "var(--font-koi-heading)" }}>₹{alt.price}</span>
                  <span className="text-[12px] font-semibold flex items-center gap-1 group-hover:gap-2 transition-all" style={{ color: C.green }}>
                    View <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 9 — COMMUNITY REVIEWS ── */}
        <section className="mb-8">
          <h2 className="text-lg font-bold mb-2" style={{ color: C.green, fontFamily: "var(--font-koi-heading)" }}>Community</h2>
          <p className="text-[13px] mb-5" style={{ color: C.muted }}>What did people buy this for?</p>

          {/* Tags */}
          <div className="flex gap-2 overflow-x-auto pb-3 mb-5 hide-scrollbar">
            {["All", ...p.reviewTags].map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className="flex-shrink-0 px-4 py-2 rounded-full text-[13px] font-semibold border transition-all duration-200"
                style={{
                  background: activeTag === tag ? C.green : "transparent",
                  color: activeTag === tag ? "#fff" : C.green,
                  borderColor: activeTag === tag ? C.green : C.border,
                }}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Reviews */}
          <div className="space-y-4">
            {p.reviews
              .filter((r) => activeTag === "All" || r.tag === activeTag)
              .map((review, i) => (
                <div key={i} className="bg-white rounded-2xl border border-[#E2E8D8] p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold text-white" style={{ background: C.green, fontFamily: "var(--font-koi-heading)" }}>
                        {review.name[0]}
                      </div>
                      <div>
                        <p className="text-[14px] font-semibold" style={{ color: C.green }}>{review.name}</p>
                        <div className="flex items-center gap-1.5">
                          <div className="flex">
                            {[...Array(5)].map((_, j) => (
                              <Star key={j} className="w-3 h-3" fill={j < review.rating ? "#C8F23E" : "none"} stroke={j < review.rating ? "#C8F23E" : "#E2E8D8"} />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full border" style={{ borderColor: C.border, color: C.muted }}>
                      {review.tag}
                    </span>
                  </div>
                  <p className="text-[14px] leading-relaxed" style={{ color: C.muted }}>
                    {review.text}
                  </p>
                </div>
              ))}
          </div>
        </section>

      </main>

      {/* ── SECTION 10 — STICKY BOTTOM CTA (Mobile) ── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-xl border-t border-[#E2E8D8] px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs" style={{ color: C.muted }}>Price</p>
            <p className="text-xl font-bold" style={{ color: C.green, fontFamily: "var(--font-koi-heading)" }}>₹{p.price}</p>
          </div>
          <button className="flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-[15px] transition-all duration-300 hover:shadow-[0_8px_24px_rgba(14,64,50,0.2)]" style={{ background: C.green, color: "#fff", fontFamily: "var(--font-koi-body)" }}>
            <ShoppingBag className="w-4 h-4" />
            Add to Cart
          </button>
        </div>
      </div>

      {/* ── GLOBAL STYLES ── */}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
