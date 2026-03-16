"use client";

import { useCheckoutMutation, useGetCartQuery } from "@/modules/shopping/services/shoppingApi";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CheckoutPage() {
  const { data: cartData } = useGetCartQuery({});
  const [checkout, { isLoading }] = useCheckoutMutation();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    address: "",
    city: "Dhaka",
    phone: ""
  });

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await checkout({ 
        subtotal: cartData?.data?.total,
        deliveryCharge: 0,
        address: formData.address,
        city: formData.city,
        phone: formData.phone
      }).unwrap();
      alert("Order placed successfully!");
      router.push("/");
    } catch (err) {
      console.error("Order failed:", err);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-black mb-12 tracking-tight">Checkout</h1>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Shipping Info */}
          <div className="space-y-10">
            <section>
               <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm">1</span>
                  Shipping Information
               </h2>
               <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase mb-2 ml-1">Delivery Address</label>
                    <textarea 
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 min-h-[120px] focus:border-indigo-500 transition-colors outline-none" 
                      placeholder="House, Street, Area..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-xs font-black text-slate-500 uppercase mb-2 ml-1">City</label>
                        <select 
                          value={formData.city}
                          onChange={(e) => setFormData({...formData, city: e.target.value})}
                          className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 focus:border-indigo-500 outline-none"
                        >
                           <option>Dhaka</option>
                           <option>Chittagong</option>
                           <option>Sylhet</option>
                        </select>
                     </div>
                     <div>
                        <label className="block text-xs font-black text-slate-500 uppercase mb-2 ml-1">Phone Number</label>
                        <input 
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          type="text" 
                          className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 focus:border-indigo-500 outline-none" 
                          placeholder="017XXXXXXXX"
                        />
                     </div>
                  </div>
               </div>
            </section>

            <section>
               <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm">2</span>
                  Payment Method
               </h2>
               <div className="bg-slate-900 border border-indigo-600/50 p-6 rounded-3xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-indigo-600/20 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                     </div>
                     <div>
                        <p className="font-bold text-white">Cash on Delivery</p>
                        <p className="text-xs text-slate-500">Pay when you receive the order</p>
                     </div>
                  </div>
                  <div className="w-6 h-6 rounded-full border-4 border-indigo-600 bg-white" />
               </div>
            </section>
          </div>

          {/* Order Review */}
          <div className="bg-slate-900/50 border border-slate-800 p-10 rounded-[3rem]">
             <h2 className="text-2xl font-black mb-8">Review Order</h2>
             <div className="space-y-6 mb-10 pb-8 border-b border-slate-800 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                {cartData?.data?.items?.map((item: any) => (
                  <div key={item._id} className="flex justify-between items-center">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-800 rounded-lg overflow-hidden">
                           <img src={item.productId?.images?.[0]?.url} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                           <p className="font-bold text-sm line-clamp-1">{item.productId?.name}</p>
                           <p className="text-xs text-slate-500">x{item.quantity}</p>
                        </div>
                     </div>
                     <span className="font-bold text-sm">{item.price * item.quantity} TK</span>
                  </div>
                ))}
             </div>

             <div className="space-y-4 mb-10">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span className="text-white font-bold">{cartData?.data?.total} TK</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Delivery Charge</span>
                  <span className="text-white font-bold">0 TK</span>
                </div>
                <div className="flex justify-between text-2xl font-black pt-4 border-t border-slate-800">
                  <span>Grand Total</span>
                  <span className="text-indigo-500">{cartData?.data?.total} TK</span>
                </div>
             </div>

             <button 
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 rounded-3xl shadow-2xl shadow-indigo-600/30 transition-all active:scale-95 disabled:opacity-50"
             >
                {isLoading ? "Processing..." : `Confirm Order - ${cartData?.data?.total} TK`}
             </button>
             <p className="text-center mt-6 text-xs text-slate-500 font-medium italic">By confirming, you agree to our Terms & Conditions.</p>
          </div>
        </form>
      </div>
    </main>
  );
}
