"use client";

import { useGetMeQuery } from "@/modules/identity/services/authApi";
import { useGetShopDetailsQuery } from "@/modules/business/services/businessApi";
import { useCreateProductMutation, useGetCategoriesQuery, useUploadProductImageMutation } from "@/modules/shopping/services/productApi";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function CreateProductPage() {
  const router = useRouter();
  const { data: userData, isLoading: isUserLoading } = useGetMeQuery({});
  const { data: shopData } = useGetShopDetailsQuery({});
  const { data: categoriesData } = useGetCategoriesQuery({});
  const [createProduct, { isLoading: isCreatingProduct }] = useCreateProductMutation();

  const vendorId = shopData?.data?.vendor?._id;

  // Product Create State
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: ""
  });

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const [uploadProductImage, { isLoading: isUploadingImage }] = useUploadProductImageMutation();

  useEffect(() => {
    if (userData?.data?.user) {
      const role = userData.data.user.role?.toLowerCase();
      if (role !== "vendor") {
        router.push("/dashboard/customer");
      }
    }
  }, [userData, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setSelectedImages((prev) => [...prev, ...newFiles].slice(0, 4)); // Limit to 4 images
      
      newFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews((prev) => [...prev, reader.result as string].slice(0, 4));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorId) {
        alert("Vendor identity not found. Please try again.");
        return;
    }
    try {
      const payload = {
        ...newProduct,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
        vendorId
      };
      const result = await createProduct(payload).unwrap();
      const productId = result.data.product._id;

      // Sequentially upload all selected images
      if (selectedImages.length > 0) {
        for (let i = 0; i < selectedImages.length; i++) {
            const formData = new FormData();
            formData.append("image", selectedImages[i]);
            formData.append("isPrimary", i === 0 ? "true" : "false"); // First image is primary
            await uploadProductImage({ productId, formData }).unwrap();
        }
      }

      alert(`Product created with ${selectedImages.length} images! Awaiting admin approval.`);
      router.push("/dashboard/vendor");
    } catch (err) {
      console.error("Product creation failed:", err);
      alert("Creation failed. Please try again.");
    }
  };

  const categories = categoriesData?.data || [];

  if (isUserLoading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen font-['Inter']">
      <Sidebar role="vendor" />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-[1200px] mx-auto">
           {/* Header Section */}
           <header className="mb-12 flex items-end justify-between border-b border-slate-200 pb-8">
              <div>
                 <div className="flex items-center gap-3 mb-2">
                    <span className="w-2 h-8 bg-black"></span>
                    <h1 className="text-3xl tracking-[-0.04em] text-black uppercase font-black leading-none">Product Hub</h1>
                 </div>
                 <p className="text-slate-400 text-[10px] uppercase tracking-[0.3em] font-bold">Standardized Inventory Ingestion Protocol</p>
              </div>
              <div className="flex items-center gap-6">
                 <button 
                  onClick={() => router.back()}
                  className="text-[10px] uppercase tracking-widest text-slate-400 hover:text-black transition-all font-bold"
                 >
                  Back to dashboard
                 </button>
                 <div className="h-6 w-[1px] bg-slate-200"></div>
                 <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">System Online</span>
                 </div>
              </div>
           </header>

           <form onSubmit={handleCreateProduct}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                 
                 {/* Left Column: Core Data (8 Units) */}
                 <div className="lg:col-span-8 space-y-8">
                    
                    {/* Visual Asset Module */}
                    <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h4 className="text-[11px] text-black uppercase tracking-[0.2em] font-black">01. Visual Architecture</h4>
                            <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">{selectedImages.length} / 4 Assets Loaded</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                            {/* Hero Card */}
                            <div className="md:col-span-8 group relative aspect-[4/3]">
                                <div className={`w-full h-full bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center overflow-hidden transition-all duration-500 ${imagePreviews[0] ? 'border-none ring-1 ring-slate-100 shadow-xl' : 'hover:bg-slate-100 hover:border-slate-300'}`}>
                                    {imagePreviews[0] ? (
                                        <>
                                            <img src={imagePreviews[0]} className="w-full h-full object-cover" alt="Hero View" />
                                            <div className="absolute top-6 left-6 px-3 py-1 bg-black/90 backdrop-blur rounded-lg border border-white/10">
                                                <p className="text-[8px] text-white uppercase tracking-widest font-black">Primary Hero</p>
                                            </div>
                                            <button 
                                                type="button"
                                                onClick={() => removeImage(0)}
                                                className="absolute top-6 right-6 w-10 h-10 bg-white/90 backdrop-blur shadow-2xl rounded-xl flex items-center justify-center text-slate-400 hover:text-red-500 transition-all scale-0 group-hover:scale-100 active:scale-90"
                                            >×</button>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-4">
                                                <svg className="w-6 h-6 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.587-1.587a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            </div>
                                            <p className="text-[9px] text-slate-400 uppercase tracking-[0.3em] font-black">Initiate Hero Ingestion</p>
                                        </div>
                                    )}
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                </div>
                            </div>

                            {/* Angle slots */}
                            <div className="md:col-span-4 grid grid-cols-1 grid-rows-3 gap-4">
                                {[1, 2, 3].map((index) => (
                                    <div key={index} className="relative group aspect-square">
                                        <div className={`w-full h-full bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center overflow-hidden transition-all ${imagePreviews[index] ? 'border-none ring-1 ring-slate-100 shadow-lg' : 'hover:bg-slate-100'}`}>
                                            {imagePreviews[index] ? (
                                                <>
                                                    <img src={imagePreviews[index]} className="w-full h-full object-cover" alt={`Angle ${index}`} />
                                                    <button 
                                                        type="button"
                                                        onClick={() => removeImage(index)}
                                                        className="absolute top-3 right-3 w-6 h-6 bg-white/90 backdrop-blur rounded-lg shadow-xl flex items-center justify-center text-[10px] text-slate-400 hover:text-red-500 scale-0 group-hover:scale-100 transition-all font-bold"
                                                    >×</button>
                                                </>
                                            ) : (
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                                                    <p className="text-[7px] text-slate-300 uppercase tracking-widest leading-none font-black">Angle {index}</p>
                                                    {!imagePreviews[index] && (
                                                      <input 
                                                          type="file" 
                                                          accept="image/*"
                                                          onChange={handleImageChange}
                                                          className="absolute inset-0 opacity-0 cursor-pointer"
                                                      />
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* General Specifications Module */}
                    <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-10">
                            <h4 className="text-[11px] text-black uppercase tracking-[0.2em] font-black">02. Data Core</h4>
                            <div className="h-[1px] flex-1 bg-slate-50"></div>
                        </div>

                        <div className="space-y-10">
                            {/* Field: Name */}
                            <div className="group">
                                <label className="text-[9px] text-slate-400 uppercase tracking-[0.25em] font-black mb-4 block group-focus-within:text-black transition-all">Identity Designation</label>
                                <input 
                                    required
                                    type="text"
                                    value={newProduct.name}
                                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                                    className="w-full bg-[#fcfcfc] border-b-2 border-slate-50 px-0 py-4 outline-none text-xl text-black font-black placeholder:text-slate-200 focus:border-black transition-all"
                                    placeholder="ENTER OFFICIAL PRODUCT NAME"
                                />
                            </div>

                            {/* Field: Description */}
                            <div className="group">
                                <label className="text-[9px] text-slate-400 uppercase tracking-[0.25em] font-black mb-4 block group-focus-within:text-black transition-all">Feature Set & Technicalities</label>
                                <textarea 
                                    required
                                    rows={5}
                                    value={newProduct.description}
                                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                                    className="w-full bg-[#fcfcfc] border-b-2 border-slate-50 px-0 py-4 outline-none text-sm text-black font-medium leading-[1.8] placeholder:text-slate-200 focus:border-black transition-all resize-none"
                                    placeholder="Describe the aesthetic, material properties, and functional utility..."
                                />
                            </div>
                        </div>
                    </div>
                 </div>

                 {/* Right Column: Taxonomy & Pricing (4 Units) */}
                 <div className="lg:col-span-4 space-y-8">
                    
                    {/* Taxonomy Module */}
                    <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
                        <h4 className="text-[11px] text-black uppercase tracking-[0.2em] font-black mb-8">03. Marketplace Taxonomy</h4>
                        
                        <div className="relative">
                            <label className="text-[9px] text-slate-400 uppercase tracking-[0.25em] font-black mb-3 block">Category Domain</label>
                            <button
                                type="button"
                                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                                className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-xl flex items-center justify-between transition-all hover:bg-slate-100 group"
                            >
                                <span className={`text-[10px] uppercase tracking-widest ${newProduct.categoryId ? 'text-black font-black' : 'text-slate-400 font-bold'}`}>
                                    {categories.find((c: any) => c._id === newProduct.categoryId)?.name || "Select Category"}
                                </span>
                                <svg className={`w-4 h-4 text-slate-300 transition-transform duration-500 ${isCategoryOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {isCategoryOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setIsCategoryOpen(false)} />
                                    <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-slate-200 rounded-2xl shadow-2xl z-20 overflow-hidden py-3 animate-in fade-in slide-in-from-top-4 duration-300">
                                        <div className="max-h-72 overflow-y-auto custom-scrollbar">
                                            {categories.map((cat: any) => (
                                                <button
                                                    key={cat._id}
                                                    type="button"
                                                    onClick={() => {
                                                        setNewProduct({...newProduct, categoryId: cat._id});
                                                        setIsCategoryOpen(false);
                                                    }}
                                                    className={`w-full px-6 py-4 text-left text-[9px] uppercase tracking-[0.3em] font-black transition-all hover:bg-black hover:text-white flex items-center justify-between group ${newProduct.categoryId === cat._id ? 'bg-slate-50 text-black' : 'text-slate-400'}`}
                                                >
                                                    {cat.name}
                                                    {newProduct.categoryId === cat._id && (
                                                        <div className="w-1.5 h-1.5 bg-black rounded-full" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Financial Module */}
                    <div className="bg-black text-white rounded-xl p-8 shadow-2xl shadow-black/20">
                        <h4 className="text-[11px] text-white/50 uppercase tracking-[0.25em] font-black mb-10">04. Financial Value</h4>
                        
                        <div className="space-y-10">
                            <div className="group">
                                <label className="text-[8px] text-white/30 uppercase tracking-[0.3em] font-black mb-3 block">Retail Valuation (TK)</label>
                                <div className="flex items-end gap-3 border-b border-white/10 pb-4 group-focus-within:border-white transition-all">
                                    <span className="text-xl font-bold opacity-30">৳</span>
                                    <input 
                                        required
                                        type="number"
                                        value={newProduct.price}
                                        onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                                        className="bg-transparent w-full text-3xl font-black outline-none placeholder:text-white/10"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <label className="text-[8px] text-white/30 uppercase tracking-[0.3em] font-black mb-3 block">Available Inventory (QTY)</label>
                                <div className="flex items-end gap-3 border-b border-white/10 pb-4 group-focus-within:border-white transition-all">
                                    <span className="text-xl font-bold opacity-30">#</span>
                                    <input 
                                        required
                                        type="number"
                                        value={newProduct.stock}
                                        onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                                        className="bg-transparent w-full text-3xl font-black outline-none placeholder:text-white/10"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            <div className="pt-6">
                                <button 
                                    type="submit" 
                                    disabled={isCreatingProduct || isUploadingImage}
                                    className="w-full bg-white text-black font-black py-5 rounded-xl text-[11px] uppercase tracking-[0.4em] shadow-xl hover:bg-slate-100 transition-all active:scale-[0.98] disabled:opacity-30 ripple-effect"
                                >
                                    {isCreatingProduct || isUploadingImage ? "Syncing..." : "Publish To MallX"}
                                </button>
                                <p className="text-[7px] text-white/20 uppercase tracking-widest text-center mt-6 leading-relaxed">By pushing this asset, you confirm adherence to our international marketplace standards & logistics protocols.</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Tools */}
                    <div className="bg-white border border-slate-200 rounded-xl p-6 flex items-center justify-between">
                        <div className="flex -space-x-2">
                            {[1,2,3].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold">A</div>
                            ))}
                        </div>
                        <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Collaborator View</span>
                    </div>

                 </div>
              </div>
           </form>
        </div>
      </main>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #000;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
