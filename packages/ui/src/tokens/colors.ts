/**
 * Single source of truth for color. The Tailwind preset, Framer Motion
 * variants, and the future canvas renderer all read from here — a color is
 * never redefined elsewhere.
 */

export const brand = {
  yellow: "#FAF92A",
  oxford: "#0B1029",
} as const;

/** Semantic algorithm-state colors. Never reused for a different meaning. */
export const viz = {
  neutral: "#33407A",
  compare: "#FFAE1F",
  swap: "#FF5C68",
  sorted: "#2FD180",
  visited: "#4D7FFF",
  frontier: "#22D3EE",
  pivot: "#A78BFA",
  path: ["#FAF92A", "#FFAE1F"],
} as const;

/** Light-theme variants of the semantic set (darkened for light grounds). */
export const vizLight = {
  neutral: "#8B96BC",
  compare: "#DE8900",
  swap: "#E23D49",
  sorted: "#0FA968",
  visited: "#2F5FE0",
  frontier: "#0899B4",
  pivot: "#7C5CE0",
  path: ["#E8E00F", "#DE8900"],
} as const;

export const oxford = {
  50: "#F5F6FB",
  100: "#E7EAF4",
  200: "#C9CFE3",
  300: "#9AA3C4",
  400: "#6B76A3",
  500: "#4A5480",
  600: "#33407A",
  700: "#232C5C",
  800: "#171F47",
  850: "#111737",
  900: "#0B1029",
  950: "#070A1C",
} as const;

export const yellow = {
  100: "#FEFDD8",
  200: "#FDFC9E",
  300: "#FCFA64",
  400: "#FAF92A",
  500: "#E8E00F",
  600: "#C0B60C",
  700: "#877E0B",
  800: "#57510A",
  900: "#2E2B07",
} as const;

export type VizRole = keyof typeof viz;
