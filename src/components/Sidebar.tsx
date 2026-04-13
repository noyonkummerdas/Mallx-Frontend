"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useGetMeQuery } from "@/modules/identity/services/authApi";
import { useGetShopDetailsQuery } from "@/modules/business/services/businessApi";
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
  LogIn,
  CreditCard,
  Handshake,
  Megaphone,
  ShoppingBag,
  Activity,
  UserCog,
  Star
} from "lucide-react";

const menuItems = {
  admin: [
    { name: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
    { name: "Manage Users", href: "/dashboard/admin/users", icon: Users },
    { name: "Categories", href: "/dashboard/admin/catalog", icon: Package },
    { name: "Partners", href: "/dashboard/admin/partners", icon: Handshake },
    { name: "Logistics", href: "/dashboard/admin/logistics", icon: Truck },
    { name: "Marketing", href: "/dashboard/admin/marketing", icon: Megaphone },
    { name: "Orders", href: "/dashboard/admin/orders/returns", icon: ShoppingBag },
    { name: "Activity Logs", href: "/dashboard/admin/activity", icon: Activity },
    { name: "Settings", href: "/dashboard/admin/settings/profile", icon: UserCog },
  ],
  vendor: [
    { name: "Shop Overview", href: "/dashboard/vendor", icon: LayoutDashboard },
    { name: "Inventory", href: "/dashboard/vendor/products", icon: Package },
    { name: "Orders", href: "/dashboard/vendor/orders", icon: Store },
    { name: "Settlements", href: "/dashboard/vendor/finance", icon: Wallet },
    { name: "Promotions", href: "/dashboard/vendor/marketing", icon: Megaphone },
    { name: "Reviews", href: "/dashboard/vendor/reviews", icon: Star },
    { name: "Sales Reports", href: "/dashboard/vendor/reports", icon: Activity },
  ],
  partner: [
    { name: "Dashboard", href: "/dashboard/partner", icon: LayoutDashboard },
    { name: "Vendors", href: "/dashboard/partner/vendors", icon: Store },
    { name: "Create Vendor", href: "/dashboard/partner/vendors/create", icon: UserCog },
    { name: "Variants", href: "/dashboard/partner/products/variants", icon: Package },
    { name: "Locations", href: "/dashboard/partner/logistics/locations", icon: Truck },
    { name: "Campaigns", href: "/dashboard/partner/marketing", icon: Megaphone },
    { name: "Returns", href: "/dashboard/partner/orders/returns", icon: ShoppingBag },
    { name: "Inventory", href: "/dashboard/partner/inventory", icon: ShoppingCart },
    { name: "History", href: "/dashboard/partner/products/history", icon: Activity },
    { name: "Agents", href: "/dashboard/partner/agents", icon: Users },
    { name: "Commissions", href: "/dashboard/partner/commissions", icon: Wallet },
  ],
  delivery: [
    { name: "My Dashboard", href: "/dashboard/delivery", icon: LayoutDashboard },
    { name: "Available Loads", href: "/dashboard/delivery#loads", icon: Package },
    { name: "Shipments", href: "/dashboard/delivery#active", icon: Truck },
    { name: "Earnings", href: "/dashboard/delivery#earnings", icon: Wallet },
  ],
  customer: [
    { name: "Dashboard", href: "/dashboard/customer", icon: LayoutDashboard },
    { name: "Marketplace", href: "/catalog/products", icon: Store },
    { name: "Order History", href: "/orders", icon: Package },
    { name: "My Cart", href: "/shopping/cart", icon: ShoppingCart },
    { name: "Loyalty/Rewards", href: "/rewards", icon: Gift },
    { name: "Hot Deals", href: "/deals", icon: Zap },
  ]
};

// Determine dashboard link based on role
const getDashboardLink = (role: string) => {
  const normalizedRole = role?.toLowerCase();
  switch (normalizedRole) {
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
  switch (normalizedRole) {
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
  const [hash, setHash] = useState("");
  const { data: userData } = useGetMeQuery({});
  const { data: shopData } = useGetShopDetailsQuery({}, { skip: role !== "vendor" });

  const user = userData?.data?.user;
  const shopName = shopData?.data?.shop?.name;

  useEffect(() => {
    // Current hash logic
    setHash(window.location.hash);
    const handleHash = () => setHash(window.location.hash);
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, [pathname]);

  // Use real role from API if available, otherwise use prop
  const activeRole = user ? mapRoleToKey(user.role) : role;
  const items = menuItems[activeRole] || [];

  //   console.log("Sidebar Debug - User:", user?.role, "Prop Role:", role, "Resolved:", activeRole);

  const handleLogout = () => {
    localStorage.removeItem("mallx_token");
    window.location.href = "/auth/login";
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-[60] w-12 h-12 gradient-hero text-white rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20"
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

      <aside className={`fixed lg:sticky top-0 left-0 z-50 w-64 bg-white/90 backdrop-blur-xl border-r border-slate-200/40 flex flex-col h-screen overflow-y-auto transition-transform duration-300 lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
        }`}>

        {/* User Identity Section - Side-by-Side Layout */}
        <div className="sticky top-0 bg-white/40 backdrop-blur-md z-10 px-6 py-8 border-b border-slate-100/30 flex items-center gap-4 group">
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
            <p className="text-sm font-black text-slate-900 truncate uppercase tracking-tighter">
              {activeRole === "vendor" && shopName ? shopName : (user?.name || "Guest Account")}
            </p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-0.5">
              {activeRole === "vendor" && shopName ? (user?.name || "Vendor Profile") : (user?.role || "Nexus Member")}
            </p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1">
          <p className="px-3 text-sm text-slate-400 uppercase tracking-widest mb-2 opacity-60">Navigation</p>

          {items.map((item) => {
            const Icon = item.icon;
            const [itemPath, itemHash] = item.href.split('#');
            const isActive = itemHash
              ? (pathname === itemPath && hash === '#' + itemHash)
              : (itemPath === getDashboardLink(activeRole)
                ? pathname === itemPath
                : (pathname === itemPath || pathname.startsWith(itemPath + '/')));

            // console.log(`Sidebar Link [${item.name}] - isActive:`, isActive, { pathname, hash, itemPath, itemHash });

            const activeBgMap: Record<string, string> = {
              admin: "bg-admin shadow-admin/20",
              vendor: "bg-vendor shadow-vendor/20",
              partner: "bg-partner shadow-partner/20",
              delivery: "bg-slate-900 shadow-slate-900/10",
              customer: "bg-customer shadow-customer/20"
            };

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  const [_, newHash] = item.href.split('#');
                  setHash(newHash ? '#' + newHash : "");
                }}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl transition-all group ${isActive
                    ? `${activeBgMap[activeRole] || 'bg-primary'} text-white shadow-lg`
                    : "text-slate-500 hover:bg-section hover:text-primary"
                  }`}
              >
                <Icon size={14} className={isActive ? "text-white" : "group-hover:scale-110 group-hover:text-primary transition-all"} />
                <span className={`text-[11px] font-black uppercase tracking-wider ${isActive ? "text-white" : "text-slate-500"}`}>{item.name}</span>
              </Link>
            );
          })}

          <div className="pt-4 space-y-1">
            <p className="px-3 text-sm text-slate-400 uppercase tracking-widest mb-2 opacity-60">Account</p>

            <Link href="/support" className="flex items-center gap-2.5 px-3 py-2 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-all group">
              <MessageSquare size={14} />
              <span className="text-sm uppercase tracking-wider">Support Us</span>
            </Link>

            <Link href="/profile" className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl transition-all group ${pathname === "/profile"
                ? "gradient-hero text-white shadow-lg shadow-primary/20"
                : "text-slate-500 hover:bg-section hover:text-primary"
              }`}>
              <Settings size={14} />
              <span className={`text-[11px] font-black uppercase tracking-wider ${pathname === "/profile" ? "text-white" : "text-slate-500"}`}>Profile</span>
            </Link>

            {user ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-red-500 hover:bg-red-50 rounded-xl transition-all group"
              >
                <LogOut size={14} />
                <span className="text-sm uppercase tracking-wider">Logout</span>
              </button>
            ) : (
              <Link href="/auth/login" className="flex items-center gap-2.5 px-3 py-2 text-slate-900 hover:bg-slate-50 rounded-xl transition-all group">
                <LogIn size={14} />
                <span className="text-sm uppercase tracking-wider">Login</span>
              </Link>
            )}
          </div>
        </nav>

        {/* Bottom User Card */}
        {user && (
          <div className="p-3 mt-auto">
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <p className="text-sm text-slate-400 uppercase tracking-widest text-center">
                {user.email}
              </p>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
