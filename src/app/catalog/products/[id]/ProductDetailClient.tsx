"use client";

import { useGetProductQuery, usePostProductReviewMutation } from "@/modules/shopping/services/productApi";
import { useAddToCartMutation } from "@/modules/shopping/services/shoppingApi";
import { useRouter } from "next/navigation";
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
  Plus,
  Layout,
  Tag,
  Calendar,
  Layers,
  ExternalLink,
  ChevronLeft
} from "lucide-react";

export default function ProductDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const { data: productData, isLoading } = useGetProductQuery(id);
  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();
  const [postReview, { isLoading: isReviewing }] = usePostProductReviewMutation();

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("item-details");
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const product = productData?.data?.product;
  if (!product) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
      <Package size={48} className="text-slate-200 mb-4" />
      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest text-center">Product Not Found</p>
      <button onClick={() => router.back()} className="mt-6 flex items-center gap-2 text-slate-900 font-bold hover:underline">
        <ArrowLeft size={16} /> Return to Home
      </button>
    </div>
  );

  const handleAddToCart = async () => {
    try {
      const flashPrice = product.activeFlashSale?.discountPrice;
      const finalPrice = flashPrice || product.discountPrice || product.price;

      await addToCart({
        productId: product._id,
        variantId: selectedVariant?._id,
        quantity,
        price: finalPrice
      }).unwrap();
      router.push("/shopping/cart");
    } catch (err) {
      console.error("Failed to add to cart:", err);
    }
  };

  const handlePostReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    try {
      await postReview({
        productId: product._id,
        reviewData: { rating, comment: reviewText }
      }).unwrap();
      setReviewText("");
      alert("Review posted!");
    } catch (err: any) {
      // Create a more comprehensive error string for the console
      const errorStr = err instanceof Error ? err.message : JSON.stringify(err, Object.getOwnPropertyNames(err), 2);
      console.error("Failed to post review:", errorStr);
      
      let errorMessage = "Review post failed. Make sure you are logged in and have purchased this product.";
      
      if (err?.data?.message && Object.keys(err.data).length > 0) {
        errorMessage = err.data.message;
      } else if (err?.status === 403) {
        errorMessage = "You do not have permission to post a review. Only Customers can review products.";
      } else if (err?.status === 401) {
        errorMessage = "Your session has expired or you are not logged in. Please log in again.";
      } else if (err?.error) {
        errorMessage = err.error;
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      } else if (err?.status) {
        errorMessage = `Request failed with status ${err.status}`;
      }
      
      alert(errorMessage);
    }
  };

  const images = product.images || [];
  const reviews = product.reviews || [];
  const shop = product.shop;

  return (
    <main className="min-h-screen bg-[#F8F9FA] pb-24 font-sans text-slate-900">
      {/* 1. Full-Width Header */}
      <header className="bg-white border-b border-slate-200 pt-10 pb-4">
        <div className="max-w-7xl mx-auto px-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">
            <button onClick={() => router.push('/')} className="hover:text-slate-900 transition-colors">Home</button>
            <ChevronRight size={12} className="opacity-40" />
            <button onClick={() => router.push('/catalog')} className="hover:text-slate-900 transition-colors">Marketplace</button>
            <ChevronRight size={12} className="opacity-40" />
            <span className="text-slate-900">{product.categoryId?.name || "Premium Asset"}</span>
          </nav>

          {/* Title & Author */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
                {product.name}
              </h1>
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2 group cursor-pointer">
                  <span className="text-sm font-medium text-slate-400">By</span>
                  <span className="text-sm font-bold text-indigo-600 group-hover:underline">{shop?.shopName || "Exclusive Vendor"}</span>
                </div>
                <div className="flex items-center gap-4 border-l border-slate-100 pl-6 h-4">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <ShoppingBag size={14} />
                    <span className="text-xs font-bold uppercase tracking-widest">{product.totalSales || 0} sales</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                    <CheckCircle2 size={12} />
                    recently updated
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:border-rose-100 transition-all shadow-sm group">
                <Heart size={20} className="group-hover:fill-rose-500 transition-colors" />
              </button>
              <button className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm">
                <Share2 size={20} />
              </button>
            </div>
          </div>

          {/* Navigation Tabs (Premium Gradient Border Design) */}
          <div className="mt-12 flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {[
              { id: "item-details", label: "Item Details" },
              { id: "reviews", label: `Reviews (${reviews.length})` },
              { id: "specifications", label: "Specifications" },
              { id: "support", label: "Support" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group relative p-[2px] rounded-xl overflow-hidden transition-all duration-500 ${activeTab === tab.id ? 'scale-105' : 'hover:scale-105'}`}
              >
                {/* Gradient Border Animation Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-r from-black via-gray-400 to-black opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${activeTab === tab.id ? 'opacity-100 animate-[spin-slow_4s_linear_infinite]' : 'group-hover:animate-[spin-slow_4s_linear_infinite]'}`} />
                
                {/* Inner Content */}
                <div className={`relative px-6 py-3 rounded-[10px] bg-white transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id ? 'text-black-200 shadow-inner' : 'text-black-200 group-hover:text-gray-400'}`}>
                  <span className="text-[11px] font-black uppercase tracking-[0.2em]">{tab.label}</span>
                  {activeTab === tab.id && (
                    <div className="w-1.5 h-1.5 bg-black rounded-full animate-pulse" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* 2. Main Layout (Grid 8/4) */}
      <div className="max-w-7xl mx-auto px-6 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Column: Content (8 Units) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Gallery Wrapper */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm p-6 md:p-8">
              <div className="flex flex-col gap-6">
                {/* Main Preview Area */}
                <div className="relative aspect-video bg-[#FBFBFC] rounded-2xl overflow-hidden group">
                  {images[activeImageIndex] ? (
                    <img
                      src={images[activeImageIndex].imageUrl || images[activeImageIndex].url}
                      alt={product.name}
                      className="w-full h-full object-contain p-8 transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-200">
                      <Package size={64} strokeWidth={1} />
                      <p className="text-[10px] uppercase tracking-[0.3em] mt-4 font-bold">Preview Asset Unavailable</p>
                    </div>
                  )}

                  {/* Badge Overlay */}
                  <div className="absolute top-6 left-6 flex flex-col gap-2">
                    <span className="px-3 py-1.5 bg-white/95 backdrop-blur-md rounded-lg text-[9px] font-black uppercase tracking-[0.15em] shadow-sm border border-slate-100">
                      {product.brand || "Industrial Standard"}
                    </span>
                  </div>
                </div>

                {/* Sub-actions for preview */}
                <div className="flex flex-wrap items-center gap-3">
                  <button className="flex-1 h-14 bg-indigo-600/10 text-indigo-600 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-2 border border-indigo-100 shadow-sm">
                    <Layout size={18} />
                    Live Preview
                  </button>
                  <button className="flex-1 h-14 bg-slate-50 text-slate-500 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-2 border border-slate-200 shadow-sm">
                    <Plus size={18} />
                    View Screenshots
                  </button>
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 pt-2 border-t border-slate-50">
                    {images.map((img: any, i: number) => (
                      <button
                        key={i}
                        onClick={() => setActiveImageIndex(i)}
                        className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 bg-slate-50 ${activeImageIndex === i ? 'border-indigo-600 shadow-md scale-105' : 'border-transparent opacity-40 hover:opacity-100 hover:border-slate-200'
                          }`}
                      >
                        <img src={img.imageUrl || img.url} className="w-full h-full object-contain p-2" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Content Tabs area */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 lg:p-10 space-y-10">
              {activeTab === 'item-details' && (
                <article className="animate-in fade-in duration-500">
                  <h3 className="text-xl font-black text-black-200 mb-6 uppercase tracking-tight flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-700 flex items-center justify-center text-white"><Layers size={18} /></div>
                    Overview
                  </h3>
                  <div className="prose prose-slate max-w-none">
                    <p className="text-slate-600 leading-relaxed text-lg font-medium mb-8">
                      {product.description || "A meticulously crafted high-end asset designed for power users. It features an optimized workflow, seamless integration, and industry-standard architecture."}
                    </p>

                    {/* <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Core Principles</h4> */}
                    {/* <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
                      <li className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm font-bold text-slate-700">
                        <CheckCircle2 size={18} className="text-indigo-500" /> Professional Grade Components
                      </li>
                      <li className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm font-bold text-slate-700">
                        <CheckCircle2 size={18} className="text-indigo-500" /> Fully Responsive Architecture
                      </li>
                      <li className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm font-bold text-slate-700">
                        <CheckCircle2 size={18} className="text-indigo-500" /> Optimized for Rapid Deployment
                      </li>
                      <li className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm font-bold text-slate-700">
                        <CheckCircle2 size={18} className="text-indigo-500" /> Dedicated Technical Support
                      </li>
                    </ul> */}
                  </div>

                  <div className="mt-12 flex flex-wrap gap-2">
                    {product.tags?.map((tag: string, i: number) => (
                      <span key={i} className="px-4 py-2 bg-slate-50 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer">#{tag}</span>
                    ))}
                  </div>
                </article>
              )}

              {activeTab === 'specifications' && (
                <div className="animate-in fade-in duration-500">
                  <h3 className="text-xl font-black text-slate-900 mb-8 uppercase tracking-tight flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600"><Plus size={16} /></div>
                    Technical Data
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
                    <div className="divide-y divide-slate-100">
                      <SpecField label="Brand" value={product.brand || "Industrial Standard"} />
                      <SpecField label="Weight" value={product.weight ? `${product.weight} KG` : "Standard"} />
                      <SpecField label="SKU" value={product.sku || id.slice(-8).toUpperCase()} />
                    </div>
                    <div className="divide-y divide-slate-100">
                      <SpecField label="Warranty" value={product.warranty || "Standard 24m"} />
                      <SpecField label="Materials" value={product.attributes?.find((a: any) => a.key === 'Material')?.value || "Composite"} />
                      <SpecField label="Status" value={product.status || "Certified Premium"} />
                    </div>
                  </div>

                  {product.attributes?.length > 0 && (
                    <div className="mt-12">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 block">Extended Attributes</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                        {product.attributes.map((attr: any, i: number) => (
                          <div key={i} className="p-5 bg-[#FBFBFC] rounded-2xl border border-slate-200 hover:border-indigo-200 transition-all group">
                            <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">{attr.key}</p>
                            <p className="text-xs font-bold text-slate-900 uppercase tracking-tight group-hover:text-indigo-600 transition-colors">{attr.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="animate-in fade-in duration-500">
                  <div className="flex items-center justify-between mb-10">
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600"><Star size={16} /></div>
                      Customer Narrative
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-black text-slate-900">{product.ratingsAverage?.toFixed(1) || "0.0"}</span>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(i => (
                          <Star key={i} size={14} fill={i <= Math.round(product.ratingsAverage || 0) ? "#FACC15" : "none"} className={i <= Math.round(product.ratingsAverage || 0) ? "text-yellow-400" : "text-slate-200"} />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-10">
                    {reviews.length > 0 ? reviews.map((rev: any, i: number) => (
                      <div key={i} className="relative pb-10 border-b border-slate-100 last:border-0">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl border border-slate-100 overflow-hidden bg-white shadow-sm">
                              <img src={rev.userId?.photo || `https://ui-avatars.com/api/?name=${rev.userId?.name}`} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <h5 className="text-sm font-black text-slate-900 uppercase tracking-tight">{rev.userId?.name || "Patron"}</h5>
                              <div className="flex items-center gap-4 mt-0.5">
                                <div className="flex gap-0.5">
                                  {[1, 2, 3, 4, 5].map(j => (
                                    <Star key={j} size={10} fill={j <= rev.rating ? "#111827" : "none"} className={j <= rev.rating ? "text-slate-900" : "text-slate-100"} />
                                  ))}
                                </div>
                                {rev.isVerifiedPurchase && (
                                  <span className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest border border-emerald-100 px-2 py-0.5 rounded-full bg-emerald-50">Verified Ownership</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{new Date(rev.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="mt-6 text-slate-500 text-lg leading-relaxed font-medium italic">"{rev.comment}"</p>
                      </div>
                    )) : (
                      <div className="py-20 flex flex-col items-center justify-center text-slate-300 bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200">
                        <Layout size={48} strokeWidth={1} className="mb-4 opacity-50" />
                        <p className="text-xs uppercase tracking-[0.3em] font-bold">No Feedback Narrated Yet</p>
                      </div>
                    )}

                    {/* Review form */}
                    <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 lg:p-10">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-6">Contribute your experience</p>
                      <form onSubmit={handlePostReview} className="space-y-6">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold uppercase tracking-widest">Global Impression:</span>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map(i => (
                              <button key={i} type="button" onClick={() => setRating(i)} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${rating >= i ? 'bg-yellow-400 text-slate-900' : 'bg-white/10 text-white/40 hover:bg-white/20'}`}>
                                <Star size={16} fill={rating >= i ? "currentColor" : "none"} />
                              </button>
                            ))}
                          </div>
                        </div>
                        <textarea
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          className="w-full bg-white/10 border-none rounded-2xl p-5 text-sm font-medium text-white placeholder:text-white/30 outline-none focus:bg-white/15 transition-all resize-none h-32"
                          placeholder="Briefly state your technical evaluation..."
                        />
                        <button className="w-full h-14 bg-white text-slate-900 font-black rounded-2xl text-[11px] uppercase tracking-widest hover:bg-slate-100 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-black/20">Submit Review</button>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Sidebar (4 Units) */}
          <div className="lg:col-span-4 space-y-6">
            {/* 1. Purchase Card */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden sticky top-32">
              <div className="p-8 border-b border-slate-100">
                <div className="flex items-center justify-between mb-8">
                  <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 cursor-pointer group flex items-center justify-between flex-1">
                    <span className="text-xs font-black text-slate-900 uppercase">Regular License</span>
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                  <div className="pl-6 text-right">
                    {product.activeFlashSale ? (
                      <div className="flex flex-col items-end">
                        <div className="flex items-end justify-end gap-1">
                          <span className="text-sm font-black text-rose-500 tracking-widest uppercase pb-1.5">TK</span>
                          <span className="text-5xl font-black text-rose-500 tracking-tighter leading-none">{(product.activeFlashSale.discountPrice * quantity).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs font-medium text-slate-400">Flash Sale Price</span>
                          <span className="text-[10px] font-black text-rose-500 uppercase bg-rose-50 px-2 py-0.5 rounded-md">Save {Math.round(((product.price - product.activeFlashSale.discountPrice) / product.price) * 100)}%</span>
                        </div>
                      </div>
                    ) : product.discountPrice ? (
                      <div className="flex flex-col items-end">
                        <div className="flex items-end justify-end gap-1">
                          <span className="text-sm font-black text-slate-400 tracking-widest uppercase pb-1.5">TK</span>
                          <span className="text-5xl font-black text-slate-900 tracking-tighter leading-none">{(product.discountPrice * quantity).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs font-medium text-slate-400">Total for {quantity} {quantity === 1 ? 'unit' : 'units'}</span>
                          <span className="text-[10px] font-black text-rose-500 uppercase bg-rose-50 px-2 py-0.5 rounded-md">Save {Math.round(((product.price - product.discountPrice) / product.price) * 100)}%</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-end">
                        <div className="flex items-end justify-end gap-1">
                          <span className="text-sm font-black text-slate-400 tracking-widest uppercase pb-1.5">TK</span>
                          <span className="text-5xl font-black text-slate-900 tracking-tighter leading-none">{(product.price * quantity).toLocaleString()}</span>
                        </div>
                        <span className="text-xs font-medium text-slate-400 mt-2">Total for {quantity} {quantity === 1 ? 'unit' : 'units'}</span>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed font-medium mb-8">
                  Standard license for personal or single client project. Includes <span className="text-slate-900 font-black">2 years</span> of priority technical support and performance updates.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center bg-slate-50 rounded-2xl p-1 border border-slate-100 h-14">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="flex-1 h-full flex items-center justify-center hover:bg-white hover:shadow-sm rounded-xl transition-all text-slate-400 hover:text-slate-900"><Minus size={18} /></button>
                    <span className="w-10 text-center font-black text-slate-900 text-lg">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="flex-1 h-full flex items-center justify-center hover:bg-white hover:shadow-sm rounded-xl transition-all text-slate-400 hover:text-slate-900"><Plus size={18} /></button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={isAdding || product.stock <= 0}
                    className="w-full h-16 bg-[#2ECC71] text-white font-black rounded-2xl text-[12px] uppercase tracking-[0.3em] shadow-lg shadow-emerald-500/10 hover:bg-[#27AE60] hover:scale-[1.02] transition-all active:scale-[0.98] disabled:opacity-20 flex items-center justify-center gap-3"
                  >
                    <ShoppingBag size={20} />
                    {isAdding ? "Processing..." : "Add to Cart"}
                  </button>
                </div>

                <p className="mt-4 text-[9px] text-slate-400 text-center uppercase tracking-widest font-bold">
                  Price is in BDT and includes all local taxes
                </p>
              </div>

              {/* Quick Vendor Section in Sidebar */}
              <div className="p-8 bg-[#FBFBFC]">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl border-2 border-white shadow-md overflow-hidden bg-white">
                    <img src={shop?.logo || `https://ui-avatars.com/api/?name=${shop?.shopName}`} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[13px] font-black text-slate-900 uppercase tracking-tight mb-1">{shop?.shopName || "Exclusive Vendor"}</h4>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(i => <Star key={i} size={8} fill={i <= 4 ? "#FACC15" : "none"} className={i <= 4 ? "text-yellow-400" : "text-slate-200"} />)}
                      </div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Gold Level</span>
                    </div>
                  </div>
                </div>
                <button className="w-full h-12 bg-white border border-slate-200 text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                  View Portfolio
                </button>
              </div>

              {/* Additional Attributes Block */}
              <div className="p-8 border-t border-slate-100 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Calendar size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Last Update</span>
                  </div>
                  <span className="text-[11px] font-black text-slate-700">{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Tag size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">In Stock</span>
                  </div>
                  <span className={`text-[11px] font-black ${product.stock > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>{product.stock > 0 ? `${product.stock} units` : 'Legacy Status'}</span>
                </div>
                <div className="pt-2">
                  <button className="w-full text-center text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline flex items-center justify-center gap-2">
                    More information <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            </div>

            {/* Support / Help Card */}
            <div className="p-8 rounded-3xl border border-slate-200 bg-white shadow-sm flex items-center justify-between group cursor-pointer hover:border-indigo-600 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-tight">Need Assistance?</h4>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Visit the support forum</p>
                </div>
              </div>
              <ExternalLink size={16} className="text-slate-300 group-hover:text-slate-900 transition-colors" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function SpecField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-5 group transition-colors hover:bg-slate-50/50 px-4 rounded-xl -mx-4">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">{label}</span>
      <span className="text-[12px] font-bold text-slate-900 uppercase tracking-tight">{value}</span>
    </div>
  );
}
