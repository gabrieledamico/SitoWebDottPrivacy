import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import MethodSteps from "@/components/MethodSteps";
import CTASection from "@/components/CTASection";

export const metadata: Metadata = {
  title: "Consulenza NIS2 per PMI manifatturiere e industriali",
  description:
    "Percorso di adeguamento NIS2 per soggetti essenziali, importanti e fornitori di filiera: gap analysis, policy PO05-PO09, BCP/DRP, formazione, assessment continuo.",
  alternates: { canonical: "/servizi/nis2" },
};

const triggers = [
  {
    title: "Siete un soggetto essenziale o importante",
    description:
      "Rientrate direttamente nell'ambito di applicazione del D.Lgs. 138/2024 in uno dei settori ad alta criticità (energia, trasporti, manifatturiero critico, digitale) o negli altri settori critici individuati dalla direttiva.",
  },
  {
    title: "Siete fornitori di un soggetto NIS2",
    description:
      "Anche senza rientrare direttamente nel perimetro, ricevete richieste contrattuali di conformità dai vostri clienti soggetti a NIS2, spesso tramite questionari di security assessment o clausole contrattuali specifiche.",
  },
  {
    title: "Rispondete a una capogruppo estera",
    description:
      "Gruppi con casa madre in Germania o altri paesi UE applicano internamente standard NIS2/BSI più stringenti di quelli richiesti in Italia, e li estendono alle controllate.",
  },
  {
    title: "L'assicurazione cyber lo richiede",
    description:
      "Le compagnie assicurative chiedono sempre più spesso una gap analysis documentata come condizione per l'emissione o il rinnovo di polizze cyber risk.",
  },
];

const steps = [
  {
    number: "01",
    title: "Gap analysis",
    description:
      "Fotografia dello stato attuale rispetto alle misure di sicurezza richieste: asset inventory, architettura di rete, gestione accessi, fornitori critici, incident response esistente. Ogni gap viene verificato tecnicamente, non dichiarato via questionario.",
    detail: "Output: report di gap analysis con priorità di rischio e roadmap.",
  },
  {
    number: "02",
    title: "Policy PO05-PO09",
    description:
      "Costruzione del corpo documentale organizzativo richiesto da NIS2: gestione del rischio, gestione degli incidenti, continuità operativa, sicurezza della catena di fornitura, formazione e consapevolezza. Scritte dopo — non prima — della gap analysis.",
    detail: "PO05 Gestione del rischio · PO06 Gestione incidenti · PO07 Continuità operativa · PO08 Supply chain security · PO09 Formazione",
  },
  {
    number: "03",
    title: "BCP/DRP",
    description:
      "Business Continuity Plan e Disaster Recovery Plan costruiti su RTO/RPO reali, verificati con l'IT interno o l'MSP, non stimati a tavolino. Include piano di comunicazione in caso di incidente significativo.",
    detail: "Verifica: test di ripristino, tempi di failover, dipendenze da fornitori terzi.",
  },
  {
    number: "04",
    title: "Formazione",
    description:
      "Awareness training differenziato per ruolo: sessioni operative per il personale, sessioni tecniche per IT e management, simulazioni pratiche (es. phishing simulato, tabletop exercise su incidente).",
    detail: "Formato: workshop in presenza o da remoto, materiali su misura per settore.",
  },
  {
    number: "05",
    title: "Assessment continuo",
    description:
      "NIS2 non è un adempimento una tantum: richiede un ciclo di verifica periodica. Pianifico assessment ricorrenti per mantenere la conformità aggiornata rispetto a nuove minacce, nuovi fornitori, modifiche infrastrutturali.",
    detail: "Cadenza tipica: revisione annuale completa, check-in trimestrali su indicatori chiave.",
  },
];

