"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BottomNav } from "@/components/BottomNav";
import { AppHeader, AppShell } from "@/components/AppHeader";
import { LoginButton } from "@/components/LoginButton";
import { PoolCard } from "@/components/PoolCard";
import { Icon } from "@/components/ui/Icon";
import { usePollarAuth } from "@/hooks/usePollarAuth";
import type { PoolWithTotal } from "@/lib/pools";

type Tab = "organized" | "contributed";

function EmptyList({ text, cta }: { text: string; cta?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border px-4 py-10 text-center">
      <Icon name="history_toggle_off" className="text-3xl text-muted" />
      <p className="text-sm text-muted">{text}</p>
      {cta && (
        <Link
          href="/pool/new"
          className="mt-2 rounded-xl border border-primary/30 bg-surface-raised px-4 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/15"
        >
          Crear un fondo
        </Link>
      )}
    </div>
  );
}

export default function HistoryPage() {
  const { user, isLoading: authLoading } = usePollarAuth();
  const [organized, setOrganized] = useState<PoolWithTotal[]>([]);
  const [contributed, setContributed] = useState<PoolWithTotal[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("organized");

  useEffect(() => {
    if (!user?.address) {
      if (!authLoading) setTimeout(() => setLoading(false), 0);
      return;
    }

    setTimeout(() => setLoading(true), 0);
    fetch(`/api/user/pools?address=${user.address}`)
      .then(res => res.json())
      .then(data => {
        if (data.organized) setOrganized(data.organized);
        if (data.contributed) setContributed(data.contributed);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [user?.address, authLoading]);

  if (!user && !authLoading) {
    return (
      <>
        <AppHeader />
        <AppShell className="items-center justify-center text-center">
          <Icon name="history" className="text-5xl text-primary" />
          <h1 className="font-display text-5xl leading-none text-foreground">
            Tu historial
            <span className="block text-primary">Inicia sesión</span>
          </h1>
          <p className="max-w-xs text-sm leading-6 text-muted">
            Inicia sesión con Pollar para ver los fondos que organizas y a los que aportaste.
          </p>
          <LoginButton />
        </AppShell>
      </>
    );
  }

  const openCount = [...organized, ...contributed].filter((p, i, all) => p.status !== "closed" && all.findIndex((q) => q.id === p.id) === i).length;
  const list = tab === "organized" ? organized : contributed;

  return (
    <>
      <AppHeader />
      <AppShell>
        <div className="space-y-1.5">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-raised px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-primary">
            Actividad y fondos
          </span>
          <h1 className="pt-1 font-display text-5xl leading-none tracking-wide text-foreground">Tu historial</h1>
          <p className="text-sm text-muted">Los fondos que organizas y en los que participas.</p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Organizas", value: organized.length },
            { label: "Aportaste a", value: contributed.length },
            { label: "Activos", value: openCount },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-surface px-3 py-2.5">
              <p className="font-display text-3xl leading-none text-primary">{loading ? "–" : s.value}</p>
              <p className="mt-1 text-[11px] text-muted">{s.label}</p>
            </div>
          ))}
        </div>

        <div role="tablist" className="grid grid-cols-2 gap-1 rounded-xl border border-border bg-surface p-1 text-sm font-semibold">
          {(
            [
              ["organized", "Mis fondos", organized.length],
              ["contributed", "Mis aportes", contributed.length],
            ] as const
          ).map(([value, label, count]) => (
            <button
              key={value}
              role="tab"
              aria-selected={tab === value}
              onClick={() => setTab(value)}
              className={`rounded-lg py-2.5 transition-colors ${
                tab === value ? "border border-primary/40 bg-surface-raised text-primary" : "text-muted hover:text-foreground"
              }`}
            >
              {label} {!loading && <span className="font-mono text-xs opacity-70">({count})</span>}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col gap-3">
            <div className="h-28 animate-pulse rounded-2xl bg-surface" />
            <div className="h-28 animate-pulse rounded-2xl bg-surface" />
          </div>
        ) : list.length === 0 ? (
          tab === "organized" ? (
            <EmptyList text="Aún no has creado ningún fondo." cta />
          ) : (
            <EmptyList text="Aún no has aportado a ningún fondo." />
          )
        ) : (
          <div className="flex flex-col gap-3">
            {list.map((pool) => (
              <PoolCard key={`${tab}-${pool.id}`} pool={pool} />
            ))}
          </div>
        )}
      </AppShell>
      {user && <BottomNav />}
    </>
  );
}
