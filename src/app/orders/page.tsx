"use client";

import { useGetMyOrdersQuery, useCancelOrderMutation } from "@/modules/shopping/services/shoppingApi";
import { useEffect } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";

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
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar role="customer" />
      
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-base font-black mb-8 tracking-tight text-slate-900 uppercase">Purchase History</h1>

          <div className="space-y-6">
             {orders.length > 0 ? orders.map((order: any) => (
                <div key={order._id} className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm hover:shadow-lg transition-all group text-slate-900">
                   <div className="flex flex-col md:flex-row justify-between gap-4 mb-6 pb-6 border-b border-slate-50">
                      <div>
                         <p className="text-sm font-black text-indigo-600 uppercase tracking-widest mb-1 px-2 py-0.5 bg-indigo-50 rounded-full w-fit">Ref: {order._id.slice(-6).toUpperCase()}</p>
                         <h3 className="text-base font-black uppercase tracking-tight">Status: {order.status}</h3>
                         <p className="text-slate-400 text-sm font-black mt-0.5 uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                         <span className="text-base font-black tracking-tighter">{order.total.toLocaleString()} TK</span>
                         <span className="text-sm font-black text-slate-400 uppercase tracking-widest leading-none">Total</span>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div className="space-y-3">
                         <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Items</p>
                         {order.items?.map((item: any) => (
                            <div key={item._id} className="flex items-center gap-3">
                               <div className="w-8 h-8 bg-slate-50 rounded-lg overflow-hidden border border-slate-100">
                                  <img src={item.productId?.images?.[0]?.url} alt="" className="w-full h-full object-cover" />
                               </div>
                               <p className="text-sm font-black uppercase tracking-tight text-slate-700">{item.productId?.name} x {item.quantity}</p>
                            </div>
                         ))}
                      </div>
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                         <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Location</p>
                         <p className="text-sm font-black text-slate-900 leading-tight uppercase tracking-tight">{order.shippingAddress?.street}</p>
                       </div>
                   </div>

                   <div className="flex gap-3">
                      <Link href={`/orders/${order._id}`} className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">Details</Link>
                      {(order.status === 'Pending' || order.status === 'Processing') && (
                         <button 
                            onClick={() => handleCancel(order._id)}
                            disabled={isCancelling}
                            className="px-5 py-2.5 bg-red-50 text-red-600 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-red-100 transition-all"
                         >Terminate</button>
                      )}
                   </div>
                </div>
             )) : (
                <div className="text-center py-20 bg-white border border-dashed border-slate-200 rounded-[3rem]">
                   <p className="text-slate-400 font-black uppercase tracking-widest text-sm mb-6">No purchases detected in your profile.</p>
                   <Link href="/catalog/products" className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-indigo-600/20">Explore MallX Market</Link>
                </div>
             )}
          </div>
        </div>
      </main>
    </div>
  );
}
