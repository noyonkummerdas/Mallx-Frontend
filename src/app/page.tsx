"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useGetProductsQuery, useGetCategoriesQuery } from "@/modules/shopping/services/productApi";
import { useGetCampaignsQuery, useGetFlashSalesQuery, useGetBundlesQuery, useGetVouchersQuery } from "@/modules/shopping/services/marketingApi";

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
    <main className="min-h-screen bg-background text-foreground selection:bg-action/30">
      <div className="glow-bg" />
      
      {/* 1. HERO CAMPAIGN SLIDER */}
      <section className="relative pt-8 pb-20 px-4 max-w-7xl mx-auto overflow-hidden">
        {campaignsLoading ? (
          <div className="h-[450px] bg-white/5 rounded-[2.5rem] animate-pulse border border-white/5" />
        ) : campaigns.length > 0 ? (
          <div className="relative h-[450px] rounded-[2.5rem] overflow-hidden group shadow-2xl transition-all duration-700">
            {campaigns.map((camp: any, idx: number) => (
              <div 
                key={camp._id}
                className={`absolute inset-0 transition-all duration-1000 ease-in-out ${idx === activeCampaignIdx ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'}`}
              >
                <img 
                  src={camp.bannerUrl || "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2000"} 
                  className="w-full h-full object-cover" 
                  alt={camp.name} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                <div className="absolute bottom-16 left-16 max-w-xl text-left">
                  <span className="inline-block px-4 py-1.5 bg-action text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 shadow-xl shadow-blue-500/20">Featured Campaign</span>
                  <h1 className="text-5xl font-black text-white tracking-tighter mb-6 uppercase italic leading-tight">{camp.name}</h1>
                  <button className="px-10 py-4 accent-gradient text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transform active:scale-95 transition-all shadow-xl shadow-indigo-500/20">Shop the Sale</button>
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
          <div className="h-[450px] glass-panel rounded-[2.5rem] items-center justify-center flex">
             <h2 className="text-2xl font-black text-white/10 uppercase tracking-[0.5em]">MallX Showcase</h2>
          </div>
        )}
      </section>

      {/* 2. CATEGORY QUICK THUMBNAILS */}
      <section className="pb-24 px-4 max-w-7xl mx-auto">
         <div className="flex flex-wrap items-center justify-center gap-10">
            {categories.slice(0, 8).map((cat: any) => (
                <Link key={cat._id} href={`/catalog/products?categoryId=${cat._id}`} className="flex flex-col items-center gap-4 group">
                  <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:border-action group-hover:scale-110 transition-all duration-300 shadow-sm group-hover:shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                     <span className="text-xl font-black text-slate-400 group-hover:text-action transition-colors uppercase">{cat.name.charAt(0)}</span>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-900 transition-colors">{cat.name}</span>
               </Link>
            ))}
         </div>
      </section>

      {/* 3. FLASH SALES SECTION (Horizontal Scroll) */}
      {flashSales.length > 0 && (
      <section className="pb-32 px-4 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
            <div className="text-left border-l-4 border-action pl-6">
              <span className="text-action font-black tracking-[0.3em] text-[10px] uppercase mb-1 block">Limited Duration</span>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Flash Sales</h2>
            </div>
            <Link href="/deals" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-all">View All Sales →</Link>
        </div>           <div className="flex gap-8 overflow-x-auto pb-12 scrollbar-hide snap-x -mx-4 px-4">
          {flashSales.map((sale: any) => {
            const discountPercent = Math.round(((sale.productId?.price - sale.discountPrice) / sale.productId?.price) * 100);
            return (
              <Link 
                href={`/catalog/products/${sale.productId?._id}`} 
                key={sale._id} 
                className="glass-card min-w-[280px] p-3 rounded-[2rem] flex flex-col group snap-start"
              >
                <div className="w-full h-48 rounded-[1.5rem] overflow-hidden bg-slate-50 relative mb-6">
                  <img src={sale.productId?.images?.[0]?.imageUrl || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Flash Sale" />
                  <div className="absolute top-3 left-3 bg-red-600 text-[8px] font-black text-white px-3 py-1.5 rounded-full uppercase tracking-tighter shadow-xl">-{discountPercent}% OFF</div>
                  {sale.stock <= 10 && (
                     <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-[8px] font-black text-white px-3 py-1.5 rounded-lg uppercase tracking-widest border border-white/10">{sale.stock} Left</div>
                  )}
                </div>
                <div className="px-4 pb-4 text-left">
                  <h3 className="text-sm font-bold text-slate-900 mb-2 uppercase line-clamp-1 group-hover:text-action transition-colors tracking-tight">{sale.productId?.name}</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-black text-slate-900 tracking-tighter">{sale.discountPrice.toLocaleString()} TK</span>
                    <span className="text-[10px] text-slate-400 line-through font-bold opacity-40">{sale.productId?.price?.toLocaleString()} TK</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
      )}

      {/* 4. COMBO PRODUCT (BUNDLE) SHOWCASE */}
      {bundles.length > 0 && (
      <section className="pb-32 px-4 max-w-7xl mx-auto">
        <div className="glass-panel p-16 rounded-[3.5rem] relative overflow-hidden group border border-slate-100 shadow-2xl">
           <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-500/5 blur-[100px] group-hover:opacity-40 transition-opacity" />
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="text-left relative z-10">
                 <span className="text-action font-black tracking-[0.3em] text-[10px] uppercase mb-4 block">Engineered Bundles</span>
                 <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-[0.9] text-gradient mb-8">MallX <br /> Elite Combos</h2>
                 <p className="text-slate-400 font-bold leading-relaxed mb-12 uppercase tracking-widest text-[11px] opacity-60">Unlock unprecedented value with our curated professional bundles.</p>
                 <button className="px-12 py-5 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all hover:bg-slate-800">Claim the Duo</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 relative z-10">
                 {bundles.slice(0, 2).map((bundle: any) => (
                    <div key={bundle._id} className="p-8 bg-white rounded-[2.5rem] border border-slate-200 hover:border-action/40 transition-all shadow-sm">
                       <h4 className="text-base font-black text-slate-900 mb-2 uppercase italic tracking-tighter">{bundle.name}</h4>
                       <p className="text-2xl font-black text-action mb-6">{bundle.bundlePrice.toLocaleString()} TK</p>
                       <div className="flex -space-x-4 mb-2">
                          {bundle.products.slice(0, 3).map((p: any, i: number) => (
                             <div key={i} className="w-12 h-12 rounded-full border-4 border-white overflow-hidden bg-slate-100 shadow-md">
                                <img src={p.productId?.images?.[0]?.imageUrl || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=40"} className="w-full h-full object-cover" />
                             </div>
                          ))}
                       </div>
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Limited Edition</span>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </section>
      )}

      {/* 5. CATEGORY-WISE PRODUCT SHOWCASE */}
      <section className="pb-32 px-4 max-w-7xl mx-auto">
        {categories.slice(0, 4).map((cat: any) => (
           <CategoryShowcase key={cat._id} category={cat} />
        ))}
      </section>

      {/* 6. CALL TO ACTION */}
      <section className="py-40 px-8 text-center max-w-4xl mx-auto relative">
        <div className="absolute inset-0 bg-action/5 blur-[120px] rounded-full" />
        <h2 className="text-6xl font-black text-slate-900 tracking-tighter mb-8 uppercase italic leading-[0.9] text-gradient relative z-10">Join the Elite <br /> Marketplace</h2>
        <p className="text-slate-400 mb-12 font-bold uppercase tracking-widest text-[12px] opacity-60 relative z-10">Secure your position in the future of commerce.</p>
        <Link href="/auth/register" className="relative z-10">
          <button className="px-16 py-7 accent-gradient text-white rounded-2xl font-black text-[12px] uppercase tracking-[0.25em] hover:brightness-110 transition-all active:scale-95 shadow-2xl shadow-indigo-600/30">
            Apply for Membership
          </button>
        </Link>
      </section>
    </main>
  );
}

// Category Showcase Sub-component
function CategoryShowcase({ category }: { category: any }) {
   const { data: catProducts, isLoading } = useGetProductsQuery({ categoryId: category._id, limit: 12 });
   const { data: bundleData } = useGetBundlesQuery({ categoryId: category._id });
   const { data: voucherData } = useGetVouchersQuery({ categoryId: category._id });
   const { data: flashData } = useGetFlashSalesQuery({ categoryId: category._id });
   
   const products = catProducts?.data?.products || [];
   const bundles = bundleData?.data?.bundles || [];
   const vouchers = voucherData?.data?.vouchers || [];
   const categoryFlash = flashData?.data || [];

   if (products.length === 0 && !isLoading) return null;

   return (
      <div className="mb-32">
         {/* Category Header */}
         <div className="flex items-end justify-between mb-10 border-b border-slate-100 pb-8">
            <h3 className="text-3xl font-black text-slate-900 italic uppercase tracking-tighter">
               {category.name} <span className="text-action">Vertical</span>
            </h3>
            <div className="flex items-center gap-6">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest hidden md:block">Scroll for More →</span>
               <Link href={`/catalog/products?categoryId=${category._id}`} className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 hover:text-action transition-colors bg-slate-50 px-4 py-2 rounded-full border border-slate-200">Digital Gallery</Link>
            </div>
         </div>

         {/* Category Marketing Slider (Flash, Bundles & Coupons) */}
         {(categoryFlash.length > 0 || bundles.length > 0 || vouchers.length > 0) && (
            <div className="flex gap-6 overflow-x-auto pb-10 scrollbar-hide snap-x mb-2">
               {categoryFlash.map((flash: any) => {
                  const discountPercent = Math.round(((flash.productId?.price - flash.discountPrice) / flash.productId?.price) * 100);
                  return (
                     <div key={flash._id} className="min-w-[340px] h-48 bg-red-600/10 border border-red-600/20 rounded-[2rem] p-8 flex flex-col justify-between relative overflow-hidden group snap-start shadow-xl">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 blur-3xl rounded-full translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform"                         <div className="relative z-10 flex justify-between items-start">
                           <div>
                              <span className="text-[9px] font-black text-red-600 uppercase tracking-[0.2em]">Flash Surge</span>
                              <h4 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter mt-1 truncate max-w-[180px]">{flash.productId?.name}</h4>
                           </div>
                           <div className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-lg">-{discountPercent}%</div>
                        </div>
                        <div className="flex items-end justify-between relative z-10">
                           <div className="flex flex-col">
                              <p className="text-2xl font-black text-slate-900 tracking-tighter">{flash.discountPrice.toLocaleString()} TK</p>
                              <span className="text-[10px] font-black text-slate-900/40 uppercase tracking-widest">{flash.stock} Units Left</span>
                           </div>
                           <Link href={`/catalog/products/${flash.productId?._id}`} className="px-6 py-2 bg-red-600 text-white text-[10px] font-black uppercase rounded-xl tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-red-600/20">Grab Now</Link>
                        </div>
iv>
                     </div>
                  );
               })}
               {bundles.map((bundle: any) => (
                  <div key={bundle._id} className="min-w-[400px] h-48 accent-gradient rounded-[2rem] p-8 flex flex-col justify-between relative overflow-hidden group snap-start shadow-xl">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform" />
                     <div className="relative z-10">
                        <span className="text-[9px] font-black text-white/60 uppercase tracking-[0.2em]">Exclusive Bundle</span>
                        <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter mt-1">{bundle.name}</h4>
                     </div>
                     <div className="flex items-end justify-between relative z-10">
                        <p className="text-3xl font-black text-white">{bundle.bundlePrice.toLocaleString()} TK</p>
                        <button className="px-6 py-2 bg-white text-black text-[10px] font-black uppercase rounded-xl tracking-widest hover:scale-105 active:scale-95 transition-all">Claim Pack</button>
                     </div>
                  </div>
                               {vouchers.map((voucher: any) => (
                  <div key={voucher._id} className="min-w-[320px] h-48 bg-white border-2 border-dashed border-action/40 rounded-[2rem] p-8 flex flex-col justify-between snap-start group relative">
                     <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-background rounded-full border-2 border-slate-100" />
                     <div>
                        <span className="text-[9px] font-black text-action uppercase tracking-[0.2em]">Category Coupon</span>
                        <h4 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter mt-2">{voucher.discountValue}{voucher.discountType === 'Percentage' ? '%' : ' TK'} OFF</h4>
                     </div>
                     <div className="flex items-center justify-between">
                        <code className="text-xs font-black text-slate-400 uppercase tracking-widest">{voucher.code}</code>
                        <button className="text-[10px] font-black text-white uppercase tracking-widest bg-action px-4 py-2 rounded-xl active:scale-95 transition-all">Collect</button>
                     </div>
                  </div>
               ))}
))}
            </div>
         )}

         {/* 2-Row Horizontal Scroll Grid */}
         <div className="grid grid-rows-2 grid-flow-col gap-8 overflow-x-auto pb-10 scrollbar-hide -mx-4 px-4 snap-x">
            {isLoading ? (
               [...Array(12)].map((_, i) => (
                  <div key={i} className="w-[300px] aspect-[4/5] rounded-[2rem] bg-slate-50 animate-pulse border border-slate-200" />
               ))
            ) : (
               products.map((product: any) => (
                  <Link 
                     href={`/catalog/products/${product._id}`} 
                     key={product._id} 
                     className="glass-card group p-3 rounded-[2rem] overflow-hidden flex flex-col shadow-sm w-[300px] snap-start"
                  >
                     <div className="w-full aspect-square rounded-[1.5rem] overflow-hidden bg-slate-50 mb-6 relative">
                        <img 
                           src={product.images?.[0]?.imageUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000"} 
                           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] border-2 border-white px-6 py-2 rounded-xl">Details</span>
                        </div>
                     </d                      <div className="px-4 pb-4 text-left">
                        <h4 className="text-sm font-black text-slate-400 mb-2 uppercase line-clamp-1 group-hover:text-slate-900 transition-colors tracking-tight">{product.name}</h4>
                        <div className="flex items-center gap-3">
                           {product.discountPrice ? (
                              <>
                                 <p className="text-xl font-black text-slate-900 tracking-tighter">{product.discountPrice.toLocaleString()} <span className="text-[10px] text-slate-400 ml-1">TK</span></p>
                                 <p className="text-[10px] text-slate-400 line-through font-bold opacity-40">{product.price.toLocaleString()} TK</p>
                              </>
                           ) : (
                              <p className="text-xl font-black text-slate-900 tracking-tighter">{product.price.toLocaleString()} <span className="text-[10px] text-slate-400 ml-1">TK</span></p>
                           )}
                        </div>
                     </div>
iv>
                  </Link>
               ))
            )}
         </div>
      </div>
   );
}
