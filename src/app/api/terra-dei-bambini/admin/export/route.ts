import { hasValidSession } from "@/lib/terra-dei-bambini/auth";
import { tdbGroupsById } from "@/lib/terra-dei-bambini/config";
import { getAdminSlots, isDatabaseConfigured } from "@/lib/terra-dei-bambini/db";

function csvCell(value: string | null) {
  const text = value ?? "";
  return `"${text.replace(/"/g, '""')}"`;
}

export async function GET() {
  if (!(await hasValidSession("admin"))) {
    return Response.json({ error: "Sessione scaduta." }, { status: 401 });
  }
  if (!isDatabaseConfigured()) {
    return Response.json(
      { error: "Archivio non configurato (DATABASE_URL mancante)." },
      { status: 503 }
    );
  }

  const rows = await getAdminSlots();
  const header = ["Gruppo", "Posto", "Nominativo", "Genitori", "Telefono", "Data adesione"];
  const lines = [header.map(csvCell).join(";")];

  for (const row of rows) {
    lines.push(
      [
        csvCell(tdbGroupsById.get(row.group_id)?.name ?? row.group_id),
        csvCell(String(row.slot_index)),
        csvCell(row.family_name),
        csvCell(row.parent_names),
        csvCell(row.preassigned ? "(posto già assegnato)" : row.phone),
        csvCell(row.claimed_at ? new Date(row.claimed_at).toLocaleString("it-IT") : ""),
      ].join(";")
    );
  }

  // BOM iniziale: Excel apre il file con la codifica corretta.
  const body = `﻿${lines.join("\r\n")}\r\n`;
  const today = new Date().toISOString().slice(0, 10);

  return new Response(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="banca-ore-${today}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
