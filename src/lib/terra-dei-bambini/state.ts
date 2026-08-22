import { tdbGroups } from "./config";
import type { TdbState } from "./types";
import { getPublicSlots } from "./db";


/** Stato pubblico dei gruppi: nominativi sì, numeri di telefono mai. */
export async function getPublicState(): Promise<TdbState> {
  const slots = await getPublicSlots();

  const groups = tdbGroups.map((group) => {
    const members = slots
      .filter((slot) => slot.group_id === group.id && slot.claimed_at !== null)
      .map((slot) => ({
        slotIndex: slot.slot_index,
        name: slot.family_name ?? "—",
        parentNames: slot.parent_names,
        preassigned: slot.preassigned,
      }));

    return {
      id: group.id,
      capacity: group.capacity,
      taken: members.length,
      members,
    };
  });

  return { groups, updatedAt: new Date().toISOString() };
}

export type { TdbMember, TdbGroupState, TdbState } from "./types";
