"use client";

import { useState } from "react";
import { PoolQRCode } from "./PoolQRCode";
import { ShareButton } from "./ShareButton";
import { Icon } from "./ui/Icon";
import type { PoolWithTotal } from "@/lib/pools";

interface PoolShareGridProps {
  pool: PoolWithTotal;
}

/** "Invita a tu parada": one QR (share link or direct-contribute link) + share button. */
export function PoolShareGrid({ pool }: PoolShareGridProps) {
  const isClosed = pool.status === "closed";
  const [mode, setMode] = useState<"share" | "contribute">("share");
  const activeMode = isClosed ? "share" : mode;

  return (
    <section className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-primary/30 bg-surface-raised text-primary">
          <Icon name="qr_code_2" className="text-2xl" />
        </div>
        <div>
          <h2 className="text-base font-bold leading-tight text-foreground">Invita a tu parada</h2>
          <p className="mt-1 text-xs leading-snug text-muted">
            {activeMode === "share"
              ? "Que tus compañeros escaneen el QR para ver el fondo y sumarse."
              : "Escaneando este QR van directo a aportar su cuota con Pollar."}
          </p>
        </div>
      </div>

      {!isClosed && (
        <div className="mb-4 grid grid-cols-2 gap-1 rounded-xl border border-border bg-background p-1 text-xs font-semibold">
          {(
            [
              ["share", "Ver el fondo"],
              ["contribute", "Aportar directo"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              onClick={() => setMode(value)}
              className={`rounded-lg py-2 transition-colors ${
                activeMode === value ? "bg-surface-raised text-primary" : "text-muted hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      <PoolQRCode mode={activeMode} poolId={pool.id} />

      <div className="mt-4">
        <ShareButton title={`Fondo: ${pool.name}`} path={`/pool/${pool.id}`} />
      </div>
    </section>
  );
}
