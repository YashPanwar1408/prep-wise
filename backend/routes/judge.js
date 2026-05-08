const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const fs = require('fs').promises;
const os = require('os');
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

const prisma = require('../lib/prisma');

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
 * Sanitize user-submitted source code.
 *
 * Fixes common invisible characters that can break interpreters/compilers
 * (e.g. NBSP U+00A0 from copy/paste or seeded templates).
 */
function sanitizeSourceCode(code, _language) {
  if (code === null || code === undefined) return '';
  let s = String(code);

  // Normalize line endings for consistent line mapping
  s = s.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // Replace problematic whitespace / invisible chars
  s = s
    .replace(/\u00A0/g, ' ')              // non-breaking space
    .replace(/[\u200B\u200C\u200D]/g, '') // zero-width characters
    .replace(/\uFEFF/g, '')               // BOM
    .replace(/[\u2028\u2029]/g, '\n');   // unicode line separators

  return s;
}

/**
 * Output comparison.
 *
 * IMPORTANT:
 * - Most problems require ORDERED array equality.
 * - Only specific problems allow unordered answers (e.g. Two Sum, Group Anagrams).
 * - "Design" problems are encoded as operations arrays and compared as token strings
 *   ("null"/"true"/"false"/"123") to be language-agnostic.
 */
const UNORDERED_FLAT_ARRAY_SLUGS = new Set([
  'two-sum',
  'intersection-of-two-arrays',
  'word-search-ii',
]);

const UNORDERED_NESTED_ARRAY_SLUGS = new Set([
  'group-anagrams',
]);

function isPrimitive(v) {
  return v === null || v === undefined || ['string', 'number', 'boolean'].includes(typeof v);
}

function primitiveToken(v) {
  if (v === null || v === undefined) return 'null';
  if (typeof v === 'boolean') return v ? 'true' : 'false';
  return String(v);
}

function multisetEqual(a, b) {
  if (a.length !== b.length) return false;
  const count = new Map();
  for (const x of a) count.set(x, (count.get(x) || 0) + 1);
  for (const x of b) {
    const n = count.get(x) || 0;
    if (n === 0) return false;
    if (n === 1) count.delete(x);
    else count.set(x, n - 1);
  }
  return count.size === 0;
}

function normalizeGroupAnagrams(output) {
  // Canonical: sort strings within each group; sort groups by joined string
  if (!Array.isArray(output)) return null;
  const groups = [];
  for (const g of output) {
    if (!Array.isArray(g) || !g.every((x) => typeof x === 'string')) return null;
    const sorted = [...g].sort();
    groups.push(sorted);
  }
  groups.sort((a, b) => a.join('#').localeCompare(b.join('#')));
  return groups;
}

function isOpsBasedInput(parsedInputs) {
  return (
    Array.isArray(parsedInputs) &&
    parsedInputs.length === 1 &&
    Array.isArray(parsedInputs[0]) &&
    parsedInputs[0].some((x) => typeof x === 'string' && x.includes(':'))
  );
}

function opsOutputsMatch(actual, expected) {
  const actualArr = Array.isArray(actual) ? actual : [actual];
  const expectedArr = Array.isArray(expected) ? expected : [expected];

  const actualTokens = actualArr.map(primitiveToken);
  const expectedTokens = expectedArr.map(primitiveToken);

  // Exact per-op comparison
  if (actualTokens.length === expectedTokens.length) {
    return actualTokens.every((t, i) => t === expectedTokens[i]);
  }

  // Allow "query-only" expected outputs (e.g. MinStack cases omit nulls)
  const stripNulls = (arr) => arr.filter((t) => t !== 'null');
  const aStripped = stripNulls(actualTokens);
  const eStripped = stripNulls(expectedTokens);
  if (aStripped.length === expectedTokens.length) {
    return aStripped.every((t, i) => t === expectedTokens[i]);
  }
  if (aStripped.length === eStripped.length) {
    return aStripped.every((t, i) => t === eStripped[i]);
  }

  return false;
}

