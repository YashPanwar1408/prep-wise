'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { extractTextFromPdf, validatePdfFile } from '@/lib/pdf-extractor';
import { parseResumeWithGrok } from '@/actions/resume.actions';
import { useResumeStore } from '@/lib/store/resume.store';

type LoadingStage = 'idle' | 'extracting' | 'analyzing' | 'done';

export default function ResumeUpload() {
  const router = useRouter();
  const store = useResumeStore();
  const [loadingStage, setLoadingStage] = useState<LoadingStage>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validatePdfFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    setError(null);
    setLoadingStage('extracting');

    try {
      // Step 1: Extract text from PDF (client-side)
      console.log('📄 Extracting text from PDF...');
      const extractedText = await extractTextFromPdf(file);

      if (!extractedText || extractedText.length < 50) {
        throw new Error('Could not extract enough text from PDF. Please ensure it contains readable text.');
      }

      // Step 2: Parse with Grok (server-side)
      setLoadingStage('analyzing');
      console.log('🤖 Analyzing with Grok...');
      const resume = await parseResumeWithGrok(extractedText);

      // Step 3: Store in Zustand + sessionStorage, then navigate
      setLoadingStage('done');
      store.setResume(resume);
      sessionStorage.setItem('resumeData', JSON.stringify(resume));
      router.push('/resume/editor');
    } catch (err) {
      console.error('Error processing resume:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to process resume. Please try again.';
      setError(errorMessage);
      setLoadingStage('idle');
    }
  };

  const getLoadingMessage = () => {
    switch (loadingStage) {
      case 'extracting':
        return 'Extracting text from PDF...';
      case 'analyzing':
        return 'Analyzing with AI...';
      case 'done':
        return 'Complete! Redirecting...';
      default:
        return 'Processing...';
    }
  };

  const isUploading = loadingStage !== 'idle';

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6">
      <div className="max-w-4xl mx-auto pt-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Upload Your Resume</h1>
          <p className="text-gray-400 text-lg">
            Upload your existing resume and we&apos;ll help you optimize it
          </p>
        </div>

        {/* Upload Card */}
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-12">
          <div className="flex flex-col items-center justify-center space-y-6">
            {/* Upload Icon */}
            <div className="w-24 h-24 rounded-full bg-blue-500/10 border-2 border-blue-500/20 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-12 h-12 text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>

            {/* Upload Button */}
            <div className="text-center">
              <label htmlFor="resume-upload">
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg cursor-pointer"
                  disabled={isUploading}
                  asChild
                >
                  <span>
                    {isUploading ? 'Processing Resume...' : 'Choose PDF File'}
                  </span>
                </Button>
              </label>
              <input
                id="resume-upload"
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isUploading}
              />
            </div>

            <p className="text-gray-400 text-sm">
              Supported format: PDF (Max size: 10MB)
            </p>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Loading State */}
            {isUploading && (
              <div className="flex flex-col items-center space-y-3">
                <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                <p className="text-gray-400 text-sm">
                  {getLoadingMessage()}
                </p>
                {loadingStage === 'extracting' && (
                  <p className="text-gray-500 text-xs">
                    Reading PDF contents...
                  </p>
                )}
                {loadingStage === 'analyzing' && (
                  <p className="text-gray-500 text-xs">
                    Structuring your resume data with Grok...
                  </p>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6">
            <div className="text-blue-400 mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">AI-Powered Parsing</h3>
            <p className="text-gray-400 text-sm">
              Our AI automatically extracts and structures all information from your resume
            </p>
          </Card>

          <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6">
            <div className="text-green-400 mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Easy Editing</h3>
            <p className="text-gray-400 text-sm">
              Edit your resume with our intuitive interface and see changes in real-time
            </p>
          </Card>

          <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6">
            <div className="text-purple-400 mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">ATS Scoring</h3>
            <p className="text-gray-400 text-sm">
              Get instant feedback on how well your resume performs with ATS systems
            </p>
          </Card>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Button
            variant="ghost"
            onClick={() => router.push('/resume')}
            className="text-gray-400 hover:text-white"
          >
            ← Back to Resume Builder
          </Button>
        </div>
      </div>
    </div>
  );
}
