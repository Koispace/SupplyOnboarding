"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  ShoppingBag,
  MapPin,
  ChevronDown,
  ArrowLeft,
  Heart,
  Plus,
  Check,
  Sparkles,
  Leaf,
  ShieldCheck,
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
};

// ─── MOCK DATA ───
const FILTERS = [
  "All",
  "Protein",
  "Snacks",
  "Breakfast",
  "Drinks",
  "Supplements",
  "Low Sugar",
  "Gut Health",
];

const ALL_PRODUCTS = [
  {
    id: 1,
    brand: "THE WHOLE TRUTH",
    name: "Peanut Butter Protein Bar",
    price: 90,
    weight: "52g",
    category: "Protein",
    score: 88,
    tags: ["10g protein", "No added sugar"],
    insight: "Clean ingredients",
    recommended: true,
  },
  {
    id: 2,
    brand: "TRUE ELEMENTS",
    name: "Whey Protein Isolate - Vanilla",
    price: 2499,
    weight: "1kg",
    category: "Protein",
    score: 94,
    tags: ["24g protein", "0 sugar"],
    insight: "High purity",
    recommended: true,
  },
  {
    id: 3,
    brand: "YOGABAR",
    name: "Dark Chocolate Peanut Butter",
    price: 449,
    weight: "400g",
    category: "Breakfast",
    score: 87,
    tags: ["No palm oil", "High protein"],
    insight: "Heart healthy",
  },
  {
    id: 4,
    brand: "EPIGAMIA",
    name: "Greek Yogurt - Blueberry",
    price: 85,
    weight: "120g",
    category: "Snacks",
    score: 82,
    tags: ["High protein", "Low fat"],
    insight: "Gut friendly",
  },
  {
    id: 5,
    brand: "SLURRP FARM",
    name: "Millet Dosa Mix",
    price: 149,
    weight: "150g",
    category: "Breakfast",
    score: 91,
    tags: ["100% natural", "No maida"],
    insight: "High fibre",
  },
  {
    id: 6,
    brand: "BORÉCHA",
    name: "Kombucha - Mango",
    price: 180,
    weight: "330ml",
    category: "Drinks",
    score: 89,
    tags: ["Probiotic", "Low calorie"],
    insight: "Immunity boost",
  },
  {
    id: 7,
    brand: "OZIVA",
    name: "Plant Protein - Unflavoured",
    price: 1699,
    weight: "500g",
    category: "Supplements",
    score: 96,
    tags: ["100% plant-based", "Clean label"],
    insight: "Allergen free",
    recommended: true,
  },
  {
    id: 8,
    brand: "FARMLEY",
    name: "Roasted Makhana - Himalayan Salt",
    price: 120,
    weight: "100g",
    category: "Snacks",
    score: 92,
    tags: ["Baked not fried", "Low GI"],
    insight: "Guilt-free snack",
  },
  {
    id: 9,
    brand: "TRUE ELEMENTS",
    name: "Rolled Oats",
    price: 299,
    weight: "1kg",
    category: "Breakfast",
    score: 95,
    tags: ["Gluten free", "High fibre"],
    insight: "Sustained energy",
  },
  {
    id: 10,
    brand: "PAPER BOAT",
    name: "Coconut Water",
    price: 60,
    weight: "200ml",
    category: "Drinks",
    score: 85,
    tags: ["No added sugar", "Electrolytes"],
    insight: "Natural hydration",
  },
  {
    id: 11,
    brand: "YOGABAR",
    name: "Protein Granola - Dark Choco",
    price: 349,
    weight: "400g",
    category: "Breakfast",
    score: 84,
    tags: ["15g protein", "Baked"],
    insight: "Crunchy texture",
  },
  {
    id: 12,
    brand: "PHAB",
    name: "Protein Milkshake - Classic Vanilla",
    price: 110,
    weight: "200ml",
    category: "Drinks",
    score: 81,
    tags: ["17g protein", "No added sugar"],
    insight: "On-the-go recovery",
  },
];

// ─── KOI SCORE RING ───
function KoiScore({ score, size = 32 }) {
  const r = (size - 4) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 90 ? "#0E4032" : score >= 80 ? "#2D7A5E" : "#B8860B";
  return (
    <div
      className="relative flex items-center justify-center bg-white rounded-full shadow-sm"
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
          strokeWidth="2"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <span
        className="text-[10px] font-bold"
        style={{ color, fontFamily: "var(--font-koi-heading)" }}
      >
        {score}
      </span>
    </div>
  );
}

