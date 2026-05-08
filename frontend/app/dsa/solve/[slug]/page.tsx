"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Play, Upload } from "lucide-react";
import { Panel, Group, Separator } from "react-resizable-panels";
import { API_BASE_URL } from "@/lib/api";

type Language = "python" | "javascript" | "java" | "cpp";

interface Problem {
  id: number;
  title: string;
  difficulty: string;
  description: string;
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  constraints: string[];
  starterCode?: Record<Language, string>;
  functionName?: string | null;
  slug?: string;
}

interface TestResult {
  input: unknown;
  expectedOutput: unknown;
  actualOutput: unknown;
  passed: boolean;
  error?: string;
  executionTime?: number;
  memoryUsed?: number;
  isHidden?: boolean;
  lineNumber?: number;
  status?: string;
  testCase?: number;
}

const LANGS: Record<Language, string> = {
  python: "Python",
  javascript: "JavaScript",
  java: "Java",
  cpp: "C++",
};

const sanitizeEditorCode = (src: string) =>
  String(src)
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\u00A0/g, " ")
    .replace(/[\u200B\u200C\u200D]/g, "")
    .replace(/\uFEFF/g, "");

const slugToFunctionName = (s: string) =>
  s.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());

type ExtractedSignature = {
  name: string;
  params: Array<{ name: string; pyType?: string }>;
  returnPyType?: string;
};

const normalizePyType = (t?: string) =>
  String(t || '')
    .trim()
    .replace(/^typing\./, '')
    .replace(/^Optional\[(.*)\]$/, '$1')
    .replace(/^Union\[(.*)\]$/, (_m, inner) => {
      const parts = String(inner)
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean)
        .filter((p) => p !== 'None');
      return parts[0] || 'Any';
    });

function tryExtractPythonSignature(pySrc: string): ExtractedSignature | null {
  const m = pySrc.match(/def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(([^)]*)\)\s*(?:->\s*([^:]+))?:/);
  if (!m) return null;

  const [, name, rawParams, rawReturn] = m;
  const parts = rawParams
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean)
    .filter((p) => p !== 'self');

  const params = parts.map((p) => {
    const noDefault = p.split('=')[0].trim();
    const [paramName, typeAnno] = noDefault.split(':').map((x) => x.trim());
    return { name: paramName || 'arg', pyType: typeAnno || undefined };
  });

  const returnPyType = rawReturn ? normalizePyType(rawReturn) : undefined;
  return { name, params, returnPyType };
}

function tryExtractJavaScriptSignature(jsSrc: string): { name: string; params: string[] } | null {
  // var fn = function(a, b)
  const m1 = jsSrc.match(/(?:var|let|const)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*function\s*\(([^)]*)\)/);
  if (m1) {
    const [, name, rawParams] = m1;
    const params = rawParams
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);
    return { name, params };
  }
  // function fn(a, b)
  const m2 = jsSrc.match(/function\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(([^)]*)\)/);
  if (m2) {
    const [, name, rawParams] = m2;
    const params = rawParams
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);
    return { name, params };
  }
  return null;
}

function pyTypeToJava(t?: string, { forReturn = false } = {}): string {
  const n = normalizePyType(t);
  if (!n || n === 'Any') return forReturn ? 'Object' : 'Object';

  const listMatch = n.match(/^(?:List|list)\[(.*)\]$/);
  if (listMatch) {
    const inner = normalizePyType(listMatch[1]);
    const innerListMatch = inner.match(/^(?:List|list)\[(.*)\]$/);
    if (innerListMatch) {
      const scalar = pyTypeToJava(innerListMatch[1]);
      return `${scalar}[][]`;
    }
    const scalar = pyTypeToJava(inner);
    return `${scalar}[]`;
  }

  switch (n) {
    case 'int':
      return 'int';
    case 'float':
      return 'double';
    case 'bool':
      return 'boolean';
    case 'str':
      return 'String';
    case 'None':
      return 'void';
    default:
      return 'Object';
  }
}

