"use client";

import { useGetProductsQuery, useGetCategoriesQuery } from "@/modules/shopping/services/productApi";
import ProductCard from "@/modules/catalog/components/ProductCard";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { 
   Filter, X, ChevronRight, LayoutGrid, Search, SlidersHorizontal, 
   Shirt, Watch, Briefcase, Zap, Star, Package, Diamond
} from "lucide-react";

export default function ProductListingPage() {
   const searchParams = useSearchParams();
   const categoryIdFromUrl = searchParams.get("categoryId");
   const typeFromUrl = searchParams.get("type");

   const [search, setSearch] = useState("");
   const [selectedCategory, setSelectedCategory] = useState(categoryIdFromUrl || "");
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
   const [sidebarTop, setSidebarTop] = useState(0);

   // --- DYNAMIC HERO CONTENT ---
   const heroContent: any = {
      men: {
         title: "Men's",
         accent: "Universe",
         subtitle: "Curated Elite Series",
         quote: "Redefining the modern silhouette with unparalleled precision and architectural grace.",
         image: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?q=80&w=2671&auto=format&fit=crop",
         cta: "Shop Edition"
      },
      women: {
         title: "Women's",
         accent: "Elegance",
         subtitle: "Luxury Couture Series",
         quote: "Embracing the fluid intersection of contemporary art and timeless feminine grace.",
         image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2670&auto=format&fit=crop",
         cta: "Explore Atelier"
      },
      boysgirls: {
         title: "Young",
         accent: "Discovery",
         subtitle: "Next-Gen Style Series",
         quote: "Fueling the spirit of adventure with vibrant textures and playful modern aesthetics.",
         image: "https://images.unsplash.com/photo-1514096702362-f0420e484c05?q=80&w=2670&auto=format&fit=crop",
         cta: "Launch Series"
      }
   };

   const currentHero = typeFromUrl ? heroContent[typeFromUrl] : null;

   // --- DYNAMIC CATEGORY ICON MAPPER ---
   const getCategoryIcon = (name: string) => {
      const lowerName = name.toLowerCase();
      // Apparel
      if (lowerName.includes('shirt') || lowerName.includes('apparel') || lowerName.includes('cloth') || lowerName.includes('dress') || lowerName.includes('wear')) return <Shirt className="w-6 h-6" />;
      // Timepieces
      if (lowerName.includes('watch') || lowerName.includes('time')) return <Watch className="w-6 h-6" />;
      // Toys & Tech
      if (lowerName.includes('toy') || lowerName.includes('game') || lowerName.includes('play')) return <Zap className="w-6 h-6 animate-pulse" />;
      // Accessories
      if (lowerName.includes('bag') || lowerName.includes('accessories') || lowerName.includes('jewelry') || lowerName.includes('purse') || lowerName.includes('shoe')) return <Briefcase className="w-6 h-6" />;
      // Tech/Gadgets
      if (lowerName.includes('electronic') || lowerName.includes('gadget')) return <Zap className="w-6 h-6" />;
      // Premium/New
      if (lowerName.includes('premium') || lowerName.includes('exclusive') || lowerName.includes('beauty') || lowerName.includes('cosmetic')) return <Star className="w-6 h-6" />;
      
      return <Diamond className="w-6 h-6" />;
   };

   // Sync URL changes with state
   useEffect(() => {
      if (categoryIdFromUrl) {
         setSelectedCategory(categoryIdFromUrl);
      }
   }, [categoryIdFromUrl]);

   const { data: categoryData, isLoading: catLoading } = useGetCategoriesQuery({});
   const { data: productData, isLoading } = useGetProductsQuery({
      name: search,
      categoryId: selectedCategory,
      type: typeFromUrl || undefined
   });

   const products = productData?.data?.products || [];
   const categories = categoryData?.data || [];

   // --- GROUP PRODUCTS BY CATEGORY (For Elite Selection) ---
   const isEliteView = typeFromUrl === "men" || typeFromUrl === "women" || typeFromUrl === "boysgirls";
   const groupedProducts = isEliteView 
      ? products.reduce((acc: any, product: any) => {
          const catName = product.categoryId?.name || "Boutique Collection";
          if (!acc[catName]) acc[catName] = [];
          acc[catName].push(product);
          return acc;
        }, {})
      : null;

   const hasGroupedProducts = groupedProducts && Object.keys(groupedProducts).length > 0;

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
                              className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition-all group ${selectedCategory === "" ? 'bg-slate-100 text-white shadow-xl shadow-slate-900/20' : 'hover:bg-slate-50 text-slate-500'}`}
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
                  
                  {/* --- ELITE HERO SECTION (Dynamic for Men/Women) --- */}
                  {currentHero && (
                     <div className="relative mb-24 rounded-[3rem] overflow-hidden group border border-slate-200/50 shadow-2xl shadow-slate-900/10">
                        <div className="absolute inset-0 bg-slate-900">
                           <div className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay transition-transform duration-1000 group-hover:scale-105" 
                                style={{ backgroundImage: `url(${currentHero.image})` }} />
                           <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                        </div>
                        
                        <div className="relative p-12 lg:p-24 flex flex-col items-start gap-10">
                           <div className="flex items-center gap-3 px-5 py-2.5 bg-white/5 backdrop-blur-2xl rounded-full border border-white/10">
                              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_12px_rgba(79,70,229,0.5)] animate-pulse" />
                              <span className="text-[9px] font-bold text-white uppercase tracking-[0.4em]">{currentHero.subtitle}</span>
                           </div>
                           
                           <div className="max-w-2xl">
                              <h2 className="text-6xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-none mb-8">
                                 {currentHero.title} <br/>
                                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-slate-200 to-indigo-100">{currentHero.accent}</span>
                              </h2>
                              <p className="text-slate-400 text-xl font-light italic leading-relaxed border-l-2 border-indigo-500/30 pl-8">
                                 "{currentHero.quote}"
                              </p>
                           </div>
                           
                           <div className="flex flex-wrap items-center gap-8 mt-6">
                              <button className="group relative px-12 py-5 bg-white text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] overflow-hidden transition-all active:scale-95">
                                 <span className="relative z-10 transition-colors group-hover:text-white">{currentHero.cta}</span>
                                 <div className="absolute inset-0 bg-slate-900 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                              </button>
                              <button className="px-12 py-5 bg-transparent border border-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/5 transition-all">
                                 View Lookbook
                              </button>
                           </div>
                        </div>

                        {/* Minimal Stats */}
                        <div className="absolute top-12 right-12 hidden md:block">
                           <div className="flex flex-col items-end gap-2">
                              <span className="text-4xl font-black text-white/20 tracking-tighter">EST. 2024</span>
                           </div>
                        </div>
                     </div>
                  )}

                  {/* 4. PRODUCT LISTING - CATEGORIZED FOR ELITE VIEWS, GRID FOR OTHERS */}
                  {isLoading ? (
                     <div className={`grid gap-12 ${isSidebarOpen
                        ? 'grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'
                        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'
                        }`}>
                        {[...Array(10)].map((_, i) => (
                           <div key={i} className="aspect-[3/4] rounded-[2.5rem] bg-white/40 animate-pulse border border-white/20" />
                        ))}
                     </div>
                  ) : isEliteView && hasGroupedProducts ? (
                     <div className={`space-y-48 animate-in fade-in slide-in-from-bottom-10 duration-1000 relative`}>
                        {/* Dynamic Background Glow for Youthful Vibe */}
                        {typeFromUrl === "boysgirls" && (
                           <div className="absolute -top-24 -left-24 w-[600px] h-[600px] bg-cyan-400/10 blur-[120px] -z-10 rounded-full animate-pulse" />
                        )}
                        
                        {Object.entries(groupedProducts).map(([catName, catProducts]: [string, any], index) => (
                           <section key={catName} className="relative group/section">
                              <header className="mb-20">
                                 <div className={`flex items-end justify-between border-b border-slate-100 pb-10 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${typeFromUrl === 'boysgirls' ? 'group-hover/section:border-cyan-500/40' : 'group-hover/section:border-indigo-500/40'}`}>
                                    <div className="flex flex-col gap-6">
                                       <div className="flex items-center gap-8">
                                          <div className="flex items-center gap-3">
                                             <div className={`w-1.5 h-1.5 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.4)] ${typeFromUrl === 'boysgirls' ? 'bg-cyan-500 shadow-cyan-500/40' : 'bg-indigo-600 shadow-indigo-600/40'}`} />
                                             <span className={`${typeFromUrl === 'boysgirls' ? 'text-cyan-600' : 'text-indigo-600'} font-black text-[9px] tracking-[0.6em] uppercase`}>Division / 0{index + 1}</span>
                                          </div>
                                          <div className="h-[1px] w-24 bg-gradient-to-r from-slate-200 to-transparent" />
                                       </div>
                                       <div className="flex items-center gap-6">
                                          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border transition-all duration-700 ${
                                             typeFromUrl === 'boysgirls' 
                                             ? 'bg-cyan-50/50 text-cyan-600 border-cyan-100 group-hover/section:bg-cyan-500 group-hover/section:text-white group-hover/section:scale-110 shadow-sm' 
                                             : 'bg-slate-50 text-slate-900 border-slate-100 group-hover/section:bg-slate-900 group-hover/section:text-white group-hover/section:scale-110 shadow-sm'
                                          }`}>
                                             {getCategoryIcon(catName)}
                                          </div>
                                          <h3 className="text-5xl md:text-7xl font-black text-slate-900 uppercase tracking-tighter transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/section:translate-x-4">
                                             {catName}
                                          </h3>
                                       </div>
                                    </div>
                                    <div className="hidden md:flex flex-col items-end gap-3 mb-4">
                                       <div className="px-4 py-1.5 bg-slate-50 rounded-full border border-slate-100">
                                          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Authentic Inventory</span>
                                       </div>
                                       <span className="text-2xl font-black text-slate-950 tracking-tight">{catProducts.length} <span className="text-slate-300 font-light ml-1">Items</span></span>
                                    </div>
                                 </div>
                              </header>
                              
                              <div className={`grid gap-14 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${isSidebarOpen
                                 ? 'grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'
                                 : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'
                                 }`}>
                                 {catProducts.map((product: any) => (
                                    <div key={product._id} className="transform transition-all duration-700 hover:-translate-y-2">
                                       <ProductCard product={product} />
                                    </div>
                                 ))}
                              </div>
                           </section>
                        ))}
                     </div>
                  ) : products.length > 0 ? (
                     <div className={`grid gap-14 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${isSidebarOpen
                        ? 'grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'
                        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'
                        }`}>
                        {products.map((product: any) => (
                           <div key={product._id} className="transform transition-all duration-700 hover:-translate-y-2">
                              <ProductCard product={product} />
                           </div>
                        ))}
                     </div>
                  ) : (
                     <div className="py-48 text-center glass-panel rounded-[5rem] border border-dashed border-slate-200 shadow-[inset_0_20px_50px_rgba(0,0,0,0.02)]">
                        <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-slate-200/50 border border-slate-50">
                           <Filter className="w-10 h-10 text-slate-200" />
                        </div>
                        <p className="text-slate-400 font-bold uppercase tracking-[0.5em] text-[11px] mb-10">No active discoveries found</p>
                        <button
                           onClick={() => { setSelectedCategory(""); setSearch(""); }}
                           className="px-12 py-5 bg-slate-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-indigo-600 transition-all active:scale-95 shadow-2xl shadow-slate-900/20"
                        >
                           Reset Navigation
                        </button>
                     </div>
                  )}
               </div>
            </div>
         </div>
      </main>
   );
}
