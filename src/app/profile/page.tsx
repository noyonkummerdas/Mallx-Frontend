"use client";

import { useGetMeQuery, useToggle2faMutation } from "@/modules/identity/services/authApi";
import { useState, useEffect } from "react";

export default function ProfilePage() {
  const { data: userData, isLoading, refetch } = useGetMeQuery({});
  const [toggle2fa, { isLoading: isToggling }] = useToggle2faMutation();

  useEffect(() => {
    if (userData) console.log("Profile Page - User Record:", userData);
  }, [userData]);

  const handleToggle2FA = async () => {
    try {
      console.log("Toggling 2FA security status...");
      await toggle2fa({}).unwrap();
      alert("Two-Factor Authentication status updated!");
      refetch();
    } catch (err) {
      console.error("2FA toggle failed:", err);
    }
  };

  const user = userData?.data?.user;

  if (isLoading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black mb-12 tracking-tight text-slate-900 uppercase">Operational Identity</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
           {/* Primary Identity Card */}
           <div className="md:col-span-2 space-y-8">
              <section className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm relative overflow-hidden group">
                 <div className="relative z-10">
                    <div className="flex items-center gap-6 mb-10">
                       <div className="w-24 h-24 bg-indigo-50 rounded-[2.5rem] border border-indigo-100 flex items-center justify-center text-3xl font-black text-indigo-600 shadow-inner">
                          {user?.name?.charAt(0)}
                       </div>
                       <div>
                          <h2 className="text-3xl font-black tracking-tighter text-slate-900 uppercase">{user?.name}</h2>
                          <p className="text-indigo-600 text-xs font-black uppercase tracking-widest">{user?.role} · Rank Alpha</p>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                       <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Authenticated Relay</p>
                          <p className="font-bold text-slate-900 tracking-tight">{user?.email}</p>
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Mobile Handset</p>
                          <p className="font-bold text-slate-900 tracking-tight">{user?.phone || 'NOT_LINKED'}</p>
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Member Since</p>
                          <p className="font-bold text-slate-900 tracking-tight">{new Date(user?.createdAt).toLocaleDateString()}</p>
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Biometric Status</p>
                          <p className="font-bold text-green-600 tracking-tight uppercase">VERIFIED_ACTIVE</p>
                       </div>
                    </div>
                 </div>
                 <div className="absolute top-[-20%] right-[-20%] w-60 h-60 bg-indigo-50/50 rounded-full blur-[80px] group-hover:bg-indigo-100/50 transition-all duration-500" />
              </section>

              <div className="flex gap-4">
                 <button className="flex-1 bg-indigo-600 text-white font-black py-5 rounded-3xl shadow-2xl shadow-indigo-600/30 text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all active:scale-95">Update Metadata</button>
                 <button className="flex-1 bg-white border border-slate-200 text-slate-900 font-black py-5 rounded-3xl shadow-sm text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">Secure Password Reset</button>
              </div>
           </div>

           {/* Security & Shield */}
           <div className="space-y-8">
              <section className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
                 <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-8 px-3 py-1 bg-slate-50 rounded-full w-fit">Security Shield</h3>
                 <div className="space-y-6">
                    <div className="flex items-center justify-between">
                       <div>
                          <p className="text-sm font-black text-slate-900 uppercase tracking-tight">2FA Protocol</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{user?.isTwoFactorEnabled ? 'PROTECTION_ACTIVE' : 'VULNERABLE_MODE'}</p>
                       </div>
                       <button 
                          onClick={handleToggle2FA}
                          disabled={isToggling}
                          className={`w-14 h-8 rounded-full transition-all relative p-1 ${user?.isTwoFactorEnabled ? 'bg-indigo-600' : 'bg-slate-200'}`}
                       >
                          <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-all ${user?.isTwoFactorEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                       </button>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 leading-tight">Hyper-Safe Encryption</p>
                       <p className="text-[9px] text-slate-500 font-bold italic leading-relaxed">Your data is secured using AES-256 system standards.</p>
                    </div>
                 </div>
              </section>

              <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-600/30">
                 <p className="text-[10px] font-black uppercase tracking-widest op-60 mb-4">MallX Wallet</p>
                 <h4 className="text-4xl font-black tracking-tight">{(user?.walletBalance || 0).toLocaleString()} <span className="text-sm font-normal text-indigo-100">TK</span></h4>
              </div>
           </div>
        </div>
      </div>
    </main>
  );
}
