import 'server-only';

type GrokRole = 'system' | 'user' | 'assistant';

interface GrokMessage {
  role: GrokRole;
  content: string;
}

interface GrokCompletionOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

const GROK_BASE_URL = process.env.GROK_BASE_URL || 'https://api.groq.com/openai/v1';
const DEFAULT_GROK_MODEL = process.env.GROK_MODEL || 'grok-3-mini';

function getGrokApiKey(): string {
  const key = process.env.GROK_API_KEY || process.env.NEXT_PUBLIC_GROK_API_KEY;
  if (!key) {
    throw new Error('GROK_API_KEY is not configured. Please set it in environment variables.');
  }
  return key;
}

export async function grokTextCompletion(
  messages: GrokMessage[],
  options: GrokCompletionOptions = {}
): Promise<string> {
  const response = await fetch(`${GROK_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getGrokApiKey()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: options.model || DEFAULT_GROK_MODEL,
      messages,
      temperature: options.temperature ?? 0.3,
      max_tokens: options.maxTokens,
    }),
  });

  const raw = await response.text();
  if (!response.ok) {
    throw new Error(`Grok request failed (${response.status}): ${raw.slice(0, 300)}`);
  }

  const data = JSON.parse(raw) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('Grok response did not contain completion text.');
  }

  return content.trim();
}

export function extractJsonPayload(responseText: string): string {
  const stripped = responseText
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  const objectMatch = stripped.match(/\{[\s\S]*\}/);
  if (objectMatch) return objectMatch[0];

  const arrayMatch = stripped.match(/\[[\s\S]*\]/);
  if (arrayMatch) return arrayMatch[0];

  return stripped;
}

export async function grokJsonCompletion<T>(
  messages: GrokMessage[],
  options: GrokCompletionOptions = {}
): Promise<T> {
  const raw = await grokTextCompletion(messages, options);
  return JSON.parse(extractJsonPayload(raw)) as T;
}
