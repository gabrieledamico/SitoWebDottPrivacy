import Container from "./Container";
import Eyebrow from "./Eyebrow";

const columns = [
  {
    tone: "amber" as const,
    label: "Il linguaggio del Garante",
    heading: "Normativa",
    items: [
      "Registro dei trattamenti e basi giuridiche",
      "DPIA e valutazioni d'impatto",
      "Policy PO05-PO09 per la conformità NIS2",
      "Gestione data breach e rapporti con le Autorità",
    ],
  },
  {
    tone: "teal" as const,
    label: "Il linguaggio dell'IT manager",
    heading: "Tecnica",
    items: [
      "Asset inventory e mappatura dei sistemi",
      "Business Impact Analysis (BIA) validata sul campo",
      "Gap analysis ISO 27001 su controlli reali, non su checklist",
      "Awareness training red team / blue team",
    ],
  },
];

export default function TwoLanguages() {
  return (
    <section className="bg-ink text-paper">
      <Container className="py-20 lg:py-28">
        <Eyebrow tone="paper">Il differenziale</Eyebrow>
        <h2 className="text-balance mt-5 max-w-2xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Molti consulenti privacy sanno scrivere policy.
          <br className="hidden sm:block" /> Pochi sanno anche fare
          l&apos;audit tecnico che le rende vere.
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-paper/70">
          Una policy scritta senza aver mai letto un asset inventory è un
          documento di carta. Il mio lavoro comincia dove finisce quello dei
          consulenti puramente legali: verifico tecnicamente ciò che scrivo.
        </p>

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {columns.map((col) => (
            <div
              key={col.heading}
              className="rounded-xl border border-line-dark/40 bg-ink-2 p-8"
            >
              <span
                className={`font-mono text-xs uppercase tracking-widest ${
                  col.tone === "amber" ? "text-amber" : "text-teal"
                }`}
              >
                {col.label}
              </span>
              <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight">
                {col.heading}
              </h3>
              <ul className="mt-6 flex flex-col gap-3.5">
                {col.items.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-paper/80">
                    <span
                      className={`mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${
                        col.tone === "amber" ? "bg-amber" : "bg-teal"
                      }`}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center gap-3 font-mono text-xs uppercase tracking-widest text-paper/40">
          <span className="h-px w-10 bg-paper/20" />
          Un solo interlocutore, due competenze
          <span className="h-px w-10 bg-paper/20" />
        </div>
      </Container>
    </section>
  );
}
