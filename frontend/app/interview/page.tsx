/**
 * Interview Landing Page
 * /interview
 * Two premium cards: AI Interview & Human Interview
 */

'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function InterviewPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Mock Interviews
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Practice with AI-powered interviews or join live rooms with peers. 
            Get detailed feedback and improve your interview skills.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* AI Interview Card */}
          <Card
            onClick={() => router.push('/interview/ai/setup')}
            className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50 cursor-pointer group 
                       hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] 
                       transition-all duration-300 hover:-translate-y-1"
          >
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 bg-linear-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 
                            group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all">
                <svg className="w-10 h-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611l-.573.096a9.58 9.58 0 01-3.124 0l-.573-.096c-1.717-.293-2.299-2.379-1.067-3.611L16.8 15.3M5 14.5l-1.402 1.402c-1.232 1.232-.65 3.318 1.067 3.611l.573.096c1.03.174 2.094.174 3.124 0l.573-.096c1.717-.293 2.299-2.379 1.067-3.611L8.2 14.5" />
                </svg>
              </div>
              <CardTitle className="text-2xl text-white group-hover:text-blue-400 transition-colors">
                🤖 AI Mock Interview
              </CardTitle>
              <CardDescription className="text-base">
                AI-powered interview with video, voice & evaluation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Voice AI interviewer (VAPI + Grok)
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Resume-based personalized questions
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Detailed scoring & feedback reports
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Multiple domains (DSA, Frontend, Backend, etc.)
                </li>
              </ul>
              
              <div className="mt-6 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20 text-center">
                <span className="text-blue-400 font-medium">Start AI Interview →</span>
              </div>
            </CardContent>
          </Card>

          {/* Human Interview Card */}
          <Card
            onClick={() => router.push('/interview/human')}
            className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50 cursor-pointer group 
                       hover:border-green-500/50 hover:shadow-[0_0_30px_rgba(34,197,94,0.15)] 
                       transition-all duration-300 hover:-translate-y-1"
          >
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 bg-linear-to-br from-green-500/20 to-teal-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 
                            group-hover:from-green-500/30 group-hover:to-teal-500/30 transition-all">
                <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <CardTitle className="text-2xl text-white group-hover:text-green-400 transition-colors">
                👥 Human Interview Room
              </CardTitle>
              <CardDescription className="text-base">
                Create or join live interview rooms with peers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  HD video & voice calling
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Screen sharing & emoji reactions
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Recording & chat support
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Invite peers with room code
                </li>
              </ul>
              
              <div className="mt-6 p-3 bg-green-500/10 rounded-lg border border-green-500/20 text-center">
                <span className="text-green-400 font-medium">Start Human Interview →</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats / Info */}
        <div className="mt-12 text-center">
          <p className="text-slate-500 text-sm">
            Powered by GetStream Video SDK + VAPI Voice AI + Grok
          </p>
        </div>
      </div>
    </div>
  );
}
