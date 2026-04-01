const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');

// On Windows, refresh PATH from system + user env so compilers installed
// after this process started (e.g. via Chocolatey) are always found.
if (process.platform === 'win32') {
  try {
    const { execSync } = require('child_process');
    const fresh = execSync(
      'powershell -NoProfile -Command "[System.Environment]::GetEnvironmentVariable(\'PATH\',\'Machine\')+\';\'+[System.Environment]::GetEnvironmentVariable(\'PATH\',\'User\')"',
      { encoding: 'utf8', timeout: 5000 }
    ).trim();
    if (fresh) process.env.PATH = fresh;
  } catch { /* keep existing PATH */ }
}

const prisma = new PrismaClient();

// ============================================
// UTILITY HELPERS
// ============================================

/**
 * Extract the real function name from DB record.
 * Priority: problem.functionName → parse from starterCode → derive from slug
 */
function extractFunctionName(problem, slug) {
  if (problem.functionName) return problem.functionName;

  // Try to extract from starterCode
  const sc = problem.starterCode;
  if (sc && typeof sc === 'object') {
    // Python: def functionName(self, ...)
    const pyCode = sc.python || '';
    const pyMatch = pyCode.match(/def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(self/);
    if (pyMatch) return pyMatch[1];

    // JavaScript: var funcName = function  OR  function funcName(
    const jsCode = sc.javascript || '';
    const jsMatch = jsCode.match(/(?:var|let|const)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*function|function\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/);
    if (jsMatch) return jsMatch[1] || jsMatch[2];
  }

  return slugToFunctionName(slug);
}

/**
 * Convert kebab-case slug → camelCase function name.
 * e.g. "two-sum" → "twoSum"
 */
const slugToFunctionName = (slug) =>
  slug.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

/**
 * Derive a LeetCode-style verdict from a results array.
 * Priority: TLE > Runtime Error > Wrong Answer > Accepted
 */
const deriveVerdict = (results) => {
  if (results.some((r) => r.status === 'Time Limit Exceeded')) return 'Time Limit Exceeded';
  if (results.some((r) => r.status === 'Runtime Error'))       return 'Runtime Error';
  if (results.some((r) => !r.passed))                          return 'Wrong Answer';
  return 'Accepted';
};

/**
 * Normalize a value for comparison:
 *  - strings → trim + collapse internal whitespace
 *  - everything else → stable JSON string
 */
const normalize = (value) => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value.trim().replace(/\s+/g, ' ');
  return JSON.stringify(value);
};

/**
 * Whitespace-tolerant output comparison.
 * Handles primitives, arrays, objects, and multi-word strings.
 * Also compares arrays in a sort-insensitive way — many LeetCode problems
 * say "return the answer in any order".
 */
const outputsMatch = (actual, expected, parsedInputs = null) => {
  // Fast path: deep equality via JSON
  if (JSON.stringify(actual) === JSON.stringify(expected)) return true;
  // Normalised string comparison (handles trailing whitespace, extra spaces)
  if (normalize(actual) === normalize(expected)) return true;
  // Sort-insensitive comparison for flat arrays (LeetCode "any order" problems)
  if (Array.isArray(actual) && Array.isArray(expected) && actual.length === expected.length) {
    const sortVal = (a, b) =>
      typeof a === 'number' && typeof b === 'number'
        ? a - b
        : JSON.stringify(a).localeCompare(JSON.stringify(b));
    const sortedA = [...actual].sort(sortVal);
    const sortedE = [...expected].sort(sortVal);
    if (JSON.stringify(sortedA) === JSON.stringify(sortedE)) return true;

    // For top-k / any-valid-selection problems (e.g. "top k frequent elements"):
    // check that every element in `actual` is at least as frequent as the k-th
    // most frequent element in the input — i.e. it's a VALID top-k answer.
    if (parsedInputs && parsedInputs.length >= 2) {
      const inputArr = parsedInputs[0];
      const k = parsedInputs[1];
      if (Array.isArray(inputArr) && typeof k === 'number' && actual.length === k) {
        const freq = {};
        for (const x of inputArr) freq[String(x)] = (freq[String(x)] || 0) + 1;
        const actualSet = new Set(actual.map(String));
        const minFreqInActual = Math.min(...actual.map((x) => freq[String(x)] || 0));
        // No excluded element should have strictly higher frequency
        const valid = Object.entries(freq).every(
          ([x, f]) => actualSet.has(x) || f <= minFreqInActual
        );
        if (valid) return true;
      }
    }
  }
  return false;
};

// ============================================
// BIGINT-SAFE JSON STRINGIFIER
// ============================================
const BIGINT_REPLACER = `
function bigIntReplacer(key, value) {
  return typeof value === 'bigint' ? value.toString() : value;
}
`;