function pyTypeToCpp(t?: string, { forReturn = false } = {}): string {
  const n = normalizePyType(t);
  if (!n || n === 'Any') return forReturn ? 'int' : 'int';

  const listMatch = n.match(/^(?:List|list)\[(.*)\]$/);
  if (listMatch) {
    const inner = normalizePyType(listMatch[1]);
    const innerListMatch = inner.match(/^(?:List|list)\[(.*)\]$/);
    if (innerListMatch) {
      const scalar = pyTypeToCpp(innerListMatch[1]);
      return `vector<vector<${scalar}>>`;
    }
    const scalar = pyTypeToCpp(inner);
    return `vector<${scalar}>`;
  }

  switch (n) {
    case 'int':
      return 'int';
    case 'float':
      return 'double';
    case 'bool':
      return 'bool';
    case 'str':
      return 'string';
    default:
      return 'int';
  }
}

function buildFallbackStarter(problem: Problem, language: Language, slug: string): string {
  const sc = (problem?.starterCode ?? {}) as Partial<Record<Language, string>>;
  const py = typeof sc.python === 'string' ? sc.python : '';
  const js = typeof sc.javascript === 'string' ? sc.javascript : '';

  const pySig = py ? tryExtractPythonSignature(py) : null;
  const jsSig = js ? tryExtractJavaScriptSignature(js) : null;

  const functionName =
    problem.functionName ||
    pySig?.name ||
    jsSig?.name ||
    slugToFunctionName(problem.slug || slug);

  const paramNames =
    pySig?.params.map((p) => p.name).filter(Boolean) ||
    jsSig?.params.filter(Boolean) ||
    [];

  const paramsWithTypes: Array<{ name: string; pyType?: string }> = pySig?.params.length
    ? pySig.params
    : paramNames.map((n) => ({ name: n, pyType: undefined }));

  if (language === 'python') {
    const args = paramsWithTypes
      .map((p) => (p.pyType ? `${p.name}: ${normalizePyType(p.pyType)}` : p.name))
      .join(', ');
    const returns = pySig?.returnPyType ? ` -> ${normalizePyType(pySig.returnPyType)}` : '';
    return `from typing import *\n\nclass Solution:\n    def ${functionName}(self${args ? `, ${args}` : ''})${returns}:\n        `;
  }

  if (language === 'javascript') {
    const args = (paramNames.length ? paramNames : paramsWithTypes.map((p) => p.name))
      .filter(Boolean)
      .join(', ');
    return `/**\n * @return {any}\n */\nvar ${functionName} = function(${args}) {\n  // Write your code here\n\n};`;
  }

  if (language === 'java') {
    const returnType = pySig?.returnPyType ? pyTypeToJava(pySig.returnPyType, { forReturn: true }) : 'Object';
    const args = paramsWithTypes
      .map((p, i) => {
        const t = p.pyType ? pyTypeToJava(p.pyType) : 'Object';
        const name = p.name || `arg${i}`;
        return `${t} ${name}`;
      })
      .join(', ');

    const returnStmt =
      returnType === 'void'
        ? ''
        : returnType === 'boolean'
          ? '\n        return false;'
          : returnType === 'int' || returnType === 'long' || returnType === 'double'
            ? '\n        return 0;'
            : '\n        return null;';

    return `import java.util.*;\n\nclass Solution {\n    public ${returnType} ${functionName}(${args}) {\n        // Write your code here${returnStmt}\n    }\n}`;
  }

  // cpp
  const returnType = pySig?.returnPyType ? pyTypeToCpp(pySig.returnPyType, { forReturn: true }) : 'int';
  const args = paramsWithTypes
    .map((p, i) => {
      const t = p.pyType ? pyTypeToCpp(p.pyType) : 'int';
      const name = p.name || `arg${i}`;
      // Match judge driver which passes vectors by value
      if (t.startsWith('vector<')) return `${t} ${name}`;
      if (t === 'string') return `string ${name}`;
      return `${t} ${name}`;
    })
    .join(', ');

  const returnStmt =
    returnType.startsWith('vector<')
      ? '\n        return {};'
      : returnType === 'bool'
        ? '\n        return false;'
        : returnType === 'string'
          ? '\n        return "";'
          : '\n        return 0;';

  return `#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    ${returnType} ${functionName}(${args}) {\n        // Write your code here${returnStmt}\n    }\n};`;
}

function getStarterCode(problem: Problem, language: Language, slug: string): string {
  const sc = (problem?.starterCode ?? {}) as Partial<Record<Language, unknown>>;
  const raw = sc[language];
  if (typeof raw === 'string' && raw.trim().length > 0) return raw;
  return buildFallbackStarter(problem, language, slug);
}

