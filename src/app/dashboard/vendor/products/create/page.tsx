"use client";

import { useGetMeQuery } from "@/modules/identity/services/authApi";
import { useGetShopDetailsQuery } from "@/modules/business/services/businessApi";
import { useCreateProductMutation, useGetCategoriesQuery, useUploadProductImageMutation } from "@/modules/shopping/services/productApi";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CATEGORY_FIELDS } from "@/modules/catalog/constants/categoryFields";
import { 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  FileText, 
  Tag, 
  Package, 
  Truck, 
  ShieldCheck, 
  ChevronDown, 
  Info,
  DollarSign,
  Layers,
  Activity
} from "lucide-react";

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
    categoryId: "",
    brand: "",
    sku: "",
    weight: "",
    warranty: "",
    dimensions: {
      length: "",
      width: "",
      height: ""
    },
    type: "unisex"
  });
  const [dynamicAttributes, setDynamicAttributes] = useState<Record<string, string>>({});

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isAudienceOpen, setIsAudienceOpen] = useState(false);
  const [isWarrantyCustom, setIsWarrantyCustom] = useState(false);

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
    if (!newProduct.name || !newProduct.price || !newProduct.categoryId || !newProduct.type) {
        alert("Please fill in all required fields: Name, Price, Category, and Audience.");
        return;
    }
    
    try {
      const payload = {
        ...newProduct,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
        vendorId,
        brand: newProduct.brand,
        sku: newProduct.sku,
        weight: Number(newProduct.weight),
        warranty: newProduct.warranty,
        dimensions: {
          length: Number(newProduct.dimensions.length),
          width: Number(newProduct.dimensions.width),
          height: Number(newProduct.dimensions.height)
        },
        attributes: Object.entries(dynamicAttributes).map(([key, value]) => ({
            key,
            value
        }))
      };
      const result = await createProduct(payload).unwrap();
      const productId = result.data.product._id;

      let uploadFailures = 0;
      // Sequentially upload all selected images
      if (selectedImages.length > 0) {
        for (let i = 0; i < selectedImages.length; i++) {
          try {
            const formData = new FormData();
            formData.append("image", selectedImages[i]);
            formData.append("isPrimary", i === 0 ? "true" : "false"); // First image is primary
            await uploadProductImage({ productId, formData }).unwrap();
          } catch (imgErr) {
            console.error("Single image upload failed:", imgErr);
            uploadFailures++;
          }
        }
      }

      if (uploadFailures > 0) {
        alert(`Product entry created, but ${uploadFailures} images failed to upload. Check if your Storage Server (MinIO) is running.`);
      } else {
        alert("Product created successfully! Awaiting admin approval.");
      }
      router.push("/dashboard/vendor/products");
    } catch (err: any) {
      console.error("Product creation failed:", err);
      const errorMsg = err.data?.message || err.error || "Creation failed. Please try again.";
      alert(`Error: ${errorMsg}`);
    }
  };

  if (isUserLoading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const categories = categoriesData?.data || [];
  const selectedCategoryName = categories.find((c: any) => c._id === newProduct.categoryId)?.name || "";
  const extraFields = CATEGORY_FIELDS[selectedCategoryName] || [];

  return (
    <div className="max-w-[1200px] mx-auto py-10 px-4">


       <form onSubmit={handleCreateProduct}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
             
             {/* Left Column: Core Data (8 Units) */}
             <div className="lg:col-span-8 space-y-8">
                
                {/* 01. Visual Assets Module */}
                <div className="bg-white border border-slate-300 rounded-2xl p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center">
                                <ImageIcon size={16} />
                            </div>
                            <h4 className="text-[11px] text-black uppercase tracking-[0.2em] font-semibold">01. Product Media</h4>
                        </div>
                        <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">{selectedImages.length} / 4 Slots Used</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        {/* Hero/Main Image Slot */}
                        <div className="md:col-span-8 group relative aspect-square">
                            <div className={`w-full h-full bg-slate-50 border border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center overflow-hidden transition-all duration-500 ${imagePreviews[0] ? 'border-none ring-1 ring-slate-200 shadow-2xl' : 'hover:bg-slate-100 hover:border-slate-400'}`}>
                                {imagePreviews[0] ? (
                                    <>
                                        <img src={imagePreviews[0]} className="w-full h-full object-cover" alt="Hero View" />
                                        <div className="absolute top-6 left-6 px-4 py-2 bg-black/90 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl">
                                            <p className="text-[8px] text-white uppercase tracking-[0.3em] font-black">Main Exhibition</p>
                                        </div>
                                        <button 
                                            type="button"
                                            onClick={() => removeImage(0)}
                                            className="absolute top-6 right-6 w-12 h-12 bg-white/90 backdrop-blur shadow-2xl rounded-2xl flex items-center justify-center text-slate-400 hover:text-red-500 transition-all scale-0 group-hover:scale-100 active:scale-90"
                                        ><Trash2 size={18} /></button>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center text-center px-10">
                                        <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-xl mb-6 group-hover:scale-110 transition-transform duration-500">
                                            <Plus size={24} className="text-slate-300" />
                                        </div>
                                        <p className="text-[10px] text-slate-900 uppercase tracking-[0.3em] font-black mb-2">Upload Hero Image</p>
                                        <p className="text-[8px] text-slate-400 uppercase tracking-widest leading-relaxed">High resolution 4:3 ratio recommended <br/> (Maximum 5MB per image)</p>
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

                        {/* Secondary Angles Grid */}
                        <div className="md:col-span-4 grid grid-cols-1 grid-rows-3 gap-4">
                            {[1, 2, 3].map((index) => (
                                <div key={index} className="relative group aspect-square md:aspect-auto">
                                    <div className={`w-full h-full bg-slate-50 border border-dashed border-slate-300 rounded-2xl flex items-center justify-center overflow-hidden transition-all duration-500 ${imagePreviews[index] ? 'border-none ring-1 ring-slate-200 shadow-xl' : 'hover:bg-slate-100'}`}>
                                        {imagePreviews[index] ? (
                                            <>
                                                <img src={imagePreviews[index]} className="w-full h-full object-cover" alt={`Angle ${index}`} />
                                                <button 
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur rounded-xl shadow-xl flex items-center justify-center text-slate-400 hover:text-red-500 scale-0 group-hover:scale-100 transition-all active:scale-90"
                                                ><Trash2 size={14} /></button>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-2 h-2 bg-slate-200 rounded-full group-hover:scale-125 transition-transform" />
                                                <p className="text-[8px] text-slate-400 uppercase tracking-widest font-black">Angle {index}</p>
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

                {/* 02. General Specifications Module */}
                <div className="bg-white border border-slate-300 rounded-2xl p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center">
                            <FileText size={16} />
                        </div>
                        <h4 className="text-[11px] text-black uppercase tracking-[0.2em] font-semibold">02. Core Identity</h4>
                        <div className="h-[1px] flex-1 bg-slate-50"></div>
                    </div>

                    <div className="space-y-12">
                        {/* Field: Name */}
                        <div className="group">
                            <div className="flex items-center gap-2 mb-4">
                                <Tag size={12} className="text-slate-400" />
                                <label className="text-[9px] text-slate-500 uppercase tracking-[0.25em] font-bold group-focus-within:text-black transition-all">Product Name</label>
                            </div>
                            <input 
                                required
                                type="text"
                                value={newProduct.name}
                                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-6 py-4 outline-none text-base text-black font-semibold placeholder:text-slate-300 focus:border-black focus:bg-white transition-all shadow-sm"
                                placeholder="Enter official product name"
                            />
                        </div>

                        {/* Field: Description */}
                        <div className="group">
                            <div className="flex items-center gap-2 mb-4">
                                <Info size={12} className="text-slate-400" />
                                <label className="text-[9px] text-slate-500 uppercase tracking-[0.25em] font-bold group-focus-within:text-black transition-all">Product Narrative</label>
                            </div>
                            <textarea 
                                required
                                rows={5}
                                value={newProduct.description}
                                onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-6 py-4 outline-none text-sm text-black font-medium leading-[1.8] placeholder:text-slate-300 focus:border-black focus:bg-white transition-all resize-none shadow-sm"
                                placeholder="Describe the aesthetic, material properties, and functional utility..."
                            />
                        </div>

                        {/* Brand & SKU */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="group">
                                <div className="flex items-center gap-2 mb-4">
                                    <Layers size={12} className="text-slate-400" />
                                    <label className="text-[9px] text-slate-500 uppercase tracking-[0.25em] font-bold group-focus-within:text-black transition-all">Brand</label>
                                </div>
                                <input 
                                    type="text"
                                    value={newProduct.brand}
                                    onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})}
                                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-6 py-4 outline-none text-sm text-black font-semibold placeholder:text-slate-300 focus:border-black focus:bg-white transition-all shadow-sm"
                                    placeholder="e.g. Apple, Nike"
                                />
                            </div>
                            <div className="group">
                                <div className="flex items-center gap-2 mb-4">
                                    <Package size={12} className="text-slate-400" />
                                    <label className="text-[9px] text-slate-500 uppercase tracking-[0.25em] font-bold group-focus-within:text-black transition-all">Parent SKU</label>
                                </div>
                                <input 
                                    type="text"
                                    value={newProduct.sku}
                                    onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
                                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-6 py-4 outline-none text-sm text-black font-semibold placeholder:text-slate-300 focus:border-black focus:bg-white transition-all shadow-sm"
                                    placeholder="e.g. MH-100-BLK"
                                />
                            </div>
                        </div>

                        {/* Logistics Section Header */}
                        <div className="flex items-center gap-3 pt-4">
                           <div className="w-6 h-[1px] bg-slate-200"></div>
                           <span className="text-[8px] text-slate-400 uppercase tracking-[0.3em] font-black">Logistics & Physical Specs</span>
                           <div className="flex-1 h-[1px] bg-slate-200"></div>
                        </div>

                        {/* Logistics: Weight & Dimensions */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {[
                                { label: 'Weight (KG)', key: 'weight', icon: Truck },
                                { label: 'Len (CM)', key: 'length', isDim: true },
                                { label: 'Wid (CM)', key: 'width', isDim: true },
                                { label: 'Hei (CM)', key: 'height', isDim: true },
                            ].map((field) => (
                                <div key={field.key} className="group">
                                    <label className="text-[8px] text-slate-400 uppercase tracking-widest font-bold mb-3 block">{field.label}</label>
                                    <input 
                                        type="number"
                                        step="0.01"
                                        value={field.isDim ? (newProduct.dimensions as any)[field.key] : (newProduct as any)[field.key]}
                                        onChange={(e) => {
                                            if (field.isDim) {
                                                setNewProduct({...newProduct, dimensions: {...newProduct.dimensions, [field.key]: e.target.value}});
                                            } else {
                                                setNewProduct({...newProduct, [field.key]: e.target.value});
                                            }
                                        }}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none text-sm text-black font-bold focus:border-black transition-all"
                                        placeholder="0.0"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Warranty Terms */}
                        <div className="group">
                            <div className="flex items-center gap-2 mb-4">
                                <ShieldCheck size={12} className="text-slate-400" />
                                <label className="text-[9px] text-slate-500 uppercase tracking-[0.25em] font-bold group-focus-within:text-black transition-all">Warranty Terms</label>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <select 
                                    value={isWarrantyCustom ? 'Custom' : (newProduct.warranty || '')}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (val === 'Custom') {
                                            setIsWarrantyCustom(true);
                                            setNewProduct({...newProduct, warranty: ""});
                                        } else {
                                            setIsWarrantyCustom(false);
                                            setNewProduct({...newProduct, warranty: val});
                                        }
                                    }}
                                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-6 py-4 outline-none text-sm text-black font-semibold focus:border-black focus:bg-white transition-all shadow-sm appearance-none cursor-pointer"
                                >
                                    <option value="" disabled>Select Warranty Term</option>
                                    <option value="No Warranty">No Warranty</option>
                                    <option value="6 Months Local Warranty">6 Months Local Warranty</option>
                                    <option value="1 Year Local Warranty">1 Year Local Warranty</option>
                                    <option value="2 Years Local Warranty">2 Years Local Warranty</option>
                                    <option value="Lifetime Warranty">Lifetime Warranty</option>
                                    <option value="Custom">Custom / Other</option>
                                </select>

                                {isWarrantyCustom && (
                                    <div className="relative flex-1 group/custom">
                                        <input 
                                            type="text"
                                            value={newProduct.warranty}
                                            onChange={(e) => setNewProduct({...newProduct, warranty: e.target.value})}
                                            className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-6 py-4 outline-none text-sm text-black font-semibold placeholder:text-slate-300 focus:border-black focus:bg-white transition-all shadow-sm animate-in fade-in slide-in-from-left-2 duration-300 pr-12"
                                            placeholder="Type custom warranty terms..."
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => {
                                                setIsWarrantyCustom(false);
                                                setNewProduct({...newProduct, warranty: ""});
                                            }}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-red-500 transition-colors p-1"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dynamic Category Specifications Module */}
                {extraFields.length > 0 && (
                    <div className="bg-white border border-slate-300 rounded-xl p-8 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="flex items-center gap-3 mb-10">
                            <h4 className="text-[11px] text-black uppercase tracking-[0.2em] font-semibold">03. Category Specifications</h4>
                            <div className="h-[1px] flex-1 bg-slate-50"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {extraFields.map((field) => (
                                <div key={field.name} className="group">
                                    <label className="text-[9px] text-slate-500 uppercase tracking-[0.25em] font-medium mb-4 block group-focus-within:text-black transition-all">
                                        {field.label}
                                    </label>
                                    
                                    {field.type === 'select' ? (
                                        <select
                                            value={dynamicAttributes[field.name] || ""}
                                            onChange={(e) => setDynamicAttributes({...dynamicAttributes, [field.name]: e.target.value})}
                                            className="w-full bg-[#fcfcfc] border-b-2 border-slate-200 px-0 py-3 outline-none text-base text-black font-semibold focus:border-black transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="" disabled>{field.placeholder || `Select ${field.label}`}</option>
                                            {field.options?.map(opt => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            type={field.type}
                                            value={dynamicAttributes[field.name] || ""}
                                            onChange={(e) => setDynamicAttributes({...dynamicAttributes, [field.name]: e.target.value})}
                                            className="w-full bg-[#fcfcfc] border-b-2 border-slate-200 px-0 py-3 outline-none text-base text-black font-semibold placeholder:text-slate-300 focus:border-black transition-all"
                                            placeholder={field.placeholder}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
             </div>

             {/* Right Column: Taxonomy & Pricing (4 Units) */}
             <div className="lg:col-span-4 space-y-8">
                
                {/* Taxonomy & Audience Module */}
                <div className="bg-white border border-slate-300 rounded-xl p-8 shadow-sm">
                    <h4 className="text-[11px] text-black uppercase tracking-[0.2em] font-semibold mb-8">04. Taxonomy & Audience</h4>
                    
                    <div className="space-y-8">
                        {/* Category Selection */}
                        <div className="relative">
                            <label className="text-[9px] text-slate-500 uppercase tracking-[0.25em] font-medium mb-3 block">Category Domain</label>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsCategoryOpen(!isCategoryOpen);
                                    setIsAudienceOpen(false);
                                }}
                                className="w-full bg-slate-50 border border-slate-300 px-5 py-4 rounded-xl flex items-center justify-between transition-all hover:bg-slate-100 group"
                            >
                                <span className={`text-[10px] uppercase tracking-widest ${newProduct.categoryId ? 'text-black font-bold' : 'text-slate-400 font-medium'}`}>
                                    {categories.find((c: any) => c._id === newProduct.categoryId)?.name || "Select Category"}
                                </span>
                                <svg className={`w-4 h-4 text-slate-400 transition-transform duration-500 ${isCategoryOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {isCategoryOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setIsCategoryOpen(false)} />
                                    <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-slate-300 rounded-2xl shadow-2xl z-20 overflow-hidden py-3 animate-in fade-in slide-in-from-top-4 duration-300">
                                        <div className="max-h-72 overflow-y-auto">
                                            {categories.map((cat: any) => (
                                                <button
                                                    key={cat._id}
                                                    type="button"
                                                    onClick={() => {
                                                        setNewProduct({...newProduct, categoryId: cat._id});
                                                        setIsCategoryOpen(false);
                                                    }}
                                                    className={`w-full px-6 py-4 text-left text-[9px] uppercase tracking-[0.3em] font-bold transition-all hover:bg-black hover:text-white flex items-center justify-between group ${newProduct.categoryId === cat._id ? 'bg-slate-50 text-black' : 'text-slate-400 font-medium'}`}
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

                        {/* Audience Selection (Men/Women/etc) */}
                        <div className="relative">
                            <label className="text-[9px] text-slate-500 uppercase tracking-[0.25em] font-medium mb-3 block">Product Audience</label>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsAudienceOpen(!isAudienceOpen);
                                    setIsCategoryOpen(false);
                                }}
                                className="w-full bg-slate-50 border border-slate-300 px-5 py-4 rounded-xl flex items-center justify-between transition-all hover:bg-slate-100 group"
                            >
                                <span className={`text-[10px] uppercase tracking-widest text-black font-bold`}>
                                    {newProduct.type === 'boysgirls' ? 'Boys & Girls' : newProduct.type.charAt(0).toUpperCase() + newProduct.type.slice(1)}
                                </span>
                                <svg className={`w-4 h-4 text-slate-400 transition-transform duration-500 ${isAudienceOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {isAudienceOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setIsAudienceOpen(false)} />
                                    <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-slate-300 rounded-2xl shadow-2xl z-20 overflow-hidden py-3 animate-in fade-in slide-in-from-top-4 duration-300">
                                        {[
                                            { id: 'men', label: 'Men' },
                                            { id: 'women', label: 'Women' },
                                            { id: 'kids', label: 'Kids' },
                                            { id: 'boysgirls', label: 'Boys & Girls' },
                                            { id: 'unisex', label: 'Unisex' }
                                        ].map((audience) => (
                                            <button
                                                key={audience.id}
                                                type="button"
                                                onClick={() => {
                                                    setNewProduct({...newProduct, type: audience.id});
                                                    setIsAudienceOpen(false);
                                                }}
                                                className={`w-full px-6 py-4 text-left text-[9px] uppercase tracking-[0.3em] font-bold transition-all hover:bg-black hover:text-white flex items-center justify-between group ${newProduct.type === audience.id ? 'bg-slate-50 text-black' : 'text-slate-400 font-medium'}`}
                                            >
                                                {audience.label}
                                                {newProduct.type === audience.id && (
                                                    <div className="w-1.5 h-1.5 bg-black rounded-full" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Financial Module */}
                <div className="bg-slate-900 text-white rounded-xl p-8 shadow-2xl shadow-slate-900/20">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-white/10 transition-colors" />
                    
                    <div className="flex items-center gap-3 mb-10 relative">
                       <div className="w-8 h-8 bg-white/10 backdrop-blur-xl text-white rounded-lg flex items-center justify-center border border-white/10">
                           <DollarSign size={16} />
                       </div>
                       <h4 className="text-[11px] text-white/50 uppercase tracking-[0.2em] font-semibold">05. Commercial Meta</h4>
                    </div>
                    
                    <div className="space-y-12 relative">
                        <div className="group/field">
                            <label className="text-[8px] text-white/40 uppercase tracking-[0.3em] font-black mb-4 block group-focus-within/field:text-white transition-all">Product Listing Price (BDT)</label>
                            <div className="flex items-end gap-3 border-b border-white/10 pb-4 focus-within:border-white transition-all">
                                <span className="text-2xl font-black opacity-20">৳</span>
                                <input 
                                    required
                                    type="number"
                                    value={newProduct.price}
                                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                                    className="bg-transparent w-full text-4xl font-black outline-none placeholder:text-white/5"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        <div className="group/field">
                            <label className="text-[8px] text-white/40 uppercase tracking-[0.3em] font-black mb-4 block group-focus-within/field:text-white transition-all">Stock Volume (Units)</label>
                            <div className="flex items-end gap-3 border-b border-white/20 pb-4 focus-within:border-white transition-all">
                                <span className="text-2xl font-black opacity-20">#</span>
                                <input 
                                    required
                                    type="number"
                                    value={newProduct.stock}
                                    onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                                    className="bg-transparent w-full text-4xl font-black outline-none placeholder:text-white/5"
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        <div className="pt-6">
                            <button 
                                type="submit" 
                                disabled={isCreatingProduct || isUploadingImage}
                                className="w-full bg-white text-slate-900 font-black py-6 rounded-2xl text-[11px] uppercase tracking-[0.4em] shadow-2xl hover:bg-slate-100 transition-all active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed group/btn overflow-hidden relative"
                            >
                                <span className="relative z-10">{isCreatingProduct || isUploadingImage ? "Syncing Logic..." : "Publish To MallX"}</span>
                                <div className="absolute inset-0 bg-slate-100 transform translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                            </button>
                            <div className="flex items-start gap-3 mt-8 opacity-40">
                               <Activity size={10} className="mt-1 flex-shrink-0" />
                               <p className="text-[7px] uppercase tracking-widest text-center leading-relaxed">By pushing this asset, you confirm adherence to our international marketplace standards & logistics protocols.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Tools */}
                <div className="bg-white border border-slate-300 rounded-xl p-6 flex items-center justify-between shadow-sm">
                    <div className="flex -space-x-2">
                        {[1,2,3].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-400">A</div>
                        ))}
                    </div>
                    <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Collaborator View</span>
                </div>

             </div>
          </div>
       </form>
    </div>
  );
}
