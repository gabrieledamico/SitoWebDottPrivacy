import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import CTASection from "@/components/CTASection";

export const metadata: Metadata = {
  title: "Cybersecurity Advisory e formazione red team / blue team",
  description:
    "Formazione tecnica del personale, simulazioni red team / blue team, revisione delle misure di sicurezza IT per PMI manifatturiere e industriali.",
  alternates: { canonical: "/servizi/cybersecurity-advisory" },
};

const formats = [
  {
    tag: "Awareness",
    title: "Formazione differenziata per ruolo",
    description:
      "Sessioni distinte per personale operativo, amministrativo, IT e management. Contenuti tarati sui rischi reali del ruolo, non un corso generico uguale per tutti.",
  },
  {
    tag: "Simulazione",
    title: "Phishing simulato e tabletop exercise",
    description:
      "Campagne di phishing simulato per misurare l'esposizione reale del personale, seguite da tabletop exercise su scenari di incidente concreti (ransomware, data breach, fermo produzione).",
  },
  {
    tag: "Red / Blue team",
    title: "Simulazioni di attacco e difesa",
    description:
      "Esercitazioni pratiche in cui un team simula tecniche di attacco reali (red team) mentre il personale IT interno pratica rilevamento e risposta (blue team), in un ambiente controllato.",
  },
  {
    tag: "Advisory",
    title: "Revisione delle misure di sicurezza IT",
    description:
      "Analisi tecnica di configurazioni di rete, gestione delle identità, backup e piani di risposta agli incidenti, con raccomandazioni prioritizzate per impatto e sforzo di implementazione.",
  },
];

export default function CybersecurityAdvisoryPage() {
  return (
    <>
      <PageHero
        eyebrow="Cybersecurity Advisory"
        tone="teal"
        title="Formazione che si misura, non che si firma soltanto."
        description="Awareness training tecnico, simulazioni red team / blue team e revisione delle misure di sicurezza IT — per rendere la sicurezza percepita una sicurezza verificata."
      />

      <section>
        <Container className="py-20 lg:py-24">
          <SectionHeading
            eyebrow="Formati"
            title="Quattro modalità di intervento, combinabili in base al contesto"
          />
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {formats.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-line bg-white/60 p-7"
              >
                <span className="font-mono text-xs uppercase tracking-widest text-teal">
                  {item.tag}
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

      <section className="border-y border-line bg-ink text-paper">
        <Container className="py-20 lg:py-24">
          <span className="font-mono text-xs uppercase tracking-widest text-amber">
            Perché funziona
          </span>
          <h2 className="mt-4 max-w-2xl text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            La formazione tradizionale si dimentica. Una simulazione si
            ricorda.
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="rounded-xl border border-line-dark/40 bg-ink-2 p-7">
              <h3 className="font-display text-lg font-semibold tracking-tight">
                Red team
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-paper/70">
                Simula tecniche realistiche di intrusione — phishing mirato,
                tentativi di accesso non autorizzato, social engineering
                controllato — per misurare l&apos;esposizione reale
                dell&apos;organizzazione, non quella dichiarata.
              </p>
            </div>
            <div className="rounded-xl border border-line-dark/40 bg-ink-2 p-7">
              <h3 className="font-display text-lg font-semibold tracking-tight">
                Blue team
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-paper/70">
                Il personale IT interno pratica rilevamento, escalation e
                risposta in un contesto controllato, costruendo playbook
                operativi da riutilizzare in caso di incidente reale.
              </p>
            </div>
          </div>
          <p className="mt-8 max-w-2xl text-sm leading-relaxed text-paper/60">
            L&apos;obiettivo non è dimostrare che qualcuno ha sbagliato, ma
            costruire memoria muscolare organizzativa su come riconoscere e
            rispondere a un tentativo di attacco — requisito esplicito anche
            nelle misure di sicurezza previste da NIS2 e ISO 27001.
          </p>
        </Container>
      </section>

      <CTASection
        title="Volete misurare quanto è pronta la vostra organizzazione a un attacco reale?"
        description="Progettiamo insieme un percorso di formazione e simulazione su misura per il vostro contesto industriale."
      />
    </>
  );
}
