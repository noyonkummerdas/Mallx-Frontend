"use client";

import { useGetBalanceQuery } from "@/modules/finance/services/financeApi";
import { useGetShopDetailsQuery } from "@/modules/business/services/businessApi";

export default function VendorDashboard() {
  const { data: balanceData } = useGetBalanceQuery({});
  const { data: shopData } = useGetShopDetailsQuery({});

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tight mb-2">Vendor Hub</h1>
            <p className="text-slate-400 font-medium">Manage your shop, inventory, and payouts.</p>
          </div>
          <div className="flex gap-4">
             <button className="bg-indigo-600 px-6 py-3 rounded-2xl font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20">Add New Product</button>
             <button className="bg-slate-900 border border-slate-800 px-6 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all">Withdraw Funds</button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
           <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-8 backdrop-blur-xl">
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Total Revenue</p>
              <h3 className="text-4xl font-black mb-2 tracking-tight">{balanceData?.data?.balance || 0} <span className="text-sm font-normal text-slate-500">TK</span></h3>
              <p className="text-green-500 text-xs font-bold font-sans">+12.5% from last month</p>
           </div>
           <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-8 backdrop-blur-xl">
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Pending Payout</p>
              <h3 className="text-4xl font-black mb-2 tracking-tight">{balanceData?.data?.pendingWithdrawals || 0} <span className="text-sm font-normal text-slate-500">TK</span></h3>
              <p className="text-slate-500 text-xs font-medium">Processing by admin</p>
           </div>
           <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-8 backdrop-blur-xl group cursor-pointer hover:border-indigo-600/50 transition-colors">
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Shop Status</p>
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-bold tracking-tight">Active</h3>
                    <p className="text-slate-500 text-xs font-medium">{shopData?.data?.category?.name || "Premium Vendor"}</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Detailed Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <section className="bg-slate-900/30 border border-slate-800 rounded-[3rem] p-10">
              <h4 className="text-xl font-black mb-8 px-2 border-l-4 border-indigo-600 pl-4">Recent Withdrawals</h4>
              <div className="space-y-4">
                 {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-slate-900/40 border border-slate-800/50">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-xs font-black">W</div>
                          <div>
                             <p className="font-bold text-sm">Transfer to bKash</p>
                             <p className="text-[10px] text-slate-500">Mar 1{i}, 2026</p>
                          </div>
                       </div>
                       <span className="font-black text-indigo-400">1,200 TK</span>
                    </div>
                 ))}
              </div>
           </section>

           <section className="bg-slate-900/30 border border-slate-800 rounded-[3rem] p-10">
              <h4 className="text-xl font-black mb-8 px-2 border-l-4 border-indigo-600 pl-4">Verification Center</h4>
              <div className="p-6 rounded-3xl bg-indigo-600/5 border border-indigo-600/20">
                 <p className="text-sm text-indigo-200 mb-6 leading-relaxed font-medium">
                    Your KYC documents are currently being reviewed. Please ensure all details match your NID to avoid payout delays.
                 </p>
                 <button className="text-sm font-black text-indigo-400 hover:text-indigo-300 transition-colors">VIEW DOCUMENTS &rarr;</button>
              </div>
           </section>
        </div>
      </div>
    </main>
  );
}
