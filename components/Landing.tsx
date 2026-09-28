"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { PollarLogo } from "@/components/ui/PollarLogo";
import { CLAIM_QUORUM } from "@/lib/constants";

/*
 * Desktop-first landing, ported from the Stitch project "Cuotita Fondo
 * Motorepartidores" (screen "Cuotita — Fondo de Auxilio Mutuo para
 * Motorepartidores"). Layout and look follow the design; claims the product
 * can't back (multisig vault, bank-QR deposits, coverage caps, partner shops,
 * usage stats) were rewritten to match how Cuotita actually works.
 */

const NAV = [
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#coberturas", label: "Coberturas" },
  { href: "#simulador", label: "Simulador" },
  { href: "#talleres", label: "Talleres" },
  { href: "#preguntas", label: "Preguntas" },
];

const STEPS = [
  {
    n: "01",
    icon: "savings",
    title: "Aporte semanal simple",
    body: "Pones tu cuota en el fondo de tu parada desde tu wallet Pollar. Entras con tu email o Google, sin saber nada de cripto.",
    foot: { icon: "bolt", text: "Menos de lo que vale una soda al día" },
    accent: "text-primary",
  },
  {
    n: "02",
    icon: "photo_camera",
    title: "Reporte en 30 segundos",
    body: "¿Se pinchó la llanta, se rompió la maneta o la pantalla? Abres Cuotita, sacas una foto del daño, eliges el tipo y pones el monto.",
    foot: { icon: "timer", text: "Reporte sin bajar de la moto" },
    accent: "text-primary",
  },
  {
    n: "03",
    icon: "how_to_reg",
    title: "Voto entre camaradas",
    body: `Los delegados de tu grupo revisan la foto y votan. Con ${CLAIM_QUORUM} votos del mismo lado el reclamo se aprueba o se rechaza. Nadie decide solo.`,
    foot: { icon: "groups", text: "Control gremial real" },
    accent: "text-primary",
  },
  {
    n: "04",
    icon: "payments",
    title: "Plata directo a tu wallet",
    body: "Apenas se aprueba, el organizador te transfiere el monto en USDC con un clic. Llega en segundos y desde ahí lo pasas a Bs.",
    foot: { icon: "speed", text: "Sin esperas de 30 días" },
    accent: "text-success",
  },
];

const DAMAGES = [
  { icon: "tire_repair", title: "Pinchazos & llantas", body: "Cámaras, parches, desmontaje y clavos en calle" },
  { icon: "album", title: "Frenos & pastillas", body: "Balatas gastadas, discos rayados y líquido de freno" },
  { icon: "smartphone", title: "Pantalla de móvil", body: "Caída del soporte en bache o vibración de adoquín" },
  { icon: "flip", title: "Espejos & manetas", body: "Retrovisores partidos, pedales y raspaduras" },
  { icon: "settings", title: "Cadena & piñón", body: "Corte de cadena, eslabones trabados o corona gastada" },
  { icon: "light", title: "Luces & batería", body: "Foco quemado para circular de noche sin multas" },
];

const WHATSAPP = [
  "Un solo piloto tiene la plata en su cuenta y nadie ve cuánto queda.",
  "Discusiones interminables en el chat cuando alguien pide ayuda.",
  "Si el dólar sube, los repuestos importados salen el doble y el fondo no alcanza.",
  "Planillas de Excel desactualizadas que nadie entiende.",
];

const CUOTITA = [
  { b: "Todo a la vista:", t: "cada aporte y cada pago queda registrado en la red Stellar. Cualquiera del grupo lo puede revisar." },
  { b: "Voto de delegados:", t: `ningún reclamo se paga sin ${CLAIM_QUORUM} aprobaciones de los delegados del grupo.` },
  { b: "Guardado en USDC:", t: "el fondo está en dólares digitales, así la inflación no se come el ahorro." },
  { b: "Pago en segundos:", t: "el reclamo aprobado llega directo a la wallet Pollar del compañero." },
];