export default function SolvePage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [problem, setProblem] = useState<Problem | null>(null);
  const [language, setLanguage] = useState<Language>("python");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadProblem() {
      try {
        const r = await fetch(`${API_BASE_URL}/dsa/problems/${slug}`);
        if (!r.ok) throw new Error(`Problem API error: ${r.status}`);
        const j = await r.json();
        if (!cancelled) {
          setProblem(j);
        }
      } catch (err) {
        console.error("Error loading problem:", err);
      }
    }

    loadProblem();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (!problem) return;
    setCode(sanitizeEditorCode(getStarterCode(problem, language, slug)));
  }, [language, problem]);

  // Compact value formatter — avoids giant pretty-printed arrays
  const formatValue = (v: unknown): string => {
    if (v === null || v === undefined) return 'null';
    if (typeof v !== 'object') return String(v);
    const compact = JSON.stringify(v);
    if (compact.length <= 80) return compact;
    // Large array: show preview
    if (Array.isArray(v) && v.length > 8) {
      const preview = v.slice(0, 6).map((x) => JSON.stringify(x)).join(', ');
      return `[${preview}, ... (${v.length} total)]`;
    }
    return compact;
  };

  if (!problem)
    return (
      <div className="h-screen flex items-center justify-center bg-[#0f172a] text-white">
        Loading...
      </div>
    );

  return (
    <div className="h-screen w-full flex flex-col bg-[#0f172a] text-white overflow-hidden">

      {/* HEADER */}
      <div className="h-14 shrink-0 border-b border-slate-800 px-4 flex items-center justify-between bg-[#020617]">

        <div className="flex items-center gap-3">
          <ArrowLeft onClick={() => router.back()} className="cursor-pointer hover:text-blue-500 transition" />
          <span className="font-medium">{problem.title}</span>
        </div>

        <div className="flex bg-slate-800 rounded overflow-hidden">
          {(Object.keys(LANGS) as Language[]).map(l => (
            <button
              key={l}
              onClick={() => setLanguage(l)}
              className={`px-4 py-1 text-sm transition-colors ${language === l ? "bg-slate-600 text-white" : "text-slate-400 hover:bg-slate-700"
                }`}
            >
              {LANGS[l]}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={async () => {
              if (!problem) return;
              setRunning(true);
              setOutput("Running code...");
              setShowResults(false);
              setTestResults([]);

              try {
                const response = await fetch(`${API_BASE_URL}/judge/run`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    problemSlug: slug,
                    code,
                    language
                  })
                });

                const data = await response.json();

                if (response.ok && data.results) {
                  setTestResults(data.results);
                  setShowResults(true);
                  const passed = data.passed || data.results.filter((r: TestResult) => r.passed).length;
                  const total = data.total || data.results.length;

                  if (passed === total) {
                    setOutput(`✓ All ${total} test case(s) passed!`);
                  } else {
                    const failed = data.results.find((r: TestResult) => !r.passed);
                    const failedTc = failed?.testCase ?? (data.results.findIndex((r: TestResult) => !r.passed) + 1);
                    let errorMsg = `✗ Failed on test case ${failedTc}/${total}\n\n`;

                    if (failed?.error) {
                      errorMsg += `Error: ${failed.error}`;
                      if (failed.lineNumber) {
                        errorMsg += `\n\n➤ Line ${failed.lineNumber} in your code`;
                      }
                    } else {
                      errorMsg += `Wrong Answer\n\nExpected: ${JSON.stringify(failed?.expectedOutput)}\nGot: ${JSON.stringify(failed?.actualOutput)}`;
                    }

                    setOutput(errorMsg);
                  }
                } else {
                  setOutput(`✗ Error: ${data.error || data.message || 'Execution failed'}`);
                }
              } catch (err) {
                setOutput(`✗ Error: ${err instanceof Error ? err.message : 'Network error'}`);
              } finally {
                setRunning(false);
              }
            }}
            disabled={running || submitting}
            className="bg-slate-700 hover:bg-slate-600 px-4 py-1 rounded flex items-center gap-2 disabled:opacity-50 transition-colors"
          >
            <Play size={14} /> Run
          </button>
          <button
            onClick={async () => {
              if (!problem) return;
              setSubmitting(true);
              setOutput("Submitting...");
              setShowResults(false);
              setTestResults([]);

              try {
                const response = await fetch(`${API_BASE_URL}/judge/submit`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    problemSlug: slug,
                    userId: 1,
                    code,
                    language
                  })
                });

                const data = await response.json();

                if (response.ok && data.results) {
                  setTestResults(data.results);
                  setShowResults(true);
                  const passedCount = data.passed || data.results.filter((r: TestResult) => r.passed).length;
                  const totalCount = data.total || data.results.length;
                  const allPassed = passedCount === totalCount;

                  if (allPassed) {
                    const avgTime = data.results.reduce((acc: number, r: TestResult) => acc + (r.executionTime || 0), 0) / data.results.length;
                    setOutput(`✓ Accepted!\n\n${passedCount}/${totalCount} test cases passed\nRuntime: ${avgTime.toFixed(0)}ms\nMemory: ${data.results[0]?.memoryUsed || 'N/A'}`);
                  } else {
                    const failed = data.results.find((r: TestResult) => !r.passed);
                    const failedTc = failed?.testCase ?? (passedCount + 1);
                    let errorMsg = `✗ Test Case ${failedTc}/${totalCount} Failed\n\n`;

                    if (failed?.error) {
                      errorMsg += `Error: ${failed.error}`;
                      if (failed.lineNumber) {
                        errorMsg += `\n\n➤ Line ${failed.lineNumber} in your code`;
                      }
                    } else {
                      errorMsg += `Wrong Answer\n\nExpected: ${JSON.stringify(failed?.expectedOutput)}\nGot: ${JSON.stringify(failed?.actualOutput)}`;
                    }

                    setOutput(errorMsg);
                  }
                } else {
                  setOutput(`✗ Error: ${data.error || data.message || 'Submission failed'}`);
                }
              } catch (err) {
                setOutput(`✗ Error: ${err instanceof Error ? err.message : 'Network error'}`);
              } finally {
                setSubmitting(false);
              }
            }}
            disabled={running || submitting}
            className="bg-green-600 hover:bg-green-700 px-4 py-1 rounded flex items-center gap-2 disabled:opacity-50 transition-colors"
          >
            <Upload size={14} /> Submit
          </button>
        </div>

      </div>

      {/* MAIN LAYOUT */}
      <div className="flex-1 overflow-hidden">
        <Group orientation="horizontal" className="h-full">

          {/* LEFT: Description */}
          <Panel defaultSize={40} minSize={20} className="h-full bg-slate-900/50">
            <div className="h-full overflow-y-auto p-6">
              {/* Problem Description */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white mb-4">Description</h2>
                <div
                  className="problem-content text-slate-300"
                  dangerouslySetInnerHTML={{ __html: problem.description }}
                />
              </div>

              {/* Examples Section */}
              {problem.examples && problem.examples.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Examples</h3>
                  <div className="space-y-4">
                    {problem.examples.map((ex, i) => (
                      <div key={i} className="bg-slate-800/30 border border-slate-700 p-4 rounded-lg">
                        <p className="text-sm font-semibold text-emerald-400 mb-2">Example {i + 1}:</p>
                        <div className="space-y-2">
                          <div className="bg-slate-900/50 p-3 rounded">
                            <span className="text-xs text-slate-500 font-semibold">Input:</span>
                            <pre className="text-sm text-slate-200 mt-1 font-mono">{ex.input}</pre>
                          </div>
                          <div className="bg-slate-900/50 p-3 rounded">
                            <span className="text-xs text-slate-500 font-semibold">Output:</span>
                            <pre className="text-sm text-slate-200 mt-1 font-mono">{ex.output}</pre>
                          </div>
                          {ex.explanation && (
                            <div className="mt-2">
                              <span className="text-xs text-slate-500 font-semibold">Explanation:</span>
                              <div
                                className="text-sm text-slate-300 mt-1 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: ex.explanation }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Constraints Section */}
              {problem.constraints && problem.constraints.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Constraints</h3>
                  <ul className="space-y-2 list-none">
                    {problem.constraints.map((constraint, i) => (
                      <li
                        key={i}
                        className="text-sm text-slate-300 pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-slate-500"
                        dangerouslySetInnerHTML={{ __html: constraint }}
                      />
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Panel>

          <Separator className="w-2 bg-slate-800 hover:bg-blue-600 transition-colors flex items-center justify-center cursor-col-resize group">
            <div className="w-1 h-8 rounded-full bg-slate-600 group-hover:bg-white" />
          </Separator>

          {/* RIGHT: Editor & Console */}
          <Panel defaultSize={60} minSize={30} className="h-full">
            <Group orientation="vertical" className="h-full">
              {/* EDITOR */}
              <Panel defaultSize={70} minSize={20} className="h-full">
                <textarea
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  className="h-full w-full bg-[#020617] p-4 font-mono text-sm resize-none outline-none text-slate-300"
                  spellCheck={false}
                />
              </Panel>

              <Separator className="h-2 bg-slate-800 hover:bg-blue-600 transition-colors flex items-center justify-center cursor-row-resize group">
                <div className="h-1 w-8 rounded-full bg-slate-600 group-hover:bg-white" />
              </Separator>

              {/* CONSOLE */}
              <Panel defaultSize={30} minSize={10} className="h-full">
                <div className="h-full bg-[#0f172a] flex flex-col">
                  <div className="h-8 border-b border-slate-800 flex items-center px-4 text-xs font-semibold text-slate-400 bg-slate-900/50">
                    {showResults ? 'Test Results' : 'Console'}
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    {showResults && testResults.length > 0 ? (
                      <div className="p-4 space-y-3">
                        {testResults.map((result, idx) => {
                          const tcNum = result.testCase ?? (idx + 1);
                          return (
                            <div
                              key={result.testCase ?? idx}
                              className={`border rounded-lg p-3 ${result.passed ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'}`}
                            >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-semibold text-sm">
                                {result.passed ? (
                                  <span className="text-green-400">✓ Test Case {tcNum}</span>
                                ) : (
                                  <span className="text-red-400">✗ Test Case {tcNum}</span>
                                )}
                              </span>
                              {result.executionTime && (
                                <span className="text-xs text-slate-500">{result.executionTime}ms</span>
                              )}
                            </div>

                            {!result.isHidden && (
                              <div className="space-y-2 text-xs">
                                <div>
                                  <div className="text-slate-500">Input:</div>
                                  <pre className="bg-slate-900/50 p-2 rounded mt-1 font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap">
                                    {Array.isArray(result.input)
                                      ? result.input.map((v, i) => `arg${i + 1}: ${formatValue(v)}`).join('\n')
                                      : formatValue(result.input)}
                                  </pre>
                                </div>

                                <div>
                                  <div className="text-slate-500">Expected:</div>
                                  <pre className="bg-slate-900/50 p-2 rounded mt-1 font-mono text-slate-300 overflow-x-auto">
                                    {formatValue(result.expectedOutput)}
                                  </pre>
                                </div>

                                <div>
                                  <div className="text-slate-500">Output:</div>
                                  <pre className={`p-2 rounded mt-1 font-mono overflow-x-auto ${result.passed ? 'bg-green-900/20 text-green-300' : 'bg-red-900/20 text-red-300'}`}>
                                    {result.actualOutput !== null && result.actualOutput !== undefined
                                      ? formatValue(result.actualOutput)
                                      : 'No output'}
                                  </pre>
                                </div>

                                {result.error && (
                                  <div>
                                    <div className="text-red-400">Error:</div>
                                    <pre className="bg-red-900/20 p-2 rounded mt-1 font-mono text-red-300 text-xs whitespace-pre-wrap overflow-x-auto max-h-32 overflow-y-auto">
                                      {result.error.split('\n').slice(0, 6).join('\n')}
                                      {result.lineNumber ? `\n→ Line ${result.lineNumber}` : ''}
                                    </pre>
                                  </div>
                                )}
                              </div>
                            )}

                            {result.isHidden && !result.passed && (
                              <div className="text-xs text-slate-500">Hidden test case failed</div>
                            )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-4 font-mono text-sm whitespace-pre-wrap">
                        {output ? (
                          <div className={output.startsWith('✓') ? 'text-green-400' : output.startsWith('✗') ? 'text-red-400' : 'text-slate-300'}>
                            {output}
                          </div>
                        ) : (
                          <span className="text-slate-600">Output will appear here</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Panel>

            </Group>
          </Panel>

        </Group>
      </div>
    </div>
  );
}