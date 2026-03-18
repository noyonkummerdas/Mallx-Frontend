"use client";

import { useGetProductDetailsQuery, usePostProductReviewMutation } from "@/modules/catalog/services/catalogApi";
import { useAddToCartMutation } from "@/modules/shopping/services/shoppingApi";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: productData, isLoading } = useGetProductDetailsQuery(id);
  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();
  const [postReview, { isLoading: isReviewing }] = usePostProductReviewMutation();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (productData) {
      console.log("-----------------------------------------");
      console.log("REAL PRODUCT DATA FROM DATABASE:", productData.data?.product);
      console.log("-----------------------------------------");
      if (productData.data?.product?.variants?.length > 0) {
        setSelectedVariant(productData.data.product.variants[0]);
      }
    }
  }, [productData]);

  if (isLoading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const product = productData?.data?.product;
  const reviews = product?.reviews || [];

  if (!product) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center text-black font-bold">
      Product not found
    </div>
  );

  const handleAddToCart = async () => {
    try {
      await addToCart({ 
        productId: product._id, 
        variantId: selectedVariant?._id, 
        quantity,
        price: product.price 
      }).unwrap();
      alert("Added to cart!");
    } catch (err) {
      console.error("Failed to add to cart:", err);
    }
  };

  const handlePostReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await postReview({ 
        id: product._id, 
        reviewData: { rating, comment: reviewText } 
      }).unwrap();
      setReviewText("");
      alert("Review posted!");
    } catch (err) {
      console.error("Failed to post review:", err);
    }
  };

  const images = product.images || [];

  return (
    <main className="min-h-screen bg-white text-black pb-20 font-['Poppins']">
      {/* Navigation Bar */}
      <nav className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
              <button 
                onClick={() => router.back()}
                className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 hover:text-black transition-all flex items-center gap-2"
              >
                  <span className="text-lg">←</span> Back to Discovery
              </button>
              <div className="text-[10px] uppercase tracking-[0.2em] font-black text-black">
                  Product Architecture / {product.sku || "PRO-ITEM"}
              </div>
          </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Gallery Module */}
          <div className="flex flex-col gap-6">
            <div className="aspect-square bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden group relative shadow-sm ring-1 ring-slate-100">
               {images[activeImageIndex] ? (
                 <img src={images[activeImageIndex].imageUrl} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center">
                     <img src="/placeholder-product.png" className="w-32 opacity-10" alt="Placeholder" />
                 </div>
               )}
               <div className="absolute bottom-6 left-6 px-4 py-2 bg-black/80 backdrop-blur-md rounded-lg">
                   <p className="text-[8px] text-white uppercase tracking-[0.3em] font-bold">Visual Expansion {activeImageIndex + 1}/{images.length || 1}</p>
               </div>
            </div>
            
            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
               {images.map((img: any, i: number) => (
                 <button 
                    key={i} 
                    onClick={() => setActiveImageIndex(i)}
                    className={`aspect-square bg-white border rounded-xl overflow-hidden transition-all duration-300 ${activeImageIndex === i ? 'ring-2 ring-black border-transparent shadow-lg scale-95' : 'border-slate-100 hover:border-slate-300 opacity-60 hover:opacity-100'}`}
                 >
                    <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
                 </button>
               ))}
               {images.length === 0 && [1,2,3,4].map(i => (
                  <div key={i} className="aspect-square bg-slate-50 border border-dashed border-slate-200 rounded-xl flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                  </div>
               ))}
            </div>
          </div>

          {/* Details Module */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-6">
                <span className="text-[10px] font-black text-white bg-black px-3 py-1 rounded-md uppercase tracking-widest">Store Certified</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verified Vendor Architecture</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight tracking-tight text-black uppercase">{product.name}</h1>
            
            <div className="flex items-center gap-6 mb-8 border-b border-slate-50 pb-8">
               <div className="text-4xl font-black text-black tracking-tighter">
                  {product.price?.toLocaleString()} <span className="text-xs font-normal text-slate-400 uppercase tracking-widest ml-1">TK</span>
               </div>
               <div className="h-10 w-[1px] bg-slate-100" />
               <div className="flex flex-col">
                  <div className="text-[10px] text-green-600 font-black uppercase tracking-[0.2em] mb-1">Stock Protocol Active</div>
                  <div className="text-[9px] text-slate-400 font-bold tracking-[0.2em] uppercase">Inventory ID: {product.sku || 'N/A'}</div>
               </div>
            </div>

            <div className="mb-10">
                <h4 className="text-[10px] font-black text-black uppercase tracking-widest mb-4">Product Brief</h4>
                <p className="text-slate-600 text-base leading-relaxed font-medium">
                  {product.description || "Experimental architecture with premium materials. This product represents the pinnacle of modern aesthetic design and functional utility."}
                </p>
            </div>

            {/* Variants Section */}
            {product.variants?.length > 0 && (
              <div className="mb-10 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-black text-black uppercase tracking-widest mb-4 block">Select Configuration</span>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((v: any) => (
                    <button
                      key={v._id}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-6 py-3 rounded-lg border-2 font-bold text-[10px] uppercase tracking-widest transition-all ${
                        selectedVariant?._id === v._id 
                        ? "border-black bg-black text-white shadow-xl scale-105" 
                        : "border-white bg-white hover:border-slate-200 text-slate-400 shadow-sm"
                      }`}
                    >
                      {v.color} // {v.size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Interaction Module */}
            <div className="space-y-8 mt-auto">
               <div className="flex items-center gap-8">
                  <div className="flex flex-col gap-1">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Scale Quantity</span>
                      <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                         <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 rounded-lg transition-all font-bold text-black">-</button>
                         <span className="w-12 text-center font-black text-black">{quantity}</span>
                         <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 rounded-lg transition-all font-bold text-black">+</button>
                      </div>
                  </div>
                  <div className="flex-1">
                      <button 
                        disabled={isAdding}
                        onClick={handleAddToCart}
                        className="w-full bg-black hover:bg-slate-900 text-white font-black py-5 rounded-xl shadow-2xl shadow-black/10 transition-all active:scale-[0.98] disabled:opacity-50 uppercase text-[10px] tracking-[0.3em]"
                      >
                        {isAdding ? "Initiating Protocol..." : "Commit to Cart"}
                      </button>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4 pb-4">
                   <div className="p-4 rounded-xl border border-slate-100 flex flex-col gap-1">
                       <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Dimension ID</span>
                       <p className="text-[10px] font-bold text-black">{product.dimensions?.length || 0}x{product.dimensions?.width || 0}x{product.dimensions?.height || 0} CM</p>
                   </div>
                   <div className="p-4 rounded-xl border border-slate-100 flex flex-col gap-1">
                       <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Asset Mass</span>
                       <p className="text-[10px] font-bold text-black">{product.weight || 0} KG Protocol</p>
                   </div>
               </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-32 border-t border-slate-100 pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-black mb-8 tracking-tight uppercase">User Experience Log</h2>
              <div className="bg-white rounded-2xl p-10 border border-slate-100 shadow-xl overflow-hidden relative">
                <div className="absolute top-0 left-0 w-1 h-full bg-black"></div>
                <div className="text-6xl font-black text-black mb-2 tracking-tighter">{product.ratingsAverage?.toFixed(1) || "0.0"}</div>
                <div className="flex items-center gap-1 mb-6">
                   {[1,2,3,4,5].map(i => (
                     <svg key={i} className={`w-4 h-4 ${i <= Math.round(product.ratingsAverage || 0) ? "text-black" : "text-slate-100"}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                   ))}
                </div>
                <p className="text-slate-400 font-bold text-[10px] tracking-widest mb-10 leading-relaxed uppercase">Contribute to the collective intelligence by logging your experience.</p>
                
                <form onSubmit={handlePostReview} className="space-y-4">
                  <textarea 
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Describe the asset performance..."
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs outline-none focus:border-black transition-all font-medium placeholder:text-slate-300"
                    rows={4}
                  />
                  <div className="flex items-center justify-between">
                    <select 
                      value={rating} 
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="bg-transparent font-black text-black text-[10px] uppercase tracking-widest outline-none cursor-pointer"
                    >
                      <option value={5}>5 / 5 STARS</option>
                      <option value={4}>4 / 5 STARS</option>
                      <option value={3}>3 / 5 STARS</option>
                      <option value={2}>2 / 5 STARS</option>
                      <option value={1}>1 / 5 STARS</option>
                    </select>
                    <button 
                      disabled={isReviewing}
                      className="bg-black text-white px-6 py-3 rounded-lg font-black text-[8px] uppercase tracking-[0.2em] shadow-lg shadow-black/10 hover:translate-y-[-2px] transition-all disabled:opacity-50"
                    >
                      Log Review
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-8">
              {reviews.length > 0 ? reviews.map((rev: any) => (
                <div key={rev._id} className="p-8 bg-white border border-slate-100 rounded-2xl group hover:border-black/20 transition-all shadow-sm">
                   <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-slate-400 group-hover:bg-black group-hover:text-white transition-all text-sm uppercase">{rev.user?.name?.[0] || "?"}</div>
                         <div>
                            <div className="font-black text-black uppercase tracking-tight text-xs">{rev.user?.name || "Anonymous Auditor"}</div>
                            <div className="text-[8px] text-slate-400 font-bold tracking-[0.2em] uppercase mt-0.5">Verified Purchase Cycle · {new Date(rev.createdAt).toLocaleDateString()}</div>
                         </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                         {[1,2,3,4,5].map(i => (
                           <svg key={i} className={`w-3 h-3 ${i <= rev.rating ? "text-black" : "text-slate-100"}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                         ))}
                      </div>
                   </div>
                   <p className="text-slate-600 leading-relaxed font-medium italic text-sm">"{rev.comment}"</p>
                </div>
              )) : (
                <div className="py-24 text-center border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/50">
                   <p className="text-slate-300 font-black tracking-[0.3em] uppercase italic text-[10px]">No experience data logged for this asset yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
