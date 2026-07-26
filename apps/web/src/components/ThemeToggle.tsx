"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [light, setLight] = useState(false);

  useEffect(() => {
    setLight(document.documentElement.classList.contains("light"));
  }, []);

  const toggle = () => {
    const next = !light;
    setLight(next);
    document.documentElement.classList.toggle("light", next);
    try {
      localStorage.setItem("algolens-theme", next ? "light" : "dark");
    } catch {
      /* private mode */
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label={light ? "Switch to dark mode" : "Switch to light mode"}
      className="grid h-8 w-8 place-items-center rounded-sm border border-edge-strong text-ink-2 transition-colors duration-[120ms] hover:bg-surface-2 hover:text-ink"
    >
      {light ? (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
          <path d="M12 8.5A5.5 5.5 0 0 1 5.5 2 5.5 5.5 0 1 0 12 8.5z" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
          <circle cx="7" cy="7" r="3" />
          <path d="M7 0v2M7 12v2M0 7h2M12 7h2M2.05 2.05l1.4 1.4M10.55 10.55l1.4 1.4M2.05 11.95l1.4-1.4M10.55 3.45l1.4-1.4" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      )}
    </button>
  );
}
