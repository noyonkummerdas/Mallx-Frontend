"use client";

import { useGetBalanceQuery, useRequestWithdrawalMutation, useGetWithdrawalHistoryQuery } from "@/modules/finance/services/financeApi";
import { useGetMeQuery } from "@/modules/identity/services/authApi";
import { useGetShopDetailsQuery } from "@/modules/business/services/businessApi";
import { useGetVendorOrdersQuery, useUpdateOrderStatusMutation } from "@/modules/shopping/services/shoppingApi";
import { useGetProductsQuery } from "@/modules/shopping/services/productApi";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";

export default function VendorDashboard() {
  const router = useRouter();
  const { data: balanceData } = useGetBalanceQuery({});
  const { data: userData, isLoading: isUserLoading } = useGetMeQuery({});
  const { data: shopData } = useGetShopDetailsQuery({});
  const { data: ordersData, refetch: refetchOrders } = useGetVendorOrdersQuery({});
  const { data: historyData } = useGetWithdrawalHistoryQuery({});
  
  const vendorId = shopData?.data?.vendor?._id;
  const { data: productsData } = useGetProductsQuery({ vendorId }, { skip: !vendorId });
  
  const [updateStatus] = useUpdateOrderStatusMutation();
  const [requestFund, { isLoading: isRequesting }] = useRequestWithdrawalMutation();

  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("bKash");

  useEffect(() => {
    if (userData?.data?.user) {
      const role = userData.data.user.role?.toLowerCase();
      if (role === "customer") router.push("/dashboard/customer");
      else if (role === "deliveryboy") router.push("/dashboard/delivery");
      else if (role === "partner") router.push("/dashboard/partner");
      else if (role === "admin") router.push("/dashboard/admin");
    }
  }, [userData, router]);

  useEffect(() => {
    if (balanceData) console.log("Vendor Dashboard - Balance:", balanceData);
    if (ordersData) console.log("Vendor Dashboard - Vendor Orders:", ordersData);
    if (historyData) console.log("Vendor Dashboard - Withdrawal History:", historyData);
  }, [balanceData, ordersData, historyData]);

  if (isUserLoading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
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
      await requestFund(payload).unwrap();
      alert("Withdrawal request submitted for auditing!");
      setWithdrawAmount("");
      document.getElementById('withdraw-modal')?.classList.add('hidden');
    } catch (err) {
      console.error("Withdrawal failed:", err);
    }
  };

  const vendorOrders = ordersData?.data?.orders || [];
  const balance = balanceData?.data?.balance || 0;
  const settlementHistory = historyData?.data?.history || [];
  const vendorProducts = productsData?.data?.products || [];

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar role="vendor" />
      
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
           <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-lg tracking-tight mb-1 text-slate-900 uppercase">Vendor Central</h1>
                <p className="text-slate-500 text-[10px] tracking-wide">Command center for shop growth and financial clarity.</p>
              </div>
              <div className="flex gap-3">
                 <Link 
                    href="/dashboard/vendor/products/create"
                    className="bg-slate-900 px-5 py-2.5 rounded-xl text-[10px] uppercase tracking-widest text-white hover:bg-black transition-all shadow-lg shadow-slate-900/10"
                 >List New Product</Link>
                 <button 
                    onClick={() => document.getElementById('withdraw-modal')?.classList.remove('hidden')}
                    className="bg-white border border-slate-200 px-5 py-2.5 rounded-xl text-[10px] uppercase tracking-widest text-slate-900 hover:bg-slate-50 transition-all shadow-sm"
                 >Request Funds</button>
              </div>
           </header>

           {/* Stats Grid */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all group">
                 <p className="text-[9px] text-slate-400 uppercase tracking-widest mb-2">Total Realized Revenue</p>
                 <h3 className="text-xl mb-1 tracking-tighter text-slate-900">{balance.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">TK</span></h3>
                 <p className="text-green-600 text-[8px] uppercase tracking-wider bg-green-50 px-2 py-0.5 rounded-full w-fit">+12.5% Performance</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all">
                 <p className="text-[9px] text-slate-400 uppercase tracking-widest mb-2">Orders to Fulfill</p>
                 <h3 className="text-xl mb-1 tracking-tighter text-slate-900">{vendorOrders.filter((o:any) => o.status === 'Processing').length} <span className="text-[10px] font-normal text-slate-400">Active</span></h3>
                 <p className="text-orange-500 text-[8px] uppercase tracking-wider bg-orange-50 px-2 py-0.5 rounded-full w-fit">In Queue</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm cursor-pointer hover:border-slate-900 transition-all relative overflow-hidden">
                 <p className="text-[9px] text-slate-400 uppercase tracking-widest mb-2">Operational Status</p>
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                       <div className="w-3 h-3 bg-slate-900 rounded-full animate-pulse shadow-lg shadow-slate-900/50" />
                    </div>
                    <div>
                       <h3 className="text-sm tracking-tighter text-slate-900 uppercase leading-none">Live & Verified</h3>
                       <p className="text-slate-500 text-[8px] uppercase tracking-widest mt-1">{shopData?.data?.shop?.category?.name || "Tier 1 Merchant"}</p>
                    </div>
                 </div>
              </div>
           </div>

           {/* Detailed Sections */}
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
               <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                 <h4 className="text-xs mb-6 border-l-2 border-slate-900 pl-3 uppercase tracking-tighter">Inventory Overview</h4>
                 <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar text-[10px]">
                    {vendorProducts.length > 0 ? vendorProducts.map((product: any) => (
                       <Link href={`/catalog/products/${product._id}`} key={product._id} className="block p-4 rounded-xl bg-slate-50 border border-slate-100/50 hover:bg-white transition-all group">
                          <div className="flex justify-between gap-3 mb-2">
                             <div>
                                <p className="font-normal uppercase tracking-tight text-slate-900">{product.name}</p>
                                <p className="text-[8px] text-slate-400 tracking-widest">{product.stock} in stock · {product.price.toLocaleString()} TK</p>
                             </div>
                             <span className={`px-2 py-0.5 rounded-full text-[8px] uppercase tracking-widest h-fit ${
                                product.status === 'Active' ? 'bg-green-50 text-green-600' : 
                                product.status === 'Pending' ? 'bg-orange-50 text-orange-600' : 'bg-slate-100 text-slate-600'
                             }`}>{product.status}</span>
                          </div>
                       </Link>
                    )) : (
                       <p className="text-center py-6 text-slate-400 text-[10px] font-bold uppercase tracking-widest italic">Inventory list is empty.</p>
                    )}
                 </div>
              </section>

              <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                 <h4 className="text-xs mb-6 border-l-2 border-slate-900 pl-3 uppercase tracking-tighter">Order Processing</h4>
                 <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar text-[10px]">
                    {vendorOrders.length > 0 ? vendorOrders.map((order: any) => (
                       <div key={order._id} className="p-4 rounded-xl bg-slate-50 border border-slate-100/50 hover:bg-white transition-all group">
                          <div className="flex justify-between gap-3 mb-2">
                             <div>
                                <p className="font-normal uppercase tracking-tight text-slate-900">Order #{order._id.slice(-6).toUpperCase()}</p>
                                <p className="text-[8px] text-slate-400 tracking-widest">{order.items?.length} Items · {order.total.toLocaleString()} TK</p>
                             </div>
                             <span className={`px-2 py-0.5 rounded-full text-[8px] uppercase tracking-widest h-fit ${
                                order.status === 'Processing' ? 'bg-orange-50 text-orange-600' : 
                                order.status === 'Shipped' ? 'bg-slate-100 text-slate-600' : 'bg-green-50 text-green-600'
                             }`}>{order.status}</span>
                          </div>
                          {order.status === 'Processing' && (
                             <div className="flex gap-2">
                                <button 
                                   onClick={() => handleUpdateStatus(order._id, 'Shipped')}
                                   className="flex-1 bg-white border border-slate-200 py-1.5 rounded-lg text-[8px] uppercase tracking-widest hover:bg-slate-50"
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
                 <h4 className="text-xs mb-6 border-l-2 border-slate-900 pl-3 uppercase tracking-tighter">Settlement Ledger</h4>
                 <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar text-[10px]">
                    {settlementHistory.map((item: any) => (
                       <div key={item._id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100/50 hover:bg-white transition-all group">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-[8px] text-slate-900 border border-slate-100">{item.method?.slice(0,2).toUpperCase()}</div>
                             <div>
                                <p className="font-normal uppercase tracking-tight text-slate-900">via {item.method}</p>
                                <p className="text-[8px] text-slate-400 tracking-widest">{item.status.toUpperCase()} · {new Date(item.createdAt).toLocaleDateString()}</p>
                             </div>
                          </div>
                          <span className="text-slate-900 tracking-tighter">{item.amount.toLocaleString()} TK</span>
                       </div>
                    ))}
                    {settlementHistory.length === 0 && (
                       <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 shadow-inner text-center">
                          <p className="text-[9px] text-slate-400 uppercase tracking-widest">No settlement records found.</p>
                       </div>
                    )}
                 </div>
              </section>
           </div>
        </div>

        {/* Withdrawal Modal */}
        <div id="withdraw-modal" className="hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
           <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-200">
              <h3 className="text-2xl mb-2 uppercase tracking-tight">Request Funds</h3>
              <p className="text-xs text-slate-500 mb-8">Audited settlements usually clear within 24 operational hours.</p>
              
              <form onSubmit={handleWithdraw} className="space-y-6">
                 <div>
                    <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-2 ml-1">Volume to Withdraw</label>
                    <input 
                       required
                       type="number"
                       value={withdrawAmount}
                       onChange={(e) => setWithdrawAmount(e.target.value)}
                       className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:border-slate-900 outline-none text-lg"
                       placeholder="Amount in TK"
                    />
                 </div>
                 <div>
                    <label className="block text-[10px] text-slate-400 uppercase tracking-widest mb-2 ml-1">Disbursement Channel</label>
                    <select 
                       value={paymentMethod}
                       onChange={(e) => setPaymentMethod(e.target.value)}
                       className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:border-slate-900 outline-none text-sm uppercase tracking-widest"
                    >
                       <option value="bKash">Secure bKash Transfer</option>
                       <option value="Nagad">Secure Nagad Transfer</option>
                       <option value="Bank">Direct Bank NEFT</option>
                    </select>
                 </div>
                 <div className="flex gap-4 pt-4">
                    <button type="submit" disabled={isRequesting} className="flex-1 bg-slate-900 text-white py-4 rounded-xl text-xs uppercase tracking-widest shadow-xl shadow-slate-900/10 active:scale-95">Initiate Audit</button>
                    <button type="button" onClick={() => document.getElementById('withdraw-modal')?.classList.add('hidden')} className="flex-1 bg-slate-100 text-slate-500 py-4 rounded-xl text-xs uppercase tracking-widest">Cancel</button>
                 </div>
              </form>
           </div>
        </div>
      </main>
    </div>
  );
}
