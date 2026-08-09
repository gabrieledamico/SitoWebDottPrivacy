import Link from "next/link";
import Container from "./Container";

export default function CTASection({
  title = "Parliamo del vostro percorso di conformità",
  description = "Una prima chiamata conoscitiva di 30 minuti per capire a che punto siete e quali obblighi vi riguardano davvero.",
  ctaLabel = "Richiedi una consulenza",
}: {
  title?: string;
  description?: string;
  ctaLabel?: string;
}) {
  return (
    <section className="bg-grid bg-ink text-paper">
      <Container className="flex flex-col items-start gap-8 py-20 lg:flex-row lg:items-center lg:justify-between lg:py-24">
        <div className="max-w-xl">
          <h2 className="text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-paper/70">
            {description}
          </p>
        </div>
        <div className="flex flex-shrink-0 flex-col gap-3 sm:flex-row">
          <Link
            href="/contatti"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-amber px-6 py-3.5 font-sans text-sm font-semibold text-ink transition hover:bg-amber/90"
          >
            {ctaLabel}
          </Link>
          <Link
            href="/servizi/nis2"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-paper/25 px-6 py-3.5 font-sans text-sm font-semibold text-paper transition hover:bg-paper/10"
          >
            Vedi il percorso NIS2
          </Link>
        </div>
      </Container>
    </section>
  );
}
