import Link from 'next/link';

export default function TermsPage() {
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
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Terms of Service</h1>
        <p className="text-gray-400 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
        
        <div className="space-y-8 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">1. Acceptance of Terms</h2>
            <p>
              By accessing and using PrepWise, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">2. Use of Service</h2>
            <p className="mb-3">You agree to use PrepWise only for its intended purpose: interview preparation and technical learning. You agree NOT to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the platform for any illegal or unauthorized purpose.</li>
              <li>Attempt to bypass or exploit our sandboxed code execution environment.</li>
              <li>Submit malicious code, malware, or attempting denial-of-service attacks against our infrastructure.</li>
              <li>Use automated scripts or scrapers to extract content or problems from the platform.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">3. User Content</h2>
            <p>
              You retain all rights to the code you write and the resumes you upload. However, you grant us a license to process, store, and transmit this content as necessary to provide the PrepWise service (such as executing your code or running AI analysis on your resume).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">4. Disclaimer of Warranties</h2>
            <p>
              The platform is provided "as is" and "as available". While we strive for high availability and accuracy, we make no guarantees regarding the uptime of the service, the correctness of AI feedback, or the availability of specific interview scenarios.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
