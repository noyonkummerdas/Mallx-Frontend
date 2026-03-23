"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useGetProductsQuery, useGetCategoriesQuery } from "@/modules/shopping/services/productApi";
import { useGetCampaignsQuery, useGetFlashSalesQuery, useGetBundlesQuery } from "@/modules/shopping/services/marketingApi";

export default function Home() {
  const { data: campaignData, isLoading: campaignsLoading } = useGetCampaignsQuery({});
  const { data: flashSaleData, isLoading: flashSalesLoading } = useGetFlashSalesQuery({});
  const { data: bundleData, isLoading: bundlesLoading } = useGetBundlesQuery({});
  const { data: categoryData } = useGetCategoriesQuery({});
  const { data: featuredData, isLoading: productsLoading } = useGetProductsQuery({ limit: 8 });

  const campaigns = campaignData?.data || [];
  const flashSales = flashSaleData?.data || [];
  const bundles = bundleData?.data?.bundles || [];
  const categories = categoryData?.data || [];
  const featuredProducts = featuredData?.data?.products || [];

  const [activeCampaignIdx, setActiveCampaignIdx] = useState(0);

  // Auto-play for Campaign Slider
  useEffect(() => {
    if (campaigns.length > 0) {
      const timer = setInterval(() => {
        setActiveCampaignIdx((prev) => (prev + 1) % campaigns.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [campaigns]);

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-accent/30">
      <div className="glow-bg" />
      
      {/* 1. HERO CAMPAIGN SLIDER */}
      <section className="relative pt-8 pb-20 px-4 max-w-7xl mx-auto overflow-hidden">
        {campaignsLoading ? (
          <div className="h-[400px] bg-white/5 rounded-[3rem] animate-pulse border border-white/5" />
        ) : campaigns.length > 0 ? (
          <div className="relative h-[450px] rounded-[3rem] overflow-hidden group shadow-2xl">
            {campaigns.map((camp: any, idx: number) => (
              <div 
                key={camp._id}
                className={`absolute inset-0 transition-all duration-1000 ease-in-out ${idx === activeCampaignIdx ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-105 rotate-1 pointer-events-none'}`}
              >
                <img 
                  src={camp.bannerUrl || "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2000"} 
                  className="w-full h-full object-cover" 
                  alt={camp.name} 
                />
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
                <div className="absolute bottom-16 left-16 max-w-xl text-left">
                  <span className="inline-block px-4 py-1.5 bg-accent text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 shadow-xl shadow-accent/20">Active Campaign</span>
                  <h1 className="text-5xl font-black text-white tracking-tighter mb-6 uppercase italic text-gradient leading-tight">{camp.name}</h1>
                  <button className="px-10 py-4 accent-gradient text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transform active:scale-95 transition-all shadow-xl shadow-indigo-500/20">Explore Now</button>
                </div>
              </div>
            ))}
            
            {/* Slider Dots */}
            <div className="absolute bottom-6 right-12 flex gap-3">
              {campaigns.map((_, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveCampaignIdx(idx)}
                  className={`w-3 h-3 rounded-full transition-all border-2 ${idx === activeCampaignIdx ? 'bg-white border-white w-8' : 'bg-white/20 border-white/10'}`} 
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="h-[400px] glass-panel rounded-[3rem] items-center justify-center flex">
             <h2 className="text-2xl font-black text-white/20 uppercase tracking-[0.5em]">MallX Showcase</h2>
          </div>
        )}
      </section>

      {/* 2. CATEGORY QUICK THUMBNAILS */}
      <section className="pb-20 px-4 max-w-7xl mx-auto">
         <div className="flex flex-wrap items-center justify-center gap-6">
            {categories.slice(0, 6).map((cat: any) => (
               <Link key={cat._id} href={`/catalog/products?categoryId=${cat._id}`} className="flex flex-col items-center gap-4 group">
                  <div className="w-16 h-16 rounded-full bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-accent group-hover:border-accent transition-all duration-300 shadow-sm group-hover:shadow-[0_0_20px_var(--accent-glow)]">
                     <span className="text-xl font-black text-white/50 group-hover:text-white transition-colors">{cat.name.charAt(0)}</span>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-white transition-colors">{cat.name}</span>
               </Link>
            ))}
         </div>
      </section>

      {/* 3. FLASH SALES SECTION (Horizontal Scroll) */}
      {flashSales.length > 0 && (
      <section className="pb-32 px-4 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
           <div className="text-left">
              <span className="text-accent font-black tracking-[0.3em] text-[10px] uppercase mb-2 block">Timeless Deals</span>
              <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">Flash Sales</h2>
           </div>
           <div className="hidden md:flex items-center gap-3">
              <div className="glass-panel px-4 py-2 rounded-xl border border-white/5 flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                 <span className="text-[10px] font-black text-white uppercase tracking-widest">Ending Soon</span>
              </div>
           </div>
        </div>

        <div className="flex gap-8 overflow-x-auto pb-8 scrollbar-hide">
          {flashSales.map((sale: any) => (
            <Link 
              href={`/catalog/products/${sale.productId?._id}`} 
              key={sale._id} 
              className="glass-card min-w-[300px] p-2 rounded-[2.5rem] flex flex-col group"
            >
              <div className="w-full aspect-[4/5] rounded-[2rem] overflow-hidden bg-white/5 relative mb-6">
                <img src={sale.productId?.images?.[0]?.imageUrl || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Flash Sale" />
                <div className="absolute top-4 left-4 bg-red-600 text-[9px] font-black text-white px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg">Limited Stock</div>
              </div>
              <div className="px-6 pb-6 text-left">
                <h3 className="text-lg font-bold text-white mb-2 uppercase line-clamp-1">{sale.productId?.name}</h3>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-black text-white">{sale.discountPrice} TK</span>
                  <span className="text-sm text-slate-500 line-through font-bold">{sale.productId?.price} TK</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      )}

      {/* 4. COMBO PRODUCT (BUNDLE) SHOWCASE */}
      {bundles.length > 0 && (
      <section className="pb-32 px-4 max-w-7xl mx-auto">
        <div className="glass-panel p-12 rounded-[3.5rem] relative overflow-hidden group border border-white/10">
           <div className="absolute top-0 right-0 w-1/3 h-full bg-accent/10 blur-[80px] group-hover:opacity-40 transition-opacity" />
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="text-left relative z-10">
                 <span className="text-accent font-black tracking-[0.3em] text-[10px] uppercase mb-4 block">Better Together</span>
                 <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-[0.9] text-gradient mb-8">Premium <br /> Combo Deals</h2>
                 <p className="text-slate-400 font-medium leading-relaxed mb-12">Save big when you buy specialized bundles. Curated by our experts for your specific needs.</p>
                 <button className="px-12 py-5 bg-white text-black rounded-3xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all">Claim Bundle Deals</button>
              </div>
              <div className="grid grid-cols-2 gap-6 relative z-10">
                 {bundles.slice(0, 2).map((bundle: any) => (
                    <div key={bundle._id} className="p-6 bg-white/5 rounded-[2.5rem] border border-white/5 hover:border-accent/40 transition-all">
                       <h4 className="text-base font-bold text-white mb-2 uppercase italic tracking-tighter">{bundle.name}</h4>
                       <p className="text-2xl font-black text-accent mb-4">{bundle.bundlePrice.toLocaleString()} TK</p>
                       <div className="flex -space-x-3 mb-4">
                          {bundle.products.slice(0, 3).map((p: any, i: number) => (
                             <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 overflow-hidden bg-slate-800 shadow-xl">
                                <img src={p.productId?.images?.[0]?.imageUrl || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=40"} className="w-full h-full object-cover" />
                             </div>
                          ))}
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </section>
      )}

      {/* 5. CATEGORY-WISE PRODUCT SHOWCASE */}
      <section className="pb-32 px-4 max-w-7xl mx-auto">
        {categories.slice(0, 3).map((cat: any) => (
           <CategoryShowcase key={cat._id} category={cat} />
        ))}
      </section>

      {/* 6. CALL TO ACTION */}
      <section className="py-40 px-8 text-center max-w-4xl mx-auto">
        <h2 className="text-6xl font-black text-white tracking-tighter mb-8 uppercase italic leading-[0.9] text-gradient">Ready to elevate <br /> your commerce?</h2>
        <p className="text-slate-500 mb-12 font-medium">Join 50,000+ elite members experience today.</p>
        <Link href="/auth/register">
          <button className="px-16 py-7 accent-gradient text-white rounded-full font-black text-[12px] uppercase tracking-[0.25em] hover:brightness-110 transition-all active:scale-95 shadow-2xl shadow-indigo-500/30">
            Secure Member Benefits
          </button>
        </Link>
      </section>
    </main>
  );
}

// Category Showcase Sub-component
function CategoryShowcase({ category }: { category: any }) {
   const { data: catProducts, isLoading } = useGetProductsQuery({ categoryId: category._id, limit: 4 });
   const products = catProducts?.data?.products || [];

   if (products.length === 0 && !isLoading) return null;

   return (
      <div className="mb-24">
         <div className="flex items-end justify-between mb-10">
            <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">{category.name} <span className="text-accent">Collection</span></h3>
            <Link href={`/catalog/products?categoryId=${category._id}`} className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Browse Gallery →</Link>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {isLoading ? (
               [...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-[4/5] rounded-[2.5rem] bg-white/5 animate-pulse border border-white/5" />
               ))
            ) : (
               products.map((product: any) => (
                  <Link 
                     href={`/catalog/products/${product._id}`} 
                     key={product._id} 
                     className="glass-card group p-2 rounded-[2.5rem] overflow-hidden flex flex-col"
                  >
                     <div className="w-full aspect-square rounded-[2rem] overflow-hidden bg-white/5 mb-6 relative">
                        <img 
                           src={product.images?.[0]?.imageUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000"} 
                           className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        />
                        <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-[9px] font-black text-white uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">Buy Now</div>
                     </div>
                     <div className="px-6 pb-6 text-left">
                        <h4 className="text-base font-bold text-white mb-2 uppercase line-clamp-1 group-hover:text-accent transition-colors">{product.name}</h4>
                        <p className="text-xl font-black text-white">{product.price.toLocaleString()} <span className="text-[10px] text-slate-500 ml-1">TK</span></p>
                     </div>
                  </Link>
               ))
            )}
         </div>
      </div>
   );
}

