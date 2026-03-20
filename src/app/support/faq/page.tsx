"use client";

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-4xl mx-auto py-20 px-8">
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-8">Frequently Asked Questions</h1>
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-bold text-slate-900 uppercase mb-2">How do I track my order?</h3>
            <p className="text-slate-600">You can track your order in the 'Orders' section of your dashboard.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 uppercase mb-2">What is the return policy?</h3>
            <p className="text-slate-600">We offer a 30-day return policy for most items. Please check the returns section for more details.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 uppercase mb-2">How can I contact support?</h3>
            <p className="text-slate-600">You can contact us through the 'Support' page on our website or by emailing support@mallx.com.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
