/**
 * API Route: Generate Interview Report
 * POST /api/interview/generate-report
 */

import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateInterviewReport } from '@/lib/grok';

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

    // Only generate reports for AI interviews
    if (interview.type !== 'AI') {
      return NextResponse.json(
        { error: 'Reports are only available for AI interviews' },
        { status: 400 }
      );
    }

    // Generate evaluation using Grok
    const evaluation = await generateInterviewReport({
      domain: interview.domain,
      transcript: (interview.transcript as unknown[]) || [],
      resumeData: interview.resumeData || undefined,
      jobDescription: interview.jobDescription || undefined,
    });

    // Update interview with scores and feedback
    const updatedInterview = await prisma.interview.update({
      where: { id: interviewId },
      data: {
        overallScore: evaluation.overallScore,
        technicalScore: evaluation.technicalScore,
        communicationScore: evaluation.communicationScore,
        confidenceScore: evaluation.confidenceScore,
        strengths: evaluation.strengths,
        weaknesses: evaluation.weaknesses,
        improvements: evaluation.improvements,
        topicsToRevise: evaluation.topicsToRevise,
        detailedFeedback: evaluation.detailedFeedback,
      },
    });

    return NextResponse.json({
      success: true,
      interview: updatedInterview,
      evaluation,
    });
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}
