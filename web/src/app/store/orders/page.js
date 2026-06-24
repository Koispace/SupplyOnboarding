"use client";

import React, { useState } from "react";
import { 
  ArrowLeft, 
  Package, 
  MapPin,
  CreditCard,
  ChevronRight,
  Sparkles,
  Info,
  Clock,
  CheckCircle2,
  X,
  Headset,
  RotateCcw,
  ShoppingBag
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";

// ─── KOI SCORE RING ───
function KoiScore({ score, size = 32 }) {
  if (score === undefined || score === null) return null;
  const r = (size - 4) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 90 ? "#0E4032" : score >= 80 ? "#2D7A5E" : "#B8860B";
  return (
    <div
      className="relative flex items-center justify-center bg-[#F2F6EC] rounded-full shadow-[0_2px_8px_rgba(14,64,50,0.08)]"
      style={{ width: size, height: size }}
    >
      <svg viewBox={`0 0 ${size} ${size}`} className="absolute inset-0 -rotate-90">
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
      <span className="text-[9px] font-bold" style={{ color, fontFamily: "var(--font-koi-heading)" }}>
        {score}
      </span>
    </div>
  );
}

// ─── MOCK DATA ───
const MOCK_ACTIVE_ORDERS = [
  {
    id: "KOI-20391",
    status: "Out for Delivery",
    eta: "Delivered by 7:30 PM",
    date: "Today",
    total: 430,
    items: [
      { id: 1, brand: "THE WHOLE TRUTH", name: "Double Cocoa Protein Bar", quantity: 2, price: 100, score: 94 },
      { id: 2, brand: "EPIGAMIA", name: "Greek Yogurt - Natural", quantity: 1, price: 80, score: 92 },
      { id: 3, brand: "FARMLEY", name: "Premium Roasted Makhana", quantity: 1, price: 150, score: 88 },
    ],
    address: {
      type: "Home",
      line1: "Road No 12, Banjara Hills",
      line2: "Hyderabad, Telangana"
    },
    payment: "UPI"
  }
];

const MOCK_PAST_ORDERS = [
  {
    id: "KOI-19842",
    status: "Delivered",
    date: "12 Oct 2023",
    total: 859,
    items: [
      { id: 4, brand: "TRUE ELEMENTS", name: "7 in 1 Super Seeds Mix", quantity: 1, price: 299, score: 96 },
      { id: 5, brand: "OPEN SECRET", name: "Unjunked Chocolate Cookies", quantity: 2, price: 100, score: 85 },
      { id: 6, brand: "BORÉCHA", name: "Kombucha - Mixed Berry", quantity: 2, price: 180, score: 88 },
    ],
    address: {
      type: "Home",
      line1: "Road No 12, Banjara Hills",
      line2: "Hyderabad, Telangana"
    },
    payment: "Card"
  }
];

const TRACKER_STEPS = ["Confirmed", "Packed", "Out for Delivery", "Delivered"];

export default function OrdersPage() {
  const router = useRouter();
  const addToCart = useCartStore(state => state.addToCart);
  const clearCart = useCartStore(state => state.clearCart);

  // State
  const [activeTab, setActiveTab] = useState("active"); // 'active' | 'past'
  const [selectedOrder, setSelectedOrder] = useState(null); // The order object for Drawer

  const displayedOrders = activeTab === "active" ? MOCK_ACTIVE_ORDERS : MOCK_PAST_ORDERS;

  // Reorder Basket
  const handleReorder = (order) => {
    clearCart();
    order.items.forEach(item => {
      // Mocking Add to Cart format
      addToCart({
        id: item.id,
        brand: item.brand,
        name: item.name,
        price: item.price,
        score: item.score,
        quantity: item.quantity,
        tags: [],
        dietary: []
      });
    });
    router.push("/store/cart");
  };

  // ─── COMPONENT: DELIVERY TRACKER ───
  const DeliveryTracker = ({ currentStatus }) => {
    const currentIndex = TRACKER_STEPS.indexOf(currentStatus) === -1 ? 2 : TRACKER_STEPS.indexOf(currentStatus);

    return (
      <div className="mt-6 mb-2 relative px-2">
         {/* Connecting Line */}
         <div className="absolute top-3 left-6 right-6 h-0.5 bg-[#E2E8D8] rounded-full z-0" />
         <div 
           className="absolute top-3 left-6 h-0.5 bg-[#0E4032] rounded-full z-0 transition-all duration-700 ease-out" 
           style={{ width: `${(currentIndex / (TRACKER_STEPS.length - 1)) * 100}%` }}
         />
         
         {/* Steps */}
         <div className="relative z-10 flex justify-between">
           {TRACKER_STEPS.map((step, idx) => {
             const isCompleted = idx <= currentIndex;
             const isActive = idx === currentIndex;
             return (
               <div key={step} className="flex flex-col items-center gap-2">
                 <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-500 ${
                   isCompleted ? "bg-[#0E4032] shadow-md" : "bg-white border-2 border-[#E2E8D8]"
                 }`}>
                   {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-[#C8F23E]" />}
                 </div>
                 <span className={`text-[10px] uppercase tracking-wider font-bold text-center w-16 leading-tight ${
                   isActive ? "text-[#0E4032]" : isCompleted ? "text-[#5A6B5A]" : "text-[#5A6B5A]/40"
                 }`}>
                   {step}
                 </span>
               </div>
             )
           })}
         </div>
      </div>
    );
  };

  // ─── EMPTY STATE ───
  if (MOCK_ACTIVE_ORDERS.length === 0 && MOCK_PAST_ORDERS.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F2F6EC]">
        <div className="pt-6" />
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 border border-[#E2E8D8]">
            <Package className="w-10 h-10 text-[#0E4032]/30" />
          </div>
          <h2 className="text-2xl font-bold text-[#0E4032] mb-2" style={{ fontFamily: "var(--font-koi-heading)" }}>No orders yet</h2>
          <p className="text-[#5A6B5A] font-medium mb-8 max-w-md">
            Start discovering products that earned their place through independent testing.
          </p>
          <button onClick={() => router.push("/store/shop")} className="px-8 py-3.5 rounded-xl font-bold text-white bg-[#0E4032] hover:bg-[#0E4032]/90 shadow-md transition-all">
            Start Shopping
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32 md:pb-16 bg-[#F2F6EC] relative">
      {/* ── TABS ONLY ── */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-[#F2F6EC]/85 border-b border-[#E2E8D8]/60 pt-4">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-6 border-b border-[#E2E8D8]/60">
           <button 
             onClick={() => setActiveTab("active")}
             className={`pb-3 text-[14px] font-bold uppercase tracking-wider transition-colors relative ${
               activeTab === "active" ? "text-[#0E4032]" : "text-[#5A6B5A]/60 hover:text-[#5A6B5A]"
             }`}
           >
             Active
             {activeTab === "active" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0E4032] rounded-t-full" />}
           </button>
           <button 
             onClick={() => setActiveTab("past")}
             className={`pb-3 text-[14px] font-bold uppercase tracking-wider transition-colors relative ${
               activeTab === "past" ? "text-[#0E4032]" : "text-[#5A6B5A]/60 hover:text-[#5A6B5A]"
             }`}
           >
             Past
             {activeTab === "past" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0E4032] rounded-t-full" />}
           </button>
        </div>
      </div>

      {/* ── MAIN LAYOUT ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Orders List */}
          <div className="lg:col-span-8 space-y-6">
             {displayedOrders.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-[#E2E8D8]">
                   <p className="text-[#5A6B5A] font-bold">No {activeTab} orders found.</p>
                </div>
             ) : (
                displayedOrders.map(order => (
                  <div key={order.id} className="bg-white rounded-2xl border border-[#E2E8D8] p-5 md:p-6 shadow-[0_2px_10px_rgba(14,64,50,0.02)] animate-in slide-in-from-bottom-4 duration-300">
                     
                     <div className="flex justify-between items-start mb-4 pb-4 border-b border-[#E2E8D8]">
                        <div>
                           <p className="text-[11px] font-bold text-[#5A6B5A] uppercase tracking-wider mb-1">Order ID: {order.id}</p>
                           <h3 className="text-lg font-bold text-[#0E4032]" style={{ fontFamily: "var(--font-koi-heading)" }}>{order.status}</h3>
                           <p className="text-[13px] font-semibold text-[#2D7A5E] mt-0.5">{order.eta || order.date}</p>
                        </div>
                        <div className="text-right">
                           <span className="text-[18px] font-bold text-[#0E4032]" style={{ fontFamily: "var(--font-koi-heading)" }}>₹{order.total}</span>
                           <p className="text-[11px] font-bold text-[#5A6B5A] uppercase tracking-wider mt-1">{order.items.length} Items</p>
                        </div>
                     </div>

                     <div className="mb-6">
                        <p className="text-[13px] text-[#5A6B5A] leading-relaxed line-clamp-2 pr-4 font-medium">
                           <span className="font-bold text-[#0E4032]">Contains: </span>
                           {order.items.map(i => `${i.name} ×${i.quantity}`).join(", ")}
                        </p>
                     </div>

                     {activeTab === "active" && <DeliveryTracker currentStatus={order.status} />}

                     <div className={`mt-6 pt-4 border-t border-[#E2E8D8] flex gap-3 ${activeTab === "active" ? "flex-col sm:flex-row" : "flex-row"}`}>
                        <button 
                          onClick={() => setSelectedOrder(order)}
                          className="flex-1 py-3 rounded-xl bg-[#F2F6EC] text-[#0E4032] font-bold text-[14px] hover:bg-[#E2E8D8] transition-colors border border-[#E2E8D8]"
                        >
                          View Details
                        </button>
                        
                        {activeTab === "active" ? (
                           <button className="flex-1 py-3 rounded-xl bg-[#0E4032] text-white font-bold text-[14px] shadow-md hover:bg-[#0E4032]/90 transition-all flex items-center justify-center gap-2">
                             <Clock className="w-4 h-4 text-[#C8F23E]" /> Track Order
                           </button>
                        ) : (
                           <button 
                             onClick={() => handleReorder(order)}
                             className="flex-1 py-3 rounded-xl bg-[#0E4032] text-white font-bold text-[14px] shadow-md hover:bg-[#0E4032]/90 transition-all flex items-center justify-center gap-2"
                           >
                             <RotateCcw className="w-4 h-4 text-[#C8F23E]" /> Reorder Basket
                           </button>
                        )}
                     </div>

                  </div>
                ))
             )}
          </div>

          {/* RIGHT COLUMN: KOI Shopping Insights */}
          <div className="lg:col-span-4">
             <div className="sticky top-[140px] bg-[#0E4032] text-white rounded-2xl p-6 shadow-[0_8px_30px_rgba(14,64,50,0.15)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none" />
                
                <div className="flex items-center gap-2.5 mb-6 relative z-10">
                   <Sparkles className="w-5 h-5 text-[#C8F23E]" />
                   <h3 className="text-[18px] font-bold text-white tracking-wide" style={{ fontFamily: "var(--font-koi-heading)" }}>Your KOI Insights</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-3 relative z-10 mb-5">
                   <div className="flex flex-col bg-white/10 rounded-xl p-3 border border-white/5">
                      <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider mb-1">Avg KOI Score</span>
                      <span className="text-[20px] font-bold text-[#C8F23E]" style={{ fontFamily: "var(--font-koi-heading)" }}>89</span>
                   </div>
                   <div className="flex flex-col bg-white/10 rounded-xl p-3 border border-white/5">
                      <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider mb-1">Avg Protein/Order</span>
                      <span className="text-[20px] font-bold text-[#C8F23E]" style={{ fontFamily: "var(--font-koi-heading)" }}>74g</span>
                   </div>
                </div>
                
                <div className="bg-[#B8860B]/20 rounded-xl p-4 border border-[#B8860B]/30 relative z-10 flex items-start gap-3">
                   <Info className="w-5 h-5 text-[#C8F23E] shrink-0 mt-0.5" />
                   <p className="text-[12px] text-white/90 leading-relaxed font-medium">
                      You consistently buy high-protein snacks. Consider adding <span className="font-bold text-[#C8F23E]">fibre-rich breakfast options</span> to your next order for a balanced week.
                   </p>
                </div>
             </div>
          </div>
          
        </div>
      </main>

      {/* ─── DRAWER: ORDER DETAILS ─── */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-[#0E4032]/20 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setSelectedOrder(null)}
          />
          
          {/* Drawer Panel */}
          <div className="relative w-full max-w-md bg-[#F2F6EC] h-full shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col overflow-hidden border-l border-[#E2E8D8]">
             {/* Drawer Header */}
             <div className="px-6 py-5 border-b border-[#E2E8D8] bg-white flex items-center justify-between z-10 shadow-sm shrink-0">
                <div>
                   <p className="text-[10px] font-bold text-[#5A6B5A] uppercase tracking-wider">Order Details</p>
                   <h2 className="text-xl font-bold text-[#0E4032] mt-0.5" style={{ fontFamily: "var(--font-koi-heading)" }}>{selectedOrder.id}</h2>
                </div>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="w-10 h-10 rounded-full bg-[#F2F6EC] hover:bg-[#E2E8D8] flex items-center justify-center transition-colors text-[#0E4032]"
                >
                  <X className="w-5 h-5" />
                </button>
             </div>

             {/* Drawer Scrollable Body */}
             <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                
                {/* Delivery & Payment Info */}
                <div className="bg-white rounded-xl border border-[#E2E8D8] p-4 shadow-[0_2px_10px_rgba(14,64,50,0.02)] flex gap-4">
                   <div className="flex-1">
                      <div className="flex items-center gap-1.5 mb-2">
                         <MapPin className="w-3.5 h-3.5 text-[#2D7A5E]" />
                         <span className="text-[11px] font-bold text-[#5A6B5A] uppercase tracking-wider">Delivery</span>
                      </div>
                      <p className="text-[13px] font-medium text-[#0E4032] leading-tight">
                         {selectedOrder.address.line1}<br/>{selectedOrder.address.line2}
                      </p>
                   </div>
                   <div className="w-px bg-[#E2E8D8]" />
                   <div className="flex-1">
                      <div className="flex items-center gap-1.5 mb-2">
                         <CreditCard className="w-3.5 h-3.5 text-[#2D7A5E]" />
                         <span className="text-[11px] font-bold text-[#5A6B5A] uppercase tracking-wider">Payment</span>
                      </div>
                      <p className="text-[13px] font-medium text-[#0E4032] leading-tight mt-1">
                         {selectedOrder.payment}
                      </p>
                   </div>
                </div>

                {/* Ordered Items */}
                <div>
                   <h3 className="text-[14px] font-bold text-[#0E4032] mb-3" style={{ fontFamily: "var(--font-koi-heading)" }}>Items ({selectedOrder.items.length})</h3>
                   <div className="space-y-3">
                      {selectedOrder.items.map(item => (
                         <div key={item.id} className="flex gap-3 bg-white p-3 rounded-xl border border-[#E2E8D8]">
                            <div className="w-14 h-14 rounded-lg bg-[#F2F6EC] border border-[#E2E8D8] flex flex-col items-center justify-center shrink-0 relative">
                               <Package className="w-5 h-5 text-[#0E4032]/20" />
                            </div>
                            <div className="flex-1 flex flex-col justify-center">
                               <p className="text-[9px] uppercase tracking-wider font-bold text-[#5A6B5A]">{item.brand}</p>
                               <p className="text-[13px] font-bold text-[#0E4032] leading-tight mt-0.5 line-clamp-1">{item.name}</p>
                               <div className="flex items-center justify-between mt-1">
                                  <span className="text-[11px] text-[#5A6B5A] font-semibold">Qty: {item.quantity}</span>
                                  <span className="text-[13px] font-bold text-[#0E4032]">₹{item.price * item.quantity}</span>
                               </div>
                            </div>
                            <div className="shrink-0 flex items-center justify-center">
                               <KoiScore score={item.score} size={28} />
                            </div>
                         </div>
                      ))}
                   </div>
                </div>

                {/* Bill Summary */}
                <div className="bg-white rounded-xl border border-[#E2E8D8] p-4 shadow-[0_2px_10px_rgba(14,64,50,0.02)]">
                   <h3 className="text-[14px] font-bold text-[#0E4032] mb-3" style={{ fontFamily: "var(--font-koi-heading)" }}>Bill Summary</h3>
                   <div className="space-y-2 mb-3">
                      <div className="flex justify-between items-center text-[13px]">
                         <span className="text-[#5A6B5A] font-medium">Subtotal</span>
                         <span className="text-[#0E4032] font-bold">₹{selectedOrder.total}</span>
                      </div>
                      <div className="flex justify-between items-center text-[13px]">
                         <span className="text-[#5A6B5A] font-medium">Delivery Fee</span>
                         <span className="text-[#2D7A5E] font-bold uppercase text-[11px] tracking-wider bg-[#F2F6EC] px-1.5 py-0.5 rounded">Free</span>
                      </div>
                   </div>
                   <div className="border-t border-[#E2E8D8] pt-3 flex justify-between items-center">
                      <span className="text-[14px] font-bold text-[#0E4032]" style={{ fontFamily: "var(--font-koi-heading)" }}>Total</span>
                      <span className="text-[18px] font-bold text-[#0E4032]" style={{ fontFamily: "var(--font-koi-heading)" }}>₹{selectedOrder.total}</span>
                   </div>
                </div>

             </div>

             {/* Drawer Footer Actions */}
             <div className="px-6 py-4 border-t border-[#E2E8D8] bg-white flex gap-3 shrink-0 pb-safe">
                <button className="flex-1 py-3.5 rounded-xl bg-[#F2F6EC] text-[#0E4032] font-bold text-[14px] border border-[#E2E8D8] hover:bg-[#E2E8D8] transition-colors flex items-center justify-center gap-2">
                   <Headset className="w-4 h-4" /> Need Help
                </button>
             </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .pb-safe {
          padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>
    </div>
  );
}
