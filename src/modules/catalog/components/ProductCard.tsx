"use client";

import Link from "next/link";

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
}

export default function ProductCard({ product }: ProductCardProps) {
  const discountPercent = product.discountPrice 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100) 
    : 0;

  return (
    <Link 
      href={`/catalog/products/${product._id}`} 
      className="glass-card group p-3 overflow-hidden flex flex-col w-[300px] snap-start relative"
    >
      {/* 1. BADGES */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {product.isNewArrival && (
          <span className="px-3 py-1 bg-blue-600 text-[8px] font-black text-white rounded-full uppercase tracking-tighter shadow-lg">NEW</span>
        )}
        {product.isFeatured && (
          <span className="px-3 py-1 bg-amber-500 text-[8px] font-black text-white rounded-full uppercase tracking-tighter shadow-lg">FEATURED</span>
        )}
      </div>

      {/* 2. IMAGE CONTAINER */}
      <div className="w-full aspect-square rounded-[4px] overflow-hidden bg-slate-50 mb-4 relative">
        <img 
          src={product.images?.[0]?.imageUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000"} 
          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-700" 
          alt={product.name}
        />
        
        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-3 right-3 bg-red-600 text-[8px] font-black text-white px-3 py-1.5 rounded-full uppercase tracking-tighter shadow-xl">
            -{discountPercent}% OFF
          </div>
        )}

        <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] border-2 border-slate-900 px-6 py-2 rounded-xl bg-white/80">Details</span>
        </div>
      </div>

      {/* 3. PRODUCT INFO */}
      <div className="px-4 pb-4 text-left">
        {/* Brand */}
        {product.brand && (
          <p className="text-[9px] font-black text-action/60 uppercase tracking-[0.2em] mb-1">{product.brand}</p>
        )}

        {/* Name */}
        <h4 className="text-sm font-black text-slate-900 mb-2 uppercase line-clamp-1 group-hover:text-action transition-colors tracking-tight">
          {product.name}
        </h4>

        {/* Ratings */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex text-amber-400">
             {[...Array(5)].map((_, i) => (
                <svg key={i} className={`w-3 h-3 ${i < Math.round(product.ratingsAverage || 0) ? 'fill-current' : 'text-slate-200'}`} viewBox="0 0 20 20">
                   <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
             ))}
          </div>
          <span className="text-[10px] font-bold text-slate-400">({product.totalReviews || 0})</span>
        </div>

        {/* Price Row */}
        <div className="flex items-center gap-3">
          {product.discountPrice ? (
            <>
              <p className="text-xl font-black text-slate-900 tracking-tighter">
                {product.discountPrice.toLocaleString()} <span className="text-[10px] text-slate-400 ml-1">TK</span>
              </p>
              <p className="text-[10px] text-slate-400 line-through font-bold opacity-40">
                {product.price.toLocaleString()} TK
              </p>
            </>
          ) : (
            <p className="text-xl font-black text-slate-900 tracking-tighter">
              {product.price.toLocaleString()} <span className="text-[10px] text-slate-400 ml-1">TK</span>
            </p>
          )}
        </div>

        {/* Stock Urgency */}
        {product.stock !== undefined && product.stock <= 10 && product.stock > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-100">
             <div className="flex justify-between items-center mb-1.5">
                <span className="text-[9px] font-black text-red-600 uppercase tracking-widest animate-pulse">Running Out!</span>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{product.stock} Left</span>
             </div>
             <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                <div 
                   className="h-full bg-red-600 rounded-full" 
                   style={{ width: `${(product.stock / 10) * 100}%` }}
                />
             </div>
          </div>
        )}
      </div>
    </Link>
  );
}
