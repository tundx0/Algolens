import { getPathway, pathways } from "@algolens/pathways";
import type { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { router, userProcedure } from "../trpc";

const knownIds = new Set(pathways.map((p) => p.id));
const pathwayId = z.string().refine((id) => knownIds.has(id), "Unknown pathway id");

function stepIdValidator(pathway: string, step: string): boolean {
  const definition = getPathway(pathway);
  if (!definition) return false;
  return definition.stages.some((stage) => stage.steps.some((s) => s.id === step));
}

async function ensureUser(db: PrismaClient, userId: string) {
  await db.user.upsert({ where: { id: userId }, create: { id: userId }, update: {} });
}

export const pathwaysRouter = router({
  /** step ids completed per pathway, e.g. { "backend-engineering": ["kv-store", ...] } */
  getAll: userProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db.pathwayProgress.findMany({
      where: { userId: ctx.userId },
    });
    const byPathway: Record<string, string[]> = {};
    for (const row of rows) {
      (byPathway[row.pathwayId] ??= []).push(row.stepId);
    }
    return byPathway;
  }),

  markStepComplete: userProcedure
    .input(
      z
        .object({ pathwayId, stepId: z.string() })
        .refine((v) => stepIdValidator(v.pathwayId, v.stepId), "Unknown step id"),
    )
    .mutation(async ({ ctx, input }) => {
      await ensureUser(ctx.db, ctx.userId);
      await ctx.db.pathwayProgress.upsert({
        where: {
          userId_pathwayId_stepId: {
            userId: ctx.userId,
            pathwayId: input.pathwayId,
            stepId: input.stepId,
          },
        },
        create: { userId: ctx.userId, pathwayId: input.pathwayId, stepId: input.stepId },
        update: {},
      });
    }),

  unmarkStep: userProcedure
    .input(z.object({ pathwayId, stepId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.pathwayProgress.deleteMany({
        where: { userId: ctx.userId, pathwayId: input.pathwayId, stepId: input.stepId },
      });
    }),
});
