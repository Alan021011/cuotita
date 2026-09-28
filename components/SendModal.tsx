"use client";

import { useState } from "react";
import { usePollar } from "@pollar/react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useBalance } from "@/hooks/useBalance";
import { formatAmount, middleTruncate } from "@/lib/format";
import {
  currencyOf,
  looksLikeAddress,
  paymentAssetFrom,
  type PaymentResult,
} from "@/lib/payments";

type Step = "amount" | "details" | "review" | "done";

/**
 * Send-money flow: amount → recipient (+ optional memo) → review → done.
 * Payments run through the same SDK method as PayButton
 * (`runTx('payment', …)`); the memo travels in the tx options.
 */
export function SendModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { runTx } = usePollar();
  const { balance, asset } = useBalance();
  const [step, setStep] = useState<Step>("amount");
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [memo, setMemo] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PaymentResult | null>(null);

  const payAsset = paymentAssetFrom(asset);
  const currency = currencyOf(payAsset);

  // Fresh flow every time the sheet opens (state-adjust-during-render pattern).
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setStep("amount");
      setAmount("");
      setRecipient(process.env.NEXT_PUBLIC_DEMO_RECIPIENT ?? "");
      setMemo("");
      setError(null);
      setResult(null);
    }
  }

  const amountNumber = Number(amount);
  const amountValid =
    /^\d+(\.\d{1,7})?$/.test(amount) &&
    amountNumber > 0 &&
    (balance === null || amountNumber <= Number(balance));
  const overBalance =
    amount !== "" && balance !== null && amountNumber > Number(balance);

  async function confirm() {
    setSending(true);
    setError(null);
    try {
      const res = await runTx(
        "payment",
        { destination: recipient.trim(), amount, asset: payAsset },
        memo ? { memo: { type: "text", value: memo } } : undefined
      );
      if (res.status === "error") {
        setError(
          res.message ??
            res.details ??
            "El pago no se completó. Revisa la dirección y tu saldo, y vuelve a intentar."
        );
      } else {
        setResult(res);
        setStep("done");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "El pago no se completó. Revisa tu conexión y vuelve a intentar."
      );
    } finally {
      setSending(false);
    }
  }

  const titles: Record<Step, string> = {
    amount: "Enviar dinero",
    details: "¿Para quién es?",
    review: "Confirmar pago",
    done: "Pago enviado",
  };
  const backOf: Partial<Record<Step, Step>> = {
    details: "amount",
    review: "details",
  };
  const back = backOf[step];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={titles[step]}
      onBack={back ? () => setStep(back) : undefined}
    >
      {step === "amount" && (
        <div className="flex flex-col items-center gap-6 py-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">
            Monto en {currency}
          </span>
          <input
            autoFocus
            inputMode="decimal"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(",", "."))}
            className="w-full bg-transparent text-center font-mono text-6xl font-semibold tabular-nums tracking-tight outline-none placeholder:text-muted-light"
          />
          <div className="flex flex-col items-center gap-1 text-sm text-muted">
            <span>
              Saldo:{" "}
              <span className="font-mono">
                {formatAmount(balance)} {currency}
              </span>
            </span>
            <span className="text-muted-light">
              Comisión: la cubre la app · Al instante
            </span>
          </div>
          {overBalance && (
            <p className="text-sm text-error">
              Es más de lo que tienes. Tu saldo es{" "}
              {formatAmount(balance)} {currency}.
            </p>
          )}
          <Button
            onClick={() => setStep("details")}
            disabled={!amountValid}
            className="w-full py-3"
          >
            Continuar
          </Button>
        </div>
      )}

      {step === "details" && (
        <div className="flex flex-col gap-4 py-2">
          <Input
            label="Dirección del destinatario"
            placeholder="G…"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            error={
              recipient && !looksLikeAddress(recipient)
                ? "No parece una dirección Pollar. Empieza con G y tiene 56 caracteres."
                : undefined
            }
            className="font-mono"
          />
          <Input
            label="Nota (opcional)"
            placeholder="¿Para qué es?"
            value={memo}
            maxLength={28}
            onChange={(e) => setMemo(e.target.value)}
          />
          <Button
            onClick={() => setStep("review")}
            disabled={!looksLikeAddress(recipient)}
            className="w-full py-3"
          >
            Revisar
          </Button>
        </div>
      )}

      {step === "review" && (
        <div className="flex flex-col gap-5 py-2">
          <div className="flex flex-col items-center gap-1 py-2">
            <span className="text-sm text-muted">Monto</span>
            <span className="font-mono text-4xl font-semibold tabular-nums tracking-tight">
              {amount} {currency}
            </span>
          </div>
          <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-surface">
            <div className="flex items-center justify-between gap-4 px-4 py-3.5">
              <span className="text-sm text-muted">Para</span>
              <span
                className="font-mono text-sm font-medium"
                title={recipient}
              >
                {middleTruncate(recipient.trim(), 6, 6)}
              </span>
            </div>
            {memo && (
              <div className="flex items-center justify-between gap-4 px-4 py-3.5">
                <span className="text-sm text-muted">Nota</span>
                <span className="min-w-0 truncate text-sm font-medium">
                  {memo}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between gap-4 px-4 py-3.5">
              <span className="text-sm text-muted">Comisión</span>
              <span className="text-sm font-medium">La cubre la app</span>
            </div>
          </div>
          {error && (
            <p className="rounded-xl border border-error-border bg-error-light px-4 py-3 text-sm text-error">
              {error}
            </p>
          )}
          <Button
            onClick={() => void confirm()}
            loading={sending}
            className="w-full py-3"
          >
            {sending ? "Enviando…" : "Confirmar"}
          </Button>
        </div>
      )}

      {step === "done" && result && (
        <div className="flex flex-col gap-4">
          <EmptyState
            title="¡Pago enviado!"
            description={`${amount} ${currency} se enviaron a ${middleTruncate(recipient.trim(), 6, 6)}. ${
              result.status === "pending"
                ? "Se confirma en unos segundos."
                : "Ya está confirmado en la red."
            } Tu saldo ya está actualizado.`}
          />
          <Button onClick={onClose} variant="secondary" className="w-full py-3">
            Listo
          </Button>
        </div>
      )}
    </Modal>
  );
}
