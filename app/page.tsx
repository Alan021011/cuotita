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
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-8 py-4 sm:px-12">
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
                Tu moto también necesita respaldo. Un fondo entre repartidores para cubrir los daños materiales — pantalla, freno, llanta — sin trámites.
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
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">Así es como funciona</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                n: "01",
                title: "Aporte",
                body: "Cada semana pones tu cuota en el fondo. Sin trámites, sin papeles.",
                icon: (
                  <path d="M3 7a2 2 0 0 1 2-2h11a3 3 0 0 1 3 3v1M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-4a2 2 0 1 0 0 4h5" />
                ),
              },
              {
                n: "02",
                title: "Reporte",
                body: "Si se te rompe algo, subes una foto y contas cuánto costó.",
                icon: (
                  <>
                    <path d="M4 7h3l1.5-2h7L17 7h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Z" />
                    <circle cx="12" cy="13" r="3.2" />
                  </>
                ),
              },
              {
                n: "03",
                title: "Aprobación",
                body: "Dos compañeros del grupo revisan la foto y dicen que sí. Nadie decide solo.",
                icon: (
                  <>
                    <circle cx="8.5" cy="9" r="2.5" />
                    <circle cx="16" cy="9" r="2.5" />
                    <path d="M3 19c.5-3 2.5-5 5.5-5s5 2 5.5 5M12.5 19c.4-2.4 2-4.2 4.5-4.6" />
                  </>
                ),
              },
              {
                n: "04",
                title: "Pago",
                body: "Apenas te aprueban, la plata te llega a tu cuenta. Al toque, sin intermediarios.",
                icon: (
                  <path d="M4 12h13M12 5l7 7-7 7" />
                ),
              },
            ].map((s, i) => (
              <div
                key={s.n}
                className={`flex flex-col gap-3 rounded-3xl border border-primary bg-[#211d17] p-6 shadow-[0_12px_30px_-12px_rgba(0,0,0,0.5)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_36px_-14px_rgba(0,0,0,0.6)] ${
                  i % 2 === 1 ? "lg:translate-y-4" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-[#1a1200]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      {s.icon}
                    </svg>
                  </div>
                  <span className="font-mono text-xs font-semibold text-[#7d766d]">{s.n}</span>
                </div>
                <h3 className="text-xl font-bold text-[#f5f1ea]">{s.title}</h3>
                <p className="text-base leading-7 text-[#a8a29a]">{s.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tienes tu grupo: flexibilidad de armado, en pasos que bajan en escalera. */}
        <div className="bg-[#15130f] py-20">
          <div className="mx-auto grid w-full max-w-5xl grid-cols-1 items-start gap-12 px-6 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-4xl leading-tight text-[#f3ede2] sm:text-5xl">
                ¿Tienes tu grupo <span className="text-primary">de confianza?</span>
              </h2>
              <p className="mt-4 max-w-md text-lg leading-8 text-[#aba192]">
                No importa si son pocos o muchos — Cuotita se arma como ustedes ya se organizan.
              </p>
            </div>

            <div className="relative flex items-center justify-center py-8 lg:py-16">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="" aria-hidden="true" className="absolute w-40 -translate-x-20 -translate-y-10 rotate-[-8deg] opacity-40 sm:w-48" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="" aria-hidden="true" className="absolute w-44 translate-x-24 translate-y-6 rotate-[6deg] opacity-60 sm:w-52" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Grupo de repartidores respaldado por Cuotita" className="relative w-64 drop-shadow-[0_0_50px_rgba(245,158,11,0.15)] sm:w-72" />
            </div>
          </div>

          <div className="mx-auto mt-20 w-full max-w-4xl px-6">
            <h3 className="text-center font-display text-3xl leading-tight text-[#f3ede2] sm:text-4xl">
              Para poder cubrir los distintos tipos de imprevistos
            </h3>
            <div className="mt-14 grid grid-cols-3 gap-x-6 gap-y-12 sm:grid-cols-6">
              {[
                { label: "Abolladuras", icon: <path d="M4 15c2-4 4-6 8-6s6 2 8 6M4 15l16 0M4 15c0 2 1.5 3 4 3M20 15c0 2-1.5 3-4 3" /> },
                { label: "Pantalla rota", icon: <><rect x="7" y="3" width="10" height="18" rx="2" /><path d="M9 8l3 3-2 2 4 4" /></> },
                { label: "Frenos", icon: <><circle cx="12" cy="12" r="7" /><circle cx="12" cy="12" r="2" /><path d="M12 5v2M12 17v2M5 12h2M17 12h2" /></> },
                { label: "Llantas", icon: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="2.5" /><path d="M12 4v3M12 17v3M4 12h3M17 12h3" /></> },
                { label: "Espejos", icon: <><ellipse cx="7" cy="8" rx="3" ry="4" /><ellipse cx="17" cy="8" rx="3" ry="4" /><path d="M7 12v4M17 12v4M4 20h6M14 20h6" /></> },
                { label: "Luces", icon: <><circle cx="12" cy="10" r="5" /><path d="M9 19h6M10 22h4M12 3V1" /></> },
              ].map((c, i) => (
                <div key={c.label} className="flex flex-col items-center gap-3 text-center">
                  <div
                    className="float flex h-24 w-24 items-center justify-center rounded-full border border-primary/50 bg-[#211d17] text-primary shadow-[0_10px_24px_-8px_rgba(0,0,0,0.5)]"
                    style={{ animationDuration: `${4 + i * 0.4}s`, animationDelay: `${i * 0.3}s` }}
                  >
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      {c.icon}
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-[#aba192]">{c.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mx-auto mt-20 w-full max-w-5xl px-6">
            <h2 className="text-center font-display text-3xl leading-tight text-[#f3ede2] sm:text-4xl">
              Así te <span className="text-primary">beneficia</span> de verdad
            </h2>
            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
              {[
                {
                  situation: "Se te rompe la pantalla en pleno reparto",
                  benefit: "Sacas la foto, el grupo aprueba, y en minutos tenés la plata para arreglarla.",
                },
                {
                  situation: "Un choque te deja sin poder rodar",
                  benefit: "No esperás semanas juntando plata: el fondo cubre la reparación mientras seguís trabajando.",
                },
                {
                  situation: "Se te poncha la llanta a mitad de turno",
                  benefit: "Pedís el aporte, tus compañeros lo aprueban, y seguís tu ruta el mismo día.",
                },
              ].map((c) => (
                <div key={c.situation} className="rounded-2xl border border-primary bg-[#211d17] p-6">
                  <p className="text-sm font-semibold text-[#a8a29a]">{c.situation}</p>
                  <p className="mt-3 text-base leading-7 font-bold text-[#f5f1ea]">{c.benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Así se ve: mockup del panel de delegados + insignias flotantes. */}
        <div className="bg-surface py-20">
          <div className="mx-auto grid w-full max-w-5xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2">
            <div className="order-2 text-center lg:order-1 lg:text-left">
              <h2 className="text-4xl font-bold text-foreground sm:text-5xl">
                Todo el grupo ve <span className="text-primary">lo mismo</span>
              </h2>
              <p className="mt-3 max-w-sm text-muted mx-auto lg:mx-0">
                Todos ven los aportes y los retiros de todos — quién puso, quién cobró, cuánto y cuándo. Total transparencia, nada se pierde en un chat de WhatsApp.
              </p>
            </div>

            <div className="relative order-1 mx-auto flex w-full max-w-[340px] justify-center py-6 lg:order-2">
              {/* decorative glow behind the phone */}
              <div className="absolute inset-0 -z-10 rounded-full bg-primary/20 blur-3xl" />

              {/* phone frame */}
              <div
                className="float w-full rounded-[3rem] border-[8px] border-[#15130f] bg-[#15130f] p-2 shadow-2xl"
                style={{ animationDuration: "6.5s" } as React.CSSProperties}
              >
                {/* speaker notch */}
                <div className="mx-auto mb-1 h-1.5 w-16 rounded-full bg-black/40" />
                <div className="rounded-[2.4rem] bg-background p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="font-display text-base tracking-wide text-primary">CUOTITA</span>
                    <span className="text-xs text-muted-light">9:41</span>
                  </div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Movimientos del fondo</p>
                  <div className="flex flex-col gap-2">
                    {[
                      { name: "Ana R.", detail: "Aporte semanal · 7f3a…9c1b", amount: "+15.00", positive: true },
                      { name: "Pago · Pantalla de celular", detail: "Juan P. · a1e4…22f0", amount: "-10.00", positive: false },
                      { name: "Luis M.", detail: "Aporte semanal · 5b90…7de3", amount: "+15.00", positive: true },
                      { name: "Pago · Freno / embrague", detail: "Marco T. · c02d…8a1f", amount: "-22.00", positive: false },
                    ].map((m) => (
                      <div key={m.name + m.amount} className="flex items-center justify-between rounded-xl border border-border bg-surface px-3 py-2.5">
                        <div className="flex min-w-0 items-center gap-2.5">
                          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${m.positive ? "bg-primary-light text-primary" : "bg-error-light text-error"}`}>
                            {m.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-xs font-semibold text-foreground">{m.name}</p>
                            <p className="truncate text-[10px] text-muted-light">{m.detail}</p>
                          </div>
                        </div>
                        <span className={`shrink-0 text-xs font-bold ${m.positive ? "text-success" : "text-error"}`}>
                          {m.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cómo se hacen los pagos: Bs para pensar, USDC para guardar. */}
        <div className="bg-surface py-20">
          <div className="mx-auto grid w-full max-w-5xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2">
            <div className="text-center lg:text-left">
              <p className="font-mono text-sm font-semibold uppercase tracking-widest text-primary">Por qué Cuotita</p>
              <h2 className="mt-2 text-4xl font-bold text-foreground sm:text-5xl">
                Piensas en <span className="text-primary">bolivianos</span>, se guarda seguro
              </h2>
              <p className="mt-4 max-w-md text-lg leading-8 text-muted mx-auto lg:mx-0">
                Cuando reportás un daño, ponés el monto en <span className="font-semibold text-foreground">Bs</span> — como siempre lo pensaste. Por detrás, el fondo lo guarda y lo paga en <span className="font-semibold text-primary">USDC</span>: no pierde valor, y llega directo a tu wallet.
              </p>
              <p className="mt-4 max-w-md text-lg leading-8 text-muted mx-auto lg:mx-0">
                Aportar tu cuota es igual de fácil: escaneás un <span className="font-semibold text-foreground">QR</span> y pagás desde cualquier banco boliviano — Banco Unión, BCP, BNB, Mercantil Santa Cruz. La plata llega al fondo ya convertida en <span className="font-semibold text-primary">USDC</span>.
              </p>
            </div>

            <div className="relative mx-auto flex w-full max-w-[300px] justify-center py-6">
              <div className="w-full rounded-[3rem] border-[8px] border-[#15130f] bg-[#15130f] p-2 shadow-2xl">
                <div className="mx-auto mb-1 h-1.5 w-16 rounded-full bg-black/40" />
                <div className="rounded-[2.4rem] bg-background p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="font-display text-base tracking-wide text-primary">CUOTITA</span>
                    <span className="text-xs text-muted-light">9:41</span>
                  </div>
                  <p className="mb-1 text-xs font-semibold text-foreground">Reportar daño</p>
                  <p className="mb-3 text-[11px] text-muted">Pantalla de celular</p>

                  <label className="mb-1 block text-[11px] font-medium text-muted">Monto (Bs)</label>
                  <div className="mb-3 rounded-xl border border-border bg-surface px-3 py-2.5 text-sm font-semibold text-foreground">
                    Bs 250.00
                  </div>

                  <div className="mb-3 flex justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-light">
                      <path d="M12 4v16m0 0l-5-5m5 5l5-5" />
                    </svg>
                  </div>

                  <label className="mb-1 block text-[11px] font-medium text-muted">Se guarda y se paga en</label>
                  <div className="mb-4 flex items-center justify-between rounded-xl border border-primary bg-primary-light px-3 py-2.5">
                    <span className="text-sm font-bold text-primary">10.00 USDC</span>
                    <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">Directo a tu wallet</span>
                  </div>

                  <div className="border-t border-border pt-3">
                    <p className="mb-2 text-xs font-semibold text-foreground">Aporta tu cuota con QR</p>
                    <div className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-background">
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-foreground">
                          <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                          <path d="M14 14h3v3h-3zM20 14v3M17 20h3M14 20h.01" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] text-muted">Escanea y paga desde tu banco</p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {["Banco Unión", "BCP", "BNB", "Mercantil"].map((bank) => (
                            <span key={bank} className="rounded-full border border-border bg-background px-2 py-0.5 text-[9px] font-semibold text-muted">
                              {bank}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cómo se retira: de USDC en la wallet a Bs en tu bolsillo. */}
        <div className="py-20">
          <div className="mx-auto grid w-full max-w-5xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2">
            <div className="order-2 text-center lg:order-1 lg:text-left">
              <p className="font-mono text-sm font-semibold uppercase tracking-widest text-primary">Por qué Cuotita</p>
              <h2 className="mt-2 text-4xl font-bold text-foreground sm:text-5xl">
                Y cuando <span className="text-primary">retiras</span>, también es fácil
              </h2>
              <p className="mt-4 max-w-md text-lg leading-8 text-muted mx-auto lg:mx-0">
                Apenas te aprueban el reclamo, el <span className="font-semibold text-primary">USDC</span> te llega a tu wallet Pollar. Desde ahí pedís el retiro y en minutos tenés la plata en <span className="font-semibold text-foreground">Bs</span>, lista para usar en el taller.
              </p>
            </div>

            <div className="relative order-1 mx-auto flex w-full max-w-[300px] justify-center py-6 lg:order-2">
              <div className="w-full rounded-[3rem] border-[8px] border-[#15130f] bg-[#15130f] p-2 shadow-2xl">
                <div className="mx-auto mb-1 h-1.5 w-16 rounded-full bg-black/40" />
                <div className="rounded-[2.4rem] bg-background p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="font-display text-base tracking-wide text-primary">CUOTITA</span>
                    <span className="text-xs text-muted-light">9:41</span>
                  </div>
                  <p className="mb-1 text-xs font-semibold text-foreground">Solicitar retiro</p>
                  <p className="mb-3 text-[11px] text-muted">Saldo disponible en tu wallet</p>

                  <label className="mb-1 block text-[11px] font-medium text-muted">Tienes</label>
                  <div className="mb-3 rounded-xl border border-primary bg-primary-light px-3 py-2.5 text-sm font-bold text-primary">
                    10.00 USDC
                  </div>

                  <div className="mb-3 flex justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-light">
                      <path d="M12 4v16m0 0l-5-5m5 5l5-5" />
                    </svg>
                  </div>

                  <label className="mb-1 block text-[11px] font-medium text-muted">Recibes en tu banco</label>
                  <div className="mb-4 flex items-center justify-between rounded-xl border border-border bg-surface px-3 py-2.5">
                    <span className="text-sm font-bold text-foreground">Bs 250.00</span>
                    <span className="rounded-full bg-success-light px-2 py-0.5 text-[10px] font-bold text-success">Al instante</span>
                  </div>

                  <div className="border-t border-border pt-3">
                    <p className="mb-2 text-xs font-semibold text-foreground">Retira a tu cuenta bancaria</p>
                    <div className="flex flex-wrap gap-1">
                      {["Banco Unión", "BCP", "BNB", "Mercantil"].map((bank) => (
                        <span key={bank} className="rounded-full border border-border bg-surface px-2 py-0.5 text-[9px] font-semibold text-muted">
                          {bank}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alcance a futuro: hacia dónde va Cuotita más allá del fondo entre repartidores. */}
        <div className="bg-[#15130f] py-20">
          <div className="mx-auto w-full max-w-4xl px-6 text-center">
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">Mirando adelante</p>
            <h2 className="mt-2 font-display text-4xl leading-tight text-[#f3ede2] sm:text-5xl">
              Esto es solo el comienzo
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-[#aba192]">
              Cuotita empieza como un fondo entre repartidores. El objetivo es más grande: convertirlo en la puerta de entrada a todo lo que un repartidor necesita para seguir rodando, con los negocios que ya conocés como aliados.
            </p>

            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {[
                {
                  title: "Talleres aliados",
                  points: [
                    "El pago de tu reclamo va directo al taller o repuestería, sin pasar por tus manos.",
                    "Talleres verificados por Cuotita en tu zona, no cualquiera.",
                    "Vos reportás el daño, el taller recibe el pago apenas se aprueba.",
                  ],
                },
                {
                  title: "Descuentos por convenio",
                  points: [
                    "Precios preferenciales en repuestos originales.",
                    "Descuentos en llantas, frenos y mantenimiento.",
                    "Promociones exclusivas para miembros de un fondo activo.",
                  ],
                },
              ].map((c) => (
                <div key={c.title} className="rounded-2xl border border-primary bg-[#211d17] p-7 text-left">
                  <h3 className="text-xl font-bold text-[#f5f1ea]">{c.title}</h3>
                  <ul className="mt-4 flex flex-col gap-3">
                    {c.points.map((point) => (
                      <li key={point} className="flex items-start gap-2.5 text-base leading-7 text-[#a8a29a]">
                        <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-surface py-20">
          <div className="mx-auto w-full max-w-2xl px-6">
            <p className="text-center font-mono text-sm font-semibold uppercase tracking-widest text-primary">Preguntas rápidas</p>
            <h2 className="mt-2 text-center text-4xl font-bold text-foreground sm:text-5xl">Bueno saberlo</h2>
            <div className="mt-12 flex flex-col divide-y divide-border">
              {[
                { q: "¿Quién guarda la plata del fondo?", a: "La wallet Pollar de quien organiza el grupo — mismo modelo de confianza que un pasanaku físico hoy, pero con cada aporte y pago verificado on-chain." },
                { q: "¿Necesito saber de cripto?", a: "No. Entrás con tu email o Google — Pollar maneja la wallet por detrás, vos solo ves saldos y botones." },
                { q: "¿Qué pasa si nadie aprueba mi reclamo?", a: "Se necesitan 2 votos del mismo lado (aprobar o rechazar) de los delegados del grupo para resolverlo." },
                { q: "¿Cuánto tarda el pago una vez aprobado?", a: "Es una transacción en Stellar — segundos, directo a tu wallet." },
              ].map((item) => (
                <div key={item.q} className="py-6 text-left">
                  <h3 className="text-lg font-bold text-foreground">{item.q}</h3>
                  <p className="mt-2 text-base leading-7 text-muted">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cierre: a pantalla completa, logo + lema. */}
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#15130f] px-6 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Cuotita" className="w-40 drop-shadow-[0_0_60px_rgba(245,158,11,0.2)] sm:w-52" />
          <h2 className="font-display text-4xl leading-tight text-[#f3ede2] sm:text-5xl">
            Aportamos hoy,
            <span className="block text-primary">reparamos mañana.</span>
          </h2>
          <button
            onClick={login}
            className="mt-4 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-8 text-base font-semibold text-primary-foreground shadow-sm transition-all duration-150 hover:bg-primary-hover active:scale-[0.97]"
          >
            Comenzar gratis
          </button>

          <div className="mt-10 flex flex-col items-center gap-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#726b5e]">Construido con</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                <PollarLogo size={16} colorClass="bg-[#f3ede2]" />
                <span className="text-sm font-semibold text-[#f3ede2]">Pollar</span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                <span className="text-sm font-semibold text-[#f3ede2]">Stellar</span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                <span className="text-sm font-semibold text-[#f3ede2]">Next.js</span>
              </div>
            </div>
          </div>
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
