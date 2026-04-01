/**
 * Human Interview Page
 * /interview/human
 * Create, Join, or Schedule meetings
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function HumanInterview() {
  const router = useRouter();
  const { user } = useUser();
  const [joinCode, setJoinCode] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleInstantMeeting = async () => {
    if (!user) {
      toast.error('Please sign in');
      return;
    }

    setIsCreating(true);

    try {
      // Create a session
      const response = await fetch('/api/interview/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'HUMAN',
          domain: 'General',
          duration: 30,
        }),
      });

      if (!response.ok) throw new Error('Failed to create meeting');

      const { interview } = await response.json();
      router.push(`/interview/human/lobby/${interview.id}`);
    } catch (error) {
      console.error('Error creating meeting:', error);
      toast.error('Failed to create meeting');
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinWithCode = () => {
    if (!joinCode.trim()) {
      toast.error('Please enter a room code');
      return;
    }
    router.push(`/interview/human/lobby/${joinCode.trim()}`);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">
            👥 Human Interview Room
          </h1>
          <p className="text-slate-400">
            Create or join live interview rooms with peers
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Start Instant Meeting */}
          <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50 group hover:border-green-500/30 transition-all">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-500/30 transition-colors">
                <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <CardTitle className="text-white text-xl">Start Instant Meeting</CardTitle>
              <CardDescription>
                Create a new meeting room and invite others
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleInstantMeeting}
                disabled={isCreating}
                className="w-full bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-5"
              >
                {isCreating ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Creating...
                  </div>
                ) : (
                  '🚀 Start Now'
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Join with Code */}
          <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50 group hover:border-blue-500/30 transition-all">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500/30 transition-colors">
                <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <CardTitle className="text-white text-xl">Join with Code</CardTitle>
              <CardDescription>
                Enter a room code to join an existing meeting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-white sr-only">Room Code</Label>
                <Input
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  placeholder="Enter room code..."
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                  onKeyDown={(e) => e.key === 'Enter' && handleJoinWithCode()}
                />
              </div>
              <Button
                onClick={handleJoinWithCode}
                className="w-full bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-5"
              >
                🔗 Join Meeting
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Info Section */}
        <Card className="bg-slate-900/30 border-slate-800/30 mt-8">
          <CardContent className="py-6">
            <div className="grid sm:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl mb-2">🎥</div>
                <p className="text-white font-medium">HD Video</p>
                <p className="text-slate-500 text-sm">Crystal clear video calls</p>
              </div>
              <div>
                <div className="text-2xl mb-2">💬</div>
                <p className="text-white font-medium">Real-time Chat</p>
                <p className="text-slate-500 text-sm">Text chat during meetings</p>
              </div>
              <div>
                <div className="text-2xl mb-2">📺</div>
                <p className="text-white font-medium">Screen Share</p>
                <p className="text-slate-500 text-sm">Share your screen or code</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
