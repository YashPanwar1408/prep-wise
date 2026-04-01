/**
 * VAPI Voice AI Client Utilities
 * Handles AI interviewer voice interaction
 */

const VAPI_API_KEY = process.env.VAPI_API_KEY || process.env.NEXT_PUBLIC_VAPI_API_KEY;

if (!VAPI_API_KEY) {
  console.warn('VAPI_API_KEY not found in environment variables');
}

export interface VapiAssistantConfig {
  name: string;
  model: {
    provider: string;
    model: string;
    temperature: number;
  };
  voice: {
    provider: string;
    voiceId: string;
  };
  firstMessage: string;
  context: string;
}

/**
 * Create a VAPI assistant for interview
 */
export async function createVapiAssistant(config: {
  domain: string;
  duration: number;
  resumeData?: unknown;
  jobDescription?: string;
}): Promise<string> {
  const { domain, duration, resumeData, jobDescription } = config;
  
  // Build context for AI
  let context = `You are a professional technical interviewer conducting a ${domain} interview for ${duration} minutes.\n\n`;
  
  if (resumeData) {
    context += `CANDIDATE RESUME:\n${JSON.stringify(resumeData, null, 2)}\n\n`;
  }
  
  if (jobDescription) {
    context += `JOB DESCRIPTION:\n${jobDescription}\n\n`;
  }
  
  context += `
INTERVIEW GUIDELINES:
- Ask ONE question at a time and wait for the candidate's response
- Ask follow-up questions based on their answers and resume
- Evaluate clarity, correctness, and confidence
- Cover breadth and depth appropriate for ${domain}
- Be professional but friendly
- Keep questions relevant to the role and candidate's background
- After ${duration} minutes or when you've covered enough topics, thank the candidate and end the interview naturally

IMPORTANT: 
- Start with a brief introduction
- Reference their resume when relevant
- Ask progressively challenging questions
- Provide subtle feedback during the interview
- End politely when time is up
`;

  const assistantPayload = {
    name: `${domain} Interview Assistant`,
    model: {
      provider: 'openai',
      model: 'gpt-4o-mini',
      temperature: 0.7,
      messages: [
        {
          role: 'system',
          content: context,
        },
      ],
    },
    voice: {
      provider: 'openai',
      voiceId: 'nova',
    },
    firstMessage: `Hello! I'm your AI interviewer for today's ${domain} interview. We'll be talking for about ${duration} minutes. I've reviewed your background. Are you ready to begin?`,
    silenceTimeoutSeconds: 30,
    maxDurationSeconds: duration * 60,
  };

  try {
    const response = await fetch('https://api.vapi.ai/assistant', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${VAPI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(assistantPayload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('VAPI response error:', response.status, errorBody);
      throw new Error(`Failed to create VAPI assistant: ${response.statusText}`);
    }

    const data = await response.json();
    return data.id;
  } catch (error) {
    console.error('Error creating VAPI assistant:', error);
    throw error;
  }
}

/**
 * Get VAPI call transcript
 */
export async function getVapiTranscript(callId: string) {
  try {
    const response = await fetch(`https://api.vapi.ai/call/${callId}`, {
      headers: {
        'Authorization': `Bearer ${VAPI_API_KEY}`,
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
