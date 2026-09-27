"use client";

import { useEffect, useState } from "react";
import { usePollar } from "@pollar/react";
import type { RampQuote } from "@pollar/core";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";

type Direction = "onramp" | "offramp";

type QuoteState =
  | { step: "idle" }
  | { step: "loading" }
  | { step: "unavailable" }
  | { step: "ready"; quote: RampQuote };

const DEFAULT_AMOUNT = "100";

/**
 * Shows the real exchange rate and fee before sending the user into Pollar's
 * own ramp modal — asked for directly by the 3 real users. Read-only: never
 * moves money itself, it only calls getRampsQuote. "Continuar" always works
 * even if the quote failed, so we never block the ramp that already works.
 */
export function RampQuoteModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { getClient, openRampModal } = usePollar();
  const [direction, setDirection] = useState<Direction>("onramp");
  const [amount, setAmount] = useState(DEFAULT_AMOUNT);
  const [country, setCountry] = useState<string | null>(null);
  const [state, setState] = useState<QuoteState>({ step: "idle" });

  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setDirection("onramp");
      setAmount(DEFAULT_AMOUNT);
      setState({ step: "idle" });
    }
  }

  const amountValid = /^\d+(\.\d{1,2})?$/.test(amount) && Number(amount) > 0;

  useEffect(() => {
    if (!open || !amountValid) return;
    let cancelled = false;
    setState({ step: "loading" });

    async function load() {
      try {
        const client = getClient();
        let bolivia = country;
        if (!bolivia) {
          const { countries } = await client.getRampCountries();
          const found = countries.find((c) => c.currency === "BOB")?.code ?? null;
          if (cancelled) return;
          setCountry(found);
          bolivia = found;
        }
        if (!bolivia) {
          if (!cancelled) setState({ step: "unavailable" });
          return;
        }

        const res = await client.getRampsQuote({
          country: bolivia,
          amount: Number(amount),
          currency: "BOB",
          direction,
        });
        const best = res.quotes.find((q) => q.recommended) ?? res.quotes[0] ?? null;
        if (!cancelled) setState(best ? { step: "ready", quote: best } : { step: "unavailable" });
      } catch {
        if (!cancelled) setState({ step: "unavailable" });
      }
    }

    const timer = setTimeout(() => void load(), 400);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, amount, direction, amountValid]);

  function goToRamp() {
    onClose();
    openRampModal();
  }

  return (
    <Modal open={open} onClose={onClose} title="Agregar fondos">
      <div className="flex flex-col gap-4 py-2">
        <div className="flex gap-2">
          <button
            onClick={() => setDirection("onramp")}
            className={`flex-1 rounded-xl py-2 text-sm font-semibold transition-colors ${
              direction === "onramp"
                ? "bg-primary text-primary-foreground"
                : "border border-border text-muted hover:text-foreground"
            }`}
          >
            Comprar USDC
          </button>
          <button
            onClick={() => setDirection("offramp")}
            className={`flex-1 rounded-xl py-2 text-sm font-semibold transition-colors ${
              direction === "offramp"
                ? "bg-primary text-primary-foreground"
                : "border border-border text-muted hover:text-foreground"
            }`}
          >
            Vender USDC
          </button>
        </div>

        <Input
          label="Monto (Bs)"
          type="number"
          step="1"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        {state.step === "loading" && (
          <p className="text-sm text-muted">Consultando la cotización…</p>
        )}

        {state.step === "unavailable" && (
          <p className="rounded-xl border border-border bg-surface px-4 py-3 text-sm text-muted">
            No pudimos traer la cotización ahora mismo. Puedes seguir igual — el precio final te lo
            muestra Pollar en el siguiente paso.
          </p>
        )}

        {state.step === "ready" && (
          <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-surface">
            <div className="flex items-center justify-between gap-4 px-4 py-3.5">
              <span className="text-sm text-muted">Tasa</span>
              <span className="text-sm font-medium">1 USDC ≈ Bs {state.quote.rate.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between gap-4 px-4 py-3.5">
              <span className="text-sm text-muted">Comisión</span>
              <span className="text-sm font-medium">
                {state.quote.fee.toFixed(2)} {state.quote.feeCurrency}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4 px-4 py-3.5">
              <span className="text-sm text-muted">Proveedor</span>
              <span className="text-sm font-medium">{state.quote.provider}</span>
            </div>
          </div>
        )}

        <p className="text-xs text-muted">
          Este número es una referencia: Pollar te confirma el precio final en el siguiente paso.
        </p>

        <Button onClick={goToRamp} className="w-full py-3">
          Continuar
        </Button>
      </div>
    </Modal>
  );
}
