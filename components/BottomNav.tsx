"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePollarAuth } from "@/hooks/usePollarAuth";
import { Icon } from "@/components/ui/Icon";

function Tab({ href, icon, label, active }: { href: string; icon: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`flex flex-1 flex-col items-center justify-center py-1 transition-colors ${
        active ? "font-semibold text-primary" : "text-muted hover:text-foreground"
      }`}
    >
      <Icon name={icon} filled={active} className="text-[24px]" />
      <span className="mt-0.5 text-xs">{label}</span>
    </Link>
  );
}

export function BottomNav() {
  const pathname = usePathname();
  const { user } = usePollarAuth();

  if (!user) return null;

  const creating = pathname === "/pool/new";

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50">
      <div className="mx-auto flex w-full max-w-[480px] items-center justify-around rounded-t-xl border-t border-border bg-surface px-4 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-4px_16px_rgb(0_0_0/0.5)]">
        <Tab href="/" icon="home" label="Inicio" active={pathname === "/"} />
        <Link href="/pool/new" className="relative -top-5 flex flex-col items-center justify-center">
          <span
            className={`glow-fab flex h-14 w-14 items-center justify-center rounded-full border-4 border-background text-primary-foreground transition-transform active:scale-95 ${
              creating ? "bg-primary-hover" : "bg-primary hover:bg-primary-hover"
            }`}
          >
            <Icon name="add" className="text-[30px]" />
          </span>
          <span className={`mt-1 text-[11px] text-primary ${creating ? "font-semibold" : "font-medium"}`}>
            Crear fondo
          </span>
        </Link>
        <Tab href="/history" icon="history" label="Historial" active={pathname === "/history"} />
      </div>
    </nav>
  );
}
