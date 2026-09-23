export const TRAVEL_MEMBERS = [
  { id: 'wyw', label: 'wyw', email: 'wyw@miao.miao', avatarId: 0 },
  { id: 'yyy', label: 'yyy', email: 'yyy@miao.miao', avatarId: 1 },
  { id: 'yh', label: 'yh', email: 'yh@miao.miao', avatarId: 2 },
  { id: 'lqw', label: 'lqw', email: 'lqw@miao.miao', avatarId: 3 },
] as const;

export type TravelMemberId = typeof TRAVEL_MEMBERS[number]['id'];
export type TravelMember = typeof TRAVEL_MEMBERS[number];

export const TRAVEL_MEMBER_IDS = TRAVEL_MEMBERS.map((member) => member.id) as TravelMemberId[];

export function getTravelMember(id: string | undefined | null) {
  return TRAVEL_MEMBERS.find((member) => member.id === id);
}

export function getTravelMemberByEmail(email: string | undefined | null) {
  return TRAVEL_MEMBERS.find((member) => member.email === email?.toLowerCase());
}

export function parseMemberIds(value: unknown): TravelMemberId[] {
  if (Array.isArray(value)) {
    return [...new Set(value.map(String).map((item) => item.trim().toLowerCase()).filter((item): item is TravelMemberId => Boolean(getTravelMember(item))))];
  }
  if (typeof value !== 'string') return [];
  return [...new Set(value.split(/[，,、;；/\s]+/).map((item) => item.trim().toLowerCase()).filter((item): item is TravelMemberId => Boolean(getTravelMember(item))))];
}
