import Link from "next/link";
import { BalanceCard } from "@/components/BalanceCard";
import { PoolCard } from "@/components/PoolCard";
import { LoginButton } from "@/components/LoginButton";
import { Icon } from "@/components/ui/Icon";
import type { PoolWithTotal } from "@/lib/pools";

/**
 * Desktop/web-mode skin for the home dashboard — only real data and the
 * actions that already exist (BalanceCard, PoolCard), laid out as a wide
 * panel instead of the mobile single-column shell. Scoped to a green
 * "treasury" palette via local CSS custom properties, so it doesn't affect
 * the blue theme used everywhere else (mobile, landing, claims…).
 */
export function WebDashboard({ pools, open }: { pools: PoolWithTotal[] | null; open: number }) {
  return (
    <div
      className="hidden min-h-screen flex-col lg:flex"
      style={
        {
          "--background": "#0a120e",
          "--foreground": "#eaf4ee",
          "--primary": "#16a34a",
          "--primary-hover": "#22c55e",
          "--primary-dim": "#15803d",
          "--primary-light": "color-mix(in srgb, #16a34a 14%, #0a120e)",
          "--primary-foreground": "#ffffff",
          "--surface": "#101d16",
          "--surface-hover": "#15261c",
          "--surface-raised": "#15261c",
          "--border": "#223229",
          "--muted": "#8fa295",
          "--muted-light": "#5f7267",
          backgroundColor: "var(--background)",
          color: "var(--foreground)",
        } as React.CSSProperties
      }
    >
      <header className="border-b border-border px-8 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-surface p-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="" className="h-full w-full object-contain" />
            </span>
            <div className="flex flex-col leading-none">
              <span className="font-display text-lg tracking-wider text-primary">Cuotita</span>
              <span className="mt-1 text-[11px] uppercase tracking-wider text-muted">Panel principal</span>
            </div>
          </div>
          <LoginButton />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-8 py-8">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <BalanceCard />
          </div>

          <section className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5">
            <div className="flex items-center gap-2 text-primary">
              <Icon name="groups" className="text-xl" />
              <h3 className="text-sm font-bold uppercase tracking-wide">Tus fondos</h3>
            </div>
            <p className="text-xs leading-relaxed text-muted">
              {open > 0
                ? `${open} ${open === 1 ? "fondo activo" : "fondos activos"} — ver el detalle abajo.`
                : "Todavía no estás en ningún fondo."}
            </p>
            <Link
              href="/pool/new"
              className="mt-1 flex h-11 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold uppercase tracking-wider text-primary-foreground transition-all hover:bg-primary-hover active:scale-95"
            >
              <Icon name="add" className="text-lg" />
              Crear un fondo
            </Link>
          </section>
        </div>

        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-bold tracking-tight">Fondos colectivos</h2>
          {pools === null ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              <div className="h-32 animate-pulse rounded-2xl bg-surface" />
              <div className="h-32 animate-pulse rounded-2xl bg-surface" />
              <div className="h-32 animate-pulse rounded-2xl bg-surface" />
            </div>
          ) : pools.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border px-4 py-10 text-center">
              <Icon name="account_balance" className="text-3xl text-muted" />
              <p className="text-sm font-semibold">Todavía no estás en ningún fondo.</p>
              <p className="max-w-xs text-xs text-muted">Crea el tuyo, o abre el enlace o QR que te pasó tu organizador.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {pools.map((pool) => (
                <PoolCard key={pool.id} pool={pool} />
              ))}
            </div>
          )}
        </section>

        <section className="flex items-center gap-3 rounded-xl border border-border bg-surface-raised/50 p-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon name="verified_user" className="text-lg" />
          </div>
          <p className="text-[12px] leading-tight text-muted">
            Cada aporte y pago se verifica en la red Stellar. Los reclamos se pagan solo con el voto de los delegados.
          </p>
        </section>
      </main>
    </div>
  );
}
