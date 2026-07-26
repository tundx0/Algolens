import { algorithms } from "@algolens/algorithms";
import type { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { router, userProcedure } from "../trpc";

const knownIds = new Set(algorithms.map((a) => a.id));
const algorithmId = z.string().refine((id) => knownIds.has(id), "Unknown algorithm id");

async function ensureUser(db: PrismaClient, userId: string) {
  await db.user.upsert({ where: { id: userId }, create: { id: userId }, update: {} });
}

export const progressRouter = router({
  getAll: userProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db.algorithmProgress.findMany({
      where: { userId: ctx.userId },
    });
    return Object.fromEntries(rows.map((r) => [r.algorithmId, r.status]));
  }),

  markViewed: userProcedure
    .input(z.object({ algorithmId }))
    .mutation(async ({ ctx, input }) => {
      await ensureUser(ctx.db, ctx.userId);
      await ctx.db.algorithmProgress.upsert({
        where: { userId_algorithmId: { userId: ctx.userId, algorithmId: input.algorithmId } },
        create: { userId: ctx.userId, algorithmId: input.algorithmId, status: "VIEWED" },
        // never downgrade an already-completed algorithm back to viewed
        update: {},
      });
    }),

  markCompleted: userProcedure
    .input(z.object({ algorithmId }))
    .mutation(async ({ ctx, input }) => {
      await ensureUser(ctx.db, ctx.userId);
      await ctx.db.algorithmProgress.upsert({
        where: { userId_algorithmId: { userId: ctx.userId, algorithmId: input.algorithmId } },
        create: { userId: ctx.userId, algorithmId: input.algorithmId, status: "COMPLETED" },
        update: { status: "COMPLETED" },
      });
    }),
});
