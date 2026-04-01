/**
 * Grok AI Utilities for Interview Evaluation
 */

import { grokJsonCompletion } from '@/lib/ai/grok';

/**
 * Generate interview evaluation report
 */
export async function generateInterviewReport(data: {
  domain: string;
  transcript: unknown[];
  resumeData?: unknown;
  jobDescription?: string;
}) {
  const { domain, transcript, resumeData, jobDescription } = data;

  const prompt = `You are an expert technical interviewer evaluating a ${domain} interview.

INTERVIEW TRANSCRIPT:
${JSON.stringify(transcript, null, 2)}

${resumeData ? `CANDIDATE RESUME:\n${JSON.stringify(resumeData, null, 2)}\n` : ''}
${jobDescription ? `JOB DESCRIPTION:\n${jobDescription}\n` : ''}

TASK: Provide a comprehensive evaluation with:

1. OVERALL SCORE (0-100): Holistic assessment
2. TECHNICAL SCORE (0-100): Technical knowledge and accuracy
3. COMMUNICATION SCORE (0-100): Clarity and articulation
4. CONFIDENCE SCORE (0-100): Confidence and composure

5. STRENGTHS (3-5 bullet points): What the candidate did well

6. WEAKNESSES (3-5 bullet points): Areas needing improvement

7. SUGGESTED IMPROVEMENTS (3-5 bullet points): Actionable advice

8. TOPICS TO REVISE (3-5 topics): Specific subjects to study

9. DETAILED FEEDBACK (2-3 paragraphs): In-depth analysis

Return your response as valid JSON with this structure:
{
  "overallScore": number,
  "technicalScore": number,
  "communicationScore": number,
  "confidenceScore": number,
  "strengths": string[],
  "weaknesses": string[],
  "improvements": string[],
  "topicsToRevise": string[],
  "detailedFeedback": string
}`;

  try {
    return await grokJsonCompletion<{
      overallScore: number;
      technicalScore: number;
      communicationScore: number;
      confidenceScore: number;
      strengths: string[];
      weaknesses: string[];
      improvements: string[];
      topicsToRevise: string[];
      detailedFeedback: string;
    }>(
      [
        { role: 'system', content: 'You are a strict JSON generator. Return only valid JSON.' },
        { role: 'user', content: prompt },
      ],
      { temperature: 0.3 }
    );
  } catch (error) {
    console.error('Error generating interview report:', error);
    return {
      overallScore: 0,
      technicalScore: 0,
      communicationScore: 0,
      confidenceScore: 0,
      strengths: [],
      weaknesses: [],
      improvements: [],
      topicsToRevise: [],
      detailedFeedback: `Interview evaluation could not be generated. ${error instanceof Error ? error.message : 'Unknown error'}`,
      error: true,
    };
  }
}
