/**
 * Cuotita's own mark (the moto-rider icon from public/logo.png), for page
 * headers across the app. Drop-in replacement for the places that were
 * showing PollarLogo as if it were the app's own icon — Pollar gets credit
 * in the "Construido con" footer instead, not in every page header.
 */
export function CuotitaLogo({
  size = 28,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.png"
      alt="Cuotita"
      className={`inline-block shrink-0 object-contain ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
