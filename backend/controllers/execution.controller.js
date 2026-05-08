/**
 * execution.controller.js
 *
 * Two controller actions that power the DSA Code Execution Engine:
 *
 *   runCode     — Run code against provided test cases, return results immediately.
 *                 Nothing is persisted to the database (useful for "Run" button).
 *
 *   executeCode — Full submission: execute code, persist Submission + per-test
 *                 TestCaseResult records, and mark the problem solved on full pass.
 *
 * Both endpoints accept the same request body shape:
 * {
 *   source_code:      string          — user's code
 *   language_id:      string|number   — "python" / "JAVA" / 63 / etc.
 *   stdin:            string[]        — one entry per test case
 *   expected_outputs: string[]        — one entry per test case (must match stdin length)
 *   problemId:        string          — UUID of the Problem record
 *   userId?:          string          — Clerk user ID (required for executeCode)
 * }
 */

'use strict';

const {
  getJudge0LanguageId,
  submitBatch,
  pollBatchResults,
  mapJudge0Status,
} = require('../lib/judge0.utils');
const prisma = require('../lib/prisma');

// ─── Shared Helpers ────────────────────────────────────────────────────────

/**
 * Parses and validates the common request body fields.
 * Returns a validated object or throws an error with a user-friendly message.
 */
function parseRequestBody(body) {
  const { source_code, language_id, stdin, expected_outputs, problemId, userId } = body;

  if (!source_code || typeof source_code !== 'string' || !source_code.trim()) {
    throw Object.assign(new Error('source_code is required and must be a non-empty string.'), { status: 400 });
  }

  if (!language_id) {
    throw Object.assign(new Error('language_id is required.'), { status: 400 });
  }

  if (!Array.isArray(stdin) || stdin.length === 0) {
    throw Object.assign(new Error('stdin must be a non-empty array of strings.'), { status: 400 });
  }

  if (!Array.isArray(expected_outputs) || expected_outputs.length === 0) {
    throw Object.assign(new Error('expected_outputs must be a non-empty array of strings.'), { status: 400 });
  }

  if (stdin.length !== expected_outputs.length) {
    throw Object.assign(
      new Error(`stdin and expected_outputs must have the same length. Got ${stdin.length} vs ${expected_outputs.length}.`),
      { status: 400 }
    );
  }

  if (!problemId) {
    throw Object.assign(new Error('problemId is required.'), { status: 400 });
  }

  // Resolve Judge0 language ID (accepts string name or numeric ID)
  const resolvedLanguageId = getJudge0LanguageId(String(language_id));

  return {
    source_code: source_code.trim(),
    language_id: resolvedLanguageId,
    stdin:            stdin.map(String),
    expected_outputs: expected_outputs.map(String),
    problemId,
    userId: userId || null,
  };
}

/**
 * Builds the Judge0 batch payload and runs it through the full submit → poll cycle.
 *
 * @returns {{ rawResults: object[], resolvedLanguageId: number }}
 */
async function runBatch(source_code, language_id, stdin) {
  // Build one Judge0 submission per test-case input
  const submissions = stdin.map((input) => ({
    source_code,
    language_id,
    stdin: input,
    // Optional Judge0 limits — can be overridden via env
    cpu_time_limit:  parseFloat(process.env.JUDGE0_CPU_LIMIT  || '5'),    // seconds
    memory_limit:    parseInt(  process.env.JUDGE0_MEM_LIMIT  || '131072', 10), // KB (128 MB)
  }));

  // 1. Submit entire batch
  const batchResponse = await submitBatch(submissions);

  // 2. Extract tokens
  const tokens = batchResponse.map((item) => {
    if (!item?.token) throw new Error('Judge0 did not return a token for one of the submissions.');
    return item.token;
  });

  // 3. Poll until all done
  const rawResults = await pollBatchResults(tokens);

  return rawResults;
}

/**
 * Maps Judge0 raw results to our unified result shape.
 *
 * @param {object[]}  rawResults       Raw Judge0 result objects
 * @param {string[]}  expected_outputs Parallel array of expected outputs
 * @returns {{ results: object[], allPassed: boolean, summary: object }}
 */
