import Link from "next/link";
import Container from "./Container";
import Eyebrow from "./Eyebrow";

const triggers = [
  "Siete fornitori di filiera con obblighi NIS2 a cascata",
  "La capogruppo estera chiede conformità documentata",
  "L'assicurazione richiede una gap analysis prima del rinnovo",
];

export default function HomeHero() {
  return (
    <section className="bg-grid relative overflow-hidden bg-ink text-paper">
      <div
        className="pointer-events-none absolute -top-32 right-[-15%] h-[32rem] w-[32rem] rounded-full opacity-25 blur-3xl"
        style={{
          background: "radial-gradient(circle, #d98c2b, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute bottom-[-20%] left-[-10%] h-96 w-96 rounded-full opacity-20 blur-3xl"
        style={{
          background: "radial-gradient(circle, #0f8a82, transparent 70%)",
        }}
      />
      <Container className="relative py-24 lg:py-32">
        <Eyebrow>NIS2 · ISO 27001 · GDPR — per il manifatturiero</Eyebrow>

        <h1 className="text-balance mt-7 max-w-4xl font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
          Il consulente che parla sia il linguaggio del{" "}
          <span className="text-amber">Garante</span> che quello del tuo{" "}
          <span className="text-teal">IT manager</span>.
        </h1>

        <p className="mt-7 max-w-2xl text-lg leading-relaxed text-paper/75">
          Supporto PMI manifatturiere e industriali nella conformità NIS2,
          GDPR e ISO 27001. Le policy che scrivo nascono da un audit tecnico
          vero — asset inventory, BIA, gap analysis — non da un template
          riciclato.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Link
            href="/contatti"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-amber px-6 py-3.5 font-sans text-sm font-semibold text-ink transition hover:bg-amber/90"
          >
            Richiedi una gap analysis NIS2
          </Link>
          <Link
            href="/servizi/nis2"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-paper/25 px-6 py-3.5 font-sans text-sm font-semibold text-paper transition hover:bg-paper/10"
          >
            Scopri il percorso NIS2
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-3 border-t border-paper/10 pt-10 sm:grid-cols-3">
          {triggers.map((trigger) => (
            <div key={trigger} className="flex items-start gap-3">
              <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-amber/40 font-mono text-[10px] text-amber">
                !
              </span>
              <p className="text-sm leading-relaxed text-paper/70">
                {trigger}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
