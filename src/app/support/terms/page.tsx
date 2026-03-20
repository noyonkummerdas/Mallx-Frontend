"use client";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-4xl mx-auto py-20 px-8">
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-8">Terms & Conditions</h1>
        <div className="space-y-6 text-slate-600 leading-relaxed">
          <p>Welcome to MallX. By accessing our platform, you agree to comply with and be bound by the following terms and conditions.</p>
          <h2 className="text-xl font-bold text-slate-900 uppercase">1. Acceptance of Terms</h2>
          <p>By using MallX, you agree to these terms. If you do not agree, please do not use the platform.</p>
          <h2 className="text-xl font-bold text-slate-900 uppercase">2. Use of License</h2>
          <p>Permission is granted to temporarily download one copy of the materials on MallX's website for personal, non-commercial transitory viewing only.</p>
          <h2 className="text-xl font-bold text-slate-900 uppercase">3. Disclaimer</h2>
          <p>The materials on MallX's website are provided on an 'as is' basis. MallX makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
        </div>
      </main>
    </div>
  );
}
