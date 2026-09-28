"use client";

import { useEffect, useState } from "react";
import { usePollar } from "@pollar/react";
import { useBalance } from "@/hooks/useBalance";
import { useRampRate } from "@/hooks/useRampRate";
import { formatAmount } from "@/lib/format";
import { Icon } from "@/components/ui/Icon";
import { ReceiveModal } from "@/components/ReceiveModal";
import { SendModal } from "@/components/SendModal";
import { EarnModal } from "@/components/EarnModal";

function Action({
  icon,
  label,
  hint,
  onClick,
  accent = false,
}: {
  icon: string;
  label: string;
  hint: string;
  onClick: () => void;
  accent?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`group flex flex-col items-center justify-center rounded-xl border px-1 py-2.5 transition-all active:scale-95 ${
        accent
          ? "border-primary/60 bg-surface-raised hover:bg-border"
          : "border-border bg-surface hover:bg-surface-raised"
      }`}
    >
      <span
        className={`mb-1.5 flex h-10 w-10 items-center justify-center rounded-full ${
          accent ? "border border-primary/40 bg-primary/15" : "bg-background"
        }`}
      >
        <Icon name={icon} className="text-[20px] text-primary" />
      </span>
      <span className={`text-xs ${accent ? "font-semibold text-primary" : "font-medium text-foreground"}`}>
        {label}
      </span>
      <span className="font-mono text-[10px] text-muted">{hint}</span>
    </button>
  );
}

/** The wallet card: balance in USDC, its Bs value, and the money actions. */
export function BalanceCard() {
  const { balance, currency, isLoading, error, refresh } = useBalance();
  const { isAuthenticated, tx, openRampModal, wallet } = usePollar();
  const rate = useRampRate(isAuthenticated);
  const [receiveOpen, setReceiveOpen] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);
  const [earnOpen, setEarnOpen] = useState(false);

  useEffect(() => {
    if (tx.step === "success" || tx.step === "submitted") {
      void refresh();
    }
  }, [tx.step, refresh]);

  if (!isAuthenticated) return null;

  // What the balance is worth if cashed out today (off-ramp rate).
  const sellRate = rate.step === "ready" ? (rate.sell?.rate ?? rate.buy?.rate ?? null) : null;
  const bsValue = sellRate !== null && balance !== null ? Number(balance) * sellRate : null;

  return (
    <section className="glow-amber relative overflow-hidden rounded-2xl border border-primary/50 bg-gradient-to-b from-surface-raised to-surface p-5">
      <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-primary/10 blur-2xl" />

      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted">Tu saldo disponible</span>
        <button
          onClick={() => void refresh()}
          disabled={isLoading}
          className="flex items-center gap-1 text-xs text-muted transition-colors hover:text-primary disabled:opacity-50"
        >
          <Icon name="sync" className={`text-[15px] ${isLoading ? "animate-spin" : ""}`} />
          Actualizar
        </button>
      </div>

      {error ? (
        <p className="mb-5 mt-1 max-w-[85%] text-sm leading-6 text-foreground/90">{error}</p>
      ) : isLoading && balance === null ? (
        <div className="mb-5 mt-1 h-10 w-40 animate-pulse rounded-xl bg-surface-raised" />
      ) : (
        <div className="mb-5 flex flex-col">
          <div className="flex items-baseline gap-2" title={balance ?? undefined}>
            <span className="font-mono text-4xl font-bold tabular-nums tracking-tight text-foreground">
              {formatAmount(balance)}
            </span>
            <span className="font-display text-2xl text-primary">{currency}</span>
          </div>
          {bsValue !== null && (
            <div className="mt-0.5 flex items-center gap-1.5">
              <span className="font-mono text-xs text-muted">≈ Bs {bsValue.toFixed(2)}</span>
              <span className="rounded border border-success-border bg-success-light px-1.5 py-0.5 text-[11px] font-medium text-success">
                Tasa {sellRate!.toFixed(2)}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-2.5 border-t border-border pt-3">
        <Action icon="arrow_downward" label="Recibir" hint="Tu dirección" onClick={() => setReceiveOpen(true)} />
        <Action icon="arrow_upward" label="Enviar" hint="A otra wallet" onClick={() => setSendOpen(true)} />
        <Action icon="account_balance" label="Cargar con Bs" hint="Desde tu banco" onClick={() => openRampModal()} accent />
        <Action icon="savings" label="Ganar intereses" hint="Blend" onClick={() => setEarnOpen(true)} accent />
      </div>

      <ReceiveModal open={receiveOpen} onClose={() => setReceiveOpen(false)} />
      <SendModal open={sendOpen} onClose={() => setSendOpen(false)} />
      {wallet && <EarnModal open={earnOpen} onClose={() => setEarnOpen(false)} address={wallet.address} />}
    </section>
  );
}
