import Link from "next/link";
import { formatPoolAmount } from "@/lib/format";
import type { PoolWithTotal } from "@/lib/pools";

/** Compact fund row for the home and history lists. */
export function PoolCard({ pool }: { pool: Pick<PoolWithTotal, "id" | "name" | "description" | "total" | "goalAmount" | "percentage" | "status"> }) {
  const isClosed = pool.status === "closed";
  const isComplete = pool.percentage >= 100;
  const pct = Math.min(100, Math.max(0, pool.percentage));

  return (
    <Link
      href={`/pool/${pool.id}`}
      className={`flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4 transition-colors hover:border-primary/50 ${
        isClosed ? "opacity-75" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="truncate text-base font-bold text-foreground">{pool.name}</h4>
            {!isClosed && <span className="h-2 w-2 shrink-0 rounded-full bg-success" />}
          </div>
          {pool.description && <p className="mt-0.5 truncate text-xs text-muted">{pool.description}</p>}
        </div>
        {isClosed ? (
          <span className="shrink-0 rounded-full border border-border bg-surface-raised px-2 py-0.5 text-[11px] font-medium text-muted">
            Cerrado
          </span>
        ) : (
          <span className="shrink-0 rounded-lg border border-border bg-surface-raised px-2 py-1 font-mono text-xs font-semibold text-primary">
            {Math.floor(pool.percentage)}%
          </span>
        )}
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full border border-border/60 bg-background">
        <div
          className={`h-full rounded-full ${isComplete ? "bg-success" : "bg-primary shadow-[0_0_8px_var(--primary)]"}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex items-center gap-1.5 border-t border-border/40 pt-2 font-mono text-xs">
        <span className="text-muted">Recaudado:</span>
        <span className="font-semibold text-foreground">${formatPoolAmount(pool.total)}</span>
        <span className="text-muted">de ${formatPoolAmount(pool.goalAmount)} USDC</span>
      </div>
    </Link>
  );
}
