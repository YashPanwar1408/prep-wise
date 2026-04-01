/**
 * GetStream Video SDK Server Utilities
 * Used for generating Stream tokens and managing calls
 */

import { StreamClient } from '@stream-io/node-sdk';

// Initialize Stream client
const apiKey = process.env.STREAM_API_KEY!;
const secret = process.env.STREAM_SECRET!;

if (!apiKey || !secret) {
  throw new Error('STREAM_API_KEY and STREAM_SECRET must be set in environment variables');
}

export const streamClient = new StreamClient(apiKey, secret);

/**
 * Generate a Stream token for a user
 */
export async function generateStreamToken(userId: string): Promise<string> {
  // Subtract 60 seconds from current time to avoid clock skew issues
  const issued = Math.floor(Date.now() / 1000) - 60;
  const exp = issued + 3660; // 1 hour from adjusted iat
  
  const token = streamClient.createToken(userId, exp, issued);
  return token;
}

/**
 * Create a Stream call (video room)
 */
export async function createStreamCall(callId: string, userId: string) {
  const call = streamClient.video.call('default', callId);
  
  await call.getOrCreate({
    data: {
      created_by_id: userId,
      settings_override: {
        audio: { 
          mic_default_on: true,
          speaker_default_on: true,
          default_device: 'speaker',
        },
        video: { 
          camera_default_on: true,
        },
        recording: {
          mode: 'disabled',
        },
      },
    },
  });
  
  return call;
}

/**
 * Get call details
 */
export async function getStreamCall(callId: string) {
  const call = streamClient.video.call('default', callId);
  return await call.get();
}

/**
 * End a call and get recording URL
 */
export async function endStreamCall(callId: string) {
  const call = streamClient.video.call('default', callId);
  await call.end();
  
  // Get recordings
  const recordings = await call.listRecordings();
  const recordingUrl = recordings.recordings?.[0]?.url || null;
  
  return { recordingUrl };
}
