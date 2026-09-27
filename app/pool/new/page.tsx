"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePollarAuth } from '../../../hooks/usePollarAuth';
import { LoginButton } from '../../../components/LoginButton';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card } from '../../../components/ui/Card';
import { usePollar } from '@pollar/react';
import { buildSessionMessage, POOL_AUTH_HEADER } from '@/lib/server-auth';
import { BottomNav } from '@/components/BottomNav';
import { CuotitaLogo } from '@/components/ui/CuotitaLogo';

export default function NewPoolPage() {
  const { user, isLoading } = usePollarAuth();
  const { getClient } = usePollar();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deadlineError, setDeadlineError] = useState<string | null>(null);

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
      <div className="flex justify-center p-10">
        <div>Cargando...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 py-8">
        <header className="flex items-center gap-2.5 pb-4">
          <Link href="/" className="flex items-center gap-2.5">
            <CuotitaLogo size={30} />
            <span className="text-xl font-bold tracking-tight">Cuotita</span>
          </Link>
        </header>
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-4">
          <h1 className="text-2xl font-bold mb-2 text-center">Inicia sesión para crear un pool</h1>
          <LoginButton />
        </div>
      </div>
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
        alert(error.error || 'No se pudo crear el pool');
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

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-4 py-8 pb-24 lg:max-w-lg lg:py-12 lg:pb-28">
      <header className="flex items-center justify-between gap-3 pb-4">
        <Link href="/" className="flex min-w-0 items-center gap-2.5">
          <CuotitaLogo size={30} />
          <h1 className="hidden min-w-0 truncate text-xl font-bold tracking-tight sm:block">
            Crear un Pool
          </h1>
        </Link>
        <LoginButton />
      </header>

      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Crear un pool nuevo</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Nombre *
            </label>
            <Input id="name" name="name" required placeholder="Fondo de la parada" />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="¿Para qué es este pool?"
              className="w-full min-h-25 rounded-xl border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-light focus:outline-none focus:ring-2 transition-shadow border-border focus:border-primary focus:ring-primary/25 resize-y"
            />
          </div>
          <div>
            <label htmlFor="goalAmount" className="block text-sm font-medium mb-1">
              Meta (USDC) *
            </label>
            <Input
              id="goalAmount"
              name="goalAmount"
              type="number"
              step="0.01"
              min="0.01"
              required
              placeholder="100.00"
            />
          </div>
          <div>
            <label htmlFor="deadline" className="block text-sm font-medium mb-1">
              Fecha límite
            </label>
            <Input id="deadline" name="deadline" type="datetime-local" onChange={handleDateChange} />
            {deadlineError && <p className="text-sm text-red-500 mt-1">{deadlineError}</p>}
          </div>
          <Button type="submit" disabled={isSubmitting || !!deadlineError} className="mt-4 w-full">
            {isSubmitting ? 'Creando...' : 'Crear pool'}
          </Button>
        </form>
      </Card>
      {user && <BottomNav />}
    </main>
  );
}
