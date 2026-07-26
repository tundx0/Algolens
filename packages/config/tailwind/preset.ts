import type { Config } from "tailwindcss";

/**
 * Shared Tailwind preset. All colors resolve through CSS variables defined in
 * apps/web globals.css (dark values on :root, light overrides on :root.light),
 * so components are theme-agnostic. Semantic viz colors are single-source in
 * @algolens/ui tokens and mirrored here as vars.
 */
const preset: Config = {
  content: [],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        well: "var(--bg-well)",
        surface: { DEFAULT: "var(--surface)", 2: "var(--surface-2)" },
        edge: { DEFAULT: "var(--edge)", strong: "var(--edge-strong)" },
        ink: { DEFAULT: "var(--ink)", 2: "var(--ink-2)", 3: "var(--ink-3)" },
        accent: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
          ink: "var(--accent-ink)",
          text: "var(--accent-text)",
        },
        viz: {
          neutral: "var(--viz-neutral)",
          compare: "var(--viz-compare)",
          swap: "var(--viz-swap)",
          sorted: "var(--viz-sorted)",
          visited: "var(--viz-visited)",
          frontier: "var(--viz-frontier)",
          pivot: "var(--viz-pivot)",
          "path-a": "var(--viz-path-a)",
          "path-b": "var(--viz-path-b)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "16px",
        pill: "999px",
      },
    },
  },
};

export default preset;
