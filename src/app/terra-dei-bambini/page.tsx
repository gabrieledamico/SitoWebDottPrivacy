import type { Metadata } from "next";
import Container from "@/components/Container";
import AlberoAnimato from "@/components/terra-dei-bambini/AlberoAnimato";
import Colline from "@/components/terra-dei-bambini/Colline";
import EsciBottone from "@/components/terra-dei-bambini/EsciBottone";
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
      <section className="trama-carta relative overflow-hidden">
        <Container className="relative pt-12 pb-4 text-center lg:pt-16">
          <AlberoAnimato priorita />
          <p className="mt-7 font-sans text-xs font-bold uppercase tracking-[0.2em] text-salvia-scura">
            Progetto parentale · anno 2026/2027
          </p>
          <h1 className="text-balance mx-auto mt-3 max-w-3xl font-titolo text-4xl font-semibold leading-[1.05] tracking-tight text-bosco sm:text-6xl">
            La banca ore della Terra dei Bambini
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-tenue">
            {tdbConfig.subtitle}: ogni famiglia sceglie il gruppo in cui mettere a
            disposizione le proprie ore di servizio.
          </p>
        </Container>
        <Colline />
      </section>

      <div className="bg-salvia-chiara/40">
        <Container className="py-12 lg:py-16">
          {!configured ? (
            <SetupNotice />
          ) : !authorized ? (
            <div className="flex flex-col gap-8">
              <TdbLogin />
              <p className="mx-auto max-w-md text-center text-sm leading-relaxed text-tenue">
                Questa pagina è riservata alle famiglie della Terra dei Bambini e
                resterà online solo per il tempo necessario a raccogliere le adesioni.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-14">
              <Regolamento />
              <ComeFunziona />
              <div className="flex flex-col gap-8">
                <div className="text-center">
                  <h2 className="font-titolo text-3xl font-semibold text-bosco sm:text-4xl">
                    {tdbConfig.subtitle}
                  </h2>
                  <p className="mx-auto mt-3 max-w-2xl leading-relaxed text-tenue">
                    {tdbConfig.intro}
                  </p>
                </div>
                <SignupBoard initialState={initialState} />
              </div>
              <Chiusura />
            </div>
          )}
        </Container>
      </div>
    </>
  );
}

function Regolamento() {
  return (
    <section className="spunta rounded-[2rem] border border-linea bg-bianco p-7 shadow-[0_18px_40px_-30px_rgba(56,73,47,0.5)] sm:p-10">
      <div className="flex flex-wrap items-center gap-3">
        <SemeDecorativo />
        <p className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-salvia-scura">
          Dal regolamento dell&apos;associazione
        </p>
      </div>
      <h2 className="mt-4 font-titolo text-2xl font-semibold leading-snug text-bosco sm:text-3xl">
        {regolamento.heading}
      </h2>
      <p className="mt-1 font-titolo text-lg font-semibold text-salvia-scura">
        {regolamento.section}
      </p>

      <div className="mt-6 flex flex-col gap-4 leading-relaxed text-testo">
        {regolamento.paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 40)}>{paragraph}</p>
        ))}
      </div>

      <blockquote className="mt-6 rounded-2xl border-l-4 border-salvia bg-salvia-tenue px-6 py-5 leading-relaxed text-bosco">
        {regolamento.highlight}
      </blockquote>

      <p className="mt-6 leading-relaxed text-testo">{regolamento.closing}</p>
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
        <div
          key={step.title}
          className="rounded-[1.75rem] border border-linea bg-bianco/80 p-6 text-center"
        >
          <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-salvia-chiara font-titolo text-lg font-semibold text-bosco">
            {index + 1}
          </span>
          <h3 className="mt-3 font-titolo text-xl font-semibold text-bosco">
            {step.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-tenue">{step.text}</p>
        </div>
      ))}
    </section>
  );
}

function Chiusura() {
  return (
    <div className="flex flex-col items-center gap-4 border-t border-linea pt-8">
      <SemeDecorativo />
      <p className="max-w-2xl text-center text-xs leading-relaxed text-tenue">
        Pagina temporanea per le famiglie della Terra dei Bambini. I dati raccolti
        (nominativo e numero di telefono) servono solo a organizzare la banca ore
        2026/2027 e vengono cancellati a raccolta conclusa. Alle altre famiglie è
        visibile il solo nominativo.
      </p>
      <EsciBottone etichetta="Esci da questa pagina" />
    </div>
  );
}

function SemeDecorativo() {
  return (
    <svg aria-hidden width="22" height="22" viewBox="0 0 16 16" className="ondeggia">
      <path
        d="M8 1c3.2 2.1 4.6 5 4.6 7.4A4.6 4.6 0 0 1 8 15a4.6 4.6 0 0 1-4.6-6.6C3.4 6 4.8 3.1 8 1Z"
        fill="var(--color-salvia)"
      />
      <path d="M8 3.4V13" stroke="var(--color-bosco)" strokeOpacity="0.35" strokeWidth="0.9" />
    </svg>
  );
}

function SetupNotice() {
  return (
    <div className="mx-auto max-w-xl rounded-[2rem] border border-argilla/40 bg-argilla-tenue px-6 py-8 text-center">
      <h2 className="font-titolo text-2xl font-semibold text-bosco">
        Pagina non ancora attiva
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-testo">
        Mancano le variabili d&apos;ambiente <code className="font-mono">DATABASE_URL</code>,{" "}
        <code className="font-mono">TDB_PASSWORD</code> e{" "}
        <code className="font-mono">TDB_ADMIN_PASSWORD</code>. Le istruzioni sono nel
        README.
      </p>
    </div>
  );
}
