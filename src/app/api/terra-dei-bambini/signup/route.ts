import { hasValidSession, normalizePhone } from "@/lib/terra-dei-bambini/auth";
import { tdbGroupsById } from "@/lib/terra-dei-bambini/config";
import { claimSlot, isDatabaseConfigured } from "@/lib/terra-dei-bambini/db";
import { getPublicState } from "@/lib/terra-dei-bambini/state";

function clean(value: unknown, maxLength: number) {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\s+/g, " ").slice(0, maxLength);
}

export async function POST(request: Request) {
  if (!(await hasValidSession("family"))) {
    return Response.json({ error: "Sessione scaduta. Ricarica la pagina." }, { status: 401 });
  }
  if (!isDatabaseConfigured()) {
    return Response.json(
      { error: "Archivio non configurato (DATABASE_URL mancante)." },
      { status: 503 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Richiesta non valida." }, { status: 400 });
  }

  const groupId = clean(body.groupId, 60);
  const group = tdbGroupsById.get(groupId);
  if (!group) {
    return Response.json({ error: "Gruppo non riconosciuto." }, { status: 400 });
  }
  if (group.preassigned?.length) {
    return Response.json(
      { error: "I posti di questo gruppo sono già assegnati." },
      { status: 409 }
    );
  }

  const familyName = clean(body.familyName, 80);
  if (familyName.length < 2) {
    return Response.json({ error: "Indica il nominativo della famiglia." }, { status: 400 });
  }

  const parentNames = clean(body.parentNames, 120) || null;

  const phone = normalizePhone(clean(body.phone, 40));
  if (!phone) {
    return Response.json(
      { error: "Il numero di telefono non sembra valido." },
      { status: 400 }
    );
  }

  if (body.consent !== true) {
    return Response.json(
      { error: "Serve il consenso all'uso dei dati per la banca ore." },
      { status: 400 }
    );
  }

  const result = await claimSlot({
    groupId: group.id,
    familyName,
    parentNames,
    phone: phone.display,
    phoneKey: phone.key,
  });

  if (!result.ok) {
    const state = await getPublicState();
    const error =
      result.reason === "full"
        ? "Purtroppo l'ultimo posto di questo gruppo è appena stato preso."
        : "Questo numero di telefono risulta già iscritto a un gruppo. Ogni famiglia può occupare un solo posto: se serve una correzione, scrivi a chi gestisce la raccolta.";
    return Response.json({ error, state }, { status: 409 });
  }

  const state = await getPublicState();
  return Response.json({
    ok: true,
    groupId: result.groupId,
    slotIndex: result.slotIndex,
    state,
  });
}
