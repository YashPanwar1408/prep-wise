import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
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

    // Ensure user exists in database
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: { id: userId, email: '' }
    });

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

    // Create Stream call
    const callId = `human-${interviewId}`;
    await createStreamCall(callId, userId);

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
      interviewId
    });

  } catch (error) {
    console.error('Error starting human interview:', error);
    return NextResponse.json(
      { error: "Failed to start human interview" },
      { status: 500 }
    );
  }
}