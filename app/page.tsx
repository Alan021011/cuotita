"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BalanceCard } from "@/components/BalanceCard";
import { BottomNav } from "@/components/BottomNav";
import { AppHeader, AppShell } from "@/components/AppHeader";
import { PoolCard } from "@/components/PoolCard";
import { Landing } from "@/components/Landing";
import { Icon } from "@/components/ui/Icon";
import { usePollarAuth } from "@/hooks/usePollarAuth";
import type { PoolWithTotal } from "@/lib/pools";

/** Home for a logged-in rider: wallet, create-a-fund CTA, and their funds. */
function Dashboard({ address }: { address: string }) {
  const [pools, setPools] = useState<PoolWithTotal[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/user/pools?address=${address}`)
      .then((res) => res.json())
      .then((data: { organized?: PoolWithTotal[]; contributed?: PoolWithTotal[] }) => {
        if (cancelled) return;
        // One list, organized first, no duplicates; open funds before closed ones.
        const seen = new Set<string>();
        const all = [...(data.organized ?? []), ...(data.contributed ?? [])].filter((p) => {
          if (seen.has(p.id)) return false;
          seen.add(p.id);
          return true;
        });
        all.sort((a, b) => Number(a.status === "closed") - Number(b.status === "closed"));
        setPools(all);
      })
      .catch(() => !cancelled && setPools([]));
    return () => {
      cancelled = true;
    };
  }, [address]);

  const open = pools?.filter((p) => p.status !== "closed").length ?? 0;

  return (
    <>
      <AppHeader />
      <AppShell>
        <BalanceCard />

        <div className="road-dash -my-1 w-full" />

        <section className="group rounded-2xl border border-border bg-surface p-4 transition-colors hover:border-primary/40">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-surface-raised text-primary">
                <Icon name="group_add" className="text-2xl" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">Crear un fondo</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted">Arma el fondo de auxilio de tu parada en un minuto.</p>
              </div>
            </div>
            <Link
              href="/pool/new"
              className="flex h-10 shrink-0 items-center rounded-xl bg-primary px-4 text-xs font-bold uppercase tracking-wider text-primary-foreground transition-all hover:bg-primary-hover active:scale-95"
            >
              Comenzar
            </Link>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold tracking-tight text-foreground">Tus fondos</h2>
              {pools && pools.length > 0 && (
                <span className="rounded-full border border-border bg-surface-raised px-2 py-0.5 font-mono text-xs text-primary">
                  {open} {open === 1 ? "activo" : "activos"}
                </span>
              )}
            </div>
            {pools && pools.length > 3 && (
              <Link href="/history" className="flex items-center text-xs font-medium text-muted transition-colors hover:text-primary">
                Ver todos
                <Icon name="chevron_right" className="text-base" />
              </Link>
            )}
          </div>

          {pools === null ? (
            <>
              <div className="h-28 animate-pulse rounded-2xl bg-surface" />
              <div className="h-28 animate-pulse rounded-2xl bg-surface" />
            </>
          ) : pools.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border px-4 py-8 text-center">
              <Icon name="two_wheeler" className="text-3xl text-muted" />
              <p className="text-sm font-semibold text-foreground">Todavía no estás en ningún fondo.</p>
              <p className="max-w-xs text-xs text-muted">Crea el de tu parada, o abre el enlace o QR que te pasó tu organizador.</p>
            </div>
          ) : (
            pools.slice(0, 3).map((pool) => <PoolCard key={pool.id} pool={pool} />)
          )}
        </section>

        <section className="flex items-center gap-3 rounded-xl border border-border bg-surface-raised/50 p-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon name="verified_user" className="text-lg" />
          </div>
          <p className="text-[11px] leading-tight text-muted">
            Cada aporte y pago se verifica en la red Stellar. Los reclamos se pagan solo con el voto de los delegados.
          </p>
        </section>
      </AppShell>
      <BottomNav />
    </>
  );
}

export default function Home() {
  const { user, login } = usePollarAuth();
  if (!user) return <Landing login={login} />;
  return <Dashboard address={user.address} />;
}
