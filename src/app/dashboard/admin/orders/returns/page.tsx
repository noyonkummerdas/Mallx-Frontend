"use client";

import { useEffect } from "react";
import { ShoppingBag, RotateCcw, ShieldAlert, CheckCircle, XCircle } from "lucide-react";
import { useGetReturnRequestsQuery, useHandleReturnRequestMutation } from "@/store/api/orderApi";

export default function ReturnsPage() {
  const { data: returnsData, isLoading, refetch } = useGetReturnRequestsQuery({});
  const [handleReturn] = useHandleReturnRequestMutation();

  useEffect(() => {
    if (returnsData) {
      console.log("Admin Orders Returns Page - [QUERY] Return & Refund Requests:", returnsData);
    }
  }, [returnsData]);

  const returns = returnsData?.data || [];

  const onProcessReturn = async (id: string, status: 'Approved' | 'Rejected') => {
    try {
      console.log(`Processing return request ${id} with status: ${status}`);
      await handleReturn({ id, status }).unwrap();
      alert(`Return request ${status.toLowerCase()} successfully.`);
      refetch();
    } catch (err) {
      console.error("Failed to process return:", err);
    }
  };

  return (
    <>
      <header className="mb-8">
        <h1 className="text-base font-black tracking-tight mb-1 text-slate-900 uppercase leading-none">After-Sales Audit</h1>
        <p className="text-slate-500 font-bold text-sm tracking-wide">Customer return requests and refund governance.</p>
      </header>

      <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm text-slate-900">
        <div className="flex items-center gap-3 mb-8">
           <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><RotateCcw size={16} /></div>
           <h2 className="text-base font-black uppercase tracking-tighter">Pending Returns</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="pb-4 text-sm font-black text-slate-400 uppercase tracking-widest">Order ID</th>
                <th className="pb-4 text-sm font-black text-slate-400 uppercase tracking-widest">Reason / Issue</th>
                <th className="pb-4 text-sm font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="pb-4 text-sm font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr><td colSpan={4} className="py-8 text-center text-sm uppercase font-bold text-slate-400 font-mono">Scanning Return Logs...</td></tr>
              ) : returns.length > 0 ? returns.map((returnReq: any, i: number) => (
                <tr key={returnReq._id || i} className="group hover:bg-slate-50/50 transition-all">
                  <td className="py-4">
                    <p className="text-sm font-black text-slate-900 leading-none mb-1">#{returnReq.orderId || `ORD-RET-${i}`}</p>
                    <p className="text-sm text-slate-400 font-bold tracking-tight">Customer: {returnReq.customerName || 'Syncing...'}</p>
                  </td>
                  <td className="py-4">
                     <div className="flex items-center gap-2">
                        <ShieldAlert size={12} className="text-orange-500" />
                        <span className="text-sm font-bold text-slate-600">{returnReq.reason || 'Not Specified'}</span>
                     </div>
                  </td>
                  <td className="py-4">
                     <span className={`px-2 py-1 rounded-md text-sm font-black uppercase tracking-widest ${
                       returnReq.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 
                       returnReq.status === 'Rejected' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600 animate-pulse'
                     }`}>
                       {returnReq.status || 'Pending'}
                     </span>
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                       <button 
                         onClick={() => onProcessReturn(returnReq._id, 'Approved')}
                         className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                       >
                         <CheckCircle size={16} />
                       </button>
                       <button 
                         onClick={() => onProcessReturn(returnReq._id, 'Rejected')}
                         className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                       >
                         <XCircle size={16} />
                       </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={4} className="py-12 text-center text-sm uppercase font-bold text-slate-400">No return requests found in the ecosystem.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
