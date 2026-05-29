/**
 * Custom React Hook for VAPI Voice AI Integration
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import Vapi from '@vapi-ai/web';

export interface VapiMessage {
  type: string;
  role?: string;
  content?: string;
  transcript?: string;
  transcriptType?: 'partial' | 'final';
  [key: string]: unknown;
}

type VapiClient = {
  start: (assistantIdOrConfig: string | object) => Promise<{ id: string }>;
  stop: () => void;
  setMuted: (muted: boolean) => void;
  send: (payload: unknown) => void;
  on(event: 'call-start', handler: () => void): void;
  on(event: 'call-end', handler: () => void): void;
  on(event: 'speech-start', handler: () => void): void;
  on(event: 'speech-end', handler: () => void): void;
  on(event: 'message', handler: (payload: VapiMessage) => void): void;
  on(event: 'error', handler: (payload: Error) => void): void;
  on(event: string, handler: (payload: unknown) => void): void;
};

export interface UseVapiOptions {
  assistantId?: string;
  onCallStart?: () => void;
  onCallEnd?: () => void;
  onMessage?: (message: VapiMessage) => void;
  onError?: (error: Error) => void;
}

function getTranscriptText(message: VapiMessage): string {
  return (
    (typeof message.transcript === 'string' ? message.transcript : '') ||
    (typeof message.content === 'string' ? message.content : '')
  ).trim();
}

export function useVapi(options: UseVapiOptions = {}) {
  const {
    assistantId,
    onCallStart,
    onCallEnd,
    onMessage,
    onError,
  } = options;

  const vapiRef = useRef<VapiClient | null>(null);
  const callActiveRef = useRef(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState<VapiMessage[]>([]);
  const [userTranscript, setUserTranscript] = useState('');
  const [assistantTranscript, setAssistantTranscript] = useState('');
  const [callId, setCallId] = useState<string | null>(null);

  const handleTranscriptMessage = useCallback((message: VapiMessage) => {
    const role = message.role as string | undefined;
    const text = getTranscriptText(message);
    if (!text || !role) return;

    const isFinal =
      message.transcriptType === 'final' || message.transcriptType === undefined;

    if (role === 'user') {
      setUserTranscript(text);
      if (isFinal) {
        setTranscript((prev) => [...prev, message]);
      }
    } else if (role === 'assistant') {
      setAssistantTranscript(text);
      if (isFinal) {
        setTranscript((prev) => [...prev, message]);
      }
    }
  }, []);

  // Initialize VAPI once — do not stop the call in this effect's cleanup (React Strict Mode)
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_VAPI_API_KEY;

    if (!apiKey) {
      console.error('NEXT_PUBLIC_VAPI_API_KEY not found');
      return;
    }

    const vapi = new (Vapi as unknown as { new (apiKey: string): VapiClient })(
      apiKey,
    );
    vapiRef.current = vapi;

    vapi.on('call-start', () => {
      callActiveRef.current = true;
      setIsConnected(true);
      onCallStart?.();
    });

    vapi.on('call-end', () => {
      callActiveRef.current = false;
      setIsConnected(false);
      setIsSpeaking(false);
      setIsUserSpeaking(false);
      onCallEnd?.();
    });

    vapi.on('speech-start', () => {
      setIsUserSpeaking(true);
    });

    vapi.on('speech-end', () => {
      setIsUserSpeaking(false);
    });

    vapi.on('message', (message: VapiMessage) => {
      if (message.type === 'transcript') {
        handleTranscriptMessage(message);
      }

      if (message.type === 'speech-update') {
        const m = message as VapiMessage & { status?: string };
        if (m.role === 'assistant') {
          setIsSpeaking(m.status === 'started');
        }
      }

      onMessage?.(message);
    });

    vapi.on('error', (error: unknown) => {
      console.error('VAPI Error:', error);
      if (error && typeof error === 'object') {
        console.error('VAPI Error details:', JSON.stringify(error, null, 2));
      }
      onError?.(error as Error);
    });

    // Do not stop the call here — React Strict Mode remounts would end the interview early.
    // Call stopCall() when the user leaves the room.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startCall = useCallback(
    async (customAssistantId?: string | object) => {
      const idOrConfig = customAssistantId || assistantId;

      if (!idOrConfig) {
        throw new Error('Assistant ID or configuration is required to start call');
      }

      if (!vapiRef.current) {
        throw new Error('VAPI not initialized');
      }

      try {
        const call = await vapiRef.current.start(idOrConfig);
        if (call?.id) {
          setCallId(call.id);
        }
        return call;
      } catch (error) {
        console.error('Failed to start VAPI call:', error);
        throw error;
      }
    },
    [assistantId],
  );

  const stopCall = useCallback(() => {
    if (vapiRef.current) {
      vapiRef.current.stop();
      callActiveRef.current = false;
      setIsConnected(false);
      setCallId(null);
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (vapiRef.current) {
      setIsMuted((prev) => {
        const newMutedState = !prev;
        vapiRef.current?.setMuted(newMutedState);
        return newMutedState;
      });
    }
  }, []);

  const sendMessage = useCallback(
    (message: string) => {
      if (vapiRef.current && callActiveRef.current) {
        vapiRef.current.send({
          type: 'add-message',
          message: {
            role: 'user',
            content: message,
          },
        });
      }
    },
    [],
  );

  return {
    startCall,
    stopCall,
    toggleMute,
    sendMessage,
    isConnected,
    isSpeaking,
    isUserSpeaking,
    isMuted,
    transcript,
    userTranscript,
    assistantTranscript,
    callId,
  };
}
