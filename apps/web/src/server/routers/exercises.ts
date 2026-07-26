import { exercises, getExercise } from "@algolens/exercises";
import type { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { runPython as executePython } from "../sandbox/run-python";
import { router, userProcedure } from "../trpc";

const knownIds = new Set(exercises.map((e) => e.id));
const exerciseId = z.string().refine((id) => knownIds.has(id), "Unknown exercise id");

async function ensureUser(db: PrismaClient, userId: string) {
  await db.user.upsert({ where: { id: userId }, create: { id: userId }, update: {} });
}

export const exercisesRouter = router({
  getAll: userProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db.exerciseProgress.findMany({
      where: { userId: ctx.userId },
    });
    return Object.fromEntries(
      rows.map((r) => [r.exerciseId, { status: r.status, lastCode: r.lastCode }]),
    );
  }),

  saveAttempt: userProcedure
    .input(z.object({ exerciseId, code: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ensureUser(ctx.db, ctx.userId);
      await ctx.db.exerciseProgress.upsert({
        where: { userId_exerciseId: { userId: ctx.userId, exerciseId: input.exerciseId } },
        create: {
          userId: ctx.userId,
          exerciseId: input.exerciseId,
          status: "ATTEMPTED",
          lastCode: input.code,
        },
        update: { lastCode: input.code },
      });
    }),

  markSolved: userProcedure
    .input(z.object({ exerciseId, code: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ensureUser(ctx.db, ctx.userId);
      await ctx.db.exerciseProgress.upsert({
        where: { userId_exerciseId: { userId: ctx.userId, exerciseId: input.exerciseId } },
        create: {
          userId: ctx.userId,
          exerciseId: input.exerciseId,
          status: "SOLVED",
          lastCode: input.code,
        },
        update: { status: "SOLVED", lastCode: input.code },
      });
    }),

  runPython: userProcedure
    .input(z.object({ exerciseId, code: z.string().max(20_000) }))
    .mutation(async ({ input }) => {
      const exercise = getExercise(input.exerciseId);
      const py = exercise?.languages?.python;
      if (!exercise || !py) {
        throw new TRPCError({ code: "NOT_FOUND", message: "No Python version of this problem." });
      }
      return executePython({
        code: input.code,
        functionName: py.functionName,
        testCases: exercise.testCases,
        argTransform: exercise.argTransform,
        resultTransform: exercise.resultTransform,
      });
    }),
});
