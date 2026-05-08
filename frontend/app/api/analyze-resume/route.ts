/**
 * ATS Resume Analysis API Route
 * Analyzes resume against job description using Grok
 */

import { NextRequest, NextResponse } from 'next/server';
import { grokJsonCompletion } from '@/lib/ai/grok';
import { ATSAnalysisSchema, ATS_SCORE_WEIGHTS, type ATSAnalysis } from '@/lib/schemas/ats.schema';

function clampScore(n: unknown): number {
  const v = typeof n === 'number' && Number.isFinite(n) ? n : 0;
  return Math.max(0, Math.min(100, Math.round(v)));
}

function deriveAtsSafetyLevel(score: number): 'excellent' | 'good' | 'fair' | 'poor' {
  if (score >= 85) return 'excellent';
  if (score >= 70) return 'good';
  if (score >= 55) return 'fair';
  return 'poor';
}

function computeCompleteness(resumeText: string): ATSAnalysis['completeness'] {
  const text = String(resumeText || '');
  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  const hasEmail = /\b[^\s@]+@[^\s@]+\.[^\s@]+\b/.test(text);
  const digits = text.replace(/\D/g, '');
  const hasPhone = digits.length >= 10;
  const hasName = lines.length > 0 && !/\b[^\s@]+@[^\s@]+\.[^\s@]+\b/.test(lines[0]);

  const hasSummaryLike = lines.some((l) => l.length >= 80 && !l.includes('@'));
  const hasExperienceLike = lines.some((l) => /\sat\s.+\(/.test(l) || /\sat\s/.test(l));
  const hasEducationLike = lines.some((l) => l.includes(' - ') || /\b(university|institute|college|school)\b/i.test(l));
  const hasSkillsLike = lines.some((l) => l.length <= 28 && /^[\w+.#-]+(?:\s[\w+.#-]+)?$/.test(l));
  const hasProjectsLike = lines.some((l) => /:\s+\S/.test(l));

  const requiredSections: ATSAnalysis['completeness']['requiredSections'] = [
    {
      section: 'Personal Info',
      present: Boolean(hasName || hasEmail || hasPhone),
      quality: hasEmail && hasPhone ? 'excellent' : (hasEmail || hasPhone) ? 'good' : 'missing',
    },
    {
      section: 'Summary',
      present: Boolean(hasSummaryLike),
      quality: hasSummaryLike ? 'good' : 'missing',
    },
    {
      section: 'Experience',
      present: Boolean(hasExperienceLike),
      quality: hasExperienceLike ? 'good' : 'missing',
    },
    {
      section: 'Projects',
      present: Boolean(hasProjectsLike),
      quality: hasProjectsLike ? 'good' : 'missing',
    },
    {
      section: 'Education',
      present: Boolean(hasEducationLike),
      quality: hasEducationLike ? 'good' : 'missing',
    },
    {
      section: 'Skills',
      present: Boolean(hasSkillsLike),
      quality: hasSkillsLike ? 'good' : 'missing',
    },
  ];

  const presentCount = requiredSections.filter((s) => s.present).length;
  const score = Math.round((presentCount / requiredSections.length) * 100);

  return { score, requiredSections };
}

function buildSchemaCompliantAnalysis(params: {
  parsedData: {
    overallScore?: number;
    breakdown?: { keywords?: number; skills?: number; experience?: number; format?: number; aiAnalysis?: number };
    strengths?: string[];
    weaknesses?: string[];
    suggestions?: string[];
    criticalIssues?: Array<{ issue: string; severity: string }>;
    missingKeywords?: Array<{ keyword: string }>;
    matchedKeywords?: Array<{ keyword: string }>;
  };
  hasJobDescription: boolean;
  resumeText: string;
}): ATSAnalysis {
  const { parsedData, hasJobDescription, resumeText } = params;

  const keywordScore = clampScore(parsedData.breakdown?.keywords);
  const skillsScore = clampScore(parsedData.breakdown?.skills);
  const experienceScore = clampScore(parsedData.breakdown?.experience);
  const formatScore = clampScore(parsedData.breakdown?.format);
  const aiScore = clampScore(parsedData.breakdown?.aiAnalysis);
  const overallScore = clampScore(parsedData.overallScore);

  const wc = String(resumeText || '').trim().split(/\s+/).filter(Boolean).length;
  const completeness = computeCompleteness(resumeText);

  const analysis: ATSAnalysis = {
    overallScore,
    scoreFormula: {
      keywordMatch: { score: keywordScore, weight: ATS_SCORE_WEIGHTS.keywordMatch },
      skillCoverage: { score: skillsScore, weight: ATS_SCORE_WEIGHTS.skillCoverage },
      experienceAlignment: { score: experienceScore, weight: ATS_SCORE_WEIGHTS.experienceAlignment },
      formatting: { score: formatScore, weight: ATS_SCORE_WEIGHTS.formatting },
      aiQuality: { score: aiScore, weight: ATS_SCORE_WEIGHTS.aiQuality },
    },

    // Detailed breakdowns (populated with safe defaults)
    keywordMatch: {
      score: keywordScore,
      breakdown: {
        requiredSkills: { score: keywordScore, matched: 0, total: 0, matchedKeywords: [], missingKeywords: [], weight: 0.4 },
        preferredSkills: { score: keywordScore, matched: 0, total: 0, matchedKeywords: [], missingKeywords: [], weight: 0.3 },
        tools: { score: keywordScore, matched: 0, total: 0, matchedKeywords: [], missingKeywords: [], weight: 0.2 },
        industryTerms: { score: keywordScore, matched: 0, total: 0, matchedKeywords: [], weight: 0.1 },
      },
      overusedKeywords: [],
      suggestions: [],
    },

    skillCoverage: {
      score: skillsScore,
      technical: { score: skillsScore, present: [], missing: [], depth: 'intermediate', evidence: [] },
      soft: { score: skillsScore, present: [], missing: [], evidence: [] },
      experienceAlignment: { score: experienceScore, resumeYears: 0, match: 'optimal', message: 'Experience alignment not fully computed' },
    },

    experienceAlignment: {
      score: experienceScore,
      roleRelevance: { score: experienceScore, relevantRoles: 0, totalRoles: 0, explanation: 'Role relevance not fully computed' },
      careerProgression: { score: experienceScore, trend: 'unclear', gaps: [], explanation: 'Career progression not fully computed' },
      industryAlignment: { score: experienceScore, relevantExperience: [], explanation: 'Industry alignment not fully computed' },
    },

    formatting: {
      score: formatScore,
      checks: {
        parsability: { score: formatScore, issues: [], passed: true },
        structure: { score: formatScore, hasClearSections: true, sectionOrder: 'acceptable', issues: [] },
        content: {
          score: formatScore,
          wordCount: wc,
          optimalRange: { min: 400, max: 900 },
          bulletPoints: 0,
          actionVerbs: 0,
          metrics: 0,
          issues: [],
        },
        consistency: { score: formatScore, dateFormat: true, bulletStyle: true, verbTense: true, issues: [] },
      },
      atsSafetyLevel: deriveAtsSafetyLevel(formatScore),
    },

    aiQuality: {
      score: aiScore,
      impactAnalysis: { score: aiScore, quantifiedAchievements: 0, actionVerbUsage: 'good', suggestions: [] },
      professionalTone: { score: aiScore, issues: [], strengths: [] },
      clarity: { score: aiScore, readabilityLevel: 'professional', verbosity: 'optimal', suggestions: [] },
      authenticity: { score: 100, suspiciousPatterns: [], natural: true },
    },

    strengths: Array.isArray(parsedData.strengths) ? parsedData.strengths : [],
    weaknesses: Array.isArray(parsedData.weaknesses) ? parsedData.weaknesses : [],

    criticalIssues: (parsedData.criticalIssues || []).map((issue) => ({
      issue: issue.issue,
      impact: issue.severity === 'high' ? 'high' : issue.severity === 'low' ? 'low' : 'medium',
      fix: `Address: ${issue.issue}`,
    })),

    recommendations: (parsedData.suggestions || []).map((s: string, i: number) => ({
      priority: 'medium',
      category: 'general',
      title: `Recommendation ${i + 1}`,
      description: s,
      expectedImpact: '+2-5 points',
      actionSteps: [s],
    })),

    completeness,

    jobMatch: {
      hasJobDescription,
      matchLevel: getMatchLevel(overallScore),
      matchPercentage: hasJobDescription ? overallScore : undefined,
      topMissingKeywords: (parsedData.missingKeywords || []).slice(0, 10).map((k) => k.keyword),
      competitiveAdvantage: (parsedData.matchedKeywords || []).slice(0, 5).map((k) => k.keyword),
    },

    analyzedAt: new Date().toISOString(),
    analysisVersion: '2.0.0',
  };

  return analysis;
}

export async function POST(request: NextRequest) {
  try {
    const { resumeText, jobDescription } = await request.json();

    if (!resumeText) {
      return NextResponse.json(
        { error: 'Resume text is required' },
        { status: 400 }
      );
    }

    const hasJobDescription = !!jobDescription && jobDescription.trim().length > 0;

    const prompt = `You are an expert ATS (Applicant Tracking System) analyzer. Analyze this resume${hasJobDescription ? ' against the job description' : ''} and provide detailed scoring.

Resume:
${resumeText}

${hasJobDescription ? `Job Description:\n${jobDescription}\n` : ''}

Analyze the resume and return ONLY valid JSON (no markdown, no code blocks) with this structure:
{
  "overallScore": number (0-100),
  "breakdown": {
    "keywords": number (0-100, keyword match score),
    "skills": number (0-100, skill coverage score),
    "experience": number (0-100, experience alignment),
    "format": number (0-100, formatting quality),
    "aiAnalysis": number (0-100, AI quality score)
  },
  "strengths": ["array of 3-5 key strengths"],
  "weaknesses": ["array of 3-5 areas for improvement"],
  "missingKeywords": [
    {"keyword": "Python", "category": "technical", "importance": "high"},
    {"keyword": "Leadership", "category": "soft", "importance": "medium"}
  ],
  "matchedKeywords": [
    {"keyword": "JavaScript", "frequency": 5, "context": "experience"},
    {"keyword": "React", "frequency": 3, "context": "skills"}
  ],
  "suggestions": [
    "Add more quantifiable metrics to achievements",
    "Include specific project outcomes",
    "Strengthen the professional summary"
  ],
  "criticalIssues": [
    {"issue": "Missing contact information", "severity": "high"},
    {"issue": "No quantifiable achievements", "severity": "medium"}
  ]
}

Scoring Guidelines:
- Keywords (${ATS_SCORE_WEIGHTS.keywordMatch * 100}%): Match with job description keywords
- Skills (${ATS_SCORE_WEIGHTS.skillCoverage * 100}%): Technical and soft skills coverage
- Experience (${ATS_SCORE_WEIGHTS.experienceAlignment * 100}%): Relevance and progression
- Format (${ATS_SCORE_WEIGHTS.formatting * 100}%): ATS-friendly structure
- AI Quality (${ATS_SCORE_WEIGHTS.aiQuality * 100}%): Content quality and impact

${hasJobDescription ? 'Focus on job-specific keyword matching and requirement alignment.' : 'Focus on general ATS best practices and resume quality.'}

Return ONLY the JSON object.`;

    const parsedData = await grokJsonCompletion<{
      overallScore?: number;
      breakdown?: { keywords?: number; skills?: number; experience?: number; format?: number; aiAnalysis?: number };
      strengths?: string[];
      weaknesses?: string[];
      suggestions?: string[];
      criticalIssues?: Array<{ issue: string; severity: string }>;
      missingKeywords?: Array<{ keyword: string }>;
      matchedKeywords?: Array<{ keyword: string }>;
    }>(
      [
        { role: 'system', content: 'You are a strict JSON generator. Return only valid JSON.' },
        { role: 'user', content: prompt },
      ],
      { temperature: 0.2 }
    );

    const analysisCandidate = buildSchemaCompliantAnalysis({
      parsedData,
      hasJobDescription,
      resumeText,
    });

    const validated = ATSAnalysisSchema.safeParse(analysisCandidate);
    const analysis = validated.success ? validated.data : analysisCandidate;

    return NextResponse.json({
      success: true,
      analysis,
    });

  } catch (error: unknown) {
    console.error('ATS Analysis Error:', error);
    const errMsg = error instanceof Error ? error.message : String(error);

    // Detect quota / rate-limit errors and surface a clear status code
    if (errMsg.includes('429') || errMsg.toLowerCase().includes('quota') || errMsg.toLowerCase().includes('too many requests')) {
      const retryMatch = errMsg.match(/retry[^\d]*(\d+)s/i) || errMsg.match(/(\d+)s\b/);
      const waitSecs = retryMatch ? retryMatch[1] : '60';
      return NextResponse.json(
        { error: `AI rate limit reached. Please wait ${waitSecs} seconds and try again.` },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to analyze resume', details: errMsg },
      { status: 500 }
    );
  }
}

function getMatchLevel(score: number): 'excellent' | 'strong' | 'moderate' | 'weak' | 'poor' {
  if (score >= 90) return 'excellent';
  if (score >= 75) return 'strong';
  if (score >= 60) return 'moderate';
  if (score >= 40) return 'weak';
  return 'poor';
}
