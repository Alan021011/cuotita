"use client";

import { Spinner } from "./Spinner";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "success";
  loading?: boolean;
};

const variants = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary-hover shadow-[0_4px_12px_rgb(245_158_11/0.3)] font-bold",
  secondary:
    "border border-primary/30 bg-surface-raised text-primary hover:bg-primary/15 hover:border-primary/60 font-semibold",
  ghost: "text-muted hover:text-foreground hover:bg-surface-raised font-medium",
  danger:
    "border border-error/50 text-error hover:bg-error/10 font-semibold",
  success:
    "border border-success/50 bg-success/10 text-success hover:bg-success/20 font-semibold",
} as const;

export function Button({
  variant = "primary",
  loading = false,
  disabled,
  children,
  className = "",
  ...rest
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm transition-all duration-150 enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...rest}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}
