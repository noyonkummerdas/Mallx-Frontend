"use client";

import { useGetAdminStatsQuery, useGetAdminTrendsQuery } from "@/modules/analytics/services/analyticsApi";
import { useGetWithdrawalHistoryQuery, useUpdateWithdrawalStatusMutation } from "@/modules/finance/services/financeApi";
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";

export default function AdminDashboard() {
  const { data: statsData } = useGetAdminStatsQuery({});
  const { data: trendsData } = useGetAdminTrendsQuery({});
  const { data: withdrawalsData, refetch: refetchWithdrawals } = useGetWithdrawalHistoryQuery({});
  const [updateWithdrawal, { isLoading: isUpdating }] = useUpdateWithdrawalStatusMutation();

  useEffect(() => {
    if (statsData) console.log("Admin Dashboard - Global Stats:", statsData);
    if (trendsData) console.log("Admin Dashboard - Market Trends:", trendsData);
    if (withdrawalsData) console.log("Admin Dashboard - Pending Settlements:", withdrawalsData);
  }, [statsData, trendsData, withdrawalsData]);

  const handleApproveWithdrawal = async (id: string) => {
    try {
      console.log("Approving withdrawal request:", id);
      await updateWithdrawal({ id, status: "Approved" }).unwrap();
      alert("Withdrawal approved and funds released!");
      refetchWithdrawals();
    } catch (err) {
      console.error("Approval failed:", err);
    }
  };

  const stats = statsData?.data || { totalUsers: 0, totalOrders: 0, totalRevenue: 0 };
  const pendingHoldings = withdrawalsData?.data?.history?.filter((w: any) => w.status === 'Pending') || [];

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar role="admin" />
      
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-lg font-black tracking-tight mb-1 text-slate-900 uppercase leading-none">System Sovereign</h1>
                <p className="text-slate-500 font-bold italic text-[10px] tracking-wide">Global observability and financial governance.</p>
              </div>
              <div className="flex gap-4">
                  <div className="px-5 py-2.5 bg-white border border-indigo-200 rounded-xl flex items-center gap-2 shadow-sm">
                     <span className="w-2 h-2 bg-indigo-600 rounded-full animate-ping" />
                     <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest leading-none">Engine Active</span>
                  </div>
              </div>
          </header>

          {/* Global Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
             <div id="finance" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm group hover:border-indigo-600/20 transition-all">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Ecosystem Revenue</p>
                <h3 className="text-xl font-black mb-1 tracking-tighter text-slate-900">{stats.totalRevenue?.toLocaleString()} <span className="text-[10px] font-normal text-slate-400 italic">TK</span></h3>
                <p className="text-green-600 text-[8px] font-black uppercase tracking-wider bg-green-50 px-2 py-0.5 rounded-full w-fit">+8% VS LAST CYCLE</p>
             </div>
             <div id="users" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Verified Transactors</p>
                <h3 className="text-xl font-black mb-1 tracking-tighter text-slate-900">{stats.totalUsers || 0} <span className="text-[10px] font-normal text-slate-400 italic">Profiles</span></h3>
                <p className="text-indigo-600 text-[8px] font-black uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded-full w-fit">Stable</p>
             </div>
             <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Fulfilled Volume</p>
                <h3 className="text-xl font-black mb-1 tracking-tighter text-slate-900">{stats.totalOrders || 0} <span className="text-[10px] font-normal text-slate-400 italic">Units</span></h3>
                <p className="text-orange-500 text-[8px] font-black uppercase tracking-wider bg-orange-50 px-2 py-0.5 rounded-full w-fit">Peak</p>
             </div>
             <div className="bg-indigo-600 rounded-2xl p-6 shadow-xl shadow-indigo-600/20 text-white">
                <p className="text-[9px] font-black text-indigo-100 uppercase tracking-widest mb-2">Audit Load</p>
                <h3 className="text-xl font-black mb-1 tracking-tighter">{pendingHoldings.length} <span className="text-[10px] font-normal text-indigo-100 opacity-60">Requests</span></h3>
                <p className="text-white/20 text-[8px] font-black uppercase tracking-widest mt-1 font-mono">FIN-OPS-READY</p>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-slate-900">
             {/* Financial Auditing */}
             <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                <h2 className="text-xs font-black mb-6 border-l-2 border-indigo-600 pl-3 uppercase tracking-tighter">Financial Audit Queue</h2>
                <div className="space-y-4">
                   {pendingHoldings.length > 0 ? pendingHoldings.map((req: any) => (
                      <div key={req._id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100/50 hover:bg-white transition-all group flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-100 text-indigo-600 shadow-sm">
                               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zM12 8V7m0 1v1m0 8v1m0-1v-1m-4.833-8.833L6.5 5.5m11 11l-1.333-1.333M7.5 16.5L6.167 17.833" /></svg>
                            </div>
                            <div>
                               <p className="font-black text-xs uppercase tracking-tight text-slate-900">{req.vendorId?.name || "Merchant Request"}</p>
                               <p className="text-[9px] text-slate-400 font-bold tracking-widest">{req.amount.toLocaleString()} TK · {req.method}</p>
                            </div>
                         </div>
                         <button 
                            onClick={() => handleApproveWithdrawal(req._id)}
                            disabled={isUpdating}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:scale-95 transition-all outline-none"
                         >Release</button>
                      </div>
                   )) : (
                      <div className="text-center py-8 opacity-50 italic text-[9px] font-bold uppercase tracking-widest border border-dashed border-slate-100 rounded-2xl text-slate-400">Queue Cleared</div>
                   )}
                </div>
             </section>

             {/* Market Trends Visualization (Mock) */}
             <section id="trends" className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                <h2 className="text-xs font-black mb-6 border-l-2 border-indigo-600 pl-3 uppercase tracking-tighter">Market Penetration</h2>
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 h-[280px] flex items-end justify-between gap-3">
                   {[40, 70, 55, 90, 65, 80, 45].map((h, i) => (
                      <div key={i} className="flex-1 group relative flex flex-col items-center">
                         <div className="w-full bg-slate-200 rounded-t-lg group-hover:bg-indigo-600 transition-all duration-500" style={{ height: `${h}%` }}>
                            <div className="absolute top-[-25px] left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[7px] font-black px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">{(h*12).toLocaleString()}</div>
                         </div>
                         <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-2">{i+1}D</span>
                      </div>
                   ))}
                </div>
             </section>
          </div>
        </div>
      </main>
    </div>
  );
}
