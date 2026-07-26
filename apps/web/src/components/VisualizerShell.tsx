"use client";

import { algorithms, getAlgorithm, type GridInput } from "@algolens/algorithms";
import { exercises } from "@algolens/exercises";
import { Badge, Button } from "@algolens/ui";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePlayer } from "@/hooks/usePlayer";
import { trpc } from "@/lib/trpc";
import { AlgorithmSidebar } from "./AlgorithmSidebar";
import { CodePlayground } from "./CodePlayground";
import { GridCanvas } from "./GridCanvas";
import { InputControls } from "./InputControls";
import { NarrationPanel } from "./NarrationPanel";
import { PlaybackControls } from "./PlaybackControls";
import { Timeline } from "./Timeline";
import { TableStage } from "./TableStage";
import { TreeStage } from "./TreeStage";
import { VisualizationStage } from "./VisualizationStage";

export function VisualizerShell() {
  const searchParams = useSearchParams();
  const requestedId = searchParams.get("algo");
  const [algoId, setAlgoId] = useState(
    (requestedId && getAlgorithm(requestedId) ? requestedId : algorithms[0]?.id) ??
      "bubble-sort",
  );
  const algo = getAlgorithm(algoId);

  const [input, setInput] = useState<unknown>(() => algo?.defaultInput);
  const [codeOpen, setCodeOpen] = useState(false);

  const steps = useMemo(
    () => (algo ? [...algo.generateSteps(input)] : []),
    [algo, input],
  );
  const { player, snap } = usePlayer(steps);

  const utils = trpc.useUtils();
  const progressQuery = trpc.progress.getAll.useQuery();
  const markViewed = trpc.progress.markViewed.useMutation({
    onSuccess: () => utils.progress.getAll.invalidate(),
  });
  const markCompleted = trpc.progress.markCompleted.useMutation({
    onSuccess: () => utils.progress.getAll.invalidate(),
  });

  const selectAlgorithm = useCallback(
    (id: string) => {
      const next = getAlgorithm(id);
      if (!next) return;
      setAlgoId(id);
      setInput(next.defaultInput);
      markViewed.mutate({ algorithmId: id });
    },
    [markViewed],
  );

  useEffect(() => {
    markViewed.mutate({ algorithmId: algoId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keyboard-first controls: space = play/pause, arrows = step/speed.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }
      const speeds = [0.25, 0.5, 1, 2, 4, 8];
      const at = speeds.indexOf(player.getSnapshot().speed);
      switch (e.key) {
        case " ":
          e.preventDefault();
          player.toggle();
          break;
        case "ArrowRight":
          e.preventDefault();
          player.stepForward();
          break;
        case "ArrowLeft":
          e.preventDefault();
          player.stepBack();
          break;
        case "ArrowUp":
          e.preventDefault();
          if (speeds[at + 1] !== undefined) player.setSpeed(speeds[at + 1]!);
          break;
        case "ArrowDown":
          e.preventDefault();
          if (speeds[at - 1] !== undefined) player.setSpeed(speeds[at - 1]!);
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [player]);

  if (!algo || steps.length === 0) return null;

  const state = snap.step.state;
  const completed = snap.step.metadata?.event === "complete";
  const relatedExercise = exercises.find((e) => e.relatedAlgorithmId === algo.id);

  return (
    <div className="grid min-h-dvh grid-cols-[240px_minmax(0,1fr)]">
      <AlgorithmSidebar
        activeId={algoId}
        onSelect={selectAlgorithm}
        progress={progressQuery.data}
      />

      <main className="mx-auto flex w-full max-w-[980px] flex-col gap-4 px-8 py-8">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-1 text-[10.5px] font-semibold uppercase tracking-[0.09em] text-accent-text">
              {algo.category}
            </div>
            <h1 className="font-display text-[30px] font-bold leading-tight tracking-tight">
              {algo.name}
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge>
              best&nbsp;<b className="text-ink">{algo.timeComplexity.best}</b>
            </Badge>
            <Badge>
              avg&nbsp;<b className="text-ink">{algo.timeComplexity.average}</b>
            </Badge>
            <Badge>
              worst&nbsp;<b className="text-ink">{algo.timeComplexity.worst}</b>
            </Badge>
            <Badge>
              space&nbsp;<b className="text-ink">{algo.spaceComplexity}</b>
            </Badge>
            <Badge variant={algo.difficulty}>{algo.difficulty}</Badge>
            {progressQuery.data?.[algoId] === "COMPLETED" ? (
              <Badge variant="beginner">✓ completed</Badge>
            ) : (
              <Button
                variant="secondary"
                onClick={() => markCompleted.mutate({ algorithmId: algoId })}
              >
                Mark complete
              </Button>
            )}
          </div>
        </header>

        {relatedExercise && (
          <Link
            href={`/practice/${relatedExercise.id}`}
            className="-mt-2 flex items-center gap-2 self-start text-[12.5px] font-semibold text-accent-text hover:underline"
          >
            Practice this: {relatedExercise.title} →
          </Link>
        )}

        {state.kind === "array" && (
          <VisualizationStage
            state={state}
            speed={snap.speed}
            completed={completed}
          />
        )}

        {state.kind === "table" && <TableStage state={state} />}

        {state.kind === "tree" && (
          <TreeStage state={state} speed={snap.speed} />
        )}

        {state.kind === "grid" && (
          <>
            <GridCanvas
              state={state}
              editable={input as GridInput}
              onEdit={setInput}
            />
            <p className="text-center font-mono text-[11px] text-ink-3">
              drag to draw or erase walls · drag the yellow/purple markers to
              move start and end
            </p>
          </>
        )}

        <div className="flex flex-col gap-3 rounded-md border border-edge bg-surface px-5 py-4">
          <PlaybackControls
            player={player}
            playing={snap.playing}
            index={snap.index}
            length={snap.length}
            speed={snap.speed}
          />
          <Timeline player={player} steps={steps} index={snap.index} />
        </div>

        <NarrationPanel player={player} steps={steps} index={snap.index} />

        <div className="flex flex-col gap-3">
          <button
            onClick={() => setCodeOpen((open) => !open)}
            className="self-start rounded-sm px-2 py-1 text-[12px] font-semibold text-ink-3 hover:bg-surface-2 hover:text-ink"
          >
            {codeOpen ? "Hide code" : "View code"}
          </button>
          {codeOpen && (
            <CodePlayground
              code={algo.codeImplementations}
              codeLine={snap.step.codeLine}
            />
          )}
        </div>

        <InputControls input={input} onChange={setInput} />
      </main>
    </div>
  );
}
