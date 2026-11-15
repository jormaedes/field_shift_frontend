import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import { LanguageProvider } from "@/components/language-provider";
import "./globals.css";
import "leaflet/dist/leaflet.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Serifa variável: dá carácter editorial aos títulos e afasta a página
// do aspeto genérico de dashboard. O itálico é usado no acento "solo".
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "NATERRA · Field Shift",
    template: "%s · NATERRA",
  },
  applicationName: "NATERRA",
  description:
    "Compare three crop rotation strategies with NASA Earth observation data. This tool supports farmer decision-making and does not replace local knowledge.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-canvas text-ink">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
