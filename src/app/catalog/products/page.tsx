"use client";

import { useGetProductsQuery, useGetCategoriesQuery } from "@/modules/shopping/services/productApi";
import ProductCard from "@/modules/catalog/components/ProductCard";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Filter, X, ChevronRight, LayoutGrid, Search, SlidersHorizontal } from "lucide-react";

export default function ProductListingPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const { data: categoryData, isLoading: catLoading } = useGetCategoriesQuery({});
  const { data: productData, isLoading } = useGetProductsQuery({ 
    name: search, 
    categoryId: selectedCategory 
  });

  const products = productData?.data?.products || [];
  const categories = categoryData?.data || [];

  return (
    <main className="min-h-screen bg-white text-slate-900 relative selection:bg-action/30">
      <div className="glow-bg" />
      
      <div className="relative min-h-screen bg-background">
        {/* 1. SIDEBAR BACKDROP */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* 2. FLOATING SIDEBAR DRAWER */}
        <aside className={`
          fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-slate-100 transform transition-transform duration-500 ease-in-out shadow-2xl
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="h-full flex flex-col p-8">
             <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 gradient-hero rounded-lg flex items-center justify-center">
                      <SlidersHorizontal className="w-4 h-4 text-white" />
                   </div>
                   <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900">Explorer</h2>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="text-slate-400 hover:text-slate-900 transition-colors">
                   <X className="w-5 h-5" />
                </button>
             </div>

             <div className="space-y-12 flex-1 overflow-y-auto scrollbar-hide">
                {/* Search in Sidebar */}
                 <div>
                    <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mb-5 border-l-2 border-action pl-3 self-start">Search</h3>
                    <div className="relative group">
                       <input 
                         type="text" 
                         placeholder="Discover products..." 
                         value={search}
                         onChange={(e) => setSearch(e.target.value)}
                         className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 pl-11 text-[11px] font-bold focus:ring-4 focus:ring-action/5 focus:border-action outline-none transition-all placeholder:text-slate-300"
                       />
                       <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-action transition-colors" />
                    </div>
                 </div>

                {/* Categories */}
                 <div>
                    <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mb-5 border-l-2 border-action pl-3 self-start">Categories</h3>
                    <div className="space-y-1.5 px-0.5">
                       <button 
                         onClick={() => { setSelectedCategory(""); setIsSidebarOpen(false); }}
                         className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition-all group ${selectedCategory === "" ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20' : 'hover:bg-slate-50 text-slate-500'}`}
                       >
                          <span className="text-[10px] font-black uppercase tracking-widest">All Collection</span>
                          <ChevronRight className={`w-3.5 h-3.5 transition-transform ${selectedCategory === "" ? 'translate-x-1' : 'opacity-0 group-hover:opacity-100 translate-x-0'}`} />
                       </button>
                       {categories.map((cat: any) => (
                         <button 
                            key={cat._id}
                            onClick={() => { setSelectedCategory(cat._id); setIsSidebarOpen(false); }}
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
                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                      Discover the future of high-performance commerce.
                   </p>
                </div>
             </div>
          </div>
        </aside>

        {/* 3. MAIN CONTENT AREA - FULL WIDTH BY DEFAULT */}
        <div className="min-w-0">
          <div className="p-8 lg:p-16 max-w-[1800px] mx-auto">
            <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
               <div className="flex items-start gap-6">
                  <button 
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-4 bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/50 hover:border-action transition-all active:scale-95 group"
                    title="Toggle Filters"
                  >
                     <div className="flex flex-col gap-1 w-5">
                        <div className="h-0.5 bg-slate-900 rounded-full w-full group-hover:bg-action transition-colors" />
                        <div className="h-0.5 bg-slate-900 rounded-full w-2/3 group-hover:w-full group-hover:bg-action transition-all" />
                        <div className="h-0.5 bg-slate-900 rounded-full w-full group-hover:bg-action transition-colors" />
                     </div>
                  </button>
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                       <span className="text-action font-black tracking-[0.4em] text-[10px] uppercase">Elite Marketplace</span>
                       <div className="h-px w-8 bg-action/20" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase text-gradient leading-tight">
                      {selectedCategory ? categories.find((c: any) => c._id === selectedCategory)?.name : 'Global Collection'}
                    </h1>
                  </div>
               </div>
               
               <div className="flex items-center gap-4 self-end md:self-auto">
                  <div className="px-6 py-3 bg-white border border-slate-100 rounded-2xl flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                     <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{products.length} Discovery Found</span>
                  </div>
               </div>
            </header>

            {/* 4. PRODUCT GRID - EXPANDED COLUMNS */}
            {isLoading ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-10">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="aspect-[4/5] rounded-[2.5rem] bg-slate-50 animate-pulse border border-slate-100" />
                  ))}
               </div>
            ) : products.length > 0 ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-10">
                  {products.map((product: any) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
               </div>
            ) : (
               <div className="py-40 text-center glass-panel rounded-[3rem] border border-dashed border-slate-200 shadow-inner">
                  <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-slate-100">
                     <Filter className="w-10 h-10 text-slate-200" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-2">Sector Depleted</h3>
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
