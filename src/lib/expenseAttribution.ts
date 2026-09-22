import { NORDIC_ANIMAL_AVATARS } from '../data/nordicAnimalAvatars';

export interface PayerProfile {
  name: string;
  avatarId: number;
}

export interface ExpenseAttribution {
  payer?: string;
  payerAvatar?: number;
  payers?: PayerProfile[];
}

const SINGLE_PAYER_PATTERN = / \[\[payer:([^|\]]+)\|avatar:(\d{1,2})\]\]$/;
const MULTI_PAYER_PATTERN = / \[\[payers:([^\]]+)\]\]$/;

export const NORDIC_AVATAR_COUNT = NORDIC_ANIMAL_AVATARS.length;

export const normalizePayerName = (name: string) => name.trim().replace(/\s+/g, ' ').toLocaleLowerCase();

const normalizeAvatarId = (avatarId: unknown) => {
  const value = Number(avatarId);
  return Number.isInteger(value) && value >= 0 && value < NORDIC_AVATAR_COUNT ? value : 0;
};

const normalizeProfile = (profile: Partial<PayerProfile> & { avatar_id?: number }): PayerProfile | null => {
  const name = typeof profile.name === 'string' ? profile.name.trim().replace(/\s+/g, ' ') : '';
  if (!name) return null;
  return { name, avatarId: normalizeAvatarId(profile.avatarId ?? profile.avatar_id) };
};

const dedupeProfiles = (profiles: PayerProfile[]) => {
  const seen = new Set<string>();
  return profiles.filter((profile) => {
    const key = normalizePayerName(profile.name);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const stripAttribution = (category: string) => category
  .replace(MULTI_PAYER_PATTERN, '')
  .replace(SINGLE_PAYER_PATTERN, '');

export function getExpensePayers(expense: ExpenseAttribution): PayerProfile[] {
  if (Array.isArray(expense.payers)) {
    return dedupeProfiles(
      expense.payers
        .map((profile) => normalizeProfile(profile))
        .filter((profile): profile is PayerProfile => profile !== null)
    );
  }

  const legacy = normalizeProfile({ name: expense.payer, avatarId: expense.payerAvatar });
  return legacy ? [legacy] : [];
}

export function packExpenseAttribution(row: Record<string, any>): Record<string, any> {
  const next = { ...row };
  const category = typeof next.category === 'string' ? stripAttribution(next.category) : '';
  const payers = getExpensePayers({
    payers: next.payers,
    payer: next.payer,
    payerAvatar: next.payer_avatar
  });

  delete next.payers;
  delete next.payer;
  delete next.payer_avatar;

  next.category = payers.length > 0
    ? `${category} [[payers:${encodeURIComponent(JSON.stringify(payers))}]]`
    : category;
  return next;
}

export function unpackExpenseAttribution<T extends Record<string, any>>(row: T): T {
  const category = typeof row.category === 'string' ? row.category : '';
  const multiMatch = category.match(MULTI_PAYER_PATTERN);

  if (multiMatch) {
    try {
      const parsed = JSON.parse(decodeURIComponent(multiMatch[1]));
      const payers = Array.isArray(parsed)
        ? dedupeProfiles(parsed.map((profile) => normalizeProfile(profile)).filter((profile): profile is PayerProfile => profile !== null))
        : [];
      return { ...row, category: stripAttribution(category), payers };
    } catch {
      return { ...row, category: stripAttribution(category), payers: [] };
    }
  }

  const singleMatch = category.match(SINGLE_PAYER_PATTERN);
  if (!singleMatch) return row;

  let payer = singleMatch[1];
  try {
    payer = decodeURIComponent(payer);
  } catch {}
  const payerAvatar = normalizeAvatarId(singleMatch[2]);

  return {
    ...row,
    category: stripAttribution(category),
    payer,
    payerAvatar,
    payers: [{ name: payer, avatarId: payerAvatar }]
  };
}

export function getPayerDirectory<T extends ExpenseAttribution>(expenses: T[]) {
  return dedupeProfiles(expenses.flatMap((expense) => getExpensePayers(expense)));
}

const randomIndex = (length: number) => {
  if (length <= 1) return 0;
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const buffer = new Uint32Array(1);
    crypto.getRandomValues(buffer);
    return buffer[0] % length;
  }
  return Math.floor(Math.random() * length);
};

export function createPayerProfile(profiles: PayerProfile[], rawName: string): PayerProfile {
  const name = rawName.trim().replace(/\s+/g, ' ');
  const key = normalizePayerName(name);
  const existing = profiles.find((profile) => normalizePayerName(profile.name) === key);
  if (existing) return existing;

  const usedAvatarIds = new Set(profiles.map((profile) => normalizeAvatarId(profile.avatarId)));
  const unusedAvatarIds = Array.from({ length: NORDIC_AVATAR_COUNT }, (_, index) => index)
    .filter((avatarId) => !usedAvatarIds.has(avatarId));
  const pool = unusedAvatarIds.length > 0
    ? unusedAvatarIds
    : Array.from({ length: NORDIC_AVATAR_COUNT }, (_, index) => index);

  return { name, avatarId: pool[randomIndex(pool.length)] };
}

export function resolvePayerAttribution<T extends ExpenseAttribution>(expenses: T[], rawName: string) {
  return createPayerProfile(getPayerDirectory(expenses), rawName);
}
