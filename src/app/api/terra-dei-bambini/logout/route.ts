import { cookies } from "next/headers";
import { cookieName } from "@/lib/terra-dei-bambini/auth";

export async function POST() {
  const store = await cookies();
  store.delete(cookieName("family"));
  store.delete(cookieName("admin"));
  return Response.json({ ok: true });
}
