import { Pool } from "pg";
import { tdbGroups } from "./config";

/**
 * Archivio delle adesioni alla banca ore. Una riga per posto disponibile:
 * i posti vengono creati vuoti al primo avvio e "occupati" con una singola
 * UPDATE atomica, così due famiglie che cliccano insieme sull'ultimo posto
 * non possono prenderlo entrambe.
 */
export type TdbSlotRow = {
  id: number;
  group_id: string;
  slot_index: number;
  family_name: string | null;
  parent_names: string | null;
  phone: string | null;
  preassigned: boolean;
  claimed_at: string | null;
};

/**
 * Stringa di connessione al database. I provider collegati a Vercel usano nomi
 * diversi: Neon inietta DATABASE_URL, Supabase e Vercel Postgres POSTGRES_URL.
 */
function connectionString() {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL || "";
}

export function isDatabaseConfigured() {
  return connectionString().length > 0;
}

// Un solo pool per processo: le funzioni serverless riusano il modulo tra
// invocazioni, quindi il pool va creato una volta sola e tenuto piccolo.
const globalForPool = globalThis as typeof globalThis & { tdbPool?: Pool };

function getPool() {
  const url = connectionString();
  if (!url) {
    throw new Error(
      "DATABASE_URL non configurata: la pagina delle adesioni non può funzionare."
    );
  }
  if (!globalForPool.tdbPool) {
    globalForPool.tdbPool = new Pool({
      connectionString: url,
      max: 3,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 10_000,
    });
    globalForPool.tdbPool.on("error", () => {
      // Connessione inattiva chiusa dal server: il pool ne aprirà un'altra.
    });
  }
  return globalForPool.tdbPool;
}

async function query<T>(text: string, params: unknown[] = []) {
  const result = await getPool().query(text, params);
  return result.rows as T[];
}

let schemaReady: Promise<void> | null = null;

/** Crea la tabella e semina i posti vuoti. Idempotente, eseguita una volta per processo. */
export function ensureSchema() {
  if (!schemaReady) {
    schemaReady = initSchema().catch((error) => {
      schemaReady = null;
      throw error;
    });
  }
  return schemaReady;
}

async function initSchema() {
  await query(`
    CREATE TABLE IF NOT EXISTS tdb_slots (
      id serial PRIMARY KEY,
      group_id text NOT NULL,
      slot_index integer NOT NULL,
      family_name text,
      parent_names text,
      phone text,
      phone_key text,
      preassigned boolean NOT NULL DEFAULT false,
      claimed_at timestamptz,
      UNIQUE (group_id, slot_index)
    )
  `);

  // Una famiglia (identificata dal numero di telefono) occupa un solo posto.
  await query(`
    CREATE UNIQUE INDEX IF NOT EXISTS tdb_slots_phone_key_idx
    ON tdb_slots (phone_key)
    WHERE phone_key IS NOT NULL
  `);

  const groupIds: string[] = [];
  const slotIndexes: number[] = [];
  for (const group of tdbGroups) {
    for (let index = 1; index <= group.capacity; index += 1) {
      groupIds.push(group.id);
      slotIndexes.push(index);
    }
  }

  await query(
    `INSERT INTO tdb_slots (group_id, slot_index)
     SELECT g, s FROM unnest($1::text[], $2::int[]) AS t(g, s)
     ON CONFLICT (group_id, slot_index) DO NOTHING`,
    [groupIds, slotIndexes]
  );

  // Un gruppo tolto dalla configurazione lascerebbe i suoi posti nell'archivio:
  // qui vengono rimossi, ma solo se nessuno li ha occupati. Un'adesione non
  // viene mai cancellata di nascosto: se un gruppo sparisce con dentro delle
  // famiglie, le loro righe restano e si vedono nell'export.
  await query(
    `DELETE FROM tdb_slots
     WHERE claimed_at IS NULL AND NOT (group_id = ANY($1::text[]))`,
    [tdbGroups.map((group) => group.id)]
  );

  // Posti assegnati fuori dalla pagina (es. consiglio direttivo già nominato).
  for (const group of tdbGroups) {
    if (!group.preassigned?.length) continue;
    for (const [position, name] of group.preassigned.entries()) {
      // Il posto viene riempito se libero, e il nome corretto se era già stato
      // scritto da qui: così basta cambiare la configurazione per rinominare un
      // membro. Un'adesione vera di una famiglia non viene mai sovrascritta.
      await query(
        `UPDATE tdb_slots
         SET family_name = $3,
             preassigned = true,
             claimed_at = COALESCE(claimed_at, now())
         WHERE group_id = $1 AND slot_index = $2
           AND (claimed_at IS NULL OR preassigned = true)`,
        [group.id, position + 1, name]
      );
    }
  }
}

/** Elenco dei posti con il solo nominativo: nessun numero di telefono. */
export async function getPublicSlots() {
  await ensureSchema();
  return query<{
    group_id: string;
    slot_index: number;
    family_name: string | null;
    parent_names: string | null;
    preassigned: boolean;
    claimed_at: string | null;
  }>(
    `SELECT group_id, slot_index, family_name, parent_names, preassigned, claimed_at
     FROM tdb_slots
     ORDER BY group_id, slot_index`
  );
}

export type ClaimResult =
  | { ok: true; groupId: string; slotIndex: number }
  | { ok: false; reason: "full" | "already-registered" };

/** Occupa il primo posto libero del gruppo, in modo atomico. */
export async function claimSlot(input: {
  groupId: string;
  familyName: string;
  parentNames: string | null;
  phone: string;
  phoneKey: string;
}): Promise<ClaimResult> {
  await ensureSchema();

  try {
    const rows = await query<{ group_id: string; slot_index: number }>(
      `UPDATE tdb_slots
       SET family_name = $2,
           parent_names = $3,
           phone = $4,
           phone_key = $5,
           claimed_at = now()
       WHERE id = (
         SELECT id FROM tdb_slots
         WHERE group_id = $1 AND claimed_at IS NULL
         ORDER BY slot_index
         LIMIT 1
         FOR UPDATE SKIP LOCKED
       )
       RETURNING group_id, slot_index`,
      [
        input.groupId,
        input.familyName,
        input.parentNames,
        input.phone,
        input.phoneKey,
      ]
    );

    if (!rows.length) return { ok: false, reason: "full" };
    return { ok: true, groupId: rows[0].group_id, slotIndex: rows[0].slot_index };
  } catch (error) {
    if (isUniqueViolation(error)) {
      return { ok: false, reason: "already-registered" };
    }
    throw error;
  }
}

function isUniqueViolation(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === "23505"
  );
}

/** Elenco completo, telefoni inclusi: solo per la pagina di amministrazione. */
export async function getAdminSlots() {
  await ensureSchema();
  return query<TdbSlotRow>(
    `SELECT id, group_id, slot_index, family_name, parent_names, phone, preassigned, claimed_at
     FROM tdb_slots
     WHERE claimed_at IS NOT NULL
     ORDER BY claimed_at`
  );
}

/** Libera un posto occupato per errore. */
export async function releaseSlot(id: number) {
  await ensureSchema();
  const rows = await query<{ id: number }>(
    `UPDATE tdb_slots
     SET family_name = NULL, parent_names = NULL, phone = NULL,
         phone_key = NULL, preassigned = false, claimed_at = NULL
     WHERE id = $1
     RETURNING id`,
    [id]
  );
  return rows.length > 0;
}
