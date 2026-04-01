/**
 * Server Actions for Resume Processing
 * Uses Grok to parse extracted PDF text into structured resume data
 * This file uses Next.js Server Actions to securely process resume data
 */

'use server';

import { grokTextCompletion } from '@/lib/ai/grok';
import type { Resume } from '@/lib/schemas/resume.schema';
import { nanoid } from 'nanoid';

/**
 * Parse extracted PDF text with Grok and return structured resume data
 * @param extractedText - The raw text extracted from a PDF resume
 * @returns Structured resume object conforming to Resume schema
 * @throws Error if parsing fails or API key is missing
 */
export async function parseResumeWithGrok(extractedText: string): Promise<Resume> {
  try {
    // Validate input
    if (!extractedText || extractedText.trim().length === 0) {
      throw new Error('No text provided for parsing');
    }

    if (extractedText.trim().length < 300) {
      throw new Error('Extracted text is too short (minimum 300 characters). Please ensure the PDF contains a full resume.');
    }

    console.log(`🤖 Parsing resume with Grok (${extractedText.length} characters)`);

    // Construct precise prompt for structured extraction
    const prompt = `You are an expert resume parser. Extract structured information from the following resume text and return it as valid JSON.

IMPORTANT RULES:
1. Return ONLY valid JSON - no markdown, no code blocks, no explanations
2. Use empty strings ("") for missing optional fields, never use null
3. Generate unique IDs for array items using the format: "exp_1", "edu_1", etc.
4. For dates, try to parse them into YYYY-MM format if possible, otherwise use the original text
5. Extract all skills into a flat array
6. Be thorough - extract ALL information available in the resume

Required JSON structure:
{
  "personalInfo": {
    "fullName": string,
    "email": string,
    "phone": string,
    "location": string,
    "linkedin": string,
    "github": string,
    "portfolio": string,
    "website": string
  },
  "summary": {
    "summary": string
  },
  "experience": [
    {
      "id": string,
      "company": string,
      "role": string,
      "location": string,
      "startDate": string,
      "endDate": string,
      "current": boolean,
      "description": string,
      "bullets": string[]
    }
  ],
  "education": [
    {
      "id": string,
      "school": string,
      "degree": string,
      "field": string,
      "location": string,
      "gpa": string,
      "graduationDate": string,
      "honors": string
    }
  ],
  "skills": {
    "categories": [],
    "flatSkills": string[]
  },
  "projects": [
    {
      "id": string,
      "title": string,
      "link": string,
      "technologies": string,
      "startDate": string,
      "endDate": string,
      "description": string,
      "current": boolean
    }
  ],
  "certifications": [
    {
      "id": string,
      "name": string,
      "issuer": string,
      "date": string,
      "expirationDate": string,
      "credentialId": string,
      "link": string
    }
  ],
  "achievements": [
    {
      "id": string,
      "title": string,
      "description": string,
      "date": string
    }
  ],
  "languages": [
    {
      "id": string,
      "language": string,
      "proficiency": string
    }
  ]
}

RESUME TEXT TO PARSE:
${extractedText.substring(0, 30000)}
`;

    // Generate content with Grok — retry up to 2 times on parse failures.
    // API-level errors (429, model unavailable, etc.) are detected and surfaced immediately.
    const MAX_RETRIES = 2;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let parsedData: any;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        let responseText = await grokTextCompletion(
          [
            {
              role: 'system',
              content: 'You are a strict JSON generator. Return only valid JSON.',
            },
            { role: 'user', content: prompt },
          ],
          { temperature: 0.2 }
        );

        console.log(`📝 Grok response (attempt ${attempt + 1}): ${responseText.length} chars`);
        console.log(`📝 Raw response preview: ${responseText.substring(0, 200)}`);

        // Strip markdown code fences — model may still wrap JSON in ```json ... ```
        // even when responseMimeType is set
        responseText = responseText
          .replace(/^```json\s*/i, '')
          .replace(/^```\s*/i, '')
          .replace(/\s*```$/i, '')
          .trim();

        // Extract the outermost JSON object if there's any surrounding text
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) responseText = jsonMatch[0];

        parsedData = JSON.parse(responseText);
        break; // Success
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : String(err);
        console.error(`❌ Attempt ${attempt + 1} error:`, errMsg);

        // ── API / Rate-limit errors — don't retry, surface immediately ──────
        if (
          errMsg.includes('429') ||
          errMsg.includes('quota') ||
          errMsg.includes('QUOTA') ||
          errMsg.toLowerCase().includes('too many requests') ||
          errMsg.includes('403') ||
          errMsg.includes('API_KEY') ||
          errMsg.includes('not found') ||
          errMsg.includes('NOT_FOUND')
        ) {
          // Extract retry-after seconds from the response if present
          const retryMatch = errMsg.match(/retryDelay[^"]*"(\d+)s"/) ||
            errMsg.match(/retry[^\d]*(\d+)s/i) ||
            errMsg.match(/"(\d+)s"/);
          const waitSecs = retryMatch ? retryMatch[1] : '60';

          if (errMsg.includes('429') || errMsg.toLowerCase().includes('quota') || errMsg.toLowerCase().includes('too many requests')) {
            throw new Error(`AI rate limit reached. Please wait ${waitSecs} seconds then try again.`);
          }
          if (errMsg.includes('403') || errMsg.includes('API_KEY')) {
            throw new Error('Invalid Grok API key. Please check your GROK_API_KEY environment variable.');
          }
          throw new Error(`Grok API error: ${errMsg.split('\n')[0]}`);
        }

        // ── JSON parse failure — retry with back-off ─────────────────────
        if (attempt === MAX_RETRIES) {
          throw new Error(`AI returned unparseable response after ${MAX_RETRIES + 1} attempts. Raw error: ${errMsg.substring(0, 200)}`);
        }
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
      }
    }

    // Validate and sanitize the parsed data
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const resume: Resume = {
      personalInfo: {
        fullName: parsedData.personalInfo?.fullName || '',
        email: parsedData.personalInfo?.email || '',
        phone: parsedData.personalInfo?.phone || '',
        location: parsedData.personalInfo?.location || '',
        linkedin: parsedData.personalInfo?.linkedin || '',
        github: parsedData.personalInfo?.github || '',
        portfolio: parsedData.personalInfo?.portfolio || '',
        website: parsedData.personalInfo?.website || '',
      },
      summary: parsedData.summary?.summary
        ? { summary: parsedData.summary.summary }
        : undefined,
      experience: Array.isArray(parsedData.experience)
        ? parsedData.experience.map((exp: any) => ({
          id: exp.id || `exp_${nanoid(6)}`,
          company: exp.company || '',
          role: exp.role || '',
          location: exp.location || '',
          startDate: exp.startDate || '',
          endDate: exp.endDate || '',
          current: exp.current === true,
          description: exp.description || '',
          bullets: Array.isArray(exp.bullets) ? exp.bullets : [],
        }))
        : [],
      education: Array.isArray(parsedData.education)
        ? parsedData.education.map((edu: any) => ({
          id: edu.id || `edu_${nanoid(6)}`,
          school: edu.school || '',
          degree: edu.degree || '',
          field: edu.field || '',
          location: edu.location || '',
          gpa: edu.gpa || '',
          graduationDate: edu.graduationDate || '',
          honors: edu.honors || '',
        }))
        : [],
      skills: {
        categories: Array.isArray(parsedData.skills?.categories)
          ? parsedData.skills.categories
          : [],
        flatSkills: Array.isArray(parsedData.skills?.flatSkills)
          ? parsedData.skills.flatSkills
          : [],
      },
      projects: Array.isArray(parsedData.projects)
        ? parsedData.projects.map((proj: any) => ({
          id: proj.id || `proj_${nanoid(6)}`,
          title: proj.title || '',
          link: proj.link || '',
          technologies: proj.technologies || '',
          startDate: proj.startDate || '',
          endDate: proj.endDate || '',
          description: proj.description || '',
          current: proj.current === true,
        }))
        : [],
      certifications: Array.isArray(parsedData.certifications)
        ? parsedData.certifications.map((cert: any) => ({
          id: cert.id || `cert_${nanoid(6)}`,
          name: cert.name || '',
          issuer: cert.issuer || '',
          date: cert.date || '',
          expirationDate: cert.expirationDate || '',
          credentialId: cert.credentialId || '',
          link: cert.link || '',
        }))
        : [],
      achievements: Array.isArray(parsedData.achievements)
        ? parsedData.achievements.map((ach: any) => ({
          id: ach.id || `ach_${nanoid(6)}`,
          title: ach.title || '',
          description: ach.description || '',
          date: ach.date || '',
        }))
        : [],
      languages: Array.isArray(parsedData.languages)
        ? parsedData.languages.map((lang: any) => ({
          id: lang.id || `lang_${nanoid(6)}`,
          language: lang.language || '',
          proficiency: lang.proficiency || '',
        }))
        : [],
    };
    /* eslint-enable @typescript-eslint/no-explicit-any */

    console.log('✅ Resume parsed successfully');
    console.log(`   - Name: ${resume.personalInfo.fullName}`);
    console.log(`   - Email: ${resume.personalInfo.email}`);
    console.log(`   - Experience entries: ${resume.experience.length}`);
    console.log(`   - Education entries: ${resume.education.length}`);
    console.log(`   - Skills: ${resume.skills.flatSkills?.length || 0}`);

    return resume;

  } catch (error) {
    console.error('❌ Error parsing resume with Grok:', error);

    if (error instanceof Error) {
      throw new Error(`Resume parsing failed: ${error.message}`);
    }

    throw new Error('An unexpected error occurred while parsing the resume');
  }
}

/**
 * Validate extracted text before sending to AI
 * @param text - The extracted text to validate
 * @returns Object with validation result and optional error
 */
export async function validateExtractedText(text: string): Promise<{ valid: boolean; error?: string }> {
  if (!text || text.trim().length === 0) {
    return { valid: false, error: 'No text extracted from PDF' };
  }

  if (text.length < 50) {
    return { valid: false, error: 'Extracted text is too short. Please ensure the PDF contains readable text.' };
  }

  if (text.length > 100000) {
    return { valid: false, error: 'Extracted text is too long. Please use a shorter resume (max ~20 pages).' };
  }

  return { valid: true };
}
