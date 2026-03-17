"use client";

import { useCreateTicketMutation, useGetMyTicketsQuery } from "@/modules/support/services/supportApi";
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";

export default function SupportPage() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const { data: ticketsData, refetch } = useGetMyTicketsQuery({});
  const [createTicket, { isLoading: isCreating }] = useCreateTicketMutation();

  useEffect(() => {
    if (ticketsData) console.log("Support - User Active Tickets:", ticketsData);
  }, [ticketsData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Submitting support ticket:", { subject, message });
      await createTicket({ subject, message }).unwrap();
      alert("Ticket deployed to support queue.");
      setSubject("");
      setMessage("");
      refetch();
    } catch (err) {
      console.error("Submission failed:", err);
    }
  };

  const tickets = ticketsData?.data?.tickets || [];

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar role="customer" />
      
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
              <h1 className="text-lg font-black tracking-tight mb-1 text-slate-900 uppercase">Operational Support</h1>
              <p className="text-slate-500 font-bold italic text-[10px] tracking-wide">Direct relay for technical assistance.</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
             <section>
                <h2 className="text-xs font-black mb-6 flex items-center gap-3 text-slate-900 uppercase">
                   <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                   </div>
                   Initialize Signal
                </h2>
                
                <form onSubmit={handleSubmit} className="bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm space-y-6">
                   <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Case Subject</label>
                      <input 
                         required
                         value={subject}
                         onChange={(e) => setSubject(e.target.value)}
                         placeholder="e.g., SHIPMENT_DELAY"
                         className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3.5 focus:border-indigo-500 outline-none font-black text-xs uppercase tracking-tight"
                      />
                   </div>
                   <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Detailed Log</label>
                      <textarea 
                         required
                         value={message}
                         onChange={(e) => setMessage(e.target.value)}
                         placeholder="Provide specific details..."
                         className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 min-h-[140px] focus:border-indigo-500 outline-none font-bold text-slate-700 text-xs shadow-inner"
                      />
                   </div>
                   <button 
                    disabled={isCreating}
                    className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-indigo-600/20 text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all active:scale-95"
                   >Deploy Signal</button>
                </form>
             </section>

             <section className="text-slate-900">
                <h2 className="text-xs font-black mb-8 border-l-2 border-indigo-600 pl-3 uppercase tracking-tighter">Active Signals</h2>
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                   {tickets.length > 0 ? tickets.map((t: any) => (
                      <div key={t._id} className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-indigo-600/30 transition-all shadow-sm group">
                         <div className="flex justify-between items-center mb-4">
                            <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">ID: {t._id.slice(-6).toUpperCase()}</p>
                            <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                               t.status === 'Open' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-400'
                            }`}>{t.status}</span>
                         </div>
                         <h3 className="font-black text-sm text-slate-900 uppercase tracking-tight mb-2 leading-none">{t.subject}</h3>
                         <p className="text-slate-500 text-[10px] font-bold leading-relaxed mb-4 line-clamp-2">{t.message}</p>
                         <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                            <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest italic">{new Date(t.createdAt).toLocaleDateString()}</span>
                            <button className="text-[9px] font-black text-indigo-600 hover:underline uppercase tracking-widest">View Relay</button>
                         </div>
                      </div>
                   )) : (
                      <div className="text-center py-20 bg-white border border-dashed border-slate-200 rounded-[3rem]">
                         <p className="text-slate-400 font-bold uppercase tracking-widest text-xs italic">No active support signals found.</p>
                      </div>
                   )}
                </div>
             </section>
          </div>
        </div>
      </main>
    </div>
  );
}
