import { hasValidSession } from "@/lib/terra-dei-bambini/auth";
import { tdbGroupsById } from "@/lib/terra-dei-bambini/config";
import { getAdminSlots, isDatabaseConfigured, releaseSlot } from "@/lib/terra-dei-bambini/db";

async function guard() {
  if (!(await hasValidSession("admin"))) {
    return Response.json({ error: "Sessione scaduta." }, { status: 401 });
  }
  if (!isDatabaseConfigured()) {
    return Response.json(
      { error: "Archivio non configurato (DATABASE_URL mancante)." },
      { status: 503 }
    );
  }
  return null;
}

export async function GET() {
  const denied = await guard();
  if (denied) return denied;

  const rows = await getAdminSlots();
  const entries = rows.map((row) => ({
    id: row.id,
    groupId: row.group_id,
    groupName: tdbGroupsById.get(row.group_id)?.name ?? row.group_id,
    slotIndex: row.slot_index,
    familyName: row.family_name,
    parentNames: row.parent_names,
    phone: row.phone,
    preassigned: row.preassigned,
    claimedAt: row.claimed_at,
  }));

  return Response.json({ entries }, { headers: { "Cache-Control": "no-store" } });
}

export async function DELETE(request: Request) {
  const denied = await guard();
  if (denied) return denied;

  const id = Number(new URL(request.url).searchParams.get("id"));
  if (!Number.isInteger(id) || id <= 0) {
    return Response.json({ error: "Adesione non valida." }, { status: 400 });
  }

  const released = await releaseSlot(id);
  if (!released) {
    return Response.json({ error: "Adesione non trovata." }, { status: 404 });
  }
  return Response.json({ ok: true });
}
