/**
 * Grok AI Service for Interview Intelligence
 * Handles resume analysis, question generation, and feedback
 */

import { grokJsonCompletion, grokTextCompletion } from '@/lib/ai/grok';
import type { InterviewFeedback } from '@/lib/schemas/interview.schema';

// ============================================================================
// RESUME & JD SUMMARIZATION
// ============================================================================

export async function summarizeResume(resumeData: string): Promise<string> {
  const prompt = `Analyze this resume and create a concise technical summary (3-4 sentences) highlighting:
- Key technical skills and expertise
- Years of experience and seniority level
- Notable projects or achievements
- Primary tech stack

Resume Data:
${resumeData}

Provide ONLY the summary, no additional commentary.`;

  return grokTextCompletion(
    [
      { role: 'system', content: 'You are an expert technical recruiter.' },
      { role: 'user', content: prompt },
    ],
    { temperature: 0.3 }
  );
}

export async function summarizeJobDescription(jd: string): Promise<string> {
  const prompt = `Analyze this job description and extract key requirements (3-4 sentences):
- Required technical skills and technologies
- Experience level needed
- Key responsibilities
- Must-have competencies

Job Description:
${jd}

Provide ONLY the summary, no additional commentary.`;

  return grokTextCompletion(
    [
      { role: 'system', content: 'You are an expert technical recruiter.' },
      { role: 'user', content: prompt },
    ],
    { temperature: 0.3 }
  );
}

// ============================================================================
// INTERVIEW SYSTEM PROMPT GENERATION
// ============================================================================

interface InterviewContext {
  role: string;
  duration: string;
  resumeSummary: string;
  jdSummary?: string;
}

export function generateInterviewSystemPrompt(context: InterviewContext): string {
  const roleDescriptions: Record<string, string> = {
    frontend: 'Frontend Software Engineer focusing on React, UI/UX, and modern web technologies',
    backend: 'Backend Software Engineer focusing on APIs, databases, and server architectures',
    fullstack: 'Full-Stack Engineer comfortable with both frontend and backend development',
    'data-science': 'Data Scientist focusing on ML, statistics, and data analysis',
    'ml-engineer': 'Machine Learning Engineer focusing on model development and deployment',
    devops: 'DevOps Engineer focusing on CI/CD, infrastructure, and cloud platforms',
    mobile: 'Mobile Developer focusing on iOS/Android native or React Native',
    qa: 'QA Engineer focusing on testing strategies and automation',
    'system-design': 'System Design focusing on scalable architecture and distributed systems',
  };

  return `You are an expert technical interviewer conducting a mock interview for a ${roleDescriptions[context.role] || 'Software Engineer'} position.

CANDIDATE BACKGROUND:
${context.resumeSummary}

${context.jdSummary ? `JOB REQUIREMENTS:\n${context.jdSummary}\n` : ''}

INTERVIEW GUIDELINES:
1. Duration: ${context.duration} minutes - Ask 6-8 targeted questions
2. Start with a warm, professional greeting
3. Ask ONE question at a time and wait for complete answers
4. Tailor questions based on candidate's experience level
5. Start with easier questions, gradually increase difficulty
6. Ask follow-up questions to probe deeper understanding
7. Focus on both technical knowledge AND problem-solving approach
8. Be encouraging but professionally honest
9. End with "Do you have any questions for me?" before concluding
10. Maintain a conversational, natural tone

QUESTION CATEGORIES (mix these):
- Technical fundamentals
- Real-world scenarios from resume projects
- Problem-solving challenges
- Best practices and trade-offs
- Behavioral aspects of technical work

STYLE:
- Speak clearly and professionally
- Show genuine interest in answers
- Provide brief acknowledgment before next question
- Be patient and allow thinking time
- Avoid being too formal or robotic

Begin by greeting the candidate warmly and starting with your first question.`;
}

// ============================================================================
// POST-INTERVIEW AI FEEDBACK GENERATION
// ============================================================================

interface FeedbackContext {
  role: string;
  transcript: string;
  resumeSummary: string;
  jdSummary?: string;
  duration: string;
}

export async function generateInterviewFeedback(
  context: FeedbackContext
): Promise<Omit<InterviewFeedback, 'sessionId' | 'createdAt'>> {
  const prompt = `You are an expert technical interview evaluator. Analyze this interview transcript and provide comprehensive feedback.

ROLE: ${context.role}
DURATION: ${context.duration} minutes

CANDIDATE BACKGROUND:
${context.resumeSummary}

${context.jdSummary ? `JOB REQUIREMENTS:\n${context.jdSummary}\n` : ''}

INTERVIEW TRANSCRIPT:
${context.transcript}

Provide a detailed JSON evaluation with the following structure:
{
  "overallScore": <number 0-100>,
  "skillRatings": [
    {"skill": "<specific technical skill>", "rating": <0-10>, "comment": "<brief note>"}
  ],
  "strengths": ["<strength 1>", "<strength 2>", ...],
  "weaknesses": ["<weakness 1>", "<weakness 2>", ...],
  "improvements": ["<actionable improvement 1>", "<actionable improvement 2>", ...],
  "communicationClarity": <0-10>,
  "technicalDepth": <0-10>,
  "confidence": <0-10>,
  "roleAlignment": <0-10>,
  "suggestedTopics": ["<topic 1>", "<topic 2>", ...],
  "learningRoadmap": "<markdown formatted learning path>",
  "aiSummary": "<2-3 sentence overall assessment>"
}

EVALUATION CRITERIA:
- Technical accuracy and depth of answers
- Problem-solving approach and thought process
- Communication clarity and structure
- Confidence and handling of uncertainty
- Alignment with role requirements
- Areas for improvement with specific suggestions

Be honest but constructive. Focus on actionable feedback.

RESPOND ONLY WITH VALID JSON, NO ADDITIONAL TEXT.`;

  return grokJsonCompletion<Omit<InterviewFeedback, 'sessionId' | 'createdAt'>>(
    [
      { role: 'system', content: 'You are a strict JSON generator. Return only valid JSON.' },
      { role: 'user', content: prompt },
    ],
    { temperature: 0.7, maxTokens: 2048 }
  );
}

// ============================================================================
// INTERVIEW QUESTION SUGGESTION (OPTIONAL HELPER)
// ============================================================================

export async function generateQuestionSuggestions(
  role: string,
  resumeSummary: string,
  count: number = 8
): Promise<string[]> {
  const prompt = `Generate ${count} interview questions for a ${role} position.

CANDIDATE BACKGROUND:
${resumeSummary}

Requirements:
- Start easy, increase difficulty gradually
- Mix theory, practical scenarios, and problem-solving
- Reference candidate's experience where possible
- Be specific and actionable
- Avoid generic questions

Return as JSON array of strings: ["question 1", "question 2", ...]`;

  return grokJsonCompletion<string[]>(
    [
      { role: 'system', content: 'You are a strict JSON generator. Return only valid JSON array.' },
      { role: 'user', content: prompt },
    ],
    { temperature: 0.5 }
  );
}
