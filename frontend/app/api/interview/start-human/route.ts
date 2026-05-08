import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { ensureDatabaseUser } from '@/lib/ensure-user';
import { prisma } from '@/lib/prisma';
import { createStreamCall } from '@/lib/stream';

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { interviewId } = body;

    if (!interviewId) {
      return NextResponse.json({ error: "Interview ID is required" }, { status: 400 });
    }

    await ensureDatabaseUser(userId);

    // Fetch the interview session
    const interview = await prisma.interview.findUnique({
      where: { id: interviewId },
      include: { user: true }
    });

    if (!interview) {
      return NextResponse.json({ error: "Interview not found" }, { status: 404 });
    }

    if (interview.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized access to interview" }, { status: 403 });
    }

    let streamWarning: string | null = null;
    const callId = `human-${interviewId}`;
    try {
      await createStreamCall(callId, userId);
    } catch (streamError) {
      console.warn('Human interview Stream call setup failed, room will self-create on join:', streamError);
      streamWarning = 'Stream call will be created when the room is joined.';
    }

    // Update interview session status
    await prisma.interview.update({
      where: { id: interviewId },
      data: {
        status: 'IN_PROGRESS',
        startedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      callId,
      interviewId,
      streamWarning,
    });

  } catch (error) {
    console.error('Error starting human interview:', error);
    return NextResponse.json(
      { error: "Failed to start human interview" },
      { status: 500 }
    );
  }
}
