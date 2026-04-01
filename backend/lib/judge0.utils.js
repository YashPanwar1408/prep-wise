/**
 * judge0.utils.js
 *
 * Utility functions for interacting with the Judge0 CE API.
 * Supports both self-hosted instances and the RapidAPI-hosted service.
 *
 * Environment variables consumed:
 *   JUDGE0_API_URL    — base URL, e.g. https://judge0-ce.p.rapidapi.com
 *                       or http://localhost:2358 for a self-hosted instance
 *   JUDGE0_API_KEY    — RapidAPI key (omit for self-hosted)
 *   JUDGE0_API_HOST   — RapidAPI host header (omit for self-hosted)
 *                       e.g. "judge0-ce.p.rapidapi.com"
 */

const axios = require('axios');

// ─── Config ────────────────────────────────────────────────────────────────

const JUDGE0_URL  = (process.env.JUDGE0_API_URL  || 'https://judge0-ce.p.rapidapi.com').replace(/\/$/, '');
const JUDGE0_KEY  = process.env.JUDGE0_API_KEY  || '';
const JUDGE0_HOST = process.env.JUDGE0_API_HOST || 'judge0-ce.p.rapidapi.com';

/** Build headers — works for both RapidAPI and self-hosted (key absent). */
function buildHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  if (JUDGE0_KEY) {
    headers['X-RapidAPI-Key']  = JUDGE0_KEY;
    headers['X-RapidAPI-Host'] = JUDGE0_HOST;
  }
  return headers;
}

// ─── Language Map ──────────────────────────────────────────────────────────

/**
 * Maps canonical language identifiers to Judge0 language IDs.
 *
 * Full list: https://ce.judge0.com/languages/
 */
const LANGUAGE_MAP = {
  // Python
  PYTHON:      71,    // Python 3.8.1
  PYTHON3:     71,
  'python':    71,
  'python3':   71,

  // JavaScript
  JAVASCRIPT:  63,    // Node.js 12.14.0
  JS:          63,
  'javascript': 63,
  'js':        63,

  // Java
  JAVA:        62,    // OpenJDK 13.0.1
  'java':      62,

  // C++
  CPP:         54,    // GCC 9.2.0
  'cpp':       54,
  'c++':       54,

  // C
  C:           50,    // GCC 9.2.0
  'c':         50,

  // TypeScript
  TYPESCRIPT:  74,    // TypeScript 3.7.4
  TS:          74,
  'typescript': 74,
  'ts':        74,

  // Go
  GO:          60,    // Go 1.13.5
  'go':        60,
  'golang':    60,

  // Rust
  RUST:        73,    // Rust 1.40.0
  'rust':      73,

  // C#
  CSHARP:      51,    // Mono 6.6.0.161
  'csharp':    51,
  'c#':        51,

  // Ruby
  RUBY:        72,    // Ruby 2.7.0
  'ruby':      72,

  // Kotlin
  KOTLIN:      78,    // Kotlin 1.3.70
  'kotlin':    78,

  // Swift
  SWIFT:       83,    // Swift 5.2.3
  'swift':     83,
};

/**
 * Returns the Judge0 language ID for the given language string.
 * Throws if the language is not supported.
 *
 * @param {string} language  e.g. "PYTHON", "javascript", "Java"
 * @returns {number}
 */
function getJudge0LanguageId(language) {
  const normalised = (language || '').toLowerCase().trim();

  // Accept raw numeric IDs (pass-through)
  const asNumber = parseInt(normalised, 10);
  if (!isNaN(asNumber) && asNumber > 0) return asNumber;

  // Try exact match first, then lowercase
  const id = LANGUAGE_MAP[language] ?? LANGUAGE_MAP[normalised];
  if (!id) {
    throw new Error(
      `Unsupported language: "${language}". ` +
      `Supported: ${Object.keys(LANGUAGE_MAP).filter(k => LANGUAGE_MAP[k]).join(', ')}`
    );
  }
  return id;
}

