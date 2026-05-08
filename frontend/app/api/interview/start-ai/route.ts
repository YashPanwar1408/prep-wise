/**
 * API Route: Start AI Interview
 * POST /api/interview/start-ai
 * Creates VAPI assistant and Stream call
 */

import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createStreamCall } from '@/lib/stream';

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { interviewId } = body;

    if (!interviewId) {
      return NextResponse.json(
        { error: 'Missing interviewId' },
        { status: 400 }
      );
    }

    // Get interview details
    const interview = await prisma.interview.findUnique({
      where: { id: interviewId },
    });

    if (!interview) {
      return NextResponse.json(
        { error: 'Interview not found' },
        { status: 404 }
      );
    }

    if (interview.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // VAPI Assistant is now handled entirely on the frontend using transient configs.

    // Create Stream call
    const callId = `interview-${interviewId}`;
    try {
      await createStreamCall(callId, userId);
    } catch (streamError) {
      console.error('Stream call creation failed:', streamError);
      // Continue anyway - call might already exist
    }

    // Update interview with room/call IDs
    const updatedInterview = await prisma.interview.update({
      where: { id: interviewId },
      data: {
        streamRoomId: callId,
        streamCallId: callId,
        status: 'IN_PROGRESS',
        startedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      interview: updatedInterview,
      callId,
    });
  } catch (error) {
    console.error('Error starting AI interview:', error);
    return NextResponse.json(
      { error: 'Failed to start AI interview' },
      { status: 500 }
    );
  }
}
