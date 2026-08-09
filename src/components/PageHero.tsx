import { ReactNode } from "react";
import Container from "./Container";
import Eyebrow from "./Eyebrow";

export default function PageHero({
  eyebrow,
  tone = "amber",
  title,
  description,
  children,
}: {
  eyebrow: string;
  tone?: "amber" | "teal";
  title: ReactNode;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <section className="bg-grid relative overflow-hidden bg-ink text-paper">
      <div
        className="pointer-events-none absolute -top-24 right-[-10%] h-80 w-80 rounded-full opacity-20 blur-3xl"
        style={{
          background:
            tone === "amber"
              ? "radial-gradient(circle, #d98c2b, transparent 70%)"
              : "radial-gradient(circle, #0f8a82, transparent 70%)",
        }}
      />
      <Container className="relative py-20 lg:py-28">
        <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
        <h1 className="text-balance mt-6 max-w-3xl font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-paper/70">
            {description}
          </p>
        )}
        {children}
      </Container>
    </section>
  );
}
