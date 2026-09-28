"use client";

import { formatPoolAmount } from "@/lib/format";

interface ProgressBarProps {
  total: string;
  goal: string;
  percentage: number;
  currency?: string;
}

/** Fund meter: raised vs goal, with a hazard-striped amber fill. */
export function ProgressBar({
  total,
  goal,
  percentage,
  currency = "USDC",
}: ProgressBarProps) {
  const displayPercentage = Math.min(100, Math.max(0, percentage));
  const isComplete = percentage >= 100;
  const remaining = Math.max(0, Number(goal) - Number(total || 0));

  return (
    <div className="w-full rounded-xl border border-border bg-background p-3.5">
      <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-x-3">
        <div className="flex items-baseline gap-1.5">
          <span className={`font-display text-3xl tracking-wider ${isComplete ? "text-success" : "text-primary"}`}>
            ${formatPoolAmount(total)}
          </span>
          <span className="font-mono text-xs text-muted">recaudado</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-xs text-muted">
            / meta {formatPoolAmount(goal)} {currency}
          </span>
          <span
            className={`rounded px-2 py-0.5 font-mono text-[10px] font-bold ${
              isComplete ? "bg-success/20 text-success" : "bg-primary/20 text-primary"
            }`}
          >
            {Math.floor(percentage)}%
          </span>
        </div>
      </div>

      <div className="h-3 w-full overflow-hidden rounded-full border border-border bg-surface-raised p-0.5">
        <div
          className={`relative h-full rounded-full transition-all duration-1000 ease-out ${
            isComplete ? "bg-success" : "bg-gradient-to-r from-primary-dim to-primary"
          }`}
          style={{ width: `${displayPercentage}%` }}
        >
          <div className="hazard-stripes absolute inset-0 rounded-full" />
        </div>
      </div>

      <div className="mt-2 text-right font-mono text-[11px] text-muted">
        {isComplete ? (
          <span className="font-semibold text-success">¡Meta alcanzada!</span>
        ) : (
          <>
            Faltan: <strong className="font-medium text-primary">{formatPoolAmount(String(remaining))} {currency}</strong>
          </>
        )}
      </div>
    </div>
  );
}
