"use client";

import { usePollar } from "@pollar/react";
import { buildSessionMessage } from "@/lib/server-auth";

/**
 * Signs a short-lived SEP-53 proof for the given address and returns it
 * ready to send as the x-money-pool-auth header — same pattern PoolActions
 * uses to authorize closing a pool, reused here for claims/votes/payouts.
 */
export function useAuthProof() {
  const { getClient } = usePollar();

  return async function getAuthProof(address: string): Promise<string> {
    const client = getClient();
    let serverTime = Date.now();
    try {
      const timeRes = await fetch("/api/time");
      if (timeRes.ok) {
        const { time } = await timeRes.json();
        serverTime = time;
      }
    } catch {
      // fall back to local clock
    }

    const offset = serverTime - Date.now();
    const exp = Date.now() + offset + 10 * 60 * 1000;
    const message = buildSessionMessage(address, exp);

    const proof = await client.stellar.sep53.signMessage(message);
    if (proof.status !== "signed") {
      throw new Error(proof.details || "Firma cancelada o fallida");
    }

    return JSON.stringify({ address, exp, signature: proof.signature });
  };
}
