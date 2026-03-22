"use client";

import { useGetBalanceQuery, useRequestWithdrawalMutation, useGetWithdrawalHistoryQuery } from "@/modules/finance/services/financeApi";
import { Wallet, ArrowUpRight, Clock, CheckCircle, Search } from "lucide-react";
import { useState } from "react";

export default function VendorFinancePage() {
  const { data: balanceData } = useGetBalanceQuery({});
  const { data: historyData, isLoading } = useGetWithdrawalHistoryQuery({});
  const [requestFund, { isLoading: isRequesting }] = useRequestWithdrawalMutation();
  
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("bKash");

  const balance = balanceData?.data?.balance || 0;
  const history = historyData?.data?.history || [];

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await requestFund({ amount: Number(withdrawAmount), method: paymentMethod }).unwrap();
      alert("Withdrawal request submitted!");
      setWithdrawAmount("");
    } catch (err) {
      console.error("Withdrawal failed:", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8">
      <header className="mb-10">
        <h1 className="text-base font-bold text-slate-900 uppercase tracking-tighter">Settlement Ledger</h1>
        <p className="text-sm text-slate-500 uppercase tracking-widest mt-1">Manage your realized revenue and payouts</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden">
           <div className="relative z-10">
              <p className="text-slate-400 text-xs uppercase tracking-[0.2em] font-bold mb-2">Total Balance</p>
              <h3 className="text-4xl font-black tracking-tighter">{balance.toLocaleString()} <span className="text-lg font-normal opacity-50">TK</span></h3>
              <p className="mt-4 text-xs text-slate-400 uppercase tracking-widest font-medium">Available for immediate audit</p>
           </div>
           <Wallet className="absolute -right-4 -bottom-4 text-white/5 w-32 h-32 rotate-12" />
        </div>

        <div className="md:col-span-2 bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
           <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-6">Request Payout</h4>
           <form onSubmit={handleWithdraw} className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                 <input 
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="Enter amount (TK)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3 outline-none focus:border-slate-900 transition-all font-bold"
                 />
              </div>
              <select 
                 value={paymentMethod}
                 onChange={(e) => setPaymentMethod(e.target.value)}
                 className="bg-slate-50 border border-slate-200 rounded-xl px-5 py-3 outline-none focus:border-slate-900 transition-all font-bold uppercase text-xs tracking-widest"
              >
                 <option value="bKash">bKash</option>
                 <option value="Nagad">Nagad</option>
                 <option value="Bank">Bank Transfer</option>
              </select>
              <button 
                 disabled={isRequesting}
                 className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-black transition-all active:scale-95 disabled:opacity-50"
              >
                 {isRequesting ? 'Auditing...' : 'Initiate Audit'}
              </button>
           </form>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
           <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">Payout History</h4>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-widest text-slate-400 font-black">
              <th className="px-6 py-4">Method</th>
              <th className="px-6 py-4">Reference</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {isLoading ? (
               <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400 uppercase tracking-widest text-xs">Fetching history...</td></tr>
            ) : history.length > 0 ? history.map((item: any) => (
              <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-bold text-xs uppercase text-slate-900">{item.method}</td>
                <td className="px-6 py-4 font-mono text-xs text-slate-500 uppercase">{item._id.slice(-10)}</td>
                <td className="px-6 py-4 text-xs text-slate-500">{new Date(item.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 font-black text-slate-900">{item.amount.toLocaleString()} TK</td>
                <td className="px-6 py-4 text-right">
                  <span className={`px-2 py-1 rounded-lg text-[10px] uppercase tracking-widest font-black ${
                    item.status === 'Pending' ? 'bg-orange-50 text-orange-600' : 
                    item.status === 'Completed' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                  }`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            )) : (
               <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400 uppercase tracking-widest text-xs">No records found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
