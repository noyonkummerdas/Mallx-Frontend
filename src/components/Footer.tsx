"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/auth");

  // Hide footer on auth pages
  if (isAuthPage) return null;

  return (
    <footer className="bg-white border-t border-slate-200 py-6 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          {/* Brand */}
<div>
  <div className="flex items-center gap-2 mb-3">
    <div className="w-5 h-5 bg-slate-900 rounded flex items-center justify-center">
      <span className="text-[8px] text-white">M</span>
    </div>
    <span className="text-xs tracking-tighter text-slate-900 uppercase">Mall<span className="text-slate-900">X</span></span>
  </div>
  <p className="text-[10px] text-slate-400 leading-relaxed">
    Next-generation marketplace ecosystem for merchants and shoppers.
  </p>
</div>

          {/* Quick Links */}
          <div>
            <p className="text-[9px] text-slate-900 uppercase tracking-widest mb-3">Shop</p>
<div className="space-y-1.5">
  <Link href="/catalog/products" className="block text-[10px] text-slate-400 hover:text-slate-900 transition-colors">Products</Link>
  <Link href="/deals" className="block text-[10px] text-slate-400 hover:text-slate-900 transition-colors">Deals</Link>
  <Link href="/shopping/cart" className="block text-[10px] text-slate-400 hover:text-slate-900 transition-colors">Cart</Link>
  <Link href="/orders" className="block text-[10px] text-slate-400 hover:text-slate-900 transition-colors">Orders</Link>
</div>
          </div>

          {/* Account */}
          <div>
            <p className="text-[9px] text-slate-900 uppercase tracking-widest mb-3">Account</p>
<div className="space-y-1.5">
  <Link href="/profile" className="block text-[10px] text-slate-400 hover:text-slate-900 transition-colors">Profile</Link>
  <Link href="/auth/login" className="block text-[10px] text-slate-400 hover:text-slate-900 transition-colors">Login</Link>
  <Link href="/auth/register" className="block text-[10px] text-slate-400 hover:text-slate-900 transition-colors">Register</Link>
  <Link href="/rewards" className="block text-[10px] text-slate-400 hover:text-slate-900 transition-colors">Rewards</Link>
</div>
          </div>

          {/* Support */}
          <div>
            <p className="text-[9px] text-slate-900 uppercase tracking-widest mb-3">Help</p>
<div className="space-y-1.5">
  <Link href="/support" className="block text-[10px] text-slate-400 hover:text-slate-900 transition-colors">Support</Link>
  <span className="block text-[10px] text-slate-400">Terms & Conditions</span>
  <span className="block text-[10px] text-slate-400">Privacy Policy</span>
  <span className="block text-[10px] text-slate-400">FAQ</span>
</div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[10px] text-slate-400 font-medium">
            &copy; 2026 MallX Marketplace. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <span className="text-[9px] text-slate-300 font-medium">Built with 💎 Next.js</span>
            <span className="w-1 h-1 bg-slate-200 rounded-full" />
            <span className="text-[9px] text-slate-300 font-medium">v2.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
