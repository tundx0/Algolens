import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  Instrument_Sans,
  JetBrains_Mono,
} from "next/font/google";
import type { ReactNode } from "react";
import { TrpcProvider } from "@/components/TrpcProvider";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
});
const sans = Instrument_Sans({ subsets: ["latin"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "AlgoLens — see algorithms think",
  description:
    "Interactive data structures & algorithms visualizations. Watch every compare, swap, and settle.",
};

const themeInit = `(function(){try{if(localStorage.getItem("algolens-theme")==="light")document.documentElement.classList.add("light")}catch(e){}})()`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <TrpcProvider>{children}</TrpcProvider>
      </body>
    </html>
  );
}
