import type { Metadata } from "next";
import { Bebas_Neue, IBM_Plex_Sans, IBM_Plex_Mono, Oswald } from "next/font/google";
import { PollarAppProvider } from "@/lib/pollar";
import "./globals.css";

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

// Landing headlines (Stitch "Rider Mutual Aid" desktop design).
const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Cuotita",
  description: "Fondo de auxilio mutuo para motorepartidores, con Pollar",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${plexSans.variable} ${plexMono.variable} ${bebasNeue.variable} ${oswald.variable} h-full antialiased overflow-y-scroll`}
    >
      <head>
        {/* Icon font used by the Stitch-generated designs (components/ui/Icon.tsx). */}
        {/* display=block on purpose: an icon font must not flash its ligature names. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font, @next/next/google-font-display */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
        />
      </head>
      <body className="min-h-full flex flex-col bg-background">
        <PollarAppProvider>{children}</PollarAppProvider>
      </body>
    </html>
  );
}
