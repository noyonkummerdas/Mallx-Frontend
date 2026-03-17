"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  TrendingUp, 
  Settings, 
  LogOut, 
  Truck, 
  Store, 
  Wallet,
  MessageSquare,
  Gift,
  Zap,
  Menu,
  X
} from "lucide-react";

interface SidebarProps {
  role: "admin" | "vendor" | "partner" | "delivery" | "customer";
}

const menuItems = {
  admin: [
    { name: "Global Stats", href: "/dashboard/admin", icon: LayoutDashboard },
    { name: "Financial Audit", href: "/dashboard/admin#finance", icon: Wallet },
    { name: "User Base", href: "/dashboard/admin#users", icon: Users },
    { name: "Market Trends", href: "/dashboard/admin#trends", icon: TrendingUp },
  ],
  vendor: [
    { name: "Shop Overview", href: "/dashboard/vendor", icon: LayoutDashboard },
    { name: "Inventory", href: "/catalog/products", icon: Package },
    { name: "Orders", href: "/dashboard/vendor#orders", icon: Store },
    { name: "Settlements", href: "/dashboard/vendor#finance", icon: Wallet },
  ],
  partner: [
    { name: "Regional Ops", href: "/dashboard/partner", icon: LayoutDashboard },
    { name: "Merchants", href: "/dashboard/partner#vendors", icon: Users },
    { name: "Logistics", href: "/dashboard/partner#logistics", icon: Truck },
    { name: "Growth", href: "/dashboard/partner#growth", icon: TrendingUp },
  ],
  delivery: [
    { name: "My Dashboard", href: "/dashboard/delivery", icon: LayoutDashboard },
    { name: "Available Loads", href: "/dashboard/delivery#loads", icon: Package },
    { name: "Shipments", href: "/dashboard/delivery#active", icon: Truck },
    { name: "Security", href: "/profile", icon: Settings },
  ],
  customer: [
    { name: "My Activity", href: "/profile", icon: LayoutDashboard },
    { name: "Order History", href: "/orders", icon: Package },
    { name: "Loyalty/Rewards", href: "/rewards", icon: Gift },
    { name: "Hot Deals", href: "/deals", icon: Zap },
  ]
};

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const items = menuItems[role] || [];

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-[60] w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-600/40"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity"
        />
      )}

      <aside className={`fixed lg:sticky top-0 left-0 z-50 w-60 bg-white border-r border-slate-200 flex flex-col h-screen overflow-y-auto transition-transform duration-300 lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
      <div className="p-8 pb-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 group-hover:rotate-12 transition-transform">
            <LayoutDashboard size={14} strokeWidth={2.5} />
          </div>
          <span className="text-sm font-black tracking-tighter text-slate-900 uppercase">MallX <span className="text-indigo-600">Core</span></span>
        </Link>
      </div>

      <nav className="flex-1 p-6 space-y-2">
        <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 opacity-50">Operational Node</p>
        
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link 
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
                isActive 
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 translate-x-1" 
                : "text-slate-500 hover:bg-slate-50 hover:text-indigo-600"
              }`}
            >
              <Icon size={14} className={isActive ? "text-white" : "group-hover:scale-110 transition-transform"} />
              <span className="text-[10px] font-black uppercase tracking-wider">{item.name}</span>
            </Link>
          );
        })}

        <div className="pt-6 space-y-1">
           <p className="px-4 text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 opacity-50">System Relay</p>
           <Link href="/support" className="flex items-center gap-3 px-3 py-2.5 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all group">
              <MessageSquare size={14} />
              <span className="text-[10px] font-black uppercase tracking-wider">Signals</span>
           </Link>
           <Link href="/profile" className="flex items-center gap-3 px-3 py-2.5 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all group">
              <Settings size={14} />
              <span className="text-[10px] font-black uppercase tracking-wider">Metrics</span>
           </Link>
           <button className="w-full flex items-center gap-3 px-3 py-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-all group">
              <LogOut size={14} />
              <span className="text-[10px] font-black uppercase tracking-wider">Terminate</span>
           </button>
        </div>
      </nav>

      <div className="p-4 mt-auto">
         <div className="bg-slate-900 rounded-2xl p-4 text-white relative overflow-hidden group">
            <div className="relative z-10">
               <p className="text-[7px] font-black text-indigo-400 uppercase tracking-widest mb-1 text-center">Authenticated Proxy</p>
               <p className="text-[9px] font-bold truncate opacity-80 uppercase leading-none mb-1 text-center">Node: {role}</p>
            </div>
            <Zap className="absolute right-[-10px] bottom-[-10px] w-12 h-12 text-white/5 group-hover:text-indigo-600/20 transition-all duration-500" />
         </div>
      </div>
    </aside>
    </>
  );
}
