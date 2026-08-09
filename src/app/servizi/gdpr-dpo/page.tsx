import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import CTASection from "@/components/CTASection";

export const metadata: Metadata = {
  title: "DPO esterno e consulenza GDPR",
  description:
    "Servizio di Data Protection Officer esterno e consulenza GDPR: registro trattamenti, DPIA, gestione data breach, rapporti con il Garante. ~10 mandati attivi.",
  alternates: { canonical: "/servizi/gdpr-dpo" },
};

const dpoServices = [
  {
    title: "Nomina come DPO esterno",
    description:
      "Assunzione del ruolo di Responsabile della Protezione dei Dati ai sensi dell'art. 37 GDPR, con punto di contatto diretto per interessati e Autorità di controllo.",
  },
  {
    title: "Registro dei trattamenti",
    description:
      "Costruzione e mantenimento del registro, con mappatura reale dei flussi di dati tra reparti, fornitori e sistemi — non un modello compilato una tantum.",
  },
  {
    title: "DPIA e valutazioni d'impatto",
    description:
      "Valutazioni d'impatto sulla protezione dei dati per trattamenti ad alto rischio, con analisi tecnica delle misure di sicurezza effettivamente in essere.",
  },
  {
    title: "Gestione data breach",
    description:
      "Procedura di gestione degli incidenti con supporto nella notifica al Garante entro 72 ore, quando dovuta, e comunicazione agli interessati.",
  },
  {
    title: "Formazione privacy",
    description:
      "Sessioni di formazione per il personale su obblighi GDPR, gestione delle richieste degli interessati, riconoscimento di potenziali incidenti.",
  },
  {
    title: "Audit periodici di conformità",
    description:
      "Verifiche ricorrenti sullo stato di conformità, aggiornate rispetto a nuovi trattamenti, nuovi fornitori o modifiche normative.",
  },
];

export default function GdprDpoPage() {
  return (
    <>
      <PageHero
        eyebrow="GDPR · DPO esterno"
        title="Un DPO che conosce anche l'infrastruttura che tratta i dati."
        description="Consulenza GDPR e servizio di Data Protection Officer esterno per aziende che vogliono una conformità sostanziale, non solo un registro trattamenti compilato."
      />

      <section>
        <Container className="py-20 lg:py-24">
          <SectionHeading
            eyebrow="Il servizio"
            title="Cosa comprende l'incarico di DPO esterno"
            description="Circa 10 mandati attivi come DPO esterno, per aziende di dimensioni e settori diversi."
          />
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {dpoServices.map((item) => (
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
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            <div>
              <SectionHeading
                eyebrow="Perché la parte tecnica conta"
                tone="teal"
                title="Un DPO che non capisce l'infrastruttura non può valutare il rischio"
              />
              <p className="mt-6 text-sm leading-relaxed text-muted">
                Molte DPIA vengono compilate sulla base di dichiarazioni del
                reparto IT, senza verifica indipendente. Il mio approccio
                prevede la lettura diretta di configurazioni, misure di
                sicurezza e flussi di dati reali, per fornire un parere
                davvero indipendente su rischi e misure di mitigazione —
                come richiede il ruolo del DPO secondo il GDPR.
              </p>
            </div>
            <div className="rounded-xl border border-line bg-white p-7">
              <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
                GDPR e NIS2 insieme
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Per molte PMI manifatturiere, gli obblighi GDPR e NIS2 si
                sovrappongono su misure di sicurezza, gestione incidenti e
                formazione. Gestire entrambi con lo stesso interlocutore
                evita duplicazioni di lavoro e incoerenze tra i due set di
                policy.
              </p>
              <a
                href="/servizi/nis2"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink"
              >
                Scopri il percorso NIS2 →
              </a>
            </div>
          </div>
        </Container>
      </section>

      <CTASection
        title="Cercate un DPO esterno o volete rivedere il vostro registro trattamenti?"
        description="Prima call conoscitiva senza impegno per valutare lo stato attuale."
      />
    </>
  );
}
