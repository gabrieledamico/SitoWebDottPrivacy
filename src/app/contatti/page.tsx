import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import ContactForm from "@/components/ContactForm";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contatti",
  description:
    "Richiedi una consulenza NIS2, ISO 27001, GDPR o DPO esterno. Contatti, dati dello studio e riferimenti PEC/P.IVA.",
  alternates: { canonical: "/contatti" },
};

export default function ContattiPage() {
  return (
    <>
      <PageHero
        eyebrow="Contatti"
        title="Parliamo del vostro percorso di conformità."
        description="Prima call conoscitiva senza impegno: 30 minuti per capire quali obblighi vi riguardano davvero e da dove partire."
      />

      <section>
        <Container className="py-20 lg:py-24">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
                Dati dello studio
              </h2>
              <dl className="mt-6 flex flex-col gap-5 text-sm">
                <div>
                  <dt className="font-mono text-xs uppercase tracking-widest text-muted">
                    Email
                  </dt>
                  <dd className="mt-1">
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="text-ink hover:underline"
                    >
                      {siteConfig.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-xs uppercase tracking-widest text-muted">
                    Telefono
                  </dt>
                  <dd className="mt-1 text-ink">{siteConfig.phone}</dd>
                </div>
                <div>
                  <dt className="font-mono text-xs uppercase tracking-widest text-muted">
                    PEC
                  </dt>
                  <dd className="mt-1 text-ink">{siteConfig.pec}</dd>
                </div>
                <div>
                  <dt className="font-mono text-xs uppercase tracking-widest text-muted">
                    P.IVA
                  </dt>
                  <dd className="mt-1 text-ink">{siteConfig.piva}</dd>
                </div>
                <div>
                  <dt className="font-mono text-xs uppercase tracking-widest text-muted">
                    Sede
                  </dt>
                  <dd className="mt-1 text-ink">
                    {siteConfig.address.street}
                    <br />
                    {siteConfig.address.zip} {siteConfig.address.city}, Italia
                  </dd>
                </div>
              </dl>

              {siteConfig.bookingUrl ? (
                <a
                  href={siteConfig.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex items-center justify-center gap-2 rounded-md border border-ink px-6 py-3 font-sans text-sm font-semibold text-ink transition hover:bg-ink hover:text-paper"
                >
                  Prenota una call
                </a>
              ) : null}
            </div>

            <div className="rounded-xl border border-line bg-white/60 p-7 lg:p-9">
              <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
                Scrivici
              </h2>
              <p className="mt-2 text-sm text-muted">
                Rispondo entro 1-2 giorni lavorativi.
              </p>
              <div className="mt-8">
                <ContactForm />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
