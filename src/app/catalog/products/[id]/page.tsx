"use client";

import { useGetProductQuery, usePostProductReviewMutation } from "@/modules/shopping/services/productApi";
import { useAddToCartMutation } from "@/modules/shopping/services/shoppingApi";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { 
  Star, 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  ArrowLeft, 
  Heart, 
  Share2, 
  Package,
  Store,
  CheckCircle2,
  Clock,
  ChevronRight,
  Minus,
  Plus
} from "lucide-react";
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/products/${params.id}`);
  const data = await res.json();
  const product = data?.data?.product;
  
  return {
    title: product ? `${product.name} | MallX` : 'Product Details | MallX',
    description: product?.description || 'View product details on MallX',
  };
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: productData, isLoading } = useGetProductQuery(id);
  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();
  const [postReview, { isLoading: isReviewing }] = usePostProductReviewMutation();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("description");
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (productData?.data?.product) {
      const p = productData.data.product;
      if (p.variants?.length > 0) {
        setSelectedVariant(p.variants[0]);
      }
    }
  }, [productData]);

  if (isLoading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-12 h-12 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const product = productData?.data?.product;
  if (!product) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
      <Package size={48} className="text-slate-200 mb-4" />
      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Product not found</p>
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
        productId: product._id, 
        reviewData: { rating, comment: reviewText } 
      }).unwrap();
      setReviewText("");
      alert("Review posted!");
    } catch (err) {
      console.error("Failed to post review:", err);
    }
  };

  const images = product.images || [];
  const reviews = product.reviews || [];
  const shop = product.shop;

  return (
    <main className="min-h-screen bg-slate-200/60 pb-24 font-sans text-slate-900">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
           <button onClick={() => router.back()} className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all duration-300">
                 <ArrowLeft size={16} />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400 group-hover:text-slate-900 transition-colors">Back</span>
           </button>
           
           <div className="flex items-center gap-4">
              <span className="hidden md:block text-[10px] font-bold text-slate-300 uppercase tracking-widest">SKU: {product.sku || id.slice(-8).toUpperCase()}</span>
              <div className="h-4 w-[1px] bg-slate-200 hidden md:block"></div>
              <div className="flex items-center gap-2">
                 <button className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:border-rose-100 transition-all shadow-sm"><Heart size={16} /></button>
                 <button className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm"><Share2 size={16} /></button>
              </div>
           </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 mt-8">
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Left Column: Gallery (7 Units) */}
            <div className="lg:col-span-7 p-8 lg:p-12 border-r border-slate-50">
               <div className="flex flex-col md:flex-row gap-6 h-full">
                  {/* Vertical Thumbnails (Left) */}
                  {images.length > 1 && (
                    <div className="flex flex-row md:flex-col gap-4 overflow-x-auto md:overflow-y-auto md:max-h-[500px] scrollbar-hide pb-2 md:pb-0 order-2 md:order-1">
                       {images.map((img: any, i: number) => (
                         <button 
                           key={i}
                           onClick={() => setActiveImageIndex(i)}
                           className={`relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 bg-white ${
                             activeImageIndex === i ? 'border-slate-900 shadow-md scale-105' : 'border-transparent opacity-40 hover:opacity-100'
                           }`}
                         >
                           <img src={img.imageUrl || img.url} className="w-full h-full object-contain p-2" />
                         </button>
                       ))}
                    </div>
                  )}

                  {/* Main Image (Right) */}
                  <div className="flex-1 relative aspect-square bg-[#FBFBFC] rounded-[2rem] overflow-hidden group order-1 md:order-2">
                    {images[activeImageIndex] ? (
                      <img 
                        src={images[activeImageIndex].imageUrl || images[activeImageIndex].url}
                        alt={product.name}
                        className="w-full h-full object-contain p-8 md:p-12 transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-200">
                         <Package size={64} strokeWidth={1} />
                         <p className="text-[10px] uppercase tracking-[0.3em] mt-4 font-bold">Image missing</p>
                      </div>
                    )}
                    
                    {/* Badges */}
                    <div className="absolute top-8 left-8 flex flex-col gap-2">
                      <span className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border border-slate-100">
                        {product.brand || "Original"}
                      </span>
                      <span className="px-4 py-2 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                        {product.categoryId?.name || "Premium"}
                      </span>
                    </div>
                  </div>
               </div>
            </div>

            {/* Right Column: Content (5 Units) */}
            <div className="lg:col-span-5 p-8 lg:p-12 flex flex-col justify-center">
               <div className="space-y-8">
                  {/* Header */}
                  <div>
                     <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center gap-0.5">
                           {[1,2,3,4,5].map(i => (
                             <Star key={i} size={14} fill={i <= Math.round(product.ratingsAverage || 0) ? "#FACC15" : "none"} className={i <= Math.round(product.ratingsAverage || 0) ? "text-yellow-400" : "text-slate-200"} />
                           ))}
                        </div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{product.totalReviews || 0} Reviews</span>
                     </div>
                     <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
                        {product.name}
                     </h1>
                     <p className="text-slate-500 leading-relaxed text-base font-medium">
                        {product.description || "Masterfully designed for elevated experiences. This product combines uncompromising performance with a refined aesthetic."}
                     </p>
                  </div>

                  {/* Price Section */}
                  <div className="py-8 border-y border-slate-50">
                     <div className="flex items-end gap-3">
                        <span className="text-5xl font-black text-slate-900 tracking-tighter">
                          {product.price.toLocaleString()}
                        </span>
                        <span className="text-lg font-bold text-slate-400 pb-1">TK</span>
                        
                        {product.discountPrice && (
                          <div className="flex items-center gap-3 ml-2 pb-1">
                             <span className="text-xl text-slate-300 line-through font-bold">
                               {product.discountPrice.toLocaleString()}
                             </span>
                             <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-emerald-100">
                               Save {Math.round(((product.discountPrice - product.price) / product.discountPrice) * 100)}%
                             </span>
                          </div>
                        )}
                     </div>
                     <div className="flex items-center gap-2 mt-4">
                        <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500'}`}></div>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${product.stock > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {product.stock > 0 ? `${product.stock} units in stock` : 'Out of stock'}
                        </span>
                     </div>
                  </div>

                  {/* Variants */}
                  {product.variants?.length > 0 && (
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-4">Select Specification</span>
                      <div className="flex flex-wrap gap-2">
                        {product.variants.map((v: any) => (
                          <button
                            key={v._id}
                            onClick={() => setSelectedVariant(v)}
                            className={`px-6 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all duration-300 border-2 ${
                              selectedVariant?._id === v._id 
                              ? "border-slate-900 bg-slate-900 text-white shadow-lg" 
                              : "border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200"
                            }`}
                          >
                            {v.variantName}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="space-y-4 pt-4">
                     <div className="flex items-center gap-4">
                        <div className="flex items-center bg-slate-50 rounded-2xl p-1.5 border border-slate-100 h-16 w-36">
                          <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="flex-1 h-full flex items-center justify-center hover:bg-white hover:shadow-sm rounded-xl transition-all text-slate-400 hover:text-slate-900"><Minus size={18} /></button>
                          <span className="w-10 text-center font-black text-slate-900 text-lg">{quantity}</span>
                          <button onClick={() => setQuantity(quantity + 1)} className="flex-1 h-full flex items-center justify-center hover:bg-white hover:shadow-sm rounded-xl transition-all text-slate-400 hover:text-slate-900"><Plus size={18} /></button>
                        </div>
                        <button 
                          onClick={handleAddToCart}
                          disabled={isAdding || product.stock <= 0}
                          className="flex-1 h-16 bg-slate-900 text-white font-black rounded-2xl text-[12px] uppercase tracking-[0.3em] shadow-xl shadow-slate-900/10 hover:bg-black hover:scale-[1.02] transition-all active:scale-[0.98] disabled:opacity-20 flex items-center justify-center gap-3"
                        >
                          <ShoppingBag size={20} />
                          {isAdding ? "Adding..." : "Add to Cart"}
                        </button>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50/50 border border-slate-50">
                           <Truck size={18} className="text-slate-400" />
                           <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Fast Shipping</span>
                        </div>
                        <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50/50 border border-slate-50">
                           <ShieldCheck size={18} className="text-slate-400" />
                           <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">2 Year Warranty</span>
                        </div>
                     </div>
                  </div>

                  {/* Vendor */}
                  {shop && (
                    <div className="mt-8 p-6 bg-[#FBFBFC] rounded-3xl border border-slate-100 flex items-center justify-between group hover:border-slate-900 transition-all">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl border-2 border-white shadow-sm overflow-hidden">
                             <img src={shop.logo || `https://ui-avatars.com/api/?name=${shop.shopName}`} className="w-full h-full object-cover" />
                          </div>
                          <div>
                             <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-0.5">Sold by</p>
                             <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">{shop.shopName}</h4>
                          </div>
                       </div>
                       <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-300 group-hover:text-slate-900 transition-colors shadow-sm">
                          <ChevronRight size={18} />
                       </button>
                    </div>
                  )}
               </div>
            </div>
          </div>
        </div>

        {/* Details & Reviews Tabs */}
        <div className="mt-16 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 lg:p-12">
           <div className="flex border-b border-slate-100 gap-10 mb-12 overflow-x-auto scrollbar-hide">
              {["description", "specifications", "reviews"].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-6 text-[12px] font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === tab ? "text-slate-900" : "text-slate-300"}`}
                >
                  {tab}
                  {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-900 rounded-full animate-in slide-in-from-left duration-300" />}
                </button>
              ))}
           </div>

           <div className="min-h-[300px]">
              {activeTab === 'description' && (
                <div className="max-w-4xl animate-in fade-in duration-500">
                   <h3 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-tight">The Experience</h3>
                   <p className="text-slate-600 leading-relaxed text-lg font-medium">
                      {product.description || "A meticulously crafted asset designed to integrate seamlessly into your lifestyle. Each detail is considered, from the core functionality to the final polish."}
                   </p>
                   <div className="flex flex-wrap gap-2 mt-12">
                      {product.tags?.map((tag: string, i: number) => (
                        <span key={i} className="px-4 py-2 bg-slate-50 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest border border-slate-100 hover:bg-slate-100 transition-colors cursor-default">#{tag}</span>
                      ))}
                   </div>
                </div>
              )}

              {activeTab === 'specifications' && (
                <div className="animate-in fade-in duration-500">
                   <h3 className="text-2xl font-black text-slate-900 mb-10 uppercase tracking-tight">Technical Data</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 max-w-5xl">
                      <div className="divide-y divide-slate-50">
                         <SpecField label="Brand" value={product.brand || "Industrial Standard"} />
                         <SpecField label="Weight" value={product.weight ? `${product.weight} KG` : "Standard"} />
                         <SpecField label="Warranty" value={product.warranty || "Standard 24m"} />
                      </div>
                      <div className="divide-y divide-slate-50">
                         <SpecField label="SKU" value={product.sku || "N/A"} />
                         <SpecField label="Materials" value={product.attributes?.find((a:any) => a.key === 'Material')?.value || "Mixed Media"} />
                         <SpecField label="Status" value={product.status || "Certified"} />
                      </div>
                   </div>

                   {product.attributes?.length > 0 && (
                     <div className="mt-16">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Full Feature Set</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                           {product.attributes.map((attr: any, i: number) => (
                             <div key={i} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:shadow-md transition-shadow">
                                <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-2">{attr.key}</p>
                                <p className="text-xs font-bold text-slate-900 uppercase tracking-tight">{attr.value}</p>
                             </div>
                           ))}
                        </div>
                     </div>
                   )}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="animate-in fade-in duration-500">
                   <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                      {/* Left: Score Card */}
                      <div className="lg:col-span-4">
                         <div className="p-10 bg-slate-900 text-white rounded-[2.5rem] sticky top-32">
                             <div className="flex items-end gap-3 mb-8">
                                <span className="text-7xl font-black tracking-tighter leading-none">{product.ratingsAverage?.toFixed(1) || "0.0"}</span>
                                <div className="pb-1.5 space-y-2">
                                   <div className="flex gap-1">
                                      {[1,2,3,4,5].map(i => (
                                        <Star key={i} size={14} fill={i <= Math.round(product.ratingsAverage || 0) ? "#FACC15" : "none"} className={i <= Math.round(product.ratingsAverage || 0) ? "text-yellow-400" : "text-white/20"} />
                                      ))}
                                   </div>
                                   <p className="text-[10px] font-black uppercase tracking-widest text-white/40 italic">Global Evaluation</p>
                                </div>
                             </div>
                             
                             <form onSubmit={handlePostReview} className="space-y-4">
                                <textarea 
                                  value={reviewText}
                                  onChange={(e) => setReviewText(e.target.value)}
                                  className="w-full bg-white/10 border-none rounded-2xl p-5 text-sm font-medium text-white placeholder:text-white/30 outline-none focus:bg-white/15 transition-all resize-none h-32"
                                  placeholder="Briefly state your experience..."
                                />
                                <button className="w-full h-14 bg-white text-slate-900 font-black rounded-2xl text-[11px] uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all">Submit Review</button>
                             </form>
                         </div>
                      </div>

                      {/* Right: Review Feed */}
                      <div className="lg:col-span-8 space-y-10">
                         {reviews.length > 0 ? reviews.map((rev: any, i: number) => (
                           <div key={i} className="group relative">
                              <div className="flex items-start justify-between">
                                 <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full border-2 border-white shadow-sm overflow-hidden bg-slate-50">
                                       <img src={rev.userId?.photo || `https://ui-avatars.com/api/?name=${rev.userId?.name}`} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                       <h5 className="text-sm font-black text-slate-900 uppercase tracking-tight">{rev.userId?.name || "Patron"}</h5>
                                       {rev.isVerifiedPurchase && (
                                         <div className="flex items-center gap-1 mt-0.5">
                                            <CheckCircle2 size={12} className="text-emerald-500" />
                                            <span className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest">Ownership Verified</span>
                                         </div>
                                       )}
                                    </div>
                                 </div>
                                 <div className="flex gap-0.5 pt-2">
                                    {[1,2,3,4,5].map(j => (
                                      <Star key={j} size={12} fill={j <= rev.rating ? "#111827" : "none"} className={j <= rev.rating ? "text-slate-900" : "text-slate-100"} />
                                    ))}
                                 </div>
                              </div>
                              <p className="mt-6 text-slate-500 text-lg leading-relaxed font-medium italic">"{rev.comment}"</p>
                              <div className="mt-6 flex items-center gap-2 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                                 <Clock size={12} /> {new Date(rev.createdAt).toLocaleDateString()}
                              </div>
                           </div>
                         )) : (
                           <div className="h-full flex flex-col items-center justify-center py-20 text-slate-300">
                              <Package size={48} strokeWidth={1} className="mb-4 opacity-50" />
                              <p className="text-xs uppercase tracking-[0.3em] font-bold">No narrative found yet</p>
                           </div>
                         )}
                      </div>
                   </div>
                </div>
              )}
           </div>
        </div>
      </div>
    </main>
  );
}

function SpecField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-6 group transition-colors hover:bg-slate-50/50 px-4 rounded-xl -mx-4">
       <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
       <span className="text-[13px] font-bold text-slate-900 uppercase tracking-tight">{value}</span>
    </div>
  );
}
