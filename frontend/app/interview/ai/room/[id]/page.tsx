/**
 * AI Interview Room Page
 * /interview/ai/room/[id]
 * Full Google Meet-style interface with AI interviewer
 */

'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import {
  StreamCall,
  StreamVideo,
  StreamVideoClient,
} from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import { MeetingRoom } from '@/components/interview/MeetingRoom';
import { disconnectStreamClient, getOrCreateStreamClient } from '@/lib/stream-client';
import { toast } from 'sonner';

export default function AIInterviewRoom() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { user } = useUser();

  const interviewId = params.id as string;
  const assistantId = searchParams.get('assistantId') || undefined;

  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<ReturnType<StreamVideoClient['call']> | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const hasInitialized = useRef(false);
  const clientRef = useRef<StreamVideoClient | null>(null);
  const callRef = useRef<ReturnType<StreamVideoClient['call']> | null>(null);

  useEffect(() => {
    if (!user) return;
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const initializeStream = async () => {
      try {
        const tokenRes = await fetch('/api/interview/create-stream-token', {
          method: 'POST',
        });

        if (!tokenRes.ok) {
          throw new Error('Failed to get Stream token');
        }

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

        const callId = `interview-${interviewId}`;
        const streamCall = streamClient.call('default', callId);
        callRef.current = streamCall;

        // Join the call in the room (the lobby is only for device preview).
        // Using { create: true } keeps this route resilient if the call
        // hasn't been created yet or was created server-side.
        await streamCall.join({ create: true });

        setCall(streamCall);
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing Stream:', error);
        toast.error('Failed to join meeting');
        setIsLoading(false);
      }
    };

    initializeStream();

    return () => {
      // Leave call and disconnect client on unmount
      callRef.current?.leave().catch(() => undefined);
      disconnectStreamClient(clientRef.current).catch(() => undefined);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleLeave = () => {
    router.push(`/interview/ai/report/${interviewId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Joining interview room...</p>
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
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <MeetingRoom
          call={call}
          interviewId={interviewId}
          interviewType="AI"
          assistantId={assistantId}
          onLeave={handleLeave}
        />
      </StreamCall>
    </StreamVideo>
  );
}
