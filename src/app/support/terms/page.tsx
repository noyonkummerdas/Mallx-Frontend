"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  const sections = [
    {
      id: "acceptance",
      title: "1. Acceptance of Terms",
      content: "By accessing and using MallX Marketplace, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our platform."
    },
    {
      id: "accounts",
      title: "2. User Accounts",
      content: "To access certain features of the platform, you may be required to register for an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account."
    },
    {
      id: "rules",
      title: "3. Market Place Rules",
      content: "Buyers and Sellers must act in good faith. Sellers are responsible for the accuracy of their product listings, including pricing, descriptions, and availability. MallX reserves the right to remove any content that violates our community standards."
    },
    {
      id: "payments",
      title: "4. Payments & Refunds",
      content: "Payments are processed securely through our authorized payment partners. Refunds are subject to our Return Policy and the specific terms provided by the vendor. MallX acts as an intermediary for transactions but is not the direct seller of third-party products."
    },
    {
      id: "liability",
      title: "5. Limitation of Liability",
      content: "MallX provides the platform on an 'as is' and 'as available' basis. We are not liable for any indirect, incidental, or consequential damages arising from your use of the service or any transactions conducted through the marketplace."
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
        <h1 className="text-5xl font-bold tracking-tight text-slate-900 mb-4">Terms & Conditions</h1>
        <p className="text-sm text-slate-400 font-medium tracking-tight">Version 1.2 • Published April 23, 2026</p>
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
              Welcome to MallX. These terms and conditions outline the rules and regulations for the use of our marketplace platform.
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
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Need help understanding our terms?</h3>
                  <p className="text-slate-500 text-sm mb-8 font-medium">If you have any questions about these terms, please contact our support team.</p>
                  <Link href="/support">
                    <button className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-slate-900/10">
                      Contact Legal Support
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
