/**
 * Custom React Hook for VAPI Voice AI Integration
 */

import { useEffect, useRef, useState } from 'react';
import Vapi from '@vapi-ai/web';

export interface VapiMessage {
  type: string;
  role?: string;
  content?: string;
  [key: string]: unknown;
}

type VapiClient = {
  start: (assistantId: string) => Promise<{ id: string }>;
  stop: () => void;
  setMuted: (muted: boolean) => void;
  send: (payload: unknown) => void;
  on(event: 'call-start', handler: () => void): void;
  on(event: 'call-end', handler: () => void): void;
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

export function useVapi(options: UseVapiOptions = {}) {
  const {
    assistantId,
    onCallStart,
    onCallEnd,
    onMessage,
    onError,
  } = options;

  const vapiRef = useRef<VapiClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState<VapiMessage[]>([]);
  const [callId, setCallId] = useState<string | null>(null);

  // Initialize VAPI
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

    // Event listeners
    vapi.on('call-start', () => {
      setIsConnected(true);
      onCallStart?.();
    });

    vapi.on('call-end', () => {
      setIsConnected(false);
      onCallEnd?.();
    });

    vapi.on('message', (message: VapiMessage) => {
      if (message.type === 'transcript') {
        setTranscript((prev) => [...prev, message]);
      }
      onMessage?.(message);
    });

    vapi.on('error', (error: Error) => {
      console.error('VAPI Error:', error);
      onError?.(error);
    });

    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop();
      }
    };
  }, [onCallStart, onCallEnd, onMessage, onError]);

  // Start call with assistant ID
  const startCall = async (customAssistantId?: string) => {
    const id = customAssistantId || assistantId;
    
    if (!id) {
      throw new Error('Assistant ID is required to start call');
    }

    if (!vapiRef.current) {
      throw new Error('VAPI not initialized');
    }

    try {
      const call = await vapiRef.current.start(id);
      setCallId(call.id);
      return call;
    } catch (error) {
      console.error('Failed to start VAPI call:', error);
      throw error;
    }
  };

  // Stop call
  const stopCall = () => {
    if (vapiRef.current) {
      vapiRef.current.stop();
      setIsConnected(false);
      setCallId(null);
    }
  };

  // Toggle mute
  const toggleMute = () => {
    if (vapiRef.current) {
      const newMutedState = !isMuted;
      vapiRef.current.setMuted(newMutedState);
      setIsMuted(newMutedState);
    }
  };

  // Send message to AI
  const sendMessage = (message: string) => {
    if (vapiRef.current && isConnected) {
      vapiRef.current.send({
        type: 'message',
        message,
      });
    }
  };

  return {
    startCall,
    stopCall,
    toggleMute,
    sendMessage,
    isConnected,
    isMuted,
    transcript,
    callId,
  };
}
