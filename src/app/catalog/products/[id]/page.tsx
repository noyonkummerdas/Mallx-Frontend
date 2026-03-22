"use client";

import { useGetProductDetailsQuery, usePostProductReviewMutation } from "@/modules/catalog/services/catalogApi";
import { useAddToCartMutation } from "@/modules/shopping/services/shoppingApi";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Star, ShoppingCart, Truck, CreditCard, Package } from "lucide-react";

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
    <main className="min-h-screen bg-[#FDFDFD] text-slate-900 pb-20 font-['Inter']">
      {/* Premium Breadcrumb / Nav */}
      <nav className="border-b border-slate-100 bg-white/50 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
              <button 
                onClick={() => router.back()}
                className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 hover:text-slate-900 transition-all flex items-center gap-2 group"
              >
                  <span className="text-sm group-hover:-translate-x-1 transition-transform">←</span> Return to Shop
              </button>
              <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400">
                  {product.categoryId?.name || "Premium Collection"} / <span className="text-slate-900">{product.name}</span>
              </div>
          </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          {/* Immersive Gallery */}
          <div className="flex flex-col gap-6">
            <div className="aspect-[4/5] bg-slate-50 border border-slate-100 rounded-[2.5rem] overflow-hidden group relative shadow-2xl shadow-slate-200/50">
               {images[activeImageIndex] ? (
                 <img src={images[activeImageIndex].imageUrl} alt={product.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
               ) : (
                 <div className="w-full h-full flex flex-col items-center justify-center text-slate-200">
                    <Package size={64} strokeWidth={1} />
                    <p className="text-[10px] uppercase tracking-widest mt-4">Viewing Signature Item</p>
                 </div>
               )}
               
               {/* Image Count Indicator */}
               <div className="absolute bottom-8 right-8 flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-lg">
                  <span className="text-[10px] font-black tracking-widest text-slate-900">{activeImageIndex + 1}</span>
                  <div className="w-8 h-[1px] bg-slate-200" />
                  <span className="text-[10px] font-bold tracking-widest text-slate-400">{images.length || 1}</span>
               </div>
            </div>
            
            {/* Thumbnails - Styled as Selection Chips */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
               {images.map((img: any, i: number) => (
                 <button 
                    key={i} 
                    onClick={() => setActiveImageIndex(i)}
                    className={`flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${activeImageIndex === i ? 'border-slate-900 scale-95 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
                 >
                    <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
                 </button>
               ))}
            </div>
          </div>

          {/* Persuasive Details */}
          <div className="flex flex-col py-4">
            <div className="flex items-center gap-2 mb-8">
                <div className="flex -space-x-2">
                   {[1,2,3].map(i => (
                     <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?img=${i+10}`} className="w-full h-full object-cover" />
                     </div>
                   ))}
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Trusted by 500+ happy customers</span>
            </div>

            <div className="mb-2">
                <span className="text-[10px] font-black text-slate-900 border border-slate-900 px-3 py-1 rounded-full uppercase tracking-widest mr-2">Limited Stock</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{product.categoryId?.name}</span>
            </div>
            
            <h1 className="text-4xl font-black mb-6 text-slate-900 leading-tight tracking-tighter capitalize">{product.name}</h1>
            
            <div className="flex items-end gap-4 mb-10">
               <div className="text-3xl font-black text-slate-900 tracking-tighter">
                  {product.price?.toLocaleString()} <span className="text-sm font-normal text-slate-400 ml-1">TK</span>
               </div>
               {product.discountPrice && (
                 <div className="text-lg text-slate-300 line-through mb-1 font-bold">
                    {product.discountPrice.toLocaleString()} TK
                 </div>
               )}
               <div className="ml-auto flex items-center gap-1 bg-green-50 text-green-600 px-3 py-1 rounded-full mb-1 border border-green-100">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest">In Stock & Ready</span>
               </div>
            </div>

            <div className="space-y-6 mb-12">
                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                       <Package size={80} strokeWidth={1} />
                    </div>
                    <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] mb-3">Why You'll Love This</h4>
                    <p className="text-slate-600 text-sm leading-relaxed font-medium">
                      {product.description || "Experience the perfect blend of premium craftsmanship and modern design. This curated item is built with the highest quality materials to ensure both style and durability for your everyday needs."}
                    </p>
                </div>
            </div>

            {/* Variants Section - Modern UI */}
            {product.variants?.length > 0 && (
              <div className="mb-12">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 block">Personalize Your Selection</span>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((v: any) => (
                    <button
                      key={v._id}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-5 py-3 rounded-2xl border-2 text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                        selectedVariant?._id === v._id 
                        ? "border-slate-900 bg-slate-900 text-white shadow-xl -translate-y-1" 
                        : "border-slate-100 bg-white hover:border-slate-300 text-slate-500"
                      }`}
                    >
                      {v.color} · {v.size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Main CTA Section */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-auto pt-8 border-t border-slate-50">
                <div className="flex items-center bg-white border border-slate-200 rounded-2xl p-1 shadow-sm w-full sm:w-auto">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 flex items-center justify-center hover:bg-slate-50 rounded-xl transition-all font-bold text-slate-900 text-lg">-</button>
                    <span className="w-12 text-center font-black text-slate-900 text-sm">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-12 flex items-center justify-center hover:bg-slate-50 rounded-xl transition-all font-bold text-slate-900 text-lg">+</button>
                </div>
                <button 
                  disabled={isAdding}
                  onClick={handleAddToCart}
                  className="flex-1 w-full bg-slate-900 hover:bg-black text-white font-black h-14 rounded-2xl shadow-2xl shadow-slate-900/20 transition-all active:scale-[0.98] disabled:opacity-50 uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-3"
                >
                  <ShoppingCart size={18} />
                  {isAdding ? "Adding to Bag..." : "Add to Shopping Bag"}
                </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 mt-12 mb-4">
                <div className="flex items-center gap-3 p-4 rounded-2xl border border-slate-50 bg-white shadow-sm">
                   <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-900"><Truck size={20} /></div>
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">Swift Delivery</p>
                      <p className="text-[9px] text-slate-400 uppercase tracking-widest">Dispatched in 24h</p>
                   </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-2xl border border-slate-50 bg-white shadow-sm">
                   <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-900"><CreditCard size={20} /></div>
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">Secure Payment</p>
                      <p className="text-[9px] text-slate-400 uppercase tracking-widest">SSL Encrypted Flow</p>
                   </div>
                </div>
            </div>
          </div>
        </div>

        {/* Persuasive Social Proof / Reviews */}
        <div className="mt-40">
          <div className="text-center mb-20 max-w-2xl mx-auto">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4 block">Community Feedback</span>
             <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-4">What Our Customers Say</h2>
             <div className="w-12 h-1 bg-slate-900 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Review Summary Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-2xl shadow-slate-200/50 sticky top-24">
                <div className="text-6xl font-black text-slate-900 mb-2">{product.ratingsAverage?.toFixed(1) || "0.0"}</div>
                <div className="flex items-center gap-1 mb-6">
                   {[1,2,3,4,5].map(i => (
                     <Star key={i} size={16} fill={i <= Math.round(product.ratingsAverage || 0) ? "black" : "none"} className={i <= Math.round(product.ratingsAverage || 0) ? "text-slate-900" : "text-slate-200"} />
                   ))}
                </div>
                <p className="text-slate-400 font-bold text-xs tracking-widest mb-10 leading-relaxed uppercase">Join the community and share your experience with this item.</p>
                
                <form onSubmit={handlePostReview} className="space-y-6">
                  <div className="relative">
                    <textarea 
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Share your thoughts..."
                      className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] p-6 text-sm outline-none focus:border-slate-900 transition-all font-medium placeholder:text-slate-300 min-h-[140px]"
                    />
                  </div>
                  <div className="flex flex-col gap-4">
                    <select 
                      value={rating} 
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-900 text-xs uppercase tracking-widest outline-none cursor-pointer"
                    >
                      <option value={5}>Excellent (5 Stars)</option>
                      <option value={4}>Good (4 Stars)</option>
                      <option value={3}>Average (3 Stars)</option>
                      <option value={2}>Poor (2 Stars)</option>
                      <option value={1}>Terrible (1 Star)</option>
                    </select>
                    <button 
                      disabled={isReviewing}
                      className="w-full bg-slate-900 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-slate-900/20 hover:bg-black transition-all disabled:opacity-50"
                    >
                      Publish Testimonial
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Individual Reviews Grid */}
            <div className="lg:col-span-2 space-y-6">
              {reviews.length > 0 ? reviews.map((rev: any) => (
                <div key={rev._id} className="p-10 bg-white border border-slate-100 rounded-[2.5rem] group hover:border-slate-900/10 transition-all shadow-sm">
                   <div className="flex items-start justify-between mb-8">
                      <div className="flex items-center gap-4">
                         <div className="w-14 h-14 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-slate-300 group-hover:bg-slate-900 group-hover:text-white transition-all text-sm uppercase overflow-hidden">
                            {rev.user?.photo ? <img src={rev.user.photo} className="w-full h-full object-cover" /> : rev.user?.name?.[0] || "?"}
                         </div>
                         <div>
                            <div className="font-black text-slate-900 uppercase tracking-tight text-sm">{rev.user?.name || "Premium Member"}</div>
                            <div className="text-[10px] text-slate-400 font-bold tracking-[0.15em] uppercase mt-1 flex items-center gap-2">
                               <span className="text-green-500">Verified Hub</span> · {new Date(rev.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                            </div>
                         </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                         {[1,2,3,4,5].map(i => (
                           <Star key={i} size={12} fill={i <= rev.rating ? "black" : "none"} className={i <= rev.rating ? "text-slate-900" : "text-slate-100"} />
                         ))}
                      </div>
                   </div>
                   <p className="text-slate-600 leading-relaxed font-medium italic text-base">"{rev.comment}"</p>
                </div>
              )) : (
                <div className="py-32 text-center border-4 border-dashed border-slate-50 rounded-[3rem] bg-white">
                   <Package size={48} className="mx-auto text-slate-100 mb-6" />
                   <p className="text-slate-300 font-black tracking-[0.3em] uppercase text-[10px]">Be the first to share your journey</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
