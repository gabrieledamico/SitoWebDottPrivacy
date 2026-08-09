import Link from "next/link";
import Container from "./Container";
import Eyebrow from "./Eyebrow";

const pillars = [
  {
    code: "PO",
    tag: "Priorità normativa 2026",
    tone: "amber" as const,
    title: "NIS2",
    description:
      "Gap analysis, policy PO05-PO09, BCP/DRP, formazione e assessment continuo per soggetti essenziali e importanti, e per la loro filiera.",
    href: "/servizi/nis2",
  },
  {
    code: "SGSI",
    tag: "Auditing & implementazione",
    tone: "teal" as const,
    title: "ISO 27001",
    description:
      "Sistema di Gestione della Sicurezza delle Informazioni: audit interni, gap assessment, supporto alla certificazione.",
    href: "/servizi/iso27001",
  },
  {
    code: "GDPR",
    tag: "Compliance continuativa",
    tone: "amber" as const,
    title: "GDPR & DPO esterno",
    description:
      "Registro trattamenti, DPIA, gestione data breach e nomina come Responsabile della Protezione dei Dati esterno.",
    href: "/servizi/gdpr-dpo",
  },
  {
    code: "SEC",
    tag: "Awareness & red/blue team",
    tone: "teal" as const,
    title: "Cybersecurity Advisory",
    description:
      "Formazione tecnica del personale, simulazioni di attacco/difesa, revisione delle misure di sicurezza IT.",
    href: "/servizi/cybersecurity-advisory",
  },
];

export default function ServicePillars() {
  return (
    <section>
      <Container className="py-20 lg:py-28">
        <Eyebrow>Aree di intervento</Eyebrow>
        <h2 className="text-balance mt-5 max-w-2xl font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Quattro discipline, un unico metodo
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
          Ogni servizio nasce dallo stesso approccio: leggere prima la
          realtà tecnica dell&apos;azienda, poi scrivere le policy che la
          descrivono davvero.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {pillars.map((pillar) => (
            <Link
              key={pillar.href}
              href={pillar.href}
              className="group relative flex flex-col rounded-xl border border-line bg-white/60 p-7 transition hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-[0_12px_32px_-16px_rgba(14,26,43,0.25)]"
            >
              <div className="flex items-start justify-between">
                <span
                  className={`font-mono text-xs uppercase tracking-widest ${
                    pillar.tone === "amber" ? "text-amber" : "text-teal"
                  }`}
                >
                  {pillar.tag}
                </span>
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-md font-mono text-[11px] font-medium ${
                    pillar.tone === "amber"
                      ? "bg-amber-dim text-amber"
                      : "bg-teal-dim text-teal"
                  }`}
                >
                  {pillar.code}
                </span>
              </div>
              <h3 className="mt-5 font-display text-2xl font-semibold tracking-tight text-ink">
                {pillar.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                {pillar.description}
              </p>
              <span className="mt-6 inline-flex items-center gap-1.5 font-sans text-sm font-medium text-ink transition group-hover:gap-2.5">
                Scopri il servizio
                <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                  <path
                    d="M1 5h11.5M8 1l4.5 4-4.5 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
