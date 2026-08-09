import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Informativa sul trattamento dei dati personali ai sensi degli artt. 13-14 del Regolamento (UE) 2016/679.",
  alternates: { canonical: "/privacy" },
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Documento legale"
        title="Privacy Policy"
        description="Informativa ai sensi degli artt. 13-14 del Regolamento (UE) 2016/679 (GDPR)."
      />
      <Container className="prose prose-sm max-w-3xl py-16 lg:py-20">
        <div className="flex flex-col gap-8 text-sm leading-relaxed text-muted">
          <div>
            <h2 className="font-display text-xl font-semibold text-ink">
              1. Titolare del trattamento
            </h2>
            <p className="mt-3">
              Titolare del trattamento è Gabriele D&apos;Amico, contattabile
              all&apos;indirizzo email {siteConfig.email} e all&apos;indirizzo
              PEC {siteConfig.pec}.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold text-ink">
              2. Dati trattati e finalità
            </h2>
            <p className="mt-3">
              Attraverso il form di contatto raccogliamo nome, azienda,
              email, telefono e il contenuto del messaggio, al solo fine di
              rispondere alle richieste di informazioni o di consulenza
              ricevute. Il conferimento dei dati è facoltativo ma necessario
              per essere ricontattati.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold text-ink">
              3. Base giuridica
            </h2>
            <p className="mt-3">
              Il trattamento si basa sul consenso dell&apos;interessato
              (art. 6.1.a GDPR), prestato tramite il form di contatto, e
              sull&apos;esecuzione di misure precontrattuali richieste
              dall&apos;interessato (art. 6.1.b GDPR).
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold text-ink">
              4. Modalità e conservazione
            </h2>
            <p className="mt-3">
              I dati sono trattati con strumenti informatici e conservati
              per il tempo necessario a gestire la richiesta e, in caso di
              successivo incarico, per la durata del rapporto professionale
              e nel rispetto dei termini di legge previsti per la
              documentazione contabile e fiscale.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold text-ink">
              5. Comunicazione a terzi
            </h2>
            <p className="mt-3">
              I dati non sono diffusi. Possono essere comunicati a soggetti
              terzi che forniscono servizi strumentali (es. hosting, invio
              email) nella loro qualità di responsabili del trattamento
              nominati ai sensi dell&apos;art. 28 GDPR.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold text-ink">
              6. Diritti dell&apos;interessato
            </h2>
            <p className="mt-3">
              È possibile esercitare in qualsiasi momento i diritti previsti
              dagli artt. 15-22 GDPR (accesso, rettifica, cancellazione,
              limitazione, portabilità, opposizione) scrivendo a{" "}
              {siteConfig.email}. È inoltre possibile proporre reclamo al
              Garante per la Protezione dei Dati Personali.
            </p>
          </div>
        </div>
      </Container>
    </>
  );
}
