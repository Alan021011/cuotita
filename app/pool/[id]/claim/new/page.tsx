"use client";

import { useEffect, useState, use } from "react";
import { useRouter, notFound } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Spinner } from "@/components/ui/Spinner";
import { PhotoInput } from "@/components/PhotoInput";
import { LoginButton } from "@/components/LoginButton";
import { BottomNav } from "@/components/BottomNav";
import { AppHeader, AppShell } from "@/components/AppHeader";
import { usePollarAuth } from "@/hooks/usePollarAuth";
import { useAuthProof } from "@/hooks/useAuthProof";
import { useRampRate } from "@/hooks/useRampRate";
import { POOL_AUTH_HEADER } from "@/lib/server-auth";
import { CLAIM_QUORUM } from "@/lib/constants";

const CATEGORIES: { value: string; label: string; icon: string }[] = [
  { value: "pantalla", label: "Pantalla de celular", icon: "smartphone" },
  { value: "freno", label: "Freno / embrague", icon: "build_circle" },
  { value: "retrovisor", label: "Retrovisor / plásticos", icon: "flip" },
  { value: "llanta", label: "Llanta / aro", icon: "tire_repair" },
  { value: "otro", label: "Otro daño material", icon: "more_horiz" },
];

type PoolResponse = { id: string; name: string; status: string };