const outputsMatch = (actual, expected, { parsedInputs = null, problemSlug = null, opsBased = false } = {}) => {
  if (opsBased) return opsOutputsMatch(actual, expected);

  // Fast path: deep equality via JSON
  if (JSON.stringify(actual) === JSON.stringify(expected)) return true;

  // String comparison is whitespace-tolerant
  if (typeof actual === 'string' || typeof expected === 'string') {
    return normalize(actual) === normalize(expected);
  }

  // Unordered slugs: primitive arrays can be treated as multisets
  if (problemSlug && Array.isArray(actual) && Array.isArray(expected)) {
    if (problemSlug === 'top-k-frequent-elements' && parsedInputs && parsedInputs.length >= 2) {
      const inputArr = parsedInputs[0];
      const k = parsedInputs[1];
      if (Array.isArray(inputArr) && typeof k === 'number' && actual.length === k) {
        const freq = {};
        for (const x of inputArr) freq[String(x)] = (freq[String(x)] || 0) + 1;
        const actualSet = new Set(actual.map(String));
        const minFreqInActual = Math.min(...actual.map((x) => freq[String(x)] || 0));
        return Object.entries(freq).every(([x, f]) => actualSet.has(x) || f <= minFreqInActual);
      }
    }

    if (UNORDERED_FLAT_ARRAY_SLUGS.has(problemSlug) && actual.every(isPrimitive) && expected.every(isPrimitive)) {
      return multisetEqual(actual.map(primitiveToken), expected.map(primitiveToken));
    }

    if (UNORDERED_NESTED_ARRAY_SLUGS.has(problemSlug)) {
      const aNorm = normalizeGroupAnagrams(actual);
      const eNorm = normalizeGroupAnagrams(expected);
      if (!aNorm || !eNorm) return false;
      return JSON.stringify(aNorm) === JSON.stringify(eNorm);
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

const PYTHON_DRIVER_TEMPLATE = (
  functionName,
  userCode,
  inputCount,
  { problemSlug = '', designClassName = '', userCodeLineCount = 0, driverMeta = null } = {},
  inputPath = '/workspace/input.json'
) => {
  const driverMetaJson = JSON.stringify(driverMeta ?? null);
  return `
from __future__ import annotations
from typing import *
${userCode}

import sys
import json
import traceback
import os
import re

USER_CODE_START_LINE = 3
USER_CODE_LINE_COUNT = ${userCodeLineCount}
PROBLEM_SLUG = ${JSON.stringify(problemSlug)}
DESIGN_CLASS_NAME = ${JSON.stringify(designClassName)}
DRIVER_META = json.loads(${JSON.stringify(driverMetaJson)})

class ListNode:
  def __init__(self, val=0, next=None):
    self.val = val
    self.next = next

class TreeNode:
  def __init__(self, val=0, left=None, right=None):
    self.val = val
    self.left = left
    self.right = right

class Node:
  def __init__(self, val=0, neighbors=None, left=None, right=None, next=None, random=None, children=None):
    self.val = val
    self.neighbors = neighbors if neighbors is not None else []
    self.left = left
    self.right = right
    self.next = next
    self.random = random
    self.children = children if children is not None else []

def _build_linked_list(values, pos=None):
  if values is None:
    return None
  if not isinstance(values, list):
    return values
  if len(values) == 0:
    return None
  nodes = [ListNode(v) for v in values]
  for i in range(len(nodes) - 1):
    nodes[i].next = nodes[i + 1]
  if isinstance(pos, int) and pos >= 0 and pos < len(nodes):
    nodes[-1].next = nodes[pos]
  return nodes[0]

def _linked_list_to_array(head, max_nodes=10000):
  out = []
  seen = set()
  cur = head
  steps = 0
  while cur is not None and steps < max_nodes:
    ident = id(cur)
    if ident in seen:
      break
    seen.add(ident)
    out.append(cur.val)
    cur = getattr(cur, 'next', None)
    steps += 1
  return out

def _build_tree(values, ctor=TreeNode):
  if values is None:
    return None
  if not isinstance(values, list) or len(values) == 0:
    return None
  if values[0] is None:
    return None
  root = ctor(values[0])
  q = [root]
  i = 1
  while q and i < len(values):
    node = q.pop(0)
    if i < len(values):
      lv = values[i]
      i += 1
      if lv is not None:
        node.left = ctor(lv)
        q.append(node.left)
    if i < len(values):
      rv = values[i]
      i += 1
      if rv is not None:
        node.right = ctor(rv)
        q.append(node.right)
  return root

def _tree_to_array(root):
  if root is None:
    return []
  out = []
  q = [root]
  while q:
    node = q.pop(0)
    if node is None:
      out.append(None)
      continue
    out.append(getattr(node, 'val', None))
    q.append(getattr(node, 'left', None))
    q.append(getattr(node, 'right', None))
  while out and out[-1] is None:
    out.pop()
  return out

def _find_tree_node_by_value(root, value):
  if root is None:
    return None
  q = [root]
  while q:
    node = q.pop(0)
    if node is None:
      continue
    if getattr(node, 'val', None) == value:
      return node
    q.append(getattr(node, 'left', None))
    q.append(getattr(node, 'right', None))
  return None

def _build_graph(adj_list):
  if adj_list is None:
    return None
  if not isinstance(adj_list, list) or len(adj_list) == 0:
    return None
  nodes = {i + 1: Node(i + 1) for i in range(len(adj_list))}
  for i, neighs in enumerate(adj_list, start=1):
    if not isinstance(neighs, list):
      continue
    nodes[i].neighbors = [nodes.get(int(n)) for n in neighs if int(n) in nodes]
  return nodes.get(1)

def _graph_to_adj_list(start):
  if start is None:
    return []
  seen = {}
  q = [start]
  while q:
    node = q.pop(0)
    if node is None:
      continue
    v = int(getattr(node, 'val', 0) or 0)
    if v in seen:
      continue
    seen[v] = node
    for nei in getattr(node, 'neighbors', []) or []:
      if nei is not None:
        q.append(nei)
  if not seen:
    return []
  n = max(seen.keys())
  out = [[] for _ in range(n)]
  for v in range(1, n + 1):
    node = seen.get(v)
    if node is None:
      out[v - 1] = []
      continue
    vals = []
    for nei in getattr(node, 'neighbors', []) or []:
      if nei is not None and getattr(nei, 'val', None) is not None:
        vals.append(int(nei.val))
    vals.sort()
    out[v - 1] = vals
  return out

def _build_random_list(pairs):
  if pairs is None:
    return None
  if not isinstance(pairs, list) or len(pairs) == 0:
    return None
  nodes = [Node(p[0] if isinstance(p, list) and len(p) > 0 else 0) for p in pairs]
  for i in range(len(nodes) - 1):
    nodes[i].next = nodes[i + 1]
  for i, p in enumerate(pairs):
    if not isinstance(p, list) or len(p) < 2:
      continue
    ridx = p[1]
    if ridx is None:
      nodes[i].random = None
    elif isinstance(ridx, int) and 0 <= ridx < len(nodes):
      nodes[i].random = nodes[ridx]
  return nodes[0]

def _random_list_to_pairs(head, max_nodes=10000):
  if head is None:
    return []
  nodes = []
  idx = {}
  cur = head
  steps = 0
  while cur is not None and steps < max_nodes:
    ident = id(cur)
    if ident in idx:
      break
    idx[ident] = len(nodes)
    nodes.append(cur)
    cur = getattr(cur, 'next', None)
    steps += 1

  out = []
  for n in nodes:
    r = getattr(n, 'random', None)
    ridx = idx.get(id(r)) if r is not None else None
    out.append([getattr(n, 'val', None), ridx])
  return out

def _prepare_call_args(raw_args):
  meta = DRIVER_META or {}
  params = meta.get('params') if isinstance(meta, dict) else None
  if not isinstance(params, list) or len(params) == 0:
    return raw_args

  call_args = []
  i = 0
  tree_root = None
  for p in params:
    kind = p.get('kind') if isinstance(p, dict) else None

    if kind == 'ListNodeArray':
      raw = raw_args[i] if i < len(raw_args) else []
      if not isinstance(raw, list):
        call_args.append([])
      else:
        call_args.append([_build_linked_list(x) for x in raw])
      i += 1
      continue

    if kind == 'ListNode':
      if PROBLEM_SLUG == 'linked-list-cycle' and i + 1 < len(raw_args) and isinstance(raw_args[i], list):
        call_args.append(_build_linked_list(raw_args[i], raw_args[i + 1]))
        i += 2
      else:
        raw = raw_args[i] if i < len(raw_args) else None
        call_args.append(_build_linked_list(raw))
        i += 1
      continue

    if kind == 'TreeNode':
      raw = raw_args[i] if i < len(raw_args) else None
      if isinstance(raw, list) or raw is None:
        tree_root = _build_tree(raw, TreeNode)
        call_args.append(tree_root)
      else:
        call_args.append(_find_tree_node_by_value(tree_root, raw))
      i += 1
      continue

    if kind == 'Node':
      raw = raw_args[i] if i < len(raw_args) else None
      if PROBLEM_SLUG == 'clone-graph':
        call_args.append(_build_graph(raw))
      elif PROBLEM_SLUG == 'copy-list-with-random-pointer':
        call_args.append(_build_random_list(raw))
      elif PROBLEM_SLUG == 'populating-next-right-pointers-in-each-node':
        tree_root = _build_tree(raw, Node)
        call_args.append(tree_root)
      else:
        call_args.append(raw)
      i += 1
      continue

    raw = raw_args[i] if i < len(raw_args) else None
    call_args.append(raw)
    i += 1

  # If we still have raw args left (signature mismatch), append them.
  while i < len(raw_args):
    call_args.append(raw_args[i])
    i += 1

  return call_args

def _serialize_result(result):
  meta = DRIVER_META or {}
  return_kind = meta.get('returnKind') if isinstance(meta, dict) else None

  if return_kind == 'ListNode':
    return _linked_list_to_array(result)
  if return_kind == 'TreeNode':
    return _tree_to_array(result)
  if return_kind == 'Node':
    if PROBLEM_SLUG == 'clone-graph':
      return _graph_to_adj_list(result)
    if PROBLEM_SLUG == 'copy-list-with-random-pointer':
      return _random_list_to_pairs(result)
    # Default Node serialization: treat as binary tree
    return _tree_to_array(result)

  return result

# BigInt-safe JSON encoder
class BigIntEncoder(json.JSONEncoder):
  def default(self, obj):
    if isinstance(obj, int) and (obj > 2**53 - 1 or obj < -(2**53 - 1)):
      return str(obj)
    return super().default(obj)

def _to_token(val):
  if val is None:
    return "null"
  if isinstance(val, bool):
    return "true" if val else "false"
  return str(val)

def _parse_arg(token: str):
  token = token.strip()
  if token == "":
    return ""
  if re.fullmatch(r"-?\\d+", token):
    try:
      return int(token)
    except Exception:
      pass
  if re.fullmatch(r"-?\\d+\\.\\d+", token):
    try:
      return float(token)
    except Exception:
      pass
  if token == "true":
    return True
  if token == "false":
    return False
  if token[:1] in '[{"':
    try:
      return json.loads(token)
    except Exception:
      pass
  return token

def _is_ops_based(args):
  return (
    isinstance(args, list)
    and len(args) == 1
    and isinstance(args[0], list)
    and any(isinstance(x, str) and ":" in x for x in args[0])
  )

def _run_ops(ops):
  if not isinstance(ops, list):
    raise Exception("ops must be a list")

  class_name = DESIGN_CLASS_NAME
  ctor_args = []
  idx = 0
  results = []

  if len(ops) > 0 and isinstance(ops[0], str):
    first = ops[0]
    # Constructor encoded in the ops list
    if ":" in first and first.split(":", 1)[0][:1].isupper():
      name, rest = first.split(":", 1)
      if not class_name:
        class_name = name
      # ctor args may be colon-separated or comma-separated
      raw_tokens = []
      for part in rest.split(":"):
        raw_tokens.extend(part.split(","))
      ctor_args = [_parse_arg(t) for t in raw_tokens]
      idx = 1
      results.append("null")
    elif first[:1].isupper() and not ":" in first:
      if not class_name:
        class_name = first
      idx = 1
      results.append("null")

  if not class_name:
    raise Exception("Could not determine design class name")

  cls = globals().get(class_name)
  if cls is None:
    raise Exception(f"Class '{class_name}' not found")

  obj = cls(*ctor_args)

  for op in ops[idx:]:
    if not isinstance(op, str) or op.strip() == "":
      results.append("null")
      continue
    if op == class_name or op.startswith(class_name + ":"):
      results.append("null")
      continue

    parts = op.split(":")
    method = parts[0]
    arg_parts = parts[1:]
    raw_tokens = []
    for p in arg_parts:
      raw_tokens.extend(p.split(","))
    call_args = [_parse_arg(t) for t in raw_tokens if t is not None]

    if not hasattr(obj, method):
      raise Exception(f"Method '{method}' not found on {class_name}")
    ret = getattr(obj, method)(*call_args)
    results.append(_to_token(ret))

  return results

def _run_standard(args):
  # Prefer LeetCode-style class Solution
  if 'Solution' in globals():
    sol = Solution()
    if hasattr(sol, ${JSON.stringify(functionName)}):
      fn = getattr(sol, ${JSON.stringify(functionName)})
      return fn(*args)

  # Fallback: global function
  fn = globals().get(${JSON.stringify(functionName)})
  if callable(fn):
    return fn(*args)

  raise Exception("Could not find Solution.${functionName} or a global ${functionName}()")

def _format_error(e, frame_lineno=None):
  msg = f"{type(e).__name__}: {str(e)}"
  if frame_lineno is None:
    return msg

  if USER_CODE_LINE_COUNT and USER_CODE_START_LINE <= frame_lineno <= (USER_CODE_START_LINE + USER_CODE_LINE_COUNT - 1):
    user_line = frame_lineno - USER_CODE_START_LINE + 1
    return msg + f" | Line {user_line}"

  return msg + f" | Line {frame_lineno}"

def main():
  try:
    input_file = '${inputPath}' if '${inputPath}' != '/workspace/input.json' else os.path.join(os.path.dirname(__file__), 'input.json')
    with open(input_file, 'r') as f:
      lines = [ln.strip() for ln in f.read().splitlines() if ln.strip()]

    raw_args = []
    for line in lines[:${inputCount}]:
      raw_args.append(json.loads(line))

    if _is_ops_based(raw_args):
      result = _run_ops(raw_args[0])
    else:
      call_args = _prepare_call_args(raw_args)
      result = _run_standard(call_args)
      result = _serialize_result(result)

    print(json.dumps(result, cls=BigIntEncoder, separators=(',', ':')))

  except Exception as e:
    tb = traceback.extract_tb(sys.exc_info()[2])
    frame_lineno = None
    # Prefer the deepest frame that points into this file
    for frame in reversed(tb):
      if frame.filename.endswith('solution.py'):
        frame_lineno = frame.lineno
        break
    print(_format_error(e, frame_lineno), file=sys.stderr)
    sys.exit(1)

if __name__ == '__main__':
  main()
`;
};

const JAVASCRIPT_DRIVER_TEMPLATE = (
  functionName,
  userCode,
  inputCount,
  { problemSlug = '', designClassName = '', userCodeLineCount = 0, driverMeta = null } = {},
  inputPath = '/workspace/input.json'
) => {
  const driverMetaJson = JSON.stringify(driverMeta ?? null);
  return `
${userCode}

const fs = require('fs');
const path = require('path');

${BIGINT_REPLACER}

const USER_CODE_START_LINE = 1;
const USER_CODE_LINE_COUNT = ${userCodeLineCount};
const PROBLEM_SLUG = ${JSON.stringify(problemSlug)};
const DESIGN_CLASS_NAME = ${JSON.stringify(designClassName)};
const DRIVER_META = ${driverMetaJson};

function ListNode(val, next) {
  this.val = (val === undefined ? 0 : val);
  this.next = (next === undefined ? null : next);
}

function TreeNode(val, left, right) {
  this.val = (val === undefined ? 0 : val);
  this.left = (left === undefined ? null : left);
  this.right = (right === undefined ? null : right);
}

function Node(val, neighbors) {
  this.val = (val === undefined ? 0 : val);
  this.neighbors = (neighbors === undefined ? [] : neighbors);
  this.left = null;
  this.right = null;
  this.next = null;
  this.random = null;
  this.children = [];
}

function buildLinkedList(values, pos) {
  if (values === null || values === undefined) return null;
  if (!Array.isArray(values)) return values;
  if (values.length === 0) return null;
  const nodes = values.map((v) => new ListNode(v));
  for (let i = 0; i < nodes.length - 1; i++) nodes[i].next = nodes[i + 1];
  if (Number.isInteger(pos) && pos >= 0 && pos < nodes.length) {
    nodes[nodes.length - 1].next = nodes[pos];
  }
  return nodes[0];
}

function linkedListToArray(head, maxNodes) {
  const out = [];
  const seen = new Set();
  let cur = head;
  let steps = 0;
  const limit = Number.isFinite(maxNodes) ? maxNodes : 10000;
  while (cur && steps < limit) {
    if (seen.has(cur)) break;
    seen.add(cur);
    out.push(cur.val);
    cur = cur.next;
    steps++;
  }
  return out;
}

function buildBinaryTree(values, Ctor) {
  const NodeCtor = Ctor || TreeNode;
  if (!Array.isArray(values) || values.length === 0) return null;
  if (values[0] === null || values[0] === undefined) return null;
  const root = new NodeCtor(values[0]);
  const q = [root];
  let i = 1;
  while (q.length && i < values.length) {
    const node = q.shift();
    if (!node) continue;
    if (i < values.length) {
      const lv = values[i++];
      if (lv !== null && lv !== undefined) {
        node.left = new NodeCtor(lv);
        q.push(node.left);
      }
    }
    if (i < values.length) {
      const rv = values[i++];
      if (rv !== null && rv !== undefined) {
        node.right = new NodeCtor(rv);
        q.push(node.right);
      }
    }
  }
  return root;
}

function treeToArray(root) {
  if (!root) return [];
  const out = [];
  const q = [root];
  while (q.length) {
    const node = q.shift();
    if (!node) {
      out.push(null);
      continue;
    }
    out.push(node.val);
    q.push(node.left);
    q.push(node.right);
  }
  while (out.length && out[out.length - 1] === null) out.pop();
  return out;
}

function findTreeNodeByValue(root, value) {
  if (!root) return null;
  const q = [root];
  while (q.length) {
    const node = q.shift();
    if (!node) continue;
    if (node.val === value) return node;
    q.push(node.left);
    q.push(node.right);
  }
  return null;
}

function buildGraph(adjList) {
  if (!Array.isArray(adjList) || adjList.length === 0) return null;
  const nodes = new Map();
  for (let i = 1; i <= adjList.length; i++) nodes.set(i, new Node(i));
  for (let i = 1; i <= adjList.length; i++) {
    const neighs = adjList[i - 1];
    if (!Array.isArray(neighs)) continue;
    nodes.get(i).neighbors = neighs
      .map((n) => Number(n))
      .filter((n) => nodes.has(n))
      .map((n) => nodes.get(n));
  }
  return nodes.get(1) || null;
}

function graphToAdjList(start) {
  if (!start) return [];
  const seen = new Map();
  const q = [start];
  while (q.length) {
    const node = q.shift();
    if (!node) continue;
    const v = Number(node.val);
    if (seen.has(v)) continue;
    seen.set(v, node);
    const neighs = Array.isArray(node.neighbors) ? node.neighbors : [];
    for (const nei of neighs) q.push(nei);
  }
  if (seen.size === 0) return [];
  const maxVal = Math.max(...seen.keys());
  const out = Array.from({ length: maxVal }, () => []);
  for (let v = 1; v <= maxVal; v++) {
    const node = seen.get(v);
    if (!node) continue;
    const neighVals = (Array.isArray(node.neighbors) ? node.neighbors : [])
      .filter(Boolean)
      .map((n) => Number(n.val))
      .filter(Number.isFinite)
      .sort((a, b) => a - b);
    out[v - 1] = neighVals;
  }
  return out;
}

function buildRandomList(pairs) {
  if (!Array.isArray(pairs) || pairs.length === 0) return null;
  const nodes = pairs.map((p) => new Node(Array.isArray(p) ? p[0] : 0));
  for (let i = 0; i < nodes.length - 1; i++) nodes[i].next = nodes[i + 1];
  for (let i = 0; i < pairs.length; i++) {
    const p = pairs[i];
    const ridx = Array.isArray(p) ? p[1] : null;
    if (ridx === null || ridx === undefined) nodes[i].random = null;
    else if (Number.isInteger(ridx) && ridx >= 0 && ridx < nodes.length) nodes[i].random = nodes[ridx];
  }
  return nodes[0];
}

function randomListToPairs(head, maxNodes) {
  if (!head) return [];
  const nodes = [];
  const idx = new Map();
  let cur = head;
  let steps = 0;
  const limit = Number.isFinite(maxNodes) ? maxNodes : 10000;
  while (cur && steps < limit) {
    if (idx.has(cur)) break;
    idx.set(cur, nodes.length);
    nodes.push(cur);
    cur = cur.next;
    steps++;
  }
  return nodes.map((n) => [
    n.val,
    n.random ? (idx.has(n.random) ? idx.get(n.random) : null) : null,
  ]);
}

function prepareCallArgs(rawArgs) {
  const meta = DRIVER_META && typeof DRIVER_META === 'object' ? DRIVER_META : null;
  const params = meta && Array.isArray(meta.params) ? meta.params : null;
  if (!params || params.length === 0) return rawArgs;

  const callArgs = [];
  let i = 0;
  let treeRoot = null;

  for (const p of params) {
    const kind = p && typeof p === 'object' ? p.kind : null;

    if (kind === 'ListNodeArray') {
      const raw = rawArgs[i];
      callArgs.push(Array.isArray(raw) ? raw.map((x) => buildLinkedList(x)) : []);
      i += 1;
      continue;
    }

    if (kind === 'ListNode') {
      if (PROBLEM_SLUG === 'linked-list-cycle' && Array.isArray(rawArgs[i]) && (Number.isInteger(rawArgs[i + 1]) || rawArgs[i + 1] === -1)) {
        callArgs.push(buildLinkedList(rawArgs[i], rawArgs[i + 1]));
        i += 2;
      } else {
        callArgs.push(buildLinkedList(rawArgs[i]));
        i += 1;
      }
      continue;
    }

    if (kind === 'TreeNode') {
      const raw = rawArgs[i];
      if (Array.isArray(raw) || raw === null) {
        treeRoot = buildBinaryTree(raw, TreeNode);
        callArgs.push(treeRoot);
      } else {
        callArgs.push(findTreeNodeByValue(treeRoot, raw));
      }
      i += 1;
      continue;
    }

    if (kind === 'Node') {
      const raw = rawArgs[i];
      if (PROBLEM_SLUG === 'clone-graph') {
        callArgs.push(buildGraph(raw));
      } else if (PROBLEM_SLUG === 'copy-list-with-random-pointer') {
        callArgs.push(buildRandomList(raw));
      } else if (PROBLEM_SLUG === 'populating-next-right-pointers-in-each-node') {
        treeRoot = buildBinaryTree(raw, Node);
        callArgs.push(treeRoot);
      } else {
        callArgs.push(raw);
      }
      i += 1;
      continue;
    }

    callArgs.push(rawArgs[i]);
    i += 1;
  }

  while (i < rawArgs.length) {
    callArgs.push(rawArgs[i]);
    i += 1;
  }

  return callArgs;
}

function serializeResult(result) {
  const meta = DRIVER_META && typeof DRIVER_META === 'object' ? DRIVER_META : null;
  const returnKind = meta ? meta.returnKind : null;

  if (returnKind === 'ListNode') return linkedListToArray(result);
  if (returnKind === 'TreeNode') return treeToArray(result);
  if (returnKind === 'Node') {
    if (PROBLEM_SLUG === 'clone-graph') return graphToAdjList(result);
    if (PROBLEM_SLUG === 'copy-list-with-random-pointer') return randomListToPairs(result);
    return treeToArray(result);
  }

  return result;
}

function toToken(val) {
  if (val === null || val === undefined) return 'null';
  if (typeof val === 'boolean') return val ? 'true' : 'false';
  return String(val);
}

function parseArgToken(token) {
  const t = String(token).trim();
  if (t === '') return '';
  if (/^-?\d+$/.test(t)) return Number.parseInt(t, 10);
  if (/^-?\d+\.\d+$/.test(t)) return Number.parseFloat(t);
  if (t === 'true') return true;
  if (t === 'false') return false;
  if (t[0] === '[' || t[0] === '{' || t[0] === '"') {
    try { return JSON.parse(t); } catch { /* ignore */ }
  }
  return t;
}

function isOpsBased(args) {
  return Array.isArray(args) &&
    args.length === 1 &&
    Array.isArray(args[0]) &&
    args[0].some((x) => typeof x === 'string' && x.includes(':'));
}

async function runOps(ops) {
  if (!Array.isArray(ops)) throw new Error('ops must be an array');

  let className = DESIGN_CLASS_NAME;
  let ctorArgs = [];
  let idx = 0;
  const results = [];

  if (ops.length > 0 && typeof ops[0] === 'string') {
    const first = ops[0];
    const firstPrefix = first.split(':', 1)[0];
    if (first.includes(':') && /^[A-Z]/.test(firstPrefix)) {
      if (!className) className = firstPrefix;
      const rest = first.slice(firstPrefix.length + 1);
      ctorArgs = rest.split(':').flatMap((p) => p.split(',')).map(parseArgToken);
      idx = 1;
      results.push('null');
    } else if (!first.includes(':') && /^[A-Z]/.test(first)) {
      if (!className) className = first;
      idx = 1;
      results.push('null');
    }
  }

  if (!className) throw new Error('Could not determine design class name');

  const Ctor = (typeof globalThis[className] !== 'undefined') ? globalThis[className] : (typeof eval === 'function' ? eval(className) : undefined);
  if (typeof Ctor !== 'function') {
    throw new Error("Class '" + className + "' not found");
  }
  const obj = new Ctor(...ctorArgs);

  for (let i = idx; i < ops.length; i++) {
    const op = ops[i];
    if (typeof op !== 'string' || op.trim() === '') {
      results.push('null');
      continue;
    }
    if (op === className || op.startsWith(className + ':')) {
      results.push('null');
      continue;
    }
    const parts = op.split(':');
    const method = parts[0];
    const argTokens = parts.slice(1).flatMap((p) => p.split(','));
    const callArgs = argTokens.filter((t) => t !== undefined).map(parseArgToken);

    const fn = obj?.[method];
    if (typeof fn !== 'function') {
      throw new Error("Method '" + method + "' not found on " + className);
    }
    const ret = await fn.apply(obj, callArgs);
    results.push(toToken(ret));
  }

  return results;
}

async function runStandard(args) {
  // Prefer function-style JS solutions: var fn = function(...) {}
  if (typeof ${functionName} === 'function') {
    return await ${functionName}(...args);
  }

  // Fallback: LeetCode-style class Solution
  if (typeof Solution === 'function') {
    const sol = new Solution();
    if (typeof sol?.[${JSON.stringify(functionName)}] === 'function') {
      return await sol[${JSON.stringify(functionName)}](...args);
    }
  }

  throw new Error('Could not find a callable ${functionName}() or Solution.${functionName}()');
}

function formatUserLine(line) {
  if (!Number.isFinite(line)) return null;
  if (line >= USER_CODE_START_LINE && line <= (USER_CODE_START_LINE + USER_CODE_LINE_COUNT - 1)) {
    return line - USER_CODE_START_LINE + 1;
  }
  return line;
}

async function main() {
  try {
    const inputFile = '${inputPath}' !== '/workspace/input.json'
      ? '${inputPath}'
      : path.join(__dirname, 'input.json');

    const content = fs.readFileSync(inputFile, 'utf8');
    const lines = content
      .split(/\\r\\n|\\r|\\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    const rawArgs = [];
    for (let i = 0; i < ${inputCount}; i++) {
      rawArgs.push(JSON.parse(lines[i]));
    }

    let result;
    if (isOpsBased(rawArgs)) {
      result = await runOps(rawArgs[0]);
    } else {
      const callArgs = prepareCallArgs(rawArgs);
      result = await runStandard(callArgs);
      result = serializeResult(result);
    }

    console.log(${BIGINT_STRINGIFY});
  } catch (error) {
    const stack = String(error && error.stack ? error.stack : '');
    const match = stack.match(/solution\.js:(\d+)(?::(\d+))?/);
    const rawLine = match ? Number.parseInt(match[1], 10) : NaN;
    const userLine = formatUserLine(rawLine);
    const suffix = userLine ? (' | Line ' + userLine) : '';
    console.error(String(error.name || 'Error') + ': ' + String(error.message || String(error)) + suffix);
    process.exit(1);
  }
}

main();
`;
};

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
async function executeInDocker(language, code, testCases, { functionName = 'solution', earlyStop = false, problemSlug = null, designClassName = '', driverMeta = null } = {}) {
  const sanitizedCode = sanitizeSourceCode(code, language);
  const userCodeLineCount = sanitizedCode.split('\n').length;
  const sessionId = uuidv4();
  // IMPORTANT: Use OS temp directory so dev watchers (nodemon) don't restart
  // the backend while we write per-run files.
  const tempDir = path.join(os.tmpdir(), 'prep-wise', 'judge', sessionId);
  
  try {
    await fs.mkdir(tempDir, { recursive: true });
    
    const results = [];
    
    for (let idx = 0; idx < testCases.length; idx++) {
      const testCase = testCases[idx];

      // Derive input-line count for THIS test case (robust to mixed schemas)
      const rawLines = String(testCase.input || '')
        .split(/\r\n|\r|\n/)
        .map((l) => l.trim())
        .filter(Boolean);
      const inputCount = rawLines.length;

      // Parse inputs up-front (needed by Java/C++ template to inline literals)
      const parsedInputs = rawLines.map((line) => { try { return JSON.parse(line); } catch { return line; } });

      // Build a fresh driver for this test case
      let driverCode;
      let ext;
      if (language === 'python') {
        driverCode = PYTHON_DRIVER_TEMPLATE(functionName, sanitizedCode, inputCount, {
          problemSlug: problemSlug || '',
          designClassName: designClassName || '',
          userCodeLineCount,
          driverMeta,
        });
        ext = 'py';
      } else if (language === 'java') {
        driverCode = buildJavaDriver(functionName, sanitizedCode, parsedInputs);
        ext = 'java';
      } else if (language === 'cpp') {
        driverCode = buildCppDriver(functionName, sanitizedCode, parsedInputs);
        ext = 'cpp';
      } else {
        // javascript / default
        driverCode = JAVASCRIPT_DRIVER_TEMPLATE(functionName, sanitizedCode, inputCount, {
          problemSlug: problemSlug || '',
          designClassName: designClassName || '',
          userCodeLineCount,
          driverMeta,
        });
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
          errorMsg.match(/\.(?:java|cpp|py|js):(\d+)(?::\d+)?\b/i) ||
          errorMsg.match(/File\s+".*\.py",\s*line\s*(\d+)/i) ||
          errorMsg.match(/solution\.(?:js|py):(\d+)(?::\d+)?/i);
        let lineNumber = lineMatch ? parseInt(lineMatch[1], 10) : null;

        // If the interpreter/compiler reported a line in the wrapper file, map it
        // back to the user's code for Python (2-line preamble).
        if (!errorMsg.match(/\|\s*Line\s+\d+/i) && lineNumber && language === 'python') {
          lineNumber = Math.max(1, lineNumber - 2);
        }

        // Clean error: use the part before '|' if present, otherwise raw
        const cleanError = errorMsg.includes('|')
          ? errorMsg.split('|')[0].trim()
          : errorMsg.trim().slice(0, 1000); // cap at 1000 chars

        // Heuristic classification
        const isCompileError =
          /SyntaxError|SYNTAX_ERROR|Compilation failed|error:\s/i.test(errorMsg) &&
          !/RuntimeError/i.test(errorMsg);

        results.push({
          testCase: idx + 1,
          isSample: testCase.isSample !== undefined ? testCase.isSample : false,
          input: parsedInputs,
          expectedOutput,
          actualOutput: null,
          passed: false,
          status: isCompileError ? 'Compilation Error' : 'Runtime Error',
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
        const opsBased = isOpsBasedInput(parsedInputs);
        const passed = outputsMatch(actualOutput, expectedOutput, { parsedInputs, problemSlug, opsBased });

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

    // C++ still uses local execution by default (Docker image not configured here)
    if (language === 'cpp') {
      return runLocalExecution(language, tempDir, filename, resolve);
    }

    let image;
    let cmd;

    if (language === 'python') {
      image = 'python:3.11-alpine';
      cmd = ['python', `/workspace/${filename}`];
    } else if (language === 'javascript') {
      image = 'node:18-alpine';
      cmd = ['node', `/workspace/${filename}`];
    } else if (language === 'java') {
      // Run Java in a JDK container so the host doesn't need javac installed.
      // (Still falls back to local execution if Docker isn't available.)
      image = 'eclipse-temurin:17-jdk-alpine';
      const className = filename.replace(/\.java$/i, '');
      cmd = ['sh', '-lc', `javac /workspace/${filename} && java -cp /workspace ${className}`];
    } else {
      return runLocalExecution(language, tempDir, filename, resolve);
    }
    
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
    const driverMeta = extractDriverMeta(problem, functionName);

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
      problemSlug,
      // Extract a design class name only if this looks like an ops-based problem.
      designClassName: extractDesignClassName(problem, language) || '',
      driverMeta,
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
        isHidden:       false,
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
    const driverMeta = extractDriverMeta(problem, functionName);

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
      earlyStop: false,          // run ALL cases to show per-test-case pass/fail
      problemSlug,
      designClassName: extractDesignClassName(problem, language) || '',
      driverMeta,
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
        isHidden:      !r.isSample,
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

// Expose internals for local/dev smoke-testing.
// Safe: does not change any route behavior.
router._internal = {
  PYTHON_DRIVER_TEMPLATE,
  JAVASCRIPT_DRIVER_TEMPLATE,
  executeInDocker,
  extractDriverMeta,
};

module.exports = router;

// ============================================
// Helper: extract design class name
// ============================================
function extractDesignClassName(problem, language) {
  const sc = problem?.starterCode;
  if (!sc || typeof sc !== 'object') return null;
  const raw = String(sc[language] || '');
  if (!raw.trim()) return null;

  // Python: class Trie:
  if (language === 'python') {
    const m = raw.match(/class\s+([A-Za-z_][A-Za-z0-9_]*)\s*:/);
    if (m) return m[1];
    return null;
  }

  // JS: var Trie = function() {}  OR  class Trie {}
  if (language === 'javascript') {
    const m1 = raw.match(/class\s+([A-Za-z_][A-Za-z0-9_]*)\b/);
    if (m1) return m1[1];
    const m2 = raw.match(/(?:var|let|const)\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*function\b/);
    if (m2 && /^[A-Z]/.test(m2[1])) return m2[1];
    return null;
  }

  // Java / C++: class Name
  if (language === 'java' || language === 'cpp') {
    const m = raw.match(/class\s+([A-Za-z_][A-Za-z0-9_]*)\b/);
    if (m && /^[A-Z]/.test(m[1])) return m[1];
  }

  return null;
}

// ============================================
// Helper: extract driver meta (ListNode/TreeNode/Node)
// ============================================
function splitTopLevelPython(str, delimiterChar) {
  const parts = [];
  let buf = '';
  let depth = 0;
  let inSingle = false;
  let inDouble = false;
  const delim = delimiterChar || ',';

  for (let i = 0; i < String(str || '').length; i++) {
    const ch = str[i];

    if (ch === "'" && !inDouble) {
      inSingle = !inSingle;
      buf += ch;
      continue;
    }
    if (ch === '"' && !inSingle) {
      inDouble = !inDouble;
      buf += ch;
      continue;
    }

    if (!inSingle && !inDouble) {
      if (ch === '[' || ch === '(' || ch === '{') depth++;
      else if (ch === ']' || ch === ')' || ch === '}') depth = Math.max(0, depth - 1);

      if (ch === delim && depth === 0) {
        if (buf.trim()) parts.push(buf.trim());
        buf = '';
        continue;
      }
    }

    buf += ch;
  }

  if (buf.trim()) parts.push(buf.trim());
  return parts;
}

function stripPythonDefaultValue(paramPart) {
  const parts = splitTopLevelPython(paramPart, '=');
  return (parts[0] || '').trim();
}

function kindFromPythonType(typeStr) {
  const t = String(typeStr || '').replace(/[\"']/g, '').trim();
  if (!t) return null;

  const isListContainer = /\b(List|list)\s*\[/.test(t);

  if (t.includes('ListNode')) return isListContainer ? 'ListNodeArray' : 'ListNode';
  if (t.includes('TreeNode')) return isListContainer ? 'TreeNodeArray' : 'TreeNode';

  // Avoid matching TreeNode via the substring "Node"
  if (/\bNode\b/.test(t)) return isListContainer ? 'NodeArray' : 'Node';

  return null;
}

function extractDriverMeta(problem, functionName) {
  const py = String(problem?.starterCode?.python || '');
  if (!py.trim()) return null;

  // Match either "def fn(self, ...):" or "def fn(...):"
  const escaped = String(functionName || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`def\\s+${escaped}\\s*\\(([^)]*)\\)\\s*(?:->\\s*([^:]+))?\\s*:`, 'm');
  const m = py.match(re);
  if (!m) return null;

  const argsStr = String(m[1] || '').trim();
  const returnStr = String(m[2] || '').trim();
  const rawArgs = splitTopLevelPython(argsStr, ',');

  const params = [];
  for (const raw of rawArgs) {
    const cleaned = stripPythonDefaultValue(raw);
    if (!cleaned) continue;
    if (cleaned === 'self') continue;
    if (cleaned.startsWith('self,')) continue;

    const [namePart, typePart] = cleaned.split(':', 2);
    const name = String(namePart || '').trim().replace(/^\*+/, '');
    const kind = kindFromPythonType(typePart);
    if (!name) continue;
    params.push({ name, kind });
  }

  const returnKind = kindFromPythonType(returnStr);

  if (!params.length && !returnKind) return null;
  return { params, returnKind };
}
