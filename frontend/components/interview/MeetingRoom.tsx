'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Call,
  CallControls,
  CallParticipantsList,
  CallingState,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
} from '@stream-io/video-react-sdk';
import { useRouter } from 'next/navigation';
import { useVapi } from '@/hooks/useVapi';
import { Users, LayoutList, Mic, MicOff } from 'lucide-react';
import Image from 'next/image';

interface MeetingRoomProps {
  call: Call;
  interviewId: string;
  interviewType: 'AI' | 'HUMAN';
  assistantId?: string;
  onLeave?: () => void;
}

type CallLayoutType = 'grid' | 'speaker-left' | 'speaker-right';

// AI speaking animation component
function AISpeakingWave({ isSpeaking }: { isSpeaking: boolean }) {
  return (
    <div className="flex items-end gap-[3px] h-5">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={`w-[3px] rounded-full bg-blue-400 transition-all duration-100 ${
            isSpeaking ? 'animate-pulse' : ''
          }`}
          style={{
            height: isSpeaking ? `${8 + Math.sin(i * 1.2) * 8}px` : '4px',
            animationDelay: `${i * 0.1}s`,
            animationDuration: '0.6s',
          }}
        />
      ))}
    </div>
  );
}

// AI Participant Card shown alongside user's camera
function AIParticipantCard({
  isConnected,
  isSpeaking,
  transcript,
}: {
  isConnected: boolean;
  isSpeaking: boolean;
  transcript: string;
}) {
  return (
    <div className="relative flex flex-col items-center justify-center bg-[#1c1f2e] rounded-2xl overflow-hidden border border-slate-700/50 h-full min-h-[280px] select-none">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 to-slate-900/50" />

      {/* Avatar */}
      <div className="relative z-10 flex flex-col items-center gap-3 p-6">
        <div
          className={`relative rounded-full overflow-hidden border-2 transition-all duration-300 ${
            isSpeaking
              ? 'border-blue-400 shadow-[0_0_20px_rgba(96,165,250,0.5)]'
              : isConnected
              ? 'border-slate-500'
              : 'border-slate-700'
          }`}
          style={{ width: 96, height: 96 }}
        >
          <Image
            src="/ai-interviewer.png"
            alt="AI Interviewer"
            width={96}
            height={96}
            className="object-cover w-full h-full"
          />
          {/* Pulse ring when speaking */}
          {isSpeaking && (
            <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-ping opacity-40" />
          )}
        </div>

        <div className="text-center">
          <p className="text-white font-semibold text-sm">AI Interviewer</p>
          <div className="flex items-center justify-center gap-1.5 mt-1">
            {isConnected ? (
              <>
                <AISpeakingWave isSpeaking={isSpeaking} />
                <span className="text-xs text-blue-400 ml-1">
                  {isSpeaking ? 'Speaking...' : 'Listening'}
                </span>
              </>
            ) : (
              <span className="text-xs text-yellow-400 animate-pulse">Connecting...</span>
            )}
          </div>
        </div>

        {/* Live transcript bubble */}
        {transcript && (
          <div className="mt-2 max-w-[200px] bg-slate-800/80 backdrop-blur-sm rounded-xl px-3 py-2 border border-slate-600/50">
            <p className="text-xs text-slate-300 text-center leading-relaxed line-clamp-3">
              {transcript}
            </p>
          </div>
        )}
      </div>

      {/* Name label */}
      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-md">
        <Mic size={10} className="text-blue-400" />
        <span className="text-xs text-white font-medium">AI Interviewer</span>
      </div>
    </div>
  );
}