export default function NewClaimPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user, isLoading: authLoading } = usePollarAuth();
  const getAuthProof = useAuthProof();

  const [pool, setPool] = useState<PoolResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [category, setCategory] = useState("");
  const [amountBs, setAmountBs] = useState("");
  const [amountUsdc, setAmountUsdc] = useState("");
  const [description, setDescription] = useState("");
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [quoteDataUrl, setQuoteDataUrl] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  // Today's Bs-per-USDC rate, to suggest the USDC amount from the Bs quote.
  const rate = useRampRate(!!user);
  const bsPerUsdc = rate.step === "ready" ? (rate.buy?.rate ?? rate.sell?.rate ?? null) : null;

  function handleBsChange(value: string) {
    setAmountBs(value);
    if (bsPerUsdc && Number(value) > 0) setAmountUsdc((Number(value) / bsPerUsdc).toFixed(2));
  }

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
      .catch(() => setIsLoading(false));
  }, [id]);

  async function handleSubmit() {
    if (!user) return;
    setError(null);

    if (!category) return setError("Elige el tipo de daño.");
    if (!amountUsdc || Number(amountUsdc) <= 0) return setError("Ingresa el monto solicitado en USDC.");
    if (!photoDataUrl) return setError("Adjunta una foto del daño.");

    setIsSubmitting(true);
    try {
      const proof = await getAuthProof(user.address);
      const res = await fetch(`/api/pools/${id}/claims`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          [POOL_AUTH_HEADER]: proof,
        },
        body: JSON.stringify({
          requesterName: user.profile?.first_name || null,
          category,
          amountBs: amountBs || null,
          amountUsdc,
          photoDataUrl,
          quoteDataUrl,
          description,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo enviar el reclamo");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center gap-3 p-10 text-muted">
        <Spinner /> Cargando…
      </div>
    );
  }
  if (!pool) return <div className="p-10 text-center text-error">Error al cargar el fondo</div>;

  if (done) {
    return (
      <>
        <AppHeader />
        <AppShell>
          <Card highlight className="flex flex-col items-center p-8 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-success-border bg-success-light text-success">
              <Icon name="check" className="text-4xl" />
            </div>
            <h1 className="mb-2 font-display text-4xl text-foreground">Reclamo enviado</h1>
            <p className="mb-6 text-sm text-muted">
              Los delegados de {pool.name} revisarán tu solicitud. Se necesitan {CLAIM_QUORUM} aprobaciones para el pago.
            </p>
            <Button onClick={() => router.push(`/pool/${pool.id}/claims`)} className="h-12 w-full">
              Ver estado de reclamos
            </Button>
          </Card>
        </AppShell>
        <BottomNav />
      </>
    );
  }

  return (
    <>
      <AppHeader backHref={`/pool/${pool.id}`} backLabel={pool.name} />
      <AppShell>
        <div className="space-y-1.5">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-error/40 bg-error-light px-2.5 py-1 text-[11px] font-medium text-error">
            <Icon name="emergency" className="text-sm" />
            Reclamo de auxilio
          </span>
          <h1 className="pt-1 font-display text-5xl leading-none tracking-wide text-foreground">Reportar un daño</h1>
          <p className="flex items-center gap-1 text-sm text-muted">
            <Icon name="shield" className="text-base text-primary" />
            {pool.name}
          </p>
        </div>

        {!authLoading && !user ? (
          <Card className="flex flex-col items-center gap-4 py-8 text-center">
            <p className="text-sm text-muted">Inicia sesión para reportar un daño.</p>
            <LoginButton />
          </Card>
        ) : (
          <div className="flex flex-col gap-5">
            <div>
              <span className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-muted">Tipo de daño</span>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map((c) => {
                  const selected = category === c.value;
                  return (
                    <button
                      key={c.value}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setCategory(c.value)}
                      className={`relative flex items-center gap-2.5 rounded-xl border px-3 py-3 text-left text-sm transition-all ${
                        selected
                          ? "border-primary bg-surface-raised font-semibold text-foreground shadow-[0_0_16px_-4px_rgb(245_158_11/0.4)]"
                          : "border-border bg-surface text-foreground hover:border-primary/40"
                      } ${c.value === "otro" ? "col-span-2" : ""}`}
                    >
                      <Icon name={c.icon} className={`text-xl ${selected ? "text-primary" : "text-muted"}`} />
                      <span className="pr-4 leading-tight">{c.label}</span>
                      {selected && <Icon name="check_circle" filled className="absolute right-2 top-2 text-base text-primary" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-2 rounded-2xl border border-border bg-surface p-4">
              <Input
                label="Presupuesto en Bolivianos (referencia)"
                type="number"
                min="0"
                step="1"
                placeholder="250"
                value={amountBs}
                onChange={(e) => handleBsChange(e.target.value)}
                className="font-mono"
              />
              <div className="flex items-center justify-center gap-2 py-1 font-mono text-[11px] text-muted">
                <Icon name="south" className="text-base text-primary" />
                {bsPerUsdc ? `1 USDC ≈ Bs ${bsPerUsdc.toFixed(2)} hoy` : "Convierte tu presupuesto a USDC"}
              </div>
              <Input
                label="Monto a solicitar en USDC"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="10.00"
                value={amountUsdc}
                onChange={(e) => setAmountUsdc(e.target.value)}
                className="border-primary/50 font-mono text-lg font-bold text-primary"
              />
            </div>

            <PhotoInput
              label="Foto del daño"
              value={photoDataUrl}
              onChange={setPhotoDataUrl}
              required
              hint="Una foto clara del repuesto roto o el daño visible."
            />
            <PhotoInput
              label="Foto de la cotización (opcional)"
              value={quoteDataUrl}
              onChange={setQuoteDataUrl}
              size="sm"
              icon="receipt_long"
              hint="Proforma o cotización del taller."
            />

            <div className="flex flex-col gap-1.5">
              <label htmlFor="claim-description" className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                Descripción <span className="normal-case tracking-normal text-muted-light">(opcional)</span>
              </label>
              <textarea
                id="claim-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Qué pasó y dónde"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-border bg-surface-raised p-3.5">
              <Icon name="how_to_vote" className="mt-0.5 text-xl text-primary" />
              <p className="text-xs leading-snug text-muted">
                <span className="font-bold text-foreground">{CLAIM_QUORUM} delegados</span> de tu parada deben aprobar tu reclamo antes de que el organizador te pague.
              </p>
            </div>

            {error && (
              <p className="rounded-xl border border-error-border bg-error-light px-3 py-2 text-sm text-error">{error}</p>
            )}

            <Button onClick={handleSubmit} loading={isSubmitting} className="h-12 w-full text-base uppercase tracking-wider">
              {!isSubmitting && <Icon name="send" className="text-xl" />}
              Enviar reclamo
            </Button>
          </div>
        )}
      </AppShell>
      <BottomNav />
    </>
  );
}
