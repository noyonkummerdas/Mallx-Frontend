"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  const sections = [
    {
      id: "collection",
      title: "1. Data Collection",
      content: "We collect personal information that you provide to us, including your name, email address, shipping address, and payment information. We also automatically collect certain information when you visit MallX, such as your IP address and browsing behavior."
    },
    {
      id: "usage",
      title: "2. How We Use Data",
      content: "Your information allows us to process transactions, provide customer support, and personalize your shopping experience. We may also use your data to send platform updates and promotional offers, which you can opt-out of at any time."
    },
    {
      id: "sharing",
      title: "3. Information Sharing",
      content: "We do not sell your personal data. We only share information with third-party service providers (e.g., payment gateways, logistics partners) necessary to complete your orders and maintain our services."
    },
    {
      id: "security",
      title: "4. Security Protocols",
      content: "We implement industry-standard encryption and security protocols to protect your data from unauthorized access. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security."
    },
    {
      id: "cookies",
      title: "5. Cookies Policy",
      content: "MallX uses cookies to enhance your experience, remember your preferences, and analyze site traffic. You can manage cookie settings through your browser, though disabling them may limit certain site functionalities."
    }
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-100 pb-32">
      <header className="pt-24 pb-12 px-6 max-w-7xl mx-auto border-b border-slate-100 mb-16">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-blue-600 transition-all mb-8 group">
           <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Marketplace
        </Link>
        <h1 className="text-5xl font-bold tracking-tight text-slate-900 mb-4">Privacy Policy</h1>
        <p className="text-sm text-slate-400 font-medium tracking-tight">Version 1.1 • Published April 23, 2026</p>
      </header>

      <main className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-20">
          
          {/* Minimal Sticky Sidebar */}
          <aside className="lg:w-64 shrink-0 hidden lg:block">
            <nav className="sticky top-32 flex flex-col gap-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300 mb-4">On this page</span>
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className="text-left text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors py-1 block border-l-2 border-transparent hover:border-blue-600 pl-4"
                >
                  {section.title.split('. ')[1]}
                </button>
              ))}
            </nav>
          </aside>

          {/* Simple Elite Content */}
          <section className="flex-1 max-w-3xl space-y-16">
            <p className="text-lg text-slate-600 font-medium leading-relaxed">
              Your privacy is fundamental to us. This policy describes how we handle your personal data when you use our platform.
            </p>

            {sections.map((section) => (
              <div key={section.id} id={section.id} className="scroll-mt-32">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 tracking-tight">
                  {section.title}
                </h2>
                <p className="text-base text-slate-600 leading-relaxed font-medium">
                  {section.content}
                </p>
              </div>
            ))}

            <div className="pt-20 border-t border-slate-100">
               <div className="flex flex-col items-center text-center max-w-lg mx-auto">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Protecting your data is our priority.</h3>
                  <p className="text-slate-500 text-sm mb-8 font-medium">For any data-related requests or inquiries, reach out to our privacy desk.</p>
                  <Link href="mailto:privacy@mallx.com">
                    <button className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-slate-900/10">
                      Email Privacy Desk
                    </button>
                  </Link>
               </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
