"use client";

import { useGetPartnerReturnsQuery } from "@/modules/business/services/businessApi";
import { ShoppingBag, RefreshCcw, ArrowRightCircle } from "lucide-react";

export default function PartnerReturnsPage() {
  const { data: returnsData, isLoading } = useGetPartnerReturnsQuery({});
  const returns = returnsData?.data?.returns || [];

  return (
    <div className="max-w-6xl mx-auto text-slate-900">
      <header className="mb-10 text-slate-900">
        <h1 className="text-xl font-black tracking-tight mb-1 uppercase leading-none">Vendor Returns</h1>
        <p className="text-slate-500 font-bold text-xs tracking-wide">Governance oversight for product returns and merchant resolution.</p>
      </header>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {returns.length > 0 ? returns.map((ret: any) => (
            <div key={ret._id} className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 group-hover:rotate-12 transition-transform">
                  <RefreshCcw size={20} />
                </div>
                <div>
                   <div className="flex items-center gap-3 mb-1 text-slate-900">
                      <p className="text-xs font-black uppercase tracking-widest">REF: {ret._id.slice(-6).toUpperCase()}</p>
                      <span className="px-2 py-0.5 bg-slate-900 text-white text-[8px] font-black uppercase tracking-widest rounded-lg">{ret.status}</span>
                   </div>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">{ret.reason || 'Logistics Inconsistency'}</p>
                </div>
              </div>

              <div className="flex items-center gap-10">
                <div className="text-right">
                   <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Created At</p>
                   <p className="text-[11px] font-black">{new Date(ret.createdAt).toLocaleDateString()}</p>
                </div>
                <button className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">
                   Mediate Case
                   <ArrowRightCircle size={14} />
                </button>
              </div>
            </div>
          )) : (
            <div className="py-24 text-center bg-white border border-slate-100 rounded-[3rem]">
               <p className="text-slate-300 font-bold uppercase tracking-widest text-xs italic">No pending return requests in your regional queue.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
