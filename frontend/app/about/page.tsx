import Link from 'next/link';

export default function AboutPage() {
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
        <h1 className="text-4xl md:text-5xl font-bold mb-8">About PrepWise</h1>
        
        <div className="space-y-6 text-gray-300 leading-relaxed text-lg">
          <p>
            PrepWise was built with a single mission: to bridge the gap between learning to code and actually landing a top-tier engineering role. We realized that passing technical interviews isn't just about knowing algorithms—it's about communication, confidence, and real-time problem-solving under pressure.
          </p>
          
          <p>
            Traditional platforms give you a code editor and test cases, but they don't prepare you for the human element of an interview. PrepWise introduces an end-to-end preparation pipeline:
          </p>
          
          <ul className="list-disc pl-6 space-y-3">
            <li><strong className="text-white">AI-Powered Resume Analysis:</strong> Beat the ATS algorithms before you even apply.</li>
            <li><strong className="text-white">Realistic AI Interviews:</strong> Real-time voice interviews that adapt to your resume and the specific role you are applying for.</li>
            <li><strong className="text-white">Structured Practice:</strong> Over 250+ curated FAANG-level problems with full test-case validation.</li>
          </ul>

          <p>
            Our goal is to make premium, personalized interview coaching accessible to everyone. Whether you're a student looking for your first internship or an experienced developer aiming for a senior role, PrepWise provides the tools to help you succeed.
          </p>

          <div className="mt-12 p-6 bg-slate-900 rounded-2xl border border-slate-800">
            <h2 className="text-2xl font-semibold mb-4 text-white">Open Source</h2>
            <p className="mb-4">
              PrepWise is open source. You can view the code, contribute, and report issues on our GitHub repository.
            </p>
            <Link href="https://github.com/YashPanwar1408/prep-wise.git" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 font-medium">
              View on GitHub &rarr;
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
