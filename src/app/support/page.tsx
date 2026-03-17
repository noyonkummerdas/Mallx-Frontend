"use client";

import { useCreateTicketMutation, useGetMyTicketsQuery } from "@/modules/support/services/supportApi";
import { useState, useEffect } from "react";

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
    <main className="min-h-screen bg-slate-50 text-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
            <h1 className="text-4xl font-black tracking-tight mb-2 text-slate-900 uppercase">Operational Support</h1>
            <p className="text-slate-500 font-bold italic text-sm tracking-wide">Direct data relay to MallX resolution engineers.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
           <section>
              <h2 className="text-xl font-black mb-10 flex items-center gap-4">
                 <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                 </div>
                 Initialize Signal
              </h2>
              
              <form onSubmit={handleSubmit} className="bg-white border border-slate-200 p-10 rounded-[3rem] shadow-sm space-y-8">
                 <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Case Subject</label>
                    <input 
                       required
                       value={subject}
                       onChange={(e) => setSubject(e.target.value)}
                       placeholder="e.g., SHIPMENT_DELAY, PAYMENT_AUDIT"
                       className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:border-indigo-500 outline-none font-black text-sm uppercase tracking-tight"
                    />
                 </div>
                 <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Detailed Log</label>
                    <textarea 
                       required
                       value={message}
                       onChange={(e) => setMessage(e.target.value)}
                       placeholder="Provide specific details for rapid triage..."
                       className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] px-6 py-5 min-h-[160px] focus:border-indigo-500 outline-none font-bold text-slate-700 shadow-inner"
                    />
                 </div>
                 <button 
                  disabled={isCreating}
                  className="w-full bg-indigo-600 text-white font-black py-5 rounded-3xl shadow-2xl shadow-indigo-600/30 text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all active:scale-95"
                 >Deploy Ticket</button>
              </form>
           </section>

           <section>
              <h2 className="text-xl font-black mb-10 border-l-4 border-indigo-600 pl-4 uppercase tracking-tighter text-slate-900">Active Signals</h2>
              <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                 {tickets.length > 0 ? tickets.map((t: any) => (
                    <div key={t._id} className="p-8 rounded-[2.5rem] bg-white border border-slate-200 hover:border-indigo-600/30 transition-all shadow-sm group">
                       <div className="flex justify-between items-center mb-6">
                          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">ID: {t._id.slice(-6).toUpperCase()}</p>
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                             t.status === 'Open' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-400'
                          }`}>{t.status}</span>
                       </div>
                       <h3 className="font-black text-lg text-slate-900 uppercase tracking-tight mb-2 leading-none">{t.subject}</h3>
                       <p className="text-slate-500 text-xs font-bold leading-relaxed mb-6 line-clamp-2">{t.message}</p>
                       <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                          <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic">{new Date(t.createdAt).toLocaleDateString()}</span>
                          <button className="text-[10px] font-black text-indigo-600 hover:underline uppercase tracking-widest">View Response Relay</button>
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
  );
}
