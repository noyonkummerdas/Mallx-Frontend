"use client";

import { useGetCartQuery } from "@/modules/shopping/services/shoppingApi";
import Link from "next/link";

export default function CartPage() {
  const { data, isLoading } = useGetCartQuery({});
  
  if (isLoading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const cartItems = data?.data?.items || [];
  const total = data?.data?.total || 0;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-black mb-12 tracking-tight text-slate-900">Your Shopping Bag</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.length > 0 ? (
              cartItems.map((item: any) => (
                <div key={item._id} className="bg-white border border-slate-200 rounded-3xl p-6 flex gap-6 items-center shadow-sm group">
                  <div className="w-24 h-24 bg-slate-50 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-100">
                     <img src={item.productId?.images?.[0]?.url} alt={item.productId?.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                     <h3 className="font-bold text-lg mb-1 uppercase tracking-tight text-slate-900">{item.productId?.name}</h3>
                     <p className="text-slate-400 text-xs font-bold mb-4 uppercase tracking-widest">{item.productId?.categoryId?.name || "Global Market"}</p>
                     <div className="flex items-center gap-4">
                        <span className="text-xs font-black text-slate-400">QTY: {item.quantity}</span>
                        <div className="h-1 w-1 rounded-full bg-slate-200" />
                        <span className="font-black text-indigo-600">{item.price.toLocaleString()} TK</span>
                     </div>
                  </div>
                  <button className="p-3 rounded-2xl hover:bg-red-50 text-slate-300 hover:text-red-500 transition-all border border-transparent hover:border-red-100">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-white border border-dashed border-slate-200 rounded-[3rem] shadow-sm">
                <p className="text-slate-400 mb-6 font-bold italic tracking-wide lowercase">your bag is empty.</p>
                <Link href="/catalog/products" className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all">Start Shopping</Link>
              </div>
            )}
          </div>

          {/* Summary Card */}
          <div className="relative">
            <div className="sticky top-8 bg-indigo-600 rounded-[2.5rem] p-8 shadow-2xl shadow-indigo-600/30 text-white">
              <h2 className="text-2xl font-black mb-8 tracking-tighter">Order Summary</h2>
              <div className="space-y-4 mb-10">
                <div className="flex justify-between text-indigo-100 font-medium tracking-wide">
                  <span>Subtotal</span>
                  <span className="font-bold">{total.toLocaleString()} TK</span>
                </div>
                <div className="flex justify-between text-indigo-100 font-medium tracking-wide">
                  <span>Delivery Fee</span>
                  <span className="font-bold">FREE</span>
                </div>
                <div className="border-t border-white/20 pt-4 flex justify-between text-2xl font-black tracking-tighter">
                  <span>Grand Total</span>
                  <span>{total.toLocaleString()} TK</span>
                </div>
              </div>
              
              <Link href="/shopping/checkout">
                 <button disabled={cartItems.length === 0} className="w-full bg-white text-indigo-600 font-black py-5 rounded-3xl shadow-xl hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50 uppercase tracking-widest text-sm">
                    Proceed to Delivery
                 </button>
              </Link>
              <p className="text-center mt-6 text-[10px] text-indigo-100 font-bold uppercase tracking-widest opacity-80">Encrypted Payments Active</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
