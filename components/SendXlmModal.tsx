"use client";

import { useState } from "react";
import { usePollar } from "@pollar/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { looksLikeAddress } from "@/lib/payments";

/**
 * Wallet-to-wallet native XLM transfer — separate from SendModal (which
 * sends the app's primary asset, USDC). Built for the specific need of
 * topping up a teammate's account reserve/fee balance directly, without
 * going through an exchange.
 */
export function SendXlmModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { runTx } = usePollar();
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setAmount("");
      setRecipient("");
      setError(null);
      setDone(null);
    }
  }

  const amountValid = /^\d+(\.\d{1,7})?$/.test(amount) && Number(amount) > 0;
  const canSend = amountValid && looksLikeAddress(recipient);

  async function confirm() {
    setSending(true);
    setError(null);
    try {
      const res = await runTx("payment", {
        destination: recipient.trim(),
        amount,
        asset: { type: "native" },
      });
      if (res.status === "error") {
        setError(res.message ?? res.details ?? "El envío falló. Revisá la dirección y tu saldo.");
      } else {
        setDone(res.hash ?? "ok");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error de conexión.");
    } finally {
      setSending(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Enviar XLM">
      {done ? (
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <p className="text-sm text-foreground">
            {amount} XLM enviados a {recipient.slice(0, 6)}...{recipient.slice(-6)}
          </p>
          <Button onClick={onClose} variant="secondary" className="w-full py-3">
            Listo
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4 py-2">
          <p className="text-sm text-muted">
            Mandá XLM directo desde tu wallet a otra — útil para darle a alguien lo justo para cubrir la comisión de red.
          </p>
          <Input
            label="Dirección del destinatario"
            placeholder="G…"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="font-mono"
            error={
              recipient && !looksLikeAddress(recipient)
                ? "No parece una dirección válida (empieza con G, 56 caracteres)."
                : undefined
            }
          />
          <Input
            label="Monto (XLM)"
            type="number"
            step="0.01"
            min="0"
            placeholder="2"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          {error && (
            <p className="rounded-xl border border-error-border bg-error-light px-4 py-3 text-sm text-error">
              {error}
            </p>
          )}
          <Button onClick={() => void confirm()} disabled={!canSend} loading={sending} className="w-full py-3">
            Enviar
          </Button>
        </div>
      )}
    </Modal>
  );
}
