"use client";

import { useGetMyOrdersQuery, useCancelOrderMutation } from "@/modules/shopping/services/shoppingApi";
import { useEffect } from "react";
import Link from "next/link";

export default function OrdersPage() {
  const { data: ordersData, isLoading, refetch } = useGetMyOrdersQuery({});
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();

  useEffect(() => {
    if (ordersData) console.log("Orders Page - User Order History:", ordersData);
  }, [ordersData]);

  const handleCancel = async (id: string) => {
    const reason = prompt("Reason for cancellation:");
    if (!reason) return;
    try {
      console.log("Cancelling order:", { id, reason });
      await cancelOrder({ id, reason }).unwrap();
      alert("Order cancellation requested.");
      refetch();
    } catch (err) {
      console.error("Cancellation failed:", err);
    }
  };

  const orders = ordersData?.data?.orders || [];

  if (isLoading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-black mb-12 tracking-tight text-slate-900 uppercase">Purchase History</h1>

        <div className="space-y-8">
           {orders.length > 0 ? orders.map((order: any) => (
              <div key={order._id} className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm hover:shadow-xl hover:shadow-indigo-600/5 transition-all group">
                 <div className="flex flex-col md:flex-row justify-between gap-6 mb-8 pb-8 border-b border-slate-50">
                    <div>
                       <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2 px-3 py-1 bg-indigo-50 rounded-full w-fit">Order Ref: {order._id.slice(-8).toUpperCase()}</p>
                       <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Status: {order.status}</h3>
                       <p className="text-slate-400 text-xs font-bold italic mt-1 uppercase tracking-widest">Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                       <span className="text-3xl font-black text-slate-900 tracking-tighter">{order.total.toLocaleString()} TK</span>
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Total Value</span>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                    <div className="space-y-4">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Items Included</p>
                       {order.items?.map((item: any) => (
                          <div key={item._id} className="flex items-center gap-4">
                             <div className="w-10 h-10 bg-slate-50 rounded-xl overflow-hidden border border-slate-100">
                                <img src={item.productId?.images?.[0]?.url} alt="" className="w-full h-full object-cover" />
                             </div>
                             <p className="text-xs font-black uppercase tracking-tight text-slate-700">{item.productId?.name} x {item.quantity}</p>
                          </div>
                       ))}
                    </div>
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Delivery Anchor</p>
                       <p className="text-xs font-bold text-slate-900 leading-relaxed uppercase tracking-tight">{order.shippingAddress?.street}, {order.shippingAddress?.city}</p>
                    </div>
                 </div>

                 <div className="flex gap-4">
                    <Link href={`/orders/${order._id}`} className="px-8 py-3 bg-white border border-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">Audit Details</Link>
                    {(order.status === 'Pending' || order.status === 'Processing') && (
                       <button 
                          onClick={() => handleCancel(order._id)}
                          disabled={isCancelling}
                          className="px-8 py-3 bg-red-50 text-red-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-100 transition-all"
                       >Terminate Order</button>
                    )}
                 </div>
              </div>
           )) : (
              <div className="text-center py-20 bg-white border border-dashed border-slate-200 rounded-[3rem]">
                 <p className="text-slate-400 font-bold uppercase tracking-widest text-sm mb-6 italic">No purchases detected in your profile.</p>
                 <Link href="/catalog/products" className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-600/20">Explore MallX Market</Link>
              </div>
           )}
        </div>
      </div>
    </main>
  );
}
