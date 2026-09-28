"use client";

import { useId } from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  /** Short helper under the field, e.g. a Bs equivalent. */
  hint?: React.ReactNode;
};

export function Input({ label, error, hint, className = "", id: idProp, ...rest }: InputProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const errorId = `${id}-error`;

  return (
    <div className="flex w-full flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-[11px] font-semibold uppercase tracking-wider text-muted">
          {label}
        </label>
      )}
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`w-full rounded-xl border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-light transition-shadow focus:outline-none focus:ring-1 [color-scheme:dark] ${
          error
            ? "border-error-border focus:ring-error/40"
            : "border-border focus:border-primary focus:ring-primary"
        } ${className}`}
        {...rest}
      />
      {hint && !error && <p className="font-mono text-[11px] text-muted">{hint}</p>}
      {error && (
        <p id={errorId} className="text-sm text-error">
          {error}
        </p>
      )}
    </div>
  );
}
