"use client";

import { useGetVendorOrdersQuery, useUpdateOrderStatusMutation } from "@/modules/shopping/services/shoppingApi";
import { Package, Search, Filter, Truck, CheckCircle, Clock } from "lucide-react";
import { useState } from "react";

export default function VendorOrdersPage() {
  const { data: ordersData, isLoading, refetch } = useGetVendorOrdersQuery({});
  const [updateStatus] = useUpdateOrderStatusMutation();
  const [searchTerm, setSearchTerm] = useState("");

  const orders = ordersData?.data?.orders || [];
  const filteredOrders = orders.filter((o: any) => 
    o._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await updateStatus({ id, status }).unwrap();
      refetch();
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8">
      <header className="mb-10">
        <h1 className="text-base font-bold text-slate-900 uppercase tracking-tighter">Order Management</h1>
        <p className="text-sm text-slate-500 uppercase tracking-widest mt-1">Track and fulfill customer requests</p>
      </header>

      <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-8 flex flex-col md:flex-row items-center gap-4 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text"
            placeholder="Search by Order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-11 pr-4 py-3 text-xs outline-none focus:border-slate-900 transition-all"
          />
        </div>
        <div className="flex items-center gap-3">
           <p className="text-sm text-slate-400 uppercase tracking-widest font-bold px-2">
            Active: {orders.filter((o:any) => o.status === 'Processing').length}
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-sm uppercase tracking-widest font-black text-slate-400">Order ID</th>
              <th className="px-6 py-4 text-sm uppercase tracking-widest font-black text-slate-400">Items</th>
              <th className="px-6 py-4 text-sm uppercase tracking-widest font-black text-slate-400">Total</th>
              <th className="px-6 py-4 text-sm uppercase tracking-widest font-black text-slate-400">Status</th>
              <th className="px-6 py-4 text-sm uppercase tracking-widest font-black text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {isLoading ? (
               <tr><td colSpan={5} className="px-6 py-20 text-center text-slate-400 uppercase tracking-widest">Loading Orders...</td></tr>
            ) : filteredOrders.length > 0 ? filteredOrders.map((order: any) => (
              <tr key={order._id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-mono text-sm text-slate-500 uppercase">#{order._id.slice(-8)}</td>
                <td className="px-6 py-4 text-sm text-slate-700">{order.items?.length || 0} Products</td>
                <td className="px-6 py-4 font-bold text-slate-900">{order.total.toLocaleString()} TK</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-lg text-sm uppercase tracking-widest font-black ${
                    order.status === 'Processing' ? 'bg-orange-50 text-orange-600' : 
                    order.status === 'Shipped' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {order.status === 'Processing' && (
                    <button 
                      onClick={() => handleUpdateStatus(order._id, 'Shipped')}
                      className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-black transition-all"
                    >
                      Handover
                    </button>
                  )}
                </td>
              </tr>
            )) : (
               <tr><td colSpan={5} className="px-6 py-20 text-center text-slate-400 uppercase tracking-widest">No orders found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
