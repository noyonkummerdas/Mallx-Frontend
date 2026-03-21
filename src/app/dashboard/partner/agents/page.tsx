"use client";

import { useGetPartnerAgentsQuery } from "@/modules/business/services/businessApi";
import { Users, Mail, Phone, ShieldCheck, UserPlus } from "lucide-react";

export default function PartnerAgentsPage() {
  const { data: agentsData, isLoading } = useGetPartnerAgentsQuery({});
  const agents = agentsData?.data?.agents || [];

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-10 flex justify-between items-end text-slate-900">
        <div>
          <h1 className="text-xl font-black tracking-tight mb-1 uppercase leading-none">Logistics Agents</h1>
          <p className="text-slate-500 font-bold text-xs tracking-wide">Manage your regional delivery network and field personnel.</p>
        </div>
        <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-slate-900/20 hover:scale-105 active:scale-95 transition-all">
          <UserPlus size={14} />
          Onboard Agent
        </button>
      </header>

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-slate-900">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-slate-900">
          {agents.length > 0 ? agents.map((agent: any) => (
            <div key={agent._id} className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl hover:border-slate-900/10 transition-all group relative overflow-hidden">
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                  <Users size={24} />
                </div>
                <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                  agent.status === 'Available' ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-400'
                }`}>
                  {agent.status || 'Active'}
                </span>
              </div>

              <h3 className="text-base font-black uppercase tracking-tight mb-4">{agent.name}</h3>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-slate-400">
                  <Mail size={12} />
                  <span className="text-[10px] font-bold tracking-tight lowercase">{agent.userId?.email || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400">
                  <Phone size={12} />
                  <span className="text-[10px] font-bold tracking-tight uppercase">{agent.phone || agent.userId?.phone || 'N/A'}</span>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-indigo-600">
                  <ShieldCheck size={12} />
                  <span className="text-[9px] font-black uppercase tracking-widest italic">Verified</span>
                </div>
                <button className="text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-900 transition-colors">Manage Access</button>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-32 text-center bg-white border border-dashed border-slate-200 rounded-[3rem]">
               <Users className="mx-auto text-slate-200 mb-4" size={48} />
               <p className="text-slate-400 font-bold uppercase tracking-widest text-xs italic">No logistics personnel registered in your network.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
