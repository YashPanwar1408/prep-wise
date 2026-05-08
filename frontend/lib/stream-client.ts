import { StreamVideoClient } from '@stream-io/video-react-sdk';

type StreamBrowserUser = {
  id: string;
  name: string;
  image?: string;
};

export function getOrCreateStreamClient(args: {
  apiKey: string;
  token: string;
  user: StreamBrowserUser;
}) {
  const { apiKey, token, user } = args;

  if (!apiKey) {
    throw new Error('Missing Stream API key');
  }

  return StreamVideoClient.getOrCreateInstance({
    apiKey,
    token,
    user,
  });
}

export async function disconnectStreamClient(client: StreamVideoClient | null) {
  if (!client) return;

  try {
    await client.disconnectUser();
  } catch (error) {
    console.warn('Failed to disconnect Stream client cleanly:', error);
  }
}
