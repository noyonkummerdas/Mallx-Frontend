"use client";

import { useGetBundlesQuery, useGetFlashSalesQuery, useGetCouponsQuery, useClaimVoucherMutation } from "@/modules/marketing/services/marketingApi";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function DealsPage() {
  const { data: bundlesData } = useGetBundlesQuery({});
  const { data: flashData } = useGetFlashSalesQuery({});
  const { data: couponsData } = useGetCouponsQuery({});
  const [claim, { isLoading: isClaiming }] = useClaimVoucherMutation();

  useEffect(() => {
    if (bundlesData) console.log("Deals - Bundles:", bundlesData);
    if (flashData) console.log("Deals - Flash Sales:", flashData);
    if (couponsData) console.log("Deals - Coupons/Vouchers:", couponsData);
  }, [bundlesData, flashData, couponsData]);

  const handleClaim = async (id: string) => {
    try {
      console.log("Claiming voucher:", id);
      await claim(id).unwrap();
      alert("Voucher collected! Apply at checkout.");
    } catch (err) {
      console.error("Claim failed:", err);
    }
  };

  const bundles = bundlesData?.data?.bundles || [];
  const flashSales = flashData?.data?.flashSales || [];
  const coupons = couponsData?.data?.coupons || [];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
            <h1 className="text-4xl font-black tracking-tight mb-2 text-slate-900 uppercase">Flash Market & Bundles</h1>
            <p className="text-slate-500 font-bold italic text-sm tracking-wide">Time-sensitive value propositions and systemic discounts.</p>
        </header>

        {/* Flash Sales Horizontal */}
        <section className="mb-16">
           <h2 className="text-xl font-black mb-8 flex items-center gap-4 text-slate-900 uppercase tracking-tighter">
              <div className="w-10 h-10 bg-orange-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-600/20">
                 <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>
              </div>
              Live Flash Pulse
           </h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {flashSales.length > 0 ? flashSales.map((sale: any) => (
                 <div key={sale._id} className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 shadow-sm hover:border-orange-600/30 transition-all group overflow-hidden relative">
                    <div className="relative z-10">
                       <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-2 bg-orange-50 px-3 py-1 rounded-full w-fit">Ending in 02:44:12</p>
                       <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4">{sale.name}</h3>
                       <p className="text-xs font-bold text-slate-400 italic mb-8 line-clamp-2">{sale.description}</p>
                       <div className="flex items-center justify-between">
                          <span className="text-4xl font-black text-slate-900 tracking-tighter">{sale.discountPercentage}% <span className="text-xs font-normal opacity-40">OFF</span></span>
                          <Link href={`/catalog/flash/${sale._id}`} className="p-3 bg-slate-900 text-white rounded-2xl hover:scale-105 transition-all shadow-xl">
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                          </Link>
                       </div>
                    </div>
                    <div className="absolute top-[-20%] right-[-20%] w-40 h-40 bg-orange-50 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity" />
                 </div>
              )) : (
                 <div className="col-span-1 md:col-span-3 py-12 bg-white border border-dashed border-slate-200 rounded-[3rem] text-center">
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] italic">No active flash signals detected. Stay synchronized.</p>
                 </div>
              )}
           </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Bundles */}
            <section className="lg:col-span-2">
               <h2 className="text-xl font-black mb-8 border-l-4 border-indigo-600 pl-4 uppercase tracking-tighter">Value Bundles</h2>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {bundles.length > 0 ? bundles.map((bundle: any) => (
                     <div key={bundle._id} className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm hover:shadow-xl hover:shadow-indigo-600/5 transition-all group">
                        <div className="w-full aspect-[4/3] bg-slate-50 rounded-[2rem] mb-8 overflow-hidden border border-slate-100 p-8 flex items-center justify-center">
                           <div className="flex -space-x-8">
                              {bundle.products?.slice(0,3).map((p: any, i: number) => (
                                 <div key={i} className="w-20 h-20 bg-white rounded-2xl border-4 border-slate-50 shadow-xl overflow-hidden hover:scale-110 transition-transform cursor-pointer">
                                    <img src={p.images?.[0]?.url} alt="" className="w-full h-full object-cover" />
                                 </div>
                              ))}
                           </div>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase mb-2">{bundle.name}</h3>
                        <p className="text-indigo-600 text-xs font-black uppercase tracking-widest mb-8">Systemic Savings: {bundle.totalSavings.toLocaleString()} TK</p>
                        <button className="w-full bg-indigo-600 text-white font-black py-4 rounded-[2rem] text-xs uppercase tracking-widest shadow-2xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all active:scale-95">Collect Cluster</button>
                     </div>
                  )) : (
                     <div className="col-span-full py-10 bg-white border border-dashed border-slate-200 rounded-[3rem] text-center">
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] italic">Cluster optimization in progress...</p>
                     </div>
                  )}
               </div>
            </section>

            {/* Coupons/Vouchers */}
            <section>
               <h2 className="text-xl font-black mb-8 border-l-4 border-slate-900 pl-4 uppercase tracking-tighter">Available Coupons</h2>
               <div className="space-y-6">
                  {coupons.length > 0 ? coupons.map((cp: any) => (
                     <div key={cp._id} className="bg-indigo-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                        <div className="relative z-10">
                           <div className="flex justify-between items-start mb-6">
                              <span className="text-5xl font-black tracking-tighter">{cp.discountPercentage}% <span className="text-xs font-normal opacity-60">OFF</span></span>
                              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
                                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                              </div>
                           </div>
                           <p className="font-black text-lg tracking-tight uppercase mb-2">{cp.code}</p>
                           <p className="text-[10px] font-bold text-indigo-100 opacity-80 uppercase tracking-widest mb-8">Min. Order: {cp.minOrderValue.toLocaleString()} TK</p>
                           <button 
                              onClick={() => handleClaim(cp._id)}
                              disabled={isClaiming}
                              className="w-full bg-white text-indigo-600 font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all"
                           >Claim Voucher</button>
                        </div>
                        <div className="absolute top-[-50%] left-[-50%] w-full h-full bg-white/5 rounded-full blur-[80px] pointer-events-none" />
                     </div>
                  )) : (
                     <div className="py-10 bg-white border border-dashed border-slate-200 rounded-[3rem] text-center">
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] italic">No vouchers released for this cycle.</p>
                     </div>
                  )}
               </div>
            </section>
        </div>
      </div>
    </main>
  );
}
