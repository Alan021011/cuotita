"use client";

import { useState } from "react";
import type { WalletBalanceRecord } from "@pollar/core";
import { usePollar } from "@pollar/react";
import { Button } from "./ui/Button";
import { useBalance } from "../hooks/useBalance";
import { useAuthProof } from "../hooks/useAuthProof";
import { currencyOf, type PaymentAsset } from "../lib/payments";
import { POOL_AUTH_HEADER } from "../lib/server-auth";

function payoutAssetFrom(record: WalletBalanceRecord | null): PaymentAsset | null {
  if (
    record &&
    (record.type === "credit_alphanum4" || record.type === "credit_alphanum12") &&
    record.code === "USDC" &&
    record.issuer
  ) {
    return { type: record.type, code: record.code, issuer: record.issuer };
  }
  return null;
}

interface PayoutButtonProps {
  claimId: string;
  organizerAddress: string;
  recipientAddress: string;
  amount: string;
  onSuccess: (result: { hash: string }) => void;
  onError?: (error: string) => void;
}

type Step = "idle" | "confirming" | "processing" | "error";

export function PayoutButton({
  claimId,
  organizerAddress,
  recipientAddress,
  amount,
  onSuccess,
  onError,
}: PayoutButtonProps) {
  const { isAuthenticated, verified, runTx } = usePollar();
  const { balance, asset, isLoading } = useBalance();
  const getAuthProof = useAuthProof();
  const [step, setStep] = useState<Step>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const payAsset = payoutAssetFrom(asset);
  const currency = payAsset ? currencyOf(payAsset) : "USDC";
  const overBalance = balance !== null && Number(amount) > Number(balance);

  async function pay() {
    if (!payAsset) {
      setErrorMessage("Saldo USDC del fondo aún no cargó. Espera un momento.");
      setStep("error");
      return;
    }
    setStep("processing");
    try {
      const result = await runTx(
        "payment",
        { destination: recipientAddress, amount, asset: payAsset },
        { memo: { type: "text", value: claimId } }
      );

      if (result.status === "error") {
        const msg = result.message ?? result.details ?? "El pago falló.";
        setErrorMessage(msg);
        setStep("error");
        onError?.(msg);
        return;
      }
      if (!result.hash) {
        const msg = "Pago enviado pero sin hash devuelto.";
        setErrorMessage(msg);
        setStep("error");
        onError?.(msg);
        return;
      }

      const proof = await getAuthProof(organizerAddress);
      const res = await fetch(`/api/claims/${claimId}/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json", [POOL_AUTH_HEADER]: proof },
        body: JSON.stringify({ txHash: result.hash }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo registrar el pago");

      onSuccess({ hash: result.hash });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error de conexión.";
      setErrorMessage(msg);
      setStep("error");
      onError?.(msg);
    }
  }

  if (step === "confirming") {
    return (
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface px-4 py-3">
        <span className="text-sm text-foreground text-center">
          ¿Transferir <span className="font-mono font-semibold">{amount} {currency}</span> a la wallet Pollar del beneficiario?
        </span>
        <div className="flex gap-2">
          <Button onClick={() => void pay()} className="flex-1 py-2">Confirmar</Button>
          <Button variant="secondary" onClick={() => setStep("idle")} className="flex-1 py-2">Cancelar</Button>
        </div>
      </div>
    );
  }

  let buttonText = `Transferir ${amount} ${currency}`;
  if (!isAuthenticated) buttonText = "Inicia sesión como organizador";
  else if (isLoading) buttonText = "Cargando saldo del fondo...";
  else if (step === "processing") buttonText = "Procesando...";

  return (
    <div className="flex flex-col gap-2 w-full">
      <Button
        onClick={() => setStep("confirming")}
        disabled={!isAuthenticated || !verified || isLoading || !payAsset || overBalance || step === "processing"}
        loading={step === "processing"}
        className="w-full"
      >
        {buttonText}
      </Button>
      {overBalance && (
        <p className="text-sm text-error text-center">
          Saldo insuficiente en la wallet del fondo ({Number(balance).toFixed(2)} {currency} disponibles)
        </p>
      )}
      {step === "error" && (
        <p className="rounded-xl border border-error-border bg-error-light px-3 py-2 text-sm text-error">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
