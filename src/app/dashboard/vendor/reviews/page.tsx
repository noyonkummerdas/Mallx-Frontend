"use client";

import { Star, MessageCircle, Filter, Search } from "lucide-react";

export default function VendorReviewsPage() {
  return (
    <div className="max-w-7xl mx-auto py-8">
      <header className="mb-10">
        <h1 className="text-base font-bold text-slate-900 uppercase tracking-tighter">Customer Feedback</h1>
        <p className="text-sm text-slate-500 uppercase tracking-widest mt-1">Monitor your shop ranking and reviews</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
           <p className="text-xs text-slate-400 uppercase tracking-widest font-black mb-2">Average Rating</p>
           <div className="flex items-end gap-2">
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter">4.8</h3>
              <div className="flex mb-1 text-orange-400">
                 <Star size={14} fill="currentColor" />
                 <Star size={14} fill="currentColor" />
                 <Star size={14} fill="currentColor" />
                 <Star size={14} fill="currentColor" />
                 <Star size={14} fill="currentColor" />
              </div>
           </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
           <p className="text-xs text-slate-400 uppercase tracking-widest font-black mb-2">Total Reviews</p>
           <h3 className="text-3xl font-black text-slate-900 tracking-tighter">124</h3>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
           <p className="text-xs text-slate-400 uppercase tracking-widest font-black mb-2">Response Rate</p>
           <h3 className="text-3xl font-black text-slate-900 tracking-tighter">98%</h3>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
           <p className="text-xs text-slate-400 uppercase tracking-widest font-black mb-2">Top Performer</p>
           <h3 className="text-base font-black text-green-600 uppercase tracking-tighter uppercase mt-2">Verified Merchant</h3>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center border-dashed">
         <MessageCircle className="mx-auto text-slate-100 w-20 h-20 mb-6" />
         <h4 className="text-sm font-black uppercase tracking-widest text-slate-300">No Reviews Yet</h4>
         <p className="text-xs text-slate-400 uppercase tracking-[0.2em] mt-3">Once customers start rating your products, they will appear here.</p>
      </div>
    </div>
  );
}
