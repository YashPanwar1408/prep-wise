/**
 * Meeting Setup Component
 * Camera and microphone preview before joining
 */

'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  DeviceSelectorAudioInput,
  DeviceSelectorAudioOutput,
  DeviceSelectorVideo,
  useCallStateHooks,
  VideoPreview,
} from '@stream-io/video-react-sdk';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface MeetingSetupProps {
  onJoin: () => void;
}

export function MeetingSetup({ onJoin }: MeetingSetupProps) {
  const [devicesReady, setDevicesReady] = useState(false);
  const { useMicrophoneState, useCameraState, useSpeakerState } = useCallStateHooks();
  const { microphone, optionsAwareIsMute: isMicMuted } = useMicrophoneState();
  const { camera, optionsAwareIsMute: isCameraMuted } = useCameraState();
  const { isDeviceSelectionSupported } = useSpeakerState();

  const canSelectSpeaker = useMemo(() => {
    if (typeof HTMLMediaElement === 'undefined') return false;
    return 'setSinkId' in HTMLMediaElement.prototype && !!isDeviceSelectionSupported;
  }, [isDeviceSelectionSupported]);

  // Request media permissions upfront so browser prompts appear early
  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (typeof navigator === 'undefined') return;
      if (!navigator.mediaDevices?.getUserMedia) {
        setDevicesReady(false);
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        stream.getTracks().forEach((t) => t.stop());

        if (!cancelled) {
          setDevicesReady(true);
        }
      } catch (err) {
        if (cancelled) return;
        console.warn('Media permission request failed:', err);
        setDevicesReady(true);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleJoin = async () => {
    try {
      onJoin();
    } catch (error) {
      console.error('Error in meeting setup:', error);
      onJoin();
    }
  };

  const toggleCamera = async () => {
    try {
      if (isCameraMuted) {
        await camera.enable();
      } else {
        await camera.disable();
      }
    } catch (err) {
      console.warn('Camera toggle error:', err);
    }
  };

  const toggleMic = async () => {
    try {
      if (isMicMuted) {
        await microphone.enable();
      } else {
        await microphone.disable();
      }
    } catch (err) {
      console.warn('Mic toggle error:', err);
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
              {/* Camera row */}
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      !isCameraMuted ? 'bg-green-500/20' : 'bg-red-500/20'
                    }`}
                  >
                    <svg
                      className={`w-5 h-5 ${!isCameraMuted ? 'text-green-400' : 'text-red-400'}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      {isCameraMuted ? (
                        // Camera off icon
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M3 8l18 16M5 18h8a2 2 0 002-2V8"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      )}
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Camera</p>
                    <p className="text-xs text-slate-400">
                      {!isCameraMuted ? 'On' : 'Off'}
                    </p>
                  </div>
                </div>

                {/* Custom toggle button */}
                <button
                  type="button"
                  onClick={() => void toggleCamera()}
                  title={isCameraMuted ? 'Turn camera on' : 'Turn camera off'}
                  className={`
                    relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full
                    border-2 border-transparent transition-colors duration-200 ease-in-out
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                    ${!isCameraMuted ? 'bg-green-500' : 'bg-slate-600'}
                  `}
                >
                  <span className="sr-only">Toggle camera</span>
                  <span
                    className={`
                      pointer-events-none inline-block h-6 w-6 rounded-full bg-white shadow-lg
                      transform ring-0 transition duration-200 ease-in-out
                      ${!isCameraMuted ? 'translate-x-5' : 'translate-x-0'}
                    `}
                  />
                </button>
              </div>

              {/* Microphone row */}
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      !isMicMuted ? 'bg-green-500/20' : 'bg-red-500/20'
                    }`}
                  >
                    <svg
                      className={`w-5 h-5 ${!isMicMuted ? 'text-green-400' : 'text-red-400'}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      {isMicMuted ? (
                        // Mic off icon
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15zM17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                        />
                      )}
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Microphone</p>
                    <p className="text-xs text-slate-400">
                      {!isMicMuted ? 'On' : 'Off'}
                    </p>
                  </div>
                </div>

                {/* Custom toggle button */}
                <button
                  type="button"
                  onClick={() => void toggleMic()}
                  title={isMicMuted ? 'Turn microphone on' : 'Turn microphone off'}
                  className={`
                    relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full
                    border-2 border-transparent transition-colors duration-200 ease-in-out
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                    ${!isMicMuted ? 'bg-green-500' : 'bg-slate-600'}
                  `}
                >
                  <span className="sr-only">Toggle microphone</span>
                  <span
                    className={`
                      pointer-events-none inline-block h-6 w-6 rounded-full bg-white shadow-lg
                      transform ring-0 transition duration-200 ease-in-out
                      ${!isMicMuted ? 'translate-x-5' : 'translate-x-0'}
                    `}
                  />
                </button>
              </div>

              {/* Device Selector */}
              <div className="p-4 bg-slate-800/30 rounded-lg space-y-4">
                {devicesReady ? (
                  <>
                    <div className="space-y-2">
                      <DeviceSelectorVideo title="Camera Device" visualType="list" />
                    </div>

                    <div className="space-y-2">
                      <DeviceSelectorAudioInput
                        title="Microphone Device"
                        visualType="list"
                        volumeIndicatorVisible={false}
                      />
                    </div>

                    {canSelectSpeaker && (
                      <div className="space-y-2">
                        <DeviceSelectorAudioOutput
                          title="Speaker Device"
                          visualType="list"
                          speakerTestVisible={false}
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-slate-400">
                    Allow microphone/camera access to load device options.
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