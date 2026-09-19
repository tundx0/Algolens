"use client";

import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { href: "/visualize", label: "Visualize" },
  { href: "/learn", label: "Learn" },
  { href: "/practice", label: "Practice" },
  { href: "/pathways", label: "Pathways" },
];

/**
 * Shared top nav for every page except /visualize, which uses the
 * algorithm-picker sidebar as its primary navigation instead. Keeping this
 * in one place is what makes Home/Learn/Practice cross-link consistently.
 */
export function SiteNav({
  containerClassName = "max-w-[1120px]",
}: {
  containerClassName?: string;
}) {
  const pathname = usePathname();
  const { isSignedIn, isLoaded } = useUser();

  return (
    <nav className={`mx-auto flex items-center justify-between px-6 py-6 sm:px-8 ${containerClassName}`}>
      <Link href="/" className="font-display text-[18px] font-bold tracking-tight">
        Algo<span className="text-accent-text">Lens</span>
      </Link>
      <div className="flex items-center gap-1">
        {links.map((link) => {
          const active = pathname?.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-sm px-3 py-2 text-[13px] font-semibold transition-colors duration-[120ms] ${
                active
                  ? "text-accent-text"
                  : "text-ink-2 hover:bg-surface-2 hover:text-ink"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
        <span className="ml-2 flex items-center gap-2">
          <ThemeToggle />
          {isLoaded &&
            (isSignedIn ? (
              <UserButton />
            ) : (
              <SignInButton mode="modal">
                <button className="text-[13px] font-semibold text-ink-2 transition-colors duration-[120ms] hover:text-ink">
                  Sign in
                </button>
              </SignInButton>
            ))}
        </span>
      </div>
    </nav>
  );
}
