/**
 * AI Interview Setup Page
 * /interview/ai/setup
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { extractTextFromPdf, validatePdfFile } from '@/lib/pdf-extractor';
import { parseResumeWithGrok } from '@/actions/resume.actions';

const DOMAINS = [
  'DSA',
  'Frontend',
  'Backend',
  'Full Stack',
  'AI/ML',
  'HR',
  'Custom',
];

const DURATIONS = [10, 20, 30];

export default function AIInterviewSetup() {
  const router = useRouter();
  const { user } = useUser();

  const [domain, setDomain] = useState('DSA');
  const [duration, setDuration] = useState(20);
  const [jobDescription, setJobDescription] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [existingResumeData, setExistingResumeData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Pre-load parsed resume from sessionStorage (set by the resume upload page)
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('resumeData');
      if (raw) {
        const parsed = JSON.parse(raw);
        setExistingResumeData(parsed);
      }
    } catch {
      // sessionStorage unavailable or invalid
    }
  }, []);

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFile(file);
      toast.success('Resume uploaded successfully');
    }
  };

  const handleStartInterview = async () => {
    if (!user) {
      toast.error('Please sign in to start interview');
      return;
    }

    setIsLoading(true);

    try {
      // Fetch latest resume from database if no file uploaded
      let resumeData = null;

      if (resumeFile) {
        // Parse new resume using client-side extraction
        try {
          // Validate file
          const validation = validatePdfFile(resumeFile);
          if (!validation.valid) {
            toast.error(validation.error || 'Invalid PDF file');
            setIsLoading(false);
            return;
          }

          // Extract text from PDF (client-side)
          toast.info('Extracting text from PDF...');
          const extractedText = await extractTextFromPdf(resumeFile);

          // Parse with Grok (server-side)
          toast.info('Analyzing resume with AI...');
          resumeData = await parseResumeWithGrok(extractedText);

          toast.success('Resume parsed successfully!');
        } catch (error) {
          console.error('Parse resume error:', error);
          toast.error('Failed to parse resume, continuing without it');
          resumeData = null;
        }
      } else if (existingResumeData) {
        // Use pre-parsed resume from sessionStorage (uploaded on resume page)
        resumeData = existingResumeData;
        toast.success('Using your previously uploaded resume');
      } else {
        // Try to fetch existing resume from database
        try {
          const resumeRes = await fetch('/api/resume/latest');
          if (resumeRes.ok) {
            const data = await resumeRes.json();
            resumeData = data.resume;
            toast.success('Using your saved resume');
          }
        } catch {
          console.log('No existing resume found, continuing without it');
        }
      }

      // Create interview session
      const response = await fetch('/api/interview/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'AI',
          domain,
          duration,
          resumeData,
          jobDescription: jobDescription || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create interview session');
      }

      const { interview } = await response.json();

      toast.success('Interview session created!');
      router.push(`/interview/ai/lobby/${interview.id}`);
    } catch (error) {
      console.error('Error starting interview:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to start interview');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">
            🤖 AI Interview Setup
          </h1>
          <p className="text-slate-400">
            Configure your AI-powered mock interview
          </p>
        </div>

        <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50">
          <CardHeader>
            <CardTitle className="text-white">Interview Configuration</CardTitle>
            <CardDescription>
              Customize your interview experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Domain Selection */}
            <div className="space-y-2">
              <Label className="text-white">Interview Domain</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {DOMAINS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDomain(d)}
                    className={`p-3 rounded-lg font-medium transition-all ${domain === d
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration Selection */}
            <div className="space-y-2">
              <Label className="text-white">Interview Duration</Label>
              <div className="grid grid-cols-3 gap-2">
                {DURATIONS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    className={`p-3 rounded-lg font-medium transition-all ${duration === d
                        ? 'bg-green-500 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                  >
                    {d} mins
                  </button>
                ))}
              </div>
            </div>

            {/* Resume Upload */}
            <div className="space-y-2">
              <Label className="text-white">Upload Resume (Optional)</Label>
              <div className="relative">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleResumeUpload}
                  className="hidden"
                  id="resume-upload"
                />
                <label
                  htmlFor="resume-upload"
                  className="flex items-center justify-center gap-2 p-4 bg-slate-800 hover:bg-slate-700 rounded-lg cursor-pointer transition-colors border-2 border-dashed border-slate-700"
                >
                  <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="text-slate-300">
                    {resumeFile ? resumeFile.name : 'Click to upload PDF'}
                  </span>
                </label>
              </div>
              <p className="text-xs text-slate-500">
                AI will use your resume to ask personalized questions
              </p>
            </div>

            {/* Job Description */}
            <div className="space-y-2">
              <Label className="text-white">Job Description (Optional)</Label>
              <Textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 min-h-37.5"
              />
              <p className="text-xs text-slate-500">
                AI will tailor questions to match the role
              </p>
            </div>

            {/* Start Button */}
            <Button
              onClick={handleStartInterview}
              disabled={isLoading}
              className="w-full bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-6 text-lg"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Creating Session...
                </div>
              ) : (
                'Continue to Lobby'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