const BIGINT_STRINGIFY = `JSON.stringify(result, bigIntReplacer)`;

// ============================================
// JAVA / C++ ARG SERIALIZATION HELPERS
// ============================================

/**
 * Convert a parsed JSON value into a Java literal declaration.
 * e.g. [1,2,3] → "int[] arg0 = {1,2,3};"
 */
function jsonToJavaDecl(value, idx) {
  const name = `arg${idx}`;
  if (value === null) return `Object ${name} = null;`;

  if (typeof value === 'boolean') return `boolean ${name} = ${value};`;

  if (typeof value === 'number') {
    if (!Number.isInteger(value)) return `double ${name} = ${value};`;
    // Use long for large values
    if (Math.abs(value) > 2_000_000_000) return `long ${name} = ${value}L;`;
    return `int ${name} = ${value};`;
  }

  if (typeof value === 'string') {
    return `String ${name} = "${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}";`;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return `int[] ${name} = {};`;

    const first = value[0];

    // 2-D int array
    if (Array.isArray(first)) {
      const inner = first[0];
      if (typeof inner === 'string') {
        const rows = value.map(r => `{${r.map(s => `"${s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`).join(',')}}`).join(', ');
        return `String[][] ${name} = {${rows}};`;
      }
      const rows = value.map(r => `{${r.join(',')}}`).join(', ');
      return `int[][] ${name} = {${rows}};`;
    }

    // 1-D string array
    if (typeof first === 'string') {
      const elems = value.map(s => `"${s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`).join(',');
      return `String[] ${name} = {${elems}};`;
    }

    // 1-D numeric array — detect long vs int
    const needsLong = value.some(v => typeof v === 'number' && Math.abs(v) > 2_000_000_000);
    if (needsLong) {
      return `long[] ${name} = {${value.map(v => `${v}L`).join(',')}};`;
    }
    return `int[] ${name} = {${value.join(',')}};`;
  }

  // Fallback: inline as string
  return `String ${name} = "${JSON.stringify(value).replace(/"/g, '\\"')}";`;
}

/**
 * Build the Java driver source (inlined args, solution call, JSON printer).
 */
function buildJavaDriver(functionName, userCode, parsedArgs) {
  const argDecls = parsedArgs.map((v, i) => `            ${jsonToJavaDecl(v, i)}`).join('\n');
  const argList  = parsedArgs.map((_, i) => `arg${i}`).join(', ');

  return `
import java.util.*;
import java.io.*;
import java.util.stream.*;

// ── User solution ────────────────────────────────────────────────────────────
${userCode}
// ─────────────────────────────────────────────────────────────────────────────

public class Solution_Driver {

    // ── Universal JSON serializer ────────────────────────────────────────────
    static String jsonify(int x)     { return Integer.toString(x); }
    static String jsonify(long x)    { return Long.toString(x); }
    static String jsonify(double x)  { return Double.toString(x); }
    static String jsonify(boolean x) { return Boolean.toString(x); }
    static String jsonify(char x)    { return "\\"" + x + "\\""; }
    static String jsonify(String x)  {
        if (x == null) return "null";
        return "\\"" + x.replace("\\\\", "\\\\\\\\").replace("\\"", "\\\\\\"") + "\\"";
    }
    static String jsonify(int[] a) {
        if (a == null) return "null";
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < a.length; i++) { if (i > 0) sb.append(","); sb.append(a[i]); }
        return sb.append("]").toString();
    }
    static String jsonify(long[] a) {
        if (a == null) return "null";
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < a.length; i++) { if (i > 0) sb.append(","); sb.append(a[i]); }
        return sb.append("]").toString();
    }
    static String jsonify(double[] a) {
        if (a == null) return "null";
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < a.length; i++) { if (i > 0) sb.append(","); sb.append(a[i]); }
        return sb.append("]").toString();
    }
    static String jsonify(String[] a) {
        if (a == null) return "null";
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < a.length; i++) { if (i > 0) sb.append(","); sb.append(jsonify(a[i])); }
        return sb.append("]").toString();
    }
    static String jsonify(char[] a) {
        if (a == null) return "null";
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < a.length; i++) { if (i > 0) sb.append(","); sb.append(jsonify(a[i])); }
        return sb.append("]").toString();
    }
    static String jsonify(int[][] a) {
        if (a == null) return "null";
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < a.length; i++) { if (i > 0) sb.append(","); sb.append(jsonify(a[i])); }
        return sb.append("]").toString();
    }
    static String jsonify(List<?> list) {
        if (list == null) return "null";
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < list.size(); i++) {
            if (i > 0) sb.append(",");
            Object o = list.get(i);
            if (o == null)                sb.append("null");
            else if (o instanceof Boolean)  sb.append(o);
            else if (o instanceof Number)   sb.append(o);
            else if (o instanceof String)   sb.append(jsonify((String) o));
            else if (o instanceof List)     sb.append(jsonify((List<?>) o));
            else                             sb.append("\\"" + o + "\\"");
        }
        return sb.append("]").toString();
    }
    static String jsonify(Object o) {
        if (o == null)              return "null";
        if (o instanceof Boolean)   return Boolean.toString((Boolean) o);
        if (o instanceof Integer)   return Integer.toString((Integer) o);
        if (o instanceof Long)      return Long.toString((Long) o);
        if (o instanceof Double)    return Double.toString((Double) o);
        if (o instanceof String)    return jsonify((String) o);
        if (o instanceof int[])     return jsonify((int[]) o);
        if (o instanceof long[])    return jsonify((long[]) o);
        if (o instanceof double[])  return jsonify((double[]) o);
        if (o instanceof String[])  return jsonify((String[]) o);
        if (o instanceof char[])    return jsonify((char[]) o);
        if (o instanceof int[][])   return jsonify((int[][]) o);
        if (o instanceof List)      return jsonify((List<?>) o);
        return String.valueOf(o);
    }

    // ── Main ──────────────────────────────────────────────────────────────────
    public static void main(String[] args) {
        try {
${argDecls}
            Solution sol = new Solution();
            var result = sol.${functionName}(${argList});
            System.out.println(jsonify(result));
        } catch (Exception e) {
            StackTraceElement[] st = e.getStackTrace();
            String loc = (st != null && st.length > 0) ? " | Line " + st[0].getLineNumber() : "";
            System.err.println(e.getClass().getSimpleName() + ": " + e.getMessage() + loc);
            System.exit(1);
        }
    }
}
`.trim();
}

/**
 * Convert a parsed JSON value into a C++ variable declaration.
 */
function jsonToCppDecl(value, idx) {
  const name = `arg${idx}`;
  if (value === null) return `int ${name} = 0;`;

  if (typeof value === 'boolean') return `bool ${name} = ${value};`;

  if (typeof value === 'number') {
    if (!Number.isInteger(value)) return `double ${name} = ${value};`;
    if (Math.abs(value) > 2_000_000_000) return `long long ${name} = ${value}LL;`;
    return `int ${name} = ${value};`;
  }

  if (typeof value === 'string') {
    return `std::string ${name} = "${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}";`;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return `std::vector<int> ${name} = {};`;

    const first = value[0];

    if (Array.isArray(first)) {
      const inner = first[0];
      if (typeof inner === 'string') {
        const rows = value.map(r => `{${r.map(s => `"${s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`).join(',')}}`).join(', ');
        return `std::vector<std::vector<std::string>> ${name} = {${rows}};`;
      }
      const rows = value.map(r => `{${r.join(',')}}`).join(', ');
      return `std::vector<std::vector<int>> ${name} = {${rows}};`;
    }

    if (typeof first === 'string') {
      const elems = value.map(s => `"${s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`).join(',');
      return `std::vector<std::string> ${name} = {${elems}};`;
    }

    const needsLong = value.some(v => typeof v === 'number' && Math.abs(v) > 2_000_000_000);
    if (needsLong) return `std::vector<long long> ${name} = {${value.map(v => `${v}LL`).join(',')}};`;
    return `std::vector<int> ${name} = {${value.join(',')}};`;
  }

  return `int ${name} = 0; // unsupported type`;
}

/**
 * Build the C++ driver source (inlined args, solution call, JSON printer).
 */
function buildCppDriver(functionName, userCode, parsedArgs) {
  const argDecls = parsedArgs.map((v, i) => `    ${jsonToCppDecl(v, i)}`).join('\n');
  const argList  = parsedArgs.map((_, i) => `arg${i}`).join(', ');

  return `
#include <bits/stdc++.h>
using namespace std;

// ── User solution ────────────────────────────────────────────────────────────
${userCode}
// ─────────────────────────────────────────────────────────────────────────────

// ── Universal JSON printer ───────────────────────────────────────────────────
string jsonify(int x)               { return to_string(x); }
string jsonify(long long x)         { return to_string(x); }
string jsonify(double x)            { return to_string(x); }
string jsonify(bool x)              { return x ? "true" : "false"; }
string jsonify(const string& s) {
    string r = "\\"";
    for (char c : s) { if (c == '"') r += "\\\\\\""; else if (c == '\\\\') r += "\\\\\\\\"; else r += c; }
    return r + "\\"";
}
template<typename T>
string jsonify(const vector<T>& v) {
    string r = "[";
    for (int i = 0; i < (int)v.size(); i++) { if (i) r += ","; r += jsonify(v[i]); }
    return r + "]";
}
template<typename T>
string jsonify(const vector<vector<T>>& v) {
    string r = "[";
    for (int i = 0; i < (int)v.size(); i++) { if (i) r += ","; r += jsonify(v[i]); }
    return r + "]";
}

int main() {
    try {
${argDecls}
        Solution sol;
        auto result = sol.${functionName}(${argList});
        cout << jsonify(result) << endl;
    } catch (const exception& e) {
        cerr << "RuntimeError: " << e.what() << endl;
        return 1;
    }
    return 0;
}
`.trim();
}

// ============================================
// DRIVER CODE TEMPLATES
// ============================================

const PYTHON_DRIVER_TEMPLATE = (functionName, userCode, inputCount, inputPath = '/workspace/input.json') => `
import sys
import json
import traceback
import os

# User's solution
${userCode}

# BigInt-safe JSON encoder
class BigIntEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, int) and (obj > 2**53 - 1 or obj < -(2**53 - 1)):
            return str(obj)
        return super().default(obj)

def main():
    try:
        # Determine input file path
        input_file = '${inputPath}' if '${inputPath}' != '/workspace/input.json' else os.path.join(os.path.dirname(__file__), 'input.json')
        
        # Read all inputs from input.json
        with open(input_file, 'r') as f:
            lines = f.read().strip().split('\\n')
        
        # Parse arguments
        args = []
        for line in lines[:${inputCount}]:
            args.append(json.loads(line))
        
        # Call user function
        solution = Solution()
        result = solution.${functionName}(*args)
        
        # Print result with BigInt support
        print(json.dumps(result, cls=BigIntEncoder, separators=(',', ':')))
        
    except SyntaxError as e:
        print(f"SYNTAX_ERROR: {e.msg} at line {e.lineno}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        # Extract line number from traceback
        tb = traceback.extract_tb(sys.exc_info()[2])
        user_frame = None
        for frame in tb:
            if 'solution.py' in frame.filename or '/workspace/' in frame.filename:
                user_frame = frame
                break
        
        error_msg = f"{type(e).__name__}: {str(e)}"
        if user_frame:
            error_msg += f" | Line {user_frame.lineno}"
        
        print(error_msg, file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    main()
`;

const JAVASCRIPT_DRIVER_TEMPLATE = (functionName, userCode, inputCount, inputPath = '/workspace/input.json') => `
const fs = require('fs');
const path = require('path');

// User's solution
${userCode}

${BIGINT_REPLACER}

async function main() {
    try {
        // Determine input file path
        const inputFile = '${inputPath}' !== '/workspace/input.json' 
            ? '${inputPath}' 
            : path.join(__dirname, 'input.json');
        
        // Read all inputs from input.json
        const content = fs.readFileSync(inputFile, 'utf8');
        const lines = content.trim().split('\\n');
        
        // Parse arguments
        const args = [];
        for (let i = 0; i < ${inputCount}; i++) {
            args.push(JSON.parse(lines[i]));
        }
        
        // Call user function
        const solution = new Solution();
        const result = await solution.${functionName}(...args);
        
        // Print result with BigInt support
        console.log(${BIGINT_STRINGIFY});
        
    } catch (error) {
        // Extract line number from error stack
        const stack = error.stack || '';
        const match = stack.match(/solution\\.js:(\\d+)/);
        const lineNum = match ? match[1] : 'unknown';
        
        const errorMsg = \`\${error.name}: \${error.message} | Line \${lineNum}\`;
        console.error(errorMsg);
        process.exit(1);
    }
}

main();
`;

// ============================================
// PISTON CLOUD EXECUTION (no local compiler deps)
// ============================================

const PISTON_API_URL = 'https://emkc.org/api/v2/piston/execute';
const PISTON_LANG_MAP = { python: 'python', javascript: 'javascript', java: 'java', cpp: 'c++' };

/**
 * Execute code via the Piston cloud API.
 * Supports Python, JavaScript, Java, C++ with no local installation required.
 * Returns { stdout, stderr, timedOut, exitCode } or null on network failure.
 */
async function runViaPiston(language, files) {
  try {
    const pistonLang = PISTON_LANG_MAP[language] || 'python';
    const response = await axios.post(PISTON_API_URL, {
      language: pistonLang,
      version: '*',
      files,
      run_timeout: 10000,
      compile_timeout: 15000,
    }, { timeout: 30000 });

    const data = response.data;

    // Compiled languages (Java/C++) have a compile step
    if (data.compile && data.compile.code !== 0) {
      return {
        stdout: '',
        stderr: data.compile.stderr || data.compile.output || 'Compilation failed',
        timedOut: false,
        exitCode: data.compile.code,
      };
    }

    const run = data.run || {};
    return {
      stdout: run.stdout || '',
      stderr: run.stderr || '',
      timedOut: run.signal === 'SIGKILL',
      exitCode: run.code ?? 0,
    };
  } catch (err) {
    console.error('Piston API error, falling back to local:', err.message);
    return null; // null signals caller to use local fallback
  }
}

// ============================================
// DOCKER EXECUTION
// ============================================

/**
 * Run one or more test cases inside Docker (or local fallback).
 *
 * @param {string}   language   - 'python' | 'javascript'
 * @param {string}   code       - The RAW user solution (no driver wrapper)
 * @param {object[]} testCases  - Array of { input, output, isSample }
 * @param {object}   opts
 * @param {string}   opts.functionName - function/method to call in the driver
 * @param {boolean}  [opts.earlyStop=false] - stop on first failure (submit mode)
 */
async function executeInDocker(language, code, testCases, { functionName = 'solution', earlyStop = false } = {}) {
  const sessionId = uuidv4();
  const tempDir = path.join(__dirname, '../temp', sessionId);
  
  try {
    await fs.mkdir(tempDir, { recursive: true });
    
    const results = [];
    
    for (let idx = 0; idx < testCases.length; idx++) {
      const testCase = testCases[idx];

      // Derive input-line count for THIS test case (robust to mixed schemas)
      const inputCount = testCase.input.trim().split('\n').filter(Boolean).length;

      // Parse inputs up-front (needed by Java/C++ template to inline literals)
      const rawLines = testCase.input.trim().split('\n').filter(Boolean);
      const parsedInputs = rawLines.map(line => { try { return JSON.parse(line); } catch { return line; } });
      
      // Build a fresh driver for this test case
      let driverCode;
      let ext;
      if (language === 'python') {
        driverCode = PYTHON_DRIVER_TEMPLATE(functionName, code, inputCount);
        ext = 'py';
      } else if (language === 'java') {
        driverCode = buildJavaDriver(functionName, code, parsedInputs);
        ext = 'java';
      } else if (language === 'cpp') {
        driverCode = buildCppDriver(functionName, code, parsedInputs);
        ext = 'cpp';
      } else {
        // javascript / default
        driverCode = JAVASCRIPT_DRIVER_TEMPLATE(functionName, code, inputCount);
        ext = 'js';
      }

      // Java requires the public class name to match the filename
      const filename = language === 'java' ? 'Solution_Driver.java' : `solution.${ext}`;

      // ── Execute ──────────────────────────────────────────────────────────
      const startTime = Date.now();

      let execResult = null;

      // Optional: Piston cloud API (set USE_PISTON=true in .env to enable)
      if (process.env.USE_PISTON === 'true') {
        const pistonFiles = [{ name: filename, content: driverCode }];
        if (language === 'python' || language === 'javascript') {
          pistonFiles.push({ name: 'input.json', content: testCase.input });
        }
        execResult = await runViaPiston(language, pistonFiles);
      }

      if (!execResult) {
        // Local execution (default): write files and run with local compiler
        await fs.writeFile(path.join(tempDir, 'input.json'), testCase.input, 'utf8');
        await fs.writeFile(path.join(tempDir, filename), driverCode, 'utf8');
        execResult = await runContainer(language, tempDir, filename);
      }

      const { stdout, stderr, timedOut, exitCode } = execResult;
      const executionTime = Date.now() - startTime;
      
      // Parse expected output
      let expectedOutput;
      try {
        expectedOutput = JSON.parse(testCase.output);
      } catch {
        expectedOutput = testCase.output;
      }
      
      // Handle different result cases
      if (timedOut) {
        results.push({
          testCase: idx + 1,
          isSample: testCase.isSample !== undefined ? testCase.isSample : false,
          input: parsedInputs,
          expectedOutput,
          actualOutput: null,
          passed: false,
          status: 'Time Limit Exceeded',
          error: 'Execution exceeded time limit',
          executionTime: 5000,
          memoryUsed: 'N/A'
        });
      } else if (exitCode !== 0 || stderr) {
        // Runtime / Compile error
        const errorMsg = stderr || 'Unknown runtime error';

        // Extract line number — handles:
        //  - Python/JS:  "| Line 42"
        //  - Java javac: "Solution_Driver.java:42: error:"
        //  - g++ :       "solution.cpp:42:5: error:"
        const lineMatch =
          errorMsg.match(/\|\s*Line\s+(\d+)/i) ||
          errorMsg.match(/\.(?:java|cpp|py|js):(\d+):/);
        const lineNumber = lineMatch ? parseInt(lineMatch[1], 10) : null;

        // Clean error: use the part before '|' if present, otherwise raw
        const cleanError = errorMsg.includes('|')
          ? errorMsg.split('|')[0].trim()
          : errorMsg.trim().slice(0, 1000); // cap at 1000 chars

        results.push({
          testCase: idx + 1,
          isSample: testCase.isSample !== undefined ? testCase.isSample : false,
          input: parsedInputs,
          expectedOutput,
          actualOutput: null,
          passed: false,
          status: 'Runtime Error',
          error: cleanError,
          lineNumber,
          executionTime,
          memoryUsed: 'N/A'
        });
      } else {
        // Successful execution - compare outputs
        let actualOutput;
        try {
          actualOutput = JSON.parse(stdout.trim());
        } catch {
          actualOutput = stdout.trim();
        }
        
        // Whitespace-tolerant equality check (with top-k validation support)
        const passed = outputsMatch(actualOutput, expectedOutput, parsedInputs);

        results.push({
          testCase: idx + 1,
          isSample: testCase.isSample !== undefined ? testCase.isSample : false,
          input: parsedInputs,
          expectedOutput,
          actualOutput,
          passed,
          status: passed ? 'Accepted' : 'Wrong Answer',
          error: null,
          executionTime,
          memoryUsed: 'N/A'
        });
      }

      // ── Early-stop: break on first failure (submit / LeetCode mode) ──────
      if (earlyStop && !results[results.length - 1].passed) {
        break;
      }
    }

    return results;

  } finally {
    // Cleanup temp directory
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch (cleanupError) {
      console.error('Cleanup failed:', cleanupError);
    }
  }
}

// ============================================
// DOCKER CONTAINER RUNNER
// ============================================

function runContainer(language, tempDir, filename) {
  return new Promise((resolve) => {
    // Check if Docker is available, fallback to local execution
    const useDocker = process.env.USE_DOCKER !== 'false';
    
    if (!useDocker) {
      // Fallback: Direct execution (development mode only)
      return runLocalExecution(language, tempDir, filename, resolve);
    }

    // Java/C++ always use local execution (Docker images not pre-configured)
    if (language === 'java' || language === 'cpp') {
      return runLocalExecution(language, tempDir, filename, resolve);
    }
    
    const image = language === 'python' ? 'python:3.11-alpine' : 'node:18-alpine';
    const cmd = language === 'python' 
      ? ['python', `/workspace/${filename}`]
      : ['node', `/workspace/${filename}`];
    
    const dockerArgs = [
      'run',
      '--rm',
      '--network=none',           // No internet access
      '--memory=128m',            // Memory limit
      '--cpus=0.5',              // CPU throttling
      '--memory-swap=128m',      // Disable swap
      '-v', `${tempDir}:/workspace`,
      image,
      ...cmd
    ];
    
    let stdout = '';
    let stderr = '';
    let timedOut = false;
    
    const dockerProc = spawn('docker', dockerArgs);
    
    // Set 5-second timeout
    const timeout = setTimeout(() => {
      timedOut = true;
      dockerProc.kill('SIGKILL');
    }, 5000);
    
    dockerProc.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    dockerProc.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    dockerProc.on('close', (exitCode) => {
      clearTimeout(timeout);
      resolve({ stdout, stderr, timedOut, exitCode });
    });
    
    dockerProc.on('error', (error) => {
      clearTimeout(timeout);
      // If Docker command fails, try local execution as fallback
      console.log('Docker not available, falling back to local execution');
      runLocalExecution(language, tempDir, filename, resolve);
    });
  });
}

// Fallback local execution (WARNING: No sandboxing — dev/testing only!)
function runLocalExecution(language, tempDir, filename, resolve) {
  const inheritedEnv = { ...process.env };
  const cmdTimeoutMs = Number(process.env.JUDGE_CMD_TIMEOUT_MS || 30000);

  // ── Helper: run a single command, collect stdout/stderr ─────────────────
  function runCmd(cmd, args, opts = {}) {
    return new Promise((res) => {
      let stdout = '', stderr = '', timedOut = false;
      const proc = spawn(cmd, args, { cwd: tempDir, env: inheritedEnv, ...opts });
      const timer = setTimeout(() => { timedOut = true; proc.kill('SIGKILL'); }, cmdTimeoutMs);
      proc.stdout.on('data', (d) => { stdout += d.toString(); });
      proc.stderr.on('data', (d) => { stderr += d.toString(); });
      proc.on('close', (exitCode) => { clearTimeout(timer); res({ stdout, stderr, timedOut, exitCode }); });
      proc.on('error', (err) => { clearTimeout(timer); res({ stdout: '', stderr: `Command error: ${err.message}`, timedOut: false, exitCode: 1 }); });
    });
  }

  // ── Python ───────────────────────────────────────────────────────────────
  if (language === 'python') {
    runCmd('python', [path.join(tempDir, filename)]).then(resolve);
    return;
  }

  // ── JavaScript ───────────────────────────────────────────────────────────
  if (language === 'javascript') {
    runCmd('node', [path.join(tempDir, filename)]).then(resolve);
    return;
  }

  // ── Java ─────────────────────────────────────────────────────────────────
  if (language === 'java') {
    // Step 1: compile
    runCmd('javac', [filename]).then(async (compileResult) => {
      // ENOENT = javac not installed
      if (compileResult.stderr && compileResult.stderr.includes('ENOENT')) {
        return resolve({
          stdout: '',
          stderr: 'Java compiler (javac) is not installed on this server. Install JDK to enable Java execution.',
          timedOut: false,
          exitCode: 1,
        });
      }
      if (compileResult.exitCode !== 0) {
        // Surface compile error cleanly
        return resolve({
          stdout: '',
          stderr: compileResult.stderr || compileResult.stdout || 'Compilation failed',
          timedOut: false,
          exitCode: compileResult.exitCode,
        });
      }
      // Step 2: run — class name matches public class in the driver
      const className = filename.replace('.java', '');
      const runResult = await runCmd('java', ['-cp', tempDir, className]);
      resolve(runResult);
    });
    return;
  }

  // ── C++ ──────────────────────────────────────────────────────────────────
  if (language === 'cpp') {
    const srcFile  = path.join(tempDir, filename);
    const outFile  = path.join(tempDir, process.platform === 'win32' ? 'solution_out.exe' : 'solution_out');
    // Step 1: compile
    runCmd('g++', ['-o', outFile, srcFile, '-std=c++17', '-O2']).then(async (compileResult) => {
      if (compileResult.stderr && compileResult.stderr.includes('ENOENT')) {
        return resolve({
          stdout: '',
          stderr: 'C++ compiler (g++) is not installed on this server. Install MinGW or GCC to enable C++ execution.',
          timedOut: false,
          exitCode: 1,
        });
      }
      if (compileResult.exitCode !== 0) {
        return resolve({
          stdout: '',
          stderr: compileResult.stderr || compileResult.stdout || 'Compilation failed',
          timedOut: false,
          exitCode: compileResult.exitCode,
        });
      }
      // Step 2: run
      const runResult = await runCmd(outFile, []);
      resolve(runResult);
    });
    return;
  }

  // ── Fallback ─────────────────────────────────────────────────────────────
  resolve({ stdout: '', stderr: `Unsupported language: ${language}`, timedOut: false, exitCode: 1 });
}

// ============================================
// ROUTE: RUN CODE (sample test cases only)
// ============================================

router.post('/run', async (req, res) => {
  try {
    const { problemSlug, code, language } = req.body;

    if (!problemSlug || !code || !language) {
      return res.status(400).json({ error: 'Missing required fields: problemSlug, code, language' });
    }

    // Fetch problem metadata
    const problem = await prisma.problem.findUnique({
      where: { slug: problemSlug },
      select: { id: true, functionName: true, starterCode: true },
    });

    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    const functionName = extractFunctionName(problem, problemSlug);

    // Fetch ONLY sample test cases (isSample = true)
    const sampleTCs = await prisma.testCase.findMany({
      where: { problemId: problem.id, isSample: true },
      orderBy: { createdAt: 'asc' },
    });

    if (sampleTCs.length === 0) {
      return res.status(400).json({ error: 'No sample test cases found for this problem' });
    }

    // Execute — no early-stop so the user sees ALL sample results at once
    const results = await executeInDocker(language, code, sampleTCs, {
      functionName,
      earlyStop: false,
    });

    const passedCount = results.filter((r) => r.passed).length;
    const total       = results.length;

    return res.json({
      success: true,
      mode:    'run',
      passed:  passedCount,
      total,
      verdict: deriveVerdict(results),
      results: results.map((r) => ({
        testCase:       r.testCase,
        input:          r.input,
        expectedOutput: r.expectedOutput,
        actualOutput:   r.actualOutput,
        passed:         r.passed,
        status:         r.status,
        error:          r.error      || null,
        lineNumber:     r.lineNumber || null,
        executionTime:  r.executionTime,
      })),
    });

  } catch (err) {
    console.error('Run error:', err);
    return res.status(500).json({ error: 'Execution failed', message: err.message });
  }
});

// ============================================
// ROUTE: SUBMIT CODE (all test cases)
// ============================================

router.post('/submit', async (req, res) => {
  try {
    const { problemSlug, code, language, userId } = req.body;

    if (!problemSlug || !code || !language) {
      return res.status(400).json({ error: 'Missing required fields: problemSlug, code, language' });
    }

    const problem = await prisma.problem.findUnique({
      where: { slug: problemSlug },
      select: { id: true, functionName: true, starterCode: true },
    });

    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    const functionName = extractFunctionName(problem, problemSlug);

    // Fetch ALL test cases (sample + hidden), samples first for ordering
    const allTCs = await prisma.testCase.findMany({
      where: { problemId: problem.id },
      orderBy: [{ isSample: 'desc' }, { createdAt: 'asc' }],
    });

    if (allTCs.length === 0) {
      return res.status(400).json({ error: 'No test cases found for this problem' });
    }

    // Execute with early-stop — mimics LeetCode / Codeforces behaviour
    const submitStart = Date.now();
    const results = await executeInDocker(language, code, allTCs, {
      functionName,
      earlyStop: true,          // stop on first failure
    });
    const totalExecutionTime = Date.now() - submitStart;

    const passedCount  = results.filter((r) => r.passed).length;
    const failedCount  = results.length - passedCount;
    const total        = allTCs.length;   // show full count, not just how many ran
    const verdict      = deriveVerdict(results);
    const allPassed    = passedCount === allTCs.length;
    const firstFailure = results.find((r) => !r.passed) || null;

    // ── Persist Submission ──────────────────────────────────────────────────
    if (userId) {
      try {
        await prisma.submission.create({
          data: { userId, problemId: problem.id, code, language, status: verdict, runtime: totalExecutionTime },
        });
      } catch (subErr) {
        console.error('Failed to save submission:', subErr);
      }
    }

    // ── Update UserProgress on Accepted ─────────────────────────────────────
    if (allPassed && userId) {
      try {
        await prisma.userProgress.upsert({
          where: { userId_problemId: { userId, problemId: problem.id } },
          update: { status: 'solved', lastAttempt: new Date() },
          create: { userId, problemId: problem.id, status: 'solved' },
        });
      } catch (progressErr) {
        console.error('Failed to update progress:', progressErr);
      }
    }

    return res.json({
      success:       true,
      mode:          'submit',
      verdict,
      passed:        passedCount,
      failed:        failedCount,
      total,
      executionTime: totalExecutionTime,
      message: allPassed
        ? `Accepted! All ${total} test cases passed.`
        : `Failed: ${passedCount}/${total} test cases passed`,
      firstFailure: firstFailure
        ? {
            testCase:       firstFailure.testCase,
            input:          firstFailure.input,
            expectedOutput: firstFailure.expectedOutput,
            actualOutput:   firstFailure.actualOutput,
            error:          firstFailure.error      || null,
            lineNumber:     firstFailure.lineNumber || null,
            status:         firstFailure.status,
          }
        : null,
      results: results.map((r) => ({
        testCase:      r.testCase,
        isSample:      r.isSample,
        passed:        r.passed,
        status:        r.status,
        executionTime: r.executionTime,
        // Reveal full details only for sample cases or the first failure
        // (mirrors LeetCode: hidden test details are not shown on failure)
        ...(r.isSample || (firstFailure && r.testCase === firstFailure.testCase)
          ? {
              input:          r.input,
              expectedOutput: r.expectedOutput,
              actualOutput:   r.actualOutput,
              error:          r.error      || null,
              lineNumber:     r.lineNumber || null,
            }
          : {}),
      })),
    });

  } catch (err) {
    console.error('Submit error:', err);
    return res.status(500).json({ error: 'Submission failed', message: err.message });
  }
});

// ============================================
// ROUTE: GET SAMPLE TEST CASES (for UI display)
// ============================================

router.get('/testcases/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const problem = await prisma.problem.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    const sampleTCs = await prisma.testCase.findMany({
      where: { problemId: problem.id, isSample: true },
      orderBy: { createdAt: 'asc' },
      select: { id: true, input: true, output: true },
    });

    const testCases = sampleTCs.map((tc) => {
      const inputs = tc.input
        .trim()
        .split('\n')
        .filter(Boolean)
        .map((line) => { try { return JSON.parse(line.trim()); } catch { return line.trim(); } });

      let output;
      try { output = JSON.parse(tc.output); } catch { output = tc.output; }

      return { id: tc.id, inputs, output };
    });

    return res.json({ testCases });

  } catch (err) {
    console.error('Get test cases error:', err);
    return res.status(500).json({ error: 'Failed to fetch test cases', message: err.message });
  }
});

// ============================================
// ROUTE: HEALTH CHECK
// ============================================

router.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'judge',
    features: [
      'TestCase model (isSample/hidden split)',
      'Docker isolation with local fallback',
      'BigInt support',
      'Line number error reporting',
      'Memory & CPU limits',
      'TLE detection (5 s)',
      'Submission persistence',
      'UserProgress tracking',
    ],
  });
});

module.exports = router;
