"use client";

import { useState } from "react";
import { usePollar } from "@pollar/react";
import type { EarnOpportunity, EarnPosition, EarnProviderId } from "@pollar/core";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useAuthProof } from "@/hooks/useAuthProof";
import { POOL_AUTH_HEADER } from "@/lib/server-auth";
import { STELLAR_EXPERT_URL } from "@/lib/stellar";
import { formatAmount, middleTruncate } from "@/lib/format";
import type { EarnMovement } from "@/lib/earn";

type Loaded = { opportunity: EarnOpportunity; position: EarnPosition };
type LoadState = { step: "loading" } | { step: "error"; message: string } | { step: "ready"; data: Loaded } | { step: "unavailable" };

async function recordMovement(
  proof: string,
  movement: {
    provider: string;
    opportunityId: string;
    kind: "deposit" | "withdraw";
    amount: string;
    assetCode: string;
    txHash: string;
  }
) {
  // The deposit/withdraw already happened on-chain by the time we call this —
  // this only saves it to the visible history. If it fails (e.g. the RPC
  // hasn't indexed the tx yet), we retry once; a final failure doesn't undo
  // the money movement, it just means the row won't show up until a refresh.
  for (let attempt = 0; attempt < 2; attempt++) {
    const res = await fetch("/api/earn/movements", {
      method: "POST",
      headers: { "Content-Type": "application/json", [POOL_AUTH_HEADER]: proof },
      body: JSON.stringify(movement),
    });
    if (res.ok) return true;
    if (attempt === 0) await new Promise((r) => setTimeout(r, 3000));
  }
  return false;
}

