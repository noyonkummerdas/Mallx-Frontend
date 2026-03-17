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
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar role="vendor" />
      
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
           <header className="mb-10 flex items-center justify-between">
              <div>
                 <h1 className="text-2xl tracking-tighter text-blue-900 uppercase font-bold">List New Portfolio Item</h1>
                 <p className="text-blue-400 text-[10px] uppercase tracking-widest mt-1">Submit high-quality product data for marketplace approval.</p>
              </div>
              <button 
                onClick={() => router.back()}
                className="text-[10px] uppercase tracking-widest text-blue-300 hover:text-blue-600 transition-colors"
              >
                Back To Hub
              </button>
           </header>

           {/* Professional Image Gallery Section (Outside Form) */}
           <section className="mb-8">
              <div className="flex items-center justify-between mb-4">
                  <h4 className="text-[10px] text-blue-900 uppercase tracking-widest font-bold">Product Media Assets</h4>
                  <span className="text-[9px] text-blue-400 uppercase tracking-widest">{selectedImages.length}/4 Selected</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  {/* Primary Slot */}
                  <div className="md:col-span-12 group relative">
                      <div className={`w-full h-80 bg-white border border-blue-100 rounded-xl flex items-center justify-center overflow-hidden transition-all shadow-sm ${imagePreviews[0] ? 'border-none' : 'hover:border-blue-300'}`}>
                          {imagePreviews[0] ? (
                              <>
                                  <img src={imagePreviews[0]} className="w-full h-full object-cover" alt="Primary View" />
                                  <div className="absolute top-6 left-6 px-3 py-1 bg-blue-900/80 backdrop-blur rounded-full">
                                      <p className="text-[8px] text-white uppercase tracking-widest font-bold">Hero Asset (Primary)</p>
                                  </div>
                                  <button 
                                      onClick={() => removeImage(0)}
                                      className="absolute top-6 right-6 w-8 h-8 bg-white shadow-xl rounded-full flex items-center justify-center text-blue-400 hover:text-red-500 transition-all active:scale-90"
                                  >×</button>
                              </>
                          ) : (
                              <div className="flex flex-col items-center">
                                  <img src="/placeholder-product.png" className="w-32 opacity-10 mb-6 grayscale brightness-125" alt="Placeholder" />
                                  <p className="text-[10px] text-blue-300 uppercase tracking-[0.2em]">Upload Primary Visual</p>
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
                              <div className={`aspect-square bg-white border border-blue-50 rounded-lg flex items-center justify-center overflow-hidden transition-all shadow-sm ${imagePreviews[index] ? 'border-none' : 'hover:border-blue-300'}`}>
                                  {imagePreviews[index] ? (
                                      <>
                                          <img src={imagePreviews[index]} className="w-full h-full object-cover" alt={`Angle ${index}`} />
                                          <button 
                                              onClick={() => removeImage(index)}
                                              className="absolute top-4 right-4 w-6 h-6 bg-white shadow-lg rounded-full flex items-center justify-center text-[10px] text-blue-400 hover:text-red-500"
                                          >×</button>
                                          <div className="absolute bottom-4 left-4 px-2 py-0.5 bg-blue-900/50 backdrop-blur rounded-full">
                                              <p className="text-[6px] text-white uppercase tracking-widest">Angle {index}</p>
                                          </div>
                                      </>
                                  ) : (
                                      <div className="flex flex-col items-center">
                                          <div className="w-2 h-2 bg-blue-50 rounded-full mb-2" />
                                          <p className="text-[8px] text-blue-200 uppercase tracking-widest">Extra {index}</p>
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
           <section className="bg-white border border-blue-100 rounded-xl overflow-hidden shadow-sm">
              <form onSubmit={handleCreateProduct}>
                  <div className="flex flex-col">
                      {/* Row: Name */}
                      <div className="grid grid-cols-1 md:grid-cols-4 border-b border-blue-50">
                          <div className="md:col-span-1 bg-blue-50/20 p-6 flex items-center border-r border-blue-50">
                              <label className="text-[10px] text-blue-700 uppercase tracking-[0.15em] font-bold leading-relaxed">Product Name</label>
                          </div>
                          <div className="md:col-span-3 p-4">
                              <input 
                                  required
                                  type="text"
                                  value={newProduct.name}
                                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                                  className="w-full bg-transparent px-4 py-3 outline-none text-sm text-blue-900 placeholder:text-blue-400/60 transition-all focus:bg-blue-50/10 rounded-lg"
                                  placeholder="Enter the official product name"
                              />
                          </div>
                      </div>

                      {/* Row: Category */}
                      <div className="grid grid-cols-1 md:grid-cols-4 border-b border-blue-50">
                          <div className="md:col-span-1 bg-blue-50/20 p-6 flex items-center border-r border-blue-50">
                              <label className="text-[10px] text-blue-700 uppercase tracking-[0.15em] font-bold leading-relaxed">Category</label>
                          </div>
                          <div className="md:col-span-3 p-4">
                              <select 
                                  required
                                  value={newProduct.categoryId}
                                  onChange={(e) => setNewProduct({...newProduct, categoryId: e.target.value})}
                                  className="w-full bg-transparent px-4 py-3 outline-none text-sm text-blue-900 uppercase tracking-widest appearance-none cursor-pointer focus:bg-blue-50/10 rounded-lg"
                              >
                                  <option value="">Select Marketplace Domain</option>
                                  {categories.map((cat: any) => (
                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                  ))}
                              </select>
                          </div>
                      </div>

                      {/* Row: Price & Stock */}
                      <div className="grid grid-cols-1 md:grid-cols-4 border-b border-blue-50">
                          <div className="md:col-span-1 bg-blue-50/20 p-6 flex items-center border-r border-blue-50">
                              <label className="text-[10px] text-blue-700 uppercase tracking-[0.15em] font-bold leading-relaxed">Inventory</label>
                          </div>
                          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 divide-x divide-blue-50">
                              <div className="p-4 flex items-center gap-4">
                                  <span className="text-[9px] text-blue-300 uppercase tracking-widest">Price</span>
                                  <input 
                                      required
                                      type="number"
                                      value={newProduct.price}
                                      onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                                      className="flex-1 bg-transparent px-2 py-3 outline-none text-sm font-bold text-blue-900 placeholder:text-blue-400/60"
                                      placeholder="0.00 TK"
                                  />
                              </div>
                              <div className="p-4 flex items-center gap-4">
                                  <span className="text-[9px] text-blue-300 uppercase tracking-widest">Stock</span>
                                  <input 
                                      required
                                      type="number"
                                      value={newProduct.stock}
                                      onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                                      className="flex-1 bg-transparent px-2 py-3 outline-none text-sm font-bold text-blue-900 placeholder:text-blue-400/60"
                                      placeholder="Quantity"
                                  />
                              </div>
                          </div>
                      </div>

                      {/* Row: Description */}
                      <div className="grid grid-cols-1 md:grid-cols-4 border-b border-blue-50">
                          <div className="md:col-span-1 bg-blue-50/20 p-6 flex items-start pt-8 border-r border-blue-50">
                              <label className="text-[10px] text-blue-700 uppercase tracking-[0.15em] font-bold leading-relaxed">Description</label>
                          </div>
                          <div className="md:col-span-3 p-4">
                              <textarea 
                                  required
                                  rows={6}
                                  value={newProduct.description}
                                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                                  className="w-full bg-transparent px-4 py-4 outline-none text-sm text-blue-800 leading-relaxed resize-none placeholder:text-blue-400/60 focus:bg-blue-50/10 rounded-lg"
                                  placeholder="Detail the technical aspects, materials, and benefits of the product..."
                              />
                          </div>
                      </div>

                      {/* Row: Action */}
                      <div className="bg-blue-50/10 p-8 flex justify-end">
                          <button 
                              type="submit" 
                              disabled={isCreatingProduct || isUploadingImage}
                              className="bg-blue-900 text-white px-12 py-4 rounded-lg text-[10px] uppercase tracking-[0.25em] font-bold shadow-lg shadow-blue-900/10 hover:bg-blue-800 active:scale-95 transition-all disabled:opacity-50"
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
