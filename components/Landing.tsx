"use client";

import { Icon } from "@/components/ui/Icon";

/*
 * Institutional "fund infrastructure" landing — ported from the Stitch
 * design "Cuotita — Infraestructura para Fondos Colectivos" (design system
 * "Solidarity & Prudence"). Generic pitch for any collective fund (gremios,
 * cooperativas, asociaciones), not specific to motorcyclists — this is the
 * direction the team asked to lead with going forward.
 *
 * Colors are scoped to this page via local CSS custom properties (--ls-*)
 * instead of touching the app's shared blue tokens, so the rest of the app
 * (claims flow, account screens) is unaffected.
 */

const JAKARTA = "font-[family-name:var(--font-plus-jakarta)]";
const MONO = "font-[family-name:var(--font-jetbrains-mono)]";

const T = {
  display: `${JAKARTA} text-[2.25rem] leading-[1.15] tracking-[-0.03em] font-bold lg:text-[3.5rem] lg:leading-[1.1] lg:tracking-[-0.035em]`,
  headlineLg: `${JAKARTA} text-[1.75rem] leading-[1.25] tracking-[-0.02em] font-semibold lg:text-[2.25rem] lg:leading-[1.2] lg:tracking-[-0.025em]`,
  headlineMd: `${JAKARTA} text-2xl leading-[1.3] tracking-[-0.02em] font-semibold`,
  headlineSm: `${JAKARTA} text-xl leading-[1.35] tracking-[-0.015em] font-semibold`,
  bodyLg: `${JAKARTA} text-lg leading-[1.55] tracking-[-0.01em]`,
  bodyMd: `${JAKARTA} text-[0.9375rem] leading-[1.5] tracking-[-0.005em]`,
  bodySm: `${JAKARTA} text-[0.8125rem] leading-[1.45]`,
  labelMd: `${JAKARTA} text-sm leading-[1.25] tracking-[-0.005em] font-medium`,
  labelSm: `${JAKARTA} text-xs leading-[1.2] tracking-[0.01em] font-medium`,
  monoLg: `${MONO} text-2xl leading-[1.2] tracking-[-0.03em] font-medium`,
  monoMd: `${MONO} text-[0.9375rem] leading-[1.3] tracking-[-0.02em] font-medium`,
  monoSm: `${MONO} text-xs leading-[1.2] tracking-[-0.01em]`,
};

const NAV = [
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#funcionalidades", label: "Funcionalidades" },
  { href: "#casos-de-uso", label: "Casos de uso" },
  { href: "#transparencia", label: "Transparencia" },
];

const PILARES = [
  { icon: "hub", title: "Organización", body: "Administra participantes y fondos desde un solo espacio centralizado, con vistas claras por área, proyecto o delegación territorial.", tag: "Estructura multinivel" },
  { icon: "gavel", title: "Reglas", body: "Establece quién puede participar, decidir y aprobar operaciones de forma colegiada antes de que los fondos puedan ser movilizados.", tag: "Firmas mancomunadas" },
  { icon: "account_balance", title: "Control", body: "Registra aportaciones, solicitudes y desembolsos sin margen de descuadre. Conciliación continua respaldada con soporte documental.", tag: "Conciliación exacta" },
  { icon: "visibility", title: "Transparencia", body: "Consulta movimientos, decisiones tomadas e historial inmutable. Cada socio o directivo accede a una visión fidedigna en tiempo real.", tag: "Pista de auditoría 100%" },
];

const CASOS = [
  { icon: "medical_services", title: "Fondos de ayuda mutua", body: "Emergencias médicas, auxilio social entre profesionales y fondos familiares de reserva ante contingencias imprevisibles.", rule: "Regla activa: Liquidación express bajo certificado médico" },
  { icon: "savings", title: "Ahorro colectivo", body: "Planes de previsión grupal, fondos rotativos solidarios y metas de ahorro compartidas con calendarización estricta.", rule: "Regla activa: Bloqueo de retiros hasta cumplimiento de plazo" },
  { icon: "shopping_cart_checkout", title: "Compras compartidas", body: "Adquisición de maquinaria, compras de insumos a escala para cooperativas agrarias o equipamiento tecnológico grupal.", rule: "Regla activa: Votación de presupuestos y proveedores" },
  { icon: "corporate_fare", title: "Fondos de organizaciones", body: "Gremios profesionales, sindicatos independientes, asociaciones civiles, clubes deportivos y comisiones de vecinos.", rule: "Regla activa: Doble firma mancomunada presidente + tesorero" },
];

const PIPELINE = [
  { n: 1, title: "Solicitud Formal", meta: "Emisión por socio habilitado", body: "Detalle del motivo, cotización asociada e importe exacto requerido.", active: false },
  { n: 2, title: "Revisión de Requisitos", meta: "Validación de fondos", body: "Comprobación automática de disponibilidad de saldo en el sub-fondo respectivo.", active: false },
  { n: 3, title: "Aprobación Colegiada", meta: "Firmas digitales requeridas", body: "Consenso alcanzado según el quórum (ej: 3 de 4 miembros del comité).", active: true },
  { n: 4, title: "Desembolso Registrado", meta: "Asiento contable inmediato", body: "Ejecución del pago, notificación a todos los participantes e indexación del recibo.", active: true, final: true },
];