export function EarnModal({
  open,
  onClose,
  address,
}: {
  open: boolean;
  onClose: () => void;
  address: string;
}) {
  const { getEarnProviders, getEarnOpportunities, getEarnPosition, earnDeposit, earnWithdraw } =
    usePollar();
  const getAuthProof = useAuthProof();

  const [state, setState] = useState<LoadState>({ step: "loading" });
  const [history, setHistory] = useState<EarnMovement[]>([]);
  const [mode, setMode] = useState<"deposit" | "withdraw">("deposit");
  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setAmount("");
      setActionError(null);
      setWarning(null);
      void load();
      void loadHistory();
    }
  }

  async function load() {
    setState({ step: "loading" });
    try {
      const providers = await getEarnProviders();
      if (providers.length === 0) {
        setState({ step: "unavailable" });
        return;
      }
      const provider: EarnProviderId = providers.includes("blend" as EarnProviderId)
        ? ("blend" as EarnProviderId)
        : providers[0];
      const opportunities = await getEarnOpportunities(provider);
      const opportunity = opportunities.find((o) => o.asset.code === "USDC") ?? opportunities[0];
      if (!opportunity) {
        setState({ step: "unavailable" });
        return;
      }
      const position = await getEarnPosition({ provider, opportunity: opportunity.id });
      setState({ step: "ready", data: { opportunity, position } });
    } catch (err) {
      setState({
        step: "error",
        message: err instanceof Error ? err.message : "No se pudo cargar Ganar.",
      });
    }
  }

  async function loadHistory() {
    try {
      const proof = await getAuthProof(address);
      const res = await fetch("/api/earn/movements", {
        headers: { [POOL_AUTH_HEADER]: proof },
      });
      if (!res.ok) return;
      const { movements } = await res.json();
      setHistory(movements ?? []);
    } catch {
      // Silent: the history is a nice-to-have, not blocking Earn itself.
    }
  }

  async function submit() {
    if (state.step !== "ready") return;
    const { opportunity } = state.data;
    setBusy(true);
    setActionError(null);
    setWarning(null);
    try {
      const fn = mode === "deposit" ? earnDeposit : earnWithdraw;
      const result = await fn({ provider: opportunity.provider, opportunity: opportunity.id, amount });

      if (result.status === "error") {
        setActionError(result.message ?? result.details ?? "La operación falló.");
        return;
      }
      if (!result.hash) {
        setActionError("La operación se envió pero no devolvió un hash.");
        return;
      }

      const proof = await getAuthProof(address);
      const saved = await recordMovement(proof, {
        provider: opportunity.provider,
        opportunityId: opportunity.id,
        kind: mode,
        amount,
        assetCode: opportunity.asset.code,
        txHash: result.hash,
      });
      if (!saved) {
        setWarning(
          "El movimiento se hizo, pero no se pudo guardar en tu historial todavía. Cierra y vuelve a abrir para reintentar."
        );
      }

      setAmount("");
      await load();
      await loadHistory();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Error de conexión.");
    } finally {
      setBusy(false);
    }
  }

  const amountValid = /^\d+(\.\d{1,7})?$/.test(amount) && Number(amount) > 0;

  return (
    <Modal open={open} onClose={onClose} title="Ganar intereses">
      <div className="flex flex-col gap-5 py-2">
        {state.step === "loading" && <p className="text-sm text-muted">Cargando…</p>}

        {state.step === "unavailable" && (
          <p className="text-sm text-muted">
            Ganar intereses no está disponible todavía en esta red.
          </p>
        )}

        {state.step === "error" && (
          <p className="rounded-xl border border-error-border bg-error-light px-4 py-3 text-sm text-error">
            {state.message}
          </p>
        )}

        {state.step === "ready" && (
          <>
            <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-surface">
              <div className="flex items-center justify-between gap-4 px-4 py-3.5">
                <span className="text-sm text-muted">Depositado</span>
                <span className="text-sm font-medium">
                  {formatAmount(state.data.position.balance)} {state.data.opportunity.asset.code}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 px-4 py-3.5">
                <span className="text-sm text-muted">Rendimiento anual</span>
                <span className="text-sm font-medium text-primary">
                  {(state.data.position.apy * 100).toFixed(2)}%
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setMode("deposit")}
                className={`flex-1 rounded-xl py-2 text-sm font-semibold transition-colors ${
                  mode === "deposit"
                    ? "bg-primary text-primary-foreground"
                    : "border border-border text-muted hover:text-foreground"
                }`}
              >
                Depositar
              </button>
              <button
                onClick={() => setMode("withdraw")}
                className={`flex-1 rounded-xl py-2 text-sm font-semibold transition-colors ${
                  mode === "withdraw"
                    ? "bg-primary text-primary-foreground"
                    : "border border-border text-muted hover:text-foreground"
                }`}
              >
                Retirar
              </button>
            </div>

            <Input
              label={`Monto (${state.data.opportunity.asset.code})`}
              type="number"
              step="0.01"
              min="0"
              placeholder="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            {actionError && (
              <p className="rounded-xl border border-error-border bg-error-light px-4 py-3 text-sm text-error">
                {actionError}
              </p>
            )}
            {warning && (
              <p className="rounded-xl border border-border bg-surface px-4 py-3 text-sm text-muted">
                {warning}
              </p>
            )}

            <Button onClick={() => void submit()} disabled={!amountValid} loading={busy} className="w-full py-3">
              {mode === "deposit" ? "Depositar" : "Retirar"}
            </Button>

            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-foreground">Tu historial</span>
              {history.length === 0 ? (
                <p className="text-sm text-muted">Todavía no tienes movimientos.</p>
              ) : (
                <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-surface">
                  {history.map((m) => (
                    <a
                      key={m.id}
                      href={`${STELLAR_EXPERT_URL}/tx/${m.txHash}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between gap-4 px-4 py-3 text-sm hover:bg-primary-light"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {m.kind === "deposit" ? "Depósito" : "Retiro"}
                        </span>
                        <span className="text-xs text-muted">
                          {new Date(m.createdAt).toLocaleDateString()} · {middleTruncate(m.txHash, 6, 4)}
                        </span>
                      </div>
                      <span className={m.kind === "deposit" ? "text-primary" : "text-foreground"}>
                        {m.kind === "deposit" ? "+" : "-"}
                        {formatAmount(m.amount)} {m.assetCode}
                      </span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
