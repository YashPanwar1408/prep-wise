/**
 * VAPI Voice AI Client Utilities
 * Handles AI interviewer voice interaction
 */

export interface VapiAssistantConfig {
  name: string;
  model: {
    provider: string;
    model: string;
    temperature: number;
    messages: Array<{ role: string; content: string }>;
  };
  voice: {
    provider: string;
    voiceId: string;
  };
  transcriber?: {
    provider: string;
    model: string;
    language: string;
  };
  firstMessage: string;
  silenceTimeoutSeconds: number;
  maxDurationSeconds: number;
  endCallFunctionEnabled?: boolean;
}

/**
 * Build the VAPI transient assistant payload sent from the browser.
 * Only uses fields that VAPI's public API actually accepts.
 */
export function buildVapiAssistantPayload(config: {
  domain: string;
  duration: number;
  resumeData?: unknown;
  jobDescription?: string;
}): VapiAssistantConfig {
  const { domain, duration, resumeData, jobDescription } = config;

  // ── System prompt ────────────────────────────────────────────────────────
  let systemPrompt = `You are a professional technical interviewer conducting a ${domain} interview that will last approximately ${duration} minutes.\n\n`;

  if (resumeData) {
    // Flatten resume to a concise, readable format
    const r = resumeData as Record<string, unknown>;
    const pi = r.personalInfo as Record<string, string> | undefined;

    if (pi?.fullName) systemPrompt += `CANDIDATE: ${pi.fullName}\n`;
    if (pi?.email) systemPrompt += `EMAIL: ${pi.email}\n`;
    if (pi?.location) systemPrompt += `LOCATION: ${pi.location}\n\n`;

    const skills = (r.skills as Record<string, unknown> | undefined)?.flatSkills;
    if (Array.isArray(skills) && skills.length) {
      systemPrompt += `SKILLS: ${(skills as string[]).slice(0, 20).join(', ')}\n\n`;
    }

    const exp = r.experience as Array<Record<string, unknown>> | undefined;
    if (Array.isArray(exp) && exp.length) {
      systemPrompt += `EXPERIENCE:\n`;
      exp.slice(0, 3).forEach((e) => {
        systemPrompt += `- ${e.role || ''} at ${e.company || ''} (${e.startDate || ''} – ${e.endDate || 'Present'})\n`;
        if (e.description) systemPrompt += `  ${String(e.description).substring(0, 150)}\n`;
      });
      systemPrompt += '\n';
    }

    const edu = r.education as Array<Record<string, unknown>> | undefined;
    if (Array.isArray(edu) && edu.length) {
      const e = edu[0];
      systemPrompt += `EDUCATION: ${e.degree || ''} in ${e.field || ''} from ${e.school || ''}\n\n`;
    }

    const proj = r.projects as Array<Record<string, unknown>> | undefined;
    if (Array.isArray(proj) && proj.length) {
      systemPrompt += `PROJECTS:\n`;
      proj.slice(0, 3).forEach((p) => {
        systemPrompt += `- ${p.title || ''}: ${String(p.description || '').substring(0, 100)}\n`;
      });
      systemPrompt += '\n';
    }
  } else {
    systemPrompt += `(No resume was provided — conduct a general ${domain} interview.)\n\n`;
  }

  if (jobDescription) {
    systemPrompt += `JOB DESCRIPTION:\n${jobDescription.substring(0, 500)}\n\n`;
  }

  systemPrompt += `INTERVIEW GUIDELINES:
- Greet the candidate warmly, introduce yourself as their AI interviewer.
- Ask ONE question at a time and wait for the candidate's full response before asking the next.
- Ask relevant follow-up questions based on their answers.
- Cover technical depth appropriate for a ${domain} role.
- Be professional, encouraging and conversational.
- After ${duration} minutes, wrap up by thanking the candidate and letting them know results will be shared.
- Do NOT end the call yourself — the candidate will hang up when ready.
`;

  const firstMessage = resumeData
    ? `Hello! I'm your AI interviewer for today's ${domain} interview. I've reviewed your background and I'm ready to begin. Are you comfortable and ready to start?`
    : `Hello! I'm your AI interviewer for today's ${domain} interview. We'll be talking for about ${duration} minutes. Are you ready to begin?`;

  return {
    name: `${domain} Interview Assistant`,
    model: {
      provider: 'openai',
      model: 'gpt-4o-mini',
      temperature: 0.7,
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
      ],
    },
    voice: {
      provider: 'openai',
      voiceId: 'nova',
    },
    firstMessage,
    silenceTimeoutSeconds: 30,
    maxDurationSeconds: duration * 60 + 120,
  };
}

/**
 * Get VAPI call transcript (server-side only)
 */
export async function getVapiTranscript(callId: string) {
  const VAPI_API_KEY = process.env.VAPI_API_KEY;
  if (!VAPI_API_KEY) return [];

  try {
    const response = await fetch(`https://api.vapi.ai/call/${callId}`, {
      headers: {
        Authorization: `Bearer ${VAPI_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get VAPI transcript: ${response.statusText}`);
    }

    const data = await response.json();
    return data.transcript || [];
  } catch (error) {
    console.error('Error getting VAPI transcript:', error);
    return [];
  }
}
