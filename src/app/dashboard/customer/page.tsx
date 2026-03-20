"use client";

import { useGetMeQuery } from "@/modules/identity/services/authApi";
import { useGetMyOrdersQuery } from "@/modules/shopping/services/shoppingApi";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function CustomerDashboard() {
  const { data: ordersData, isLoading: isOrdersLoading } = useGetMyOrdersQuery({});
  const { data: userData } = useGetMeQuery({});

  const user = userData?.data?.user;
  const orders = ordersData?.data?.orders || [];
  const totalSpent = orders.reduce((sum: number, order: any) => sum + (order.total || 0), 0);
  const activeOrders = orders.filter((o: any) => ["Processing", "Shipped"].includes(o.status)).length;
  const recentOrders = orders.slice(0, 5);

  if (isOrdersLoading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <>
      <header className="mb-8">
        <h1 className="text-base font-black tracking-tight uppercase mb-1">Customer Dashboard</h1>
        <p className="text-slate-500 text-sm font-bold tracking-wide">Overview of your activity and recent orders.</p>
      </header>

      <div className="space-y-8">
        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
           <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:shadow-slate-200/40 transition-all group">
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Total Orders</p>
              <h3 className="text-base font-black mb-1 tracking-tighter text-slate-900">{orders.length}</h3>
              <p className="text-slate-500 text-sm font-black uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-full w-fit">Order Count</p>
           </div>
           <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:shadow-slate-200/40 transition-all">
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Active Orders</p>
              <h3 className="text-base font-black mb-1 tracking-tighter text-slate-900">{activeOrders}</h3>
              <p className="text-slate-500 text-sm font-black uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-full w-fit">Processing</p>
           </div>
           <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:shadow-slate-200/40 transition-all">
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Total Spent</p>
              <h3 className="text-base font-black mb-1 tracking-tighter text-slate-900">{totalSpent.toLocaleString()} <span className="text-sm font-normal text-slate-400">TK</span></h3>
              <p className="text-slate-500 text-sm font-black uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-full w-fit">Lifetime Value</p>
           </div>
        </section>

        {/* Wallet Quick View */}
        <div className="bg-slate-900 rounded-2xl p-8 text-white shadow-xl shadow-slate-900/10 flex flex-col sm:flex-row justify-between items-center gap-6">
           <div>
              <p className="text-sm font-black uppercase tracking-widest opacity-60 mb-2">Available Wallet Balance</p>
              <h4 className="text-base font-black tracking-tight text-white">{(user?.walletBalance || 0).toLocaleString()} <span className="text-sm font-normal text-slate-400 uppercase">Credits (TK)</span></h4>
           </div>
           <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 px-8 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all">Top Up Account</button>
        </div>

        {/* Recent Orders */}
        <section className="bg-white border border-slate-200 rounded-2xl p-10 shadow-sm">
           <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-base font-black text-slate-900 uppercase tracking-widest">Recent Orders</h3>
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest mt-1">Last 5 order records</p>
              </div>
              <a href="/orders" className="bg-slate-50 hover:bg-slate-100 text-slate-900 border border-slate-200 px-4 py-2 rounded-xl text-sm font-black uppercase tracking-widest transition-all text-center">View All Orders →</a>
           </div>
           
           <div className="space-y-4">
              {orders.length > 0 ? recentOrders.map((order: any) => (
                 <div key={order._id} className="flex items-center justify-between p-5 rounded-xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-lg hover:shadow-slate-200/40 transition-all group">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-xs text-slate-900 border border-slate-200 uppercase group-hover:scale-110 transition-transform">
                          {order.status?.charAt(0)}
                       </div>
                       <div>
                          <p className="text-sm font-black uppercase tracking-tight text-slate-900">Order #{order._id.slice(-6).toUpperCase()}</p>
                          <p className="text-sm font-bold text-slate-400 tracking-widest">{new Date(order.createdAt).toLocaleDateString()} · {order.items?.length || 0} ITEMS</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-slate-900 tracking-tighter mb-1 font-bold">{order.total?.toLocaleString()} TK</p>
                       <span className={`px-2 py-0.5 rounded-full text-sm font-black uppercase tracking-widest ${
                          order.status === 'Delivered' ? 'bg-slate-200 text-slate-700' : 
                          order.status === 'Cancelled' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600'
                       }`}>{order.status}</span>
                    </div>
                 </div>
              )) : (
                 <div className="text-center py-16 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                    <p className="text-sm text-slate-300 uppercase tracking-widest font-black">No order history found.</p>
                 </div>
              )}
           </div>
        </section>
      </div>
    </>
  );
}
