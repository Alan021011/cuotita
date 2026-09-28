"use client";

import Link from "next/link";
import { LoginButton } from "@/components/LoginButton";
import { Icon } from "@/components/ui/Icon";

/**
 * Fixed top bar shared by every in-app screen (Stitch "Asfalto" shell):
 * brand cluster on the left (or a back link), account pill on the right.
 * Pages pair it with <AppShell>, which reserves the space under it.
 */
export function AppHeader({ backHref, backLabel }: { backHref?: string; backLabel?: string }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-[480px] items-center justify-between gap-3 px-4 py-3">
        {backHref ? (
          <Link
            href={backHref}
            className="flex min-w-0 items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-foreground"
          >
            <Icon name="arrow_back" className="text-[20px]" />
            <span className="truncate">{backLabel ?? "Volver"}</span>
          </Link>
        ) : (
          <Link href="/" className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-surface p-0.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="" className="h-full w-full object-contain" />
            </span>
            <span className="flex flex-col">
              <span className="font-display text-xl leading-none tracking-wider text-primary">Cuotita</span>
              <span className="mt-0.5 font-mono text-[9px] uppercase tracking-wider text-muted">
                Fondo repartidores
              </span>
            </span>
          </Link>
        )}
        <LoginButton />
      </div>
    </header>
  );
}

/** Mobile-width column under the fixed header, clear of the bottom nav. */
export function AppShell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <main className={`mx-auto flex w-full max-w-[480px] flex-1 flex-col gap-5 px-4 pb-28 pt-20 ${className}`}>
      {children}
    </main>
  );
}
