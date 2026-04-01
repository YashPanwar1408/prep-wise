/**
 * API Route: Create GetStream Token
 * POST /api/interview/create-stream-token
 */

import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { generateStreamToken } from '@/lib/stream';

export async function POST() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Generate Stream token for this user
    const token = await generateStreamToken(userId);

    return NextResponse.json({
      success: true,
      token,
      apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY,
      userId,
    });
  } catch (error) {
    console.error('Error generating Stream token:', error);
    return NextResponse.json(
      { error: 'Failed to generate Stream token' },
      { status: 500 }
    );
  }
}
