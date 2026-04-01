/**
 * AI Interview Report Page
 * /interview/ai/report/[id]
 * Shows scores, strengths, weaknesses, and detailed evaluation
 */

'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface InterviewReport {
  id: string;
  domain: string;
  duration: number;
  overallScore: number | null;
  technicalScore: number | null;
  communicationScore: number | null;
  confidenceScore: number | null;
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
  topicsToRevise: string[];
  detailedFeedback: string | null;
  createdAt: string;
}

function ScoreCard({
  label,
  score,
  color,
}: {
  label: string;
  score: number;
  color: string;
}) {
  return (
    <div className="text-center">
      <div className="relative w-24 h-24 mx-auto mb-2">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-slate-700"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${(score / 100) * 251.2} 251.2`}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-white">
          {score}
        </span>
      </div>
      <p className="text-sm font-medium text-slate-300">{label}</p>
    </div>
  );
}

export default function AIInterviewReport() {
  const router = useRouter();
  const params = useParams();
  const interviewId = params.id as string;
  
  const [report, setReport] = useState<InterviewReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateReport = useCallback(async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/interview/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interviewId }),
      });

      if (!res.ok) throw new Error('Failed to generate report');

      const { interview } = await res.json();
      setReport(interview);
      toast.success('Report generated successfully!');
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    } finally {
      setIsGenerating(false);
    }
  }, [interviewId]);

  const fetchReport = useCallback(async () => {
    try {
      const res = await fetch(`/api/interview/${interviewId}`);
      if (!res.ok) throw new Error('Failed to fetch interview');
      
      const { interview } = await res.json();
      setReport(interview);

      // Auto-generate report if not yet generated
      if (!interview.overallScore) {
        generateReport();
      }
    } catch (error) {
      console.error('Error fetching report:', error);
      toast.error('Failed to load interview data');
    } finally {
      setIsLoading(false);
    }
  }, [interviewId, generateReport]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading interview report...</p>
        </div>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">AI is evaluating your interview...</p>
          <p className="text-slate-400 text-sm mt-2">This may take a moment</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-white">Interview not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">
            📊 Interview Report
          </h1>
          <p className="text-slate-400">
            {report.domain} Interview • {report.duration} minutes
          </p>
        </div>

        {/* Score Cards */}
        {report.overallScore && (
          <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50 mb-6">
            <CardContent className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <ScoreCard label="Overall" score={report.overallScore} color="#3b82f6" />
                <ScoreCard label="Technical" score={report.technicalScore || 0} color="#10b981" />
                <ScoreCard label="Communication" score={report.communicationScore || 0} color="#f59e0b" />
                <ScoreCard label="Confidence" score={report.confidenceScore || 0} color="#8b5cf6" />
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Strengths */}
          {report.strengths.length > 0 && (
            <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50">
              <CardHeader>
                <CardTitle className="text-green-400 flex items-center gap-2">
                  <span>💪</span> Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {report.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-300">
                      <svg className="w-5 h-5 text-green-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {s}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Weaknesses */}
          {report.weaknesses.length > 0 && (
            <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50">
              <CardHeader>
                <CardTitle className="text-red-400 flex items-center gap-2">
                  <span>⚠️</span> Areas for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {report.weaknesses.map((w, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-300">
                      <svg className="w-5 h-5 text-red-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      {w}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Improvements */}
          {report.improvements.length > 0 && (
            <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50">
              <CardHeader>
                <CardTitle className="text-blue-400 flex items-center gap-2">
                  <span>💡</span> Suggested Improvements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {report.improvements.map((imp, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-300">
                      <svg className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      {imp}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Topics to Revise */}
          {report.topicsToRevise.length > 0 && (
            <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50">
              <CardHeader>
                <CardTitle className="text-yellow-400 flex items-center gap-2">
                  <span>📚</span> Topics to Revise
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {report.topicsToRevise.map((t, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-300">
                      <svg className="w-5 h-5 text-yellow-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      {t}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Detailed Feedback */}
        {report.detailedFeedback && (
          <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50 mt-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <span>📝</span> Detailed Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                {report.detailedFeedback}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <Button
            onClick={() => router.push('/interview/ai/setup')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-8"
          >
            New Interview
          </Button>
          <Button
            onClick={() => router.push('/interview')}
            variant="outline"
            className="border-slate-700 text-white hover:bg-slate-800 px-8"
          >
            Back to Interviews
          </Button>
        </div>
      </div>
    </div>
  );
}