function buildResultSet(rawResults, expected_outputs) {
  let allPassed = true;

  const results = rawResults.map((raw, idx) => {
    // Normalise stdout (trim trailing newline Judge0 adds)
    const actualOut   = (raw.stdout   || '').trim();
    const expectedOut = (expected_outputs[idx] || '').trim();

    const statusLabel = mapJudge0Status(raw.status);
    const isAccepted  = raw.status?.id === 3;
    const passed      = isAccepted && actualOut === expectedOut;

    if (!passed) allPassed = false;

    return {
      testCase:     idx + 1,
      passed,
      status:       passed ? 'Accepted' : statusLabel,
      expected:     expectedOut,
      stdout:       actualOut,
      stderr:       (raw.stderr        || '').trim() || null,
      compileOutput:(raw.compile_output || '').trim() || null,
      memory:       raw.memory ?? null,   // KB
      time:         raw.time   ?? null,   // seconds
      token:        raw.token,
    };
  });

  // Aggregate summary stats
  const passedCount = results.filter((r) => r.passed).length;
  const avgTime     = results.reduce((s, r) => s + (r.time   || 0), 0) / results.length;
  const maxMemory   = Math.max(...results.map((r) => r.memory || 0));

  // Derive overall submission verdict
  const firstFail = results.find((r) => !r.passed);
  const verdict = allPassed
    ? 'Accepted'
    : firstFail?.status || 'Wrong Answer';

  const summary = {
    verdict,
    passed:      passedCount,
    total:       results.length,
    avgTime:     +avgTime.toFixed(3),
    maxMemory,
  };

  return { results, allPassed, summary };
}

// ─── Controller: runCode ───────────────────────────────────────────────────

/**
 * POST /api/execution/run
 *
 * Runs source_code against every provided test case and returns the results
 * directly. Nothing is saved to the database — purely ephemeral.
 *
 * Response:
 * {
 *   success: true,
 *   mode: "run",
 *   verdict: "Accepted" | "Wrong Answer" | ...,
 *   passed: number,
 *   total: number,
 *   avgTime: number,       // seconds
 *   maxMemory: number,     // KB
 *   results: TestCaseResult[]
 * }
 */
async function runCode(req, res) {
  try {
    // 1. Validate inputs
    const { source_code, language_id, stdin, expected_outputs, problemId } =
      parseRequestBody(req.body);

    // 2. Verify problem exists
    const problem = await prisma.problem.findUnique({
      where:  { id: problemId },
      select: { id: true, title: true },
    });
    if (!problem) {
      return res.status(404).json({ success: false, error: `Problem not found: ${problemId}` });
    }

    // 3. Execute via Judge0
    const rawResults = await runBatch(source_code, language_id, stdin);

    // 4. Map results
    const { results, allPassed, summary } = buildResultSet(rawResults, expected_outputs);

    return res.status(200).json({
      success: true,
      mode:    'run',
      ...summary,
      results,
    });

  } catch (err) {
    console.error('[runCode] Error:', err.message);

    if (err.status) {
      return res.status(err.status).json({ success: false, error: err.message });
    }

    // Judge0 network / timeout errors
    if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
      return res.status(503).json({ success: false, error: 'Judge0 service is unreachable. Check JUDGE0_API_URL.' });
    }

    return res.status(500).json({ success: false, error: 'Code execution failed.', details: err.message });
  }
}

// ─── Controller: executeCode ──────────────────────────────────────────────

/**
 * POST /api/execution/submit
 *
 * Full submission flow:
 *   1. Execute code via Judge0 (same as runCode)
 *   2. Persist a Submission record with the aggregate verdict
 *   3. Persist individual TestCaseResult records linked to the Submission
 *   4. On full pass → upsert ProblemSolved (marking stats)
 *   5. Return the saved Submission with its TestCaseResults
 *
 * Response: { success: true, submission: Submission & { testCaseResults } }
 */
