export function Card({
  children,
  className = "",
  highlight = false,
}: {
  children: React.ReactNode;
  className?: string;
  /** Amber border + glow, for the one card a screen is about. */
  highlight?: boolean;
}) {
  return (
    <div
      className={`relative rounded-2xl border bg-surface p-5 ${
        highlight ? "border-primary/50 glow-amber" : "border-border"
      } ${className}`}
    >
      {children}
    </div>
  );
}
