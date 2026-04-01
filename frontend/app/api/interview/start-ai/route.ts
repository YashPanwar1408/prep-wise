/**
 * API Route: Start AI Interview
 * POST /api/interview/start-ai
 * Creates VAPI assistant and Stream call
 */

import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createVapiAssistant } from '@/lib/vapi';
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

    // Create VAPI assistant
    let assistantId;
    try {
      assistantId = await createVapiAssistant({
        domain: interview.domain,
        duration: interview.duration,
        resumeData: interview.resumeData || undefined,
        jobDescription: interview.jobDescription || undefined,
      });
    } catch (vapiError) {
      console.error('VAPI assistant creation failed:', vapiError);
      return NextResponse.json(
        { error: 'Failed to create AI assistant. Please try again.' },
        { status: 500 }
      );
    }

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
      assistantId,
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
