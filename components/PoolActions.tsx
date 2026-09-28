"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/Button";
import { Modal } from "./ui/Modal";
import { Icon } from "./ui/Icon";
import { usePollar } from "@pollar/react";
import { usePollarAuth } from "@/hooks/usePollarAuth";
import { buildSessionMessage, POOL_AUTH_HEADER } from "@/lib/server-auth";
import type { PoolWithTotal } from "@/lib/pools";

interface PoolActionsProps {
  pool: PoolWithTotal;
  onPoolUpdated: (pool: PoolWithTotal) => void;
}

export function PoolActions({ pool, onPoolUpdated }: PoolActionsProps) {
  const router = useRouter();
  const { user } = usePollarAuth();
  const { getClient } = usePollar();
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const isOrganizer = user?.address === pool.organizerAddress;
  const isClosed = pool.status === 'closed';

  if (isClosed) return null;

  async function handleConfirmClose() {
    if (!user) return;
    setIsClosing(true);
    try {
      const client = getClient();
      let serverTime = Date.now();
      try {
        const timeRes = await fetch('/api/time');
        if (timeRes.ok) {
          const { time } = await timeRes.json();
          serverTime = time;
        }
      } catch (e) {
        console.warn('Could not fetch server time', e);
      }

      const offset = serverTime - Date.now();
      const exp = Date.now() + offset + 10 * 60 * 1000;
      const message = buildSessionMessage(user.address, exp);

      const proof = await client.stellar.sep53.signMessage(message);
      if (proof.status !== 'signed') {
        throw new Error(proof.details || 'Firma cancelada o fallida');
      }

      const res = await fetch(`/api/pools/${pool.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          [POOL_AUTH_HEADER]: JSON.stringify({
            address: user.address,
            exp,
            signature: proof.signature
          })
        },
        body: JSON.stringify({})
      });
      if (res.ok) {
        const updatedPool = await res.json();
        onPoolUpdated(updatedPool);
        setIsCloseModalOpen(false);
      } else {
        alert("Error al cerrar el fondo");
      }
    } catch (error) {
      console.error(error);
      alert("Error al cerrar el fondo");
    } finally {
      setIsClosing(false);
    }
  }

  return (
    <>
      <div className="flex flex-col gap-2.5">
        <Button
          onClick={() => router.push(`/pool/${pool.id}/contribute`)}
          className="h-12 w-full uppercase tracking-wider"
        >
          <Icon name="bolt" className="text-xl" />
          Aportar cuota al fondo
        </Button>
        {isOrganizer && (
          <button
            onClick={() => setIsCloseModalOpen(true)}
            className="mx-auto inline-flex items-center gap-1 font-mono text-[11px] text-muted transition-colors hover:text-error"
          >
            <Icon name="lock" className="text-xs" />
            Cerrar fondo (solo organizador)
          </button>
        )}
      </div>

      <Modal
        open={isCloseModalOpen}
        onClose={() => setIsCloseModalOpen(false)}
        title="Cerrar fondo"
      >
        <div className="flex flex-col gap-4">
          <p className="text-center text-muted text-sm mt-2">
            ¿Seguro que deseas cerrar este fondo?
            <br />
            Esta acción no se puede deshacer y no se aceptarán más contribuciones.
          </p>
          <div className="flex gap-3 mt-4">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setIsCloseModalOpen(false)}
              disabled={isClosing}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              className="flex-1"
              onClick={handleConfirmClose}
              loading={isClosing}
            >
              Cerrar fondo
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
