"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/auth");

  if (isAuthPage) return null;

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-900 px-8 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <span className="text-sm font-bold italic text-white">M</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Mall<span className="text-indigo-500">X</span></span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-slate-500">
          <Link href="/catalog/products" className={`hover:text-white transition-colors ${pathname === "/catalog/products" ? "text-white" : ""}`}>Catalog</Link>
          <Link href="/dashboard/vendor" className={`hover:text-white transition-colors ${pathname === "/dashboard/vendor" ? "text-white" : ""}`}>Vendor</Link>
          <Link href="/dashboard/delivery" className={`hover:text-white transition-colors ${pathname === "/dashboard/delivery" ? "text-white" : ""}`}>Logistics</Link>
          <Link href="/shopping/cart" className="relative hover:text-white transition-colors">
             Bag
             <span className="absolute -top-2 -right-3 w-4 h-4 bg-indigo-600 rounded-full flex items-center justify-center text-[8px] text-white">0</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
           <Link href="/auth/login">
              <button className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors">Sign In</button>
           </Link>
           <Link href="/auth/register">
              <button className="px-6 py-2.5 bg-white text-slate-950 rounded-full font-bold text-xs hover:bg-slate-200 transition-all hover:scale-105 active:scale-95">Join MallX</button>
           </Link>
        </div>
      </div>
    </nav>
  );
}
