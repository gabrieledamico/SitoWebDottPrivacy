import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Informativa sull'uso dei cookie di dottprivacy.it.",
  alternates: { canonical: "/cookie-policy" },
  robots: { index: false, follow: true },
};

export default function CookiePolicyPage() {
  return (
    <>
      <PageHero
        eyebrow="Documento legale"
        title="Cookie Policy"
        description="Informativa sull'utilizzo dei cookie durante la navigazione su questo sito."
      />
      <Container className="max-w-3xl py-16 lg:py-20">
        <div className="flex flex-col gap-8 text-sm leading-relaxed text-muted">
          <div>
            <h2 className="font-display text-xl font-semibold text-ink">
              Cosa sono i cookie
            </h2>
            <p className="mt-3">
              I cookie sono piccoli file di testo che i siti visitati
              inviano al dispositivo dell&apos;utente, dove vengono
              memorizzati per essere ritrasmessi agli stessi siti alla
              visita successiva.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold text-ink">
              Cookie utilizzati su questo sito
            </h2>
            <p className="mt-3">
              Il sito, nella sua configurazione attuale, utilizza
              esclusivamente cookie tecnici strettamente necessari al
              funzionamento del sito stesso, per i quali non è richiesto il
              consenso preventivo dell&apos;utente ai sensi della normativa
              vigente. Non vengono attualmente utilizzati cookie di
              profilazione o cookie di terze parti a fini statistici o di
              marketing.
            </p>
            <p className="mt-3">
              Qualora in futuro venissero introdotti strumenti di analisi
              del traffico o di marketing che comportano l&apos;uso di
              cookie non tecnici, questa informativa sarà aggiornata e
              verrà richiesto il consenso esplicito dell&apos;utente
              tramite apposito banner.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold text-ink">
              Come gestire i cookie
            </h2>
            <p className="mt-3">
              È possibile gestire le preferenze relative ai cookie
              direttamente all&apos;interno del proprio browser ed impedire
              — ad esempio — che terze parti possano installarne. Tramite
              le preferenze del browser è inoltre possibile eliminare i
              cookie installati in passato.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold text-ink">
              Contatti
            </h2>
            <p className="mt-3">
              Per qualsiasi informazione relativa al trattamento dei dati
              personali è possibile scrivere a {siteConfig.email}. Per
              maggiori dettagli si rimanda alla{" "}
              <a href="/privacy" className="underline">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </Container>
    </>
  );
}
