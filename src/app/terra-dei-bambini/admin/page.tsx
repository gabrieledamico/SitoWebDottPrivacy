import type { Metadata } from "next";
import Container from "@/components/Container";
import AdminPanel from "@/components/terra-dei-bambini/AdminPanel";
import TdbLogin from "@/components/terra-dei-bambini/TdbLogin";
import { hasValidSession, isPasswordConfigured } from "@/lib/terra-dei-bambini/auth";
import { isDatabaseConfigured } from "@/lib/terra-dei-bambini/db";

// Pagina privata: mai prerenderizzata, viene renderizzata a ogni richiesta
// perché dipende dal cookie di sessione e dallo stato del database.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Banca ore — gestione",
  robots: { index: false, follow: false, nocache: true },
};

export default async function TerraDeiBambiniAdminPage() {
  const configured = isPasswordConfigured("admin") && isDatabaseConfigured();
  const authorized = configured && (await hasValidSession("admin"));

  return (
    <Container className="py-16 lg:py-20">
      <p className="font-mono text-xs uppercase tracking-widest text-muted">
        La Terra dei Bambini · banca ore 2026/2027
      </p>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink">
        Gestione delle adesioni
      </h1>

      <div className="mt-10">
        {!configured ? (
          <p className="rounded-xl border border-amber/40 bg-amber-dim px-5 py-4 text-sm text-ink-3">
            Mancano <code className="font-mono">DATABASE_URL</code> o{" "}
            <code className="font-mono">TDB_ADMIN_PASSWORD</code>.
          </p>
        ) : authorized ? (
          <AdminPanel />
        ) : (
          <TdbLogin admin />
        )}
      </div>
    </Container>
  );
}
