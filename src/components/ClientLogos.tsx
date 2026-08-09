import Image from "next/image";
import Container from "./Container";

export type ClientLogo = {
  name: string;
  logoSrc?: string;
};

// Settori attualmente serviti — mostrati finché non vengono aggiunti i loghi
// reali dei clienti (da inserire in /public/logos previa autorizzazione).
const sectorsFallback = [
  "Automotive",
  "Metalmeccanica",
  "Packaging",
  "Chimica & Farma",
  "Logistica",
  "Servizi IT",
];

export default function ClientLogos({
  logos = [],
  title = "Operiamo con aziende in questi settori",
}: {
  logos?: ClientLogo[];
  title?: string;
}) {
  return (
    <section className="border-y border-line bg-paper-dim">
      <Container className="py-14">
        <p className="text-center font-mono text-xs uppercase tracking-widest text-muted">
          {title}
        </p>

        {logos.length > 0 ? (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
            {logos.map((logo) => (
              <div
                key={logo.name}
                className="flex h-10 items-center opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0"
              >
                {logo.logoSrc ? (
                  <Image
                    src={logo.logoSrc}
                    alt={logo.name}
                    width={140}
                    height={40}
                    className="h-8 w-auto object-contain"
                  />
                ) : (
                  <span className="font-display text-lg font-medium text-ink/70">
                    {logo.name}
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {sectorsFallback.map((sector) => (
              <span
                key={sector}
                className="rounded-full border border-line bg-white/60 px-4 py-1.5 text-sm text-ink/70"
              >
                {sector}
              </span>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
