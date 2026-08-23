"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * Chiude la sessione — sia quella delle famiglie sia quella di gestione — e
 * riporta alla richiesta della password. Serve per passare da un accesso
 * all'altro e per lasciare pulito un dispositivo condiviso.
 */
export default function EsciBottone({
  variante = "discreto",
  etichetta = "Esci",
}: {
  variante?: "discreto" | "evidente";
  etichetta?: string;
}) {
  const [inCorso, setInCorso] = useState(false);
  const router = useRouter();

  async function esci() {
    setInCorso(true);
    try {
      await fetch("/api/terra-dei-bambini/logout", { method: "POST" });
    } catch {
      // anche se la chiamata non riesce, tanto vale riportare all'ingresso
    }
    router.replace("/terra-dei-bambini");
    router.refresh();
  }

  const stile =
    variante === "evidente"
      ? "rounded-full border border-linea bg-bianco px-4 py-2 text-sm font-bold text-testo transition hover:border-salvia hover:text-bosco"
      : "text-xs font-bold text-salvia-scura underline underline-offset-2 transition hover:text-bosco";

  return (
    <button type="button" onClick={esci} disabled={inCorso} className={`${stile} disabled:opacity-60`}>
      {inCorso ? "Uscita…" : etichetta}
    </button>
  );
}
