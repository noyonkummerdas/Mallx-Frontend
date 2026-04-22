"use client";

import { useGetProductsQuery, useGetCategoriesQuery } from "@/modules/shopping/services/productApi";
import ProductCard from "@/modules/catalog/components/ProductCard";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Filter, X, ChevronRight, LayoutGrid, Search, SlidersHorizontal } from "lucide-react";

export default function ProductListingPage() {
   const searchParams = useSearchParams();
   const categoryIdFromUrl = searchParams.get("categoryId");

   const [search, setSearch] = useState("");
   const [selectedCategory, setSelectedCategory] = useState(categoryIdFromUrl || "");
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
   const [sidebarTop, setSidebarTop] = useState(0);

   // Sync URL changes with state
   useEffect(() => {
      if (categoryIdFromUrl) {
         setSelectedCategory(categoryIdFromUrl);
      }
   }, [categoryIdFromUrl]);

   const { data: categoryData, isLoading: catLoading } = useGetCategoriesQuery({});
   const { data: productData, isLoading } = useGetProductsQuery({
      name: search,
      categoryId: selectedCategory
   });

   const products = productData?.data?.products || [];
   const categories = categoryData?.data || [];

   return (
      <main className="min-h-screen mesh-gradient text-slate-900 relative selection:bg-indigo-600/10">
         <div className="glow-bg opacity-40" />

         <div className="relative min-h-screen bg-background">

            {/* 2. FLOATING SIDEBAR DRAWER */}
            <aside
               style={{ top: `${sidebarTop}px`, height: `calc(100vh - ${sidebarTop}px)` }}
               className={`
          fixed left-0 z-40 w-80 bg-white/80 border border-gray-200 rounded-2xl backdrop-blur-[60px] transform transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) origin-top [perspective:2000px]
          ${isSidebarOpen ? 'scale-y-100 opacity-100 [transform:rotateX(0deg)_translateZ(0)]' : 'scale-y-0 opacity-0 [transform:rotateX(-10deg)_translateZ(-100px)]'}
        `}>
               <div className="h-full flex flex-col p-8">
                  <div className="flex items-center justify-between mb-12">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 gradient-hero rounded-lg flex items-center justify-center">
                           <SlidersHorizontal className="w-4 h-4 text-white" />
                        </div>
                        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900">Category</h2>
                     </div>
                     <button onClick={() => setIsSidebarOpen(false)} className="text-slate-400 hover:text-slate-900 transition-colors">
                        <X className="w-5 h-5" />
                     </button>
                  </div>

                  <div className="space-y-8 flex-1 overflow-y-auto scrollbar-hide">
                     {/* Search in Sidebar */}
                     <div className="relative group px-1">
                        <input
                           type="text"
                           placeholder="Search products..."
                           value={search}
                           onChange={(e) => setSearch(e.target.value)}
                           className="w-full bg-slate-50/50 border border-gray-200 rounded-xl px-2 py-2 pl-11 text-[11px] font-bold focus:ring-4 focus:ring-action/5 focus:border-action outline-none transition-all placeholder:text-slate-300 backdrop-blur-md"
                        />
                        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-action transition-colors" />
                     </div>

                     {/* Categories */}
                     <div>

                        <div className="space-y-1.5 px-0.5">
                           <button
                              onClick={() => { setSelectedCategory(""); }}
                              className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition-all group ${selectedCategory === "" ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20' : 'hover:bg-slate-50 text-slate-500'}`}
                           >
                              <span className="text-[10px] font-black uppercase tracking-widest">All Collection</span>
                              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${selectedCategory === "" ? 'translate-x-1' : 'opacity-0 group-hover:opacity-100 translate-x-0'}`} />
                           </button>
                           {categories.map((cat: any) => (
                              <button
                                 key={cat._id}
                                 onClick={() => { setSelectedCategory(cat._id); }}
                                 className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition-all group ${selectedCategory === cat._id ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20' : 'hover:bg-slate-50 text-slate-500'}`}
                              >
                                 <span className="text-[10px] font-black uppercase tracking-widest">{cat.name}</span>
                                 <ChevronRight className={`w-3.5 h-3.5 transition-transform ${selectedCategory === cat._id ? 'translate-x-1' : 'opacity-0 group-hover:opacity-100 translate-x-0'}`} />
                              </button>
                           ))}
                        </div>
                     </div>
                  </div>

                  <div className="pt-8 border-t border-slate-100 mt-auto">
                     <div className="p-6 text-center border border-gray-200">
                        <p className="text-[12px] font-black uppercase tracking-widest leading-relaxed">
                           Mall materials
                        </p>
                     </div>
                  </div>
               </div>
            </aside>

            {/* 3. MAIN CONTENT AREA - FULL WIDTH BY DEFAULT */}
            <div className={`min-w-0 transition-all duration-500 flex flex-col ${isSidebarOpen ? 'lg:ml-80' : ''}`}>
               <div className="p-6 lg:p-12 max-w-[1600px] mx-auto">
                  <header className="mb-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                     <div className="flex items-center gap-10 min-h-[64px]">
                        {!isSidebarOpen && (
                           <button
                              onClick={(e) => {
                                 const rect = e.currentTarget.getBoundingClientRect();
                                 setSidebarTop(rect.top);
                                 setIsSidebarOpen(true);
                              }}
                              className="p-5 bg-white border border-slate-100 rounded-2xl hover:border-indigo-600 transition-all active:scale-95 group relative overflow-hidden"
                              title="Open Filters"
                           >
                              <div className="flex flex-col gap-1.5 w-6 relative z-10">
                                 <div className="h-0.5 bg-slate-900 rounded-full w-full" />
                                 <div className="h-0.5 bg-slate-900 rounded-full w-2/3 transition-all group-hover:w-full" />
                                 <div className="h-0.5 bg-slate-900 rounded-full w-full" />
                              </div>
                           </button>
                        )}
                        <div className="flex flex-col">
                           <span className="text-green-600 font-extrabold tracking-[0.6em] text-[12px] uppercase opacity-70 mb-1 ml-2">Collection Focus</span>
                           <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-[0.1em] uppercase leading-none">
                              {selectedCategory ? categories.find((c: any) => c._id === selectedCategory)?.name : 'Global Collection'}
                           </h1>
                        </div>
                     </div>

                     <div className="flex items-center gap-4 self-end md:self-auto">
                        <div className="px-5 py-2 glass-panel rounded-full border border-white/40 flex items-center gap-3 shadow-xl shadow-indigo-500/5">
                           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]" />
                           <span className="text-[8px] font-black  uppercase tracking-[0.4em]">{products.length} Discovery Found</span>
                        </div>
                     </div>
                  </header>

                  {/* 4. PRODUCT GRID - DYNAMIC COLUMNS */}
                  {isLoading ? (
                     <div className={`grid gap-8 ${isSidebarOpen
                        ? 'grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'
                        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'
                        }`}>
                        {[...Array(10)].map((_, i) => (
                           <div key={i} className="aspect-square rounded-2xl bg-white/40 animate-pulse border border-white/20" />
                        ))}
                     </div>
                  ) : products.length > 0 ? (
                     <div className={`grid gap-8 transition-all duration-500 ${isSidebarOpen
                        ? 'grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'
                        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'
                        }`}>
                        {products.map((product: any) => (
                           <ProductCard key={product._id} product={product} />
                        ))}
                     </div>
                  ) : (
                     <div className="py-40 text-center glass-panel rounded-[3rem] border border-dashed border-slate-200 shadow-inner">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-slate-100">
                           <Filter className="w-10 h-10 text-slate-200" />
                        </div>
                        {/* <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-2">Sector Depleted</h3> */}
                        <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">No active products detected with current parameters</p>
                        <button
                           onClick={() => { setSelectedCategory(""); setSearch(""); }}
                           className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-action transition-all active:scale-95 shadow-xl shadow-slate-900/20"
                        >
                           Reset Explorer
                        </button>
                     </div>
                  )}
               </div>
            </div>
         </div>
      </main>
   );
}
