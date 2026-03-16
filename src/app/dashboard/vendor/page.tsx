"use client";

import { useGetBalanceQuery } from "@/modules/finance/services/financeApi";
import { useGetShopDetailsQuery } from "@/modules/business/services/businessApi";

export default function VendorDashboard() {
  const { data: balanceData } = useGetBalanceQuery({});
  const { data: shopData } = useGetShopDetailsQuery({});

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tight mb-2 text-slate-900 uppercase">Vendor Central</h1>
            <p className="text-slate-500 font-bold italic text-sm tracking-wide">Command center for shop growth and financial clarity.</p>
          </div>
          <div className="flex gap-4">
             <button className="bg-indigo-600 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-white hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20">Create Product</button>
             <button className="bg-white border border-slate-200 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-900 hover:bg-slate-50 transition-all shadow-sm">Request Funds</button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
           <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm hover:shadow-xl hover:shadow-indigo-600/5 transition-all group">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Total Realized Revenue</p>
              <h3 className="text-4xl font-black mb-2 tracking-tighter text-slate-900">{(balanceData?.data?.balance || 0).toLocaleString()} <span className="text-sm font-normal text-slate-400 italic">TK</span></h3>
              <p className="text-green-600 text-[10px] font-black uppercase tracking-wider bg-green-50 px-2 py-1 rounded-full w-fit">+12.5% Performance</p>
           </div>
           <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm hover:shadow-xl hover:shadow-indigo-600/5 transition-all">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Awaiting Settlement</p>
              <h3 className="text-4xl font-black mb-2 tracking-tighter text-slate-900">{(balanceData?.data?.pendingWithdrawals || 0).toLocaleString()} <span className="text-sm font-normal text-slate-400 italic">TK</span></h3>
              <p className="text-orange-500 text-[10px] font-black uppercase tracking-wider bg-orange-50 px-2 py-1 rounded-full w-fit">In Verification</p>
           </div>
           <div className="bg-white border border-indigo-100 rounded-[2.5rem] p-10 shadow-lg shadow-indigo-600/5 group cursor-pointer hover:border-indigo-600 transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                 <svg className="w-16 h-16 text-indigo-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              </div>
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Operational Status</p>
              <div className="flex items-center gap-5">
                 <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100">
                    <div className="w-4 h-4 bg-indigo-600 rounded-full animate-pulse shadow-lg shadow-indigo-600/50" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-black tracking-tighter text-slate-900 uppercase">Live & Verified</h3>
                    <p className="text-indigo-600 text-[10px] font-black uppercase tracking-widest">{shopData?.data?.category?.name || "Tier 1 Merchant"}</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Detailed Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <section className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm">
              <h4 className="text-lg font-black mb-8 px-2 border-l-4 border-indigo-600 pl-4 uppercase tracking-tighter">Settlement Ledger</h4>
              <div className="space-y-4">
                 {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-6 rounded-2xl bg-slate-50 border border-slate-100/50 hover:bg-white hover:border-indigo-100 transition-all group">
                       <div className="flex items-center gap-5">
                          <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center text-[10px] font-black text-indigo-600 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all border border-slate-100">BK</div>
                          <div>
                             <p className="font-black text-sm uppercase tracking-tight text-slate-900">Transfer to bKash Settlement</p>
                             <p className="text-[10px] text-slate-400 font-bold tracking-widest">TRANSACTION_ID: MALX-TX-554{i}</p>
                          </div>
                       </div>
                       <span className="font-black text-indigo-600 tracking-tighter">1,200 TK</span>
                    </div>
                 ))}
              </div>
           </section>

           <section className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm">
              <h4 className="text-lg font-black mb-8 px-2 border-l-4 border-indigo-600 pl-4 uppercase tracking-tighter">Merchant Identity</h4>
              <div className="p-8 rounded-[2rem] bg-indigo-50/50 border border-indigo-100 shadow-inner relative overflow-hidden">
                 <div className="relative z-10">
                    <p className="text-sm text-slate-600 mb-8 leading-relaxed font-bold italic">
                       Professional Merchant Verification: Your KYC documentation is under systematic review by our financial audit team.
                    </p>
                    <button className="text-[10px] font-black text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-widest flex items-center gap-2 group">
                       Audit Identity Documents
                       <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </button>
                 </div>
                 <div className="absolute bottom-[-10%] right-[-5%] opacity-[0.03] pointer-events-none">
                    <svg className="w-40 h-40" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>
                 </div>
              </div>
           </section>
        </div>
      </div>
    </main>
  );
}
