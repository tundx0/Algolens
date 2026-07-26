"use client";

import type { CodeLanguage } from "@algolens/viz-engine";
import Editor, { type Monaco, type OnMount } from "@monaco-editor/react";
import { useEffect, useRef, useState } from "react";

const LANGUAGES: { id: CodeLanguage; label: string; monacoId: string }[] = [
  { id: "javascript", label: "JavaScript", monacoId: "javascript" },
  { id: "python", label: "Python", monacoId: "python" },
  { id: "java", label: "Java", monacoId: "java" },
];

function defineTheme(monaco: Monaco) {
  monaco.editor.defineTheme("algolens-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "6B76A3", fontStyle: "italic" },
      { token: "keyword", foreground: "A78BFA" },
      { token: "number", foreground: "22D3EE" },
      { token: "string", foreground: "2FD180" },
      { token: "identifier", foreground: "EDF0FA" },
    ],
    colors: {
      "editor.background": "#070A1C",
      "editor.foreground": "#EDF0FA",
      "editor.lineHighlightBackground": "#00000000",
      "editorLineNumber.foreground": "#33407A",
      "editorLineNumber.activeForeground": "#A6AFD0",
      "editorCursor.foreground": "#FAF92A",
      "editor.selectionBackground": "#232C5C",
      "scrollbarSlider.background": "#232C5C88",
    },
  });
}

export function CodePlayground({
  code,
  codeLine,
}: {
  code: Record<CodeLanguage, string>;
  codeLine?: Partial<Record<CodeLanguage, number>>;
}) {
  const [language, setLanguage] = useState<CodeLanguage>("javascript");
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const decorationsRef = useRef<string[]>([]);
  const activeLine = codeLine?.[language];

  const handleMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    defineTheme(monaco);
    monaco.editor.setTheme("algolens-dark");
  };

  useEffect(() => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    if (!editor || !monaco) return;

    if (activeLine === undefined) {
      decorationsRef.current = editor.deltaDecorations(decorationsRef.current, []);
      return;
    }

    decorationsRef.current = editor.deltaDecorations(decorationsRef.current, [
      {
        range: new monaco.Range(activeLine, 1, activeLine, 1),
        options: {
          isWholeLine: true,
          className: "algolens-active-line",
          glyphMarginClassName: "algolens-active-glyph",
        },
      },
    ]);
    editor.revealLineInCenter(activeLine);
  }, [activeLine, language]);

  return (
    <div className="overflow-hidden rounded-md border border-edge bg-surface">
      <div className="flex items-center gap-1 border-b border-edge px-3 py-2">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.id}
            onClick={() => setLanguage(lang.id)}
            className={`rounded-sm px-3 py-1.5 text-[12.5px] font-semibold transition-colors duration-[120ms] ${
              language === lang.id
                ? "bg-accent/10 text-accent-text"
                : "text-ink-3 hover:bg-surface-2 hover:text-ink"
            }`}
          >
            {lang.label}
          </button>
        ))}
      </div>
      <Editor
        height="320px"
        language={LANGUAGES.find((l) => l.id === language)?.monacoId}
        value={code[language]}
        theme="algolens-dark"
        onMount={handleMount}
        options={{
          readOnly: true,
          domReadOnly: true,
          minimap: { enabled: false },
          fontSize: 13,
          fontFamily: "var(--font-mono)",
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          renderLineHighlight: "none",
          glyphMargin: true,
          padding: { top: 16, bottom: 16 },
        }}
      />
    </div>
  );
}
