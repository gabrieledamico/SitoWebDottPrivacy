"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

const topics = [
  "NIS2",
  "ISO 27001",
  "GDPR & DPO esterno",
  "Cybersecurity Advisory",
  "Non so ancora, vorrei un consiglio",
];

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    if (!siteConfig.formEndpoint) {
      const subject = encodeURIComponent(
        `Richiesta consulenza — ${formData.get("topic") ?? ""}`
      );
      const body = encodeURIComponent(
        `Nome: ${formData.get("name")}\nAzienda: ${formData.get("company")}\nEmail: ${formData.get("email")}\nTelefono: ${formData.get("phone")}\nArea di interesse: ${formData.get("topic")}\n\nMessaggio:\n${formData.get("message")}`
      );
      window.location.href = `mailto:${siteConfig.email}?subject=${subject}&body=${body}`;
      return;
    }

    setStatus("submitting");
    try {
      const response = await fetch(siteConfig.formEndpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });
      if (response.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-teal/30 bg-teal-dim p-8 text-center">
        <p className="font-display text-lg font-semibold text-ink">
          Richiesta inviata
        </p>
        <p className="mt-2 text-sm text-muted">
          Grazie, la ricontatterò al più presto all&apos;indirizzo indicato.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Nome e cognome" name="name" required />
        <Field label="Azienda" name="company" required />
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Email" name="email" type="email" required />
        <Field label="Telefono" name="phone" type="tel" />
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="font-mono text-xs uppercase tracking-widest text-muted">
          Area di interesse
        </span>
        <select
          name="topic"
          required
          defaultValue=""
          className="rounded-md border border-line bg-white px-3.5 py-2.5 text-sm text-body focus:border-ink focus:outline-none"
        >
          <option value="" disabled>
            Seleziona un&apos;area
          </option>
          {topics.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="font-mono text-xs uppercase tracking-widest text-muted">
          Messaggio
        </span>
        <textarea
          name="message"
          required
          rows={5}
          className="resize-none rounded-md border border-line bg-white px-3.5 py-2.5 text-sm text-body focus:border-ink focus:outline-none"
        />
      </label>

      <label className="flex items-start gap-3 text-xs leading-relaxed text-muted">
        <input
          type="checkbox"
          name="consent"
          required
          className="mt-0.5 h-4 w-4 flex-shrink-0 rounded border-line"
        />
        <span>
          Ho letto l&apos;<Link href="/privacy" className="underline">informativa privacy</Link> e
          acconsento al trattamento dei miei dati per essere ricontattato/a.
        </span>
      </label>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-2 inline-flex items-center justify-center gap-2 rounded-md bg-amber px-6 py-3.5 font-sans text-sm font-semibold text-ink transition hover:bg-amber/90 disabled:opacity-60"
      >
        {status === "submitting" ? "Invio in corso…" : "Invia la richiesta"}
      </button>

      {status === "error" && (
        <p className="text-sm text-red-700">
          Si è verificato un errore. Puoi scrivere direttamente a{" "}
          <a href={`mailto:${siteConfig.email}`} className="underline">
            {siteConfig.email}
          </a>
          .
        </p>
      )}
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-mono text-xs uppercase tracking-widest text-muted">
        {label}
      </span>
      <input
        type={type}
        name={name}
        required={required}
        className="rounded-md border border-line bg-white px-3.5 py-2.5 text-sm text-body focus:border-ink focus:outline-none"
      />
    </label>
  );
}
