"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGetMeQuery } from "@/modules/identity/services/authApi";
import { useState, useEffect } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const { data: userData } = useGetMeQuery({});
  const [showPopup, setShowPopup] = useState(false);
  const isAuthPage = pathname.startsWith("/auth");

  useEffect(() => {
    // Show attraction popup for visitors after 5 seconds if not logged in
    if (!userData && !isAuthPage) {
      const timer = setTimeout(() => setShowPopup(true), 5000);
      return () => clearTimeout(timer);
    }
  }, [userData, isAuthPage]);

  if (isAuthPage) return null;

  const user = userData?.data?.user;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-8 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <span className="text-[10px] font-bold italic text-white">M</span>
          </div>
          <span className="text-base font-black tracking-tight text-slate-900">Mall<span className="text-indigo-600">X</span></span>
        </Link>
        
        <div className="hidden lg:flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-slate-500">
          <Link href="/catalog/products" className={`hover:text-indigo-600 transition-colors ${pathname === "/catalog/products" ? "text-indigo-600 border-b border-indigo-600" : ""}`}>Marketplace</Link>
          <div className="h-4 w-[1px] bg-slate-200 mx-1" />
          <Link href="/catalog/products?category=mens" className="hover:text-slate-900 transition-colors">Man's</Link>
          <Link href="/catalog/products?category=womens" className="hover:text-slate-900 transition-colors">Women's</Link>
          <Link href="/catalog/products?category=boys" className="hover:text-slate-900 transition-colors">Boy's</Link>
          <Link href="/catalog/products?category=girls" className="hover:text-slate-900 transition-colors">Girls</Link>
          <Link href="/catalog/products?category=kids" className="hover:text-slate-900 transition-colors">Kids</Link>
          <div className="h-4 w-[1px] bg-slate-200 mx-1" />
          <Link href="/deals" className="hover:text-indigo-600 transition-colors">Deals</Link>
          <Link href="/orders" className="hover:text-indigo-600 transition-colors">Orders</Link>
          <Link href="/shopping/cart" className="relative hover:text-indigo-600 transition-colors flex items-center gap-1">
             <span className="w-5 h-5 flex items-center justify-center bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-all">
               <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
             </span>
             Bag
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link href="/profile" className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100 hover:border-indigo-200 transition-all">
                <div className="w-5 h-5 bg-indigo-600 rounded flex items-center justify-center text-[9px] font-bold text-white uppercase">
                   {user.name.charAt(0)}
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-700">{user.name.split(' ')[0]}</span>
              </Link>
            </div>
          ) : (
            <>
              <Link href="/auth/login">
                <button className="px-4 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-600 hover:text-indigo-600 transition-colors">Sign In</button>
              </Link>
              <Link href="/auth/register">
                <button className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-600/20">Join MallX</button>
              </Link>
            </>
          )}
        </div>

        {/* Visitor Attraction Popup */}
        {showPopup && (
          <div className="fixed bottom-6 right-6 max-w-[280px] bg-indigo-600 text-white p-6 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-10 duration-500 z-[100]">
             <button onClick={() => setShowPopup(false)} className="absolute top-3 right-3 opacity-50 hover:opacity-100 text-[10px]">✕</button>
             <h4 className="text-xs font-black uppercase tracking-tight mb-2">Unlock Premium Access</h4>
             <p className="text-[10px] font-bold opacity-80 leading-relaxed mb-4">Join 5,000+ merchants and shoppers. Get exclusive early access to flash sales.</p>
             <Link href="/auth/register" onClick={() => setShowPopup(false)}>
                <button className="w-full bg-white text-indigo-600 font-black py-2.5 rounded-xl text-[9px] uppercase tracking-widest shadow-lg active:scale-95 transition-all">Claim Member Status</button>
             </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
