import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import MethodSteps from "@/components/MethodSteps";
import CTASection from "@/components/CTASection";

export const metadata: Metadata = {
  title: "Audit e implementazione ISO 27001 per PMI",
  description:
    "Auditing e implementazione del Sistema di Gestione della Sicurezza delle Informazioni (SGSI) ISO 27001: gap assessment, audit interni, supporto alla certificazione.",
  alternates: { canonical: "/servizi/iso27001" },
};

const steps = [
  {
    number: "01",
    title: "Gap assessment iniziale",
    description:
      "Verifica dello stato attuale rispetto ai 93 controlli dell'Annex A (ISO 27001:2022), con raccolta di evidenze tecniche reali — non solo interviste.",
    detail: "Output: scoring per dominio di controllo e piano di remediation prioritizzato.",
  },
  {
    number: "02",
    title: "Costruzione del SGSI",
    description:
      "Definizione di politica di sicurezza, ruoli e responsabilità, metodologia di risk assessment, Statement of Applicability (SoA) coerente con il contesto reale dell'organizzazione.",
    detail: "Documenti chiave: SoA, risk register, politica di sicurezza delle informazioni.",
  },
  {
    number: "03",
    title: "Implementazione dei controlli",
    description:
      "Supporto operativo nell'implementazione dei controlli mancanti: gestione accessi, crittografia, backup, gestione fornitori, gestione incidenti — in coordinamento con l'IT interno o l'MSP.",
    detail: "Approccio: priorità sui controlli a maggiore impatto sul rischio residuo.",
  },
  {
    number: "04",
    title: "Audit interno",
    description:
      "Conduzione di audit interni secondo la metodologia richiesta dallo standard, come Lead Auditor, con report formale e non conformità classificate per severità.",
    detail: "Frequenza tipica: almeno un ciclo completo prima dell'audit di certificazione.",
  },
  {
    number: "05",
    title: "Supporto alla certificazione",
    description:
      "Affiancamento nella scelta dell'ente di certificazione, preparazione della documentazione, simulazione dell'audit di stage 1 e stage 2, gestione delle non conformità rilevate.",
    detail: "Obiettivo: arrivare all'audit esterno senza sorprese.",
  },
];

const forWho = [
  {
    title: "Aziende che devono certificarsi",
    description:
      "Perché richiesto da un cliente, da un bando, o come requisito di ingresso in una filiera che lo impone contrattualmente.",
  },
  {
    title: "Aziende già certificate",
    description:
      "Che necessitano di audit interni periodici o di un supporto esterno indipendente per il mantenimento della certificazione.",
  },
  {
    title: "Aziende in ambito NIS2",
    description:
      "Che scelgono ISO 27001 come framework di riferimento per strutturare le misure di sicurezza richieste dalla direttiva.",
  },
];

export default function Iso27001Page() {
  return (
    <>
      <PageHero
        eyebrow="ISO 27001 · SGSI"
        tone="teal"
        title="Un SGSI costruito sui controlli reali, non sulla documentazione minima per passare l'audit."
        description="Auditing e implementazione del Sistema di Gestione della Sicurezza delle Informazioni, da Lead Auditor con esperienza diretta sul campo tecnico."
      />

      <section>
        <Container className="py-20 lg:py-24">
          <SectionHeading
            eyebrow="Per chi"
            title="A chi è utile questo percorso"
          />
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {forWho.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-line bg-white/60 p-7"
              >
                <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
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

      <section className="border-y border-line bg-paper-dim">
        <Container className="py-20 lg:py-24">
          <SectionHeading
            eyebrow="Il percorso"
            tone="teal"
            title="Dal gap assessment alla certificazione"
          />
          <div className="mt-14 max-w-3xl">
            <MethodSteps steps={steps} />
          </div>
        </Container>
      </section>

      <section>
        <Container className="py-20 lg:py-24">
          <div className="rounded-xl border border-line bg-white p-8 lg:p-10">
            <span className="font-mono text-xs uppercase tracking-widest text-teal">
              Perché il profilo conta
            </span>
            <h2 className="mt-4 max-w-2xl font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              Un audit ISO 27001 non è un questionario compilato dal cliente
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
              Molti gap assessment si basano su interviste e checklist
              autodichiarate. Da Lead Auditor con esperienza tecnica diretta,
              verifico le evidenze — configurazioni, log, procedure
              effettivamente in uso — prima di dichiarare un controllo
              conforme. È più lento, ma è l&apos;unico modo per arrivare
              all&apos;audit di certificazione senza sorprese.
            </p>
          </div>
        </Container>
      </section>

      <CTASection
        title="Volete sapere quanto siete lontani dalla certificazione?"
        description="Un gap assessment iniziale restituisce una fotografia chiara, con priorità di intervento."
        ctaLabel="Richiedi un gap assessment"
      />
    </>
  );
}
