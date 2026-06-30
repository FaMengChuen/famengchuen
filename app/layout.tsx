import type { Metadata, Viewport } from "next";
import { Anton, Oswald, Barlow } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const oswald = Oswald({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
});

const barlow = Barlow({
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-barlow",
  display: "swap",
});

const SITE_URL = "https://famengchuen.pe";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Asociación Fa Meng Chuen — Kung Fu · Wushu · Miraflores",
  description:
    "Escuela de artes marciales chinas en Miraflores, Lima. Tai Chi, Sanda y Taolu, más los programas PAMVA y El Arte de Luchar, de la mano del Maestro Alessandro Paredes. Reserva tu primera clase por WhatsApp.",
  keywords: [
    "Kung Fu Lima",
    "Wushu",
    "Tai Chi Miraflores",
    "Sanda",
    "Taolu",
    "artes marciales chinas",
    "Fa Meng Chuen",
    "defensa personal mujeres PAMVA",
  ],
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: SITE_URL,
    siteName: "Asociación Fa Meng Chuen",
    title: "Asociación Fa Meng Chuen — Kung Fu · Wushu · Miraflores",
    description:
      "Arte marcial tradicional chino y deporte de contacto en Miraflores, Lima. Reserva tu primera clase por WhatsApp.",
    images: [
      { url: "/assets/team.jpg", width: 2000, height: 1333, alt: "Equipo Fa Meng Chuen" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Asociación Fa Meng Chuen — Kung Fu · Wushu · Miraflores",
    description:
      "Arte marcial tradicional chino y deporte de contacto en Miraflores, Lima.",
    images: ["/assets/team.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${anton.variable} ${oswald.variable} ${barlow.variable}`}
    >
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
