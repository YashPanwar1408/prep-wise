/**
 * Live Interview Room with GetStream Video
 * Human-to-human video interviews with setup screen
 */

'use client';

import { useEffect, useState, Suspense, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  type Call,
} from '@stream-io/video-react-sdk';
import { MeetingSetup } from '@/components/interview/MeetingSetup';
import { MeetingRoom } from '@/components/interview/MeetingRoom';
import { Loader2 } from 'lucide-react';
import '@stream-io/video-react-sdk/dist/css/styles.css';

function LiveRoomContent() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomId = searchParams.get('room') || `room-${Date.now()}`;
  
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<Call | null>(null);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!isLoaded) return;
    
    if (!user) {
      router.push('/sign-in');
      return;
    }

    // Prevent double initialization in React strict mode
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const initializeStream = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get Stream token from API
        const response = await fetch('/api/interview/create-stream-token', {
          method: 'POST',
        });

        if (!response.ok) {
          throw new Error('Failed to get Stream token');
        }

        const { token, apiKey, userId } = await response.json();

        // Initialize Stream client
        const streamClient = new StreamVideoClient({
          apiKey,
          user: {
            id: userId,
            name: user.fullName || user.username || 'User',
            image: user.imageUrl,
          },
          token,
        });

        setClient(streamClient);

        // Create or join call
        const streamCall = streamClient.call('default', roomId);

        setCall(streamCall);
        setIsLoading(false);
      } catch (err) {
        console.error('Stream initialization error:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize video call');
        setIsLoading(false);
      }
    };

    initializeStream();

    // Cleanup on unmount only
    return () => {
      if (call) {
        call.leave().catch(console.error);
      }
      if (client) {
        client.disconnectUser().catch(console.error);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isLoaded]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto" />
          <div>
            <p className="text-white text-lg font-medium">Initializing video call...</p>
            <p className="text-gray-400 text-sm mt-1">Room: {roomId}</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-gray-900 rounded-xl border border-gray-800 p-6 space-y-4">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Connection Failed</h2>
            <p className="text-sm text-gray-400">{error}</p>
          </div>
          <div className="space-y-2">
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push('/interview')}
              className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Back to Interview Hub
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No client or call
  if (!client || !call) {
    return null;
  }

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        {!isSetupComplete ? (
          <MeetingSetup
            onJoin={() => setIsSetupComplete(true)}
          />
        ) : (
          <MeetingRoom
            call={call}
            interviewId={roomId}
            interviewType="HUMAN"
          />
        )}
      </StreamCall>
    </StreamVideo>
  );
}

export default function LiveRoomPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
        </div>
      }
    >
      <LiveRoomContent />
    </Suspense>
  );
}
