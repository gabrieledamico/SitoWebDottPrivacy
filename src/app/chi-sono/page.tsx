import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import CTASection from "@/components/CTASection";

export const metadata: Metadata = {
  title: "Chi sono — Gabriele D'Amico",
  description:
    "Gabriele D'Amico: consulente privacy e cybersecurity, DPO esterno, ISO 27001 Lead Auditor, specialista NIS2. Un profilo ibrido tra normativa e verifica tecnica.",
  alternates: { canonical: "/chi-sono" },
};

const credentials = [
  {
    title: "ISO 27001 Lead Auditor",
    description:
      "Abilitato a condurre audit su Sistemi di Gestione della Sicurezza delle Informazioni secondo lo standard internazionale.",
  },
  {
    title: "Specialista NIS2",
    description:
      "Percorsi di adeguamento per soggetti essenziali, importanti e per la loro filiera di fornitura.",
  },
  {
    title: "DPO esterno",
    description:
      "Circa 10 mandati attivi come Responsabile della Protezione dei Dati per aziende di diversi settori.",
  },
  {
    title: "Cybersecurity Advisory",
    description:
      "Formazione tecnica e simulazioni red team / blue team per rendere concreta la sicurezza percepita.",
  },
];

const capabilities = [
  {
    title: "Leggo un asset inventory, non solo un registro trattamenti",
    description:
      "Prima di scrivere una policy verifico cosa c'è davvero in infrastruttura: server, applicativi, fornitori cloud, accessi. Un documento che non corrisponde alla realtà tecnica è carta, non conformità.",
  },
  {
    title: "Valido una Business Impact Analysis sul campo",
    description:
      "Una BIA scritta a tavolino sovrastima o sottostima sempre gli impatti reali. La confronto con RTO/RPO effettivi dei sistemi, con i backup testati, con le dipendenze da fornitori terzi.",
  },
  {
    title: "Conduco gap analysis ISO 27001 sui controlli, non su una checklist",
    description:
      "L'Annex A ha 93 controlli: per ciascuno verifico l'evidenza tecnica, non mi limito a chiedere 'lo fate sì/no'. È la differenza tra un audit e un questionario.",
  },
  {
    title: "Revisiono le policy IT prima di formalizzarle",
    description:
      "Patch management, backup, gestione accessi, logging: le leggo, le confronto con la prassi osservata, e solo dopo le traduco in documentazione conforme a NIS2 e ISO 27001.",
  },
  {
    title: "Costruisco RACI matrix operative, non teoriche",
    description:
      "Chi è responsabile di cosa in caso di incidente non può essere una casella vuota in un documento. Definisco ruoli con nomi, referenti IT e tempi di escalation verificati con l'azienda.",
  },
  {
    title: "Parlo con l'IT manager senza bisogno di un traduttore",
    description:
      "Le riunioni tecniche con IT interno o fornitori MSP le conduco direttamente, entrando nel merito di firewall, segmentazione di rete, EDR, backup 3-2-1 — non delegando a un tecnico esterno.",
  },
];

export default function ChiSonoPage() {
  return (
    <>
      <PageHero
        eyebrow="Chi sono"
        title="Un profilo ibrido: normativa e verifica tecnica nella stessa persona."
        description="Sono Gabriele D'Amico, consulente privacy e cybersecurity, DPO esterno, ISO 27001 Lead Auditor e specialista NIS2. Non delego la parte tecnica a un terzo: la conduco io stesso."
      />

      <section>
        <Container className="py-20 lg:py-24">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <SectionHeading
                eyebrow="Il percorso"
                title="Perché un profilo ibrido è raro nel mercato italiano"
              />
              <div className="mt-6 flex flex-col gap-4 text-base leading-relaxed text-muted">
                <p>
                  Il mercato della consulenza privacy in Italia è affollato:
                  molti studi offrono GDPR generico, spesso con documenti
                  standardizzati adattati al minimo indispensabile. È un
                  approccio che regge finché nessuno verifica se la policy
                  corrisponde a ciò che succede davvero in azienda.
                </p>
                <p>
                  Il mio percorso professionale unisce la formazione
                  giuridica necessaria per muoversi con sicurezza tra GDPR,
                  NIS2 e rapporti con il Garante, a competenze tecniche
                  dirette in ambito ISO 27001 e cybersecurity, maturate sul
                  campo affiancando reparti IT e MSP in decine di
                  organizzazioni.
                </p>
                <p>
                  Il risultato è un metodo in cui la policy non è mai il
                  punto di partenza, ma l&apos;ultimo passo di un percorso che
                  comincia con un audit tecnico reale.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {credentials.map((credential) => (
                <div
                  key={credential.title}
                  className="rounded-xl border border-line bg-white/60 p-6"
                >
                  <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
                    {credential.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {credential.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-line bg-paper-dim">
        <Container className="py-20 lg:py-24">
          <SectionHeading
            eyebrow="Cosa so fare"
            tone="teal"
            title="Sei cose che un consulente puramente legale, di solito, non fa"
            description="Non è una lista di aggettivi. È il metodo che applico ad ogni progetto, prima ancora di aprire un documento word."
          />
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {capabilities.map((item, index) => (
              <div
                key={item.title}
                className="rounded-xl border border-line bg-white p-7"
              >
                <span className="font-mono text-xs text-teal">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-display text-lg font-semibold tracking-tight text-ink">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CTASection
        title="Vuoi capire se il tuo attuale consulente privacy ha mai letto il tuo asset inventory?"
        description="Una prima call conoscitiva per fare il punto su NIS2, ISO 27001 e GDPR — senza impegno."
      />
    </>
  );
}
