"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/auth");

  if (isAuthPage) return null;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-8 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <span className="text-sm font-bold italic text-white">M</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">Mall<span className="text-indigo-600">X</span></span>
        </Link>
        
        <div className="hidden md:flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-500">
          <Link href="/catalog/products" className={`hover:text-indigo-600 transition-colors ${pathname === "/catalog/products" ? "text-indigo-600" : ""}`}>Catalog</Link>
          <Link href="/dashboard/vendor" className={`hover:text-indigo-600 transition-colors ${pathname === "/dashboard/vendor" ? "text-indigo-600" : ""}`}>Vendor</Link>
          <Link href="/dashboard/partner" className={`hover:text-indigo-600 transition-colors ${pathname === "/dashboard/partner" ? "text-indigo-600" : ""}`}>Partner</Link>
          <Link href="/dashboard/admin" className={`hover:text-indigo-600 transition-colors ${pathname === "/dashboard/admin" ? "text-indigo-600" : ""}`}>Admin</Link>
          <Link href="/deals" className={`hover:text-indigo-600 transition-colors ${pathname === "/deals" ? "text-indigo-600" : ""}`}>Deals</Link>
          <Link href="/rewards" className={`hover:text-indigo-600 transition-colors ${pathname === "/rewards" ? "text-indigo-600" : ""}`}>Rewards</Link>
          <Link href="/orders" className={`hover:text-indigo-600 transition-colors ${pathname === "/orders" ? "text-indigo-600" : ""}`}>Orders</Link>
          <Link href="/shopping/cart" className="relative hover:text-indigo-600 transition-colors">
             Bag
             <span className="absolute -top-1.5 -right-2.5 w-3.5 h-3.5 bg-indigo-600 rounded-full flex items-center justify-center text-[7px] text-white">0</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
           <Link href="/auth/login">
              <button className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-indigo-600 transition-colors">Sign In</button>
           </Link>
           <Link href="/auth/register">
              <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-full font-bold text-xs hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-600/20">Join MallX</button>
           </Link>
        </div>
      </div>
    </nav>
  );
}
