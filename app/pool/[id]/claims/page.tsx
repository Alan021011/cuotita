"use client";

import { useEffect, useState, useCallback, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Icon } from "@/components/ui/Icon";
import { Spinner } from "@/components/ui/Spinner";
import { BottomNav } from "@/components/BottomNav";
import { AppHeader, AppShell } from "@/components/AppHeader";
import { PayoutButton } from "@/components/PayoutButton";
import { usePollarAuth } from "@/hooks/usePollarAuth";
import { useAuthProof } from "@/hooks/useAuthProof";
import { POOL_AUTH_HEADER } from "@/lib/server-auth";
import { STELLAR_EXPERT_URL } from "@/lib/stellar";
import { CLAIM_QUORUM } from "@/lib/constants";
import { middleTruncate } from "@/lib/format";

type PoolResponse = { id: string; name: string; organizerAddress: string };
type Approval = { delegateAddress: string; decision: "approve" | "reject" };
type ClaimResponse = {
  id: string;
  poolId: string;
  requesterAddress: string;
  requesterName: string | null;
  category: string;
  amountBs: string | null;
  amountUsdc: string;
  photoDataUrl: string;
  quoteDataUrl: string | null;
  description: string | null;
  status: "pending" | "approved" | "rejected" | "paid";
  payoutTxHash: string | null;
  createdAt: string;
  approvals: Approval[];
};
type Delegate = { id: string; address: string; name: string | null };

const CATEGORY_LABEL: Record<string, string> = {
  pantalla: "Pantalla de celular",
  freno: "Freno / embrague",
  retrovisor: "Retrovisor / plásticos",
  llanta: "Llanta / aro",
  otro: "Otro daño",
};

const STATUS_LABEL: Record<string, string> = {
  pending: "Pendiente",
  approved: "Aprobado — falta pagar",
  rejected: "Rechazado",
  paid: "Pagado",
};

const STATUS_STYLE: Record<string, { className: string }> = {
  pending: { className: "border-primary/50 bg-background/80 text-primary" },
  approved: { className: "border-warning-border bg-background/80 text-warning" },
  rejected: { className: "border-error-border bg-background/80 text-error" },
  paid: { className: "border-success-border bg-background/80 text-success" },
};