export function MeetingRoom({
  call,
  interviewId,
  interviewType,
  assistantId,
  onLeave,
}: MeetingRoomProps) {
  const router = useRouter();
  const [layout, setLayout] = useState<CallLayoutType>('speaker-left');
  const [showParticipants, setShowParticipants] = useState(false);
  const [showLayoutMenu, setShowLayoutMenu] = useState(false);
  const [lastTranscript, setLastTranscript] = useState('');
  const hasStartedVapi = useRef(false);

  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  // VAPI for AI interviews
  const {
    startCall: startVapiCall,
    stopCall: stopVapiCall,
    transcript: vapiTranscript,
    isConnected: isVapiConnected,
    isSpeaking: aiSpeaking,
  } = useVapi({
    assistantId,
    onCallStart: () => {
      console.log('VAPI call started');
    },
    onCallEnd: () => {
      console.log('VAPI call ended');
    },
    onMessage: (msg) => {
      // Update last transcript for display
      if (msg.type === 'transcript') {
        const role = msg.role as string;
        const text = (msg as any).transcript as string || msg.content as string || '';
        if (role === 'assistant' && text) {
          setLastTranscript(text);
        }
      }
    },
  });

  // Start VAPI call for AI interviews
  useEffect(() => {
    if (interviewType !== 'AI' || callingState !== CallingState.JOINED) {
      return;
    }

    if (hasStartedVapi.current) {
      return;
    }

    hasStartedVapi.current = true;

    const startAI = async () => {
      try {
        // Wait 1.5s for Stream's WebRTC to settle device capture on Windows
        await new Promise((resolve) => setTimeout(resolve, 1500));
        
        const res = await fetch(`/api/interview/${interviewId}/vapi-config`);
        if (!res.ok) throw new Error('Failed to fetch VAPI config');
        const data = await res.json();
        if (data.config) {
          await startVapiCall(data.config);
        } else if (assistantId) {
          await startVapiCall(assistantId);
        }
      } catch (err) {
        console.error('Error starting VAPI:', err);
      }
    };

    startAI();
  }, [interviewType, interviewId, assistantId, callingState, startVapiCall]);

  const handleEndCall = async () => {
    if (interviewType === 'AI') {
      stopVapiCall();
      try {
        await fetch('/api/interview/save-transcript', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            interviewId,
            transcript: vapiTranscript,
          }),
        });
      } catch (err) {
        console.warn('Failed to save transcript:', err);
      }
    }

    if (onLeave) {
      onLeave();
    } else {
      if (interviewType === 'AI') {
        router.push(`/interview/ai/report/${interviewId}`);
      } else {
        router.push('/dashboard');
      }
    }
  };

  if (callingState !== CallingState.JOINED) {
    return (
      <div className="flex h-[calc(100vh-4rem)] w-full items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Joining meeting...</p>
        </div>
      </div>
    );
  }

  const CallLayout = () => {
    if (layout === 'grid') return <PaginatedGridLayout />;
    return <SpeakerLayout participantsBarPosition={layout === 'speaker-left' ? 'left' : 'right'} />;
  };

  return (
    <section className="relative h-[calc(100vh-4rem)] w-full overflow-hidden bg-slate-950 text-white str-video flex flex-col">
      {/* Top HUD */}
      {interviewType === 'AI' && (
        <div className="flex-none flex items-center gap-3 px-4 pt-3 pb-1">
          <div className={`flex items-center gap-2 px-3 py-1.5 backdrop-blur-sm rounded-lg border transition-all ${
            isVapiConnected
              ? 'bg-green-500/10 border-green-500/40'
              : 'bg-yellow-500/10 border-yellow-500/40'
          }`}>
            <div className={`w-2 h-2 rounded-full ${isVapiConnected ? 'bg-green-400 animate-pulse' : 'bg-yellow-400 animate-pulse'}`} />
            <span className={`text-sm font-medium ${isVapiConnected ? 'text-green-400' : 'text-yellow-400'}`}>
              AI Interviewer {isVapiConnected ? '• Active' : '• Connecting...'}
            </span>
          </div>
          {aiSpeaking && (
            <div className="flex items-center gap-1.5 text-blue-400 text-sm">
              <AISpeakingWave isSpeaking={true} />
              <span>Speaking</span>
            </div>
          )}
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* For AI interview: show AI card + user video side by side */}
        {interviewType === 'AI' ? (
          <div className="flex flex-1 gap-3 p-3 pb-0 min-h-0">
            {/* AI Participant Card */}
            <div className="flex-1 min-w-0">
              <AIParticipantCard
                isConnected={isVapiConnected}
                isSpeaking={aiSpeaking}
                transcript={lastTranscript}
              />
            </div>
            {/* User Video */}
            <div className="flex-1 min-w-0 str-video">
              <CallLayout />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex p-3 pb-0 min-h-0 str-video">
            <div className="flex-1 min-w-0">
              <CallLayout />
            </div>
          </div>
        )}

        {/* Participants Panel */}
        {showParticipants && (
          <div className="w-[300px] flex-none bg-[#1c1f2e] rounded-xl m-3 ml-0 p-4 overflow-y-auto">
            <CallParticipantsList onClose={() => setShowParticipants(false)} />
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="flex-none flex w-full items-center justify-center gap-4 flex-wrap py-3 px-4 bg-slate-950/80 backdrop-blur-md border-t border-slate-800">
        <CallControls onLeave={handleEndCall} />

        <div className="relative flex items-center gap-2">
          <button
            onClick={() => setShowLayoutMenu(!showLayoutMenu)}
            className="flex items-center justify-center rounded-full bg-[#19232d] hover:bg-[#4c535b] p-3 transition-all"
            title="Layout Options"
          >
            <LayoutList size={20} className="text-white" />
          </button>

          {showLayoutMenu && (
            <div className="absolute bottom-full left-0 mb-2 w-48 rounded-lg bg-[#1c1f2e] p-2 shadow-xl border border-slate-700">
              <button
                onClick={() => { setLayout('grid'); setShowLayoutMenu(false); }}
                className="w-full text-left px-4 py-2 hover:bg-[#323b44] rounded text-sm text-white"
              >
                Grid View
              </button>
              <button
                onClick={() => { setLayout('speaker-left'); setShowLayoutMenu(false); }}
                className="w-full text-left px-4 py-2 hover:bg-[#323b44] rounded text-sm text-white"
              >
                Speaker Left
              </button>
              <button
                onClick={() => { setLayout('speaker-right'); setShowLayoutMenu(false); }}
                className="w-full text-left px-4 py-2 hover:bg-[#323b44] rounded text-sm text-white"
              >
                Speaker Right
              </button>
            </div>
          )}
        </div>

        <button
          onClick={() => setShowParticipants((prev) => !prev)}
          className="flex items-center justify-center rounded-full bg-[#19232d] hover:bg-[#4c535b] p-3 transition-all"
          title="Participants"
        >
          <Users size={20} className="text-white" />
        </button>
      </div>
    </section>
  );
}
