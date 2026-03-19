"use client";

import { useGetWithdrawalHistoryQuery, useUpdateWithdrawalStatusMutation } from "@/modules/finance/services/financeApi";
import { useEffect } from "react";

export default function FinancesPage() {
  const { data: withdrawalsData, refetch: refetchWithdrawals } = useGetWithdrawalHistoryQuery({});
  const [updateWithdrawal, { isLoading: isUpdating }] = useUpdateWithdrawalStatusMutation();

  useEffect(() => {
    console.log("Admin Finances Page - [QUERY] Withdrawals History:", withdrawalsData);
  }, [withdrawalsData]);

  const handleApproveWithdrawal = async (id: string) => {
    try {
      await updateWithdrawal({ id, status: "Approved" }).unwrap();
      alert("Withdrawal approved and funds released!");
      refetchWithdrawals();
    } catch (err) {
      console.error("Approval failed:", err);
    }
  };

  const pendingHoldings = withdrawalsData?.data?.history?.filter((w: any) => w.status === 'Pending') || [];

  return (
    <>
      <header className="mb-8">
        <h1 className="text-lg font-black tracking-tight mb-1 text-slate-900 uppercase leading-none">Financial Governance</h1>
        <p className="text-slate-500 font-bold italic text-[10px] tracking-wide">Liquidity management and settlement audit.</p>
      </header>

      <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm text-slate-900">
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
    </>
  );
}
