"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { SendXlmModal } from "@/components/SendXlmModal";
import { usePollarAuth } from "@/hooks/usePollarAuth";
import { useRampRate } from "@/hooks/useRampRate";
import { middleTruncate } from "@/lib/format";

export function AccountModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { user, logout } = usePollarAuth();
  const [copied, setCopied] = useState(false);
  const [sendXlmOpen, setSendXlmOpen] = useState(false);
  const rate = useRampRate(!!user);
  const router = useRouter();

  if (!user) return null;

  async function copyAddress() {
    if (!user) return;
    await navigator.clipboard.writeText(user.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Modal open={open} onClose={onClose} title="Cuenta">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-surface">
          <div className="flex items-center justify-between gap-4 px-4 py-3.5">
            <span className="text-sm text-muted">Email</span>
            <span className="min-w-0 truncate text-sm font-medium">
              {user.profile?.mail ?? "—"}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 px-4 py-3.5">
            <span className="text-sm text-muted">Wallet</span>
            <button
              onClick={() => void copyAddress()}
              title={user.address}
              className="font-mono text-sm font-medium text-primary transition-colors hover:text-primary-hover"
            >
              {copied ? "Copiada ✓" : middleTruncate(user.address, 6, 6)}
            </button>
          </div>
        </div>

        {rate.step === "ready" && (rate.buy || rate.sell) && (
          <p className="text-center text-xs text-muted">
            Hoy: 1 USDC ≈{" "}
            {rate.buy && <>Bs {rate.buy.rate.toFixed(2)} (compra)</>}
            {rate.buy && rate.sell && " · "}
            {rate.sell && <>Bs {rate.sell.rate.toFixed(2)} (venta)</>}
          </p>
        )}

        <button
          onClick={() => setSendXlmOpen(true)}
          className="w-full rounded-xl border border-primary/30 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary-light"
        >
          Enviar XLM
        </button>

        <button
          onClick={() => {
            logout();
            onClose();
            router.push("/");
          }}
          className="w-full rounded-xl border border-error-border py-2.5 text-sm font-semibold text-error transition-colors hover:bg-error-light"
        >
          Cerrar sesión
        </button>
      </div>

      <SendXlmModal open={sendXlmOpen} onClose={() => setSendXlmOpen(false)} />
    </Modal>
  );
}
