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
    <div className="mx-auto w-full max-w-md rounded-2xl border border-line bg-white p-8 shadow-sm">
      <p className="font-mono text-xs uppercase tracking-widest text-muted">
        {admin ? "Area di gestione" : "Accesso riservato"}
      </p>
      <h2 className="mt-3 font-display text-2xl font-semibold text-ink">
        {admin ? "Password di gestione" : "Inserisci la password"}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        {admin
          ? "Da qui si vedono i numeri di telefono e si può correggere un'adesione sbagliata."
          : "La password è quella condivisa nel gruppo WhatsApp delle famiglie."}
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-xs uppercase tracking-widest text-muted">
            Password
          </span>
          <input
            type="password"
            name="password"
            required
            autoFocus
            autoComplete="current-password"
            className="rounded-md border border-line bg-paper px-3.5 py-2.5 text-sm text-body focus:border-ink focus:outline-none"
          />
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center rounded-md bg-ink px-6 py-3 text-sm font-semibold text-paper transition hover:bg-ink-2 disabled:opacity-60"
        >
          {submitting ? "Verifica…" : "Entra"}
        </button>

        {error && <p className="text-sm text-red-700">{error}</p>}
      </form>
    </div>
  );
}
