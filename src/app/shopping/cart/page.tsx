"use client";

import { useGetCartQuery } from "@/modules/shopping/services/shoppingApi";
import Link from "next/link";

export default function CartPage() {
  const { data, isLoading } = useGetCartQuery({});
  
  if (isLoading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const cartItems = data?.data?.items || [];
  const total = data?.data?.total || 0;

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-black mb-12 tracking-tight">Shopping Bag</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.length > 0 ? (
              cartItems.map((item: any) => (
                <div key={item._id} className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 flex gap-6 items-center group">
                  <div className="w-24 h-24 bg-slate-800 rounded-2xl overflow-hidden flex-shrink-0">
                     <img src={item.productId?.images?.[0]?.url} alt={item.productId?.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                     <h3 className="font-bold text-lg mb-1">{item.productId?.name}</h3>
                     <p className="text-slate-500 text-sm mb-4 capitalize">Category: {item.productId?.categoryId?.name || "Global"}</p>
                     <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-slate-400">Qty: {item.quantity}</span>
                        <div className="h-1 w-1 rounded-full bg-slate-700" />
                        <span className="font-bold text-indigo-400">{item.price} TK</span>
                     </div>
                  </div>
                  <button className="p-3 rounded-full hover:bg-red-500/10 hover:text-red-500 transition-colors">
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-slate-900/20 border-2 border-dashed border-slate-800 rounded-[3rem]">
                <p className="text-slate-500 mb-6">Your bag is empty.</p>
                <Link href="/catalog/products" className="text-indigo-400 font-bold hover:underline">Start Shopping</Link>
              </div>
            )}
          </div>

          {/* Summary Card */}
          <div className="relative">
            <div className="sticky top-8 bg-indigo-600 rounded-[2.5rem] p-8 shadow-2xl shadow-indigo-600/20">
              <h2 className="text-2xl font-black mb-8">Summary</h2>
              <div className="space-y-4 mb-10">
                <div className="flex justify-between text-indigo-200">
                  <span>Subtotal</span>
                  <span className="font-bold text-white">{total} TK</span>
                </div>
                <div className="flex justify-between text-indigo-200">
                  <span>Delivery</span>
                  <span className="font-bold text-white">Free</span>
                </div>
                <div className="border-t border-indigo-500/50 pt-4 flex justify-between text-xl font-black">
                  <span>Total</span>
                  <span>{total} TK</span>
                </div>
              </div>
              
              <Link href="/shopping/checkout">
                 <button disabled={cartItems.length === 0} className="w-full bg-white text-indigo-600 font-black py-5 rounded-3xl shadow-xl hover:bg-slate-100 transition-all active:scale-95 disabled:opacity-50">
                    Checkout Now
                 </button>
              </Link>
              <p className="text-center mt-6 text-xs text-indigo-200 font-medium">Safe & Secure Payments</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
