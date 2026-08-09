import type { Metadata } from "next";
import HomeHero from "@/components/HomeHero";
import CredentialsStrip from "@/components/CredentialsStrip";
import StatsBand from "@/components/StatsBand";
import ServicePillars from "@/components/ServicePillars";
import TwoLanguages from "@/components/TwoLanguages";
import ClientLogos from "@/components/ClientLogos";
import CTASection from "@/components/CTASection";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Consulente NIS2, ISO 27001 e DPO esterno per PMI manifatturiere",
  description:
    "Consulenza NIS2, ISO 27001, GDPR e DPO esterno per PMI manifatturiere e industriali. Gap analysis, policy e audit tecnico da un unico interlocutore.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <HomeHero />
      <CredentialsStrip />
      <StatsBand />
      <ServicePillars />
      <TwoLanguages />

      <section>
        <Container className="py-20 lg:py-28">
          <SectionHeading
            eyebrow="Perché ora"
            tone="teal"
            title="NIS2 non è più un problema del reparto IT"
            description="Se siete fornitori di un soggetto essenziale o importante, o parte di un gruppo con capogruppo estera, la conformità NIS2 arriva a voi come requisito contrattuale — non come opzione."
          />
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {[
              {
                title: "Filiera e fornitori critici",
                description:
                  "I soggetti NIS2 stanno già chiedendo ai fornitori evidenze di misure di sicurezza adeguate, spesso via questionari o clausole contrattuali.",
              },
              {
                title: "Capogruppo estera",
                description:
                  "Gruppi con casa madre in Germania o altri paesi UE applicano standard di conformità che la controllata italiana deve poter dimostrare.",
              },
              {
                title: "Assicurazioni e cyber policy",
                description:
                  "Le polizze cyber richiedono sempre più spesso una gap analysis documentata come condizione per l'emissione o il rinnovo.",
              },
            ].map((item) => (
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

      <ClientLogos />

      <CTASection />
    </>
  );
}
