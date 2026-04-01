/**
 * Human Interview Lobby
 * /interview/human/lobby/[id]
 * Camera/Mic preview before joining peer room
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
import { MeetingSetup } from '@/components/interview/MeetingSetup';
import { toast } from 'sonner';

export default function HumanInterviewLobby() {
  const router = useRouter();
  const params = useParams();
  const { user } = useUser();
  const interviewId = params.id as string;

  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<Call | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasInitialized = useRef(false);
  const clientRef = useRef<StreamVideoClient | null>(null);

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

        const streamClient = new StreamVideoClient({
          apiKey,
          user: {
            id: userId,
            name: user.fullName || user.username || 'User',
            image: user.imageUrl,
          },
          token,
        });

        clientRef.current = streamClient;
        setClient(streamClient);

        const callId = `human-${interviewId}`;
        const streamCall = streamClient.call('default', callId);

        setCall(streamCall);
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing Stream:', error);
        toast.error('Failed to initialize video');
        setIsLoading(false);
      }
    };

    initializeStream();

    return () => {
      if (clientRef.current) {
        clientRef.current.disconnectUser().catch(console.error);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleJoin = async () => {
    try {
      // Call the start-human API to create the Stream call server-side
      const response = await fetch('/api/interview/start-human', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interviewId: interviewId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to start interview');
      }

      // Navigate to room after successful call creation
      router.push(`/interview/human/room/${interviewId}`);
    } catch (error) {
      console.error('Error starting human interview:', error);
      // Still try to navigate - the room has { create: true } as fallback
      router.push(`/interview/human/room/${interviewId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Setting up your room...</p>
        </div>
      </div>
    );
  }

  if (!client || !call) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-white">Failed to initialize video. Please try again.</p>
      </div>
    );
  }

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <MeetingSetup call={call} onJoin={handleJoin} />
      </StreamCall>
    </StreamVideo>
  );
}
