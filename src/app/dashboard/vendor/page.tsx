import { useGetBalanceQuery, useRequestWithdrawalMutation, useGetWithdrawalHistoryQuery } from "@/modules/finance/services/financeApi";
import { useGetShopDetailsQuery } from "@/modules/business/services/businessApi";
import { useGetVendorOrdersQuery, useUpdateOrderStatusMutation } from "@/modules/shopping/services/shoppingApi";
import { useState, useEffect } from "react";

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
    <main className="min-h-screen bg-slate-50 text-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tight mb-2 text-slate-900 uppercase">Vendor Central</h1>
            <p className="text-slate-500 font-bold italic text-sm tracking-wide">Command center for shop growth and financial clarity.</p>
          </div>
          <div className="flex gap-4">
             <button className="bg-indigo-600 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-white hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20">Create Product</button>
             <button 
                onClick={() => document.getElementById('withdraw-modal')?.classList.remove('hidden')}
                className="bg-white border border-slate-200 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-900 hover:bg-slate-50 transition-all shadow-sm"
             >Request Funds</button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
           <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm hover:shadow-xl hover:shadow-indigo-600/5 transition-all group">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Total Realized Revenue</p>
              <h3 className="text-4xl font-black mb-2 tracking-tighter text-slate-900">{balance.toLocaleString()} <span className="text-sm font-normal text-slate-400 italic">TK</span></h3>
              <p className="text-green-600 text-[10px] font-black uppercase tracking-wider bg-green-50 px-2 py-1 rounded-full w-fit">+12.5% Performance</p>
           </div>
           <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm hover:shadow-xl hover:shadow-indigo-600/5 transition-all">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Orders to Fulfill</p>
              <h3 className="text-4xl font-black mb-2 tracking-tighter text-slate-900">{vendorOrders.filter((o:any) => o.status === 'Processing').length} <span className="text-sm font-normal text-slate-400 italic">Active</span></h3>
              <p className="text-orange-500 text-[10px] font-black uppercase tracking-wider bg-orange-50 px-2 py-1 rounded-full w-fit">In Queue</p>
           </div>
           <div className="bg-white border border-indigo-100 rounded-[2.5rem] p-10 shadow-lg shadow-indigo-600/5 group cursor-pointer hover:border-indigo-600 transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                 <svg className="w-16 h-16 text-indigo-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z"/></svg>
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
              <h4 className="text-lg font-black mb-8 px-2 border-l-4 border-indigo-600 pl-4 uppercase tracking-tighter">Order Processing</h4>
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                 {vendorOrders.length > 0 ? vendorOrders.map((order: any) => (
                    <div key={order._id} className="p-6 rounded-2xl bg-slate-50 border border-slate-100/50 hover:bg-white hover:border-indigo-100 transition-all group">
                       <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
                          <div>
                             <p className="font-black text-sm uppercase tracking-tight text-slate-900">Order #{order._id.slice(-6).toUpperCase()}</p>
                             <p className="text-[10px] text-slate-400 font-bold tracking-widest">{order.items?.length} Items · {order.total.toLocaleString()} TK</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest h-fit ${
                             order.status === 'Processing' ? 'bg-orange-50 text-orange-600' : 
                             order.status === 'Shipped' ? 'bg-indigo-50 text-indigo-600' : 'bg-green-50 text-green-600'
                          }`}>{order.status}</span>
                       </div>
                       {order.status === 'Processing' && (
                          <div className="flex gap-2">
                             <button 
                                onClick={() => handleUpdateStatus(order._id, 'Shipped')}
                                className="flex-1 bg-white border border-slate-200 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50"
                             >Handover to Logistics</button>
                          </div>
                       )}
                    </div>
                 )) : (
                    <p className="text-center py-10 text-slate-400 text-xs font-bold uppercase tracking-widest italic">No orders in queue.</p>
                 )}
              </div>
           </section>

           <section className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm">
              <h4 className="text-lg font-black mb-8 px-2 border-l-4 border-indigo-600 pl-4 uppercase tracking-tighter">Settlement Ledger</h4>
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                 {settlementHistory.map((item: any) => (
                    <div key={item._id} className="flex items-center justify-between p-6 rounded-2xl bg-slate-50 border border-slate-100/50 hover:bg-white hover:border-indigo-100 transition-all group">
                       <div className="flex items-center gap-5">
                          <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center text-[10px] font-black text-indigo-600 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all border border-slate-100">{item.method?.slice(0,2).toUpperCase()}</div>
                          <div>
                             <p className="font-black text-sm uppercase tracking-tight text-slate-900">Transfer via {item.method}</p>
                             <p className="text-[10px] text-slate-400 font-bold tracking-widest">{item.status.toUpperCase()} · {new Date(item.createdAt).toLocaleDateString()}</p>
                          </div>
                       </div>
                       <span className="font-black text-indigo-600 tracking-tighter">{item.amount.toLocaleString()} TK</span>
                    </div>
                 ))}
                 {settlementHistory.length === 0 && (
                    <div className="p-8 rounded-[2rem] bg-indigo-50/50 border border-indigo-100 shadow-inner text-center">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No settlement records found.</p>
                       <p className="text-xs text-indigo-600 font-bold italic mt-2">Initialize your first fund request to start the ledger.</p>
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
  );
}
