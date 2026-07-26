import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-accent-ink hover:bg-accent-hover",
  secondary:
    "bg-transparent text-ink border border-edge-strong hover:bg-surface-2 hover:border-ink-3",
  ghost: "bg-transparent text-ink-2 hover:text-ink hover:bg-surface-2",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  className = "",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`rounded-sm px-[18px] py-[9px] text-[13.5px] font-semibold transition-[background,border-color,color,transform] duration-[120ms] active:scale-[0.96] ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
