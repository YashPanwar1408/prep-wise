const axios = require('axios');

const GROK_BASE_URL = process.env.GROK_BASE_URL || 'https://api.groq.com/openai/v1';
const DEFAULT_GROK_MODEL = process.env.GROK_MODEL || 'grok-3-mini';

function getGrokApiKey() {
  const key = process.env.GROK_API_KEY;
  if (!key) {
    throw new Error('GROK_API_KEY is not configured.');
  }
  return key;
}

async function grokTextCompletion({ messages, temperature = 0.3, model = DEFAULT_GROK_MODEL, maxTokens }) {
  const response = await axios.post(
    `${GROK_BASE_URL}/chat/completions`,
    {
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
    },
    {
      headers: {
        Authorization: `Bearer ${getGrokApiKey()}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    }
  );

  const text = response?.data?.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error('Grok response did not contain completion text.');
  }

  return String(text).trim();
}

function extractJsonPayload(responseText) {
  const stripped = String(responseText)
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

module.exports = {
  grokTextCompletion,
  extractJsonPayload,
};
