"use client";

import { useGetBundlesQuery, useGetFlashSalesQuery, useGetVouchersQuery } from "@/modules/shopping/services/marketingApi";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function DealsPage() {
  const { data: bundlesData } = useGetBundlesQuery({});
  const { data: flashData } = useGetFlashSalesQuery({});
  const { data: couponsData } = useGetVouchersQuery({});
  
  const bundles = bundlesData?.data?.bundles || [];
  const flashSales = flashData?.data?.flashSales || [];
  const coupons = couponsData?.data?.vouchers || [];

  return (
    <main className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 border-b border-white/5 pb-8">
            <h1 className="text-4xl font-black tracking-tight mb-2 text-white uppercase italic text-gradient">Systemic Alpha Deals</h1>
            <p className="text-muted font-bold italic text-sm tracking-widest uppercase opacity-40">High-performance value clusters and real-time marketing pulses.</p>
        </header>

        {/* Flash Sales Horizontal */}
        <section className="mb-24">
           <h2 className="text-xl font-black mb-10 flex items-center gap-4 text-white uppercase tracking-tighter">
              <div className="w-12 h-12 accent-gradient rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                 <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>
              </div>
              Live Flash Signals
           </h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {flashSales.length > 0 ? flashSales.map((sale: any) => (
                 <div key={sale._id} className="glass-panel rounded-[2.5rem] p-10 shadow-sm hover:border-action/40 transition-all group overflow-hidden relative">
                    <div className="relative z-10">
                       <p className="text-[10px] font-black text-action uppercase tracking-[0.2em] mb-4 bg-action/5 px-4 py-1.5 rounded-full w-fit border border-action/10 italic">Ending Soon</p>
                       <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-4 italic truncate">{sale.productId?.name || "Flash Deal"}</h3>
                       <div className="flex items-center gap-4 mb-8">
                          <span className="text-4xl font-black text-white tracking-tighter italic">{sale.discountPrice?.toLocaleString()} TK</span>
                          <span className="text-xs font-bold text-muted line-through">{sale.productId?.price?.toLocaleString()} TK</span>
                       </div>
                       <Link href={`/catalog/products/${sale.productId?._id}`} className="w-full flex items-center justify-center py-4 accent-gradient text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-indigo-600/20 active:scale-95">
                          Infiltrate Deal
                       </Link>
                    </div>
                    <div className="absolute top-[-20%] right-[-20%] w-40 h-40 bg-action/10 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity" />
                 </div>
              )) : (
               <div className="col-span-full py-20 glass-panel rounded-[3rem] text-center border-dashed border-white/5">
                  <p className="text-muted font-black uppercase tracking-[0.5em] text-xs italic opacity-20">Scanning for flash signals...</p>
               </div>
              )}
           </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Bundles */}
            <section className="lg:col-span-2">
               <h2 className="text-[10px] font-black mb-10 border-l-4 border-action pl-4 uppercase tracking-[0.3em] text-white">Value Clusters</h2>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {bundles.length > 0 ? bundles.map((bundle: any) => (
                     <div key={bundle._id} className="glass-panel rounded-[3rem] p-10 hover:border-action/20 transition-all group">
                        <div className="w-full aspect-[4/3] bg-surface rounded-[2rem] mb-8 overflow-hidden border border-white/5 p-8 flex items-center justify-center relative">
                           <div className="flex -space-x-8">
                              {bundle.products?.slice(0,3).map((p: any, i: number) => (
                                 <div key={i} className="w-20 h-20 bg-background rounded-2xl border-4 border-surface shadow-2xl overflow-hidden hover:scale-110 transition-transform cursor-pointer relative z-10">
                                    <img src={p.productId?.images?.[0]?.imageUrl} alt="" className="w-full h-full object-cover" />
                                 </div>
                              ))}
                           </div>
                           <div className="absolute inset-0 bg-action/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <h3 className="text-2xl font-black text-white tracking-tight uppercase mb-2 italic truncate">{bundle.name}</h3>
                        <p className="text-action text-[10px] font-black uppercase tracking-widest mb-8">Systemic Valuation: {bundle.bundlePrice?.toLocaleString() || 0} TK</p>
                        <button className="w-full accent-gradient text-white font-black py-4 rounded-[2rem] text-[10px] uppercase tracking-widest shadow-2xl shadow-indigo-600/20 active:scale-95 transition-all">Claim Cluster</button>
                     </div>
                  )) : (
                     <div className="col-span-full py-16 glass-panel rounded-[3rem] text-center border-dashed border-white/10 opacity-30">
                        <p className="text-muted font-bold uppercase tracking-widest text-[10px] italic">Optimizing cluster nodes...</p>
                     </div>
                  )}
               </div>
            </section>

            {/* Coupons/Vouchers */}
            <section>
               <h2 className="text-[10px] font-black mb-10 border-l-4 border-white pl-4 uppercase tracking-[0.3em] text-white">Alpha Vouchers</h2>
               <div className="space-y-8">
                  {coupons.length > 0 ? coupons.map((cp: any) => (
                     <div key={cp._id} className="accent-gradient rounded-[2.5rem] p-10 text-white relative overflow-hidden group shadow-2xl shadow-indigo-600/20">
                        <div className="relative z-10">
                           <div className="flex justify-between items-start mb-8">
                              <span className="text-5xl font-black tracking-tighter italic">{cp.discountValue}{cp.discountType === 'Percentage' ? '%' : ''} <span className="text-xs font-normal opacity-60 uppercase not-italic ml-1">OFF</span></span>
                              <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                              </div>
                           </div>
                           <div className="mb-10">
                              <p className="font-black text-lg tracking-[0.2em] uppercase mb-1">{cp.code}</p>
                              <p className="text-[9px] font-black text-white/60 uppercase tracking-widest">Minimal Payload: {cp.minOrderAmount?.toLocaleString() || 0} TK</p>
                           </div>
                           <button 
                              className="w-full bg-white text-indigo-600 font-black py-4 rounded-2xl text-[10px] uppercase tracking-[0.3em] shadow-xl hover:scale-105 transition-all active:scale-95"
                           >Collect Access</button>
                        </div>
                        <div className="absolute top-[-50%] left-[-50%] w-full h-full bg-white/5 rounded-full blur-[80px] pointer-events-none" />
                     </div>
                  )) : (
                     <div className="py-16 glass-panel rounded-[3rem] text-center border-dashed border-white/10 opacity-30">
                        <p className="text-muted font-bold uppercase tracking-widest text-[10px] italic">No active vouchers detected.</p>
                     </div>
                  )}
               </div>
            </section>
        </div>
      </div>
    </main>
  );
}
