import { motionSpec } from "./motion";
import type { VisualizationStep } from "./types";

export interface PlayerSnapshot {
  index: number;
  playing: boolean;
  speed: number;
  length: number;
  step: VisualizationStep;
}

type Listener = (snapshot: PlayerSnapshot) => void;

/**
 * A dumb tape player over materialized steps. It has no idea what algorithm
 * it is playing; scrubbing in both directions is an array index.
 */
export class StepPlayer {
  private steps: VisualizationStep[];
  private index = 0;
  private playing = false;
  private speed = 1;
  private timer: ReturnType<typeof setTimeout> | undefined;
  private listeners = new Set<Listener>();
  private snapshot: PlayerSnapshot;

  constructor(
    steps: Iterable<VisualizationStep>,
    private baseStepMs: number = motionSpec.baseStepMs,
  ) {
    this.steps = [...steps];
    if (this.steps.length === 0) {
      throw new Error("StepPlayer requires at least one step");
    }
    this.snapshot = this.buildSnapshot();
  }

  get length(): number {
    return this.steps.length;
  }

  get current(): VisualizationStep {
    // length >= 1 and index is always clamped to a valid position
    return this.steps[this.index] as VisualizationStep;
  }

  getSnapshot = (): PlayerSnapshot => this.snapshot;

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  play(): void {
    if (this.playing) return;
    if (this.index >= this.steps.length - 1) this.index = 0;
    this.playing = true;
    this.emit();
    this.schedule();
  }

  pause(): void {
    if (!this.playing) return;
    this.playing = false;
    this.clearTimer();
    this.emit();
  }

  toggle(): void {
    this.playing ? this.pause() : this.play();
  }

  stepForward(): void {
    this.pause();
    this.seek(this.index + 1);
  }

  stepBack(): void {
    this.pause();
    this.seek(this.index - 1);
  }

  seek(index: number): void {
    const next = Math.max(0, Math.min(this.steps.length - 1, index));
    if (next === this.index) return;
    this.index = next;
    this.emit();
  }

  setSpeed(speed: number): void {
    if (speed <= 0 || speed === this.speed) return;
    this.speed = speed;
    this.emit();
    if (this.playing) {
      this.clearTimer();
      this.schedule();
    }
  }

  dispose(): void {
    this.clearTimer();
    this.listeners.clear();
  }

  private schedule(): void {
    this.timer = setTimeout(() => {
      if (this.index < this.steps.length - 1) {
        this.index += 1;
        this.emit();
        this.schedule();
      } else {
        this.pause();
      }
    }, this.baseStepMs / this.speed);
  }

  private clearTimer(): void {
    if (this.timer !== undefined) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }
  }

  private buildSnapshot(): PlayerSnapshot {
    return {
      index: this.index,
      playing: this.playing,
      speed: this.speed,
      length: this.steps.length,
      step: this.current,
    };
  }

  private emit(): void {
    this.snapshot = this.buildSnapshot();
    for (const listener of this.listeners) listener(this.snapshot);
  }
}
