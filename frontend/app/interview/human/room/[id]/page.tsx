/**
 * Human Interview Room Page
 * /interview/human/room/[id]
 * Full Google Meet-style UI for peer interviews
 */

'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import {
  Call,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
} from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import { MeetingRoom } from '@/components/interview/MeetingRoom';
import { disconnectStreamClient, getOrCreateStreamClient } from '@/lib/stream-client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export default function HumanInterviewRoom() {
  const router = useRouter();
  const params = useParams();
  const { user } = useUser();
  const interviewId = params.id as string;

  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<Call | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [inviteLink, setInviteLink] = useState('');
  const [showInvite, setShowInvite] = useState(false);
  const hasInitialized = useRef(false);
  const clientRef = useRef<StreamVideoClient | null>(null);
  const callRef = useRef<Call | null>(null);

  useEffect(() => {
    if (!user) return;
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const initializeStream = async () => {
      try {
        const tokenRes = await fetch('/api/interview/create-stream-token', {
          method: 'POST',
        });

        if (!tokenRes.ok) throw new Error('Failed to get Stream token');

        const { token, apiKey, userId } = await tokenRes.json();

        const streamClient = getOrCreateStreamClient({
          apiKey,
          token,
          user: {
            id: userId,
            name: user.fullName || user.username || 'User',
            image: user.imageUrl,
          },
        });

        clientRef.current = streamClient;
        setClient(streamClient);

        const callId = `human-${interviewId}`;
        const streamCall = streamClient.call('default', callId);
        callRef.current = streamCall;

        // Prompt for media permissions early to avoid device-manager races.
        if (navigator.mediaDevices?.getUserMedia) {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
            stream.getTracks().forEach((t) => t.stop());
          } catch (err) {
            console.warn('Media permission request failed:', err);
          }
        }

        // Join the call in the room (lobby is only for setup/invite).
        // { create: true } also supports direct deep-links to the room.
        await streamCall.join({ create: true });
        setCall(streamCall);
        setIsLoading(false);

        // Set invite link
        setInviteLink(`${window.location.origin}/interview/human/lobby/${interviewId}`);
      } catch (error) {
        console.error('Error initializing Stream:', error);
        toast.error('Failed to join meeting');
        setIsLoading(false);
      }
    };

    initializeStream();

    return () => {
      callRef.current?.leave().catch(() => undefined);
      disconnectStreamClient(clientRef.current).catch(() => undefined);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleLeave = () => {
    router.push('/dashboard');
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    toast.success('Invite link copied!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Joining meeting room...</p>
        </div>
      </div>
    );
  }

  if (!client || !call) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-white">Failed to join meeting. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Invite Floating Button */}
      <button
        onClick={() => setShowInvite(!showInvite)}
        className="fixed top-4 right-4 z-50 p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transition-colors"
        title="Invite participants"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      </button>

      {/* Invite Modal */}
      {showInvite && (
        <div className="fixed top-16 right-4 z-50 bg-slate-900 border border-slate-700 rounded-xl p-4 w-80 shadow-2xl">
          <h3 className="text-white font-semibold mb-2">Invite Participants</h3>
          <p className="text-slate-400 text-sm mb-3">Share this link to invite others:</p>
          <div className="flex gap-2">
            <input
              readOnly
              value={inviteLink}
              className="flex-1 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg border border-slate-700 truncate"
            />
            <Button
              onClick={copyInviteLink}
              size="sm"
              className="bg-blue-500 hover:bg-blue-600 shrink-0"
            >
              Copy
            </Button>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Room Code: <span className="text-blue-400 font-mono">{interviewId}</span>
          </p>
        </div>
      )}

      <StreamVideo client={client}>
        <StreamCall call={call}>
          <MeetingRoom
            call={call}
            interviewId={interviewId}
            interviewType="HUMAN"
            onLeave={handleLeave}
          />
        </StreamCall>
      </StreamVideo>
    </div>
  );
}
