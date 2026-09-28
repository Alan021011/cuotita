/**
 * A Material Symbols glyph — the icon set the Stitch designs are drawn with.
 * The font is loaded once in app/layout.tsx. Decorative by default.
 */
export function Icon({
  name,
  filled = false,
  className = "",
  label,
}: {
  name: string;
  filled?: boolean;
  className?: string;
  /** Accessible label; omit for purely decorative icons. */
  label?: string;
}) {
  return (
    <span
      className={`material-symbols-outlined ${filled ? "filled" : ""} ${className}`}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "img" : undefined}
    >
      {name}
    </span>
  );
}
