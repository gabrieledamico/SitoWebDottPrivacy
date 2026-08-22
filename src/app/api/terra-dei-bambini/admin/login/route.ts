import { cookies } from "next/headers";
import {
  clearAttempts,
  clientKey,
  cookieName,
  createSessionValue,
  isPasswordConfigured,
  passwordMatches,
  recordFailedAttempt,
  sessionCookieOptions,
  tooManyAttempts,
} from "@/lib/terra-dei-bambini/auth";

export async function POST(request: Request) {
  if (!isPasswordConfigured("admin")) {
    return Response.json(
      { error: "Area riservata non configurata (TDB_ADMIN_PASSWORD mancante)." },
      { status: 503 }
    );
  }

  const key = `admin:${clientKey(request)}`;
  if (tooManyAttempts(key)) {
    return Response.json(
      { error: "Troppi tentativi. Riprova tra qualche minuto." },
      { status: 429 }
    );
  }

  let password = "";
  try {
    const body = (await request.json()) as { password?: unknown };
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return Response.json({ error: "Richiesta non valida." }, { status: 400 });
  }

  if (!passwordMatches("admin", password)) {
    recordFailedAttempt(key);
    return Response.json({ error: "Password non corretta." }, { status: 401 });
  }

  clearAttempts(key);
  const session = createSessionValue("admin");
  const store = await cookies();
  store.set(cookieName("admin"), session.value, sessionCookieOptions(session.maxAge));
  return Response.json({ ok: true });
}