// ─── PRODUCT CARD ───
function ProductCard({ product, onClick }) {
  const [added, setAdded] = useState(false);
  const [wishlist, setWishlist] = useState(false);

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-2xl border border-[#E2E8D8] overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgba(14,64,50,0.08)] hover:-translate-y-0.5 flex flex-col cursor-pointer h-full"
    >
      {/* Image area */}
      <div className="relative bg-gradient-to-br from-[#F2F6EC] to-[#E8EFE0] aspect-square flex items-center justify-center overflow-hidden">
        <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-white/60 backdrop-blur-sm flex items-center justify-center border border-[#E2E8D8]">
          <Leaf className="w-8 h-8 md:w-12 md:h-12 text-[#0E4032]/30" />
        </div>
        {/* Top-left: Score */}
        <div className="absolute top-2 left-2 md:top-3 md:left-3">
          <KoiScore score={product.score} />
        </div>
        {/* Top-right: Wishlist */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setWishlist(!wishlist);
          }}
          className="absolute top-2 right-2 md:top-3 md:right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center border border-[#E2E8D8] hover:bg-white transition-colors"
        >
          <Heart
            className="w-4 h-4 transition-colors"
            fill={wishlist ? "#C94B40" : "none"}
            color={wishlist ? "#C94B40" : C.green}
          />
        </button>
      </div>

      {/* Body */}
      <div className="p-3 md:p-4 flex flex-col flex-1">
        <p
          className="text-[10px] md:text-[11px] tracking-[0.08em] uppercase font-medium mb-1 line-clamp-1"
          style={{ color: C.muted }}
        >
          {product.brand}
        </p>
        <h4
          className="text-[13px] md:text-[15px] font-semibold leading-snug mb-2 line-clamp-2 min-h-[2.5rem]"
          style={{
            color: C.text,
            fontFamily: "var(--font-koi-heading)",
          }}
        >
          {product.name}
        </h4>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {product.tags.map((tag, i) => (
            <span
              key={i}
              className="text-[9px] md:text-[10px] font-medium px-2 py-0.5 rounded-md"
              style={{ background: "#F2F6EC", color: "#2D7A5E" }}
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex-1" />

        {/* Insight */}
        <div
          className="flex items-center gap-1.5 text-[11px] md:text-[12px] font-medium mb-3"
          style={{ color: "#2D7A5E" }}
        >
          <Check className="w-3 h-3 flex-shrink-0" />
          {product.insight}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-[#E2E8D8]">
          <div>
            <span
              className="text-base md:text-lg font-bold block leading-none"
              style={{
                color: C.green,
                fontFamily: "var(--font-koi-heading)",
              }}
            >
              ₹{product.price}
            </span>
            <span className="text-[10px] md:text-[11px]" style={{ color: C.muted }}>
              {product.weight}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setAdded(!added);
            }}
            className={`w-8 h-8 md:w-auto md:px-4 md:py-2 rounded-full flex items-center justify-center md:justify-start gap-1.5 text-[13px] font-semibold transition-all duration-300 ${
              added
                ? "bg-[#0E4032] text-white"
                : "bg-[#0E4032]/5 text-[#0E4032] hover:bg-[#0E4032] hover:text-white"
            }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4 md:w-3.5 md:h-3.5" />
                <span className="hidden md:inline">Added</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 md:w-3.5 md:h-3.5" />
                <span className="hidden md:inline">Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function StorefrontPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("All");

  const recommendedProducts = ALL_PRODUCTS.filter((p) => p.recommended);
  const displayedProducts =
    activeFilter === "All"
      ? ALL_PRODUCTS
      : ALL_PRODUCTS.filter((p) => p.category === activeFilter || p.tags.some(t => t.includes(activeFilter)));

  return (
    <div className="min-h-screen pb-12" style={{ background: C.bg }}>
      {/* ── SECTION 1 — HEADER ── */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#F2F6EC]/85 border-b border-[#E2E8D8]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-3 md:gap-6">
            <button
              onClick={() => router.push("/store")}
              className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/60 border border-[#E2E8D8] hover:bg-white transition-colors shrink-0"
            >
              <ArrowLeft className="w-5 h-5" style={{ color: C.green }} />
            </button>

            {/* Location (Desktop) */}
            <button
              className="hidden md:flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-xl bg-white/60 border border-[#E2E8D8] hover:bg-white transition-colors shrink-0"
              style={{ color: C.green }}
            >
              <MapPin className="w-4 h-4" />
              <div className="text-left">
                <span className="block text-[10px] uppercase tracking-wider opacity-70 leading-none mb-0.5">
                  Delivering to
                </span>
                <span className="block leading-none">Bengaluru</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 opacity-50 ml-1" />
            </button>

            {/* Search */}
            <div className="flex-1 max-w-2xl relative">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#5A6B5A]" />
              <input
                type="text"
                placeholder="Search by product, brand or goal"
                className="w-full pl-11 pr-4 py-2.5 md:py-3 bg-white border border-[#E2E8D8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0E4032]/20 focus:border-[#0E4032]/40 placeholder:text-[#5A6B5A]/60 shadow-sm"
                style={{ fontFamily: "var(--font-koi-body)" }}
              />
            </div>

            {/* Cart */}
            <button className="relative w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center bg-white border border-[#E2E8D8] hover:bg-gray-50 transition-colors shrink-0 shadow-sm">
              <ShoppingBag className="w-5 h-5" style={{ color: C.green }} />
              <span
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-[10px] font-bold text-white flex items-center justify-center border-2 border-[#F2F6EC]"
                style={{ background: C.lime, color: C.green }}
              >
                2
              </span>
            </button>
          </div>

          {/* Location (Mobile) */}
          <button
            className="md:hidden flex items-center gap-1.5 text-xs font-medium mt-3 pb-1"
            style={{ color: C.green }}
          >
            <MapPin className="w-3.5 h-3.5" />
            Delivering to Bengaluru
            <ChevronDown className="w-3 h-3 opacity-50" />
          </button>
        </div>
      </header>

      {/* ── SECTION 2 — FILTER CHIPS ── */}
      <div className="sticky top-[72px] md:top-[80px] z-40 bg-gradient-to-b from-[#F2F6EC] to-[#F2F6EC]/90 pt-4 pb-4 px-4 sm:px-6 lg:px-8 border-b border-[#E2E8D8]/50">
        <div className="max-w-7xl mx-auto flex gap-2.5 overflow-x-auto hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className="flex-shrink-0 px-4 py-1.5 rounded-full text-[13px] font-semibold border transition-all duration-200"
              style={{
                background: activeFilter === filter ? C.green : "white",
                color: activeFilter === filter ? "white" : C.green,
                borderColor: activeFilter === filter ? C.green : C.border,
                boxShadow:
                  activeFilter === filter
                    ? "0 4px 12px rgba(14,64,50,0.15)"
                    : "none",
              }}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ── SECTION 3 — RECOMMENDATION BANNER ── */}
        {activeFilter === "All" && (
          <section className="mb-12">
            <div
              className="bg-white rounded-3xl p-6 md:p-8 border shadow-[0_8px_30px_rgba(14,64,50,0.04)] relative overflow-hidden"
              style={{ borderColor: C.border }}
            >
              {/* Background accents */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#C8F23E]/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[#0E4032]/5 rounded-full blur-2xl" />

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-[#B8860B]" />
                    <span className="text-[12px] font-bold uppercase tracking-wider text-[#B8860B]">
                      Curated for you
                    </span>
                  </div>
                  <h2
                    className="text-2xl font-bold"
                    style={{
                      color: C.green,
                      fontFamily: "var(--font-koi-heading)",
                    }}
                  >
                    Recommended for you
                  </h2>
                  <p className="text-sm mt-1" style={{ color: C.muted }}>
                    Based on your focus on Protein and Gut Health
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 relative z-10">
                {recommendedProducts.slice(0, 3).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClick={() => router.push("/store/product")}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── SECTION 4 — PRODUCT GRID ── */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2
              className="text-xl font-bold"
              style={{
                color: C.green,
                fontFamily: "var(--font-koi-heading)",
              }}
            >
              {activeFilter === "All" ? "Explore Everything" : activeFilter}
            </h2>
            <span className="text-sm font-medium" style={{ color: C.muted }}>
              {displayedProducts.length} products
            </span>
          </div>

          {displayedProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5">
              {displayedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => router.push("/store/product")}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                <Search className="w-6 h-6" style={{ color: C.muted }} />
              </div>
              <h3
                className="text-lg font-bold mb-2"
                style={{
                  color: C.green,
                  fontFamily: "var(--font-koi-heading)",
                }}
              >
                No products found
              </h3>
              <p className="text-sm" style={{ color: C.muted }}>
                We couldn't find any products matching "{activeFilter}".
              </p>
              <button
                onClick={() => setActiveFilter("All")}
                className="mt-6 px-6 py-2.5 rounded-full font-semibold text-sm border transition-colors hover:bg-white"
                style={{ color: C.green, borderColor: C.border }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </section>
      </main>

      {/* ── GLOBAL STYLES ── */}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
