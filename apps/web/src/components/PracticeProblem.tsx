"use client";

import { getExercise } from "@algolens/exercises";
import { Badge, Button } from "@algolens/ui";
import Editor, { type Monaco, type OnMount } from "@monaco-editor/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { type RunResult, useExerciseRunner } from "@/hooks/useExerciseRunner";
import { trpc } from "@/lib/trpc";

type Lang = "javascript" | "python";

const difficultyVariant = {
  easy: "beginner",
  medium: "intermediate",
  hard: "advanced",
} as const;

function defineTheme(monaco: Monaco) {
  monaco.editor.defineTheme("algolens-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "6B76A3", fontStyle: "italic" },
      { token: "keyword", foreground: "A78BFA" },
      { token: "number", foreground: "22D3EE" },
      { token: "string", foreground: "2FD180" },
    ],
    colors: {
      "editor.background": "#070A1C",
      "editor.foreground": "#EDF0FA",
      "editorLineNumber.foreground": "#33407A",
      "editorLineNumber.activeForeground": "#A6AFD0",
      "editorCursor.foreground": "#FAF92A",
      "editor.selectionBackground": "#232C5C",
    },
  });
}

export function PracticeProblem({ id }: { id: string }) {
  const exercise = getExercise(id);
  const { run: runJs } = useExerciseRunner();
  const utils = trpc.useUtils();

  const { data: allProgress } = trpc.exercises.getAll.useQuery();
  const saveAttempt = trpc.exercises.saveAttempt.useMutation();
  const markSolved = trpc.exercises.markSolved.useMutation({
    onSuccess: () => utils.exercises.getAll.invalidate(),
  });
  const runPythonMutation = trpc.exercises.runPython.useMutation();

  const pythonAvailable = Boolean(exercise?.languages?.python);
  const [language, setLanguage] = useState<Lang>("javascript");
  const [code, setCode] = useState(exercise?.starterCode ?? "");
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);
  const jsRestoredRef = useRef(false);

  const savedCode = exercise ? allProgress?.[exercise.id]?.lastCode : undefined;
  useEffect(() => {
    if (language === "javascript" && !jsRestoredRef.current && savedCode) {
      jsRestoredRef.current = true;
      setCode(savedCode);
    }
  }, [savedCode, language]);

  const status = exercise ? allProgress?.[exercise.id]?.status : undefined;

  const switchLanguage = (next: Lang) => {
    if (!exercise) return;
    setLanguage(next);
    setResult(null);
    setCode(next === "javascript" ? exercise.starterCode : exercise.languages!.python!.starterCode);
  };

  if (!exercise) {
    return (
      <div className="mx-auto max-w-[820px] px-8 py-14 text-ink-2">
        Problem not found.
      </div>
    );
  }

  const handleRun = async () => {
    setRunning(true);

    const outcome =
      language === "javascript"
        ? await runJs(
            code,
            exercise.functionName,
            exercise.testCases,
            exercise.argTransform,
            exercise.resultTransform,
          )
        : await runPythonMutation.mutateAsync({ exerciseId: exercise.id, code });

    setResult(outcome);
    setRunning(false);

    if (outcome.allPassed) {
      markSolved.mutate({ exerciseId: exercise.id, code });
    } else {
      saveAttempt.mutate({ exerciseId: exercise.id, code });
    }
  };

  return (
    <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-8 px-8 py-10 lg:grid-cols-[1fr_1.1fr]">
      <div className="min-w-0">
        <Link
          href="/practice"
          className="text-[12px] font-semibold text-ink-3 hover:text-ink"
        >
          ← All problems
        </Link>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <h1 className="font-display text-[26px] font-bold tracking-tight">
            {exercise.title}
          </h1>
          <Badge variant={difficultyVariant[exercise.difficulty]}>
            {exercise.difficulty}
          </Badge>
          {status === "SOLVED" && <Badge variant="beginner">✓ solved</Badge>}
        </div>

        <div className="prose-invert mt-6 text-[14.5px] leading-relaxed text-ink-2">
          <ReactMarkdown
            components={{
              a: (props) => (
                <a
                  {...props}
                  className="text-accent-text underline underline-offset-2"
                />
              ),
              code: (props) => (
                <code
                  {...props}
                  className="rounded-sm bg-surface-2 px-1.5 py-0.5 font-mono text-[13px] text-ink"
                />
              ),
              pre: (props) => (
                <pre
                  {...props}
                  className="whitespace-pre-wrap break-words rounded-md border border-edge bg-well p-4 font-mono text-[12.5px] leading-relaxed"
                />
              ),
              p: (props) => <p {...props} className="mb-3" />,
            }}
          >
            {exercise.prompt}
          </ReactMarkdown>
        </div>
      </div>

      <div className="flex min-w-0 flex-col gap-3">
        <div className="flex items-center gap-1">
          <button
            onClick={() => switchLanguage("javascript")}
            className={`rounded-sm px-3 py-1.5 text-[12.5px] font-semibold transition-colors duration-[120ms] ${
              language === "javascript"
                ? "bg-accent/10 text-accent-text"
                : "text-ink-3 hover:bg-surface-2 hover:text-ink"
            }`}
          >
            JavaScript
          </button>
          <button
            onClick={() => pythonAvailable && switchLanguage("python")}
            disabled={!pythonAvailable}
            title={pythonAvailable ? undefined : "Not ported to Python yet"}
            className={`rounded-sm px-3 py-1.5 text-[12.5px] font-semibold transition-colors duration-[120ms] ${
              language === "python"
                ? "bg-accent/10 text-accent-text"
                : pythonAvailable
                  ? "text-ink-3 hover:bg-surface-2 hover:text-ink"
                  : "cursor-not-allowed text-ink-3/40"
            }`}
          >
            Python{!pythonAvailable && " (soon)"}
          </button>
        </div>

        <div className="overflow-hidden rounded-md border border-edge bg-surface">
          <Editor
            height="360px"
            language={language}
            value={code}
            onChange={(v) => setCode(v ?? "")}
            theme="algolens-dark"
            onMount={((editor, monaco: Monaco) => {
              defineTheme(monaco);
              monaco.editor.setTheme("algolens-dark");
            }) as OnMount}
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              fontFamily: "var(--font-mono)",
              scrollBeyondLastLine: false,
              padding: { top: 16, bottom: 16 },
            }}
          />
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={handleRun} disabled={running}>
            {running ? "Running…" : "Run tests"}
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setCode(
                language === "javascript"
                  ? exercise.starterCode
                  : (exercise.languages?.python?.starterCode ?? exercise.starterCode),
              );
              setResult(null);
            }}
          >
            Reset
          </Button>
          {language === "python" && (
            <span className="font-mono text-[10.5px] text-ink-3">
              runs in a sandboxed Docker container — no network, 128MB memory cap, 5s limit
            </span>
          )}
        </div>

        {result && (
          <div className="rounded-md border border-edge bg-surface p-4">
            {result.compileError ? (
              <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-[12px] text-viz-swap">
                {result.compileError}
              </pre>
            ) : (
              <div className="flex flex-col gap-2">
                <p
                  className={`text-[13.5px] font-semibold ${
                    result.allPassed ? "text-viz-sorted" : "text-ink"
                  }`}
                >
                  {result.timedOut
                    ? "Time limit exceeded"
                    : result.allPassed
                      ? `All ${result.results.length} tests passed`
                      : `${result.results.filter((r) => r.pass).length} / ${result.results.length} tests passed`}
                </p>
                <ul className="flex flex-col gap-1.5">
                  {result.results.map((r) => {
                    const fnName =
                      language === "javascript"
                        ? exercise.functionName
                        : (exercise.languages?.python?.functionName ?? exercise.functionName);
                    return (
                      <li
                        key={r.index}
                        className="flex items-start gap-2 font-mono text-[11.5px]"
                      >
                        <span className={r.pass ? "text-viz-sorted" : "text-viz-swap"}>
                          {r.pass ? "✓" : "✗"}
                        </span>
                        <span className="text-ink-2">
                          {exercise.testCases[r.index] &&
                            `${fnName}(${exercise.testCases[r.index]!.args
                              .map((a) => JSON.stringify(a))
                              .join(", ")})`}
                          {!r.pass &&
                            (r.error
                              ? ` → error: ${r.error}`
                              : ` → got ${JSON.stringify(r.actual)}, expected ${JSON.stringify(
                                  exercise.testCases[r.index]?.expected,
                                )}`)}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
