import { hasValidSession } from "@/lib/terra-dei-bambini/auth";
import { isDatabaseConfigured } from "@/lib/terra-dei-bambini/db";
import { getPublicState } from "@/lib/terra-dei-bambini/state";

export async function GET() {
  if (!(await hasValidSession("family"))) {
    return Response.json({ error: "Sessione scaduta." }, { status: 401 });
  }
  if (!isDatabaseConfigured()) {
    return Response.json(
      { error: "Archivio non configurato (DATABASE_URL mancante)." },
      { status: 503 }
    );
  }

  const state = await getPublicState();
  return Response.json(state, {
    headers: { "Cache-Control": "no-store" },
  });
}