const scenarios = [
  {
    sector: "Automotive & metalmeccanica",
    context:
      "Fornitore Tier 2 di un gruppo automotive con capogruppo in Germania.",
    challenge:
      "Il cliente tedesco ha richiesto evidenza di misure NIS2-equivalenti tramite questionario BSI entro 60 giorni.",
    approach:
      "Gap analysis rapida focalizzata su segmentazione di rete OT/IT e gestione accessi fornitori terzi, seguita da policy PO05-PO08 e piano di remediation prioritizzato sui gap più critici per il questionario.",
  },
  {
    sector: "Chimica & farmaceutico",
    context: "PMI produttiva con sistemi SCADA e obblighi di continuità critica.",
    challenge:
      "Necessità di dimostrare un piano di disaster recovery credibile per l'assicurazione cyber in scadenza.",
    approach:
      "BIA su linee di produzione critiche, verifica dei backup esistenti, costruzione di un DRP con RTO realistici e test di ripristino documentato prima del rinnovo polizza.",
  },
  {
    sector: "Logistica & servizi",
    context: "Operatore logistico soggetto NIS2 come fornitore di infrastrutture di trasporto.",
    challenge:
      "Assenza di un processo strutturato di incident response e di formazione del personale operativo.",
    approach:
      "Definizione di RACI matrix per la gestione incidenti, formazione differenziata per personale di magazzino e IT, assessment continuo con check trimestrali.",
  },
];

export default function Nis2Page() {
  return (
    <>
      <PageHero
        eyebrow="NIS2 · Direttiva UE 2022/2555"
        title="Conformità NIS2 costruita su un audit tecnico, non su un template."
        description="Supporto PMI manifatturiere e industriali — soggetti diretti e fornitori di filiera — nel percorso di adeguamento NIS2: dalla gap analysis all'assessment continuo."
      >
        <div className="mt-10">
          <Link
            href="/contatti"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-amber px-6 py-3.5 font-sans text-sm font-semibold text-ink transition hover:bg-amber/90"
          >
            Richiedi una gap analysis
          </Link>
        </div>
      </PageHero>

      <section>
        <Container className="py-20 lg:py-24">
          <SectionHeading
            eyebrow="Chi deve muoversi"
            title="Quattro situazioni che portano un'azienda manifatturiera a occuparsi di NIS2"
          />
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {triggers.map((trigger) => (
              <div
                key={trigger.title}
                className="rounded-xl border border-line bg-white/60 p-7"
              >
                <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
                  {trigger.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {trigger.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-line bg-paper-dim">
        <Container className="py-20 lg:py-24">
          <SectionHeading
            eyebrow="Il percorso"
            tone="teal"
            title="Cinque fasi, un metodo verificabile"
            description="Ogni fase produce un output concreto e verificabile, non solo un documento firmato."
          />
          <div className="mt-14 max-w-3xl">
            <MethodSteps steps={steps} />
          </div>
        </Container>
      </section>

      <section>
        <Container className="py-20 lg:py-24">
          <SectionHeading
            eyebrow="Scenari tipo per settore"
            title="Come cambia l'approccio a seconda del contesto industriale"
            description="Esempi di percorso costruiti su situazioni ricorrenti riscontrate nel lavoro con PMI manifatturiere. I casi reali, quando pubblicabili, sono raccolti nella pagina Clienti e casi studio."
          />
          <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {scenarios.map((scenario) => (
              <div
                key={scenario.sector}
                className="flex flex-col rounded-xl border border-line bg-white p-7"
              >
                <span className="font-mono text-xs uppercase tracking-widest text-amber">
                  {scenario.sector}
                </span>
                <p className="mt-4 text-sm font-medium leading-relaxed text-ink">
                  {scenario.context}
                </p>
                <div className="mt-4 flex-1 border-t border-line pt-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted">
                    Sfida
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    {scenario.challenge}
                  </p>
                  <p className="mt-4 text-xs font-medium uppercase tracking-wide text-muted">
                    Approccio
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    {scenario.approach}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CTASection
        title="Non sapete ancora se rientrate nel perimetro NIS2?"
        description="Una call di 30 minuti per chiarire se siete soggetti diretti, fornitori indiretti, o se al momento la normativa non vi riguarda."
        ctaLabel="Verifica la tua posizione"
      />
    </>
  );
}
