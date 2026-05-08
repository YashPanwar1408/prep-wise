import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { buildVapiAssistantPayload } from '@/lib/vapi';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const interview = await prisma.interview.findUnique({
      where: { id },
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

    // Use resume stored on the interview, or fall back to user's latest saved resume
    let resumeData = interview.resumeData;

    if (!resumeData) {
      try {
        const savedResume = await prisma.resume.findFirst({
          where: { userId },
          orderBy: { createdAt: 'desc' },
        });
        if (savedResume?.data) {
          resumeData = savedResume.data;
          console.log('Using saved resume as fallback for VAPI config');
        }
      } catch (e) {
        console.warn('Could not fetch fallback resume:', e);
      }
    }

    const config = buildVapiAssistantPayload({
      domain: interview.domain,
      duration: interview.duration,
      resumeData: resumeData || undefined,
      jobDescription: interview.jobDescription || undefined,
    });

    return NextResponse.json({
      success: true,
      config,
      hasResume: !!resumeData,
    });
  } catch (error) {
    console.error('Error fetching vapi config:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vapi config' },
      { status: 500 }
    );
  }
}