const FAQ = [
  {
    q: "¿Quién custodia o guarda la plata del pozo?",
    a: "La wallet Pollar de quien organiza el grupo — el mismo modelo de confianza que un pasanaku de hoy, pero con cada aporte y cada pago verificado en la red Stellar, a la vista de todos.",
  },
  {
    q: "¿Necesito saber de finanzas complejas o criptomonedas?",
    a: "No. Entras con tu email o Google y Pollar maneja la wallet por detrás. Tú solo ves saldos y botones.",
  },
  {
    q: "¿Qué pasa si tengo una avería y nadie aprueba mi solicitud?",
    a: `El reclamo queda pendiente hasta juntar ${CLAIM_QUORUM} votos del mismo lado (aprobar o rechazar) de los delegados del grupo. Por eso conviene tener varios delegados activos.`,
  },
  {
    q: "¿Puedo armar un pozo privado solo con mis camaradas de parada?",
    a: "Sí. Creas el fondo, compartes el enlace o el QR con tu parada y eliges quiénes son los delegados que aprueban los reclamos.",
  },
  {
    q: "¿Cuánto tarda en llegar el dinero a mi cuenta?",
    a: "Una vez aprobado, el organizador hace la transferencia y llega en segundos a tu wallet. Desde ahí lo puedes retirar a Bs con el ramp bancario de Pollar.",
  },
];

/** Stitch's "headline" style: Oswald, uppercase, wide tracking. */
const H = "font-heading uppercase tracking-wide";

function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`text-[11px] font-semibold uppercase tracking-[0.12em] text-primary-hover ${className}`}>{children}</p>
  );
}

