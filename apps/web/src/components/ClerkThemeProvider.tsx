"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { useEffect, useState, type ReactNode } from "react";

const DARK_VARS = {
  colorPrimary: "#FAF92A",
  colorPrimaryForeground: "#0B1029",
  colorBackground: "#111737",
  colorForeground: "#EDF0FA",
  colorMutedForeground: "#A6AFD0",
  colorInput: "#171F47",
  colorBorder: "#202A58",
};

const LIGHT_VARS = {
  colorPrimary: "#FAF92A",
  colorPrimaryForeground: "#0B1029",
  colorBackground: "#FFFFFF",
  colorForeground: "#10163A",
  colorMutedForeground: "#4A5480",
  colorInput: "#EDEFF8",
  colorBorder: "#DADEEE",
};

/**
 * The site's light/dark toggle just flips a class on <html> (see
 * ThemeToggle); Clerk's own UI doesn't see that, so without this it stays
 * permanently dark-themed even on the light background. A MutationObserver
 * mirrors the class into Clerk's `appearance.variables`.
 */
export function ClerkThemeProvider({ children }: { children: ReactNode }) {
  const [light, setLight] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    setLight(root.classList.contains("light"));

    const observer = new MutationObserver(() => {
      setLight(root.classList.contains("light"));
    });
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return (
    <ClerkProvider appearance={{ variables: light ? LIGHT_VARS : DARK_VARS }}>
      {children}
    </ClerkProvider>
  );
}
