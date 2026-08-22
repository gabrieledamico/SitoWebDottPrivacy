export type TdbMember = {
  slotIndex: number;
  name: string;
  parentNames: string | null;
  preassigned: boolean;
};

export type TdbGroupState = {
  id: string;
  taken: number;
  capacity: number;
  members: TdbMember[];
};

export type TdbState = {
  groups: TdbGroupState[];
  updatedAt: string;
};
