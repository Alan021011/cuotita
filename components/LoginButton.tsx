"use client";

import { useState } from "react";
import { AccountModal } from "@/components/AccountModal";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { usePollarAuth } from "@/hooks/usePollarAuth";
import { middleTruncate } from "@/lib/format";

/**
 * Logged out: the "Iniciar sesión con Pollar" button. Logged in: the wallet
 * pill (green dot + short address) that opens the account modal.
 */
export function LoginButton() {
  const { user, isLoading, login } = usePollarAuth();
  const [accountOpen, setAccountOpen] = useState(false);

  if (user) {
    return (
      <>
        <button
          onClick={() => setAccountOpen(true)}
          aria-label="Cuenta"
          title={user.profile?.mail ?? user.address}
          className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 transition-colors hover:border-primary/40"
        >
          <span className="h-2 w-2 rounded-full bg-success" />
          <span className="font-mono text-xs font-medium tracking-tight text-foreground">
            {middleTruncate(user.address, 4, 4)}
          </span>
          <Icon name="keyboard_arrow_down" className="text-[16px] text-muted" />
        </button>
        <AccountModal open={accountOpen} onClose={() => setAccountOpen(false)} />
      </>
    );
  }

  return (
    <Button onClick={login} loading={isLoading} className="min-h-10 py-2">
      {isLoading ? "Conectando…" : "Iniciar sesión"}
    </Button>
  );
}