function HeroPhone() {
  return (
    <div className="relative w-full max-w-[360px]">
      <div className="rounded-[2.5rem] bg-black/50 p-3 shadow-2xl shadow-black/80">
        <div className="flex flex-col gap-4 overflow-hidden rounded-[2rem] bg-surface p-4">
          <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-muted">
            <span className="flex items-center gap-1">
              <Icon name="wifi_tethering" className="text-base text-success" />
              Grupo: Parada Central
            </span>
            <span className="text-primary">En turno</span>
          </div>

          <div className="flex flex-col gap-1 rounded-2xl bg-surface-raised p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">Fondo común</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-surface px-2 py-0.5 text-[11px] font-semibold text-success">
                <span className="h-1.5 w-1.5 rounded-full bg-success" /> Activo
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className={`${H} text-5xl font-bold text-primary`}>186</span>
              <span className="text-sm text-muted">/ 300 USDC</span>
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-surface">
              <div className="h-full w-[62%] rounded-full bg-gradient-to-r from-primary to-success" />
            </div>
            <span className="text-[11px] font-semibold text-muted">14 compañeros aportando</span>
          </div>

          <div className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#93000a] text-[#ffdad6] shadow-[0_0_16px_rgb(239_68_68/0.3)]">
            <Icon name="warning" className="text-[22px]" />
            <span className={`${H} text-lg`}>Reportar auxilio</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">Últimos movimientos</span>
            {[
              { icon: "build", tint: "bg-primary/20 text-primary", name: "Jorge P. · Pinchazo", sub: "Aprobado por Carlos y Nico", amount: "-6.50", color: "text-error" },
              { icon: "savings", tint: "bg-success/20 text-success", name: "Aporte semanal", sub: "Luis M. · hace 4 min", amount: "+2.00", color: "text-success" },
            ].map((m) => (
              <div key={m.name} className="flex items-center justify-between rounded-2xl bg-background/80 p-2">
                <div className="flex min-w-0 items-center gap-2">
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${m.tint}`}>
                    <Icon name={m.icon} className="text-lg" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[11px] font-semibold text-foreground">{m.name}</p>
                    <p className="truncate text-[11px] text-muted">{m.sub}</p>
                  </div>
                </div>
                <span className={`${H} ml-2 shrink-0 text-lg ${m.color}`}>{m.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute -bottom-8 -left-10 hidden w-56 rounded-2xl border border-border bg-surface-raised p-3 shadow-xl sm:block">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold text-success">
          <Icon name="how_to_vote" className="text-base" /> Quórum {CLAIM_QUORUM} votos
        </p>
        <p className="mt-1 text-[11px] leading-snug text-muted">
          Nadie aprueba solo. Cada reclamo necesita el voto de {CLAIM_QUORUM} delegados.
        </p>
      </div>
    </div>
  );
}

function Simulator({ onStart }: { onStart: () => void }) {
  const [riders, setRiders] = useState(25);
  const [quota, setQuota] = useState(15);
  const monthly = riders * quota * 4;
  const perRiderMonth = quota * 4;
  const repairs = Math.floor(monthly / 150);

  return (
    <div className="grid grid-cols-1 gap-8 rounded-[2rem] bg-surface p-6 md:p-10 lg:grid-cols-2">
      <div className="flex flex-col gap-5">
        <Eyebrow>Simulador de pozo</Eyebrow>
        <h2 className={`${H} text-4xl font-bold leading-[1.05] text-foreground md:text-5xl`}>
          ¿Cuánto respaldo genera tu parada?
        </h2>
        <p className="text-[15px] leading-relaxed text-muted">
          Mueve la cantidad de pilotos y la cuota para ver la fuerza colectiva que junta tu grupo. Es una estimación: cada grupo define su propia cuota.
        </p>

        <div className="flex flex-col gap-5 rounded-2xl bg-background/60 p-5">
          <label className="flex flex-col gap-3">
            <span className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">Repartidores en el grupo</span>
              <span className={`${H} text-2xl text-primary`}>{riders} motos</span>
            </span>
            <input
              type="range"
              min={5}
              max={100}
              value={riders}
              onChange={(e) => setRiders(Number(e.target.value))}
              className="w-full accent-[var(--primary)]"
            />
            <span className="flex justify-between text-[11px] text-muted">
              <span>5 (mini-grupo)</span>
              <span>50 (asociación)</span>
              <span>100 (sindicato)</span>
            </span>
          </label>

          <label className="flex flex-col gap-3">
            <span className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">Cuota por semana</span>
              <span className={`${H} text-2xl text-primary`}>Bs {quota}</span>
            </span>
            <input
              type="range"
              min={5}
              max={50}
              step={5}
              value={quota}
              onChange={(e) => setQuota(Number(e.target.value))}
              className="w-full accent-[var(--primary)]"
            />
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-4 self-center">
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-surface-raised p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">Fondo al mes</p>
            <p className={`${H} mt-1 text-4xl font-bold text-primary md:text-5xl`}>Bs {monthly.toLocaleString("es-BO")}</p>
            <p className="mt-1 text-xs text-muted">Guardado en USDC</p>
          </div>
          <div className="rounded-2xl bg-surface-raised p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">Alcanza para</p>
            <p className={`${H} mt-1 text-4xl font-bold text-success md:text-5xl`}>{repairs} arreglos</p>
            <p className="mt-1 text-xs text-muted">de unos Bs 150 cada uno</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 rounded-2xl bg-background p-5 text-sm">
          <div className="flex justify-between">
            <span className="text-muted">Tu aporte al mes</span>
            <span className="font-semibold text-foreground">Bs {perRiderMonth}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Quién aprueba los pagos</span>
            <span className="font-semibold text-foreground">{CLAIM_QUORUM} delegados del grupo</span>
          </div>
        </div>
        <button
          onClick={onStart}
          className={`${H} flex h-14 items-center justify-center gap-2 rounded-full bg-primary text-lg text-primary-foreground shadow-[0_0_24px_rgb(245_158_11/0.3)] transition-all hover:bg-primary-hover active:scale-95`}
        >
          Crear este pozo con mis camaradas
          <Icon name="arrow_forward" className="text-xl" />
        </button>
      </div>
    </div>
  );
}

export function Landing({ login }: { login: () => void }) {
  return (
    <div className="flex flex-1 flex-col bg-background text-foreground">
      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-50 bg-background/90 shadow-[0_1px_8px_rgb(0_0_0/0.4)] backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
          <a href="#" className="flex shrink-0 items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="" className="h-9 w-9 object-contain" />
            <span className="flex flex-col">
              <span className={`${H} text-lg font-bold leading-none text-primary-hover`}>Cuotita</span>
              <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">Auxilio mutuo motos</span>
            </span>
          </a>
          <nav className="hidden items-center gap-4 lg:flex">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className="px-2 py-1 text-[13px] font-semibold text-muted transition-colors hover:text-foreground">
                {n.label}
              </a>
            ))}
          </nav>
          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={login}
              className="hidden h-12 items-center rounded-full px-4 text-[13px] font-semibold text-muted transition-all hover:bg-surface hover:text-foreground sm:inline-flex"
            >
              Iniciar sesión
            </button>
            <button
              onClick={login}
              className={`${H} inline-flex h-12 items-center rounded-full bg-primary px-6 text-base text-primary-foreground shadow-[0_0_16px_rgb(245_158_11/0.25)] transition-all hover:bg-primary-hover active:scale-95`}
            >
              Unirme al pozo
            </button>
          </div>
        </div>
      </header>

      <main className="pt-20">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#100e0a] via-background to-[#1d1b17] pb-24 pt-9 md:pb-32">
          <div className="pointer-events-none absolute -top-40 left-1/2 h-[340px] w-[720px] -translate-x-1/2 rounded-full bg-primary/10 blur-[130px]" />
          <div className="pointer-events-none absolute -right-32 top-1/3 h-80 w-80 rounded-full bg-success/10 blur-[110px]" />
          <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-6">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-surface-raised/90 px-4 py-1 shadow-md">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-success" />
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-success">
                Red solidaria de motorepartidores · Bolivia
              </span>
            </div>

            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
              <div className="flex flex-col gap-6 lg:col-span-7">
                <h1 className={`${H} text-5xl font-bold leading-[1.05] md:text-6xl lg:text-7xl`}>
                  Aportamos hoy,
                  <br />
                  <span className="text-primary drop-shadow-[0_0_24px_rgba(245,158,11,0.35)]">reparamos mañana.</span>
                </h1>
                <p className="max-w-2xl text-[17px] leading-relaxed text-muted">
                  Tu moto es tu herramienta de trabajo y no puede frenar. Un fondo colectivo entre repartidores para cubrir averías — pinchazos, frenos, pantallas rotas y choques leves — sin bancos, sin letra chica y aprobado por tus propios camaradas de ruta.
                </p>
                <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center">
                  <button
                    onClick={login}
                    className={`${H} inline-flex h-14 items-center justify-center gap-2 rounded-full bg-primary px-9 text-lg text-primary-foreground shadow-[0_0_24px_rgb(245_158_11/0.3)] transition-all hover:bg-primary-hover active:scale-95`}
                  >
                    Comenzar gratis
                    <Icon name="arrow_forward" className="text-xl" />
                  </button>
                  <a
                    href="#como-funciona"
                    className={`${H} inline-flex h-14 items-center justify-center gap-2 rounded-full bg-surface-raised px-6 text-lg text-foreground transition-all hover:bg-border`}
                  >
                    <Icon name="play_circle" className="text-[22px] text-primary" />
                    Cómo funciona
                  </a>
                </div>

                <div className="mt-2 grid grid-cols-3 gap-4 rounded-2xl bg-surface/60 p-4 shadow-sm">
                  <div>
                    <p className={`${H} text-2xl font-bold text-primary`}>{CLAIM_QUORUM} votos</p>
                    <p className="text-[13px] leading-tight text-muted">de delegados para aprobar cada reclamo</p>
                  </div>
                  <div>
                    <p className={`${H} text-2xl font-bold text-success`}>Segundos</p>
                    <p className="text-[13px] leading-tight text-muted">para que el pago llegue a tu wallet</p>
                  </div>
                  <div>
                    <p className={`${H} text-2xl font-bold text-foreground`}>100%</p>
                    <p className="text-[13px] leading-tight text-muted">de los movimientos verificados on-chain</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center lg:col-span-5">
                <HeroPhone />
              </div>
            </div>
          </div>
        </section>

        {/* Cómo funciona */}
        <section id="como-funciona" className="scroll-mt-20 py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <Eyebrow>Mecánica callejera comprobada</Eyebrow>
            <h2 className={`${H} mt-2 max-w-3xl text-4xl font-bold leading-[1.05] md:text-5xl`}>
              Así de simple. De repartidores para repartidores.
            </h2>
            <p className="mt-3 max-w-3xl text-[17px] leading-relaxed text-muted">
              Sin oficinas, sin agentes de seguro que nunca anduvieron en dos ruedas, sin letra chica. Todo se resuelve en la pantalla del celular mientras estás en turno.
            </p>
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((s) => (
                <div key={s.n} className="flex flex-col gap-3 rounded-2xl bg-surface p-6 transition-colors hover:bg-surface-raised">
                  <div className="flex items-start justify-between">
                    <span className={`${H} text-5xl font-bold ${s.accent}`}>{s.n}</span>
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-raised text-primary">
                      <Icon name={s.icon} className="text-2xl" />
                    </span>
                  </div>
                  <h3 className={`${H} text-2xl font-semibold`}>{s.title}</h3>
                  <p className="flex-1 text-[15px] leading-relaxed text-muted">{s.body}</p>
                  <p className={`mt-2 flex items-center gap-1.5 text-[11px] font-semibold ${s.accent}`}>
                    <Icon name={s.foot.icon} className="text-sm" /> {s.foot.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Coberturas */}
        <section id="coberturas" className="scroll-mt-20 bg-[#1d1b17] py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="text-center">
              <Eyebrow>Catálogo de auxilio solidario</Eyebrow>
              <h2 className={`${H} mx-auto mt-2 max-w-3xl text-4xl font-bold leading-[1.05] md:text-5xl`}>
                Todo lo que te deja a pie, cubierto por el fondo
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
                Las motos de delivery sufren el asfalto boliviano todos los días. Estos son los imprevistos que el fondo cubre — y el monto lo aprueba tu propio grupo.
              </p>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              {DAMAGES.map((d) => (
                <div key={d.title} className="flex flex-col items-center gap-3 rounded-2xl bg-surface p-5 text-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-raised text-primary">
                    <Icon name={d.icon} className="text-3xl" />
                  </span>
                  <h3 className={`${H} text-lg font-semibold leading-tight`}>{d.title}</h3>
                  <p className="text-[13px] leading-snug text-muted">{d.body}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-col items-start gap-4 rounded-2xl bg-surface p-5 sm:flex-row sm:items-center">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-error/20 text-error">
                <Icon name="how_to_vote" className="text-2xl" />
              </span>
              <div className="flex-1">
                <h3 className={`${H} text-xl font-semibold`}>¿Y si es otro daño?</h3>
                <p className="text-[13px] text-muted">
                  Elige “Otro daño material”, sube la foto y la cotización del taller. Los delegados de tu grupo deciden si el fondo lo cubre.
                </p>
              </div>
              <button
                onClick={login}
                className={`${H} flex h-12 shrink-0 items-center gap-1 rounded-full bg-surface-raised px-5 text-lg text-primary-hover transition-colors hover:bg-border`}
              >
                Reportar un daño <Icon name="chevron_right" className="text-xl" />
              </button>
            </div>
          </div>
        </section>

        {/* Comparación */}
        <section className="py-20">
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 md:px-6 lg:grid-cols-12">
            <div className="flex flex-col gap-5 lg:col-span-5">
              <Eyebrow className="flex items-center gap-1.5">
                <Icon name="shield" className="text-base" /> Estabilidad financiera
              </Eyebrow>
              <h2 className={`${H} text-4xl font-bold leading-[1.05] md:text-6xl`}>
                Piensas en bolivianos, tu pozo se cuida seguro.
              </h2>
              <p className="text-[15px] leading-relaxed text-muted">
                Todos sabemos lo que pasa cuando se junta plata en un grupo de WhatsApp: el administrador se desaparece, no se sabe cuánto queda o la inflación se come el ahorro.
              </p>
              <p className="text-[15px] leading-relaxed text-muted">
                En Cuotita reportas el daño en <strong className="text-foreground">Bs</strong>, como siempre lo pensaste. Por detrás el fondo se guarda en{" "}
                <strong className="text-foreground">dólares digitales (USDC)</strong> y cada pago necesita el voto de {CLAIM_QUORUM} delegados.
              </p>
              <div className="flex flex-wrap gap-4 text-[13px] font-semibold text-success">
                <span className="flex items-center gap-1"><Icon name="verified" className="text-base" /> Saldo visible 24/7</span>
                <span className="flex items-center gap-1"><Icon name="verified" className="text-base" /> Pagos verificados on-chain</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:col-span-7">
              <div className="flex flex-col gap-4 rounded-2xl bg-[#100e0a] p-6">
                <div className="flex items-center justify-between">
                  <h3 className={`${H} text-lg font-semibold text-muted`}>El grupo de WhatsApp informal</h3>
                  <Icon name="cancel" className="text-2xl text-error" />
                </div>
                <ul className="flex flex-col gap-3">
                  {WHATSAPP.map((t) => (
                    <li key={t} className="flex gap-2 text-[13px] leading-snug text-muted">
                      <Icon name="close" className="mt-0.5 text-base text-error" /> {t}
                    </li>
                  ))}
                </ul>
                <p className="mt-auto rounded-full bg-surface py-3 text-center text-[11px] font-semibold text-muted">
                  Riesgo alto de desconfianza y pleitos
                </p>
              </div>
              <div className="relative flex flex-col gap-4 overflow-hidden rounded-2xl bg-surface-raised p-6">
                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
                <div className="flex items-center justify-between">
                  <h3 className={`${H} text-lg font-semibold text-primary-hover`}>Pozo solidario Cuotita</h3>
                  <Icon name="check_circle" className="text-2xl text-success" />
                </div>
                <ul className="flex flex-col gap-3">
                  {CUOTITA.map((c) => (
                    <li key={c.b} className="flex gap-2 text-[13px] leading-snug text-muted">
                      <Icon name="check" className="mt-0.5 text-base text-success" />
                      <span>
                        <strong className="text-foreground">{c.b}</strong> {c.t}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-auto rounded-full bg-[#100e0a] py-3 text-center text-[11px] font-semibold text-success">
                  Hermandad y confianza técnica
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Simulador */}
        <section id="simulador" className="scroll-mt-20 pb-20">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <Simulator onStart={login} />
          </div>
        </section>

        {/* Talleres (roadmap) */}
        <section id="talleres" className="scroll-mt-20 bg-[#100e0a] py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <Eyebrow>Red de soporte en calle</Eyebrow>
                <h2 className={`${H} mt-2 max-w-2xl text-4xl font-bold leading-[1.05] md:text-5xl`}>
                  Talleres aliados: pagos directos y descuentos
                </h2>
                <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
                  Lo que viene: que el pago de tu reclamo vaya directo al mecánico, sin que tengas que andar con efectivo ni esperar reembolsos.
                </p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full bg-surface px-4 py-2 text-[13px] font-semibold text-primary md:self-auto">
                <Icon name="construction" className="text-base" /> Próximamente
              </span>
            </div>
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
              {[
                { icon: "handyman", title: "Pago directo al taller", body: "Tú reportas el daño y el taller cobra apenas los delegados aprueban. Sin pasar por tus manos." },
                { icon: "verified", title: "Talleres verificados", body: "Mecánicos y repuesteras de tu zona revisados por Cuotita, no cualquiera." },
                { icon: "sell", title: "Descuentos por convenio", body: "Precios preferenciales en llantas, frenos y repuestos para miembros de un fondo activo." },
              ].map((c) => (
                <div key={c.title} className="flex flex-col gap-3 rounded-2xl border border-dashed border-border bg-surface p-6">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <Icon name={c.icon} className="text-2xl" />
                  </span>
                  <h3 className={`${H} text-2xl font-semibold`}>{c.title}</h3>
                  <p className="text-[15px] leading-relaxed text-muted">{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="preguntas" className="scroll-mt-20 py-20">
          <div className="mx-auto max-w-4xl px-4 md:px-6">
            <div className="text-center">
              <Eyebrow>Cuentas claras</Eyebrow>
              <h2 className={`${H} mt-2 text-4xl font-bold leading-[1.05] md:text-5xl`}>Preguntas frecuentes de la comunidad</h2>
              <p className="mt-3 text-[15px] text-muted">Sin rodeos ni vueltas. Todo lo que quieres saber antes de sumarte o armar tu propio pozo.</p>
            </div>
            <div className="mt-10 flex flex-col gap-4">
              {FAQ.map((f) => (
                <details key={f.q} className="group rounded-2xl bg-surface px-5 py-4 open:bg-surface-raised">
                  <summary className={`${H} flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-medium`}>
                    {f.q}
                    <Icon name="expand_more" className="shrink-0 text-primary transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="px-4 pb-20 md:px-6">
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-5 rounded-2xl bg-surface px-6 py-14 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_0_24px_rgb(245_158_11/0.4)]">
              <Icon name="two_wheeler" className="text-3xl" />
            </span>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-success">Unidos en el asfalto boliviano</p>
            <h2 className={`${H} max-w-3xl text-4xl font-bold leading-[1.05] md:text-6xl`}>
              ¿Tienes tu grupo de confianza en la parada?
            </h2>
            <p className="max-w-2xl text-[17px] leading-relaxed text-muted">
              Crea tu pozo hoy en 2 minutos sin pagar nada, o súmate al de tu parada con el enlace de tu organizador. Nunca más te quedes a pie.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={login}
                className={`${H} flex h-14 items-center justify-center gap-2 rounded-full bg-primary px-8 text-lg text-primary-foreground shadow-[0_0_24px_rgb(245_158_11/0.3)] transition-all hover:bg-primary-hover active:scale-95`}
              >
                Comenzar gratis con mi grupo <Icon name="arrow_forward" className="text-xl" />
              </button>
              <a
                href="#como-funciona"
                className={`${H} flex h-14 items-center justify-center gap-2 rounded-full bg-[#100e0a] px-6 text-lg text-foreground transition-colors hover:bg-surface-raised`}
              >
                <Icon name="play_circle" className="text-xl text-success" /> Ver cómo funciona
              </a>
            </div>
            <div className="flex flex-wrap justify-center gap-5 text-[11px] font-semibold text-muted">
              <span className="flex items-center gap-1"><Icon name="check" className="text-sm text-success" /> Sin costos de apertura</span>
              <span className="flex items-center gap-1"><Icon name="check" className="text-sm text-success" /> Entras con tu email o Google</span>
              <span className="flex items-center gap-1"><Icon name="check" className="text-sm text-success" /> Pagos en segundos</span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#100e0a] pt-14">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 md:grid-cols-2 md:px-6 lg:grid-cols-4">
          <div className="flex flex-col gap-3">
            <p className={`${H} flex items-center gap-2 text-2xl font-semibold`}>
              <span className="h-2.5 w-2.5 rounded-full bg-success" /> Cuotita
            </p>
            <p className="text-[15px] leading-relaxed text-muted">
              Fondo de auxilio mutuo, transparente, para motorepartidores de delivery en Bolivia.
            </p>
          </div>
          <div>
            <p className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-primary-hover">Navegación</p>
            <ul className="flex flex-col gap-2 text-[13px] text-muted">
              {NAV.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="transition-colors hover:text-foreground">{n.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-primary-hover">Código abierto</p>
            <p className="mb-3 text-[13px] text-muted">Revisa cómo funciona por dentro, línea por línea.</p>
            <a
              href="https://github.com/Alan021011/cuotita"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl bg-surface px-4 py-3 text-[13px] font-semibold text-foreground transition-colors hover:bg-surface-raised"
            >
              <Icon name="code" className="text-lg text-success" /> github.com/Alan021011/cuotita
            </a>
          </div>
          <div>
            <p className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-primary-hover">Construido con</p>
            <div className="grid grid-cols-2 gap-2">
              <span className="flex items-center justify-center gap-2 rounded-2xl bg-surface py-3 font-heading text-lg uppercase">
                <PollarLogo size={16} colorClass="bg-foreground" /> Pollar
              </span>
              <span className="flex items-center justify-center rounded-2xl bg-surface py-3 font-heading text-lg uppercase">Stellar</span>
              <span className="col-span-2 flex items-center justify-center rounded-2xl bg-surface py-3 text-[11px] font-semibold text-muted">
                Pagos verificados on-chain en USDC
              </span>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-12 flex max-w-7xl flex-col items-center justify-between gap-2 border-t border-border/50 px-4 py-6 text-[13px] text-muted md:flex-row md:px-6">
          <span>© {new Date().getFullYear()} Cuotita · Fondo solidario de repartidores de Bolivia.</span>
          <span>Buildathon Ethereum Bolivia · Track Pollar</span>
        </div>
      </footer>
    </div>
  );
}