export default function ClaimsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = usePollarAuth();
  const getAuthProof = useAuthProof();

  const [pool, setPool] = useState<PoolResponse | null>(null);
  const [claims, setClaims] = useState<ClaimResponse[]>([]);
  const [delegates, setDelegates] = useState<Delegate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fullPhoto, setFullPhoto] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busyClaimId, setBusyClaimId] = useState<string | null>(null);

  const [newDelegateAddress, setNewDelegateAddress] = useState("");
  const [newDelegateName, setNewDelegateName] = useState("");
  const [isAddingDelegate, setIsAddingDelegate] = useState(false);

  const load = useCallback(async () => {
    const [poolRes, claimsRes, delegatesRes] = await Promise.all([
      fetch(`/api/pools/${id}`),
      fetch(`/api/pools/${id}/claims`),
      fetch(`/api/pools/${id}/delegates`),
    ]);
    if (!poolRes.ok) {
      if (poolRes.status === 404) notFound();
      return;
    }
    setPool(await poolRes.json());
    setClaims(claimsRes.ok ? await claimsRes.json() : []);
    setDelegates(delegatesRes.ok ? await delegatesRes.json() : []);
    setIsLoading(false);
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const isOrganizer = !!user && !!pool && user.address === pool.organizerAddress;
  const isDelegate = !!user && delegates.some((d) => d.address === user.address);

  async function vote(claimId: string, decision: "approve" | "reject") {
    if (!user) return;
    setBusyClaimId(claimId);
    setActionError(null);
    try {
      const proof = await getAuthProof(user.address);
      const res = await fetch(`/api/claims/${claimId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json", [POOL_AUTH_HEADER]: proof },
        body: JSON.stringify({ decision }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo registrar el voto");
      await load();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setBusyClaimId(null);
    }
  }

  async function addDelegate() {
    if (!user || !newDelegateAddress.trim()) return;
    setIsAddingDelegate(true);
    setActionError(null);
    try {
      const proof = await getAuthProof(user.address);
      const res = await fetch(`/api/pools/${id}/delegates`, {
        method: "POST",
        headers: { "Content-Type": "application/json", [POOL_AUTH_HEADER]: proof },
        body: JSON.stringify({ address: newDelegateAddress.trim(), name: newDelegateName.trim() || null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo agregar al delegado");
      setNewDelegateAddress("");
      setNewDelegateName("");
      await load();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsAddingDelegate(false);
    }
  }

  if (isLoading || !pool) {
    return (
      <div className="flex flex-1 items-center justify-center gap-3 p-10 text-muted">
        <Spinner /> Cargando…
      </div>
    );
  }

  return (
    <>
      <AppHeader backHref={`/pool/${pool.id}`} backLabel={pool.name} />
      <AppShell>
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <h1 className="font-display text-5xl leading-none tracking-wide text-foreground">Reclamos</h1>
            <p className="mt-1 flex items-center gap-1 truncate text-sm text-muted">
              <Icon name="shield" className="text-base text-primary" />
              {pool.name}
            </p>
          </div>
          <Link
            href={`/pool/${pool.id}/claim/new`}
            className="flex shrink-0 items-center gap-1 rounded-xl border border-error/50 px-3 py-2 text-xs font-semibold text-error transition-colors hover:bg-error/10"
          >
            <Icon name="add" className="text-base" />
            Reportar auxilio
          </Link>
        </div>

        {isOrganizer && (
          <Card>
            <div className="mb-1 flex items-center gap-2">
              <Icon name="groups" className="text-xl text-primary" />
              <h2 className="text-sm font-bold text-foreground">Delegados ({delegates.length})</h2>
            </div>
            <p className="mb-3 text-xs text-muted">
              Se necesitan {CLAIM_QUORUM} votos de delegados para aprobar o rechazar un reclamo.
            </p>
            <ul className="mb-4 flex flex-col gap-1.5">
              {delegates.map((d) => (
                <li key={d.id} className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 font-mono text-[10px] font-bold text-primary">
                    {(d.name ?? d.address).charAt(0).toUpperCase()}
                  </span>
                  <span className="min-w-0 truncate text-xs text-foreground">{d.name ?? "Delegado"}</span>
                  <span className="ml-auto shrink-0 font-mono text-[11px] text-muted" title={d.address}>
                    {middleTruncate(d.address, 4, 4)}
                  </span>
                </li>
              ))}
              {delegates.length === 0 && (
                <li className="rounded-lg border border-dashed border-border px-3 py-3 text-center text-xs text-muted">
                  Todavía no hay delegados registrados.
                </li>
              )}
            </ul>
            <div className="flex flex-col gap-2">
              <Input
                placeholder="Dirección G... del delegado"
                value={newDelegateAddress}
                onChange={(e) => setNewDelegateAddress(e.target.value)}
                className="font-mono"
              />
              <Input placeholder="Nombre (opcional)" value={newDelegateName} onChange={(e) => setNewDelegateName(e.target.value)} />
              <Button variant="secondary" onClick={addDelegate} loading={isAddingDelegate} className="w-full">
                <Icon name="person_add" className="text-base" />
                Agregar delegado
              </Button>
            </div>
          </Card>
        )}

        {actionError && (
          <p className="rounded-xl border border-error-border bg-error-light px-3 py-2 text-sm text-error">{actionError}</p>
        )}

        <div className="flex flex-col gap-4">
          {claims.length === 0 && (
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border px-4 py-10 text-center">
              <Icon name="task_alt" className="text-3xl text-muted" />
              <p className="text-sm font-semibold text-foreground">Todavía no hay reclamos en este fondo.</p>
              <p className="text-xs text-muted">Ojalá siga así. Si algo se rompe, repórtalo con una foto.</p>
            </div>
          )}

          {claims.map((claim) => {
            const approveCount = claim.approvals.filter((a) => a.decision === "approve").length;
            const rejectCount = claim.approvals.filter((a) => a.decision === "reject").length;
            const alreadyVoted = !!user && claim.approvals.some((a) => a.delegateAddress === user.address);
            const status = STATUS_STYLE[claim.status];

            return (
              <article key={claim.id} className="overflow-hidden rounded-2xl border border-border bg-surface">
                <button onClick={() => setFullPhoto(claim.photoDataUrl)} className="group relative block w-full" aria-label="Ver foto del daño">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={claim.photoDataUrl} alt={claim.category} className="h-44 w-full object-cover" />
                  <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-background/80 px-2 py-1 text-[10px] text-foreground backdrop-blur">
                    <Icon name="zoom_in" className="text-sm" /> Ampliar
                  </span>
                  <span className={`absolute left-2 top-2 rounded-full border px-2 py-1 text-[11px] font-semibold backdrop-blur ${status.className}`}>
                    {STATUS_LABEL[claim.status]}
                  </span>
                </button>

                <div className="flex flex-col gap-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-bold text-foreground">{CATEGORY_LABEL[claim.category] || claim.category}</h3>
                      <p className="mt-0.5 truncate text-xs text-muted">
                        {claim.requesterName || middleTruncate(claim.requesterAddress, 4, 4)}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-mono text-base font-bold text-primary">{claim.amountUsdc} USDC</p>
                      {claim.amountBs && <p className="font-mono text-[11px] text-muted">Bs {claim.amountBs}</p>}
                    </div>
                  </div>

                  {claim.description && <p className="text-sm text-foreground/90">{claim.description}</p>}

                  {claim.quoteDataUrl && (
                    <button
                      onClick={() => setFullPhoto(claim.quoteDataUrl)}
                      className="flex items-center gap-1.5 self-start text-xs font-medium text-primary hover:text-primary-hover"
                    >
                      <Icon name="receipt_long" className="text-base" /> Ver cotización
                    </button>
                  )}

                  {claim.status === "pending" && (
                    <div>
                      <div className="mb-1.5 flex justify-between font-mono text-[11px] text-muted">
                        <span>
                          <span className="text-success">{approveCount}</span> de {CLAIM_QUORUM} aprobaciones
                        </span>
                        {rejectCount > 0 && <span className="text-error">{rejectCount} rechazo(s)</span>}
                      </div>
                      <div className="flex h-1.5 gap-1">
                        {Array.from({ length: CLAIM_QUORUM }).map((_, i) => (
                          <div key={i} className={`flex-1 rounded-full ${i < approveCount ? "bg-success" : "bg-border"}`} />
                        ))}
                      </div>
                    </div>
                  )}

                  {claim.status === "pending" && isDelegate && !alreadyVoted && (
                    <div className="flex gap-2">
                      <Button variant="success" onClick={() => vote(claim.id, "approve")} loading={busyClaimId === claim.id} className="flex-1">
                        <Icon name="thumb_up" className="text-base" /> Aprobar
                      </Button>
                      <Button variant="danger" onClick={() => vote(claim.id, "reject")} loading={busyClaimId === claim.id} className="flex-1">
                        <Icon name="thumb_down" className="text-base" /> Rechazar
                      </Button>
                    </div>
                  )}
                  {claim.status === "pending" && isDelegate && alreadyVoted && (
                    <p className="flex items-center gap-1.5 text-xs italic text-muted">
                      <Icon name="how_to_vote" className="text-base" /> Ya votaste en este reclamo.
                    </p>
                  )}

                  {claim.status === "approved" && isOrganizer && (
                    <PayoutButton
                      claimId={claim.id}
                      organizerAddress={pool.organizerAddress}
                      recipientAddress={claim.requesterAddress}
                      amount={claim.amountUsdc}
                      onSuccess={() => load()}
                    />
                  )}

                  {claim.status === "paid" && claim.payoutTxHash && (
                    <a
                      href={`${STELLAR_EXPERT_URL}/tx/${claim.payoutTxHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-medium text-success hover:underline"
                    >
                      <Icon name="open_in_new" className="text-sm" /> Ver pago en Stellar Expert
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        <Modal open={!!fullPhoto} onClose={() => setFullPhoto(null)} title="Foto">
          {fullPhoto && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={fullPhoto} alt="Foto adjunta al reclamo" className="w-full rounded-xl" />
          )}
        </Modal>
      </AppShell>
      {user && <BottomNav />}
    </>
  );
}
