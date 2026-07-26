import { Suspense } from "react";
import { VisualizerShell } from "@/components/VisualizerShell";

export default function VisualizePage() {
  return (
    <Suspense>
      <VisualizerShell />
    </Suspense>
  );
}
