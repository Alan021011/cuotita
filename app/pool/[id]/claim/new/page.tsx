"use client";

import { useEffect, useState, use } from "react";
import { useRouter, notFound } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { PhotoInput } from "@/components/PhotoInput";
import { LoginButton } from "@/components/LoginButton";
import { usePollarAuth } from "@/hooks/usePollarAuth";
import { useAuthProof } from "@/hooks/useAuthProof";
import { POOL_AUTH_HEADER } from "@/lib/server-auth";
import { PollarLogo } from "@/components/ui/PollarLogo";

const CATEGORIES: { value: string; label: string }[] = [
  { value: "pantalla", label: "Pantalla de celular" },
  { value: "freno", label: "Freno / embrague" },
  { value: "retrovisor", label: "Retrovisor / plásticos" },
  { value: "llanta", label: "Llanta / aro" },
  { value: "otro", label: "Otro daño material" },
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

  if (isLoading) return <div className="p-10 text-center">Cargando...</div>;
  if (!pool) return <div className="p-10 text-center text-error">Error al cargar el fondo</div>;

  if (done) {
    return (
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-4 py-8 lg:max-w-lg lg:py-12">
        <Card className="p-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Reclamo enviado</h1>
          <p className="text-muted mb-6">
            Los delegados de {pool.name} revisarán tu solicitud. Te avisamos cuando se apruebe.
          </p>
          <Button onClick={() => router.push(`/pool/${pool.id}/claims`)} className="w-full py-3">
            Ver estado de reclamos
          </Button>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-4 py-8 pb-24 lg:max-w-lg lg:py-12">
      <header className="flex items-center justify-between gap-3 pb-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <PollarLogo size={30} />
          <h1 className="text-xl font-bold tracking-tight truncate">Reportar auxilio</h1>
        </div>
        <LoginButton />
      </header>

      <Card>
        <h2 className="text-lg font-bold mb-1">{pool.name}</h2>
        <p className="text-sm text-muted mb-6">
          Cuéntanos qué se rompió. Los delegados revisan la foto y aprueban el pago del fondo.
        </p>

        {!authLoading && !user ? (
          <div className="flex flex-col items-center py-6">
            <p className="text-sm text-muted mb-4 text-center">Inicia sesión para reportar un daño.</p>
            <LoginButton />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Tipo de daño</label>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setCategory(c.value)}
                    className={`text-sm rounded-xl border px-3 py-2.5 text-left transition-colors ${
                      category === c.value
                        ? "border-primary bg-primary-light text-primary font-semibold"
                        : "border-border text-foreground hover:bg-surface"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <Input
              label="Presupuesto en Bolivianos (referencia)"
              type="number"
              min="0"
              step="1"
              placeholder="250"
              value={amountBs}
              onChange={(e) => setAmountBs(e.target.value)}
            />

            <Input
              label="Monto a solicitar en USDC"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="10.00"
              value={amountUsdc}
              onChange={(e) => setAmountUsdc(e.target.value)}
            />

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Descripción (opcional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Qué pasó y dónde"
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-light focus:outline-none focus:ring-2 focus:border-primary focus:ring-primary/25"
              />
            </div>

            <PhotoInput label="Foto del daño" value={photoDataUrl} onChange={setPhotoDataUrl} required />
            <PhotoInput label="Foto de la cotización (opcional)" value={quoteDataUrl} onChange={setQuoteDataUrl} />

            {error && (
              <p className="rounded-xl border border-error-border bg-error-light px-3 py-2 text-sm text-error">
                {error}
              </p>
            )}

            <Button onClick={handleSubmit} loading={isSubmitting} className="w-full py-3">
              Enviar reclamo
            </Button>
          </div>
        )}
      </Card>
    </main>
  );
}
