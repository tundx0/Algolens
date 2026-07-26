"use client";

import { Button } from "@algolens/ui";
import { useEffect, useState } from "react";
import type { SearchInput } from "@algolens/algorithms";

function isSearchInput(value: unknown): value is SearchInput {
  return (
    typeof value === "object" &&
    value !== null &&
    "values" in value &&
    "target" in value
  );
}

function isArrayInput(value: unknown): value is number[] {
  return Array.isArray(value) && value.every((v) => typeof v === "number");
}

function isNumberInput(value: unknown): value is number {
  return typeof value === "number";
}

function randomArray(): number[] {
  const n = 8 + Math.floor(Math.random() * 5);
  return Array.from({ length: n }, () => 1 + Math.floor(Math.random() * 99));
}

function parseArray(text: string): number[] | null {
  const values = text
    .split(/[\s,]+/)
    .filter(Boolean)
    .map(Number);
  if (
    values.length >= 2 &&
    values.length <= 64 &&
    values.every((v) => Number.isFinite(v) && v >= 0)
  ) {
    return values;
  }
  return null;
}

/**
 * Renders the right editing controls for whatever shape the active
 * algorithm's input happens to be — a plain array for sorting, or
 * {values, target} for searching. New input shapes get a new branch here;
 * the algorithm files themselves stay untouched.
 */
export function InputControls({
  input,
  onChange,
}: {
  input: unknown;
  onChange: (next: unknown) => void;
}) {
  if (isSearchInput(input)) {
    return <SearchInputControls input={input} onChange={onChange} />;
  }
  if (isArrayInput(input)) {
    return <ArrayInputControls input={input} onChange={onChange} />;
  }
  if (isNumberInput(input)) {
    return <NumberInputControls input={input} onChange={onChange} />;
  }
  return null;
}

function NumberInputControls({
  input,
  onChange,
}: {
  input: number;
  onChange: (next: number) => void;
}) {
  const [draft, setDraft] = useState(String(input));
  useEffect(() => setDraft(String(input)), [input]);

  const apply = () => {
    const n = Number(draft);
    if (Number.isFinite(n) && n >= 0 && n <= 30) onChange(n);
    else setDraft(String(input));
  };

  return (
    <label className="flex items-center gap-3">
      <span className="shrink-0 text-[12px] font-semibold text-ink-3">n</span>
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={apply}
        onKeyDown={(e) => e.key === "Enter" && apply()}
        spellCheck={false}
        className="w-24 rounded-sm border border-edge-strong bg-well px-3 py-2 font-mono text-[13px] text-ink outline-none focus:border-accent-text"
        aria-label="n"
      />
    </label>
  );
}

function ArrayInputControls({
  input,
  onChange,
}: {
  input: number[];
  onChange: (next: number[]) => void;
}) {
  const [draft, setDraft] = useState(input.join(", "));
  useEffect(() => setDraft(input.join(", ")), [input]);

  const apply = () => {
    const parsed = parseArray(draft);
    if (parsed) onChange(parsed);
    else setDraft(input.join(", "));
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <label className="flex flex-1 items-center gap-3">
        <span className="shrink-0 text-[12px] font-semibold text-ink-3">
          Input
        </span>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={apply}
          onKeyDown={(e) => e.key === "Enter" && apply()}
          spellCheck={false}
          className="w-full min-w-40 rounded-sm border border-edge-strong bg-well px-3 py-2 font-mono text-[13px] text-ink outline-none focus:border-accent-text"
          aria-label="Custom input array"
        />
      </label>
      <Button variant="secondary" onClick={() => onChange(randomArray())}>
        Randomize
      </Button>
    </div>
  );
}

function SearchInputControls({
  input,
  onChange,
}: {
  input: SearchInput;
  onChange: (next: SearchInput) => void;
}) {
  const [draft, setDraft] = useState(input.values.join(", "));
  const [targetDraft, setTargetDraft] = useState(String(input.target));
  useEffect(() => {
    setDraft(input.values.join(", "));
    setTargetDraft(String(input.target));
  }, [input]);

  const apply = () => {
    const parsed = parseArray(draft);
    const target = Number(targetDraft);
    if (parsed && Number.isFinite(target)) {
      onChange({ values: parsed, target });
    } else {
      setDraft(input.values.join(", "));
      setTargetDraft(String(input.target));
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <label className="flex flex-1 items-center gap-3">
        <span className="shrink-0 text-[12px] font-semibold text-ink-3">
          Input
        </span>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={apply}
          onKeyDown={(e) => e.key === "Enter" && apply()}
          spellCheck={false}
          className="w-full min-w-40 rounded-sm border border-edge-strong bg-well px-3 py-2 font-mono text-[13px] text-ink outline-none focus:border-accent-text"
          aria-label="Custom input array"
        />
      </label>
      <label className="flex items-center gap-2">
        <span className="shrink-0 text-[12px] font-semibold text-ink-3">
          Target
        </span>
        <input
          value={targetDraft}
          onChange={(e) => setTargetDraft(e.target.value)}
          onBlur={apply}
          onKeyDown={(e) => e.key === "Enter" && apply()}
          spellCheck={false}
          className="w-20 rounded-sm border border-edge-strong bg-well px-3 py-2 font-mono text-[13px] text-ink outline-none focus:border-accent-text"
          aria-label="Search target value"
        />
      </label>
      <Button
        variant="secondary"
        onClick={() => {
          const values = randomArray();
          const target = values[Math.floor(Math.random() * values.length)] as number;
          onChange({ values, target });
        }}
      >
        Randomize
      </Button>
    </div>
  );
}
