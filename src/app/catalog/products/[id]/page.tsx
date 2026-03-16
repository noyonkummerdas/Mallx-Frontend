"use client";

import { useGetProductDetailsQuery } from "@/modules/catalog/services/catalogApi";
import { useAddToCartMutation } from "@/modules/shopping/services/shoppingApi";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data, isLoading } = useGetProductDetailsQuery(id);
  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();
  const [quantity, setQuantity] = useState(1);

  if (isLoading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const product = data?.data?.product;

  if (!product) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-900 font-bold">
      Product not found
    </div>
  );

  const handleAddToCart = async () => {
    try {
      await addToCart({ productId: product._id, quantity }).unwrap();
      alert("Added to cart!");
    } catch (err) {
      console.error("Failed to add to cart:", err);
    }
  };

  return (
    <main className="min-h-screen bg-white text-slate-900 pb-20">
      <div className="max-w-7xl mx-auto px-8 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Gallery */}
          <div className="space-y-6">
            <div className="aspect-square bg-slate-50 border border-slate-100 rounded-[3rem] overflow-hidden group relative shadow-sm">
               {product.images?.[0] ? (
                 <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-slate-300 font-bold text-sm tracking-widest uppercase">No Image Preview</div>
               )}
            </div>
            <div className="grid grid-cols-4 gap-4">
               {product.images?.map((img: any, i: number) => (
                 <div key={i} className="aspect-square bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden cursor-pointer hover:border-indigo-600 transition-colors shadow-sm">
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                 </div>
               ))}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <div className="text-indigo-600 font-black tracking-widest text-[10px] uppercase mb-4 px-3 py-1 bg-indigo-50 rounded-full w-fit">
              {product.vendorId?.name || "Official MallX Store"}
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight tracking-tight text-slate-900 uppercase">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-8">
               <div className="text-4xl font-black text-slate-900">{product.price.toLocaleString()} <span className="text-sm font-normal text-slate-400 italic font-sans">TK</span></div>
               <div className="h-8 w-[1px] bg-slate-100" />
               <div className="text-sm text-green-600 font-bold uppercase tracking-wider">In Stock Available</div>
            </div>

            <p className="text-slate-500 text-lg leading-relaxed mb-10 font-medium italic">
              {product.description || "No detailed description available for this product yet. Rest assured, our quality control team has verified its authenticity."}
            </p>

            <div className="space-y-8">
               <div className="flex items-center gap-6">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Quantity Selection</span>
                  <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl p-1">
                     <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-xl transition-all font-bold text-slate-600 shadow-sm">-</button>
                     <span className="w-12 text-center font-black text-slate-900">{quantity}</span>
                     <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-xl transition-all font-bold text-slate-600 shadow-sm">+</button>
                  </div>
               </div>

               <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <button 
                    disabled={isAdding}
                    onClick={handleAddToCart}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-3xl shadow-2xl shadow-indigo-600/20 transition-all active:scale-95 disabled:opacity-50 uppercase tracking-widest"
                  >
                    {isAdding ? "Working..." : "Add to Cart"}
                  </button>
                  <button className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 font-black py-5 rounded-3xl transition-all active:scale-95 uppercase tracking-widest shadow-sm">
                    Buy Directly
                  </button>
               </div>
            </div>

            <div className="mt-16 grid grid-cols-2 gap-8 border-t border-slate-50 pt-10">
               <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Delivery Service</h4>
                  <p className="text-xs text-slate-600 font-bold">Priority Home Delivery within 48 Hours.</p>
               </div>
               <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Platform Protection</h4>
                  <p className="text-xs text-slate-600 font-bold">100% Refundable Secure Payments.</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
