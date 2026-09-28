"use client";

import { useEffect, useState, use } from 'react';
import { notFound, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Spinner } from '@/components/ui/Spinner';
import { usePollarAuth } from '@/hooks/usePollarAuth';
import { LoginButton } from '@/components/LoginButton';
import { ContributeButton } from '@/components/ContributeButton';
import { BottomNav } from '@/components/BottomNav';
import { AppHeader, AppShell } from '@/components/AppHeader';
import { STELLAR_EXPERT_URL } from '@/lib/stellar';
import { useBalance } from '@/hooks/useBalance';
import { ProgressBar } from '@/components/ProgressBar';

type PoolResponse = {
  id: string;
  name: string;
  description: string | null;
  goalAmount: string;
  total: string;
  status: string;
  organizerAddress: string;
  deadline: string | null;
};

export default function ContributePage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>,
  searchParams: Promise<{ amount?: string }>
}) {
  const { id } = use(params);
  const { amount: initialAmount } = use(searchParams);
  const router = useRouter();

  const [pool, setPool] = useState<PoolResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [amount, setAmount] = useState(initialAmount || '');
  const { user, isLoading: authLoading } = usePollarAuth();
  const { balance, isLoading: balanceLoading, currency } = useBalance();

  const [isRegistering, setIsRegistering] = useState(false);
  const [successHash, setSuccessHash] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/pools/${id}`)
      .then(res => {
        if (!res.ok) {
          if (res.status === 404) notFound();
          throw new Error('Failed to fetch pool');
        }
        return res.json();
      })
      .then(data => {
        setPool(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, [id]);

  const handleSuccess = async (result: { hash: string; status: string }) => {
    setIsRegistering(true);
    setRegisterError(null);
    try {
      const res = await fetch(`/api/pools/${id}/contributions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amount,
          txHash: result.hash,
          contributorName: null,
          contributorAddress: user?.address || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al registrar el aporte');
      }

      setSuccessHash(result.hash);
    } catch (err) {
      setRegisterError(err instanceof Error ? err.message : 'Error desconocido al registrar');
    } finally {
      setIsRegistering(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center gap-3 p-10 text-muted">
        <Spinner /> Cargando el fondo…
      </div>
    );
  }

  if (!pool) {
    return <div className="p-10 text-center text-error">Error al cargar el fondo</div>;
  }

  if (successHash) {
    return (
      <>
        <AppHeader />
        <AppShell>
          <Card highlight className="flex flex-col items-center p-8 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-success-border bg-success-light text-success">
              <Icon name="check" className="text-4xl" />
            </div>
            <h1 className="mb-2 font-display text-4xl text-foreground">¡Aporte registrado!</h1>
            <p className="mb-4 text-sm text-muted">
              Aportaste <span className="font-mono font-semibold text-foreground">{amount} USDC</span> al fondo {pool.name}.
            </p>
            <a
              href={`${STELLAR_EXPERT_URL}/tx/${successHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-8 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Ver en Stellar Expert <Icon name="open_in_new" className="text-sm" />
            </a>
            <Button onClick={() => router.push(`/pool/${pool.id}`)} className="h-12 w-full">
              Ver el fondo
            </Button>
          </Card>
        </AppShell>
        {user && <BottomNav />}
      </>
    );
  }

  const maxAllowed = parseFloat(pool.goalAmount) - parseFloat(pool.total || '0');

  const percentage = (Number(pool.total) / Number(pool.goalAmount)) * 100;

  return (
    <>
      <AppHeader backHref={`/pool/${pool.id}`} backLabel={pool.name} />
      <AppShell>
        <div className="space-y-1.5">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-raised px-2.5 py-1 text-[11px] font-medium text-primary">
            <Icon name="savings" className="text-sm" />
            Aportar cuota
          </span>
          <h1 className="pt-1 font-display text-5xl leading-none tracking-wide text-foreground">{pool.name}</h1>
          {pool.description && <p className="text-sm text-muted">{pool.description}</p>}
        </div>

        <ProgressBar total={pool.total || '0'} goal={pool.goalAmount} percentage={percentage} />

        <Card highlight>
          {pool.status === 'closed' ? (
            <div className="text-center">
              <div className="mb-4 rounded-xl border border-error-border bg-error-light p-4 text-sm font-medium text-error">
                Este fondo ya está cerrado. No se aceptan más aportes.
              </div>
              <Link href={`/pool/${pool.id}`} className="inline-flex items-center gap-1 font-semibold text-primary transition-colors hover:text-primary-hover">
                Ver el fondo <Icon name="arrow_forward" className="text-base" />
              </Link>
            </div>
          ) : !authLoading && !user ? (
            <div className="flex flex-col items-center gap-4 py-2">
              <p className="text-center text-sm text-muted">Inicia sesión para poder aportar.</p>
              <LoginButton />
            </div>
          ) : balanceLoading ? (
            <div className="flex flex-col items-center gap-3 py-6 text-muted">
              <Spinner size={28} className="text-primary" />
              <p className="text-center text-sm font-medium">Esperando tu saldo USDC…</p>
            </div>
          ) : currency !== 'USDC' ? (
            <div className="rounded-xl border border-error-border bg-error-light p-4 text-center text-sm font-medium text-error">
              Tu cuenta no tiene USDC habilitado.
            </div>
          ) : (
            <>
              <div className="mb-2 flex items-center justify-between gap-2">
                <label htmlFor="amount" className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                  Monto a aportar (USDC)
                </label>
                {balance !== null && (
                  <div className="flex items-center gap-2 font-mono text-xs text-muted">
                    <span>Disponible: {parseFloat(balance).toFixed(2)}</span>
                    <button
                      onClick={() => {
                        const available = parseFloat(balance);
                        const toGoal = maxAllowed;
                        setAmount(Math.min(available, toGoal).toFixed(2));
                      }}
                      className="rounded border border-border bg-surface-raised px-2 py-0.5 text-[11px] text-primary transition-colors hover:bg-border"
                    >
                      Máximo
                    </button>
                  </div>
                )}
              </div>

              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => {
                  let val = e.target.value;
                  if (val.includes('.')) {
                    const parts = val.split('.');
                    if (parts[1].length > 2) {
                      val = `${parts[0]}.${parts[1].slice(0, 2)}`;
                    }
                  }
                  setAmount(val);
                }}
                placeholder="10.00"
                className="mb-4 font-mono text-lg font-bold"
                disabled={isRegistering}
              />

              {registerError && (
                <p className="mb-4 rounded-xl border border-error-border bg-error-light px-3 py-2 text-sm text-error">
                  {registerError}
                </p>
              )}

              <ContributeButton
                poolId={pool.id}
                organizerAddress={pool.organizerAddress}
                amount={amount}
                maxAllowed={maxAllowed}
                onSuccess={handleSuccess}
                disabled={isRegistering}
              />
              {isRegistering && (
                <p className="mt-2 animate-pulse text-center text-xs font-medium text-primary">
                  Registrando aporte…
                </p>
              )}
            </>
          )}
        </Card>
      </AppShell>
      {user && <BottomNav />}
    </>
  );
}
