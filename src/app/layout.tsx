import type { Metadata } from "next";
import { Fraunces, Nunito } from "next/font/google";
import "./globals.css";
import SfondoVivo from "@/components/terra-dei-bambini/SfondoVivo";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "La Terra dei Bambini — Banca ore 2026/2027",
    template: "%s — La Terra dei Bambini",
  },
  description:
    "Raccolta delle adesioni delle famiglie ai gruppi di lavoro del progetto parentale.",
  // Pagina privata e temporanea: nessuna indicizzazione, in nessuna sezione.
  robots: { index: false, follow: false, nocache: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="it"
      className={`${fraunces.variable} ${nunito.variable} h-full antialiased`}
    >
      <body className="relative min-h-full flex flex-col bg-panna text-testo">
        <SfondoVivo />
        <main className="relative flex-1">{children}</main>
      </body>
    </html>
  );
}
