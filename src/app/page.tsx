"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight, Shirt, Smartphone, ShoppingBasket, Home as HomeIcon, Watch, Trophy, Sparkles, Cpu, Headphones, Gem, Footprints, ShoppingBag, Baby } from "lucide-react";
import { useGetProductsQuery, useGetCategoriesQuery } from "@/modules/shopping/services/productApi";
import { useGetCampaignsQuery, useGetFlashSalesQuery, useGetBundlesQuery, useGetVouchersQuery } from "@/modules/shopping/services/marketingApi";
import ProductCard from "@/modules/catalog/components/ProductCard";

export default function Home() {
   const { data: campaignData, isLoading: campaignsLoading } = useGetCampaignsQuery({});
   const { data: flashSaleData, isLoading: flashSalesLoading } = useGetFlashSalesQuery({});
   const { data: bundleData, isLoading: bundlesLoading } = useGetBundlesQuery({});
   const { data: categoryData } = useGetCategoriesQuery({});
   const { data: featuredData, isLoading: productsLoading } = useGetProductsQuery({ limit: 8 });

   const campaigns = campaignData?.data || [];
   const fashionBanners = [
      { _id: 'f1', name: 'Elite Fashion Combo', bannerUrl: '/banners/combo.png', tag: 'Elite Combo' },
      { _id: 'f2', name: 'Summer Luxury Sale', bannerUrl: '/banners/discount.png', tag: 'Limited Discount' },
      { _id: 'f3', name: 'Designer BOGO Event', bannerUrl: '/banners/bogo.png', tag: 'Buy 1 Get 1' },
      { _id: 'f4', name: 'New Season Arrival', bannerUrl: '/banners/collection.png', tag: 'New Collection' },
   ];

   // Prioritize fashion banners for this request
   const displayCampaigns = fashionBanners;
   const flashSales = flashSaleData?.data?.flashSales || [];
   const bundles = bundleData?.data?.bundles || [];
   const categories = categoryData?.data || [];
   const featuredProducts = featuredData?.data?.products || [];

   const [activeCampaignIdx, setActiveCampaignIdx] = useState(0);
   const categoryScrollRef = useRef<HTMLDivElement>(null);

   const scrollCategories = (direction: 'left' | 'right') => {
      if (categoryScrollRef.current) {
         const scrollAmount = 400;
         categoryScrollRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
         });
      }
   };


   // Auto-play for Campaign Slider
   useEffect(() => {
      if (displayCampaigns.length > 0) {
         const timer = setInterval(() => {
            setActiveCampaignIdx((prev) => (prev + 1) % displayCampaigns.length);
         }, 5000);
         return () => clearInterval(timer);
      }
   }, [displayCampaigns]);

   return (
      <main className="min-h-screen bg-white text-slate-900 selection:bg-action/30">
         <div className="glow-bg" />

         {/* 1. HERO CAMPAIGN SLIDER */}
         <section className="relative pt-8 pb-20 px-4 max-w-7xl mx-auto overflow-hidden">
            {campaignsLoading ? (
               <div className="h-[450px] bg-slate-50  animate-pulse border border-slate-200" />
            ) : displayCampaigns.length > 0 ? (
               <div className="relative h-[450px] overflow-hidden group shadow-lg transition-all duration-700 border-[1px] border-gray-900 rounded-lg backdrop-blur-md bg-white/5 mx-2">
                  {displayCampaigns.map((camp: any, idx: number) => (
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
                           <span className="inline-block px-4 py-1.5 bg-action text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 shadow-xl shadow-blue-500/20">{camp.tag || 'Featured Campaign'}</span>
                           <h1 className="text-5xl font-black text-white tracking-tighter mb-6 uppercase italic leading-tight">{camp.name}</h1>
                           <button className="px-10 py-4 accent-gradient text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transform active:scale-95 transition-all shadow-xl shadow-indigo-500/20">Shop the Sale</button>
                        </div>
                     </div>
                  ))}

                  {/* Slider Dots */}
                  <div className="absolute bottom-6 right-12 flex gap-3">
                     {displayCampaigns.map((_, idx) => (
                        <button
                           key={idx}
                           onClick={() => setActiveCampaignIdx(idx)}
                           className={`w-3 h-3 rounded-full transition-all border-2 ${idx === activeCampaignIdx ? 'bg-white border-white w-8' : 'bg-white/20 border-white/10'}`}
                        />
                     ))}
                  </div>
               </div>
            ) : (
               <div className="h-[450px] glass-panel rounded-[2.5rem] items-center justify-center flex border border-slate-200">
                  <h2 className="text-2xl font-black text-slate-200 uppercase tracking-[0.5em]">MallX Showcase</h2>
               </div>
            )}
         </section>

         {/* 2. CATEGORY QUICK THUMBNAILS (Horizontal Carousel) */}
         <section className="pb-24 px-4 max-w-7xl mx-auto relative group">
            {/* Navigation Buttons - Only visible on hover/appropriate screen size */}
            <div className="absolute top-1/2 -left-4 -right-4 -translate-y-1/2 flex justify-between items-center z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
               <button
                  onClick={() => scrollCategories('left')}
                  className="w-12 h-12 rounded-full bg-white shadow-xl border border-slate-100 flex items-center justify-center pointer-events-auto hover:bg-slate-50 active:scale-90 transition-all ml-2"
               >
                  <ChevronLeft className="w-6 h-6 text-slate-600" />
               </button>
               <button
                  onClick={() => scrollCategories('right')}
                  className="w-12 h-12 rounded-full bg-white shadow-xl border border-slate-100 flex items-center justify-center pointer-events-auto hover:bg-slate-50 active:scale-90 transition-all mr-2"
               >
                  <ChevronRight className="w-6 h-6 text-slate-600" />
               </button>
            </div>

            <div
               ref={categoryScrollRef}
               className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x -mx-4 px-4 scroll-smooth"
            >
               {categories.map((cat: any, idx: number) => {
                  const gradients = [
                     'from-blue-600 to-cyan-500',
                     'from-purple-600 to-indigo-500',
                     'from-rose-600 to-pink-500',
                     'from-amber-500 to-orange-600',
                     'from-emerald-600 to-teal-500',
                     'from-violet-600 to-fuchsia-500',
                     'from-sky-600 to-blue-500',
                     'from-slate-700 to-slate-900'
                  ];
                  const currentGradient = gradients[idx % gradients.length];

                  return (
                     <Link
                        key={cat._id}
                        href={`/catalog/products?categoryId=${cat._id}`}
                        className="group relative snap-start flex-shrink-0"
                     >
                        <div className="glass-panel p-6 rounded-[2.5rem] flex flex-col items-center gap-4 transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_20px_50px_rgba(59,130,246,0.15)] group-hover:border-action/30 border border-slate-100 min-w-[150px] text-center">
                           {/* Icon Box - Squircle Shape */}
                           <div className={`w-16 h-16 rounded-[1.8rem] bg-gradient-to-br ${currentGradient} p-[1px] shadow-lg group-hover:rotate-6 transition-all duration-500`}>
                              <div className="w-full h-full rounded-[1.7rem] bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                                 <span className="text-2xl font-black text-white drop-shadow-md uppercase">{cat.name.charAt(0)}</span>
                              </div>
                           </div>

                           <div>
                              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-slate-900 transition-colors block mb-1">Explore</span>
                              <span className="text-xs font-black uppercase tracking-tight text-slate-800 group-hover:text-action transition-colors">{cat.name}</span>
                           </div>

                           {/* Subtle Indicator */}
                           <div className="absolute bottom-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                              <div className="w-1 h-1 rounded-full bg-action shadow-[0_0_10px_#3b82f6]" />
                           </div>
                        </div>
                     </Link>
                  );
               })}
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
               </div>
               <div className="flex gap-8 overflow-x-auto pb-12 scrollbar-hide snap-x -mx-4 px-4">
                  {flashSales.map((sale: any) => {
                     const discountPercent = Math.round(((sale.productId?.price - sale.discountPrice) / sale.productId?.price) * 100);
                     return (
                        <Link
                           href={`/catalog/products/${sale.productId?._id}`}
                           key={sale._id}
                           className="glass-card min-w-[280px] p-3 flex flex-col group snap-start"
                        >
                           <div className="w-full h-48 rounded-[4px] overflow-hidden bg-slate-50 relative mb-6">
                              <img src={sale.productId?.images?.[0]?.imageUrl || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Flash Sale" />
                              <div className="absolute top-3 left-3 bg-red-600 text-[8px] font-black text-white px-3 py-1.5 rounded-full uppercase tracking-tighter shadow-xl">-{discountPercent}% OFF</div>
                              {sale.stock <= 10 && (
                                 <div className="absolute bottom-3 right-3 bg-slate-900/60 backdrop-blur-md text-[8px] font-black text-white px-3 py-1.5 rounded-lg uppercase tracking-widest border border-white/10">{sale.stock} Left</div>
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
         {/* {bundles.length > 0 && (
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
         )} */}

         {/* 5. CATEGORY-WISE PRODUCT SHOWCASE */}
         <section className="pb-32 px-4 max-w-7xl mx-auto">
            {categories.map((cat: any) => (
               <CategoryShowcase key={cat._id} category={cat} />
            ))}
         </section>

         {/* 6. CALL TO ACTION */}
         {/* <section className="py-40 px-8 text-center max-w-4xl mx-auto relative">
            <div className="absolute inset-0 bg-action/5 blur-[120px] rounded-full" />
            <h2 className="text-6xl font-black text-slate-900 tracking-tighter mb-8 uppercase italic leading-[0.9] text-gradient relative z-10">Join the Elite <br /> Marketplace</h2>
            <p className="text-slate-400 mb-12 font-bold uppercase tracking-widest text-[12px] opacity-60 relative z-10">Secure your position in the future of commerce.</p>
            <Link href="/auth/register" className="relative z-10">
               <button className="px-16 py-7 accent-gradient text-white rounded-2xl font-black text-[12px] uppercase tracking-[0.25em] hover:brightness-110 transition-all active:scale-95 shadow-2xl shadow-indigo-600/30">
                  Apply for Membership
               </button>
            </Link>
         </section> */}
      </main>
   );
}

function CategoryShowcase({ category }: { category: any }) {
   const { data: catProducts, isLoading } = useGetProductsQuery({ categoryId: category._id, limit: 12 });
   const { data: bundleData } = useGetBundlesQuery({ categoryId: category._id });
   const { data: voucherData } = useGetVouchersQuery({ categoryId: category._id });
   const { data: flashData } = useGetFlashSalesQuery({ categoryId: category._id });

   const products = catProducts?.data?.products || [];
   const bundles = bundleData?.data?.bundles || [];
   const vouchers = voucherData?.data?.vouchers || [];
   const categoryFlash = flashData?.data?.flashSales || [];

   const scrollRef = useRef<HTMLDivElement>(null);
   const [isHovered, setIsHovered] = useState(false);

   useEffect(() => {
      if (isHovered || products.length <= 1) return;

      const interval = setInterval(() => {
         if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            if (scrollLeft + clientWidth >= scrollWidth - 10) {
               scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
               scrollRef.current.scrollBy({ left: 352, behavior: 'smooth' }); // Width of one card (320) + gap (32)
            }
         }
      }, 3000);

      return () => clearInterval(interval);
   }, [isHovered, products.length]);

   const scroll = (direction: 'left' | 'right') => {
      if (scrollRef.current) {
         const scrollAmount = 352;
         scrollRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
         });
      }
   };

   const getCategoryIcon = (name: string) => {
      const lowerName = name.toLowerCase();
      // Fashion & Apparel
      if (lowerName.includes('fashion') || lowerName.includes('clothing') || lowerName.includes('shirt')) return <Shirt className="w-6 h-6" />;
      // Tech & Digital
      if (lowerName.includes('phone') || lowerName.includes('mobile') || lowerName.includes('smartphone')) return <Smartphone className="w-6 h-6" />;
      if (lowerName.includes('electronic') || lowerName.includes('tech') || lowerName.includes('gadget') || lowerName.includes('computer')) return <Cpu className="w-6 h-6" />;
      if (lowerName.includes('audio') || lowerName.includes('headphone') || lowerName.includes('sound')) return <Headphones className="w-6 h-6" />;
      // Lifestyle & Living
      if (lowerName.includes('home') || lowerName.includes('living') || lowerName.includes('furniture') || lowerName.includes('kitchen')) return <HomeIcon className="w-6 h-6" />;
      if (lowerName.includes('grocery') || lowerName.includes('food') || lowerName.includes('supermarket')) return <ShoppingBasket className="w-6 h-6" />;
      // Accessories (The 90% use case)
      if (lowerName.includes('watch') || lowerName.includes('timepiece')) return <Watch className="w-6 h-6" />;
      if (lowerName.includes('accessory') || lowerName.includes('jewelry') || lowerName.includes('luxury') || lowerName.includes('gold') || lowerName.includes('diamond')) return <Gem className="w-6 h-6" />;
      if (lowerName.includes('shoe') || lowerName.includes('footwear') || lowerName.includes('sneaker') || lowerName.includes('boot')) return <Footprints className="w-6 h-6" />;
      if (lowerName.includes('bag') || lowerName.includes('handbag') || lowerName.includes('backpack') || lowerName.includes('purse')) return <ShoppingBag className="w-6 h-6" />;
      // specialized
      if (lowerName.includes('sport') || lowerName.includes('gym') || lowerName.includes('fitness')) return <Trophy className="w-6 h-6" />;
      if (lowerName.includes('beauty') || lowerName.includes('makeup') || lowerName.includes('cosmetic') || lowerName.includes('skin')) return <Sparkles className="w-6 h-6" />;
      if (lowerName.includes('baby') || lowerName.includes('kid') || lowerName.includes('toy')) return <Baby className="w-6 h-6" />;

      return <ShoppingBag className="w-6 h-6 opacity-40" />; // Default Shopping Mall Vibe
   };

   if (products.length === 0 && !isLoading) return null;

   return (
      <div
         className="mb-32 relative group/section"
         onMouseEnter={() => setIsHovered(true)}
         onMouseLeave={() => setIsHovered(false)}
      >
         {/* Category Header */}
         <div className="flex items-end justify-between mb-10 border-b border-slate-100 pb-4">
            <div className="flex flex-col gap-2">
               <div className="flex items-center gap-4">
                  <div className="relative group/icon">
                     <div className="p-3 bg-white border border-slate-200 rounded-lg text-action group-hover/icon:bg-action group-hover/icon:text-black-200 transition-all duration-500 shadow-sm">
                        {getCategoryIcon(category.name)}
                     </div>
                     {/* Dynamic Reason Indicator */}
                     <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-4 py-2 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-xl whitespace-nowrap opacity-0 group-hover/icon:opacity-100 transition-opacity pointer-events-none z-20">
                        <span className="flex items-center gap-2">
                           <div className="w-1 h-1 bg-action rounded-full animate-ping" />
                           Smart Matched For {category.name}
                        </span>
                     </div>
                  </div>
                  <span className="text-2xl font-black text-black-200 uppercase">{category.name}</span>
               </div>
            </div>
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-2 mr-4">
                  <button
                     onClick={() => scroll('left')}
                     className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 active:scale-95 transition-all shadow-sm"
                  >
                     <ChevronLeft className="w-5 h-5 text-slate-600" />
                  </button>
                  <button
                     onClick={() => scroll('right')}
                     className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 active:scale-95 transition-all shadow-sm"
                  >
                     <ChevronRight className="w-5 h-5 text-slate-600" />
                  </button>
               </div>
               <Link href={`/catalog/products?categoryId=${category._id}`} className="text-[10px] font-black uppercase tracking-[0.2em] text-black-200 transition-colors bg-white-400 px-6 py-3 rounded-2xl border border-slate-200 shadow-sm active:scale-95 transition-all">Digital Gallery</Link>
            </div>
         </div>

         {/* 1. MARKETING SLIDER (Flash, Bundles, Vouchers) */}
         {(categoryFlash.length > 0 || bundles.length > 0 || vouchers.length > 0) && (
            <div className="flex gap-6 overflow-x-auto scrollbar-hide snap-x mb-10">
               {categoryFlash.map((flash: any) => {
                  const discountPercent = Math.round(((flash.productId?.price - flash.discountPrice) / flash.productId?.price) * 100);
                  return (
                     <div key={flash._id} className="min-w-[340px] h-48 bg-red-600/5 border border-red-600/10 rounded-[2.5rem] p-8 flex flex-col justify-between relative overflow-hidden group snap-start shadow-sm">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 blur-3xl rounded-full translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform" />
                        <div className="relative z-10 flex justify-between items-start">
                           <div>
                              <span className="text-[9px] font-black text-red-600 uppercase tracking-[0.2em]">Flash Surge</span>
                              <h4 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter mt-1 truncate max-w-[180px]">{flash.productId?.name}</h4>
                           </div>
                           <div className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-lg">-{discountPercent}%</div>
                        </div>
                        <div className="flex items-end justify-between relative z-10">
                           <div className="flex flex-col">
                              <p className="text-2xl font-black text-slate-900 tracking-tighter">{flash.discountPrice.toLocaleString()} TK</p>
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{flash.stock} Units Left</span>
                           </div>
                           <Link href={`/catalog/products/${flash.productId?._id}`} className="px-6 py-2 bg-red-600 text-white text-[10px] font-black uppercase rounded-xl tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-red-600/20">Grab Now</Link>
                        </div>
                     </div>
                  );
               })}
               {/* {bundles.map((bundle: any) => (
                  <div key={bundle._id} className="min-w-[400px] h-48 accent-gradient rounded-[2.5rem] p-8 flex flex-col justify-between relative overflow-hidden group snap-start shadow-xl">
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
               ))} */}
               {/* {vouchers.map((voucher: any) => (
                  <div key={voucher._id} className="min-w-[320px] h-48 bg-white border-2 border-dashed border-action/40 rounded-[2.5rem] p-8 flex flex-col justify-between snap-start group relative">
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
               ))} */}
            </div>
         )}

         {/* 2. MAIN 12-PRODUCT GRID SLIDER (2 Rows) */}
         <div className="relative">
            {/* Overlay Navigation (Optional but recommended for premium feel) */}



            <div
               ref={scrollRef}
               className="grid grid-rows-2 grid-flow-col gap-8 overflow-x-auto pb-12 scrollbar-hide -mx-4 px-4 snap-x snap-mandatory"
            >
               {isLoading ? (
                  [...Array(12)].map((_, i) => (
                     <div key={i} className="w-[320px] aspect-square rounded-[2.5rem] bg-slate-50 animate-pulse border border-slate-200 flex-shrink-0" />
                  ))
               ) : (
                  products.map((product: any) => (
                     <div key={product._id} className="w-[320px] snap-start flex-shrink-0">
                        <ProductCard product={product} layout="horizontal" />
                     </div>
                  ))
               )}

               {/* View More at the end of the Grid Slider */}
               {/* <div className="w-[200px] flex items-center justify-center snap-start flex-shrink-0 row-span-2">
                  <Link 
                     href={`/catalog/products?categoryId=${category._id}`}
                     className="group flex flex-col items-center gap-6 text-slate-200 hover:text-action transition-all"
                  >
                     <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-100 flex items-center justify-center group-hover:border-action group-hover:scale-110 transition-all shadow-sm">
                        <ArrowUpRight className="w-8 h-8" />
                     </div>
                     <span className="text-[10px] font-black uppercase tracking-[0.3em]">Explore Collection</span>
                  </Link>
               </div> */}
            </div>
         </div>
      </div>
   );
}

