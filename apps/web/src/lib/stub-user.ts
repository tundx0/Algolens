const KEY = "algolens-user-id";

/**
 * Stub auth: a random id persisted in localStorage, sent as a header on
 * every tRPC request. Replace with the real Clerk user id once auth is
 * wired in — every call site here is the only thing that changes.
 */
export function getStubUserId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(KEY, id);
  }
  return id;
}
