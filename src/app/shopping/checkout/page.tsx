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
    <main className="min-h-screen bg-slate-50 text-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-black mb-12 tracking-tight text-slate-900">Finalize Order</h1>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Shipping Info */}
          <div className="space-y-10">
            <section>
               <h2 className="text-xl font-black mb-6 flex items-center gap-4">
                  <span className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-sm font-black text-white shadow-lg shadow-indigo-600/20">1</span>
                  Delivery Destination
               </h2>
               <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Precise Shipping Address</label>
                    <textarea 
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-3xl px-6 py-5 min-h-[140px] focus:border-indigo-500 transition-all outline-none font-medium shadow-sm" 
                      placeholder="Enter House #, Street, Block, and Area info..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Current City</label>
                        <select 
                          value={formData.city}
                          onChange={(e) => setFormData({...formData, city: e.target.value})}
                          className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 focus:border-indigo-500 outline-none font-bold text-slate-700 shadow-sm cursor-pointer"
                        >
                           <option>Dhaka</option>
                           <option>Chittagong</option>
                           <option>Sylhet</option>
                        </select>
                     </div>
                     <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Contact Handset</label>
                        <input 
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          type="text" 
                          className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 focus:border-indigo-500 outline-none font-bold shadow-sm" 
                          placeholder="01XXXXXXXXX"
                        />
                     </div>
                  </div>
               </div>
            </section>

            <section>
               <h2 className="text-xl font-black mb-6 flex items-center gap-4">
                  <span className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-sm font-black text-white shadow-lg shadow-indigo-600/20">2</span>
                  Preferred Payment
               </h2>
               <div className="bg-white border-2 border-indigo-600 p-8 rounded-[2.5rem] flex items-center justify-between shadow-xl shadow-indigo-600/5">
                  <div className="flex items-center gap-5">
                     <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100">
                        <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                     </div>
                     <div>
                        <p className="font-black text-slate-900 uppercase tracking-tight">Cash on Delivery</p>
                        <p className="text-xs text-slate-500 font-bold italic">Pay upon successful item reception</p>
                     </div>
                  </div>
                  <div className="w-6 h-6 rounded-full border-4 border-indigo-600 bg-white shadow-inner" />
               </div>
            </section>
          </div>

          {/* Order Review */}
          <div className="bg-white border border-slate-200 p-10 rounded-[3rem] shadow-2xl shadow-slate-200/50">
             <h2 className="text-2xl font-black mb-8 border-b border-slate-50 pb-4 tracking-tighter uppercase">Review Selection</h2>
             <div className="space-y-6 mb-10 pb-8 border-b border-slate-100 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                {cartData?.data?.items?.map((item: any) => (
                  <div key={item._id} className="flex justify-between items-center group">
                     <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 group-hover:border-indigo-200 transition-colors">
                           <img src={item.productId?.images?.[0]?.url} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                           <p className="font-black text-sm line-clamp-1 uppercase tracking-tight text-slate-900">{item.productId?.name}</p>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Qty: {item.quantity}</p>
                        </div>
                     </div>
                     <span className="font-black text-sm text-slate-900">{(item.price * item.quantity).toLocaleString()} TK</span>
                  </div>
                ))}
             </div>

             <div className="space-y-4 mb-10">
                <div className="flex justify-between text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                  <span>Subtotal</span>
                  <span className="text-slate-900 font-black">{(cartData?.data?.total || 0).toLocaleString()} TK</span>
                </div>
                <div className="flex justify-between text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                  <span>Logistics Fee</span>
                  <span className="text-green-600 font-black">0 TK</span>
                </div>
                <div className="flex justify-between text-3xl font-black pt-6 border-t border-slate-100 tracking-tighter">
                  <span className="text-slate-900">Total payable</span>
                  <span className="text-indigo-600">{(cartData?.data?.total || 0).toLocaleString()} TK</span>
                </div>
             </div>

             <button 
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-6 rounded-3xl shadow-2xl shadow-indigo-600/30 transition-all active:scale-95 disabled:opacity-50 uppercase tracking-widest text-sm"
             >
                {isLoading ? "Validating..." : `Approve & Order - ${(cartData?.data?.total || 0).toLocaleString()} TK`}
             </button>
             <p className="text-center mt-6 text-[10px] text-slate-400 font-bold uppercase tracking-widest italic opacity-60">Verified & Authenticated by MallX Systems.</p>
          </div>
        </form>
      </div>
    </main>
  );
}
