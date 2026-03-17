"use client";

import { useGetAdminStatsQuery, useGetAdminTrendsQuery } from "@/modules/analytics/services/analyticsApi";
import { useGetWithdrawalHistoryQuery, useUpdateWithdrawalStatusMutation } from "@/modules/finance/services/financeApi";
import { useState, useEffect } from "react";

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
    <main className="min-h-screen bg-slate-50 text-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-black tracking-tight mb-2 text-slate-900 uppercase">System Sovereign</h1>
              <p className="text-slate-500 font-bold italic text-sm tracking-wide">Global observability and financial governance across MallX ecosystem.</p>
            </div>
            <div className="flex gap-4">
                <div className="px-6 py-3 bg-white border border-indigo-200 rounded-2xl flex items-center gap-3 shadow-sm">
                   <span className="w-2 h-2 bg-indigo-600 rounded-full animate-ping" />
                   <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest leading-none">Global Engine Active</span>
                </div>
            </div>
        </header>

        {/* Global Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
           <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm group hover:border-indigo-600/20 transition-all">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Ecosystem Revenue</p>
              <h3 className="text-3xl font-black mb-1 tracking-tighter text-slate-900">{stats.totalRevenue?.toLocaleString()} <span className="text-xs font-normal text-slate-400 italic">TK</span></h3>
              <p className="text-green-600 text-[10px] font-black uppercase tracking-wider bg-green-50 px-2 py-1 rounded-full w-fit">+8% VS LAST CYCLE</p>
           </div>
           <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Verified Transactors</p>
              <h3 className="text-3xl font-black mb-1 tracking-tighter text-slate-900">{stats.totalUsers || 0} <span className="text-xs font-normal text-slate-400 italic">Profiles</span></h3>
              <p className="text-indigo-600 text-[10px] font-black uppercase tracking-wider bg-indigo-50 px-2 py-1 rounded-full w-fit">Growth Stable</p>
           </div>
           <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Fulfilled Volume</p>
              <h3 className="text-3xl font-black mb-1 tracking-tighter text-slate-900">{stats.totalOrders || 0} <span className="text-xs font-normal text-slate-400 italic">Units</span></h3>
              <p className="text-orange-500 text-[10px] font-black uppercase tracking-wider bg-orange-50 px-2 py-1 rounded-full w-fit">Logistics Peak</p>
           </div>
           <div className="bg-indigo-600 rounded-[2.5rem] p-8 shadow-2xl shadow-indigo-600/20 text-white">
              <p className="text-[10px] font-black text-indigo-100 uppercase tracking-widest mb-4">Pending Audit Load</p>
              <h3 className="text-3xl font-black mb-1 tracking-tighter">{pendingHoldings.length} <span className="text-xs font-normal text-indigo-100 opacity-60">Requests</span></h3>
              <p className="text-white/20 text-[10px] font-black uppercase tracking-widest mt-2 font-mono">FIN-OPS-VERIFY_READY</p>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
           {/* Financial Auditing */}
           <section className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm">
              <h2 className="text-xl font-black mb-8 border-l-4 border-indigo-600 pl-4 uppercase tracking-tighter">Financial Audit Queue</h2>
              <div className="space-y-6">
                 {pendingHoldings.length > 0 ? pendingHoldings.map((req: any) => (
                    <div key={req._id} className="p-6 rounded-3xl bg-slate-50 border border-slate-100/50 hover:bg-white transition-all group flex items-center justify-between">
                       <div className="flex items-center gap-5">
                          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-slate-100 text-indigo-600 shadow-sm">
                             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zM12 8V7m0 1v1m0 8v1m0-1v-1m-4.833-8.833L6.5 5.5m11 11l-1.333-1.333M7.5 16.5L6.167 17.833" /></svg>
                          </div>
                          <div>
                             <p className="font-black text-sm uppercase tracking-tight text-slate-900">{req.vendorId?.name || "Merchant Request"}</p>
                             <p className="text-[10px] text-slate-400 font-bold tracking-widest">Amount: {req.amount.toLocaleString()} TK · via {req.method}</p>
                          </div>
                       </div>
                       <button 
                          onClick={() => handleApproveWithdrawal(req._id)}
                          disabled={isUpdating}
                          className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-600/20 hover:scale-95 transition-all outline-none"
                       >Release Funds</button>
                    </div>
                 )) : (
                    <div className="text-center py-10 opacity-50 italic text-xs font-bold uppercase tracking-widest border-2 border-dashed border-slate-100 rounded-3xl text-slate-400">Audit queue is currently cleared.</div>
                 )}
              </div>
           </section>

           {/* Market Trends Visualization (Mock) */}
           <section className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm">
              <h2 className="text-xl font-black mb-8 border-l-4 border-indigo-600 pl-4 uppercase tracking-tighter">Market Penetration Analytics</h2>
              <div className="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-8 h-[380px] flex items-end justify-between gap-4">
                 {[40, 70, 55, 90, 65, 80, 45].map((h, i) => (
                    <div key={i} className="flex-1 group relative flex flex-col items-center">
                       <div className="w-full bg-slate-200 rounded-t-xl group-hover:bg-indigo-600 transition-all duration-500" style={{ height: `${h}%` }}>
                          <div className="absolute top-[-30px] left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[8px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">{(h*12).toLocaleString()}</div>
                       </div>
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">Day {i+1}</span>
                    </div>
                 ))}
              </div>
           </section>
        </div>
      </div>
    </main>
  );
}