/** The CSS custom properties this page's colors resolve to — scoped to .ls-scope only. */
const LS_VARS: Record<string, string> = {
  "--ls-primary": "#005c55",
  "--ls-primary-container": "#0f766e",
  "--ls-on-primary": "#ffffff",
  "--ls-on-primary-container": "#a3faef",
  "--ls-primary-fixed": "#9cf2e8",
  "--ls-primary-fixed-dim": "#80d5cb",
  "--ls-on-primary-fixed": "#00201d",
  "--ls-background": "#f8f9ff",
  "--ls-surface": "#f8f9ff",
  "--ls-surface-container-lowest": "#ffffff",
  "--ls-surface-container-low": "#eff4ff",
  "--ls-surface-container": "#e5eeff",
  "--ls-surface-container-high": "#dce9ff",
  "--ls-surface-container-highest": "#d3e4fe",
  "--ls-on-surface": "#0b1c30",
  "--ls-on-surface-variant": "#3e4947",
  "--ls-outline": "#6e7977",
  "--ls-outline-variant": "#bdc9c6",
  "--ls-secondary": "#4d616c",
  "--ls-secondary-container": "#d0e6f3",
  "--ls-on-secondary-fixed": "#091e27",
  "--ls-on-secondary-fixed-variant": "#364954",
  "--ls-tertiary-fixed": "#d7e6e1",
  "--ls-on-tertiary-fixed": "#111e1b",
  "--ls-on-tertiary-container": "#deede8",
  "--ls-inverse-surface": "#213145",
  "--ls-inverse-on-surface": "#eaf1ff",
};

