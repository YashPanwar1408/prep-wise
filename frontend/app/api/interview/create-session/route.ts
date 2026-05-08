/**
 * API Route: Create Interview Session
 * POST /api/interview/create-session
 */

import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { ensureDatabaseUser } from '@/lib/ensure-user';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      type, // "AI" or "HUMAN"
      domain,
      duration,
      resumeData,
      jobDescription,
    } = body;

    // Validate required fields
    if (!type || !domain || !duration) {
      return NextResponse.json(
        { error: 'Missing required fields: type, domain, duration' },
        { status: 400 }
      );
    }

    // Ensure user exists in database (Clerk → Prisma sync)
    await ensureDatabaseUser(userId);

    // Create interview session
    const interview = await prisma.interview.create({
      data: {
        userId,
        type,
        domain,
        duration,
        status: 'SETUP',
        resumeData: resumeData || null,
        jobDescription: jobDescription || null,
      },
    });

    return NextResponse.json({
      success: true,
      interview,
    });
  } catch (error) {
    console.error('Error creating interview session:', error);
    return NextResponse.json(
      { error: 'Failed to create interview session' },
      { status: 500 }
    );
  }
}
