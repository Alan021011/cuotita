"use client";

import { useEffect, useState } from "react";
import { usePollar } from "@pollar/react";
import type { RampQuote } from "@pollar/core";

/** A small reference amount used only to ask Pollar for a representative rate. */
const REFERENCE_BOB = 10;

type RateState =
  | { step: "loading" }
  | { step: "unavailable" }
  | { step: "ready"; buy: RampQuote | null; sell: RampQuote | null };

/**
 * Fetches today's reference USDC↔BOB rate for the passive ticker shown in
 * Cuenta. Pure read-only lookup (getRampsQuote never moves money) — if it
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
        const { countries } = await client.getRampCountries();
        const bolivia = countries.find((c) => c.currency === "BOB");
        if (!bolivia) {
          if (!cancelled) setState({ step: "unavailable" });
          return;
        }

        const [buyRes, sellRes] = await Promise.allSettled([
          client.getRampsQuote({
            country: bolivia.code,
            amount: REFERENCE_BOB,
            currency: "BOB",
            direction: "onramp",
          }),
          client.getRampsQuote({
            country: bolivia.code,
            amount: REFERENCE_BOB,
            currency: "BOB",
            direction: "offramp",
          }),
        ]);

        const buy =
          buyRes.status === "fulfilled"
            ? buyRes.value.quotes.find((q) => q.recommended) ?? buyRes.value.quotes[0] ?? null
            : null;
        const sell =
          sellRes.status === "fulfilled"
            ? sellRes.value.quotes.find((q) => q.recommended) ?? sellRes.value.quotes[0] ?? null
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
