"use client";

import { useGetPartnerCampaignsQuery } from "@/modules/business/services/businessApi";
import { Megaphone, Zap, Calendar, ExternalLink } from "lucide-react";

export default function PartnerMarketingPage() {
  const { data: campaignsData, isLoading } = useGetPartnerCampaignsQuery({});
  const campaigns = campaignsData?.data?.campaigns || [];

  return (
    <div className="max-w-6xl mx-auto text-slate-900">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-xl font-black tracking-tight mb-1 uppercase leading-none">Yield Campaigns</h1>
          <p className="text-slate-500 font-bold text-xs tracking-wide">Orchestrate vendor participation in platform-wide marketing events.</p>
        </div>
      </header>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {campaigns.length > 0 ? campaigns.map((camp: any) => (
              <div key={camp._id} className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 -mr-10 -mt-10 rounded-full group-hover:bg-indigo-50 transition-colors" />
                 <div className="relative z-10">
                    <div className="flex items-center gap-3 text-indigo-600 mb-6 font-black uppercase tracking-widest text-[10px]">
                       <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                          <Zap size={14} />
                       </div>
                       Active Pulse
                    </div>
                    <h3 className="text-lg font-black uppercase tracking-tight mb-4">{camp.name}</h3>
                    <p className="text-slate-400 text-xs font-bold leading-relaxed mb-10 line-clamp-3">{camp.description || 'Exclusive marketplace event to boost regional vendor visibility.'}</p>
                    
                    <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                       <div className="flex items-center gap-2 text-slate-300">
                          <Calendar size={12} />
                          <span className="text-[10px] font-black uppercase tracking-widest italic">{new Date(camp.createdAt).toLocaleDateString()}</span>
                       </div>
                       <button className="flex items-center gap-2 text-[10px] font-black text-slate-900 uppercase tracking-widest hover:underline">
                          Enroll Merchants
                          <ExternalLink size={12} />
                       </button>
                    </div>
                 </div>
              </div>
           )) : (
              <div className="col-span-full py-32 text-center bg-white border border-dashed border-slate-200 rounded-[3rem]">
                 <Megaphone className="mx-auto text-slate-100 mb-4" size={48} />
                 <p className="text-slate-400 font-bold uppercase tracking-widest text-xs italic">No active pulse campaigns scheduled.</p>
              </div>
           )}
        </div>
      )}
    </div>
  );
}