async function executeCode(req, res) {
  try {
    // 1. Validate inputs
    const { source_code, language_id, stdin, expected_outputs, problemId, userId } =
      parseRequestBody(req.body);

    if (!userId) {
      return res.status(401).json({ success: false, error: 'userId is required for submissions.' });
    }

    // 2. Verify problem & user exist
    const [problem, user] = await Promise.all([
      prisma.problem.findUnique({ where: { id: problemId }, select: { id: true, title: true } }),
      prisma.user.findUnique(   { where: { id: userId   }, select: { id: true } }),
    ]);

    if (!problem) {
      return res.status(404).json({ success: false, error: `Problem not found: ${problemId}` });
    }
    if (!user) {
      return res.status(404).json({ success: false, error: `User not found: ${userId}` });
    }

    // 3. Execute via Judge0
    const rawResults = await runBatch(source_code, language_id, stdin);

    // 4. Map results
    const { results, allPassed, summary } = buildResultSet(rawResults, expected_outputs);

    // 5. Persist everything in a single transaction
    const saved = await prisma.$transaction(async (tx) => {

      // 5a. Create the Submission record
      const submission = await tx.submission.create({
        data: {
          userId,
          problemId,
          code:           source_code,
          language:       String(language_id),
          status:         summary.verdict,
          runtime:        Math.round((summary.avgTime || 0) * 1000), // ms
          memory:         summary.maxMemory || null,
          submissionType: 'judge0',
          // Store raw stdin/stdout of last test case for quick preview
          stdin:          stdin[stdin.length - 1]           ?? null,
          stdout:         results[results.length - 1]?.stdout ?? null,
          stderr:         results.find((r) => r.stderr)?.stderr ?? null,
          compileOutput:  results.find((r) => r.compileOutput)?.compileOutput ?? null,
          sourceCode: {
            language_id,
            stdin_count:   stdin.length,
          },
        },
      });

      // 5b. Bulk-create one TestCaseResult per test case
      await tx.testCaseResult.createMany({
        data: results.map((r) => ({
          submissionId:  submission.id,
          testCase:      r.testCase,
          passed:        r.passed,
          expected:      r.expected,
          stdout:        r.stdout        || null,
          stderr:        r.stderr        || null,
          compileOutput: r.compileOutput || null,
          status:        r.status,
          memory:        r.memory,
          time:          r.time,
        })),
      });

      // 5c. If all test cases passed → mark as solved (idempotent)
      if (allPassed) {
        await tx.problemSolved.upsert({
          where:  { userId_problemId: { userId, problemId } },
          update: {},           // already solved — nothing to change
          create: { userId, problemId },
        });
      }

      // 5d. Return the full submission with its test-case children
      return tx.submission.findUnique({
        where:   { id: submission.id },
        include: { testCaseResults: { orderBy: { testCase: 'asc' } } },
      });
    });

    return res.status(201).json({
      success:    true,
      mode:       'submit',
      ...summary,
      submission: saved,
    });

  } catch (err) {
    console.error('[executeCode] Error:', err.message);

    if (err.status) {
      return res.status(err.status).json({ success: false, error: err.message });
    }

    if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
      return res.status(503).json({ success: false, error: 'Judge0 service is unreachable. Check JUDGE0_API_URL.' });
    }

    return res.status(500).json({ success: false, error: 'Submission failed.', details: err.message });
  }
}

// ─── Controller: getSubmissions ────────────────────────────────────────────

/**
 * GET /api/execution/submissions/:problemId?userId=xxx
 *
 * Returns the most recent 20 submissions for a user on a specific problem,
 * including per-test-case results for each.
 */
async function getSubmissions(req, res) {
  try {
    const { problemId } = req.params;
    const { userId }    = req.query;

    if (!problemId) return res.status(400).json({ success: false, error: 'problemId is required.' });
    if (!userId)    return res.status(400).json({ success: false, error: 'userId query param is required.' });

    const submissions = await prisma.submission.findMany({
      where:   { problemId, userId },
      orderBy: { createdAt: 'desc' },
      take:    20,
      include: {
        testCaseResults: { orderBy: { testCase: 'asc' } },
      },
    });

    return res.status(200).json({ success: true, submissions });
  } catch (err) {
    console.error('[getSubmissions] Error:', err.message);
    return res.status(500).json({ success: false, error: 'Failed to fetch submissions.', details: err.message });
  }
}

// ─── Controller: getSolvedProblems ─────────────────────────────────────────

/**
 * GET /api/execution/solved?userId=xxx
 *
 * Returns a list of problem IDs that the user has solved at least once.
 */
async function getSolvedProblems(req, res) {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ success: false, error: 'userId query param is required.' });

    const solved = await prisma.problemSolved.findMany({
      where:   { userId },
      select:  { problemId: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({ success: true, solved });
  } catch (err) {
    console.error('[getSolvedProblems] Error:', err.message);
    return res.status(500).json({ success: false, error: 'Failed to fetch solved problems.', details: err.message });
  }
}

module.exports = { runCode, executeCode, getSubmissions, getSolvedProblems };
