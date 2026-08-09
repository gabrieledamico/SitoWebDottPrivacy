import type { Metadata } from "next";
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { siteConfig } from "@/lib/site-config";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Consulenza NIS2, ISO 27001, GDPR e DPO esterno`,
    template: `%s — ${siteConfig.name}`,
  },
  description:
    "Consulenza privacy e cybersecurity per PMI manifatturiere e industriali: NIS2, ISO 27001, GDPR, DPO esterno. Policy scritte da chi sa anche fare l'audit tecnico che le rende vere.",
  keywords: [
    "consulente NIS2",
    "DPO esterno",
    "audit ISO 27001 PMI manifatturiera",
    "consulente privacy",
    "GDPR",
    "cybersecurity advisory",
  ],
  authors: [{ name: "Gabriele D'Amico" }],
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — Consulenza NIS2, ISO 27001, GDPR e DPO esterno`,
    description:
      "Consulenza privacy e cybersecurity per PMI manifatturiere e industriali: NIS2, ISO 27001, GDPR, DPO esterno.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: siteConfig.fullName,
    description:
      "Consulenza privacy e cybersecurity: NIS2, ISO 27001, GDPR, DPO esterno per PMI manifatturiere e industriali.",
    url: siteConfig.url,
    email: siteConfig.email,
    areaServed: "IT",
    address: {
      "@type": "PostalAddress",
      addressCountry: "IT",
      addressLocality: siteConfig.address.city,
    },
    knowsAbout: [
      "NIS2",
      "ISO 27001",
      "GDPR",
      "Data Protection Officer",
      "Cybersecurity",
      "Business Impact Analysis",
    ],
  };

  return (
    <html
      lang="it"
      className={`${spaceGrotesk.variable} ${inter.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-body">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
