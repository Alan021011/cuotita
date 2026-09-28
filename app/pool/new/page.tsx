"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePollarAuth } from '@/hooks/usePollarAuth';
import { useRampRate } from '@/hooks/useRampRate';
import { LoginButton } from '@/components/LoginButton';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Icon } from '@/components/ui/Icon';
import { Spinner } from '@/components/ui/Spinner';
import { usePollar } from '@pollar/react';
import { buildSessionMessage, POOL_AUTH_HEADER } from '@/lib/server-auth';
import { BottomNav } from '@/components/BottomNav';
import { AppHeader, AppShell } from '@/components/AppHeader';

export default function NewPoolPage() {
  const { user, isLoading } = usePollarAuth();
  const { getClient } = usePollar();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deadlineError, setDeadlineError] = useState<string | null>(null);
  const [goal, setGoal] = useState('');
  const rate = useRampRate(!!user);
  const buyRate = rate.step === 'ready' ? (rate.buy?.rate ?? rate.sell?.rate ?? null) : null;

  function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    if (val) {
      const parsedDeadline = new Date(val);
      if (parsedDeadline.getTime() < Date.now()) {
        setDeadlineError('La fecha debe ser mayor a la actual');
      } else {
        setDeadlineError(null);
      }
    } else {
      setDeadlineError(null);
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center gap-3 p-10 text-muted">
        <Spinner /> Cargando…
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <AppHeader backHref="/" />
        <AppShell className="items-center justify-center text-center">
          <Icon name="group_add" className="text-5xl text-primary" />
          <h1 className="font-display text-5xl leading-none text-foreground">
            Crea el fondo
            <span className="block text-primary">de tu parada</span>
          </h1>
          <p className="max-w-xs text-sm text-muted">Inicia sesión con Pollar para crear un fondo.</p>
          <LoginButton />
        </AppShell>
      </>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const goalAmount = formData.get('goalAmount') as string;
    const deadline = formData.get('deadline') as string;

    try {
      if (deadlineError) {
        setIsSubmitting(false);
        return;
      }

      if (deadline) {
        const parsedDeadline = new Date(deadline);
        if (parsedDeadline.getTime() < Date.now()) {
          setDeadlineError('La fecha debe ser mayor a la actual');
          setIsSubmitting(false);
          return;
        }
      }

      const client = getClient();
      let serverTime = Date.now();
      try {
        const timeRes = await fetch('/api/time');
        if (timeRes.ok) {
          const { time } = await timeRes.json();
          serverTime = time;
        }
      } catch (e) {
        console.warn('No se pudo obtener la hora del servidor', e);
      }

      const offset = serverTime - Date.now();
      const exp = Date.now() + offset + 10 * 60 * 1000;
      const message = buildSessionMessage(user!.address, exp);

      const proof = await client.stellar.sep53.signMessage(message);
      if (proof.status !== 'signed') {
        throw new Error(proof.details || 'Firma cancelada o fallida');
      }

      const res = await fetch('/api/pools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          [POOL_AUTH_HEADER]: JSON.stringify({
            address: user!.address,
            exp,
            signature: proof.signature
          })
        },
        body: JSON.stringify({
          name,
          description,
          goalAmount,
          deadline: deadline ? new Date(deadline).toISOString() : undefined,
          organizerAddress: user!.address,
          organizerUserId: user!.address,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.error || 'No se pudo crear el fondo');
        setIsSubmitting(false);
        return;
      }

      const pool = await res.json();
      router.push(`/pool/${pool.id}`);
    } catch (err) {
      console.error(err);
      alert('Ocurrió un error');
      setIsSubmitting(false);
    }
  }

  const goalBs = buyRate !== null && Number(goal) > 0 ? Number(goal) * buyRate : null;

  return (
    <>
      <AppHeader backHref="/" backLabel="Inicio" />
      <AppShell>
        <div className="space-y-1.5">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-raised px-2.5 py-1 text-[11px] font-medium text-primary">
            <Icon name="handshake" className="text-sm" />
            Fondo de auxilio mutuo
          </span>
          <h1 className="pt-1 font-display text-5xl leading-none tracking-wide text-foreground">
            Crea el fondo de tu parada
          </h1>
          <p className="text-sm leading-relaxed text-muted">
            Tus compañeros aportan, los delegados aprueban, el fondo paga.
          </p>
        </div>

        <div className="road-dash w-full" />

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input id="name" name="name" label="Nombre del fondo *" required placeholder="Fondo de la parada" />

          <div className="flex flex-col gap-1.5">
            <label htmlFor="description" className="text-[11px] font-semibold uppercase tracking-wider text-muted">
              ¿Para qué es este fondo? <span className="normal-case tracking-normal text-muted-light">(opcional)</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              placeholder="Ej. Repuestos de urgencia para los repartidores de la parada."
              className="w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <Input
            id="goalAmount"
            name="goalAmount"
            label="Meta (USDC) *"
            type="number"
            step="0.01"
            min="0.01"
            required
            placeholder="100.00"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="font-mono text-lg font-bold"
            hint={goalBs !== null ? `≈ Bs ${goalBs.toFixed(2)} al cambio de hoy` : undefined}
          />

          <Input
            id="deadline"
            name="deadline"
            label="Fecha límite (opcional)"
            type="datetime-local"
            onChange={handleDateChange}
            error={deadlineError ?? undefined}
          />

          <div className="flex items-start gap-3 rounded-xl border border-primary/40 bg-primary/10 p-3.5">
            <div className="mt-0.5 shrink-0 rounded-lg bg-primary/20 p-2 text-primary">
              <Icon name="shield" className="text-xl" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wide text-primary">Tú custodias el fondo</h4>
              <p className="text-xs leading-snug text-foreground">
                Los aportes llegan a tu wallet Pollar. Tú pagas los reclamos que aprueben los delegados de la parada.
              </p>
            </div>
          </div>

          <Button type="submit" loading={isSubmitting} disabled={!!deadlineError} className="mt-2 h-12 w-full text-base uppercase tracking-wider">
            {!isSubmitting && <Icon name="bolt" className="text-xl" />}
            {isSubmitting ? 'Creando…' : 'Crear fondo'}
          </Button>
        </form>
      </AppShell>
      <BottomNav />
    </>
  );
}
