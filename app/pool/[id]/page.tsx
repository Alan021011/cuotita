"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProgressBar } from "@/components/ProgressBar";
import { PoolActions } from "@/components/PoolActions";
import { PoolShareGrid } from "@/components/PoolShareGrid";
import { ContributionList } from "@/components/ContributionList";
import { BottomNav } from "@/components/BottomNav";
import { AppHeader, AppShell } from "@/components/AppHeader";
import { Icon } from "@/components/ui/Icon";
import { Spinner } from "@/components/ui/Spinner";
import { middleTruncate } from "@/lib/format";
import type { PoolWithTotal } from "@/lib/pools";

export default function PoolPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [pool, setPool] = useState<PoolWithTotal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingClaims, setPendingClaims] = useState(0);

  useEffect(() => {
    fetch(`/api/pools/${id}`)
      .then((res) => {
        if (!res.ok) {
          if (res.status === 404) notFound();
          throw new Error("Failed to fetch pool");
        }
        return res.json();
      })
      .then((data) => {
        setPool(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });

    fetch(`/api/pools/${id}/claims`)
      .then((res) => (res.ok ? res.json() : []))
      .then((claims: { status: string }[]) => setPendingClaims(claims.filter((c) => c.status === "pending").length))
      .catch(() => {});

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/pools/${id}`);
        if (res.ok) {
          const updatedPool = await res.json();
          setPool(updatedPool);
        }
      } catch (err) {
        console.error("Failed to fetch pool updates", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center gap-3 p-10 text-muted">
        <Spinner /> Cargando el fondo…
      </div>
    );
  }

  if (!pool) {
    return <div className="p-10 text-center text-error">Error al cargar el fondo</div>;
  }

  const isClosed = pool.status === "closed";

  const mappedContributions = (pool.contributions || []).map((c) => ({
    id: c.id,
    contributorName: c.contributorName,
    contributorAddress: c.contributorAddress,
    amount: c.amount,
    txHash: c.txHash,
    createdAt: c.createdAt instanceof Date ? c.createdAt.toISOString() : c.createdAt,
  }));

  return (
    <>
      <AppHeader />
      <AppShell className="gap-4">
        <div className="flex items-center justify-between gap-2">
          <Link href="/history" className="inline-flex items-center gap-1.5 py-1 text-xs font-medium text-muted transition-colors hover:text-foreground">
            <Icon name="arrow_back" className="text-sm" />
            Mis fondos
          </Link>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-0.5 text-[11px] text-muted">
            <span className={`h-1.5 w-1.5 rounded-full ${isClosed ? "bg-muted" : "bg-success"}`} />
            {isClosed ? "Cerrado" : "Activo"}
          </span>
        </div>

        {/* Fund hero */}
        <section className="relative overflow-hidden rounded-2xl border border-primary/50 bg-surface p-5 shadow-[0_8px_24px_rgb(0_0_0/0.6)]">
          <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />

          <div className="mb-2 flex items-start justify-between gap-2">
            <h1 className="font-display text-4xl leading-none tracking-wide text-foreground">{pool.name}</h1>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-raised text-primary">
              <Icon name="shield" className="text-xl" />
            </div>
          </div>
          {pool.description && <p className="mb-4 text-sm leading-relaxed text-muted">{pool.description}</p>}

          <div className="mb-4">
            <ProgressBar total={pool.total} goal={pool.goalAmount} percentage={pool.percentage} />
          </div>

          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-border pb-4 font-mono text-[11px] text-muted">
            <span className="flex items-center gap-1.5" title={pool.organizerAddress}>
              <Icon name="verified_user" className="text-sm text-primary" />
              Org: <strong className="text-foreground">{middleTruncate(pool.organizerAddress, 4, 4)}</strong>
            </span>
            {pool.deadline && (
              <span className="flex items-center gap-1.5">
                <Icon name="event" className="text-sm text-primary" />
                Cierre: {new Date(pool.deadline).toLocaleDateString("es-BO")}
              </span>
            )}
          </div>

          {isClosed ? (
            <div className="rounded-xl border border-error-border bg-error-light p-4 text-center text-sm font-medium text-error">
              Este fondo ha sido cerrado. Ya no se aceptan más aportes.
            </div>
          ) : (
            <PoolActions pool={pool} onPoolUpdated={setPool} />
          )}
        </section>

        {/* Claims tiles */}
        <section className="grid grid-cols-2 gap-3">
          <Link
            href={`/pool/${pool.id}/claim/new`}
            className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-error/40 bg-surface p-3.5 transition-colors hover:border-error"
          >
            <div className="pointer-events-none absolute -bottom-4 -right-4 h-16 w-16 rounded-full bg-error/10 blur-xl" />
            <div>
              <div className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg bg-error/15 text-error">
                <Icon name="handyman" className="text-lg" />
              </div>
              <h3 className="text-sm font-bold leading-snug text-foreground">Reportar auxilio</h3>
              <p className="mt-1 text-[11px] leading-normal text-muted">Pide el pago de un daño con una foto.</p>
            </div>
            <span className="mt-3 flex items-center justify-center gap-1 rounded-lg border border-error/50 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-error">
              Solicitar <Icon name="arrow_forward" className="text-xs" />
            </span>
          </Link>

          <Link
            href={`/pool/${pool.id}/claims`}
            className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-primary/40 bg-surface p-3.5 transition-colors hover:border-primary"
          >
            <div className="pointer-events-none absolute -bottom-4 -right-4 h-16 w-16 rounded-full bg-primary/10 blur-xl" />
            <div>
              <div className="mb-2.5 flex items-center justify-between">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Icon name="how_to_vote" className="text-lg" />
                </div>
                {pendingClaims > 0 && (
                  <span className="rounded-full bg-primary px-1.5 py-0.5 font-mono text-[10px] font-bold text-primary-foreground">
                    {pendingClaims} {pendingClaims === 1 ? "pendiente" : "pendientes"}
                  </span>
                )}
              </div>
              <h3 className="text-sm font-bold leading-snug text-foreground">Ver reclamos</h3>
              <p className="mt-1 text-[11px] leading-normal text-muted">Revisa, vota y paga los auxilios.</p>
            </div>
            <span className="mt-3 flex items-center justify-center gap-1 rounded-lg border border-primary/30 bg-surface-raised py-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-primary">
              Abrir <Icon name="chevron_right" className="text-xs" />
            </span>
          </Link>
        </section>

        <PoolShareGrid pool={pool} />

        <ContributionList contributions={mappedContributions} />
      </AppShell>
      <BottomNav />
    </>
  );
}
