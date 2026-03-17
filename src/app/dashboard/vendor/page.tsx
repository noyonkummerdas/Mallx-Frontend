"use client";

import { useGetBalanceQuery, useRequestWithdrawalMutation, useGetWithdrawalHistoryQuery } from "@/modules/finance/services/financeApi";
import { useGetShopDetailsQuery } from "@/modules/business/services/businessApi";
import { useGetVendorOrdersQuery, useUpdateOrderStatusMutation } from "@/modules/shopping/services/shoppingApi";
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";

export default function VendorDashboard() {
  const { data: balanceData } = useGetBalanceQuery({});
  const { data: shopData } = useGetShopDetailsQuery({});
  const { data: ordersData, refetch: refetchOrders } = useGetVendorOrdersQuery({});
  const { data: historyData } = useGetWithdrawalHistoryQuery({});
  
  const [updateStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();
  const [requestFund, { isLoading: isRequesting }] = useRequestWithdrawalMutation();

  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("bKash");

  useEffect(() => {
    if (balanceData) console.log("Vendor Dashboard - Balance:", balanceData);
    if (ordersData) console.log("Vendor Dashboard - Vendor Orders:", ordersData);
    if (historyData) console.log("Vendor Dashboard - Withdrawal History:", historyData);
  }, [balanceData, ordersData, historyData]);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      console.log("Updating order status:", { id, status });
      await updateStatus({ id, status }).unwrap();
      refetchOrders();
      alert(`Order marked as ${status}`);
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { amount: Number(withdrawAmount), method: paymentMethod };
      console.log("Requesting withdrawal:", payload);
      await requestFund(payload).unwrap();
      alert("Withdrawal request submitted for auditing!");
      setWithdrawAmount("");
    } catch (err) {
      console.error("Withdrawal failed:", err);
    }
  };

  const vendorOrders = ordersData?.data?.orders || [];
  const balance = balanceData?.data?.balance || 0;
  const settlementHistory = historyData?.data?.history || [];

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar role="vendor" />
      
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-lg font-black tracking-tight mb-1 text-slate-900 uppercase">Vendor Central</h1>
            <p className="text-slate-500 font-bold italic text-[10px] tracking-wide">Command center for shop growth and financial clarity.</p>
          </div>
          <div className="flex gap-3">
             <button className="bg-indigo-600 px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20">Create Product</button>
             <button 
                onClick={() => document.getElementById('withdraw-modal')?.classList.remove('hidden')}
                className="bg-white border border-slate-200 px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-900 hover:bg-slate-50 transition-all shadow-sm"
             >Request Funds</button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
           <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all group">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Realized Revenue</p>
              <h3 className="text-xl font-black mb-1 tracking-tighter text-slate-900">{balance.toLocaleString()} <span className="text-[10px] font-normal text-slate-400 italic">TK</span></h3>
              <p className="text-green-600 text-[8px] font-black uppercase tracking-wider bg-green-50 px-2 py-0.5 rounded-full w-fit">+12.5% Performance</p>
           </div>
           <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Orders to Fulfill</p>
              <h3 className="text-xl font-black mb-1 tracking-tighter text-slate-900">{vendorOrders.filter((o:any) => o.status === 'Processing').length} <span className="text-[10px] font-normal text-slate-400 italic">Active</span></h3>
              <p className="text-orange-500 text-[8px] font-black uppercase tracking-wider bg-orange-50 px-2 py-0.5 rounded-full w-fit">In Queue</p>
           </div>
           <div className="bg-white border border-indigo-100 rounded-2xl p-6 shadow-md cursor-pointer hover:border-indigo-600 transition-all relative overflow-hidden">
              <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-2">Operational Status</p>
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center border border-indigo-100">
                    <div className="w-3 h-3 bg-indigo-600 rounded-full animate-pulse shadow-lg shadow-indigo-600/50" />
                 </div>
                 <div>
                    <h3 className="text-sm font-black tracking-tighter text-slate-900 uppercase leading-none">Live & Verified</h3>
                    <p className="text-indigo-600 text-[8px] font-black uppercase tracking-widest mt-1">{shopData?.data?.category?.name || "Tier 1 Merchant"}</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Detailed Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h4 className="text-xs font-black mb-6 border-l-2 border-indigo-600 pl-3 uppercase tracking-tighter">Order Processing</h4>
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar text-[10px]">
                 {vendorOrders.length > 0 ? vendorOrders.map((order: any) => (
                    <div key={order._id} className="p-4 rounded-xl bg-slate-50 border border-slate-100/50 hover:bg-white transition-all group">
                       <div className="flex justify-between gap-3 mb-2">
                          <div>
                             <p className="font-black uppercase tracking-tight text-slate-900">Order #{order._id.slice(-6).toUpperCase()}</p>
                             <p className="text-[8px] text-slate-400 font-bold tracking-widest">{order.items?.length} Items · {order.total.toLocaleString()} TK</p>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest h-fit ${
                             order.status === 'Processing' ? 'bg-orange-50 text-orange-600' : 
                             order.status === 'Shipped' ? 'bg-indigo-50 text-indigo-600' : 'bg-green-50 text-green-600'
                          }`}>{order.status}</span>
                       </div>
                       {order.status === 'Processing' && (
                          <div className="flex gap-2">
                             <button 
                                onClick={() => handleUpdateStatus(order._id, 'Shipped')}
                                className="flex-1 bg-white border border-slate-200 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-slate-50"
                             >Handover</button>
                          </div>
                       )}
                    </div>
                 )) : (
                    <p className="text-center py-6 text-slate-400 text-[10px] font-bold uppercase tracking-widest italic">No orders in queue.</p>
                 )}
              </div>
           </section>

           <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h4 className="text-xs font-black mb-6 border-l-2 border-indigo-600 pl-3 uppercase tracking-tighter">Settlement Ledger</h4>
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar text-[10px]">
                 {settlementHistory.map((item: any) => (
                    <div key={item._id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100/50 hover:bg-white transition-all group">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-[8px] font-black text-indigo-600 border border-slate-100">{item.method?.slice(0,2).toUpperCase()}</div>
                          <div>
                             <p className="font-black uppercase tracking-tight text-slate-900">via {item.method}</p>
                             <p className="text-[8px] text-slate-400 font-bold tracking-widest">{item.status.toUpperCase()} · {new Date(item.createdAt).toLocaleDateString()}</p>
                          </div>
                       </div>
                       <span className="font-black text-indigo-600 tracking-tighter">{item.amount.toLocaleString()} TK</span>
                    </div>
                 ))}
                 {settlementHistory.length === 0 && (
                    <div className="p-6 rounded-2xl bg-indigo-50/50 border border-indigo-100 shadow-inner text-center">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">No settlement records found.</p>
                    </div>
                 )}
              </div>
           </section>
        </div>

        {/* Withdrawal Modal */}
        <div id="withdraw-modal" className="hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
           <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-200">
              <h3 className="text-2xl font-black mb-2 uppercase tracking-tight">Request Funds</h3>
              <p className="text-xs text-slate-500 font-bold mb-8">Audited settlements usually clear within 24 operational hours.</p>
              
              <form onSubmit={handleWithdraw} className="space-y-6">
                 <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Volume to Withdraw</label>
                    <input 
                       required
                       type="number"
                       value={withdrawAmount}
                       onChange={(e) => setWithdrawAmount(e.target.value)}
                       className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:border-indigo-500 outline-none font-black text-lg"
                       placeholder="Amount in TK"
                    />
                 </div>
                 <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Disbursement Channel</label>
                    <select 
                       value={paymentMethod}
                       onChange={(e) => setPaymentMethod(e.target.value)}
                       className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:border-indigo-500 outline-none font-black text-sm uppercase tracking-widest"
                    >
                       <option value="bKash">Secure bKash Transfer</option>
                       <option value="Nagad">Secure Nagad Transfer</option>
                       <option value="Bank">Direct Bank NEFT</option>
                    </select>
                 </div>
                 <div className="flex gap-4 pt-4">
                    <button type="submit" disabled={isRequesting} className="flex-1 bg-indigo-600 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/20 active:scale-95">Initiate Audit</button>
                    <button type="button" onClick={() => document.getElementById('withdraw-modal')?.classList.add('hidden')} className="flex-1 bg-slate-100 text-slate-500 font-black py-4 rounded-2xl text-xs uppercase tracking-widest">Cancel</button>
                 </div>
              </form>
           </div>
        </div>
        </div>
      </main>
    </div>
  );
}
