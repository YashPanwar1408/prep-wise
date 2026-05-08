import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500/30">
      <nav className="flex justify-center pt-6">
        <div className="w-full max-w-7xl py-4 px-6">
          <Link href="/" className="font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-purple-400 text-2xl">
            PrepWise
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-gray-400 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
        
        <div className="space-y-8 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">1. Information We Collect</h2>
            <p>
              When you use PrepWise, we collect information you provide directly to us. This includes your account information (handled securely via Clerk authentication), your uploaded resumes, code submissions, and audio recordings/transcripts from your AI interviews.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">2. How We Use Your Information</h2>
            <p className="mb-3">We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide, maintain, and improve our services.</li>
              <li>Process your code submissions and evaluate your performance.</li>
              <li>Analyze your resume and provide ATS scoring.</li>
              <li>Conduct AI-driven interviews and generate personalized feedback.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">3. Third-Party AI Services</h2>
            <p>
              To provide our core features, we process your data through third-party AI providers (such as OpenAI, Groq, and VAPI). We only send the minimum data necessary for these services to function. Your data is not used by these providers to train their foundation models.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">4. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal data against unauthorized or unlawful processing, accidental loss, destruction, or damage.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
