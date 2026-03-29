"use client";

import { useCheckoutMutation, useGetCartQuery } from "@/modules/shopping/services/shoppingApi";
import { useGetAddressesQuery, useAddAddressMutation } from "@/modules/identity/services/authApi";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: cartData } = useGetCartQuery({});
  const { data: addressData } = useGetAddressesQuery({});
  const [addAddress, { isLoading: isAddingAddress }] = useAddAddressMutation();
  const [checkout, { isLoading: isCheckingOut }] = useCheckoutMutation();
  
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [area, setArea] = useState("Dhaka");
  const [phone, setPhone] = useState("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    addressLine: "",
    city: "Dhaka",
    zip: "",
    country: "Bangladesh"
  });

  useEffect(() => {
    if (cartData) console.log("Checkout - Cart Data:", cartData);
    if (addressData) {
      console.log("Checkout - Addresses:", addressData);
      const addresses = addressData.data?.addresses || [];
      if (addresses.length > 0) {
        if (!selectedAddress) {
          setSelectedAddress(addresses[0]._id);
          // Auto-detect area for preferred address
          setArea(addresses[0].city === "Dhaka" ? "Dhaka" : "Outside");
        } else {
          // Update area if selected address changes
          const current = addresses.find((a: any) => a._id === selectedAddress);
          if (current) {
            setArea(current.city === "Dhaka" ? "Dhaka" : "Outside");
          }
        }
      }
    }
  }, [cartData, addressData, selectedAddress]);

  const subtotal = cartData?.data?.total || 0;
  
  // Dynamic Delivery Logic (Matching cart/backend)
  const calculateDelivery = () => {
    if (subtotal >= 2000) return 0;
    return area === "Dhaka" ? 60 : 120;
  };

  const deliveryCharge = calculateDelivery();
  const grandTotal = subtotal + deliveryCharge;

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Adding new address:", newAddress);
      await addAddress(newAddress).unwrap();
      setShowAddressForm(false);
      alert("Address added!");
    } catch (err) {
      console.error("Failed to add address:", err);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAddress) {
      alert("Please select or add a delivery address");
      return;
    }
    try {
      const orderPayload = { 
        subtotal,
        deliveryCharge,
        addressId: selectedAddress,
        area,
        phone,
        paymentMethod: "COD"
      };
      console.log("Placing order with payload:", orderPayload);
      const result = await checkout(orderPayload).unwrap();
      console.log("Order result:", result);
      alert("Order placed successfully!");
      router.push("/orders");
    } catch (err) {
      console.error("Order failed:", err);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-base font-black mb-12 tracking-tight text-slate-900 uppercase">Finalize Order</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Shipping Info */}
          <div className="space-y-10">
            <section>
               <h2 className="text-base font-black mb-6 flex items-center gap-4">
                  <span className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-sm font-black text-white shadow-lg shadow-indigo-600/20">1</span>
                  Delivery Destination
               </h2>
               
               <div className="space-y-6">
                  {/* Address Selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {addressData?.data?.addresses?.map((addr: any) => (
                      <div 
                        key={addr._id}
                        onClick={() => setSelectedAddress(addr._id)}
                        className={`p-6 rounded-3xl border-2 transition-all cursor-pointer ${
                          selectedAddress === addr._id 
                          ? "border-indigo-600 bg-indigo-50 shadow-md" 
                          : "border-white bg-white hover:border-slate-200"
                        }`}
                      >
                         <p className="font-black text-sm text-slate-900 mb-1 uppercase tracking-tight">{addr.addressLine}</p>
                         <p className="text-sm text-slate-500 font-black uppercase tracking-widest">{addr.city}, {addr.zip}</p>
                      </div>
                    ))}
                    <button 
                      onClick={() => setShowAddressForm(true)}
                      className="p-6 rounded-3xl border-2 border-dashed border-slate-200 bg-transparent hover:bg-slate-50 transition-all flex flex-col items-center justify-center gap-2 group"
                    >
                       <svg className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                       <span className="text-sm font-black text-slate-400 uppercase tracking-widest group-hover:text-indigo-600">New Location</span>
                    </button>
                  </div>

                  {showAddressForm && (
                    <form onSubmit={handleAddAddress} className="bg-white border border-indigo-100 p-8 rounded-[2.5rem] animate-in slide-in-from-top-4 fade-in duration-300">
                       <h3 className="text-sm font-black text-indigo-600 uppercase tracking-widest mb-6 border-l-4 border-indigo-600 pl-4">Register New Address</h3>
                       <div className="space-y-4">
                          <input 
                            required
                            placeholder="Street / House Info"
                            value={newAddress.addressLine}
                            onChange={(e) => setNewAddress({...newAddress, addressLine: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none"
                          />
                          <div className="grid grid-cols-2 gap-4">
                             <input 
                               required
                               placeholder="City"
                               value={newAddress.city}
                               onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                               className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none"
                             />
                             <input 
                               required
                               placeholder="Zip Code"
                               value={newAddress.zip}
                               onChange={(e) => setNewAddress({...newAddress, zip: e.target.value})}
                               className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none"
                             />
                          </div>
                          <div className="flex gap-4 pt-2">
                             <button type="submit" disabled={isAddingAddress} className="flex-1 bg-indigo-600 text-white font-black py-3 rounded-xl text-sm uppercase tracking-widest shadow-lg shadow-indigo-600/20">Save</button>
                             <button type="button" onClick={() => setShowAddressForm(false)} className="flex-1 bg-slate-100 text-slate-500 font-black py-3 rounded-xl text-sm uppercase tracking-widest">Cancel</button>
                          </div>
                       </div>
                    </form>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Logistics Area</label>
                        <select 
                          value={area}
                          onChange={(e) => setArea(e.target.value)}
                          className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-6 py-4 outline-none font-black text-slate-700 shadow-sm cursor-not-allowed"
                          disabled
                        >
                           <option value="Dhaka">Inside Dhaka</option>
                           <option value="Outside">Outside Dhaka</option>
                        </select>
                        <p className="text-[10px] text-indigo-600 font-bold mt-1 uppercase tracking-tighter">Detected from address</p>
                     </div>
                     <div>
                        <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Contact Handset</label>
                        <input 
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          type="text" 
                          className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 focus:border-indigo-500 outline-none font-black shadow-sm" 
                          placeholder="01XXXXXXXXX"
                        />
                     </div>
                  </div>
               </div>
            </section>

            <section>
               <h2 className="text-base font-black mb-6 flex items-center gap-4">
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
                        <p className="text-sm text-slate-500 font-black">Pay upon successful item reception</p>
                     </div>
                  </div>
                  <div className="w-6 h-6 rounded-full border-4 border-indigo-600 bg-white shadow-inner" />
               </div>
            </section>
          </div>

          {/* Order Review */}
          <div className="bg-white border border-slate-200 p-10 rounded-[3rem] shadow-2xl shadow-slate-200/50">
             <h2 className="text-base font-black mb-8 border-b-4 border-black pb-4 tracking-tighter uppercase">Review Selection</h2>
             <div className="space-y-6 mb-10 pb-8 border-b border-slate-100 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                {cartData?.data?.items?.map((item: any) => (
                  <div key={item._id} className="flex justify-between items-center group">
                     <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 group-hover:border-indigo-200 transition-colors">
                           <img src={item.productId?.images?.[0]?.url} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                           <p className="font-black text-sm line-clamp-1 uppercase tracking-tight text-slate-900">{item.productId?.name}</p>
                           <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Qty: {item.quantity} · {item.variantId?.size}</p>
                        </div>
                     </div>
                     <span className="font-black text-sm text-slate-900">{(item.price * item.quantity).toLocaleString()} TK</span>
                  </div>
                ))}
             </div>

             <div className="space-y-4 mb-10">
                <div className="flex justify-between text-slate-500 font-black uppercase tracking-widest text-sm">
                  <span>Subtotal</span>
                  <span className="text-slate-900 font-black">{subtotal.toLocaleString()} TK</span>
                </div>
                <div className="flex justify-between text-slate-500 font-black uppercase tracking-widest text-sm">
                  <span>Logistics Fee</span>
                  <span className={deliveryCharge === 0 ? "text-green-600 font-black" : "text-slate-900 font-black"}>
                    {deliveryCharge === 0 ? "FREE" : `${deliveryCharge.toLocaleString()} TK`}
                  </span>
                </div>
                {subtotal >= 2000 && (
                   <div className="flex justify-between text-green-600 font-black uppercase tracking-widest text-sm bg-green-50 px-3 py-1 rounded-lg">
                      <span>Loyal Delivery Discount</span>
                      <span className="font-black">-{area === "Dhaka" ? "60" : "120"} TK</span>
                   </div>
                )}
                <div className="flex justify-between text-base font-black pt-6 border-t font-black border-slate-100 tracking-tighter">
                  <span className="text-slate-900 uppercase">Total pay</span>
                  <span className="text-indigo-600">{grandTotal.toLocaleString()} TK</span>
                </div>
             </div>

             <button 
                onClick={handlePlaceOrder}
                disabled={isCheckingOut}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-6 rounded-3xl shadow-2xl shadow-indigo-600/30 transition-all active:scale-95 disabled:opacity-50 uppercase tracking-widest text-sm"
             >
                {isCheckingOut ? "Connecting Systems..." : `Secure Order - ${grandTotal.toLocaleString()} TK`}
             </button>
             <p className="text-center mt-6 text-sm text-slate-400 font-black uppercase tracking-widest opacity-60 leading-relaxed">By placing this order, you agree to MallX's hyper-local delivery terms and platform safety protocols.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
