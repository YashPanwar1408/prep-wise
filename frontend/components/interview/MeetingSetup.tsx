/**
 * Meeting Setup Component
 * Camera and microphone preview before joining
 */

'use client';

import { useState, useEffect, Component, type ReactNode } from 'react';
import {
  Call,
  DeviceSettings,
  useCallStateHooks,
  VideoPreview,
} from '@stream-io/video-react-sdk';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface MeetingSetupProps {
  call: Call;
  onJoin: () => void;
}

class DeviceSettingsErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <p className="text-sm text-slate-400">
          Device list unavailable. You can still join.
        </p>
      );
    }

    return this.props.children;
  }
}

export function MeetingSetup({ call, onJoin }: MeetingSetupProps) {
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isCameraEnabled, setIsCameraEnabled] = useState(true);
  const [devicesReady, setDevicesReady] = useState(false);
  const [hasAudioInput, setHasAudioInput] = useState<boolean | null>(null);
  const [hasVideoInput, setHasVideoInput] = useState<boolean | null>(null);
  const { useMicrophoneState, useCameraState } = useCallStateHooks();
  useMicrophoneState();
  useCameraState();

  // Request media permissions upfront so browser prompts appear early
  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (typeof navigator === 'undefined') return;
      if (!navigator.mediaDevices?.getUserMedia || !navigator.mediaDevices?.enumerateDevices) {
        setDevicesReady(false);
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        stream.getTracks().forEach((t) => t.stop());

        const devices = await navigator.mediaDevices.enumerateDevices();
        if (cancelled) return;

        setHasAudioInput(devices.some((d) => d.kind === 'audioinput'));
        setHasVideoInput(devices.some((d) => d.kind === 'videoinput'));
        setDevicesReady(true);
      } catch (err) {
        if (cancelled) return;
        console.warn('Media permission request failed:', err);
        setHasAudioInput(false);
        setHasVideoInput(false);
        // Still mark as ready so the user can proceed; we'll just avoid
        // auto-enabling devices and hide the selector.
        setDevicesReady(true);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!call) return;
    if (!devicesReady) return;
    if (hasAudioInput === false) return;

    const run = async () => {
      try {
        if (isMicEnabled) {
          await call.microphone.enable();
        } else {
          await call.microphone.disable();
        }
      } catch (err) {
        console.warn('Failed to toggle microphone:', err);
      }
    };

    run();
  }, [isMicEnabled, call, devicesReady, hasAudioInput]);

  useEffect(() => {
    if (!call) return;
    if (!devicesReady) return;
    if (hasVideoInput === false) return;

    const run = async () => {
      try {
        if (isCameraEnabled) {
          await call.camera.enable();
        } else {
          await call.camera.disable();
        }
      } catch (err) {
        console.warn('Failed to toggle camera:', err);
      }
    };

    run();
  }, [isCameraEnabled, call, devicesReady, hasVideoInput]);

  const handleJoin = async () => {
    try {
      // Simply call the onJoin callback
      // The parent component will handle joining the call
      onJoin();
    } catch (error) {
      console.error('Error in meeting setup:', error);
      // Even if there's an error, proceed
      onJoin();
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-6">
      <div className="grid lg:grid-cols-2 gap-6 max-w-6xl w-full">
        {/* Camera Preview */}
        <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50">
          <CardHeader>
            <CardTitle className="text-white">Camera Preview</CardTitle>
            <CardDescription>Make sure you look good!</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-slate-800 rounded-lg overflow-hidden border-2 border-blue-500/30">
              <VideoPreview />
            </div>
          </CardContent>
        </Card>

        {/* Meeting Details & Controls */}
        <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800/50">
          <CardHeader>
            <CardTitle className="text-white">Meeting Details</CardTitle>
            <CardDescription>Configure your devices</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Device Settings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isCameraEnabled ? 'bg-green-500/20' : 'bg-red-500/20'
                    }`}>
                    <svg className={`w-5 h-5 ${isCameraEnabled ? 'text-green-400' : 'text-red-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Camera</p>
                    <p className="text-xs text-slate-400">
                      {isCameraEnabled ? 'On' : 'Off'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCameraEnabled(!isCameraEnabled)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm"
                >
                  Toggle
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isMicEnabled ? 'bg-green-500/20' : 'bg-red-500/20'
                    }`}>
                    <svg className={`w-5 h-5 ${isMicEnabled ? 'text-green-400' : 'text-red-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Microphone</p>
                    <p className="text-xs text-slate-400">
                      {isMicEnabled ? 'On' : 'Off'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMicEnabled(!isMicEnabled)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm"
                >
                  Toggle
                </button>
              </div>

              {/* Device Selector */}
              <div className="p-4 bg-slate-800/30 rounded-lg">
                {devicesReady && (hasAudioInput || hasVideoInput) ? (
                  <DeviceSettingsErrorBoundary>
                    <DeviceSettings />
                  </DeviceSettingsErrorBoundary>
                ) : (
                  <p className="text-sm text-slate-400">
                    Allow microphone/camera access to select devices.
                  </p>
                )}
              </div>
            </div>

            {/* Join Button */}
            <Button
              onClick={handleJoin}
              className="w-full bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-6 text-lg"
            >
              Join Meeting
            </Button>

            <p className="text-center text-sm text-slate-400">
              Do not worry, our team is super friendly! We want you to succeed. 🎉
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
