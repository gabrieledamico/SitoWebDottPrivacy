import type { Metadata } from "next";
import Container from "@/components/Container";
import SignupBoard from "@/components/terra-dei-bambini/SignupBoard";
import TdbLogin from "@/components/terra-dei-bambini/TdbLogin";
import { hasValidSession, isPasswordConfigured } from "@/lib/terra-dei-bambini/auth";
import { regolamento, tdbConfig } from "@/lib/terra-dei-bambini/config";
import { isDatabaseConfigured } from "@/lib/terra-dei-bambini/db";
import { getPublicState } from "@/lib/terra-dei-bambini/state";
import type { TdbState } from "@/lib/terra-dei-bambini/types";

// Pagina privata: mai prerenderizzata, viene renderizzata a ogni richiesta
// perché dipende dal cookie di sessione e dallo stato del database.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: tdbConfig.title,
  // Pagina privata e temporanea: fuori dal menu, fuori dalla sitemap, non indicizzata.
  robots: { index: false, follow: false, nocache: true },
};

export default async function TerraDeiBambiniPage() {
  const configured = isPasswordConfigured("family") && isDatabaseConfigured();
  const authorized = configured && (await hasValidSession("family"));

  // Stato iniziale renderizzato dal server: la bacheca parte già popolata e poi
  // continua ad aggiornarsi da sola. Se il database non risponde, ci pensa il
  // client al primo giro di aggiornamento.
  let initialState: TdbState | null = null;
  if (authorized) {
    try {
      initialState = await getPublicState();
    } catch {
      initialState = null;
    }
  }

  return (
    <>
      <section className="bg-grid relative overflow-hidden bg-ink text-paper">
        <div
          className="pointer-events-none absolute -top-24 right-[-10%] h-80 w-80 rounded-full opacity-25 blur-3xl"
          style={{ background: "radial-gradient(circle, #0f8a82, transparent 70%)" }}
        />
        <Container className="relative py-16 lg:py-20">
          <p className="font-mono text-xs uppercase tracking-widest text-teal-dim">
            Progetto parentale · anno 2026/2027
          </p>
          <h1 className="text-balance mt-5 max-w-3xl font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl">
            Banca ore — La Terra dei Bambini
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-paper/70">
            {tdbConfig.subtitle}: ogni famiglia sceglie il gruppo in cui mettere a
            disposizione le proprie ore di servizio.
          </p>
        </Container>
      </section>

      <Container className="py-14 lg:py-20">
        {!configured ? (
          <SetupNotice />
        ) : !authorized ? (
          <div className="flex flex-col gap-10">
            <TdbLogin />
            <p className="mx-auto max-w-md text-center text-sm leading-relaxed text-muted">
              Questa pagina è riservata alle famiglie della Terra dei Bambini e
              resterà online solo per il tempo necessario a raccogliere le adesioni.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-14">
            <Regolamento />
            <ComeFunziona />
            <div className="flex flex-col gap-8">
              <div>
                <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
                  {tdbConfig.subtitle}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
                  {tdbConfig.intro}
                </p>
              </div>
              <SignupBoard initialState={initialState} />
            </div>
            <Chiusura />
          </div>
        )}
      </Container>
    </>
  );
}

function Regolamento() {
  return (
    <section className="rounded-2xl border border-line bg-white p-7 sm:p-10">
      <p className="font-mono text-xs uppercase tracking-widest text-muted">
        Dal regolamento dell&apos;associazione
      </p>
      <h2 className="mt-3 font-display text-2xl font-semibold leading-snug text-ink">
        {regolamento.heading}
      </h2>
      <p className="mt-1 font-display text-base font-semibold text-ink-3">
        {regolamento.section}
      </p>

      <div className="mt-6 flex flex-col gap-4 text-sm leading-relaxed text-body sm:text-base">
        {regolamento.paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 40)}>{paragraph}</p>
        ))}
      </div>

      <blockquote className="mt-6 border-l-2 border-amber bg-amber-dim/40 px-5 py-4 text-sm leading-relaxed text-ink-3 sm:text-base">
        {regolamento.highlight}
      </blockquote>

      <p className="mt-6 text-sm leading-relaxed text-body sm:text-base">
        {regolamento.closing}
      </p>
    </section>
  );
}

const steps = [
  {
    title: "Scegli il gruppo",
    text: "Ogni gruppo ha un numero chiuso di posti. Quando sono tutti presi il gruppo si blocca da solo.",
  },
  {
    title: "Lascia i tuoi riferimenti",
    text: "Nominativo e numero di telefono: il numero serve per l'inserimento nel gruppo WhatsApp di lavoro.",
  },
  {
    title: "Un posto per famiglia",
    text: "Chi non riesce a collocarsi in nessun gruppo sceglie il contributo economico, come previsto dal regolamento.",
  },
];

function ComeFunziona() {
  return (
    <section className="grid grid-cols-1 gap-5 sm:grid-cols-3">
      {steps.map((step, index) => (
        <div key={step.title} className="rounded-xl border border-line bg-paper-dim p-6">
          <span className="font-mono text-xs text-amber">0{index + 1}</span>
          <h3 className="mt-2 font-display text-base font-semibold text-ink">
            {step.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{step.text}</p>
        </div>
      ))}
    </section>
  );
}

function Chiusura() {
  return (
    <p className="border-t border-line pt-8 text-center text-xs leading-relaxed text-muted">
      Pagina temporanea per le famiglie della Terra dei Bambini. I dati raccolti
      (nominativo e numero di telefono) servono solo a organizzare la banca ore
      2026/2027 e vengono cancellati a raccolta conclusa. Alle altre famiglie è
      visibile il solo nominativo.
    </p>
  );
}

function SetupNotice() {
  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-amber/40 bg-amber-dim px-6 py-8 text-center">
      <h2 className="font-display text-xl font-semibold text-ink">
        Pagina non ancora attiva
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-ink-3">
        Mancano le variabili d&apos;ambiente <code className="font-mono">DATABASE_URL</code>,{" "}
        <code className="font-mono">TDB_PASSWORD</code> e{" "}
        <code className="font-mono">TDB_ADMIN_PASSWORD</code>. Le istruzioni sono nel
        README del sito.
      </p>
    </div>
  );
}
