"use client";

import { useEffect } from "react";
import { User, Mail, Shield, UserCog, Clock } from "lucide-react";
import { useGetMeQuery } from "@/store/api/adminApi";

export default function ProfilePage() {
  const { data: profileData, isLoading } = useGetMeQuery({});

  useEffect(() => {
    if (profileData) {
      console.log("Admin Profile Page - [QUERY] Current Admin Profile:", profileData);
    }
  }, [profileData]);

  const user = profileData?.data?.user || {};

  return (
    <>
      <header className="mb-8">
        <h1 className="text-lg font-black tracking-tight mb-1 text-slate-900 uppercase leading-none">Security Identity</h1>
        <p className="text-slate-500 font-bold italic text-[10px] tracking-wide">Administrative profile and access level management.</p>
      </header>

      <div className="max-w-2xl">
        <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm text-slate-900">
           <div className="flex items-center gap-6 mb-10">
              <div className="w-20 h-20 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-xl shadow-slate-900/20">
                 <UserCog size={40} />
              </div>
              <div>
                 <h2 className="text-xl font-black uppercase tracking-tighter mb-1">{user.name || 'Global Admin'}</h2>
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded-full w-fit">{user.role || 'Super Admin'}</p>
              </div>
           </div>

           <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 italic">
                 <Mail size={16} className="text-slate-400" />
                 <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Electronic Mail</p>
                    <p className="text-[11px] font-bold text-slate-900 font-mono">{user.email || 'admin@mallx.com'}</p>
                 </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 italic">
                 <Shield size={16} className="text-slate-400" />
                 <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Access Protocol</p>
                    <p className="text-[11px] font-bold text-slate-900 font-mono">ENCRYPTED-BEARER-AUTH</p>
                 </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 italic">
                 <Clock size={16} className="text-slate-400" />
                 <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Last Synchronization</p>
                    <p className="text-[11px] font-bold text-slate-900 font-mono">{new Date().toLocaleString()}</p>
                 </div>
              </div>
           </div>

           <div className="mt-10 pt-10 border-t border-dashed border-slate-200">
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest text-center leading-relaxed">
                 Identity verified by MallX Global Security Protocol. All administrative actions are recorded in the audit logs.
              </p>
           </div>
        </section>
      </div>
    </>
  );
}
