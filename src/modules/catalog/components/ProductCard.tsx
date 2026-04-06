"use client";
 
import Link from "next/link";
import { Star, Eye, ShoppingBag, ArrowUpRight } from "lucide-react";
import { useAddToCartMutation } from "@/modules/shopping/services/shoppingApi";
import { useState } from "react";
import { useRouter } from "next/navigation";
 
interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    price: number;
    discountPrice?: number;
    brand?: string;
    ratingsAverage?: number;
    totalReviews?: number;
    stock?: number;
    isFeatured?: boolean;
    isNewArrival?: boolean;
    images?: Array<{ imageUrl: string }>;
  };
  layout?: 'vertical' | 'horizontal';
}
 
export default function ProductCard({ product, layout = 'vertical' }: ProductCardProps) {
  const router = useRouter();
  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToCart({
        productId: product._id,
        quantity: 1,
        price: product.discountPrice || product.price
      }).unwrap();
      router.push("/shopping/cart");
    } catch (err) {
      console.error("Failed to add to cart:", err);
    }
  };

  const discountPercent = product.discountPrice 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100) 
    : 0;

  if (layout === 'horizontal') {
    return (
      <div className="group relative wow-card p-0 transition-all duration-500 rounded-xl flex items-stretch hover:shadow-2xl hover:shadow-slate-200/50 hover:border-action/20 overflow-hidden h-48 sm:h-56">
        {/* IMAGE CONTAINER - 60% */}
        <Link href={`/catalog/products/${product._id}`} className="relative w-[60%] overflow-hidden bg-slate-50 border-r border-slate-100 block shrink-0">
          <img 
            src={product.images?.[0]?.imageUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000"} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
            alt={product.name}
          />
          {discountPercent > 0 && (
            <div className="absolute top-0 right-0 overflow-hidden w-16 h-16 z-10">
               <div className="bg-red-500 text-white text-[7px] font-black uppercase text-center py-1 absolute w-[141%] rotate-45 translate-x-[25%] translate-y-[20%] shadow-lg">
                  -{discountPercent}%
               </div>
            </div>
          )}
          <div className="absolute inset-0 bg-slate-900/5 group-hover:bg-transparent transition-colors duration-500" />
        </Link>
   
        {/* PRODUCT INFO - 40% */}
        <div className="w-[40%] flex flex-col justify-center px-4 sm:px-6 bg-white min-w-0 items-start">
          {/* Top meta info */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="flex items-center gap-0.5 shrink-0">
              <Star className="w-2 h-2 text-amber-400 fill-current" />
              <span className="text-[7.5px] font-bold text-slate-400">{product.ratingsAverage || 5.0}</span>
            </div>
            {product.brand && (
              <>
                <span className="text-[10px] text-slate-200">•</span>
                <span className="text-[6.5px] font-bold text-action uppercase tracking-[0.1em] truncate">{product.brand}</span>
              </>
            )}
          </div>
   
          {/* Title */}
          <Link href={`/catalog/products/${product._id}`}>
            <h4 className="text-[10px] sm:text-[11px] font-black text-slate-900 mb-2 line-clamp-2 uppercase tracking-tight group-hover:text-action transition-colors leading-[1.2] text-left">
              {product.name}
            </h4>
          </Link>
   
          {/* Price */}
          <div className="mb-4">
             <div className="flex flex-wrap items-baseline gap-1.5">
                <span className="text-sm sm:text-base lg:text-lg font-black text-slate-900 tracking-tighter leading-none">
                  {(product.discountPrice || product.price).toLocaleString()} <span className="text-[7px] font-bold text-slate-300 uppercase tracking-widest">TK</span>
                </span>
                {product.discountPrice && (
                  <span className="text-[6px] font-bold text-slate-200 line-through">
                    {product.price.toLocaleString()}
                  </span>
                )}
             </div>
          </div>
 
          {/* Buttons Row */}
          <div className="flex items-center gap-1.5 w-full">
            <button 
              onClick={handleQuickAdd}
              disabled={isAdding || (product.stock !== undefined && product.stock <= 0)}
              className="flex-1 h-8 bg-slate-900 text-white rounded-lg text-[6.5px] sm:text-[7.5px] font-black uppercase tracking-widest hover:bg-action transition-all shadow-md active:scale-95 disabled:opacity-30 flex items-center justify-center gap-1 px-1 overflow-hidden"
            >
              <ShoppingBag className="w-3 h-3 shrink-0" />
              <span className="truncate">Add to Cart</span>
            </button>
            <Link href={`/catalog/products/${product._id}`} className="size-8 border border-slate-100 rounded-lg hover:border-action transition-colors shrink-0 flex items-center justify-center bg-slate-50/50 hover:bg-white group/arrow">
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover/arrow:text-action transition-all" />
            </Link>
          </div>
        </div>
      </div>
    );
  }
 
  return (
    <div className="group relative wow-card p-0 transition-all duration-700 rounded-[2rem] overflow-hidden border border-slate-100/50">
      {/* 1. TOP BADGES & ACTIONS */}
      <div className="absolute top-5 left-5 z-20 flex flex-col gap-2">
        {product.isNewArrival && (
          <span className="px-3 py-1 bg-white/40 backdrop-blur-md border border-white/40 text-[8px] font-black text-slate-800 rounded-full uppercase tracking-[0.2em] shadow-sm">New</span>
        )}
        {product.isFeatured && (
          <span className="px-3 py-1 bg-indigo-600/10 backdrop-blur-md border border-indigo-600/20 text-[8px] font-black text-indigo-600 rounded-full uppercase tracking-[0.2em] shadow-sm">Elite</span>
        )}
      </div>
 
      <div className="absolute top-5 right-5 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
        <button 
          onClick={handleQuickAdd}
          disabled={isAdding || (product.stock !== undefined && product.stock <= 0)}
          className="p-3 rounded-lg shadow-lg transition-all flex items-center justify-center relative bg-white/90 backdrop-blur-md text-slate-900 hover:bg-action hover:text-white"
          title="Add to Cart"
        >
          <ShoppingBag className="w-4 h-4" />
          {isAdding && <div className="absolute inset-0 border-2 border-action border-t-transparent rounded-lg animate-spin" />}
        </button>
      </div>
 
      {/* 2. IMAGE CONTAINER */}
      <Link href={`/catalog/products/${product._id}`} className="block relative aspect-square overflow-hidden bg-slate-50/20 font-sans">
        <img 
          src={product.images?.[0]?.imageUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000"} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" 
          alt={product.name}
        />
        
        {/* Discount Badge - Triangular Corner */}
        {discountPercent > 0 && (
          <div className="absolute top-0 right-0 overflow-hidden w-16 h-16 z-10">
             <div className="bg-red-500 text-white text-[7px] font-black uppercase text-center py-1 absolute w-[141%] rotate-45 translate-x-[25%] translate-y-[20%] shadow-lg">
                -{discountPercent}%
             </div>
          </div>
        )}
 
        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-[2px] flex items-center justify-center">
           <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-lg shadow-2xl translate-y-4 group-hover:translate-y-0 transition-transform duration-500 font-black text-[10px] uppercase tracking-widest text-slate-900">
              <Eye className="w-3.5 h-3.5" />
              Quick View
           </div>
        </div>
      </Link>
 
      {/* 3. PRODUCT INFO */}
      <div className="px-6 pb-8 pt-5 font-sans">
        <div className="flex items-center justify-between mb-2">
          {product.brand && (
            <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-[0.3em]">{product.brand}</span>
          )}
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-amber-400 fill-current" />
            <span className="text-[10px] font-bold text-slate-400">{product.ratingsAverage || 5.0}</span>
          </div>
        </div>
 
        <Link href={`/catalog/products/${product._id}`}>
          <h4 className="text-[13px] font-black text-slate-900 mb-3 line-clamp-1 tracking-wide hover:text-indigo-600 transition-colors uppercase">
            {product.name}
          </h4>
        </Link>
 
        {/* Price Row */}
        <div className="flex items-center justify-between">
           <div className="flex items-baseline gap-2">
              {product.discountPrice ? (
                <>
                  <span className="text-xl font-black text-slate-900 tracking-tighter">
                    {product.discountPrice.toLocaleString()} <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">TK</span>
                  </span>
                  <span className="text-[9px] text-slate-300 line-through font-bold">
                    {product.price.toLocaleString()}
                  </span>
                </>
              ) : (
                <span className="text-xl font-black text-slate-900 tracking-tighter">
                  {product.price.toLocaleString()} <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">TK</span>
                </span>
              )}
           </div>
           
           <Link href={`/catalog/products/${product._id}`} className="text-slate-300 hover:text-action transition-colors">
              <ArrowUpRight className="w-5 h-5" />
           </Link>
        </div>
 
        {/* 4. STOCK STATUS - ULTRA THIN & CLEAN */}
        {product.stock !== undefined && (
          <div className="mt-6 pt-6 border-t border-slate-50">
            {product.stock <= 0 ? (
              <div className="flex items-center gap-2 text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                <span className="text-[8px] font-black uppercase tracking-widest">Out of Stock</span>
              </div>
            ) : product.stock <= 10 ? (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-[0.1em]">
                  <span className="text-red-500 animate-pulse">Limited Edition</span>
                  <span className="text-slate-400">{product.stock} Units Left</span>
                </div>
                <div className="w-full h-0.5 bg-slate-50 rounded-full overflow-hidden">
                  <div 
                     className="h-full bg-red-500 rounded-full transition-all duration-1000" 
                     style={{ width: `${(product.stock / 10) * 100}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Available</span>
                </div>
                <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">{product.stock} Units</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

