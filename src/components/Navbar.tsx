"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useGetMeQuery } from "@/modules/identity/services/authApi";
import { useGetCategoriesQuery } from "@/modules/shopping/services/productApi";
import { useState, useEffect } from "react";
import { ShoppingBag, User as UserIcon, Menu, Search, Mic, Bell, LayoutGrid, Compass } from "lucide-react";
import { useCart } from "@/modules/shopping/hooks/useCart";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: userData, isLoading } = useGetMeQuery({});
  const { data: categoryData } = useGetCategoriesQuery({});
  const { totalCount } = useCart();
  const [showPopup, setShowPopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isAuthPage = pathname.startsWith("/auth");
  const isDashboard = pathname.startsWith("/dashboard");
  const isSupportMain = pathname === "/support";

  const dbCategories = categoryData?.data || [];

  const divisions = [
    { label: "Marketplace", href: "/catalog/products" },
    { label: "Men", href: "/catalog/products?type=men" },
    { label: "Women", href: "/catalog/products?type=women" },
    { label: "Boys & Girls", href: "/catalog/products?type=boysgirls" },
    { label: "Kids", href: "/catalog/products?type=kids" },
  ];

  const chips = [
    ...divisions,
  ];

  useEffect(() => {
    if (!userData && !isAuthPage) {
      const timer = setTimeout(() => setShowPopup(true), 15000);
      return () => clearTimeout(timer);
    }
  }, [userData, isAuthPage]);

  if (isAuthPage || isDashboard || isSupportMain) return null;

  const user = userData?.data?.user;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/catalog/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <>
      {/* SIDEBAR OVERLAY */}
      <div
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* SLIDING SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 h-full w-[280px] bg-white z-[70] shadow-2xl transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="h-[72px] px-6 flex items-center gap-4 border-b border-slate-100">
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <Menu className="w-6 h-6 text-slate-700" />
            </button>
            <Link href="/" className="flex items-center gap-2 group" onClick={() => setIsSidebarOpen(false)}>
              <div className="bg-slate-900 text-white rounded-lg px-2 py-0.5 font-black text-lg">M</div>
              <span className="text-xl font-black tracking-tighter text-slate-900 uppercase">MallX</span>
            </Link>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto py-6">
            {/* Divisions Section */}
            <div className="px-3 mb-8">
              <div className="px-4 mb-2 flex items-center gap-2">
                <Compass className="w-4 h-4 text-indigo-600" />
                <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Explore Divisions</h5>
              </div>
              <div className="space-y-1">
                {divisions.map((cat) => (
                  <Link
                    key={cat.label}
                    href={cat.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className="flex items-center px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-all group"
                  >
                    <span className="flex-1">{cat.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Dynamic Categories Section */}
            {dbCategories.length > 0 && (
              <div className="px-3 mb-8">
                <div className="px-4 mb-2 flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4 text-indigo-600" />
                  <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Categories</h5>
                </div>
                <div className="space-y-1">
                  {dbCategories.map((cat: any) => (
                    <Link
                      key={cat._id}
                      href={`/catalog/products?categoryId=${cat._id}`}
                      onClick={() => setIsSidebarOpen(false)}
                      className="flex items-center px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-all group"
                    >
                      <span className="flex-1">{cat.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-slate-100 px-3">
              <div className="px-4 mb-2">
                <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Account Settings</h5>
              </div>
              <div className="space-y-1">
                <Link href="/dashboard" className="flex items-center px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl transition-all">My Dashboard</Link>
                <Link href="/shopping/orders" className="flex items-center px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl transition-all">Order History</Link>
                <Link href="/support" className="flex items-center px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl transition-all">Help & Support</Link>
              </div>
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="p-6 bg-slate-50 border-t border-slate-100">
            <p className="text-[10px] text-slate-400 font-medium">© 2026 MallX Elite. All rights reserved.</p>
          </div>
        </div>
      </aside>

      <div className="sticky top-0 z-50 w-full flex flex-col">
        {/* MAIN NAVBAR */}
        <nav className="w-full bg-white/90 backdrop-blur-md border-b border-slate-100 transition-all duration-300">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-[72px] flex items-center justify-between gap-4">

            {/* LEFT SECTION: Hamburger Menu & Logo */}
            <div className="flex items-center gap-4 sm:gap-6 min-w-fit">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <Menu className="w-6 h-6 text-slate-700" strokeWidth={1.5} />
              </button>
              <Link href="/" className="flex items-center gap-2 group">
                <div className="bg-slate-900 text-white rounded-lg px-2.5 py-1 font-black tracking-tighter text-lg leading-none transform group-hover:scale-105 transition-all shadow-lg shadow-slate-900/10">
                  M
                </div>
                <span className="text-xl font-black tracking-tighter text-slate-900 uppercase hidden sm:block">
                  MallX
                </span>
              </Link>
            </div>

            {/* CENTER SECTION: Search Bar */}
            <div className="flex-1 max-w-[720px] flex items-center gap-2 sm:gap-4 ml-4 sm:ml-8 mr-2 sm:mr-8">
              <form
                onSubmit={handleSearch}
                className="flex flex-1 items-center bg-white border border-slate-300 rounded-full overflow-hidden shadow-inner focus-within:border-indigo-500 focus-within:shadow-[0_0_0_1px_rgba(79,70,229,0.1)] transition-all"
              >
                <div className="hidden sm:flex items-center pl-4 pr-2">
                  <Search className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent px-4 sm:px-2 py-2.5 outline-none text-slate-700 placeholder-slate-400 text-sm sm:text-base"
                />
                <button
                  type="submit"
                  className="px-4 sm:px-6 py-2.5 bg-slate-50 border-l border-slate-300 hover:bg-slate-100 transition-colors flex items-center justify-center group"
                >
                  <Search className="w-5 h-5 text-slate-600 group-hover:text-slate-900 transition-colors" strokeWidth={1.5} />
                </button>
              </form>
              <button
                type="button"
                className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors flex-shrink-0 hidden sm:flex items-center justify-center"
                title="Search with your voice"
              >
                <Mic className="w-5 h-5 text-slate-700" strokeWidth={1.5} />
              </button>
            </div>

            {/* RIGHT SECTION: Icons & User Profile */}
            <div className="flex items-center gap-2 sm:gap-4 min-w-fit">
              <button className="p-2 hover:bg-slate-100 rounded-full transition-colors hidden md:block group">
                <Bell className="w-6 h-6 text-slate-600 group-hover:text-slate-900 transition-colors" strokeWidth={1.5} />
              </button>

              <Link href="/shopping/cart" className="relative p-2 hover:bg-slate-100 rounded-full transition-colors flex items-center justify-center group">
                <ShoppingBag className="w-6 h-6 text-slate-600 group-hover:text-indigo-600 transition-colors" strokeWidth={1.5} />
                {totalCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-indigo-600 text-[10px] font-black text-white flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                    {totalCount}
                  </span>
                )}
              </Link>

              {isLoading ? (
                <div className="w-8 h-8 rounded-full bg-slate-100 animate-pulse ml-2" />
              ) : user ? (
                <Link href={user.role === 'Admin' ? '/dashboard/admin' : user.role === 'Vendor' ? '/dashboard/vendor' : '/dashboard/customer'} className="ml-1 sm:ml-2">
                  <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-sm hover:ring-4 hover:ring-slate-50 transition-all overflow-hidden border border-slate-200">
                    {user.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
                  </div>
                </Link>
              ) : (
                <Link href="/auth/login" className="ml-1 sm:ml-2">
                  <div className="flex items-center gap-2 px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-full transition-all text-sm font-bold text-slate-700">
                    <UserIcon className="w-4 h-4" />
                    <span className="hidden sm:block uppercase tracking-wider text-[10px]">Sign in</span>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </nav>

        {/* CATEGORY BAR (The YouTube Style Chips) */}
        <div className="w-full bg-white/80 backdrop-blur-md border-b border-slate-100 py-3 overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-end gap-3 overflow-x-auto no-scrollbar scroll-smooth">
              {chips.map((chip) => {
                const isActive = pathname === chip.href || (pathname === "/catalog/products" && chip.label === "All");
                return (
                  <Link
                    key={chip.label}
                    href={chip.href}
                    className={`
                      whitespace-nowrap px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-300
                      ${isActive
                        ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}
                    `}
                  >
                    {chip.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-[320px] bg-white rounded-2xl shadow-2xl p-6 border border-slate-100 animate-in slide-in-from-bottom-10 duration-700 z-[100]">
          <button onClick={() => setShowPopup(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 transition-colors">✕</button>
          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4">
            <ShoppingBag className="w-6 h-6 text-indigo-600" />
          </div>
          <h4 className="text-lg font-black mb-1 text-slate-900 tracking-tight">Experience MallX</h4>
          <p className="text-sm text-slate-500 leading-relaxed mb-6">Join our elite community for personalized offers and premium collections.</p>
          <Link href="/auth/register" onClick={() => setShowPopup(false)}>
            <button className="w-full bg-slate-900 hover:bg-indigo-600 text-white py-3 rounded-xl text-xs font-black uppercase tracking-[0.15em] transition-all shadow-lg shadow-slate-900/20 active:scale-95">
              Claim Membership
            </button>
          </Link>
        </div>
      )}
    </>
  );
}
