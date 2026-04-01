/**
 * Meeting Room Component
 * Google Meet-style video interface with GetStream
 */

'use client';

import { useState, useEffect } from 'react';
import {
  Call,
  CallParticipantsList,
  CallStatsButton,
  CallingState,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
  ToggleAudioPublishingButton,
  ToggleVideoPublishingButton,
  ScreenShareButton,
  ReactionsButton,
} from '@stream-io/video-react-sdk';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useVapi } from '@/hooks/useVapi';
import '@/app/stream-overrides.css';

interface MeetingRoomProps {
  call: Call;
  interviewId: string;
  interviewType: 'AI' | 'HUMAN';
  assistantId?: string;
  onLeave?: () => void;
}

export function MeetingRoom({
  call,
  interviewId,
  interviewType,
  assistantId,
  onLeave,
}: MeetingRoomProps) {
  const router = useRouter();
  const [layout, setLayout] = useState<'grid' | 'speaker'>('speaker');
  const [showParticipants, setShowParticipants] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  const { useCallCallingState, useParticipantCount } = useCallStateHooks();
  const callingState = useCallCallingState();
  const participantCount = useParticipantCount();

  // VAPI for AI interviews
  const {
    startCall: startVapiCall,
    stopCall: stopVapiCall,
    isConnected: isVapiConnected,
    transcript: vapiTranscript,
  } = useVapi({
    assistantId,
    onCallStart: () => console.log('VAPI call started'),
    onCallEnd: () => console.log('VAPI call ended'),
  });

  // Start VAPI call for AI interviews
  useEffect(() => {
    if (interviewType === 'AI' && assistantId && callingState === CallingState.JOINED) {
      startVapiCall(assistantId).catch(console.error);
    }
  }, [interviewType, assistantId, callingState, startVapiCall]);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Handle leave
  const handleLeave = async () => {
    try {
      // Stop VAPI if AI interview
      if (interviewType === 'AI') {
        stopVapiCall();

        // Save transcript
        await fetch('/api/interview/save-transcript', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            interviewId,
            transcript: vapiTranscript,
          }),
        });
      }

      // Leave Stream call
      await call.leave();

      // Callback
      if (onLeave) {
        onLeave();
      } else {
        // Redirect based on type
        if (interviewType === 'AI') {
          router.push(`/interview/ai/report/${interviewId}`);
        } else {
          router.push('/interview');
        }
      }
    } catch (error) {
      console.error('Error leaving meeting:', error);
    }
  };

  if (callingState !== CallingState.JOINED) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Joining meeting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-950 flex flex-col">
      {/* Header */}
      <div className="absolute top-0 inset-x-0 z-10 bg-linear-to-b from-slate-950/90 to-transparent">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 backdrop-blur-sm rounded-lg">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-white text-sm font-medium">{formatTime(elapsedTime)}</span>
            </div>

            {interviewType === 'AI' && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 backdrop-blur-sm rounded-lg border border-blue-500/50">
                <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 7H7v6h6V7z" />
                  <path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clipRule="evenodd" />
                </svg>
                <span className="text-blue-400 text-sm font-medium">
                  AI {isVapiConnected ? 'Active' : 'Connecting...'}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <CallStatsButton />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowParticipants(!showParticipants)}
              className="bg-slate-800/80 backdrop-blur-sm border-slate-700 text-white hover:bg-slate-700"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              {participantCount}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLayout(layout === 'grid' ? 'speaker' : 'grid')}
              className="bg-slate-800/80 backdrop-blur-sm border-slate-700 text-white hover:bg-slate-700"
            >
              {layout === 'grid' ? 'Speaker' : 'Grid'}
            </Button>
          </div>
        </div>
      </div>

      {/* Video Layout */}
      <div className="flex-1 relative">
        {layout === 'speaker' ? (
          <SpeakerLayout participantsBarPosition="bottom" />
        ) : (
          <PaginatedGridLayout />
        )}
      </div>

      {/* Participants Sidebar */}
      {showParticipants && (
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-slate-900/95 backdrop-blur-xl border-l border-slate-800 p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Participants ({participantCount})</h3>
            <button
              onClick={() => setShowParticipants(false)}
              className="text-slate-400 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <CallParticipantsList onClose={() => setShowParticipants(false)} />
        </div>
      )}

      {/* Bottom Controls */}
      <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-slate-950/90 to-transparent p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-3 bg-slate-800/50 backdrop-blur-sm rounded-full px-4 py-3">
              <ToggleAudioPublishingButton />
              <ToggleVideoPublishingButton />
              <ScreenShareButton />
              <ReactionsButton />
            </div>
            <Button
              onClick={handleLeave}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full font-medium shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
              </svg>
              End Call
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
