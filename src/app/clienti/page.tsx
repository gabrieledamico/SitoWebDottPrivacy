import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import StatsBand from "@/components/StatsBand";
import ClientLogos from "@/components/ClientLogos";
import CTASection from "@/components/CTASection";

export const metadata: Metadata = {
  title: "Clienti e casi studio",
  description:
    "Casi studio anonimizzati di percorsi NIS2, ISO 27001 e GDPR per PMI manifatturiere, chimiche, logistiche e dei servizi.",
  alternates: { canonical: "/clienti" },
};

const caseStudies = [
  {
    sector: "Manifatturiero — Automotive",
    profile: "PMI Tier 2, ~120 dipendenti, capogruppo con casa madre estera.",
    challenge:
      "Richiesta contrattuale di conformità NIS2-equivalente da parte del cliente principale, con scadenza a 60 giorni e nessuna documentazione di sicurezza pregressa.",
    approach:
      "Gap analysis su segmentazione di rete OT/IT e gestione fornitori terzi, seguita da policy PO05-PO08 mirate sui punti richiesti dal questionario del cliente.",
    outcome:
      "Questionario di sicurezza del cliente compilato con evidenze verificabili entro la scadenza, senza sospensione delle forniture.",
  },
  {
    sector: "Chimico-farmaceutico",
    profile: "Produttore di processo con sistemi SCADA e obblighi di continuità critica.",
    challenge:
      "Rinnovo della polizza cyber risk condizionato alla presentazione di una gap analysis documentata e di un piano di disaster recovery.",
    approach:
      "Business Impact Analysis sulle linee di produzione critiche, verifica dei backup esistenti, costruzione di un DRP con RTO realistici e test di ripristino documentato.",
    outcome:
      "Gap analysis e DRP consegnati in tempo utile per il rinnovo della polizza, con RTO ridotti sulle linee più critiche.",
  },
  {
    sector: "Servizi professionali",
    profile: "Studio di servizi con trattamento di dati sensibili di clienti terzi.",
    challenge:
      "Nessun DPO nominato, registro trattamenti incompleto, gestione delle richieste degli interessati non strutturata.",
    approach:
      "Nomina come DPO esterno, ricostruzione del registro trattamenti su flussi di dati reali, formazione del personale su gestione delle richieste e riconoscimento di incidenti.",
    outcome:
      "Conformità GDPR sostanziale raggiunta in circa tre mesi, con processo di gestione richieste degli interessati operativo.",
  },
  {
    sector: "Logistica",
    profile: "Operatore logistico soggetto NIS2 come fornitore di infrastrutture di trasporto.",
    challenge:
      "Assenza di un processo strutturato di incident response e formazione del personale operativo mai erogata.",
    approach:
      "RACI matrix per la gestione incidenti, formazione differenziata per personale di magazzino e IT, assessment continuo con check trimestrali.",
    outcome:
      "Primo incidente minore gestito internamente secondo il playbook definito, senza necessità di supporto esterno d'urgenza.",
  },
];

export default function ClientiPage() {
  return (
    <>
      <PageHero
        eyebrow="Clienti & casi studio"
        title="100+ clienti attivi, ~10 mandati come DPO esterno."
        description="Alcuni esempi di percorso, anonimizzati per riservatezza contrattuale. I loghi dei clienti che hanno autorizzato la pubblicazione sono mostrati qui sotto."
      />

      <StatsBand />

      <ClientLogos title="Loghi pubblicati previa autorizzazione del cliente" />

      <section>
        <Container className="py-20 lg:py-24">
          <SectionHeading
            eyebrow="Casi studio"
            title="Percorsi reali, dettagli anonimizzati"
            description="Nomi e dati identificativi sono stati omessi o generalizzati per rispettare gli accordi di riservatezza con i clienti."
          />
          <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {caseStudies.map((study) => (
              <div
                key={study.sector}
                className="flex flex-col rounded-xl border border-line bg-white/60 p-7"
              >
                <span className="font-mono text-xs uppercase tracking-widest text-amber">
                  {study.sector}
                </span>
                <p className="mt-3 text-sm font-medium leading-relaxed text-ink">
                  {study.profile}
                </p>
                <div className="mt-5 flex flex-1 flex-col gap-4 border-t border-line pt-5">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted">
                      Sfida
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">
                      {study.challenge}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted">
                      Approccio
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">
                      {study.approach}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-teal">
                      Risultato
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink/80">
                      {study.outcome}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CTASection
        title="Il vostro settore non è tra questi esempi?"
        description="Il metodo — gap analysis prima, policy dopo — si applica allo stesso modo indipendentemente dal settore. Parliamone."
      />
    </>
  );
}
