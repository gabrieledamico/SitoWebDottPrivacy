"use client";

import { FormEvent, useState } from "react";

export default function TdbLogin({ admin = false }: { admin?: boolean }) {
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const password = new FormData(event.currentTarget).get("password");
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(
        admin
          ? "/api/terra-dei-bambini/admin/login"
          : "/api/terra-dei-bambini/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        }
      );

      if (response.ok) {
        window.location.reload();
        return;
      }

      const data = (await response.json().catch(() => ({}))) as { error?: string };
      setError(data.error ?? "Accesso non riuscito.");
    } catch {
      setError("Connessione non riuscita. Riprova.");
    }
    setSubmitting(false);
  }

  return (
    <div className="spunta mx-auto w-full max-w-md rounded-[2rem] border border-linea bg-bianco p-8 text-center shadow-[0_20px_50px_-34px_rgba(56,73,47,0.6)]">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-salvia-scura">
        {admin ? "Area di gestione" : "Accesso riservato"}
      </p>
      <h2 className="mt-3 font-titolo text-3xl font-semibold text-bosco">
        {admin ? "Password di gestione" : "Entra con la password"}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-tenue">
        {admin
          ? "Da qui si vedono i numeri di telefono e si può correggere un'adesione sbagliata."
          : "È la password condivisa nel gruppo WhatsApp delle famiglie."}
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4 text-left">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-salvia-scura">
            Password
          </span>
          <input
            type="password"
            name="password"
            required
            autoFocus
            autoComplete="current-password"
            className="rounded-xl border border-linea bg-panna px-4 py-3 text-testo outline-none transition focus:border-salvia-scura focus:ring-2 focus:ring-salvia/40"
          />
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center rounded-full bg-salvia-scura px-6 py-3.5 font-bold text-bianco transition hover:bg-bosco disabled:opacity-60"
        >
          {submitting ? "Verifica…" : "Entra"}
        </button>

        {error && (
          <p className="rounded-xl bg-argilla-tenue px-4 py-3 text-sm text-argilla">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}
