"use client";

import { useState, useEffect } from "react";
import { formatPoolAmount, middleTruncate } from "@/lib/format";
import { STELLAR_EXPERT_URL } from "@/lib/stellar";
import { Icon } from "./ui/Icon";

interface Contribution {
  id: string;
  contributorName: string | null;
  contributorAddress?: string | null;
  amount: string;
  txHash: string;
  createdAt: string;
}

interface ContributionListProps {
  contributions: Contribution[];
  currency?: string;
}

export function ContributionList({ contributions, currency = "USDC" }: ContributionListProps) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const start = () => {
      setNow(Date.now());
      timeout = setInterval(() => setNow(Date.now()), 60000);
    };
    const initialTimeout = setTimeout(start, 0);
    return () => {
      clearTimeout(initialTimeout);
      clearInterval(timeout);
    };
  }, []);

  return (
    <section className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex items-center justify-between border-b border-border pb-2">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold uppercase tracking-wide text-foreground">Aportes recientes</h2>
          <span className="rounded-full border border-border bg-surface-raised px-2 font-mono text-[11px] text-primary">
            {contributions.length}
          </span>
        </div>
        <span className="font-mono text-[11px] text-muted">Red Stellar</span>
      </div>

      {contributions.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border px-4 py-8 text-center">
          <Icon name="savings" className="text-3xl text-muted" />
          <p className="text-sm font-semibold text-foreground">Aún no hay aportes.</p>
          <p className="text-xs text-muted">¡Sé el primero en poner tu cuota!</p>
        </div>
      ) : (
        <ul className="divide-y divide-border/60">
          {contributions.map((c, i) => {
            const explorerUrl = `${STELLAR_EXPERT_URL}/tx/${c.txHash}`;
            const isAnonymous = !c.contributorName && !c.contributorAddress;

            let displayName = "Anónimo";
            if (c.contributorName) displayName = c.contributorName;
            else if (c.contributorAddress) displayName = middleTruncate(c.contributorAddress, 4, 4);

            const date = new Date(c.createdAt);
            let relativeTime = "";
            if (now !== null) {
              const diffInSeconds = Math.floor((now - date.getTime()) / 1000);
              if (diffInSeconds < 60) relativeTime = "hace un momento";
              else if (diffInSeconds < 3600) relativeTime = `hace ${Math.floor(diffInSeconds / 60)} min`;
              else if (diffInSeconds < 86400) relativeTime = `hace ${Math.floor(diffInSeconds / 3600)} h`;
              else relativeTime = date.toLocaleDateString("es-BO");
            }

            return (
              <li key={c.id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="flex min-w-0 items-center gap-2.5">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-mono text-xs font-bold ${
                      i % 2 === 0
                        ? "border-primary/40 bg-primary/20 text-primary"
                        : "border-muted/30 bg-border text-foreground"
                    }`}
                  >
                    {isAnonymous ? <Icon name="person" className="text-base" /> : displayName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-foreground">{displayName}</p>
                    <p className="mt-0.5 font-mono text-[10px] text-muted">{relativeTime}</p>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-mono text-xs font-semibold text-success">
                    +{formatPoolAmount(c.amount)} {currency}
                  </p>
                  <a
                    href={explorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Ver transacción en Stellar Expert"
                    className="inline-flex items-center gap-1 font-mono text-[10px] text-muted transition-colors hover:text-primary"
                  >
                    {middleTruncate(c.txHash, 4, 4)}
                    <Icon name="open_in_new" className="text-[12px]" />
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
