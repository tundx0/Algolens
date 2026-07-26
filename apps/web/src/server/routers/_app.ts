import { router } from "../trpc";
import { exercisesRouter } from "./exercises";
import { progressRouter } from "./progress";

export const appRouter = router({
  progress: progressRouter,
  exercises: exercisesRouter,
});

export type AppRouter = typeof appRouter;
