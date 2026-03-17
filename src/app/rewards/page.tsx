"use client";

import { useGetLoyaltyStatsQuery, useGetReferralCodeQuery, useGetReferralHistoryQuery, useRedeemPointsMutation } from "@/modules/loyalty/services/loyaltyApi";
import { useState, useEffect } from "react";

export default function RewardsPage() {
  const { data: statsData } = useGetLoyaltyStatsQuery({});
  const { data: codeData } = useGetReferralCodeQuery({});
  const { data: historyData } = useGetReferralHistoryQuery({});
  const [redeem, { isLoading: isRedeeming }] = useRedeemPointsMutation();

  const [redeemAmount, setRedeemAmount] = useState("");

  useEffect(() => {
    if (statsData) console.log("Rewards - Loyalty Stats:", statsData);
    if (codeData) console.log("Rewards - Referral Code:", codeData);
    if (historyData) console.log("Rewards - Referral History:", historyData);
  }, [statsData, codeData, historyData]);

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Redeeming points:", redeemAmount);
      await redeem(Number(redeemAmount)).unwrap();
      alert("Points converted to wallet balance!");
      setRedeemAmount("");
    } catch (err) {
      console.error("Redemption failed:", err);
    }
  };

  const stats = statsData?.data || { points: 0, tier: "Seed" };
  const referralCode = codeData?.data?.code || "MALX-XXXX";
  const referrals = historyData?.data?.referrals || [];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-black mb-12 tracking-tight text-slate-900 uppercase">Loyalty Ecosystem</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
           {/* Tier & Points */}
           <div className="lg:col-span-2 space-y-8">
              <section className="bg-indigo-600 rounded-[3rem] p-12 text-white shadow-2xl shadow-indigo-600/30 relative overflow-hidden group">
                 <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8">
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Authenticated Loyalty Balance</p>
                       <h2 className="text-6xl font-black tracking-tighter mb-4">{stats.points.toLocaleString()} <span className="text-xl font-normal opacity-40 italic">PTS</span></h2>
                       <div className="flex items-center gap-3">
                          <span className="px-4 py-1.5 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20">Tier: {stats.tier}</span>
                          <span className="text-[10px] font-bold text-indigo-100 italic opacity-80">Next Tier in 2,400 PTS</span>
                       </div>
                    </div>
                    <button 
                       onClick={() => document.getElementById('redeem-form')?.classList.remove('hidden')}
                       className="px-10 py-5 bg-white text-indigo-600 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all"
                    >Liquify Points</button>
                 </div>
                 <div className="absolute bottom-[-20%] right-[-10%] w-80 h-80 bg-white/5 rounded-full blur-[60px] pointer-events-none" />
              </section>

              <form id="redeem-form" onSubmit={handleRedeem} className="hidden bg-white border border-indigo-100 p-10 rounded-[3rem] shadow-sm animate-in slide-in-from-top-4 duration-300">
                 <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-6">Redeem Points for Balance</h3>
                 <div className="flex gap-4">
                    <input 
                       required
                       type="number"
                       value={redeemAmount}
                       onChange={(e) => setRedeemAmount(e.target.value)}
                       placeholder="Enter Volume (100 PTS = 1 TK)"
                       className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-black text-sm outline-none focus:border-indigo-500"
                    />
                    <button 
                       disabled={isRedeeming}
                       className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-600/20"
                    >Confirm Action</button>
                 </div>
              </form>

              <section className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm">
                 <h3 className="text-xl font-black mb-8 border-l-4 border-indigo-600 pl-4 uppercase tracking-tighter">Referral Propagation</h3>
                 <div className="space-y-6">
                    {referrals.length > 0 ? referrals.map((ref: any) => (
                       <div key={ref._id} className="flex items-center justify-between p-6 bg-slate-50 border border-slate-100 rounded-2xl group hover:border-indigo-100 transition-all">
                          <div>
                             <p className="font-black text-sm uppercase tracking-tight text-slate-900">{ref.referredUser?.name}</p>
                             <p className="text-[10px] text-slate-400 font-bold tracking-widest">STATUS: {ref.status.toUpperCase()} · EARNED: {ref.rewardPoints} PTS</p>
                          </div>
                          <span className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                          </span>
                       </div>
                    )) : (
                       <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-3xl">
                          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] italic">No active referrals detected on this node.</p>
                       </div>
                    )}
                 </div>
              </section>
           </div>

           {/* Referral Code Card */}
           <div className="space-y-8">
              <section className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm text-center">
                 <div className="w-20 h-20 bg-indigo-50 rounded-[2.5rem] border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto mb-8 shadow-inner">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                 </div>
                 <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Unique Invite Key</h3>
                 <div className="bg-slate-50 border-2 border-dashed border-indigo-200 p-6 rounded-3xl mb-8 group cursor-pointer hover:bg-white hover:border-indigo-600 transition-all">
                    <p className="text-3xl font-black text-slate-900 tracking-[0.2em] uppercase select-all">{referralCode}</p>
                 </div>
                 <p className="text-[10px] text-slate-500 font-bold leading-relaxed px-4">Share this key to earn 500 PTS per verified registration and purchase. Propagation builds your node rank.</p>
              </section>

              <div className="bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl">
                 <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-8">Node Governance</h4>
                 <ul className="space-y-6">
                    <li className="flex items-start gap-4">
                       <span className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-[10px] font-black mt-0.5">01</span>
                       <div>
                          <p className="text-xs font-black uppercase tracking-tight mb-1">Invite Network</p>
                          <p className="text-[9px] text-white/50 font-bold uppercase leading-relaxed">Referrers receive points on successful onboarding.</p>
                       </div>
                    </li>
                    <li className="flex items-start gap-4">
                       <span className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-[10px] font-black mt-0.5">02</span>
                       <div>
                          <p className="text-xs font-black uppercase tracking-tight mb-1">Buy & Build</p>
                          <p className="text-[9px] text-white/50 font-bold uppercase leading-relaxed">Earn 1 PTS per 10 TK spent on any catalog item.</p>
                       </div>
                    </li>
                 </ul>
              </div>
           </div>
        </div>
      </div>
    </main>
  );
}
