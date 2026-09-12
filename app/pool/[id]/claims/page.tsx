"use client";

import { useEffect, useState, useCallback, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { LoginButton } from "@/components/LoginButton";
import { BottomNav } from "@/components/BottomNav";
import { PollarLogo } from "@/components/ui/PollarLogo";
import { PayoutButton } from "@/components/PayoutButton";
import { usePollarAuth } from "@/hooks/usePollarAuth";
import { useAuthProof } from "@/hooks/useAuthProof";
import { POOL_AUTH_HEADER } from "@/lib/server-auth";
import { STELLAR_EXPERT_URL } from "@/lib/stellar";
import { CLAIM_QUORUM } from "@/lib/constants";

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

  if (isLoading || !pool) return <div className="p-10 text-center">Cargando...</div>;

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-4 py-8 pb-24 lg:max-w-lg lg:py-12 lg:pb-28">
      <header className="flex items-center justify-between gap-3 pb-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <PollarLogo size={30} />
          <h1 className="text-xl font-bold tracking-tight truncate">Reclamos</h1>
        </div>
        <LoginButton />
      </header>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">{pool.name}</h2>
        <Link href={`/pool/${pool.id}/claim/new`} className="text-primary hover:text-primary-hover text-sm font-semibold">
          + Reportar auxilio
        </Link>
      </div>

      {isOrganizer && (
        <Card>
          <h3 className="text-sm font-bold mb-1">Delegados ({delegates.length})</h3>
          <p className="text-xs text-muted mb-3">
            Se necesitan {CLAIM_QUORUM} aprobaciones de delegados para pagar un reclamo.
          </p>
          <ul className="flex flex-col gap-1.5 mb-3">
            {delegates.map((d) => (
              <li key={d.id} className="text-xs font-mono text-muted truncate">
                {d.name ? `${d.name} — ` : ""}{d.address.substring(0, 6)}...{d.address.substring(50)}
              </li>
            ))}
            {delegates.length === 0 && <li className="text-xs text-muted">Todavía no hay delegados registrados.</li>}
          </ul>
          <div className="flex flex-col gap-2">
            <Input placeholder="Dirección G... del delegado" value={newDelegateAddress} onChange={(e) => setNewDelegateAddress(e.target.value)} />
            <Input placeholder="Nombre (opcional)" value={newDelegateName} onChange={(e) => setNewDelegateName(e.target.value)} />
            <Button variant="secondary" onClick={addDelegate} loading={isAddingDelegate} className="w-full">
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
          <Card className="text-center text-sm text-muted py-8">Todavía no hay reclamos en este fondo.</Card>
        )}

        {claims.map((claim) => {
          const approveCount = claim.approvals.filter((a) => a.decision === "approve").length;
          const rejectCount = claim.approvals.filter((a) => a.decision === "reject").length;
          const alreadyVoted = !!user && claim.approvals.some((a) => a.delegateAddress === user.address);

          return (
            <Card key={claim.id} className="overflow-hidden">
              <button onClick={() => setFullPhoto(claim.photoDataUrl)} className="block w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={claim.photoDataUrl} alt={claim.category} className="w-full h-40 object-cover rounded-xl mb-3" />
              </button>

              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-bold">{CATEGORY_LABEL[claim.category] || claim.category}</h3>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ${
                    claim.status === "paid"
                      ? "bg-green-100 text-green-700"
                      : claim.status === "approved"
                      ? "bg-primary-light text-primary"
                      : claim.status === "rejected"
                      ? "bg-error-light text-error"
                      : "bg-surface text-muted"
                  }`}
                >
                  {STATUS_LABEL[claim.status]}
                </span>
              </div>

              <p className="text-sm text-muted mb-2">
                {claim.requesterName || `${claim.requesterAddress.substring(0, 6)}...`}
                {claim.amountBs && ` · Bs ${claim.amountBs}`} · {claim.amountUsdc} USDC
              </p>

              {claim.description && <p className="text-sm text-foreground mb-3">{claim.description}</p>}

              {claim.status === "pending" && (
                <p className="text-xs text-muted mb-3">
                  {approveCount} aprobación(es), {rejectCount} rechazo(s) — de {CLAIM_QUORUM} necesarias
                </p>
              )}

              {claim.status === "pending" && isDelegate && !alreadyVoted && (
                <div className="flex gap-2">
                  <Button onClick={() => vote(claim.id, "approve")} loading={busyClaimId === claim.id} className="flex-1">
                    Aprobar
                  </Button>
                  <Button variant="secondary" onClick={() => vote(claim.id, "reject")} loading={busyClaimId === claim.id} className="flex-1">
                    Rechazar
                  </Button>
                </div>
              )}
              {claim.status === "pending" && isDelegate && alreadyVoted && (
                <p className="text-xs text-muted italic">Ya votaste en este reclamo.</p>
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
                  className="text-sm text-primary hover:underline break-all"
                >
                  Ver transacción de pago
                </a>
              )}
            </Card>
          );
        })}
      </div>

      <Modal open={!!fullPhoto} onClose={() => setFullPhoto(null)} title="Foto del daño">
        {fullPhoto && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={fullPhoto} alt="Daño" className="w-full rounded-xl" />
        )}
      </Modal>

      {user && <BottomNav />}
    </main>
  );
}
