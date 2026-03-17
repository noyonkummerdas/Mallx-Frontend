import { useGetProductDetailsQuery, usePostProductReviewMutation } from "@/modules/catalog/services/catalogApi";
import { useAddToCartMutation } from "@/modules/shopping/services/shoppingApi";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: productData, isLoading } = useGetProductDetailsQuery(id);
  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();
  const [postReview, { isLoading: isReviewing }] = usePostProductReviewMutation();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);

  useEffect(() => {
    if (productData) {
      console.log("Product details loaded in console:", productData);
      if (productData.data?.product?.variants?.length > 0) {
        setSelectedVariant(productData.data.product.variants[0]);
      }
    }
  }, [productData]);

  if (isLoading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const product = productData?.data?.product;
  const reviews = product?.reviews || [];

  if (!product) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-900 font-bold">
      Product not found
    </div>
  );

  const handleAddToCart = async () => {
    try {
      console.log("Adding to cart:", { 
        productId: product._id, 
        variantId: selectedVariant?._id, 
        quantity 
      });
      await addToCart({ 
        productId: product._id, 
        variantId: selectedVariant?._id, 
        quantity 
      }).unwrap();
      alert("Added to cart!");
    } catch (err) {
      console.error("Failed to add to cart:", err);
    }
  };

  const handlePostReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Posting review:", { rating, comment: reviewText });
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
               <div className="flex flex-col">
                  <div className="text-sm text-green-600 font-bold uppercase tracking-wider">In Stock Available</div>
                  <div className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">SKU: {product.sku}</div>
               </div>
            </div>

            <p className="text-slate-500 text-lg leading-relaxed mb-10 font-medium italic">
              {product.description || "Premium quality product verified by MallX."}
            </p>

            {/* Variants */}
            {product.variants?.length > 0 && (
              <div className="mb-10">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 block">Available Variants</span>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((v: any) => (
                    <button
                      key={v._id}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-5 py-3 rounded-2xl border-2 font-bold text-sm transition-all ${
                        selectedVariant?._id === v._id 
                        ? "border-indigo-600 bg-indigo-50 text-indigo-600 shadow-md translate-y-[-2px]" 
                        : "border-slate-100 hover:border-slate-300 text-slate-500"
                      }`}
                    >
                      {v.color} - {v.size}
                    </button>
                  ))}
                </div>
              </div>
            )}

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
                    Express Checkout
                  </button>
               </div>
            </div>

            <div className="mt-16 grid grid-cols-2 gap-8 border-t border-slate-50 pt-10">
               <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Dynamic Delivery</h4>
                  <p className="text-xs text-slate-600 font-bold">Standard Delivery: 60 TK. Priority: 150 TK. Calculated at checkout.</p>
               </div>
               <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Physical Specs</h4>
                  <p className="text-xs text-slate-600 font-bold">{product.weight}kg | {product.dimensions?.length}x{product.dimensions?.width}x{product.dimensions?.height}cm</p>
               </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-32 border-t border-slate-100 pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-1">
              <h2 className="text-3xl font-black mb-8 tracking-tight uppercase">Customer Reviews</h2>
              <div className="bg-slate-50 rounded-[2.5rem] p-10 border border-slate-100 shadow-inner">
                <div className="text-5xl font-black text-indigo-600 mb-2">{product.ratingsAverage || "0.0"}</div>
                <div className="flex items-center gap-1 mb-6">
                   {[1,2,3,4,5].map(i => (
                     <svg key={i} className={`w-5 h-5 ${i <= Math.round(product.ratingsAverage || 0) ? "text-amber-400" : "text-slate-200"}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                   ))}
                </div>
                <p className="text-slate-500 font-bold text-sm tracking-wide mb-10 leading-relaxed uppercase">Join the conversation. Share your experience with other shoppers.</p>
                
                <form onSubmit={handlePostReview} className="space-y-4">
                  <textarea 
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Describe your experience..."
                    className="w-full bg-white border border-slate-200 rounded-2xl p-6 text-sm outline-none focus:border-indigo-600 transition-all font-medium"
                    rows={4}
                  />
                  <div className="flex items-center justify-between">
                    <select 
                      value={rating} 
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="bg-transparent font-black text-indigo-600 text-sm outline-none cursor-pointer"
                    >
                      <option value={5}>5 Stars</option>
                      <option value={4}>4 Stars</option>
                      <option value={3}>3 Stars</option>
                      <option value={2}>2 Stars</option>
                      <option value={1}>1 Star</option>
                    </select>
                    <button 
                      disabled={isReviewing}
                      className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-indigo-600/20 hover:translate-y-[-2px] transition-all disabled:opacity-50"
                    >
                      Post Review
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-10">
              {reviews.length > 0 ? reviews.map((rev: any) => (
                <div key={rev._id} className="border-b border-slate-50 pb-10 group">
                   <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">{rev.user?.name?.[0] || "?"}</div>
                         <div>
                            <div className="font-black text-slate-900 uppercase tracking-tight">{rev.user?.name || "Anonymous User"}</div>
                            <div className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Verified Buyer · {new Date(rev.createdAt).toLocaleDateString()}</div>
                         </div>
                      </div>
                      <div className="flex items-center gap-1">
                         {[1,2,3,4,5].map(i => (
                           <svg key={i} className={`w-3 h-3 ${i <= rev.rating ? "text-amber-400" : "text-slate-100"}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                         ))}
                      </div>
                   </div>
                   <p className="text-slate-600 leading-relaxed font-medium italic pl-16">"{rev.comment}"</p>
                </div>
              )) : (
                <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[3rem]">
                   <p className="text-slate-300 font-black tracking-widest uppercase italic text-sm">Be the first to share your thoughts on this masterpiece.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
