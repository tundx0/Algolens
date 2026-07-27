import { router } from "../trpc";
import { exercisesRouter } from "./exercises";
import { pathwaysRouter } from "./pathways";
import { progressRouter } from "./progress";

export const appRouter = router({
  progress: progressRouter,
  exercises: exercisesRouter,
  pathways: pathwaysRouter,
});

export type AppRouter = typeof appRouter;
