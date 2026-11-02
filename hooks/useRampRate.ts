"use client";

import { useEffect, useState } from "react";
import { usePollar } from "@pollar/react";
import type { PollarClient } from "@pollar/core";

/** A small reference amount used only to ask Pollar for a representative rate. */
const REFERENCE_BOB = 10;

type RampDirection = "ONRAMP" | "OFFRAMP";

/** Bs per 1 USDC, derived from a live ramp quote. */
export type RampRate = { rate: number };

type RateState =
  | { step: "loading" }
  | { step: "unavailable" }
  | { step: "ready"; buy: RampRate | null; sell: RampRate | null };

/**
 * Quotes a small BOB amount in one direction and turns it into Bs per USDC.
 * Onramp: REFERENCE_BOB goes in, USDC comes out. Offramp: REFERENCE_BOB is the
 * amount that comes out, USDC is what goes in.
 */
async function quoteBobRate(client: PollarClient, direction: RampDirection): Promise<RampRate | null> {
  const { routes } = await client.getRampRoutes(direction);
  const bobRoutes = routes.filter((r) => r.fiat.currency === "BOB");
  const route = bobRoutes.find((r) => r.asset.code === "USDC") ?? bobRoutes[0];
  if (!route) return null;

  const { quotes } = await client.quoteRamp({
    direction,
    fiat: { currency: route.fiat.currency, rail: route.fiat.rail, country: route.fiat.country },
    asset: { code: route.asset.code, identifier: route.asset.identifier, chain: route.asset.chain },
    amount: { value: String(REFERENCE_BOB), denomination: direction === "ONRAMP" ? "in" : "out" },
  });

  // Quotes come best first.
  const best = quotes[0];
  if (!best) return null;

  const bob = Number(direction === "ONRAMP" ? best.amountIn : best.amountOut);
  const usdc = Number(direction === "ONRAMP" ? best.amountOut : best.amountIn);
  return usdc > 0 ? { rate: bob / usdc } : null;
}

/** How long a fetched rate is reused, so every screen shares one set of quotes. */
const CACHE_MS = 60_000;

type Rates = { buy: RampRate | null; sell: RampRate | null };

let shared: { client: PollarClient; at: number; rates: Promise<Rates> } | null = null;

/**
 * Every screen mounts its own useRampRate, and each one used to quote on its
 * own: four screens meant eight quotes per load, which trips Pollar's rate
 * limit (429). They now share one in-flight request, reused for CACHE_MS.
 * A failed lookup (e.g. KYC still pending) is shared too, so it isn't retried
 * on every render.
 */
function loadRates(client: PollarClient): Promise<Rates> {
  if (shared && shared.client === client && Date.now() - shared.at < CACHE_MS) {
    return shared.rates;
  }
  const rates = Promise.allSettled([
    quoteBobRate(client, "ONRAMP"),
    quoteBobRate(client, "OFFRAMP"),
  ]).then(([buyRes, sellRes]) => ({
    buy: buyRes.status === "fulfilled" ? buyRes.value : null,
    sell: sellRes.status === "fulfilled" ? sellRes.value : null,
  }));
  shared = { client, at: Date.now(), rates };
  return rates;
}

/**
 * Fetches today's reference USDC↔BOB rate for the passive ticker shown in
 * Cuenta. Pure read-only lookup (quoteRamp never moves money) — if it
 * fails or Bolivia isn't quotable right now, we just hide the ticker instead
 * of showing an error, since it's informational, not blocking.
 */
export function useRampRate(enabled: boolean) {
  const { getClient } = usePollar();
  const [state, setState] = useState<RateState>({ step: "loading" });

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    async function load() {
      try {
        const client = getClient();
        const { buy, sell } = await loadRates(client);

        if (!cancelled) {
          if (!buy && !sell) setState({ step: "unavailable" });
          else setState({ step: "ready", buy, sell });
        }
      } catch {
        if (!cancelled) setState({ step: "unavailable" });
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [getClient, enabled]);

  return state;
}
