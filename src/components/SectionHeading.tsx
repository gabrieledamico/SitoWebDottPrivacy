import { ReactNode } from "react";
import Eyebrow from "./Eyebrow";

export default function SectionHeading({
  eyebrow,
  tone = "amber",
  title,
  description,
  align = "left",
}: {
  eyebrow: string;
  tone?: "amber" | "teal";
  title: ReactNode;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
      <h2
        className={`text-balance mt-5 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl ${
          align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-4 text-base leading-relaxed text-muted ${
            align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
