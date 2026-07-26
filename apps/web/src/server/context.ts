import { db } from "./db";

/**
 * Auth is stubbed: the client generates a random id, stores it in
 * localStorage, and sends it on every request via this header. Swapping in
 * real Clerk auth later means replacing this one function's body with a
 * Clerk session lookup — routers and procedures never change.
 */
export async function createContext({ req }: { req: Request }) {
  const userId = req.headers.get("x-algolens-user");
  return { db, userId };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
