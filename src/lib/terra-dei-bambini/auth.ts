import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export type TdbScope = "family" | "admin";

const COOKIE_NAMES: Record<TdbScope, string> = {
  family: "tdb_sessione",
  admin: "tdb_admin",
};

const SESSION_SECONDS: Record<TdbScope, number> = {
  family: 60 * 60 * 12,
  admin: 60 * 60 * 4,
};

export function cookieName(scope: TdbScope) {
  return COOKIE_NAMES[scope];
}

/**
 * La password impostata fra le variabili d'ambiente. Spazi e a capo attorno al
 * valore vengono ignorati: incollando la password nel pannello di Vercel è
 * facile portarsi dietro uno spazio invisibile, e nessuno lo digiterebbe mai.
 */
export function configuredPassword(scope: TdbScope) {
  const grezza =
    scope === "admin" ? process.env.TDB_ADMIN_PASSWORD : process.env.TDB_PASSWORD;
  return (grezza ?? "").trim();
}

export function isPasswordConfigured(scope: TdbScope) {
  return configuredPassword(scope).length > 0;
}

/**
 * Chiave di firma della sessione. Se TDB_SESSION_SECRET non è impostata viene
 * derivata dalla password: cambiare la password invalida le sessioni aperte.
 */
function signingKey(scope: TdbScope) {
  const explicit = process.env.TDB_SESSION_SECRET;
  const base = explicit && explicit.length > 0 ? explicit : configuredPassword(scope);
  return createHash("sha256").update(`tdb:${scope}:${base}`).digest();
}

function sign(scope: TdbScope, payload: string) {
  return createHmac("sha256", signingKey(scope)).update(payload).digest("base64url");
}

export function createSessionValue(scope: TdbScope) {
  const expiresAt = Date.now() + SESSION_SECONDS[scope] * 1000;
  const payload = `${scope}.${expiresAt}`;
  return { value: `${expiresAt}.${sign(scope, payload)}`, maxAge: SESSION_SECONDS[scope] };
}

export function isSessionValueValid(scope: TdbScope, value: string | undefined) {
  if (!value) return false;
  const [expiresRaw, signature] = value.split(".");
  const expiresAt = Number(expiresRaw);
  if (!expiresRaw || !signature || !Number.isFinite(expiresAt)) return false;
  if (expiresAt < Date.now()) return false;
  return safeEqual(signature, sign(scope, `${scope}.${expiresAt}`));
}

export async function hasValidSession(scope: TdbScope) {
  const store = await cookies();
  return isSessionValueValid(scope, store.get(COOKIE_NAMES[scope])?.value);
}

export function passwordMatches(scope: TdbScope, candidate: string) {
  const expected = configuredPassword(scope);
  // Stessa indulgenza per chi digita: le tastiere dei telefoni aggiungono
  // volentieri uno spazio dopo l'ultimo carattere.
  candidate = candidate.trim();
  if (!expected) return false;
  // Confronto su digest di lunghezza fissa: evita di rivelare la lunghezza.
  return safeEqual(
    createHash("sha256").update(candidate).digest("hex"),
    createHash("sha256").update(expected).digest("hex")
  );
}

function safeEqual(a: string, b: string) {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);
  if (bufferA.length !== bufferB.length) return false;
  return timingSafeEqual(bufferA, bufferB);
}

export function sessionCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}

/**
 * Normalizza il numero di telefono: `key` serve a riconoscere la stessa
 * famiglia anche se scrive il numero con prefisso o spazi diversi.
 */
export function normalizePhone(raw: string) {
  const trimmed = raw.trim().replace(/\s+/g, " ");
  let digits = trimmed.replace(/\D/g, "");
  if (digits.startsWith("0039")) digits = digits.slice(4);
  else if (digits.startsWith("39") && digits.length > 10) digits = digits.slice(2);
  if (digits.length < 8 || digits.length > 13) return null;
  return { display: trimmed, key: digits };
}

/** Antibruteforce elementare, in memoria: si azzera a ogni riavvio del processo. */
const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 10;
const WINDOW_MS = 10 * 60 * 1000;

export function tooManyAttempts(key: string) {
  const entry = attempts.get(key);
  if (!entry) return false;
  if (entry.resetAt < Date.now()) {
    attempts.delete(key);
    return false;
  }
  return entry.count >= MAX_ATTEMPTS;
}

export function recordFailedAttempt(key: string) {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || entry.resetAt < now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return;
  }
  entry.count += 1;
}

export function clearAttempts(key: string) {
  attempts.delete(key);
}

export function clientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "sconosciuto";
}
