"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { tdbGroups } from "@/lib/terra-dei-bambini/config";

type AdminEntry = {
  id: number;
  groupId: string;
  groupName: string;
  slotIndex: number;
  familyName: string | null;
  parentNames: string | null;
  phone: string | null;
  preassigned: boolean;
  claimedAt: string | null;
};

export default function AdminPanel() {
  const [entries, setEntries] = useState<AdminEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/terra-dei-bambini/admin/entries", {
        cache: "no-store",
      });
      if (response.status === 401) {
        window.location.reload();
        return;
      }
      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? "Non riesco a leggere le adesioni.");
        return;
      }
      const data = (await response.json()) as { entries: AdminEntry[] };
      setEntries(data.entries);
      setError(null);
    } catch {
      setError("Connessione non riuscita.");
    }
  }, []);

  // Prima lettura fuori dal corpo dell'effetto, per non incatenare i render.
  useEffect(() => {
    if (entries !== null) return;
    const kickoff = window.setTimeout(refresh, 0);
    return () => window.clearTimeout(kickoff);
  }, [entries, refresh]);

  async function release(entry: AdminEntry) {
    const label = entry.familyName ?? "questa adesione";
    if (!window.confirm(`Liberare il posto di ${label} in "${entry.groupName}"?`)) {
      return;
    }
    const response = await fetch(
      `/api/terra-dei-bambini/admin/entries?id=${entry.id}`,
      { method: "DELETE" }
    );
    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      setError(data.error ?? "Non è stato possibile liberare il posto.");
      return;
    }
    refresh();
  }

  async function copyPhones(groupId: string, groupName: string) {
    const numbers = (entries ?? [])
      .filter((entry) => entry.groupId === groupId && entry.phone)
      .map((entry) => entry.phone as string);
    if (!numbers.length) return;
    try {
      await navigator.clipboard.writeText(numbers.join("\n"));
      setCopied(groupName);
      window.setTimeout(() => setCopied(null), 2500);
    } catch {
      setError("Copia non riuscita: seleziona i numeri a mano.");
    }
  }

  const byGroup = useMemo(() => {
    const map = new Map<string, AdminEntry[]>();
    for (const entry of entries ?? []) {
      const list = map.get(entry.groupId) ?? [];
      list.push(entry);
      map.set(entry.groupId, list);
    }
    for (const list of map.values()) {
      list.sort((a, b) => a.slotIndex - b.slotIndex);
    }
    return map;
  }, [entries]);

  const total = entries?.length ?? 0;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted">
          {entries === null ? "Caricamento…" : `${total} adesioni registrate.`}
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={refresh}
            className="rounded-md border border-line px-4 py-2 text-sm font-semibold text-ink-3 transition hover:border-ink/30"
          >
            Aggiorna
          </button>
          <a
            href="/api/terra-dei-bambini/admin/export"
            className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-paper transition hover:bg-ink-2"
          >
            Scarica CSV
          </a>
        </div>
      </div>

      {error && (
        <p className="rounded-xl border border-amber/40 bg-amber-dim px-5 py-4 text-sm text-ink-3">
          {error}
        </p>
      )}
      {copied && (
        <p className="rounded-xl border border-teal/30 bg-teal-dim px-5 py-4 text-sm text-ink-3">
          Numeri di «{copied}» copiati negli appunti.
        </p>
      )}

      {tdbGroups.map((group) => {
        const rows = byGroup.get(group.id) ?? [];
        return (
          <section key={group.id} className="rounded-2xl border border-line bg-white p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-lg font-semibold text-ink">
                {group.name}{" "}
                <span className="font-mono text-xs font-normal text-muted">
                  {group.unlimited
                    ? `${rows.length} famiglie`
                    : `${rows.length}/${group.capacity}`}
                </span>
              </h2>
              {rows.some((row) => row.phone) && (
                <button
                  type="button"
                  onClick={() => copyPhones(group.id, group.name)}
                  className="rounded-md border border-line px-3 py-1.5 font-mono text-xs uppercase tracking-widest text-ink-3 transition hover:border-ink/30"
                >
                  Copia numeri
                </button>
              )}
            </div>

            {rows.length === 0 ? (
              <p className="mt-4 text-sm text-muted">Nessuna adesione.</p>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-line font-mono text-xs uppercase tracking-widest text-muted">
                      <th className="py-2 pr-4 font-normal">Nominativo</th>
                      <th className="py-2 pr-4 font-normal">Genitori</th>
                      <th className="py-2 pr-4 font-normal">Telefono</th>
                      <th className="py-2 pr-4 font-normal">Data</th>
                      <th className="py-2 font-normal" />
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((entry) => (
                      <tr key={entry.id} className="border-b border-line/60 align-top">
                        <td className="py-2.5 pr-4 text-ink">{entry.familyName}</td>
                        <td className="py-2.5 pr-4 text-muted">
                          {entry.parentNames ?? "—"}
                        </td>
                        <td className="py-2.5 pr-4 font-mono text-xs text-ink-3">
                          {entry.preassigned ? "già assegnato" : entry.phone}
                        </td>
                        <td className="py-2.5 pr-4 text-xs text-muted">
                          {entry.claimedAt
                            ? new Date(entry.claimedAt).toLocaleString("it-IT", {
                                day: "2-digit",
                                month: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "—"}
                        </td>
                        <td className="py-2.5 text-right">
                          <button
                            type="button"
                            onClick={() => release(entry)}
                            className="font-mono text-xs uppercase tracking-widest text-red-700 hover:underline"
                          >
                            Libera
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
