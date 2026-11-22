"use client";

import { useEffect, useState } from "react";
import { usePollar } from "@pollar/react";

/** A small reference amount used only to ask Pollar for a representative rate. */
const REFERENCE_BOB = "10";
const REFERENCE_USDC = "10";

interface SimpleRate {
  /** Bs per 1 unit of the asset (USDC). */
  rate: number;
}

type RateState =
  | { step: "loading" }
  | { step: "unavailable" }
  | { step: "ready"; buy: SimpleRate | null; sell: SimpleRate | null };

/**
 * Fetches today's reference USDC↔BOB rate for the passive ticker shown in
 * Cuenta. Pure read-only lookup (quoteRamp never moves money) — if it fails
 * or Bolivia isn't quotable right now, we just hide the ticker instead of
 * showing an error, since it's informational, not blocking.
 *
 * Rebuilt against the SDK's v3 ramps API (routes + quoteRamp), which
 * replaced the old getRampCountries/getRampsQuote pair entirely — the v2
 * endpoints they called were decommissioned, breaking this ticker for
 * everyone until this rewrite.
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
        const [onrampRoutes, offrampRoutes] = await Promise.all([
          client.getRampRoutes("ONRAMP"),
          client.getRampRoutes("OFFRAMP"),
        ]);

        const onrampRoute = onrampRoutes.routes.find(
          (r) => r.fiat.currency === "BOB" && r.asset.code === "USDC" && r.asset.chain === "STELLAR"
        );
        const offrampRoute = offrampRoutes.routes.find(
          (r) => r.fiat.currency === "BOB" && r.asset.code === "USDC" && r.asset.chain === "STELLAR"
        );

        const [buyRes, sellRes] = await Promise.allSettled([
          onrampRoute
            ? client.quoteRamp({
                direction: "ONRAMP",
                fiat: onrampRoute.fiat,
                asset: onrampRoute.asset,
                amount: { value: REFERENCE_BOB, denomination: "in" },
              })
            : Promise.reject(new Error("no onramp route")),
          offrampRoute
            ? client.quoteRamp({
                direction: "OFFRAMP",
                fiat: offrampRoute.fiat,
                asset: offrampRoute.asset,
                amount: { value: REFERENCE_USDC, denomination: "in" },
              })
            : Promise.reject(new Error("no offramp route")),
        ]);

        // Buy = BOB -> USDC: rate is how many Bs one USDC costs (input BOB / output USDC).
        const buyQuote = buyRes.status === "fulfilled" ? buyRes.value.quotes[0] : null;
        const buy: SimpleRate | null =
          buyQuote && Number(buyQuote.amountOut) > 0
            ? { rate: Number(buyQuote.amountIn) / Number(buyQuote.amountOut) }
            : null;

        // Sell = USDC -> BOB: rate is how many Bs one USDC is worth (output BOB / input USDC).
        const sellQuote = sellRes.status === "fulfilled" ? sellRes.value.quotes[0] : null;
        const sell: SimpleRate | null =
          sellQuote && Number(REFERENCE_USDC) > 0
            ? { rate: Number(sellQuote.amountOut) / Number(REFERENCE_USDC) }
            : null;

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
