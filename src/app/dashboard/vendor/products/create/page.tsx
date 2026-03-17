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
    <div className="flex bg-slate-50 min-h-screen font-['Poppins']">
      <Sidebar role="vendor" />
      
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
           <header className="mb-10 flex items-center justify-between">
              <div>
                 <h1 className="text-2xl tracking-tighter text-black uppercase font-bold">List New Portfolio Item</h1>
                 <p className="text-slate-500 text-[10px] uppercase tracking-widest mt-1">Submit high-quality product data for marketplace approval.</p>
              </div>
              <button 
                onClick={() => router.back()}
                className="text-[10px] uppercase tracking-widest text-slate-400 hover:text-black transition-colors"
              >
                Back To Hub
              </button>
           </header>

           {/* Professional Image Gallery Section (Outside Form) */}
           <section className="mb-8">
              <div className="flex items-center justify-between mb-4">
                  <h4 className="text-[10px] text-black uppercase tracking-widest font-bold">Product Media Assets</h4>
                  <span className="text-[9px] text-slate-400 uppercase tracking-widest">{selectedImages.length}/4 Selected</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  {/* Primary Slot */}
                  <div className="md:col-span-12 group relative">
                      <div className={`w-full h-80 bg-white border border-slate-200 rounded-xl flex items-center justify-center overflow-hidden transition-all shadow-sm ${imagePreviews[0] ? 'border-none' : 'hover:border-slate-900/20'}`}>
                          {imagePreviews[0] ? (
                              <>
                                  <img src={imagePreviews[0]} className="w-full h-full object-cover" alt="Primary View" />
                                  <div className="absolute top-6 left-6 px-3 py-1 bg-black/80 backdrop-blur rounded-full">
                                      <p className="text-[8px] text-white uppercase tracking-widest font-bold">Hero Asset (Primary)</p>
                                  </div>
                                  <button 
                                      onClick={() => removeImage(0)}
                                      className="absolute top-6 right-6 w-8 h-8 bg-white shadow-xl rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 transition-all active:scale-90"
                                  >×</button>
                              </>
                          ) : (
                              <div className="flex flex-col items-center">
                                  <img src="/placeholder-product.png" className="w-32 opacity-10 mb-6 grayscale brightness-125" alt="Placeholder" />
                                  <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em]">Upload Primary Visual</p>
                                  <input 
                                      type="file" 
                                      accept="image/*"
                                      onChange={handleImageChange}
                                      className="absolute inset-0 opacity-0 cursor-pointer"
                                  />
                              </div>
                          )}
                      </div>
                  </div>

                  {/* Secondary Slots */}
                  <div className="md:col-span-12 grid grid-cols-3 gap-6">
                      {[1, 2, 3].map((index) => (
                          <div key={index} className="relative group">
                              <div className={`aspect-square bg-white border border-slate-200 rounded-lg flex items-center justify-center overflow-hidden transition-all shadow-sm ${imagePreviews[index] ? 'border-none' : 'hover:border-slate-300'}`}>
                                  {imagePreviews[index] ? (
                                      <>
                                          <img src={imagePreviews[index]} className="w-full h-full object-cover" alt={`Angle ${index}`} />
                                          <button 
                                              onClick={() => removeImage(index)}
                                              className="absolute top-4 right-4 w-6 h-6 bg-white shadow-lg rounded-full flex items-center justify-center text-[10px] text-slate-400 hover:text-red-500"
                                          >×</button>
                                          <div className="absolute bottom-4 left-4 px-2 py-0.5 bg-black/50 backdrop-blur rounded-full">
                                              <p className="text-[6px] text-white uppercase tracking-widest">Angle {index}</p>
                                          </div>
                                      </>
                                  ) : (
                                      <div className="flex flex-col items-center">
                                          <div className="w-2 h-2 bg-slate-100 rounded-full mb-2" />
                                          <p className="text-[8px] text-slate-300 uppercase tracking-widest">Extra {index}</p>
                                          <input 
                                              type="file" 
                                              accept="image/*"
                                              onChange={handleImageChange}
                                              className="absolute inset-0 opacity-0 cursor-pointer"
                                          />
                                      </div>
                                  )}
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
           </section>

           {/* Main Data Section */}
           <section className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <form onSubmit={handleCreateProduct}>
                  <div className="flex flex-col">
                      {/* Row: Name */}
                      <div className="grid grid-cols-1 md:grid-cols-4 border-b border-slate-100">
                          <div className="md:col-span-1 bg-slate-50/50 p-6 flex items-center border-r border-slate-100">
                              <label className="text-[10px] text-black uppercase tracking-[0.15em] font-bold leading-relaxed">Product Name</label>
                          </div>
                          <div className="md:col-span-3 p-4">
                              <input 
                                  required
                                  type="text"
                                  value={newProduct.name}
                                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                                  className="w-full bg-transparent px-4 py-3 outline-none text-sm text-black placeholder:text-slate-400 transition-all focus:bg-slate-50/10 rounded-lg"
                                  placeholder="Enter the official product name"
                              />
                          </div>
                      </div>

                      {/* Row: Category */}
                      <div className="grid grid-cols-1 md:grid-cols-4 border-b border-slate-100">
                          <div className="md:col-span-1 bg-slate-50/50 p-6 flex items-center border-r border-slate-100">
                              <label className="text-[10px] text-black uppercase tracking-[0.15em] font-bold leading-relaxed">Category</label>
                          </div>
                          <div className="md:col-span-3 p-4">
                              <div className="relative">
                                  <button
                                      type="button"
                                      onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                                      className="w-full bg-slate-50/10 border border-slate-100 px-4 py-3 rounded-xl flex items-center justify-between transition-all hover:bg-slate-50/30 group"
                                  >
                                      <span className={`text-sm uppercase tracking-widest ${newProduct.categoryId ? 'text-black font-bold' : 'text-slate-400'}`}>
                                          {categories.find((c: any) => c._id === newProduct.categoryId)?.name || "Select Product Category"}
                                      </span>
                                      <svg className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isCategoryOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                      </svg>
                                  </button>

                                  {isCategoryOpen && (
                                      <>
                                          <div 
                                              className="fixed inset-0 z-10" 
                                              onClick={() => setIsCategoryOpen(false)}
                                          />
                                          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl shadow-black/10 z-20 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                              <div className="max-h-60 overflow-y-auto">
                                                  {categories.map((cat: any) => (
                                                      <button
                                                          key={cat._id}
                                                          type="button"
                                                          onClick={() => {
                                                              setNewProduct({...newProduct, categoryId: cat._id});
                                                              setIsCategoryOpen(false);
                                                          }}
                                                          className={`w-full px-6 py-3 text-left text-xs uppercase tracking-[0.2em] transition-all hover:bg-slate-50 flex items-center justify-between group ${newProduct.categoryId === cat._id ? 'bg-slate-50 text-black font-black' : 'text-slate-400'}`}
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
                      </div>

                      {/* Row: Price & Stock */}
                      <div className="grid grid-cols-1 md:grid-cols-4 border-b border-slate-100">
                          <div className="md:col-span-1 bg-slate-50/50 p-6 flex items-center border-r border-slate-100">
                              <label className="text-[10px] text-black uppercase tracking-[0.15em] font-bold leading-relaxed">Inventory</label>
                          </div>
                          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 divide-x divide-slate-100">
                              <div className="p-4 flex items-center gap-4">
                                  <span className="text-[9px] text-slate-400 uppercase tracking-widest">Price</span>
                                  <input 
                                      required
                                      type="number"
                                      value={newProduct.price}
                                      onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                                      className="flex-1 bg-transparent px-2 py-3 outline-none text-sm font-bold text-black placeholder:text-slate-400"
                                      placeholder="0.00 TK"
                                  />
                              </div>
                              <div className="p-4 flex items-center gap-4">
                                  <span className="text-[9px] text-slate-400 uppercase tracking-widest">Stock</span>
                                  <input 
                                      required
                                      type="number"
                                      value={newProduct.stock}
                                      onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                                      className="flex-1 bg-transparent px-2 py-3 outline-none text-sm font-bold text-black placeholder:text-slate-400"
                                      placeholder="Quantity"
                                  />
                              </div>
                          </div>
                      </div>

                      {/* Row: Description */}
                      <div className="grid grid-cols-1 md:grid-cols-4 border-b border-slate-100">
                          <div className="md:col-span-1 bg-slate-50/50 p-6 flex items-start pt-8 border-r border-slate-100">
                              <label className="text-[10px] text-black uppercase tracking-[0.15em] font-bold leading-relaxed">Description</label>
                          </div>
                          <div className="md:col-span-3 p-4">
                              <textarea 
                                  required
                                  rows={6}
                                  value={newProduct.description}
                                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                                  className="w-full bg-transparent px-4 py-4 outline-none text-sm text-black leading-relaxed resize-none placeholder:text-slate-400 focus:bg-slate-50/10 rounded-lg"
                                  placeholder="Detail the technical aspects, materials, and benefits of the product..."
                              />
                          </div>
                      </div>

                      {/* Row: Action */}
                      <div className="bg-slate-50/10 p-8 flex justify-end">
                          <button 
                              type="submit" 
                              disabled={isCreatingProduct || isUploadingImage}
                              className="bg-black text-white px-12 py-4 rounded-lg text-[10px] uppercase tracking-[0.25em] font-bold shadow-lg shadow-black/10 hover:bg-slate-900 active:scale-95 transition-all disabled:opacity-50"
                          >
                              {isCreatingProduct || isUploadingImage ? "Processing Protocol..." : "Commit To Marketplace"}
                          </button>
                      </div>
                  </div>
              </form>
           </section>
        </div>
      </main>
    </div>
  );
}
