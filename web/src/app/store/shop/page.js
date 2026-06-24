"use client";

import React, { useState, useMemo, useEffect } from "react";
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
  Filter,
  SlidersHorizontal,
  X,
  TrendingUp,
  Target,
  Scale,
  Info
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";

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
];

const GOAL_COLLECTIONS = [
  { name: "High Protein", icon: TrendingUp },
  { name: "Low Sugar", icon: ShieldCheck },
  { name: "Gut Health", icon: Sparkles },
  { name: "Better Energy", icon: Target },
];

import { fetchAllProducts } from "@/lib/data/productFetcher";

// ─── OVERLAYS ───

// 1. Tooltip / Modal for KOI Score
function KoiScoreModal({ product, onClose }) {
  if (!product) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0E4032]/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-[0_20px_60px_rgba(14,64,50,0.15)] p-6 animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-bold text-[#0E4032] flex items-center gap-2" style={{ fontFamily: "var(--font-koi-heading)" }}>
              KOI Score: {product.score}<span className="text-[#5A6B5A] text-lg font-medium">/100</span>
            </h3>
            <p className="text-[13px] font-medium text-[#5A6B5A] mt-1">Independent nutrition analysis</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-[#F2F6EC] rounded-full transition-colors">
            <X className="w-5 h-5 text-[#5A6B5A]" />
          </button>
        </div>
        
        <div className="space-y-4 mb-6">
          {Object.entries(product.scoreBreakdown).map(([key, val]) => (
            <div key={key}>
              <div className="flex justify-between text-[13px] font-bold text-[#0E4032] mb-2">
                <span>{key}</span>
                <span>{val}/100</span>
              </div>
              <div className="w-full h-1.5 bg-[#F2F6EC] rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${val}%`, backgroundColor: val >= 90 ? "#0E4032" : val >= 80 ? "#2D7A5E" : "#B8860B" }} 
                />
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-[#E2E8D8] flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#C8F23E]/20 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 text-[#0E4032]" />
          </div>
          <p className="text-[14px] font-bold text-[#0E4032] leading-snug">
            Better than {product.betterThanPercentage}% of similar products
          </p>
        </div>
      </div>
    </div>
  );
}

// 2. Modal for Quick Compare
function CompareModal({ product, onClose }) {
  if (!product) return null;
  
  // Extract realistic tags if available, else fallback
  const pTag = product.tags.find(t => t.toLowerCase().includes("protein")) || "12g";
  const sTag = product.tags.find(t => t.toLowerCase().includes("sugar") || t.toLowerCase().includes("sugar")) || "2g";

  const metrics = [
    { label: "Protein", prod: pTag.split(" ")[0], avg: product.categoryAverage.Protein },
    { label: "Sugar", prod: sTag.includes("0") || sTag.includes("No") ? "0g" : "4g", avg: product.categoryAverage.Sugar },
    { label: "Fibre", prod: product.categoryAverage.Fibre === "0g" ? "0g" : "3g", avg: product.categoryAverage.Fibre },
    { label: "Additives", prod: product.scoreBreakdown.Additives >= 90 ? "Low" : "Med", avg: product.categoryAverage.Additives }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0E4032]/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-[0_20px_60px_rgba(14,64,50,0.15)] overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-[#E2E8D8] flex justify-between items-center bg-[#F2F6EC]/30">
          <h3 className="text-lg font-bold text-[#0E4032] flex items-center gap-2" style={{ fontFamily: "var(--font-koi-heading)" }}>
            <Scale className="w-5 h-5" />
            Quick Compare
          </h3>
          <button onClick={onClose} className="p-1.5 hover:bg-[#E2E8D8]/50 rounded-full transition-colors">
            <X className="w-5 h-5 text-[#5A6B5A]" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-[#5A6B5A] mb-4 px-2">
            <span className="w-1/3">Metric</span>
            <span className="w-1/3 text-center text-[#0E4032] line-clamp-1">{product.brand}</span>
            <span className="w-1/3 text-right">Avg</span>
          </div>

          <div className="space-y-2 mb-6">
            {metrics.map(m => (
              <div key={m.label} className="flex justify-between items-center py-2.5 px-3 bg-[#F2F6EC]/50 rounded-xl border border-[#E2E8D8]/50">
                <span className="w-1/3 text-[13px] font-bold text-[#5A6B5A]">{m.label}</span>
                <span className="w-1/3 text-center text-[14px] font-bold text-[#0E4032]">{m.prod}</span>
                <span className="w-1/3 text-right text-[13px] font-semibold text-[#5A6B5A]">{m.avg}</span>
              </div>
            ))}
          </div>

          <div className="p-4 bg-[#F2F6EC] rounded-xl flex gap-3 items-start border border-[#E2E8D8]">
            <Info className="w-5 h-5 text-[#0E4032] shrink-0 mt-0.5" />
            <p className="text-[13px] font-medium text-[#0E4032] leading-relaxed">
              {product.compareInsight}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 3. Drawer for Why KOI Likes This
function WhyKoiLikesDrawer({ product, onClose }) {
  if (!product) return null;
  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div className="absolute inset-0 bg-[#0E4032]/20 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white h-full flex flex-col shadow-[0_0_60px_rgba(14,64,50,0.2)] animate-in slide-in-from-right duration-300">
        
        <div className="flex items-center justify-between p-6 border-b border-[#E2E8D8] bg-[#F2F6EC]/30">
          <div>
            <h3 className="text-xl font-bold text-[#0E4032] mb-1" style={{ fontFamily: "var(--font-koi-heading)" }}>
              Why KOI likes this
            </h3>
            <p className="text-[13px] font-medium text-[#5A6B5A] uppercase tracking-wider">{product.brand}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#E2E8D8]/50 rounded-full transition-colors">
            <X className="w-5 h-5 text-[#5A6B5A]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Strengths */}
          <div>
            <h4 className="text-[15px] font-bold text-[#0E4032] flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-full bg-[#C8F23E]/30 flex items-center justify-center">
                <Check className="w-4 h-4 text-[#0E4032]" />
              </div>
              Strengths
            </h4>
            <ul className="space-y-4">
              {product.strengths.map((str, i) => (
                <li key={i} className="text-[14px] font-medium text-[#0E4032]/80 flex items-start gap-3">
                  <span className="text-[#2D7A5E] mt-1 text-[10px]">●</span>
                  <span className="leading-relaxed">{str}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="h-px w-full bg-[#E2E8D8]" />

          {/* Watch-outs */}
          <div>
            <h4 className="text-[15px] font-bold text-[#B8860B] flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-full bg-[#B8860B]/10 flex items-center justify-center">
                <Info className="w-4 h-4 text-[#B8860B]" />
              </div>
              Watch-outs
            </h4>
            <ul className="space-y-4">
              {product.watchouts.map((w, i) => (
                <li key={i} className="text-[14px] font-medium text-[#0E4032]/80 flex items-start gap-3">
                  <span className="text-[#B8860B] mt-1 text-[10px]">●</span>
                  <span className="leading-relaxed">{w}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="p-6 border-t border-[#E2E8D8] bg-[#F2F6EC]/50 text-center">
          <p className="text-[11px] font-medium text-[#5A6B5A] uppercase tracking-wide">
            Verified by KOI Intelligence
          </p>
        </div>

      </div>
    </div>
  );
}


// ─── KOI SCORE RING ───
function KoiScore({ score, size = 32 }) {
  const r = (size - 4) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 90 ? "#0E4032" : score >= 80 ? "#2D7A5E" : "#B8860B";
  return (
    <div
      className="relative flex items-center justify-center bg-white rounded-full shadow-sm group-hover:shadow-md transition-shadow"
      style={{ width: size, height: size }}
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0 -rotate-90"
      >
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E2E8D8" strokeWidth="2" />
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
function ProductCard({ product, onClick, onOpenScore, onOpenCompare, onOpenInsight, className = "" }) {
  const items = useCartStore(state => state.items);
  const addToCart = useCartStore(state => state.addToCart);
  const increaseQty = useCartStore(state => state.increaseQty);
  const decreaseQty = useCartStore(state => state.decreaseQty);

  const [wishlist, setWishlist] = useState(false);

  const cartItem = items.find(item => item.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  return (
    <div
      onClick={onClick}
      className={`group bg-white rounded-2xl border border-[#E2E8D8] overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgba(14,64,50,0.08)] hover:-translate-y-0.5 flex flex-col cursor-pointer h-full ${className}`}
    >
      {/* Image area */}
      <div className="relative bg-[#F2F6EC] aspect-square flex items-center justify-center overflow-hidden">
        {product.image?.hero ? (
          <img 
            src={product.image.hero} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-white/60 backdrop-blur-sm flex items-center justify-center border border-[#E2E8D8]">
            <Leaf className="w-8 h-8 md:w-12 md:h-12 text-[#0E4032]/30" />
          </div>
        )}
        
        {/* Top-left: Interactive KOI Score */}
        <div 
          className="absolute top-2 left-2 md:top-3 md:left-3 cursor-pointer hover:scale-105 transition-transform z-10"
          onClick={(e) => { e.stopPropagation(); onOpenScore(product); }}
        >
          <KoiScore score={product.score} />
        </div>
        
        {/* Top-right: Wishlist */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setWishlist(!wishlist);
          }}
          className="absolute top-2 right-2 md:top-3 md:right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center border border-[#E2E8D8] hover:bg-white transition-colors z-10"
        >
          <Heart
            className="w-4 h-4 transition-colors"
            fill={wishlist ? "#C94B40" : "none"}
            color={wishlist ? "#C94B40" : C.green}
          />
        </button>
      </div>

      {/* Body */}
      <div className="p-3 md:p-4 flex flex-col flex-1 min-w-[200px]">
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

        {/* Intelligence Layer Interactions */}
        <div className="mb-3 space-y-2.5">
          {/* Clickable Insight */}
          <button 
            onClick={(e) => { e.stopPropagation(); onOpenInsight(product); }}
            className="flex items-start gap-1.5 text-[11px] md:text-[12px] font-bold text-left hover:text-[#0E4032] transition-colors w-full group/insight"
            style={{ color: "#2D7A5E" }}
          >
            <Check className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 group-hover/insight:scale-110 transition-transform" />
            <span className="leading-snug underline decoration-[#2D7A5E]/30 underline-offset-4 group-hover/insight:decoration-[#0E4032]/50">
              {product.insight}
            </span>
          </button>
          
          {/* Compare Button */}
          <button 
            onClick={(e) => { e.stopPropagation(); onOpenCompare(product); }}
            className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#5A6B5A] hover:text-[#0E4032] transition-colors w-fit"
          >
            <Scale className="w-3 h-3" />
            Compare
          </button>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-[#E2E8D8] h-[52px]">
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
          
          {quantity > 0 ? (
            <div 
              className="flex items-center gap-3 bg-[#0E4032] text-white rounded-full px-1.5 py-1 animate-in fade-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => decreaseQty(product.id)}
                className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors shrink-0"
              >
                <span className="text-sm font-bold leading-none -mt-0.5">-</span>
              </button>
              <span className="text-[13px] font-bold w-4 text-center">{quantity}</span>
              <button 
                onClick={() => increaseQty(product.id)}
                className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors shrink-0"
              >
                <Plus className="w-3 h-3 md:w-3.5 md:h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product);
              }}
              className="w-8 h-8 md:w-auto md:px-4 md:py-2 rounded-full flex items-center justify-center md:justify-start gap-1.5 text-[13px] font-semibold transition-all duration-300 bg-[#0E4032]/5 text-[#0E4032] hover:bg-[#0E4032] hover:text-white"
            >
              <Plus className="w-4 h-4 md:w-3.5 md:h-3.5" />
              <span className="hidden md:inline">Add</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── STICKY MINI CART ───
function StickyMiniCart() {
  const items = useCartStore(state => state.items);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  const router = useRouter();

  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 md:bottom-6 md:right-8 md:left-auto md:w-[340px] z-[90] animate-in slide-in-from-bottom-8 duration-300 pb-safe md:pb-0">
      <div className="bg-white m-4 md:m-0 rounded-2xl shadow-[0_12px_40px_rgba(14,64,50,0.15)] border border-[#E2E8D8] p-4 flex items-center justify-between transition-all">
        <div className="flex flex-col">
          <span className="text-[11px] font-bold text-[#5A6B5A] uppercase tracking-wider mb-0.5 flex items-center gap-1">
            <ShoppingBag className="w-3 h-3" />
            {totalItems} item{totalItems > 1 ? "s" : ""}
          </span>
          <span className="text-lg font-bold text-[#0E4032] leading-none" style={{ fontFamily: "var(--font-koi-heading)" }}>
            ₹{subtotal.toLocaleString()}
          </span>
        </div>
        <button
          onClick={() => router.push("/store/cart")}
          className="px-5 py-3 rounded-xl bg-[#0E4032] text-white text-[13px] font-bold shadow-md hover:bg-[#0E4032]/90 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2 group"
        >
          View Cart 
          <span className="text-lg leading-none group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </div>
    </div>
  );
}

export default function StorefrontPage() {
  const router = useRouter();
  
  // Cart State
  const items = useCartStore(state => state.items);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  // Filter & Navigation State
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeGoal, setActiveGoal] = useState(null);
  const [activeSort, setActiveSort] = useState("Recommended");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Real Data State
  const [dbProducts, setDbProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await fetchAllProducts();
      setDbProducts(data);
      setLoadingProducts(false);
    }
    load();
  }, []);
  
  // Overlay Modals State (Intelligence Features)
  const [selectedScoreProduct, setSelectedScoreProduct] = useState(null);
  const [selectedCompareProduct, setSelectedCompareProduct] = useState(null);
  const [selectedInsightProduct, setSelectedInsightProduct] = useState(null);

  // Filter Drawer State
  const [filterPrice, setFilterPrice] = useState("All");
  const [filterScore, setFilterScore] = useState("All");
  const [filterDietary, setFilterDietary] = useState([]);

  // Filter Logic
  const filteredProducts = useMemo(() => {
    return dbProducts.filter((p) => {
      // Category
      if (activeCategory !== "All" && p.category !== activeCategory) return false;
      
      // Goal
      if (activeGoal && !p.goalTags.includes(activeGoal)) return false;
      
      // Drawer Filters: Price
      if (filterPrice !== "All") {
        if (filterPrice === "Under ₹200" && p.price >= 200) return false;
        if (filterPrice === "₹200–500" && (p.price < 200 || p.price > 500)) return false;
        if (filterPrice === "₹500+" && p.price <= 500) return false;
      }
      
      // Drawer Filters: Score
      if (filterScore !== "All") {
        const minScore = parseInt(filterScore.replace("+", ""), 10);
        if (p.score < minScore) return false;
      }
      
      // Drawer Filters: Dietary
      if (filterDietary.length > 0) {
        const hasAllDietary = filterDietary.every(d => p.dietary.includes(d));
        if (!hasAllDietary) return false;
      }
      
      return true;
    }).sort((a, b) => {
      if (activeSort === "Highest KOI Score") return b.score - a.score;
      if (activeSort === "Price Low to High") return a.price - b.price;
      if (activeSort === "Newest") return b.id - a.id;
      // Recommended default
      if (activeSort === "Recommended") {
        return (b.recommended ? 1 : 0) - (a.recommended ? 1 : 0);
      }
      return 0;
    });
  }, [activeCategory, activeGoal, filterPrice, filterScore, filterDietary, activeSort, dbProducts]);

  const recommendedProducts = dbProducts.filter((p) => p.recommended);
  const topProducts = [...dbProducts].filter((p) => p.score >= 90).sort((a, b) => b.score - a.score);

  const toggleDietary = (item) => {
    setFilterDietary(prev => 
      prev.includes(item) ? prev.filter(d => d !== item) : [...prev, item]
    );
  };

  const clearFilters = () => {
    setFilterPrice("All");
    setFilterScore("All");
    setFilterDietary([]);
    setIsFilterOpen(false);
  };

  const activeFilterCount = (filterPrice !== "All" ? 1 : 0) + (filterScore !== "All" ? 1 : 0) + filterDietary.length;

  if (loadingProducts) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: C.bg }}>
        <div className="animate-pulse flex flex-col items-center">
          <Leaf className="w-8 h-8 text-[#0E4032] mb-4 animate-bounce" />
          <p className="text-[#0E4032] font-medium" style={{ fontFamily: "var(--font-koi-body)" }}>Loading KOI Intelligence...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 md:pb-12 relative" style={{ background: C.bg }}>
      {/* ── HEADER ── */}
      <main className="max-w-7xl mx-auto py-6 md:py-8">
        
        {/* ── SEARCH & LOCATION ── */}
        <div className="px-4 sm:px-6 lg:px-8 mb-8 flex flex-col md:flex-row gap-4 items-start md:items-center">
           <div className="flex-1 w-full relative">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#5A6B5A]" />
              <input
                type="text"
                placeholder="Search by product, brand or goal"
                className="w-full pl-11 pr-4 py-2.5 md:py-3 bg-white border border-[#E2E8D8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0E4032]/20 focus:border-[#0E4032]/40 placeholder:text-[#5A6B5A]/60 shadow-sm"
                style={{ fontFamily: "var(--font-koi-body)" }}
              />
           </div>
           
           <button
              className="flex items-center justify-between w-full md:w-auto gap-3 text-sm font-medium px-4 py-2.5 md:py-2 rounded-xl bg-white border border-[#E2E8D8] hover:bg-[#F2F6EC] transition-colors shrink-0 shadow-sm"
              style={{ color: C.green }}
           >
              <div className="flex items-center gap-2">
                 <MapPin className="w-4 h-4" />
                 <div className="text-left">
                   <span className="block text-[9px] uppercase tracking-wider opacity-70 leading-none mb-0.5">
                     Delivering to
                   </span>
                   <span className="block leading-none font-bold">Bengaluru</span>
                 </div>
              </div>
              <ChevronDown className="w-4 h-4 opacity-50 ml-1" />
           </button>
        </div>

        {/* ── DISCOVERY SHELVES ── */}
        <section className="px-4 sm:px-6 lg:px-8 mb-10 space-y-12">
          
          {/* Section 1: Recommended For You */}
          <div>
            <div className="mb-4">
              <h2 className="text-xl md:text-2xl font-bold" style={{ color: C.green, fontFamily: "var(--font-koi-heading)" }}>
                Recommended For You
              </h2>
              <p className="text-sm font-medium" style={{ color: C.muted }}>Based on your health goals</p>
            </div>
            <div className="flex overflow-x-auto hide-scrollbar gap-4 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
              {recommendedProducts.map((product) => (
                <div key={product.id} className="w-[260px] md:w-[300px] flex-shrink-0">
                  <ProductCard 
                    product={product} 
                    onClick={() => router.push(`/store/product/${product.id}`)} 
                    onOpenScore={setSelectedScoreProduct}
                    onOpenCompare={setSelectedCompareProduct}
                    onOpenInsight={setSelectedInsightProduct}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Earned Its Place This Week */}
          <div>
            <div className="mb-4">
              <h2 className="text-xl md:text-2xl font-bold" style={{ color: C.green, fontFamily: "var(--font-koi-heading)" }}>
                Earned Its Place This Week
              </h2>
              <p className="text-sm font-medium" style={{ color: C.muted }}>Top of the KOI standard</p>
            </div>
            <div className="flex overflow-x-auto hide-scrollbar gap-4 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
              {topProducts.map((product) => (
                <div key={product.id} className="w-[260px] md:w-[300px] flex-shrink-0">
                  <ProductCard 
                    product={product} 
                    onClick={() => router.push(`/store/product/${product.id}`)} 
                    onOpenScore={setSelectedScoreProduct}
                    onOpenCompare={setSelectedCompareProduct}
                    onOpenInsight={setSelectedInsightProduct}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Goal Collections */}
          <div>
             <div className="mb-4">
              <h2 className="text-xl md:text-2xl font-bold" style={{ color: C.green, fontFamily: "var(--font-koi-heading)" }}>
                Goal Collections
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {GOAL_COLLECTIONS.map((goal) => {
                const Icon = goal.icon;
                const isActive = activeGoal === goal.name;
                return (
                  <button
                    key={goal.name}
                    onClick={() => setActiveGoal(isActive ? null : goal.name)}
                    className={`flex flex-col items-center justify-center p-6 rounded-2xl border transition-all duration-300 ${
                      isActive 
                      ? 'bg-[#0E4032] border-[#0E4032] shadow-[0_8px_30px_rgba(14,64,50,0.15)]' 
                      : 'bg-white border-[#E2E8D8] hover:border-[#0E4032]/30 hover:shadow-sm'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${isActive ? 'bg-[#C8F23E]/20' : 'bg-[#F2F6EC]'}`}>
                      <Icon className={`w-6 h-6 ${isActive ? 'text-[#C8F23E]' : 'text-[#0E4032]'}`} />
                    </div>
                    <span className={`text-[13px] font-bold ${isActive ? 'text-white' : 'text-[#0E4032]'}`} style={{ fontFamily: "var(--font-koi-heading)" }}>
                      {goal.name}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── STICKY FILTER BAR ── */}
        <div className="sticky top-[72px] md:top-[80px] z-40 bg-gradient-to-b from-[#F2F6EC] to-[#F2F6EC]/95 backdrop-blur-sm pt-4 pb-4 px-4 sm:px-6 lg:px-8 border-b border-[#E2E8D8]/50 flex items-center justify-between gap-4">
          
          <div className="flex-1 flex gap-2.5 overflow-x-auto hide-scrollbar mr-4">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveCategory(filter)}
                className="flex-shrink-0 px-4 py-1.5 rounded-full text-[13px] font-semibold border transition-all duration-200"
                style={{
                  background: activeCategory === filter ? C.green : "white",
                  color: activeCategory === filter ? "white" : C.green,
                  borderColor: activeCategory === filter ? C.green : C.border,
                  boxShadow:
                    activeCategory === filter
                      ? "0 4px 12px rgba(14,64,50,0.15)"
                      : "none",
                }}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0 relative">
            {/* Sort Dropdown Toggle */}
            <div className="relative">
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white border border-[#E2E8D8] rounded-xl text-[13px] font-semibold hover:bg-gray-50 transition-colors"
                style={{ color: C.green }}
              >
                <span className="hidden md:inline">Sort: {activeSort}</span>
                <SlidersHorizontal className="w-4 h-4 md:hidden" />
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {isSortOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsSortOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-[#E2E8D8] rounded-xl shadow-lg z-50 overflow-hidden py-1">
                    {["Recommended", "Highest KOI Score", "Price Low to High", "Newest"].map((sortOption) => (
                      <button
                        key={sortOption}
                        onClick={() => {
                          setActiveSort(sortOption);
                          setIsSortOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-[13px] font-medium transition-colors ${activeSort === sortOption ? "bg-[#F2F6EC] text-[#0E4032]" : "text-[#5A6B5A] hover:bg-gray-50"}`}
                      >
                        {sortOption}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white border border-[#E2E8D8] rounded-xl text-[13px] font-semibold hover:bg-gray-50 transition-colors relative"
              style={{ color: C.green }}
            >
              <Filter className="w-4 h-4" />
              <span className="hidden md:inline">Filter</span>
              {activeFilterCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#C8F23E] text-[#0E4032] flex items-center justify-center text-[10px] font-bold border border-[#F2F6EC]">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ── MAIN PRODUCT GRID ── */}
        <section className="px-4 sm:px-6 lg:px-8 mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2
              className="text-xl font-bold"
              style={{
                color: C.green,
                fontFamily: "var(--font-koi-heading)",
              }}
            >
              {activeCategory === "All" && !activeGoal ? "All Products" : activeGoal || activeCategory}
            </h2>
            <span className="text-sm font-medium" style={{ color: C.muted }}>
              {filteredProducts.length} products
            </span>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => router.push(`/store/product/${product.id}`)}
                  onOpenScore={setSelectedScoreProduct}
                  onOpenCompare={setSelectedCompareProduct}
                  onOpenInsight={setSelectedInsightProduct}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 border border-[#E2E8D8]">
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
                Try adjusting your filters or search terms.
              </p>
              <button
                onClick={() => {
                  setActiveCategory("All");
                  setActiveGoal(null);
                  clearFilters();
                }}
                className="mt-6 px-6 py-2.5 rounded-full font-semibold text-sm border transition-colors hover:bg-white"
                style={{ color: C.green, borderColor: C.border }}
              >
                Clear All Filters
              </button>
            </div>
          )}
        </section>
      </main>

      {/* ── FILTER DRAWER ── */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div 
            className="absolute inset-0 bg-[#0E4032]/20 backdrop-blur-sm transition-opacity"
            onClick={() => setIsFilterOpen(false)}
          />
          <div className="relative w-full max-w-sm bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between p-5 border-b border-[#E2E8D8]">
              <h3 className="text-lg font-bold" style={{ color: C.green, fontFamily: "var(--font-koi-heading)" }}>
                Filters
              </h3>
              <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-[#F2F6EC] rounded-full transition-colors">
                <X className="w-5 h-5" style={{ color: C.muted }} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-8">
              {/* Price Filter */}
              <div>
                <h4 className="text-[13px] font-bold uppercase tracking-wider mb-3" style={{ color: C.muted }}>Price</h4>
                <div className="flex flex-col gap-2">
                  {["All", "Under ₹200", "₹200–500", "₹500+"].map(price => (
                    <label key={price} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${filterPrice === price ? 'border-[#0E4032]' : 'border-[#E2E8D8] group-hover:border-[#0E4032]/50'}`}>
                        {filterPrice === price && <div className="w-2 h-2 rounded-full bg-[#0E4032]" />}
                      </div>
                      <span className="text-[14px] font-medium" style={{ color: C.text }}>{price}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Score Filter */}
              <div>
                <h4 className="text-[13px] font-bold uppercase tracking-wider mb-3" style={{ color: C.muted }}>KOI Score</h4>
                <div className="flex gap-2">
                  {["All", "90+", "80+", "70+"].map(score => (
                    <button 
                      key={score}
                      onClick={() => setFilterScore(score)}
                      className={`flex-1 py-2 rounded-lg text-[13px] font-semibold border transition-all ${filterScore === score ? 'bg-[#0E4032] text-white border-[#0E4032]' : 'bg-white text-[#0E4032] border-[#E2E8D8] hover:border-[#0E4032]/30'}`}
                    >
                      {score}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dietary Filter */}
              <div>
                <h4 className="text-[13px] font-bold uppercase tracking-wider mb-3" style={{ color: C.muted }}>Dietary</h4>
                <div className="flex flex-wrap gap-2">
                  {["Vegan", "Gluten Free", "Keto", "No Added Sugar"].map(diet => {
                    const isSelected = filterDietary.includes(diet);
                    return (
                      <button 
                        key={diet}
                        onClick={() => toggleDietary(diet)}
                        className={`px-3 py-1.5 rounded-full text-[13px] font-medium border transition-all ${isSelected ? 'bg-[#C8F23E] text-[#0E4032] border-[#C8F23E]' : 'bg-white text-[#5A6B5A] border-[#E2E8D8] hover:border-[#0E4032]/30'}`}
                      >
                        {diet}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-[#E2E8D8] flex gap-3 bg-[#F2F6EC]/50">
              <button onClick={clearFilters} className="flex-1 py-3 rounded-xl font-semibold text-[14px] border border-[#E2E8D8] bg-white hover:bg-gray-50 transition-colors" style={{ color: C.text }}>
                Clear
              </button>
              <button onClick={() => setIsFilterOpen(false)} className="flex-[2] py-3 rounded-xl font-semibold text-[14px] bg-[#0E4032] text-white hover:bg-[#0E4032]/90 transition-colors shadow-sm">
                Show Results
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── INTELLIGENCE OVERLAYS ── */}
      <KoiScoreModal 
        product={selectedScoreProduct} 
        onClose={() => setSelectedScoreProduct(null)} 
      />
      
      <CompareModal 
        product={selectedCompareProduct} 
        onClose={() => setSelectedCompareProduct(null)} 
      />
      
      <WhyKoiLikesDrawer 
        product={selectedInsightProduct} 
        onClose={() => setSelectedInsightProduct(null)} 
      />

      {/* ── STICKY MINI CART ── */}
      <StickyMiniCart />

      {/* ── GLOBAL STYLES ── */}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .pb-safe {
          padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>
    </div>
  );
}
