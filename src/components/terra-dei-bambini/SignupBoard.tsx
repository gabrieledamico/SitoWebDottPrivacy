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

function dimenticaMyEntry() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // niente da fare: il promemoria sparirà comunque al prossimo giro
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

  const rawEntry = useSyncExternalStore(subscribeMyEntry, readRawEntry, () => null);
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

  // Se l'adesione è stata liberata dalla gestione, il promemoria su questo
  // browser non ha più senso: sparisce da solo al primo aggiornamento.
  useEffect(() => {
    if (!state || !myEntry) return;
    const gruppo = state.groups.find((g) => g.id === myEntry.groupId);
    const ancoraIscritta = gruppo?.members.some((m) => m.name === myEntry.familyName);
    if (!ancoraIscritta) dimenticaMyEntry();
  }, [state, myEntry]);

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
        <div className="spunta flex items-start gap-4 rounded-[1.75rem] border border-salvia bg-salvia-chiara px-6 py-5">
          <Foglia className="mt-0.5 shrink-0" />
          <div>
            <p className="font-titolo text-lg font-semibold text-bosco">
              Adesione registrata: {groupLabel(myEntry.groupId)}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-testo">
              Registrata a nome di {myEntry.familyName}. Ogni famiglia occupa un solo
              posto: per una correzione scrivi a chi gestisce la raccolta.
            </p>
            <button
              type="button"
              onClick={dimenticaMyEntry}
              className="mt-2 text-xs font-bold text-salvia-scura underline underline-offset-2 transition hover:text-bosco"
            >
              Non è la tua adesione? Nascondi questo promemoria
            </button>
          </div>
        </div>
      )}

      {loadError && (
        <p className="rounded-2xl border border-argilla/40 bg-argilla-tenue px-6 py-4 text-sm text-testo">
          {loadError}
        </p>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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
            <span className="h-px flex-1 bg-linea" />
            <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-salvia-scura">
              In alternativa alle ore
            </span>
            <span className="h-px flex-1 bg-linea" />
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

      <p className="text-center text-xs font-semibold uppercase tracking-[0.16em] text-tenue">
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

function Foglia({ className = "", size = 20 }: { className?: string; size?: number }) {
  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 16 16"
      className={className}
    >
      <path
        d="M8 1c3.2 2.1 4.6 5 4.6 7.4A4.6 4.6 0 0 1 8 15a4.6 4.6 0 0 1-4.6-6.6C3.4 6 4.8 3.1 8 1Z"
        fill="var(--color-salvia)"
      />
      <path d="M8 3.4V13" stroke="var(--color-bosco)" strokeOpacity="0.35" strokeWidth="0.9" />
    </svg>
  );
}

/** I posti del gruppo, disegnati come semini: pieni quelli presi. */
function Semini({ presi, totale }: { presi: number; totale: number }) {
  return (
    <div className="mt-5 flex flex-wrap gap-1.5" aria-hidden>
      {Array.from({ length: totale }, (_, index) => (
        <span
          key={index}
          className={`h-3 w-3 rounded-full border transition ${
            index < presi
              ? "border-salvia-scura bg-salvia-scura"
              : "border-salvia/60 bg-bianco"
          }`}
        />
      ))}
    </div>
  );
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
      className={`flex flex-col rounded-[1.75rem] border bg-bianco p-6 transition duration-300 sm:p-7 ${
        closed
          ? "border-linea opacity-95"
          : "border-linea shadow-[0_18px_40px_-34px_rgba(56,73,47,0.55)] hover:-translate-y-1 hover:border-salvia hover:shadow-[0_26px_50px_-32px_rgba(56,73,47,0.55)]"
      } ${group.alternative ? "border-dashed" : ""}`}
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-titolo text-xl font-semibold leading-snug text-bosco sm:text-2xl">
          {group.name}
        </h3>
        <span
          className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-bold ${
            closed
              ? "bg-panna-scura text-tenue"
              : remaining <= 1
                ? "bg-argilla-tenue text-argilla"
                : "bg-salvia-chiara text-bosco"
          }`}
        >
          {loading
            ? "…"
            : group.unlimited
              ? `${taken} famiglie`
              : `${taken}/${capacity}`}
        </span>
      </div>

      <ul className="mt-4 flex flex-col gap-2 leading-relaxed text-tenue">
        {group.tasks.map((task) => (
          <li key={task} className="flex gap-2.5">
            <Foglia size={14} className="mt-1 shrink-0" />
            <span>{task}</span>
          </li>
        ))}
      </ul>

      {!group.unlimited && <Semini presi={taken} totale={capacity} />}

      <div className="mt-5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-salvia-scura">
          Chi si è già segnato
        </p>
        {groupState && groupState.members.length > 0 ? (
          <ul className="mt-2.5 flex flex-wrap gap-2">
            {groupState.members.map((member) => (
              <li
                key={member.slotIndex}
                className="rounded-full bg-salvia-tenue px-3.5 py-1.5 text-sm font-semibold text-bosco"
              >
                {member.name}
                {member.parentNames ? (
                  <span className="font-normal text-tenue"> ({member.parentNames})</span>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-tenue">
            {loading ? "…" : "Ancora nessuno."}
          </p>
        )}
      </div>

      <div className="mt-auto pt-6">
        {preassigned ? (
          <p className="rounded-2xl bg-panna-scura px-5 py-3.5 text-center text-sm font-semibold text-tenue">
            Posti già assegnati
          </p>
        ) : full ? (
          <p className="rounded-2xl bg-panna-scura px-5 py-3.5 text-center text-sm font-semibold text-tenue">
            Gruppo al completo
          </p>
        ) : (
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={open}
            className="w-full rounded-full bg-salvia-scura px-6 py-3.5 font-bold text-bianco transition hover:bg-bosco active:scale-[0.99]"
          >
            {open
              ? "Annulla"
              : group.alternative
                ? "Scelgo il contributo economico"
                : `Segnati${remaining <= 2 ? ` — ${remaining} ${remaining === 1 ? "posto" : "posti"}` : " in questo gruppo"}`}
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
      className="spunta mt-5 flex flex-col gap-4 rounded-2xl bg-salvia-tenue p-5"
    >
      <Campo
        etichetta="Nominativo *"
        nome="familyName"
        obbligatorio
        maxLength={80}
        segnaposto="Es. Famiglia Rossi"
        autoFocus
      />
      <Campo
        etichetta="Genitore/i di riferimento"
        nome="parentNames"
        maxLength={120}
        segnaposto="Es. Marco e Giulia"
      />
      <Campo
        etichetta="Numero di telefono *"
        nome="phone"
        tipo="tel"
        obbligatorio
        maxLength={40}
        segnaposto="Es. 333 1234567"
        nota="È il numero con cui verrai inserito/a nel gruppo WhatsApp di lavoro. Non è visibile alle altre famiglie: lo vede solo chi gestisce la raccolta."
      />

      <label className="flex items-start gap-3 text-xs leading-relaxed text-tenue">
        <input
          type="checkbox"
          name="consent"
          required
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-linea accent-[var(--color-salvia-scura)]"
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
          className="inline-flex items-center justify-center rounded-full bg-bosco px-6 py-3 font-bold text-bianco transition hover:bg-salvia-scura disabled:opacity-60"
        >
          {submitting ? "Registrazione…" : "Conferma adesione"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center justify-center rounded-full border border-salvia px-6 py-3 font-bold text-salvia-scura transition hover:bg-bianco"
        >
          Annulla
        </button>
      </div>

      {error && (
        <p className="rounded-xl bg-argilla-tenue px-4 py-3 text-sm text-argilla">
          {error}
        </p>
      )}
    </form>
  );
}

function Campo({
  etichetta,
  nome,
  tipo = "text",
  obbligatorio,
  maxLength,
  segnaposto,
  nota,
  autoFocus,
}: {
  etichetta: string;
  nome: string;
  tipo?: string;
  obbligatorio?: boolean;
  maxLength?: number;
  segnaposto?: string;
  nota?: string;
  autoFocus?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-bold uppercase tracking-[0.16em] text-salvia-scura">
        {etichetta}
      </span>
      <input
        type={tipo}
        name={nome}
        required={obbligatorio}
        maxLength={maxLength}
        placeholder={segnaposto}
        autoFocus={autoFocus}
        inputMode={tipo === "tel" ? "tel" : undefined}
        className="rounded-xl border border-linea bg-bianco px-4 py-3 text-testo outline-none transition placeholder:text-tenue/60 focus:border-salvia-scura focus:ring-2 focus:ring-salvia/40"
      />
      {nota && <span className="text-xs leading-relaxed text-tenue">{nota}</span>}
    </label>
  );
}
