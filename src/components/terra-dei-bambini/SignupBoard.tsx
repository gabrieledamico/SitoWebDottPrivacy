"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { tdbGroups, type TdbGroup } from "@/lib/terra-dei-bambini/config";
import type { TdbGroupState, TdbState } from "@/lib/terra-dei-bambini/types";

const STORAGE_KEY = "tdb-adesione-2026";
const POLL_MS = 15000;

type MyEntry = { groupId: string; familyName: string };

/**
 * L'adesione di questo browser vive in localStorage: serve solo a ricordare
 * alla famiglia cosa ha già scelto. La regola "un posto per famiglia" è
 * comunque applicata dal server sul numero di telefono.
 */
const listeners = new Set<() => void>();

function subscribeMyEntry(onChange: () => void) {
  listeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

function readRawEntry() {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function saveMyEntry(entry: MyEntry) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entry));
  } catch {
    // spazio non disponibile: la conferma resta comunque a schermo
  }
  listeners.forEach((listener) => listener());
}

export default function SignupBoard({
  initialState,
}: {
  initialState: TdbState | null;
}) {
  const [state, setState] = useState<TdbState | null>(initialState);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  const rawEntry = useSyncExternalStore(
    subscribeMyEntry,
    readRawEntry,
    () => null
  );
  const myEntry = useMemo<MyEntry | null>(() => {
    if (!rawEntry) return null;
    try {
      return JSON.parse(rawEntry) as MyEntry;
    } catch {
      return null;
    }
  }, [rawEntry]);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/terra-dei-bambini/state", {
        cache: "no-store",
      });
      if (response.status === 401) {
        window.location.reload();
        return;
      }
      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        setLoadError(data.error ?? "Non riesco a leggere le adesioni.");
        return;
      }
      setState((await response.json()) as TdbState);
      setLoadError(null);
    } catch {
      setLoadError("Connessione non riuscita: i dati potrebbero non essere aggiornati.");
    }
  }, []);

  // Prima lettura solo se il server non ha già fornito lo stato iniziale.
  useEffect(() => {
    if (state !== null) return;
    const kickoff = window.setTimeout(refresh, 0);
    return () => window.clearTimeout(kickoff);
  }, [state, refresh]);

  useEffect(() => {
    const timer = window.setInterval(refresh, POLL_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [refresh]);

  function handleSuccess(groupId: string, familyName: string, next: TdbState) {
    saveMyEntry({ groupId, familyName });
    setState(next);
    setOpenGroup(null);
  }

  const groupsById = new Map((state?.groups ?? []).map((group) => [group.id, group]));
  const activeGroups = tdbGroups.filter((group) => !group.alternative);
  const alternativeGroups = tdbGroups.filter((group) => group.alternative);

  return (
    <div className="flex flex-col gap-8">
      {myEntry && (
        <div className="rounded-xl border border-teal/30 bg-teal-dim px-5 py-4">
          <p className="font-display text-sm font-semibold text-ink">
            Adesione registrata: {groupLabel(myEntry.groupId)}
          </p>
          <p className="mt-1 text-sm text-ink-3">
            Registrata a nome di {myEntry.familyName}. Ogni famiglia occupa un solo
            posto: per una correzione scrivi a chi gestisce la raccolta.
          </p>
        </div>
      )}

      {loadError && (
        <p className="rounded-xl border border-amber/40 bg-amber-dim px-5 py-4 text-sm text-ink-3">
          {loadError}
        </p>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {activeGroups.map((group) => (
          <GroupCard
            key={group.id}
            group={group}
            groupState={groupsById.get(group.id)}
            loading={state === null}
            open={openGroup === group.id}
            onToggle={() => setOpenGroup(openGroup === group.id ? null : group.id)}
            onSuccess={handleSuccess}
          />
        ))}
      </div>

      {alternativeGroups.length > 0 && (
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-4">
            <span className="h-px flex-1 bg-line" />
            <span className="font-mono text-xs uppercase tracking-widest text-muted">
              In alternativa alle ore
            </span>
            <span className="h-px flex-1 bg-line" />
          </div>
          {alternativeGroups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              groupState={groupsById.get(group.id)}
              loading={state === null}
              open={openGroup === group.id}
              onToggle={() => setOpenGroup(openGroup === group.id ? null : group.id)}
              onSuccess={handleSuccess}
            />
          ))}
        </div>
      )}

      <p className="text-center font-mono text-xs uppercase tracking-widest text-muted">
        {state
          ? `Aggiornato alle ${new Date(state.updatedAt).toLocaleTimeString("it-IT", {
              hour: "2-digit",
              minute: "2-digit",
            })} · si aggiorna da solo`
          : "Caricamento delle adesioni…"}
      </p>
    </div>
  );
}

function groupLabel(groupId: string) {
  return tdbGroups.find((group) => group.id === groupId)?.name ?? groupId;
}

function GroupCard({
  group,
  groupState,
  loading,
  open,
  onToggle,
  onSuccess,
}: {
  group: TdbGroup;
  groupState: TdbGroupState | undefined;
  loading: boolean;
  open: boolean;
  onToggle: () => void;
  onSuccess: (groupId: string, familyName: string, state: TdbState) => void;
}) {
  const taken = groupState?.taken ?? 0;
  const capacity = group.capacity;
  const remaining = Math.max(capacity - taken, 0);
  const preassigned = Boolean(group.preassigned?.length);
  const full = !group.unlimited && remaining === 0;
  const closed = preassigned || full;

  return (
    <div
      className={`flex flex-col rounded-2xl border bg-white p-6 transition ${
        closed ? "border-line opacity-90" : "border-line hover:border-ink/30"
      } ${group.alternative ? "border-dashed" : ""}`}
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-display text-lg font-semibold leading-snug text-ink">
          {group.name}
        </h3>
        <span
          className={`shrink-0 rounded-full px-3 py-1 font-mono text-xs ${
            closed
              ? "bg-paper-dim text-muted"
              : remaining <= 1
                ? "bg-amber-dim text-ink"
                : "bg-teal-dim text-ink"
          }`}
        >
          {loading
            ? "…"
            : group.unlimited
              ? `${taken} famiglie`
              : `${taken}/${capacity} presi`}
        </span>
      </div>

      <ul className="mt-4 flex flex-col gap-1.5 text-sm leading-relaxed text-muted">
        {group.tasks.map((task) => (
          <li key={task} className="flex gap-2">
            <span aria-hidden className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber" />
            <span>{task}</span>
          </li>
        ))}
      </ul>

      {!group.unlimited && (
        <div className="mt-5 flex gap-1" aria-hidden>
          {Array.from({ length: capacity }, (_, index) => (
            <span
              key={index}
              className={`h-1.5 flex-1 rounded-full ${
                index < taken ? "bg-ink" : "bg-line"
              }`}
            />
          ))}
        </div>
      )}

      <div className="mt-4">
        <p className="font-mono text-xs uppercase tracking-widest text-muted">
          Chi si è già segnato
        </p>
        {groupState && groupState.members.length > 0 ? (
          <ul className="mt-2 flex flex-wrap gap-2">
            {groupState.members.map((member) => (
              <li
                key={member.slotIndex}
                className="rounded-full border border-line bg-paper px-3 py-1 text-sm text-ink-3"
              >
                {member.name}
                {member.parentNames ? ` (${member.parentNames})` : ""}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-muted">
            {loading ? "…" : "Ancora nessuno."}
          </p>
        )}
      </div>

      <div className="mt-6">
        {preassigned ? (
          <p className="rounded-md bg-paper-dim px-4 py-3 text-sm text-muted">
            Posti già assegnati.
          </p>
        ) : full ? (
          <p className="rounded-md bg-paper-dim px-4 py-3 text-sm text-muted">
            Gruppo al completo.
          </p>
        ) : (
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={open}
            className="w-full rounded-md bg-amber px-5 py-3 text-sm font-semibold text-ink transition hover:bg-amber/90"
          >
            {open
              ? "Annulla"
              : group.alternative
                ? "Scelgo il contributo economico"
                : `Segnati in questo gruppo${remaining <= 2 ? ` — ${remaining} ${remaining === 1 ? "posto" : "posti"}` : ""}`}
          </button>
        )}
      </div>

      {open && !closed && (
        <SignupForm group={group} onSuccess={onSuccess} onCancel={onToggle} />
      )}
    </div>
  );
}

function SignupForm({
  group,
  onSuccess,
  onCancel,
}: {
  group: TdbGroup;
  onSuccess: (groupId: string, familyName: string, state: TdbState) => void;
  onCancel: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const familyName = String(formData.get("familyName") ?? "").trim();

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/terra-dei-bambini/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groupId: group.id,
          familyName,
          parentNames: String(formData.get("parentNames") ?? "").trim(),
          phone: String(formData.get("phone") ?? "").trim(),
          consent: formData.get("consent") === "on",
        }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        state?: TdbState;
      };

      if (response.status === 401) {
        window.location.reload();
        return;
      }

      if (response.ok && data.ok && data.state) {
        onSuccess(group.id, familyName, data.state);
        return;
      }

      setError(data.error ?? "Non è stato possibile registrare l'adesione.");
    } catch {
      setError("Connessione non riuscita. Riprova.");
    }
    setSubmitting(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-5 flex flex-col gap-4 rounded-xl border border-line bg-paper p-5"
    >
      <label className="flex flex-col gap-1.5">
        <span className="font-mono text-xs uppercase tracking-widest text-muted">
          Nominativo *
        </span>
        <input
          name="familyName"
          required
          maxLength={80}
          autoFocus
          placeholder="Es. Famiglia Rossi"
          className="rounded-md border border-line bg-white px-3.5 py-2.5 text-sm text-body focus:border-ink focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="font-mono text-xs uppercase tracking-widest text-muted">
          Genitore/i di riferimento
        </span>
        <input
          name="parentNames"
          maxLength={120}
          placeholder="Es. Marco e Giulia"
          className="rounded-md border border-line bg-white px-3.5 py-2.5 text-sm text-body focus:border-ink focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="font-mono text-xs uppercase tracking-widest text-muted">
          Numero di telefono *
        </span>
        <input
          name="phone"
          type="tel"
          required
          maxLength={40}
          inputMode="tel"
          placeholder="Es. 333 1234567"
          className="rounded-md border border-line bg-white px-3.5 py-2.5 text-sm text-body focus:border-ink focus:outline-none"
        />
        <span className="text-xs leading-relaxed text-muted">
          È il numero con cui verrai inserito/a nel gruppo WhatsApp di lavoro. Il
          numero non è visibile alle altre famiglie: lo vede solo chi gestisce la
          raccolta delle adesioni.
        </span>
      </label>

      <label className="flex items-start gap-3 text-xs leading-relaxed text-muted">
        <input
          type="checkbox"
          name="consent"
          required
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-line"
        />
        <span>
          Acconsento all&apos;uso di nominativo e numero di telefono per
          l&apos;organizzazione della banca ore e per l&apos;inserimento nel gruppo
          WhatsApp. Il nominativo sarà visibile alle altre famiglie che accedono a
          questa pagina.
        </span>
      </label>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center rounded-md bg-ink px-5 py-3 text-sm font-semibold text-paper transition hover:bg-ink-2 disabled:opacity-60"
        >
          {submitting ? "Registrazione…" : "Conferma adesione"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center justify-center rounded-md border border-line px-5 py-3 text-sm font-semibold text-ink-3 transition hover:border-ink/30"
        >
          Annulla
        </button>
      </div>

      {error && <p className="text-sm text-red-700">{error}</p>}
    </form>
  );
}
