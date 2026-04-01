/**
 * execution.routes.js
 *
 * Mounts all Judge0-backed code execution endpoints under /api/execution.
 *
 * Routes:
 *   POST   /api/execution/run             — Run code, return results (no DB write)
 *   POST   /api/execution/submit          — Full submit: persist Submission + TestCaseResults
 *   GET    /api/execution/submissions/:id — History for a problem/user
 *   GET    /api/execution/solved          — List of solved problem IDs for a user
 *   GET    /api/execution/health          — Sanity check + Judge0 connectivity test
 *   GET    /api/execution/languages       — List supported Judge0 language IDs
 */

'use strict';

const express = require('express');
const router  = express.Router();
const axios   = require('axios');

const {
  runCode,
  executeCode,
  getSubmissions,
  getSolvedProblems,
} = require('../controllers/execution.controller');

// ─── Core Execution Endpoints ──────────────────────────────────────────────

/**
 * POST /api/execution/run
 * Body: { source_code, language_id, stdin, expected_outputs, problemId }
 */
router.post('/run', runCode);

/**
 * POST /api/execution/submit
 * Body: { source_code, language_id, stdin, expected_outputs, problemId, userId }
 */
router.post('/submit', executeCode);

// ─── History / Progress Endpoints ─────────────────────────────────────────

/**
 * GET /api/execution/submissions/:problemId?userId=xxx
 */
router.get('/submissions/:problemId', getSubmissions);

/**
 * GET /api/execution/solved?userId=xxx
 */
router.get('/solved', getSolvedProblems);

// ─── Utility Endpoints ────────────────────────────────────────────────────

/**
 * GET /api/execution/languages
 * Returns the language → Judge0 ID map used by this service.
 */
router.get('/languages', (_req, res) => {
  res.json({
    languages: [
      { id: 71, name: 'Python 3',      key: 'python'     },
      { id: 63, name: 'JavaScript',    key: 'javascript' },
      { id: 62, name: 'Java',          key: 'java'       },
      { id: 54, name: 'C++ (GCC 9)',   key: 'cpp'        },
      { id: 50, name: 'C (GCC 9)',     key: 'c'          },
      { id: 74, name: 'TypeScript',    key: 'typescript' },
      { id: 60, name: 'Go',            key: 'go'         },
      { id: 73, name: 'Rust',          key: 'rust'       },
      { id: 51, name: 'C# (Mono)',     key: 'csharp'     },
      { id: 72, name: 'Ruby',          key: 'ruby'       },
      { id: 78, name: 'Kotlin',        key: 'kotlin'     },
      { id: 83, name: 'Swift',         key: 'swift'      },
    ],
  });
});

/**
 * GET /api/execution/health
 * Quick connectivity check against Judge0 and reports config status.
 */
router.get('/health', async (_req, res) => {
  const judge0Url = process.env.JUDGE0_API_URL;
  const hasKey    = !!process.env.JUDGE0_API_KEY;

  const status = {
    service:        'execution-engine',
    judge0Url:      judge0Url || '⚠️  JUDGE0_API_URL not set',
    apiKeyPresent:  hasKey,
    timestamp:      new Date().toISOString(),
  };

  // Optional: ping Judge0's /about or /languages endpoint
  if (judge0Url) {
    try {
      const apiKey  = process.env.JUDGE0_API_KEY  || '';
      const apiHost = process.env.JUDGE0_API_HOST || 'judge0-ce.p.rapidapi.com';
      const headers = apiKey
        ? { 'X-RapidAPI-Key': apiKey, 'X-RapidAPI-Host': apiHost }
        : {};

      await axios.get(`${judge0Url}/languages`, { headers, timeout: 5000 });
      status.judge0Reachable = true;
    } catch {
      status.judge0Reachable = false;
      status.judge0Warning   = 'Judge0 /languages ping failed — check URL / API key';
    }
  }

  res.json(status);
});

module.exports = router;
