"use client";

import Link from "next/link";
import { LoginButton } from "@/components/LoginButton";
import { BalanceCard } from "@/components/BalanceCard";
import { PollarLogo } from "@/components/ui/PollarLogo";
import { usePollarAuth } from "@/hooks/usePollarAuth";
import { BottomNav } from "@/components/BottomNav";

export default function Home() {
  const { user, login } = usePollarAuth();

  if (!user) {
    return (
      <main className="flex flex-1 flex-col">
        {/* Hero: dark asphalt, same world as the logo and the pitch deck. */}
        <div className="flex flex-col bg-[#15130f]">
          <header className="bg-primary">
            <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#15130f] p-1.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/logo.png" alt="Cuotita" className="h-full w-full object-contain" />
                </div>
                <span className="font-display text-2xl tracking-wide text-[#1a1200]">Cuotita</span>
              </div>
              <button
                onClick={login}
                className="rounded-xl bg-[#15130f] px-5 py-2.5 text-sm font-semibold text-[#f3ede2] shadow-sm transition-colors hover:bg-[#262019]"
              >
                Iniciar sesión
              </button>
            </div>
          </header>

          <div className="mx-auto grid w-full max-w-5xl grid-cols-1 items-center gap-10 px-6 py-16 lg:grid-cols-2 lg:gap-6">
            <div className="flex flex-col items-center gap-5 text-center lg:items-start lg:text-left">
              <h1 className="font-display text-5xl leading-tight text-primary sm:text-6xl">
                Aportamos hoy,
                <span className="block text-[#f3ede2]">reparamos mañana.</span>
              </h1>
              <p className="max-w-sm text-lg leading-8 text-[#aba192]">
                Tu moto también necesita respaldo. Un fondo entre repartidores para cubrir los daños materiales de cada semana — pantalla, freno, llanta — sin trámites.
              </p>

              <div className="flex flex-col items-center gap-3 sm:flex-row">
                <button
                  onClick={login}
                  className="flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-8 text-base font-semibold text-primary-foreground shadow-sm transition-all duration-150 hover:bg-primary-hover active:scale-[0.97]"
                >
                  Comenzar gratis
                </button>
                <button
                  onClick={login}
                  className="flex h-12 items-center justify-center gap-2 rounded-xl border border-[#f3ede2]/25 px-8 text-base font-semibold text-[#f3ede2] transition-colors hover:bg-white/5"
                >
                  Iniciar sesión
                </button>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="Repartidor respaldado por Cuotita"
                className="moto-ride w-full max-w-[22rem] drop-shadow-[0_0_60px_rgba(245,158,11,0.15)]"
              />
              <div className="road-line -mt-1 w-3/4" />
            </div>
          </div>
        </div>

        {/* Cómo funciona: el flujo real, en 4 pasos. */}
        <div className="mx-auto w-full max-w-4xl px-6 py-20">
          <div className="mb-10 text-center">
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">Cómo funciona</p>
            <h2 className="mt-2 text-3xl font-bold text-foreground">De la cuota al reclamo pagado</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { n: "01", title: "Aporte", body: "Contribuís tu cuota semanal a la wallet del fondo." },
              { n: "02", title: "Reporte", body: "Subís una foto del daño, la categoría y el monto." },
              { n: "03", title: "Quórum", body: "Dos delegados del grupo revisan y aprueban." },
              { n: "04", title: "Pago", body: "USDC directo a tu wallet Pollar. Sin papeleo." },
            ].map((s) => (
              <div key={s.n} className="flex flex-col gap-2">
                <span className="font-mono text-sm font-semibold text-primary">{s.n}</span>
                <h3 className="text-base font-bold text-foreground">{s.title}</h3>
                <p className="text-sm text-muted">{s.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Así se ve: mockup del panel de delegados + insignias flotantes. */}
        <div className="bg-surface py-20">
          <div className="mx-auto grid w-full max-w-5xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2">
            <div className="order-2 text-center lg:order-1 lg:text-left">
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">Así se ve</p>
              <h2 className="mt-2 text-3xl font-bold text-foreground">Todo el grupo ve lo mismo</h2>
              <p className="mt-3 max-w-sm text-muted mx-auto lg:mx-0">
                Cada reclamo queda visible para todo el fondo — la foto, el monto, quién votó y cuándo se pagó. Nada se pierde en un chat de WhatsApp.
              </p>
            </div>

            <div className="relative order-1 mx-auto flex w-full max-w-[280px] justify-center py-6 lg:order-2">
              {/* decorative glow behind the phone */}
              <div className="absolute inset-0 -z-10 rounded-full bg-primary/20 blur-3xl" />

              {/* floating badges — each bobs on its own rhythm */}
              <div
                className="float absolute -top-2 -left-8 z-10 rounded-full bg-primary px-3.5 py-2 text-xs font-bold whitespace-nowrap text-primary-foreground shadow-lg"
                style={{ "--float-rot": "-6deg", animationDuration: "4.5s", animationDelay: "0s" } as React.CSSProperties}
              >
                📸 Con foto de evidencia
              </div>
              <div
                className="float absolute top-28 -right-10 z-10 rounded-full bg-[#15130f] px-3.5 py-2 text-xs font-bold whitespace-nowrap text-[#f3ede2] shadow-lg"
                style={{ "--float-rot": "3deg", animationDuration: "5.5s", animationDelay: "0.6s" } as React.CSSProperties}
              >
                ✅ Quórum: 2 delegados
              </div>
              <div
                className="float absolute -bottom-2 -left-6 z-10 rounded-full border border-border bg-background px-3.5 py-2 text-xs font-bold whitespace-nowrap text-foreground shadow-lg"
                style={{ "--float-rot": "2deg", animationDuration: "5s", animationDelay: "1.1s" } as React.CSSProperties}
              >
                ⚡ Verificado on-chain
              </div>
              <div
                className="float absolute top-1/2 -right-4 z-10 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-bold whitespace-nowrap text-foreground shadow-lg"
                style={{ "--float-rot": "-3deg", animationDuration: "4.8s", animationDelay: "1.6s" } as React.CSSProperties}
              >
                🔒 Sin trámites
              </div>

              {/* phone frame */}
              <div
                className="float w-full rounded-[2.25rem] border-[6px] border-[#15130f] bg-[#15130f] p-2 shadow-2xl"
                style={{ animationDuration: "6.5s" } as React.CSSProperties}
              >
                <div className="rounded-[1.75rem] bg-background p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="font-display text-sm tracking-wide text-primary">CUOTITA</span>
                    <span className="text-[10px] text-muted-light">9:41</span>
                  </div>
                  <div className="rounded-2xl border border-border bg-surface p-3">
                    <div className="mb-2 h-20 w-full rounded-xl bg-primary-light" />
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">Pantalla de celular</span>
                      <span className="rounded-full bg-primary-light px-2 py-0.5 text-[10px] font-semibold text-primary">Pendiente</span>
                    </div>
                    <p className="text-[11px] text-muted">Juan P. · Bs 250 · 10.00 USDC</p>
                    <div className="mt-2 flex gap-1.5">
                      <span className="flex-1 rounded-lg bg-primary py-1.5 text-center text-[11px] font-bold text-primary-foreground">Aprobar</span>
                      <span className="flex-1 rounded-lg border border-border py-1.5 text-center text-[11px] font-bold text-foreground">Rechazar</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Por qué Cuotita */}
        <div className="mx-auto w-full max-w-4xl px-6 py-20 text-center">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">Por qué Cuotita</p>
          <h2 className="mt-2 text-3xl font-bold text-foreground">Un respaldo que ya conocés, pero digital</h2>
          <div className="mt-10 grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { title: "Aporte semanal", body: "Una cuota chica al pozo común del grupo." },
              { title: "Reporte con foto", body: "Pantalla, freno, llanta — con evidencia." },
              { title: "Pago inmediato", body: "Aprobado por delegados, directo a tu wallet." },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-border bg-surface p-5 text-left transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
              >
                <h3 className="text-sm font-bold text-foreground">{f.title}</h3>
                <p className="mt-1 text-sm text-muted">{f.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-surface py-20">
          <div className="mx-auto w-full max-w-2xl px-6">
            <p className="text-center font-mono text-xs font-semibold uppercase tracking-widest text-primary">Preguntas rápidas</p>
            <h2 className="mt-2 text-center text-3xl font-bold text-foreground">Bueno saberlo</h2>
            <div className="mt-10 flex flex-col divide-y divide-border">
              {[
                { q: "¿Quién guarda la plata del fondo?", a: "La wallet Pollar de quien organiza el grupo — mismo modelo de confianza que un pasanaku físico hoy, pero con cada aporte y pago verificado on-chain." },
                { q: "¿Necesito saber de cripto?", a: "No. Entrás con tu email o Google — Pollar maneja la wallet por detrás, vos solo ves saldos y botones." },
                { q: "¿Qué pasa si nadie aprueba mi reclamo?", a: "Se necesitan 2 votos del mismo lado (aprobar o rechazar) de los delegados del grupo para resolverlo." },
                { q: "¿Cuánto tarda el pago una vez aprobado?", a: "Es una transacción en Stellar — segundos, directo a tu wallet." },
              ].map((item) => (
                <div key={item.q} className="py-5 text-left">
                  <h3 className="text-sm font-bold text-foreground">{item.q}</h3>
                  <p className="mt-1.5 text-sm text-muted">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cierre */}
        <div className="bg-[#15130f] py-20 text-center">
          <h2 className="font-display text-4xl text-[#f3ede2] sm:text-5xl">
            ¿Listo para <span className="text-primary">respaldar tu moto</span>?
          </h2>
          <button
            onClick={login}
            className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-8 text-base font-semibold text-primary-foreground shadow-sm transition-all duration-150 hover:bg-primary-hover active:scale-[0.97]"
          >
            Comenzar gratis
          </button>
        </div>

        {/* Footer */}
        <footer className="border-t border-white/5 bg-[#15130f] py-8">
          <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-3 px-6 text-xs text-[#726b5e] sm:flex-row">
            <span>Cuotita</span>
            <div className="flex items-center gap-2">
              <span>Pagos verificados on-chain, con</span>
              <PollarLogo size={14} colorClass="bg-[#726b5e]" />
              <span>Pollar</span>
            </div>
            <a href="https://github.com/Alan021011/cuotita" target="_blank" rel="noopener noreferrer" className="hover:text-[#f3ede2]">
              github.com/Alan021011/cuotita
            </a>
          </div>
        </footer>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-4 py-8 pb-24 lg:max-w-lg lg:py-12 lg:pb-28">
      <header className="flex items-center justify-between gap-3 pb-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <PollarLogo size={30} />
          <h1 className="hidden min-w-0 truncate text-xl font-bold tracking-tight sm:block">
            Cuotita
          </h1>
        </div>
        <LoginButton />
      </header>

      <BalanceCard />

      <div className="flex flex-col items-center justify-center gap-6 rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-light text-primary">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 4v16m8-8H4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Crear un pool</h2>
          <p className="text-muted text-sm leading-relaxed max-w-[250px] mx-auto">
            Inicia una nueva colecta grupal para tu próximo evento, regalo o meta.
          </p>
        </div>
        <Link
          href="/pool/new"
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-base font-semibold text-primary-foreground shadow-sm transition-all duration-150 hover:bg-primary-hover active:scale-[0.97]"
        >
          Comenzar
        </Link>
      </div>

      <BottomNav />
    </main>
  );
}
