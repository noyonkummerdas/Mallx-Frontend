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
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const product = data?.data?.product;

  if (!product) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
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
    <main className="min-h-screen bg-slate-950 text-white pb-20">
      <div className="max-w-7xl mx-auto px-8 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Gallery */}
          <div className="space-y-6">
            <div className="aspect-square bg-slate-900 border border-slate-800 rounded-[3rem] overflow-hidden group relative">
               {product.images?.[0] ? (
                 <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-slate-700 font-bold">IMAGE PLACEHOLDER</div>
               )}
            </div>
            <div className="grid grid-cols-4 gap-4">
               {product.images?.map((img: any, i: number) => (
                 <div key={i} className="aspect-square bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden cursor-pointer hover:border-indigo-500 transition-colors">
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                 </div>
               ))}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <div className="text-indigo-400 font-black tracking-widest text-xs uppercase mb-4 px-3 py-1 bg-indigo-500/10 rounded-full w-fit">
              {product.vendorId?.name || "Official MallX Store"}
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight tracking-tight">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-8">
               <div className="text-4xl font-black text-white">{product.price} <span className="text-sm font-normal text-slate-500">TK</span></div>
               <div className="h-8 w-[1px] bg-slate-800" />
               <div className="text-sm text-green-500 font-bold">IN STOCK ({product.stock})</div>
            </div>

            <p className="text-slate-400 text-lg leading-relaxed mb-10">
              {product.description || "No detailed description available for this product."}
            </p>

            <div className="space-y-8">
               <div className="flex items-center gap-6">
                  <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Quantity</span>
                  <div className="flex items-center bg-slate-900 border border-slate-800 rounded-2xl p-1">
                     <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-slate-800 rounded-xl transition-colors">-</button>
                     <span className="w-12 text-center font-bold">{quantity}</span>
                     <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center hover:bg-slate-800 rounded-xl transition-colors">+</button>
                  </div>
               </div>

               <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <button 
                    disabled={isAdding}
                    onClick={handleAddToCart}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 rounded-3xl shadow-2xl shadow-indigo-600/30 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isAdding ? "Adding..." : "Add to Cart"}
                  </button>
                  <button className="flex-1 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white font-black py-5 rounded-3xl transition-all active:scale-95">
                    Buy Now
                  </button>
               </div>
            </div>

            <div className="mt-16 grid grid-cols-2 gap-8 border-t border-slate-900 pt-10">
               <div>
                  <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Delivery</h4>
                  <p className="text-sm text-slate-300">Fast home delivery within 2-3 days.</p>
               </div>
               <div>
                  <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Secure Payment</h4>
                  <p className="text-sm text-slate-300">Cash on delivery available.</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
