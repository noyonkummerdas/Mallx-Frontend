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
  const isDashboard = pathname.startsWith("/dashboard");
  const isSupportMain = pathname === "/support";

  useEffect(() => {
    if (!userData && !isAuthPage) {
      const timer = setTimeout(() => setShowPopup(true), 5000);
      return () => clearTimeout(timer);
    }
  }, [userData, isAuthPage]);

  if (isAuthPage || isDashboard || isSupportMain) return null;

  const user = userData?.data?.user;

  return (
    <nav className="sticky top-0 z-[100] bg-background/60 backdrop-blur-xl border-b border-white/5 px-8 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 accent-gradient rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-all duration-300">
            <span className="text-sm font-black text-white">X</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-white uppercase bg-clip-text">
            Mall<span className="text-accent">X</span>
          </span>
        </Link>
        
        <div className="hidden lg:flex items-center gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
          {user?.role?.toLowerCase() === "vendor" ? (
            <>
              <Link href="/dashboard/vendor" className="hover:text-white transition-colors">Storefront</Link>
              <Link href="/dashboard/vendor/products" className="hover:text-white transition-colors">Inventory</Link>
              <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full text-accent border border-white/5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                Vendor Mode
              </div>
            </>
          ) : (
            <>
              <Link href="/catalog/products" className={`hover:text-white transition-colors ${pathname === "/catalog/products" ? "text-accent" : ""}`}>Marketplace</Link>
              <Link href="/catalog/products?category=mens" className="hover:text-white transition-colors">Men</Link>
              <Link href="/catalog/products?category=womens" className="hover:text-white transition-colors">Women</Link>
              <Link href="/deals" className="text-accent hover:brightness-125 transition-all">Deals</Link>
              <Link href="/shopping/cart" className="relative hover:text-white transition-colors flex items-center gap-2">
                <div className="w-6 h-6 flex items-center justify-center bg-white/5 rounded-lg border border-white/5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                </div>
                Bag
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <Link href="/profile" className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/5 hover:border-white/20 transition-all">
              <div className="w-6 h-6 accent-gradient rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                {user.name.charAt(0)}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-200">{user.name.split(' ')[0]}</span>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/login" className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors">Login</Link>
              <Link href="/auth/register">
                <button className="px-5 py-2 accent-gradient text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/20">Sign Up</button>
              </Link>
            </div>
          )}
        </div>

        {showPopup && (
          <div className="fixed bottom-6 right-6 max-w-[300px] glass-panel p-8 rounded-[2rem] animate-in slide-in-from-bottom-10 duration-700 z-[100]">
            <button onClick={() => setShowPopup(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors">✕</button>
            <h4 className="text-sm font-black uppercase tracking-tighter mb-2 text-white">Join the Elite</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-6 italic">Unlock premium offers and track your orders with ease.</p>
            <Link href="/auth/register" onClick={() => setShowPopup(false)}>
              <button className="w-full accent-gradient text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all">Claim Access</button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