function Pill({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[var(--ls-surface-container-high)] text-[var(--ls-on-surface-variant)] shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function Landing({ login }: { login: () => void }) {
  return (
    <div className="ls-scope flex flex-1 flex-col bg-[var(--ls-surface)] text-[var(--ls-on-surface)]" style={LS_VARS as React.CSSProperties}>
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[var(--ls-surface-container-lowest)]/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 max-w-[1280px] mx-auto px-4 lg:px-8 flex items-center justify-between gap-4">
          <a href="#" className="flex items-center gap-1.5">
            <span className="relative flex items-center justify-center w-7 h-7">
              <span className="absolute left-0 w-5 h-5 rounded-sm bg-[var(--ls-primary)] opacity-90" />
              <span className="absolute right-0 w-5 h-5 rounded-sm bg-[var(--ls-primary-container)] opacity-80 mix-blend-multiply" />
            </span>
            <span className="flex items-center gap-1.5">
              <span className={`${T.headlineSm} tracking-tight uppercase`}>CUOTITA</span>
              <span className={`${T.monoSm} px-1 py-0.5 rounded bg-[var(--ls-surface-container-high)] text-[var(--ls-on-surface-variant)] font-medium`}>SaaS</span>
            </span>
          </a>
          <nav className="hidden md:flex items-center gap-6">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className={`${T.labelMd} text-[var(--ls-on-surface-variant)] hover:text-[var(--ls-on-surface)] transition-colors`}>
                {n.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={login} className={`${T.labelMd} px-4 py-2 rounded-lg text-[var(--ls-on-surface-variant)] hover:bg-[var(--ls-surface-container-low)] hover:text-[var(--ls-on-surface)] transition-colors`}>
              Iniciar sesión
            </button>
            <button onClick={login} className={`${T.labelMd} px-4 py-2 rounded-lg bg-[var(--ls-primary)] text-[var(--ls-on-primary)] hover:bg-[var(--ls-primary-container)] transition-colors shadow-sm`}>
              Solicitar una demo
            </button>
          </div>
        </div>
      </header>

      <main className="w-full pt-16 bg-[var(--ls-surface)]">
        <div className="flex flex-col w-full">
          {/* Hero */}
          <section className="relative w-full overflow-hidden py-10 lg:py-20">
            <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[var(--ls-primary-fixed)] opacity-30 blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 -right-32 w-96 h-96 rounded-full bg-[var(--ls-secondary-container)] opacity-40 blur-3xl pointer-events-none" />
            <div className="max-w-[1280px] mx-auto px-4 lg:px-8 relative">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                <div className="lg:col-span-6 flex flex-col items-start gap-6">
                  <Pill>
                    <span className="w-2 h-2 rounded-full bg-[var(--ls-primary)] animate-pulse" />
                    <span className={`${T.monoSm} uppercase tracking-wider text-[var(--ls-primary)] font-medium`}>Infraestructura v2.4</span>
                    <span className="text-[var(--ls-outline-variant)]">•</span>
                    <span className={T.labelSm}>Gobernanza Financiera</span>
                  </Pill>
                  <h1 className={T.display}>
                    Los fondos colectivos merecen <span className="text-[var(--ls-primary)] italic">reglas claras.</span>
                  </h1>
                  <p className={`${T.bodyLg} text-[var(--ls-on-surface-variant)] max-w-xl`}>
                    Organiza aportaciones, decisiones y movimientos de dinero en un solo lugar. Cuotita te ayuda a gestionar fondos colectivos con estructura, control y transparencia comprobable.
                  </p>
                  <div className="flex flex-wrap items-center gap-3 pt-1 w-full sm:w-auto">
                    <button onClick={login} className={`${T.labelMd} px-6 py-3 rounded-lg bg-[var(--ls-primary)] text-[var(--ls-on-primary)] shadow-md hover:bg-[var(--ls-primary-container)] transition-all flex items-center justify-center gap-1.5 group`}>
                      <span>Solicitar una demo</span>
                      <Icon name="arrow_forward" className="text-[18px] group-hover:translate-x-0.5 transition-transform" />
                    </button>
                    <a href="#como-funciona" className={`${T.labelMd} px-6 py-3 rounded-lg bg-[var(--ls-surface-container-lowest)] text-[var(--ls-on-surface)] shadow-sm hover:bg-[var(--ls-surface-container-low)] transition-colors flex items-center justify-center gap-1.5`}>
                      <Icon name="play_circle" className="text-[18px] text-[var(--ls-primary)]" />
                      <span>Conocer cómo funciona</span>
                    </a>
                  </div>
                  <div className="flex items-center gap-1.5 pt-1 text-[var(--ls-on-surface-variant)]">
                    <Icon name="verified" className="text-[var(--ls-primary)] text-[18px]" />
                    <span className={T.bodySm}>Una nueva forma de gestionar dinero compartido. Sin descuadres, sin planillas dispersas.</span>
                  </div>
                </div>

                {/* Hero mockup */}
                <div className="lg:col-span-6 w-full">
                  <div className="relative w-full rounded-2xl bg-[var(--ls-surface-container-lowest)] shadow-xl p-4 lg:p-6 flex flex-col gap-4">
                    <div className="flex items-center justify-between p-2 rounded-xl bg-[var(--ls-surface-container-low)]/40">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg bg-[var(--ls-primary)] text-[var(--ls-on-primary)] flex items-center justify-center ${T.monoMd} font-bold`}>AG</div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5">
                            <span className={`${T.headlineSm} truncate`}>Asociación Gremial</span>
                            <Icon name="unfold_more" className="text-[var(--ls-outline)] text-[16px]" />
                          </div>
                          <span className={`${T.monoSm} text-[var(--ls-on-surface-variant)]`}>Fondo Solidario de Emergencia 2025</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-1 rounded-full bg-[var(--ls-secondary-container)] text-[var(--ls-on-secondary-fixed-variant)] ${T.labelSm}`}>Vista de ejemplo</span>
                        <span className="w-2.5 h-2.5 rounded-full bg-[var(--ls-primary-container)]" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="bg-[var(--ls-surface-container-low)] p-4 rounded-xl flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <span className={`${T.labelSm} uppercase tracking-wider font-semibold text-[var(--ls-on-surface-variant)]`}>Saldo Disponible</span>
                          <Icon name="account_balance_wallet" className="text-[var(--ls-primary)] text-[18px]" />
                        </div>
                        <div className="flex items-baseline gap-1.5">
                          <span className={`${T.monoLg} font-bold`}>14.850,00</span>
                          <span className={`${T.monoSm} text-[var(--ls-on-surface-variant)]`}>USD</span>
                        </div>
                        <div className={`flex items-center gap-1 text-[var(--ls-primary)] ${T.monoSm}`}>
                          <Icon name="trending_up" className="text-[14px]" />
                          <span>+2.400,00 USD este ciclo</span>
                        </div>
                      </div>
                      <div className="bg-[var(--ls-surface-container-low)] p-4 rounded-xl flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className={`${T.labelSm} uppercase tracking-wider font-semibold text-[var(--ls-on-surface-variant)]`}>Participantes Activos</span>
                            <Icon name="group" className="text-[var(--ls-secondary)] text-[18px]" />
                          </div>
                          <div className={`${T.headlineMd} mt-1`}>24 miembros</div>
                        </div>
                        <div className={`flex items-center justify-between pt-1 text-[var(--ls-on-surface-variant)] ${T.bodySm}`}>
                          <span>3 administradores</span>
                          <span className={`px-1 py-0.5 rounded bg-[var(--ls-surface-container)] ${T.monoSm}`}>Quórum 85%</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[var(--ls-surface-container)] p-4 rounded-xl flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded bg-[var(--ls-primary)] text-[var(--ls-on-primary)] ${T.monoSm} font-semibold`}>SOL-084</span>
                          <span className={`${T.labelMd} font-semibold`}>Compra de equipamiento común</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full bg-[var(--ls-primary-fixed)] text-[var(--ls-on-primary-fixed)] ${T.labelSm} font-medium`}>Aprobada (4/4 firmas)</span>
                      </div>
                      <div className={`flex items-center justify-between text-[var(--ls-on-surface-variant)] ${T.bodySm}`}>
                        <span>Desembolso autorizado por comité directivo</span>
                        <span className={`${T.monoMd} font-semibold text-[var(--ls-on-surface)]`}>1.820,00 USD</span>
                      </div>
                      <div className="w-full h-1.5 bg-[var(--ls-surface-container-highest)] rounded-full overflow-hidden mt-1">
                        <div className="h-full bg-[var(--ls-primary)] rounded-full w-full" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between px-1">
                        <span className={`${T.labelMd} font-semibold`}>Aportaciones Recientes</span>
                        <span className={`${T.labelSm} text-[var(--ls-primary)] hover:underline cursor-pointer`}>Ver todas</span>
                      </div>
                      <div className="flex flex-col divide-y divide-[var(--ls-surface-container-low)]">
                        {[
                          { initials: "MR", name: "Martín Ramos", meta: "Cuota Ordinaria • 12 Oct", amount: "150,00 USD", bg: "bg-[var(--ls-secondary-container)] text-[var(--ls-on-secondary-fixed)]" },
                          { initials: "CL", name: "Carolina Lucero", meta: "Fondo Auxilio • 11 Oct", amount: "200,00 USD", bg: "bg-[var(--ls-surface-container-high)] text-[var(--ls-on-surface)]" },
                          { initials: "DA", name: "Diego Albarrán", meta: "Cuota Ordinaria • 10 Oct", amount: "150,00 USD", bg: "bg-[var(--ls-tertiary-fixed)] text-[var(--ls-on-tertiary-fixed)]" },
                        ].map((row) => (
                          <div key={row.name} className="py-2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center ${T.labelSm} font-bold ${row.bg}`}>{row.initials}</div>
                              <div className="flex flex-col">
                                <span className={`${T.bodyMd} font-medium`}>{row.name}</span>
                                <span className={`${T.monoSm} text-[var(--ls-on-surface-variant)]`}>{row.meta}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`${T.monoMd} font-semibold`}>{row.amount}</span>
                              <span className={`px-1 py-0.5 rounded bg-[var(--ls-primary-fixed)] text-[var(--ls-on-primary-fixed)] ${T.labelSm}`}>Confirmado</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Propuesta de valor — 4 pilares */}
          <section className="w-full py-14 lg:py-20 bg-[var(--ls-surface-container-lowest)]">
            <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
              <div className="flex flex-col items-center text-center max-w-3xl mx-auto gap-2 mb-12">
                <span className={`${T.monoSm} uppercase tracking-wider text-[var(--ls-primary)] font-semibold`}>Arquitectura Financiera</span>
                <h2 className={`${T.headlineLg} tracking-tight`}>Todo lo que necesita un fondo colectivo, en un solo lugar.</h2>
                <p className={`${T.bodyLg} text-[var(--ls-on-surface-variant)]`}>
                  Deja atrás los registros dispersos, las hojas de cálculo y la administración manual. Centraliza la operación de tus fondos en una plataforma diseñada para organizar el dinero compartido.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {PILARES.map((p) => (
                  <div key={p.title} className="bg-[var(--ls-surface-container-low)] p-6 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow group">
                    <div className="flex flex-col gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[var(--ls-surface-container-lowest)] text-[var(--ls-primary)] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                        <Icon name={p.icon} className="text-[28px]" />
                      </div>
                      <h3 className={`${T.headlineSm} font-semibold`}>{p.title}</h3>
                      <p className={`${T.bodyMd} text-[var(--ls-on-surface-variant)]`}>{p.body}</p>
                    </div>
                    <div className={`mt-6 pt-2 flex items-center text-[var(--ls-primary)] ${T.labelSm} font-semibold`}>
                      <span>{p.tag}</span>
                      <Icon name="chevron_right" className="text-[16px] ml-1" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Cómo funciona */}
          <section id="como-funciona" className="scroll-mt-20 w-full py-14 lg:py-20">
            <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
              <div className="flex flex-col items-start max-w-2xl gap-1.5 mb-12">
                <span className={`${T.monoSm} uppercase tracking-wider text-[var(--ls-primary)] font-semibold`}>Flujo Operativo</span>
                <h2 className={`${T.headlineLg} tracking-tight`}>De la organización a la operación.</h2>
                <p className={`${T.bodyLg} text-[var(--ls-on-surface-variant)]`}>
                  Implementa tu fondo colectivo en minutos bajo un estándar corporativo transparente y auditable para cada participante.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-[var(--ls-surface-container-lowest)] rounded-2xl p-6 shadow-sm flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className={`${T.monoLg} font-bold text-[var(--ls-primary)]`}>01</span>
                    <Icon name="domain_add" className="text-[var(--ls-outline)] text-[22px]" />
                  </div>
                  <h3 className={`${T.headlineSm} font-semibold`}>Crea tu organización y tus fondos</h3>
                  <p className={`${T.bodyMd} text-[var(--ls-on-surface-variant)]`}>
                    Configura tu espacio de trabajo y organiza tus fondos según los objetivos de cada grupo o iniciativa comunitaria.
                  </p>
                  <div className="mt-2 p-2 bg-[var(--ls-surface-container-low)] rounded-xl flex flex-col gap-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium">Sub-fondo Sanitario</span>
                      <span className={`${T.monoSm} text-[var(--ls-primary)]`}>Activo</span>
                    </div>
                    <div className="w-full bg-[var(--ls-surface-container)] h-2 rounded-full overflow-hidden">
                      <div className="bg-[var(--ls-primary)] h-full w-3/4" />
                    </div>
                    <span className={`${T.monoSm} text-[var(--ls-on-surface-variant)]`}>Meta: 10.000 USD • Recaudado: 7.500 USD</span>
                  </div>
                </div>

                <div className="bg-[var(--ls-surface-container-lowest)] rounded-2xl p-6 shadow-sm flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className={`${T.monoLg} font-bold text-[var(--ls-primary)]`}>02</span>
                    <Icon name="tune" className="text-[var(--ls-outline)] text-[22px]" />
                  </div>
                  <h3 className={`${T.headlineSm} font-semibold`}>Define las reglas y los permisos</h3>
                  <p className={`${T.bodyMd} text-[var(--ls-on-surface-variant)]`}>
                    Establece aportaciones periódicas, integrantes autorizados, comités de desembolso y condiciones de aprobación.
                  </p>
                  <div className="mt-2 p-2 bg-[var(--ls-surface-container-low)] rounded-xl flex flex-col gap-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium">Condición de Desembolso</span>
                      <span className={`${T.monoSm} text-[var(--ls-on-surface-variant)]`}>Mayoría</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-[var(--ls-primary-fixed)] text-[var(--ls-primary)] flex items-center justify-center font-bold text-xs">✓</span>
                      <span className="w-5 h-5 rounded-full bg-[var(--ls-primary-fixed)] text-[var(--ls-primary)] flex items-center justify-center font-bold text-xs">✓</span>
                      <span className="w-5 h-5 rounded-full bg-[var(--ls-primary-fixed)] text-[var(--ls-primary)] flex items-center justify-center font-bold text-xs">✓</span>
                      <span className="w-5 h-5 rounded-full bg-[var(--ls-surface-container-high)] text-[var(--ls-on-surface-variant)] flex items-center justify-center font-bold text-xs">4</span>
                    </div>
                    <span className={`${T.monoSm} text-[var(--ls-on-surface-variant)]`}>Requiere 3 de 4 firmas de administradores</span>
                  </div>
                </div>

                <div className="bg-[var(--ls-surface-container-lowest)] rounded-2xl p-6 shadow-sm flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className={`${T.monoLg} font-bold text-[var(--ls-primary)]`}>03</span>
                    <Icon name="monitoring" className="text-[var(--ls-outline)] text-[22px]" />
                  </div>
                  <h3 className={`${T.headlineSm} font-semibold`}>Gestiona y supervisa las operaciones</h3>
                  <p className={`${T.bodyMd} text-[var(--ls-on-surface-variant)]`}>
                    Centraliza solicitudes, decisiones, desembolsos y movimientos en un mismo lugar con notificaciones inmediatas para el grupo.
                  </p>
                  <div className="mt-2 p-2 bg-[var(--ls-surface-container-low)] rounded-xl flex flex-col gap-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium">Desembolso Verificado</span>
                      <span className={`px-1 py-0.5 rounded bg-[var(--ls-primary)] text-[var(--ls-on-primary)] ${T.monoSm}`}>Completado</span>
                    </div>
                    <div className={`${T.monoSm}`}>Comprobante fiscal #8912 indexado</div>
                    <span className={`${T.monoSm} text-[var(--ls-on-surface-variant)]`}>Notificado a los 24 integrantes</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Funcionalidades — bento grid */}
          <section id="funcionalidades" className="scroll-mt-20 w-full py-14 lg:py-20 bg-[var(--ls-surface-container-lowest)]">
            <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
              <div className="flex flex-col items-center text-center max-w-3xl mx-auto gap-1.5 mb-12">
                <span className={`${T.monoSm} uppercase tracking-wider text-[var(--ls-primary)] font-semibold`}>Capacidades del Sistema</span>
                <h2 className={`${T.headlineLg} tracking-tight`}>Una plataforma. Múltiples posibilidades.</h2>
                <p className={`${T.bodyLg} text-[var(--ls-on-surface-variant)]`}>
                  Estructura de nivel institucional para fondos independientes. Cada módulo ha sido concebido para eliminar la fricción humana y los errores operativos.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-7 bg-[var(--ls-surface-container-low)] rounded-2xl p-6 flex flex-col justify-between shadow-sm">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className={`${T.monoSm} text-[var(--ls-primary)] uppercase font-semibold`}>01 • Estructura</span>
                      <Icon name="account_tree" className="text-[var(--ls-outline)]" />
                    </div>
                    <h3 className={T.headlineMd}>Organizaciones y sub-fondos</h3>
                    <p className={`${T.bodyMd} text-[var(--ls-on-surface-variant)] max-w-md`}>
                      Divide el capital colectivo en múltiples cuentas programáticas o presupuestos aislados sin perder la consola central de supervisión.
                    </p>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div className="bg-[var(--ls-surface-container-lowest)] p-2 rounded-xl">
                      <div className={`${T.labelSm} text-[var(--ls-on-surface-variant)]`}>Fondo Operativo</div>
                      <div className={`${T.monoMd} font-semibold mt-1`}>8.200,00 USD</div>
                      <div className={`${T.labelSm} text-[var(--ls-primary)] mt-1 font-medium`}>Asignado 100%</div>
                    </div>
                    <div className="bg-[var(--ls-surface-container-lowest)] p-2 rounded-xl">
                      <div className={`${T.labelSm} text-[var(--ls-on-surface-variant)]`}>Reserva Médica</div>
                      <div className={`${T.monoMd} font-semibold mt-1`}>6.650,00 USD</div>
                      <div className={`${T.labelSm} text-[var(--ls-primary)] mt-1 font-medium`}>En crecimiento</div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-5 bg-[var(--ls-surface-container-low)] rounded-2xl p-6 flex flex-col justify-between shadow-sm">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className={`${T.monoSm} text-[var(--ls-primary)] uppercase font-semibold`}>02 • Gobernanza</span>
                      <Icon name="badge" className="text-[var(--ls-outline)]" />
                    </div>
                    <h3 className={T.headlineMd}>Gestión de miembros y roles</h3>
                    <p className={`${T.bodyMd} text-[var(--ls-on-surface-variant)]`}>
                      Segmenta funciones entre administradores, tesoreros, delegados de mesa y socios contribuyentes con permisos granulares.
                    </p>
                  </div>
                  <div className="mt-4 flex flex-col gap-1">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--ls-surface-container-lowest)]">
                      <span className={`${T.bodySm} font-medium`}>Tesorero General</span>
                      <span className={`px-2 py-0.5 rounded bg-[var(--ls-secondary-container)] text-[var(--ls-on-secondary-fixed)] ${T.monoSm}`}>Firma A</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--ls-surface-container-lowest)]">
                      <span className={`${T.bodySm} font-medium`}>Comité Fiscalizador</span>
                      <span className={`px-2 py-0.5 rounded bg-[var(--ls-surface-container-high)] text-[var(--ls-on-surface-variant)] ${T.monoSm}`}>Auditor</span>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-4 bg-[var(--ls-surface-container-low)] rounded-2xl p-6 flex flex-col justify-between shadow-sm">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className={`${T.monoSm} text-[var(--ls-primary)] uppercase font-semibold`}>03 • Conciliación</span>
                      <Icon name="event_available" className="text-[var(--ls-outline)]" />
                    </div>
                    <h3 className={`${T.headlineSm} font-semibold`}>Calendario y Aportaciones</h3>
                    <p className={`${T.bodyMd} text-[var(--ls-on-surface-variant)]`}>
                      Calendario inteligente de cuotas periódicas, registro individual y confirmación inmediata de transferencias bancarias.
                    </p>
                  </div>
                  <div className="mt-4 bg-[var(--ls-surface-container-lowest)] p-2 rounded-xl">
                    <div className={`flex justify-between items-center ${T.labelSm} font-medium`}>
                      <span>Cuota mensual: 150 USD</span>
                      <span className="text-[var(--ls-primary)] font-bold">22/24 al día</span>
                    </div>
                    <div className="w-full bg-[var(--ls-surface-container-high)] h-2 rounded-full overflow-hidden mt-2">
                      <div className="bg-[var(--ls-primary)] h-full w-[91%]" />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-4 bg-[var(--ls-surface-container-low)] rounded-2xl p-6 flex flex-col justify-between shadow-sm">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className={`${T.monoSm} text-[var(--ls-primary)] uppercase font-semibold`}>04 • Democracia</span>
                      <Icon name="how_to_vote" className="text-[var(--ls-outline)]" />
                    </div>
                    <h3 className={`${T.headlineSm} font-semibold`}>Reglas y Votaciones</h3>
                    <p className={`${T.bodyMd} text-[var(--ls-on-surface-variant)]`}>
                      Parametriza quórums y votaciones vinculantes para aprobar iniciativas o cambios estatutarios con total validez.
                    </p>
                  </div>
                  <div className="mt-4 bg-[var(--ls-surface-container-lowest)] p-2 rounded-xl flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className={`${T.labelSm} font-medium`}>Modificación de Cuota</span>
                      <span className={`${T.monoSm} text-[var(--ls-primary)]`}>Aprobado 88%</span>
                    </div>
                    <span className={`px-1 py-1 rounded bg-[var(--ls-primary-fixed)] text-[var(--ls-on-primary-fixed)] ${T.monoSm} font-bold`}>3/3 Firmas</span>
                  </div>
                </div>

                <div className="md:col-span-4 bg-[var(--ls-surface-container-low)] rounded-2xl p-6 flex flex-col justify-between shadow-sm">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className={`${T.monoSm} text-[var(--ls-primary)] uppercase font-semibold`}>05 • Egresos</span>
                      <Icon name="receipt_long" className="text-[var(--ls-outline)]" />
                    </div>
                    <h3 className={`${T.headlineSm} font-semibold`}>Solicitudes y Desembolsos</h3>
                    <p className={`${T.bodyMd} text-[var(--ls-on-surface-variant)]`}>
                      Flujo formal de requerimiento con carga obligatoria de facturas o cotizaciones antes de habilitar el pago final.
                    </p>
                  </div>
                  <div className="mt-4 bg-[var(--ls-surface-container-lowest)] p-2 rounded-xl flex items-center gap-2">
                    <Icon name="description" className="text-[var(--ls-primary)] text-[24px]" />
                    <div className="flex flex-col">
                      <span className={`${T.bodySm} font-medium`}>Factura_Equip_102.pdf</span>
                      <span className={`${T.monoSm} text-[var(--ls-on-surface-variant)]`}>Validada por tesorería</span>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-12 bg-[var(--ls-surface-container-high)] rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                  <div className="flex flex-col gap-1 max-w-xl">
                    <div className="flex items-center gap-1.5">
                      <span className={`${T.monoSm} text-[var(--ls-primary)] uppercase font-semibold`}>06 • Auditoría</span>
                      <span className="text-[var(--ls-outline-variant)]">•</span>
                      <span className={`${T.labelSm} text-[var(--ls-on-surface-variant)]`}>Exportación contable inmediata</span>
                    </div>
                    <h3 className={T.headlineMd}>Historial inmutable y reportes listos para asamblea</h3>
                    <p className={`${T.bodyMd} text-[var(--ls-on-surface-variant)]`}>
                      Genera balances de ingresos y egresos, estados de cuenta por miembro y actas de acuerdos en formatos normalizados con un solo clic.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className={`px-4 py-2.5 rounded-lg bg-[var(--ls-surface-container-lowest)] ${T.labelMd} flex items-center gap-1.5 shadow-sm`}>
                      <Icon name="download" className="text-[18px] text-[var(--ls-primary)]" />
                      <span>Descargar Balance CSV</span>
                    </div>
                    <div className={`px-4 py-2.5 rounded-lg bg-[var(--ls-primary)] text-[var(--ls-on-primary)] ${T.labelMd} flex items-center gap-1.5 shadow-sm`}>
                      <Icon name="print" className="text-[18px]" />
                      <span>Acta de Cierre PDF</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Casos de uso */}
          <section id="casos-de-uso" className="scroll-mt-20 w-full py-14 lg:py-20">
            <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
              <div className="flex flex-col items-start max-w-3xl gap-1.5 mb-12">
                <span className={`${T.monoSm} uppercase tracking-wider text-[var(--ls-primary)] font-semibold`}>Arquitectura Paramétrica</span>
                <h2 className={`${T.headlineLg} tracking-tight`}>Un sistema que se adapta a cada fondo.</h2>
                <p className={`${T.bodyLg} text-[var(--ls-on-surface-variant)]`}>
                  No todos los fondos colectivos funcionan igual. Cuotita permite configurar distintas reglas y modalidades desde una misma infraestructura tecnológica robusta.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {CASOS.map((c) => (
                  <div key={c.title} className="bg-[var(--ls-surface-container-lowest)] rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[var(--ls-surface-container)] text-[var(--ls-primary)] flex items-center justify-center">
                        <Icon name={c.icon} className="text-[24px]" />
                      </div>
                      <h3 className={`${T.headlineSm} font-semibold`}>{c.title}</h3>
                      <p className={`${T.bodyMd} text-[var(--ls-on-surface-variant)]`}>{c.body}</p>
                    </div>
                    <div className="mt-6 pt-2 bg-[var(--ls-surface-container-low)] p-1.5 rounded-lg">
                      <span className={`${T.monoSm} text-[var(--ls-on-surface-variant)]`}>{c.rule}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Gobernanza + pipeline */}
          <section id="transparencia" className="scroll-mt-20 w-full py-14 lg:py-20 bg-[var(--ls-surface-container-lowest)]">
            <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                <div className="lg:col-span-5 flex flex-col gap-4">
                  <span className={`${T.monoSm} uppercase tracking-wider text-[var(--ls-primary)] font-semibold`}>Gobernanza Rigurosa</span>
                  <h2 className={`${T.headlineLg} tracking-tight`}>Las reglas deben estar claras antes de mover el dinero.</h2>
                  <p className={`${T.bodyLg} text-[var(--ls-on-surface-variant)]`}>
                    Cada fondo necesita responsabilidades definidas, operaciones ordenadas y un historial que permita comprender qué sucede con los recursos compartidos.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    {[
                      { icon: "lock_person", title: "Permisos definidos", body: "Nadie actúa fuera de sus facultades." },
                      { icon: "rule", title: "Reglas configurables", body: "Límites y quórums por estatuto." },
                      { icon: "history_edu", title: "Registro de actividad", body: "Trazabilidad inmutable por usuario." },
                      { icon: "verified_user", title: "Movimientos verificables", body: "Comprobantes anexados a cada egreso." },
                    ].map((f) => (
                      <div key={f.title} className="flex items-start gap-1.5">
                        <Icon name={f.icon} className="text-[var(--ls-primary)] text-[20px] shrink-0 mt-0.5" />
                        <div>
                          <h4 className={`${T.labelMd} font-semibold`}>{f.title}</h4>
                          <p className={`${T.bodySm} text-[var(--ls-on-surface-variant)]`}>{f.body}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-7 bg-[var(--ls-surface-container-low)] rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between pb-4">
                    <span className={`${T.labelMd} font-semibold`}>Ciclo de Vida de una Operación</span>
                    <span className={`${T.monoSm} text-[var(--ls-on-surface-variant)]`}>Flujo Estándar Cuotita</span>
                  </div>
                  <div className="flex flex-col gap-4">
                    {PIPELINE.map((step, i) => (
                      <div key={step.n}>
                        <div className="flex items-center gap-4 bg-[var(--ls-surface-container-lowest)] p-4 rounded-xl">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${T.monoSm} font-bold shrink-0 ${
                              step.final
                                ? "bg-[var(--ls-primary)] text-[var(--ls-on-primary)]"
                                : step.active
                                ? "bg-[var(--ls-primary-fixed)] text-[var(--ls-on-primary-fixed)]"
                                : "bg-[var(--ls-surface-container-high)] text-[var(--ls-on-surface)]"
                            }`}
                          >
                            {step.n}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h5 className={`${T.labelMd} font-semibold`}>{step.title}</h5>
                              <span className={`${T.monoSm} ${step.active ? "text-[var(--ls-primary)] font-medium" : "text-[var(--ls-on-surface-variant)]"}`}>{step.meta}</span>
                            </div>
                            <p className={`${T.bodySm} text-[var(--ls-on-surface-variant)]`}>{step.body}</p>
                          </div>
                        </div>
                        {i < PIPELINE.length - 1 && (
                          <div className="flex justify-center -my-2 text-[var(--ls-outline-variant)]">
                            <Icon name="south" className="text-[20px]" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA final */}
          <section className="w-full py-14 lg:py-20">
            <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
              <div className="relative overflow-hidden rounded-3xl bg-[var(--ls-inverse-surface)] text-[var(--ls-inverse-on-surface)] p-8 lg:p-16 shadow-xl">
                <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[var(--ls-primary-container)] opacity-30 blur-3xl pointer-events-none" />
                <div className="absolute left-10 -top-20 w-60 h-60 rounded-full bg-[var(--ls-primary-fixed-dim)] opacity-20 blur-2xl pointer-events-none" />
                <div className="relative z-10 max-w-2xl flex flex-col items-start gap-4">
                  <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-[var(--ls-surface-container-lowest)]/10 backdrop-blur text-[var(--ls-primary-fixed)]">
                    <Icon name="security" className="text-[16px]" />
                    <span className={T.labelSm}>Control fiscal y orden administrativo</span>
                  </div>
                  <h2 className={`${T.headlineLg} tracking-tight`}>Administra tus fondos con más claridad y control.</h2>
                  <p className={`${T.bodyLg} text-[var(--ls-on-tertiary-container)]`}>
                    Conoce una forma más organizada y transparente de gestionar el dinero compartido. Implementa Cuotita en tu gremio, colectivo o asociación hoy mismo.
                  </p>
                  <div className="flex flex-wrap items-center gap-3 pt-2 w-full sm:w-auto">
                    <button onClick={login} className={`${T.labelMd} px-8 py-3.5 rounded-lg bg-[var(--ls-primary)] text-[var(--ls-on-primary)] font-semibold hover:bg-[var(--ls-primary-container)] shadow-md transition-all flex items-center justify-center gap-1.5 group`}>
                      <span>Solicitar una demo</span>
                      <Icon name="arrow_forward" className="text-[18px] group-hover:translate-x-1 transition-transform" />
                    </button>
                    <a href="#como-funciona" className={`${T.labelMd} px-6 py-3.5 rounded-lg bg-[var(--ls-surface-container-lowest)]/10 hover:bg-[var(--ls-surface-container-lowest)]/20 transition-colors flex items-center justify-center`}>
                      <span>Hablar con un asesor</span>
                    </a>
                  </div>
                  <div className={`flex flex-wrap items-center gap-6 pt-4 text-[var(--ls-on-tertiary-container)] ${T.bodySm}`}>
                    {["Sin costos de instalación inicial", "Cumplimiento documental estándar", "Soporte prioritario para tesorerías"].map((t) => (
                      <div key={t} className="flex items-center gap-1.5">
                        <Icon name="check_circle" className="text-[18px] text-[var(--ls-primary-fixed)]" />
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[var(--ls-surface-container-lowest)] shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-6">
            <div className="md:col-span-5 flex flex-col items-start gap-4">
              <div className="flex items-center gap-1.5">
                <span className="relative flex items-center justify-center w-6 h-6">
                  <span className="absolute left-0 w-4 h-4 rounded-sm bg-[var(--ls-primary)] opacity-90" />
                  <span className="absolute right-0 w-4 h-4 rounded-sm bg-[var(--ls-primary-container)] opacity-80 mix-blend-multiply" />
                </span>
                <span className={`${T.headlineSm} tracking-tight uppercase`}>CUOTITA</span>
              </div>
              <p className={`${T.bodyMd} text-[var(--ls-on-surface-variant)] max-w-sm`}>
                Infraestructura digital para crear, administrar y supervisar fondos colectivos con transparencia y reglas claras.
              </p>
              <span className={`${T.bodySm} text-[var(--ls-on-surface-variant)]`}>© {new Date().getFullYear()} Cuotita. Todos los derechos reservados.</span>
            </div>
            <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6">
              <div className="flex flex-col gap-2">
                <span className={`${T.labelMd} font-semibold`}>Producto</span>
                <nav className="flex flex-col gap-1.5">
                  {NAV.slice(0, 2).map((n) => (
                    <a key={n.href} href={n.href} className={`${T.bodySm} text-[var(--ls-on-surface-variant)] hover:text-[var(--ls-on-surface)] transition-colors`}>{n.label}</a>
                  ))}
                </nav>
              </div>
              <div className="flex flex-col gap-2">
                <span className={`${T.labelMd} font-semibold`}>Gobernanza</span>
                <nav className="flex flex-col gap-1.5">
                  <a href="#transparencia" className={`${T.bodySm} text-[var(--ls-on-surface-variant)] hover:text-[var(--ls-on-surface)] transition-colors`}>Transparencia</a>
                  <a href="#casos-de-uso" className={`${T.bodySm} text-[var(--ls-on-surface-variant)] hover:text-[var(--ls-on-surface)] transition-colors`}>Casos de uso</a>
                </nav>
              </div>
              <div className="flex flex-col gap-2">
                <span className={`${T.labelMd} font-semibold`}>Código abierto</span>
                <a
                  href="https://github.com/Alan021011/cuotita"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${T.bodySm} text-[var(--ls-on-surface-variant)] hover:text-[var(--ls-on-surface)] transition-colors`}
                >
                  github.com/Alan021011/cuotita
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