// ─── Batch Submit ──────────────────────────────────────────────────────────

/**
 * Submits a batch of submissions to Judge0.
 *
 * @param {Array<{
 *   source_code: string,
 *   language_id: number,
 *   stdin?: string,
 *   expected_output?: string,
 *   cpu_time_limit?: number,
 *   memory_limit?: number,
 * }>} submissions
 *
 * @returns {Promise<Array<{ token: string }>>}
 */
async function submitBatch(submissions) {
  const url = `${JUDGE0_URL}/submissions/batch?base64_encoded=false`;

  const response = await axios.post(
    url,
    { submissions },
    { headers: buildHeaders(), timeout: 15_000 }
  );

  if (!Array.isArray(response.data)) {
    throw new Error(`Judge0 batch submit returned unexpected payload: ${JSON.stringify(response.data)}`);
  }

  return response.data; // [{ token }, { token }, ...]
}

// ─── Poll Batch Results ─────────────────────────────────────────────────────

/**
 * Polls Judge0 until ALL submissions in the batch have reached a terminal state
 * (status.id >= 3 means "not queued / not processing").
 *
 * Judge0 status IDs:
 *   1  — In Queue
 *   2  — Processing
 *   3  — Accepted
 *   4  — Wrong Answer
 *   5  — Time Limit Exceeded
 *   6  — Compilation Error
 *   7  — Runtime Error (SIGSEGV)
 *   8  — Runtime Error (SIGXFSZ)
 *   9  — Runtime Error (SIGFPE)
 *  10  — Runtime Error (SIGABRT)
 *  11  — Runtime Error (NZEC)
 *  12  — Runtime Error (Other)
 *  13  — Internal Error
 *  14  — Exec Format Error
 *
 * @param {string[]} tokens  Array of submission tokens
 * @param {number}  [maxRetries=30]  Safety ceiling (~30 s at 1 s intervals)
 * @returns {Promise<Array>}  Array of Judge0 result objects
 */
async function pollBatchResults(tokens, maxRetries = 30) {
  const tokenString = tokens.join(',');
  const url = `${JUDGE0_URL}/submissions/batch?tokens=${tokenString}&base64_encoded=false&fields=token,stdout,stderr,compile_output,status,time,memory`;

  let attempts = 0;

  while (true) {
    attempts++;
    if (attempts > maxRetries) {
      throw new Error(`Judge0 polling timed out after ${maxRetries} attempts`);
    }

    // Wait 1 second between polls
    await sleep(1000);

    const response = await axios.get(url, {
      headers:  buildHeaders(),
      timeout:  10_000,
    });

    const results = response.data?.submissions;
    if (!Array.isArray(results)) {
      throw new Error(`Judge0 poll returned unexpected payload: ${JSON.stringify(response.data)}`);
    }

    // All done when every result is out of the queue / processing states
    const allDone = results.every((r) => r?.status?.id >= 3);
    if (allDone) return results;
  }
}

// ─── Helpers ───────────────────────────────────────────────────────────────

/** Promise-based sleep. */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Maps a Judge0 status description to our platform's verdict strings.
 *
 * @param {object} status  Judge0 status object { id, description }
 * @returns {string}
 */
function mapJudge0Status(status) {
  if (!status) return 'Unknown';

  switch (status.id) {
    case 3:  return 'Accepted';
    case 4:  return 'Wrong Answer';
    case 5:  return 'Time Limit Exceeded';
    case 6:  return 'Compilation Error';
    case 7:
    case 8:
    case 9:
    case 10:
    case 11:
    case 12: return 'Runtime Error';
    case 13: return 'Internal Error';
    case 14: return 'Exec Format Error';
    default: return status.description || 'Unknown';
  }
}

module.exports = {
  getJudge0LanguageId,
  submitBatch,
  pollBatchResults,
  mapJudge0Status,
  sleep,
};
