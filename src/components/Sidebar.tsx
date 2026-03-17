"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useGetMeQuery } from "@/modules/identity/services/authApi";
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
  X,
  ShoppingCart,
  User,
  LogIn
} from "lucide-react";

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
    { name: "Earnings", href: "/dashboard/delivery#earnings", icon: Wallet },
  ],
  customer: [
    { name: "Dashboard", href: "/dashboard/customer", icon: LayoutDashboard },
    { name: "Order History", href: "/orders", icon: Package },
    { name: "My Cart", href: "/shopping/cart", icon: ShoppingCart },
    { name: "Loyalty/Rewards", href: "/rewards", icon: Gift },
    { name: "Hot Deals", href: "/deals", icon: Zap },
  ]
};

// Determine dashboard link based on role
const getDashboardLink = (role: string) => {
  const normalizedRole = role?.toLowerCase();
  switch(normalizedRole) {
    case "admin": return "/dashboard/admin";
    case "vendor": return "/dashboard/vendor";
    case "partner": return "/dashboard/partner";
    case "deliveryboy": return "/dashboard/delivery";
    case "customer": return "/dashboard/customer";
    default: return "/dashboard/customer";
  }
};

// Map API role names to sidebar role keys
const mapRoleToKey = (role: string): "admin" | "vendor" | "partner" | "delivery" | "customer" => {
  const normalizedRole = role?.toLowerCase();
  switch(normalizedRole) {
    case "admin": return "admin";
    case "vendor": return "vendor";
    case "partner": return "partner";
    case "deliveryboy": return "delivery";
    case "customer":
    default: return "customer";
  }
};

interface SidebarProps {
  role: "admin" | "vendor" | "partner" | "delivery" | "customer";
}

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { data: userData } = useGetMeQuery({});
  
  const user = userData?.data?.user;
  
  // Use real role from API if available, otherwise use prop
  const activeRole = user ? mapRoleToKey(user.role) : role;
  const items = menuItems[activeRole] || [];

  console.log("Sidebar Debug - User:", user?.role, "Prop Role:", role, "Resolved:", activeRole);

  const handleLogout = () => {
    localStorage.removeItem("mallx_token");
    window.location.href = "/auth/login";
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-[60] w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-xl shadow-slate-900/20"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity"
        />
      )}

      <aside className={`fixed lg:sticky top-0 left-0 z-50 w-56 bg-white border-r border-slate-200 flex flex-col h-screen overflow-y-auto transition-transform duration-300 lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        
        {/* User Identity Section - Side-by-Side Layout */}
        <div className="px-6 py-8 border-b border-slate-50 flex items-center gap-4 group">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-100 shadow-sm flex-shrink-0 group-hover:scale-110 transition-transform">
            {user?.photo ? (
              <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <img 
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80" 
                alt="User Profile" 
                className="w-full h-full object-cover grayscale opacity-70" 
              />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-slate-900 truncate uppercase tracking-tighter">
              {user?.name || "Guest Account"}
            </p>
            <p className="text-[8px] text-slate-400 uppercase tracking-widest mt-0.5">
              {user?.role || "Member"}
            </p>
          </div>
        </div>
        
      <nav className="flex-1 px-3 py-6 space-y-1">
        <p className="px-3 text-[9px] text-slate-400 uppercase tracking-widest mb-2 opacity-60">Navigation</p>
        
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname === item.href.split('#')[0];
          
          return (
            <Link 
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all group ${
                isActive 
                ? "bg-slate-900 text-white shadow-md shadow-slate-900/10" 
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon size={14} className={isActive ? "text-white" : "group-hover:scale-110 transition-transform"} />
              <span className="text-[10px] uppercase tracking-wider">{item.name}</span>
            </Link>
          );
        })}

        <div className="pt-4 space-y-1">
           <p className="px-3 text-[9px] text-slate-400 uppercase tracking-widest mb-2 opacity-60">Account</p>
           
           <Link href="/support" className="flex items-center gap-2.5 px-3 py-2 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-all group">
              <MessageSquare size={14} />
              <span className="text-[10px] uppercase tracking-wider">Support</span>
           </Link>
           
           <Link href="/profile" className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all group ${
             pathname === "/profile" 
             ? "bg-slate-900 text-white shadow-md shadow-slate-900/10" 
             : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
           }`}>
              <Settings size={14} />
              <span className="text-[10px] uppercase tracking-wider">Profile</span>
           </Link>

           {user ? (
             <button 
               onClick={handleLogout}
               className="w-full flex items-center gap-2.5 px-3 py-2 text-red-500 hover:bg-red-50 rounded-xl transition-all group"
             >
               <LogOut size={14} />
               <span className="text-[10px] uppercase tracking-wider">Logout</span>
             </button>
           ) : (
             <Link href="/auth/login" className="flex items-center gap-2.5 px-3 py-2 text-slate-900 hover:bg-slate-50 rounded-xl transition-all group">
               <LogIn size={14} />
               <span className="text-[10px] uppercase tracking-wider">Login</span>
             </Link>
           )}
        </div>
      </nav>

      {/* Bottom User Card */}
      {user && (
        <div className="p-3 mt-auto">
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
            <p className="text-[8px] text-slate-400 uppercase tracking-widest text-center">
              {user.email}
            </p>
          </div>
        </div>
      )}
    </aside>
    </>
  );
}
