"use client";

import { useGetMeQuery, useToggle2faMutation } from "@/modules/identity/services/authApi";
import { useGetMyOrdersQuery } from "@/modules/shopping/services/shoppingApi";
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";

export default function ProfilePage() {
   const { data: userData, isLoading, refetch } = useGetMeQuery({});
   console.log('userdata', userData)
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
      <div className="flex bg-slate-50 min-h-screen">
         <Sidebar role="customer" />

         <main className="flex-1 p-10 overflow-y-auto">
            <div className="max-w-4xl mx-auto text-slate-900">
               <h1 className="text-base font-black mb-8 tracking-tight uppercase">User Profile</h1>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  {/* Primary Identity Card */}
                  <div className="md:col-span-2 space-y-6">
                     <section className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm relative overflow-hidden group">
                        <div className="relative z-10">
                           <div className="flex items-center gap-4 mb-8">
                              <div className="w-16 h-16 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center text-base font-black text-slate-900">
                                 {user?.name?.charAt(0)}
                              </div>
                              <div>
                                 <h2 className="text-base font-black tracking-tighter uppercase">{user?.name}</h2>
                                 <p className="text-slate-500 text-sm font-black uppercase tracking-widest leading-none mt-1">{user?.role} · Verified Member</p>
                              </div>
                           </div>

                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                              <div>
                                 <p className="text-sm text-slate-400 font-black uppercase tracking-widest mb-1">Email Address</p>
                                 <p className="text-slate-900 tracking-tight text-sm font-black">{user?.email}</p>
                              </div>
                              <div>
                                 <p className="text-sm text-slate-400 font-black uppercase tracking-widest mb-1">Phone Number</p>
                                 <p className="text-slate-900 tracking-tight text-sm font-black">{user?.phone || 'NOT_LINKED'}</p>
                              </div>
                              <div>
                                 <p className="text-sm text-slate-400 font-black uppercase tracking-widest mb-1">Member Since</p>
                                 <p className="text-slate-900 tracking-tight text-sm font-black">{new Date(user?.createdAt).toLocaleDateString()}</p>
                              </div>
                              <div>
                                 <p className="text-sm text-slate-400 font-black uppercase tracking-widest mb-1">Account Status</p>
                                 <p className="text-green-600 tracking-tight uppercase text-sm font-black">Active Account</p>
                              </div>
                           </div>
                        </div>
                        <div className="absolute top-[-20%] right-[-20%] w-60 h-60 bg-slate-50/50 rounded-full blur-[80px] transition-all duration-500" />
                     </section>

                     <div className="flex gap-3">
                        <button className="flex-1 bg-slate-900 text-white py-3.5 rounded-xl shadow-lg shadow-slate-900/10 text-sm font-black uppercase tracking-widest hover:bg-black transition-all active:scale-95">Edit Profile</button>
                        <button className="flex-1 bg-white border border-slate-200 text-slate-900 py-3.5 rounded-xl shadow-sm text-sm font-black uppercase tracking-widest hover:bg-slate-50 transition-all">Change Password</button>
                     </div>
                  </div>

                  {/* Security & Shield */}
                  <div className="space-y-6">
                     <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 px-3 py-1 bg-slate-50 rounded-full w-fit">Account Security</h3>
                        <div className="space-y-4">
                           <div className="flex items-center justify-between">
                              <div>
                                 <p className="text-sm font-black text-slate-900 uppercase tracking-tight">Two-Factor</p>
                                 <p className="text-sm font-black text-slate-400 uppercase tracking-widest">{user?.isTwoFactorEnabled ? 'PROTECTION ENABLED' : 'PROTECTION DISABLED'}</p>
                              </div>
                              <button
                                 onClick={handleToggle2FA}
                                 disabled={isToggling}
                                 className={`w-12 h-7 rounded-full transition-all relative p-1 ${user?.isTwoFactorEnabled ? 'bg-slate-900' : 'bg-slate-200'}`}
                              >
                                 <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-all ${user?.isTwoFactorEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                              </button>
                           </div>
                           <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                              {/* <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1 leading-tight">Data Protection</p> */}
                              {/* <p className="text-sm text-slate-500 font-black leading-relaxed">Secured using standard AES-256 encryption.</p> */}
                           </div>
                        </div>
                     </section>

                     <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl shadow-slate-900/10">
                        <p className="text-sm font-black uppercase tracking-widest opacity-60 mb-2">Wallet</p>
                        <h4 className="text-base font-black tracking-tight">{(user?.walletBalance || 0).toLocaleString()} <span className="text-sm font-black text-slate-400">TK</span></h4>
                     </div>
                  </div>
               </div>
            </div>
         </main>
      </div>
   );
}
