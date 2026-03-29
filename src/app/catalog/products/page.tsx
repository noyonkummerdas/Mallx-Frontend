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
      
      {/* Sidebar Overlay (Mobile) */}
      {!isSidebarOpen && (
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="fixed left-6 bottom-6 z-50 w-14 h-14 bg-slate-900 text-white rounded-full shadow-2xl flex items-center justify-center lg:hidden hover:scale-110 active:scale-95 transition-all"
        >
          <Filter className="w-6 h-6" />
        </button>
      )}

      <div className="flex">
        {/* LEFT SIDEBAR */}
        <aside className={`
          fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-slate-100 transform transition-transform duration-500 ease-in-out lg:sticky lg:top-20 lg:h-[calc(100vh-80px)] lg:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="h-full flex flex-col p-8">
             <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 accent-gradient rounded-lg flex items-center justify-center">
                      <SlidersHorizontal className="w-4 h-4 text-white" />
                   </div>
                   <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900">Explorer</h2>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-slate-900 transition-colors">
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
                         onClick={() => setSelectedCategory("")}
                         className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition-all group ${selectedCategory === "" ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20' : 'hover:bg-slate-50 text-slate-500'}`}
                       >
                          <span className="text-[10px] font-black uppercase tracking-widest">All Collection</span>
                          <ChevronRight className={`w-3.5 h-3.5 transition-transform ${selectedCategory === "" ? 'translate-x-1' : 'opacity-0 group-hover:opacity-100 translate-x-0'}`} />
                       </button>
                       {categories.map((cat: any) => (
                         <button 
                            key={cat._id}
                            onClick={() => setSelectedCategory(cat._id)}
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

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 min-w-0">
          {/* Header/Banner Area */}
          <div className="p-8 lg:p-12">
            <header className="mb-16 flex items-start justify-between">
               <div>
                  <div className="flex items-center gap-4 mb-4">
                     <button 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors hidden lg:block"
                     >
                        {isSidebarOpen ? <X className="w-5 h-5 text-slate-900" /> : <Filter className="w-5 h-5 text-slate-900" />}
                     </button>
                     <span className="text-action font-black tracking-[0.3em] text-[10px] uppercase">Elite Marketplace</span>
                  </div>
                  <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic text-gradient leading-tight">
                    {selectedCategory ? categories.find((c: any) => c._id === selectedCategory)?.name : 'Global Collection'}
                  </h1>
               </div>
               
               <div className="hidden sm:flex gap-4">
                  <div className="px-6 py-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-3">
                     <LayoutGrid className="w-4 h-4 text-slate-400" />
                     <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{products.length} Products</span>
                  </div>
               </div>
            </header>

            {/* Product Grid */}
            {isLoading ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="aspect-[4/5] rounded-[2rem] bg-slate-50 animate-pulse border border-slate-100" />
                  ))}
               </div>
            ) : products.length > 0 ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
                  {products.map((product: any) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
               </div>
            ) : (
               <div className="py-40 text-center glass-panel rounded-[3rem] border border-dashed border-slate-200 shadow-inner">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-slate-100">
                     <Filter className="w-8 h-8 text-slate-200" />
                  </div>
                  <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px] italic">No discovery in this sector</p>
               </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
