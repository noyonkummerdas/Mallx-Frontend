"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGetMeQuery } from "@/modules/identity/services/authApi";
import { useState, useEffect } from "react";
import { ShoppingBag, User as UserIcon } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { data: userData, isLoading } = useGetMeQuery({});
  const [showPopup, setShowPopup] = useState(false);
  const isAuthPage = pathname.startsWith("/auth");
  const isDashboard = pathname.startsWith("/dashboard");
  const isSupportMain = pathname === "/support";

  useEffect(() => {
    if (!userData && !isAuthPage) {
      const timer = setTimeout(() => setShowPopup(true), 15000);
      return () => clearTimeout(timer);
    }
  }, [userData, isAuthPage]);

  if (isAuthPage || isDashboard || isSupportMain) return null;

  const user = userData?.data?.user;

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md glass-panel border-b border-slate-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 gradient-hero rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center transform group-hover:rotate-12 transition-all">
              <span className="text-white font-black text-xl">X</span>
            </div>
            <span className="text-xl font-black tracking-tighter text-text-primary uppercase italic">
              Mall<span className="text-primary font-black">X</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-10">
            <Link href="/catalog/products" className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary hover:text-text-primary transition-all">Marketplace</Link>
            <Link href="/catalog/products?type=men" className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary hover:text-text-primary transition-all">Men</Link>
            <Link href="/catalog/products?type=women" className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary hover:text-text-primary transition-all">Women</Link>
            <Link href="/catalog/products?type=deals" className="text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:brightness-110 transition-all font-black bg-primary/5 px-4 py-1.5 rounded-full">Deals</Link>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/shopping/bag" className="relative group">
              <ShoppingBag className="w-5 h-5 text-text-secondary group-hover:text-text-primary transition-all" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-[8px] font-black text-white flex items-center justify-center rounded-full shadow-lg shadow-primary/20">0</span>
            </Link>
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-slate-100 animate-pulse" />
            ) : user ? (
              <Link href={user.role === 'Admin' ? '/dashboard/admin' : user.role === 'Vendor' ? '/dashboard/vendor' : '/dashboard/customer'}>
                <div className="w-9 h-9 rounded-xl gradient-hero p-[1px] flex items-center justify-center group">
                  <div className="w-full h-full bg-white rounded-xl flex items-center justify-center group-hover:bg-transparent transition-all overflow-hidden">
                    <UserIcon className="w-4 h-4 text-text-primary group-hover:text-white" />
                  </div>
                </div>
              </Link>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/auth/login" className="text-[10px] font-black uppercase tracking-[0.2em] text-text-primary hover:text-primary transition-all">Login</Link>
                <Link href="/auth/register">
                  <button className="px-6 py-2.5 gradient-hero text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20 active:scale-95 transition-all">
                    Sign Up
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
      {showPopup && (
        <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-[300px] mall-card p-8 animate-in slide-in-from-bottom-10 border-none duration-700 z-[100]">
          <button onClick={() => setShowPopup(false)} className="absolute top-4 right-4 text-text-light hover:text-text-primary transition-colors">✕</button>
          <h4 className="text-sm font-black uppercase tracking-tighter mb-2 text-text-primary">Join the Elite</h4>
          <p className="text-xs text-text-secondary leading-relaxed mb-6 italic">Unlock premium offers and track your orders with ease.</p>
          <Link href="/auth/register" onClick={() => setShowPopup(false)}>
            <button className="w-full gradient-hero text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20 active:scale-95 transition-all">Claim Access</button>
          </Link>
        </div>
      )}
    </>
  );
}
