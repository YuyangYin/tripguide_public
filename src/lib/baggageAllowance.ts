import { TRAVEL_MEMBER_IDS, type TravelMemberId } from './travelMembers';

export type AirlineId = 'air-china' | 'swiss' | 'vueling' | 'klm' | 'norwegian' | 'sas';
export type BaggageKind = 'checked' | 'carryOn' | 'personal';

export interface MemberBaggage {
  id: TravelMemberId;
  checked: string;
  carryOn: string;
  personal: string;
  updatedAt?: string;
}

interface PieceRule {
  scope: 'person' | 'group';
  maxPieces: number;
  maxKgPerPiece?: number;
}

export interface AirlineRule {
  id: AirlineId;
  name: string;
  shortName: string;
  summary: string;
  checked: PieceRule;
  carryOn: PieceRule;
  personal: PieceRule;
  combinedCarryPersonalKg?: number;
  combinedOnlyWithCarryOn?: boolean;
}

export const AIRLINE_RULES: AirlineRule[] = [
  {
    id: 'swiss',
    name: '瑞士国际航空（瑞士航空）',
    shortName: '瑞士航空',
    summary: '每人：1 件 23kg 托运行李、1 件手提行李、1 个小包；手提行李与小包合计不超过 12kg。',
    checked: { scope: 'person', maxPieces: 1, maxKgPerPiece: 23 },
    carryOn: { scope: 'person', maxPieces: 1 },
    personal: { scope: 'person', maxPieces: 1 },
    combinedCarryPersonalKg: 12,
  },
  {
    id: 'air-china',
    name: '中国国际航空（国航）',
    shortName: '国航',
    summary: '每人：1 件 23kg 托运行李、1 件手提行李、1 个小包。',
    checked: { scope: 'person', maxPieces: 1, maxKgPerPiece: 23 },
    carryOn: { scope: 'person', maxPieces: 1 },
    personal: { scope: 'person', maxPieces: 1 },
  },
  {
    id: 'vueling',
    name: '伏林航空',
    shortName: '伏林航空',
    summary: '四人合计：3 件 25kg 托运行李；每人 1 个小包，无手提行李额。',
    checked: { scope: 'group', maxPieces: 3, maxKgPerPiece: 25 },
    carryOn: { scope: 'group', maxPieces: 0 },
    personal: { scope: 'person', maxPieces: 1 },
  },
  {
    id: 'klm',
    name: '荷兰皇家航空',
    shortName: '荷兰皇家航空',
    summary: '四人合计：3 件 23kg 托运行李；每人 1 件手提行李、1 个小包。',
    checked: { scope: 'group', maxPieces: 3, maxKgPerPiece: 23 },
    carryOn: { scope: 'person', maxPieces: 1 },
    personal: { scope: 'person', maxPieces: 1 },
  },
  {
    id: 'norwegian',
    name: '挪威穿梭航空',
    shortName: '挪威穿梭航空',
    summary: '四人合计：3 件 23kg 托运行李、3 件手提行李；每人 1 个小包。有手提行李时，手提行李与小包合计不超过 10kg。',
    checked: { scope: 'group', maxPieces: 3, maxKgPerPiece: 23 },
    carryOn: { scope: 'group', maxPieces: 3 },
    personal: { scope: 'person', maxPieces: 1 },
    combinedCarryPersonalKg: 10,
    combinedOnlyWithCarryOn: true,
  },
  {
    id: 'sas',
    name: '北欧航空',
    shortName: '北欧航空',
    summary: '每人：1 件 23kg 托运行李、1 个小包；四人合计 4 件手提行李，每件不超过 8kg。',
    checked: { scope: 'person', maxPieces: 1, maxKgPerPiece: 23 },
    carryOn: { scope: 'group', maxPieces: 4, maxKgPerPiece: 8 },
    personal: { scope: 'person', maxPieces: 1 },
  },
];

export const DEFAULT_BAGGAGE: MemberBaggage[] = TRAVEL_MEMBER_IDS.map((id) => ({
  id,
  checked: '',
  carryOn: '',
  personal: '',
}));

export const getAirlineRule = (airlineId: AirlineId) => AIRLINE_RULES.find((rule) => rule.id === airlineId) || AIRLINE_RULES[0];

export const parseBaggageWeights = (value: string): number[] => value
  .split(/[，,、;；/\s]+/)
  .map((item) => item.replace(/kg/gi, '').trim())
  .filter(Boolean)
  .map(Number)
  .filter((weight) => Number.isFinite(weight) && weight > 0);

export interface BaggageEvaluation {
  memberIssues: Record<TravelMemberId, string[]>;
  groupIssues: string[];
  totals: Record<BaggageKind, number>;
}

const BAG_LABELS: Record<BaggageKind, string> = {
  checked: '托运行李',
  carryOn: '手提行李',
  personal: '小包',
};

export function evaluateBaggage(airlineId: AirlineId, members: MemberBaggage[]): BaggageEvaluation {
  const rule = getAirlineRule(airlineId);
  const memberIssues = Object.fromEntries(TRAVEL_MEMBER_IDS.map((id) => [id, []])) as Record<TravelMemberId, string[]>;
  const totals: Record<BaggageKind, number> = { checked: 0, carryOn: 0, personal: 0 };
  const kinds: BaggageKind[] = ['checked', 'carryOn', 'personal'];

  for (const memberId of TRAVEL_MEMBER_IDS) {
    const member = members.find((item) => item.id === memberId) || DEFAULT_BAGGAGE.find((item) => item.id === memberId)!;
    for (const kind of kinds) {
      const weights = parseBaggageWeights(member[kind]);
      const pieceRule = rule[kind];
      totals[kind] += weights.length;
      if (pieceRule.scope === 'person' && weights.length > pieceRule.maxPieces) {
        memberIssues[memberId].push(`${BAG_LABELS[kind]} ${weights.length} 件，超过每人 ${pieceRule.maxPieces} 件`);
      }
      if (pieceRule.maxKgPerPiece !== undefined) {
        weights.forEach((weight, index) => {
          if (weight > pieceRule.maxKgPerPiece!) {
            memberIssues[memberId].push(`第 ${index + 1} 件${BAG_LABELS[kind]} ${weight}kg，超出 ${pieceRule.maxKgPerPiece}kg`);
          }
        });
      }
    }

    const carryOn = parseBaggageWeights(member.carryOn);
    const personal = parseBaggageWeights(member.personal);
    const shouldCheckCombined = rule.combinedCarryPersonalKg !== undefined
      && (!rule.combinedOnlyWithCarryOn || carryOn.length > 0)
      && (carryOn.length > 0 || personal.length > 0);
    if (shouldCheckCombined) {
      const combinedWeight = [...carryOn, ...personal].reduce((sum, weight) => sum + weight, 0);
      if (combinedWeight > rule.combinedCarryPersonalKg) {
        memberIssues[memberId].push(`手提行李与小包合计 ${combinedWeight}kg，超出 ${rule.combinedCarryPersonalKg}kg`);
      }
    }
  }

  const groupIssues: string[] = [];
  for (const kind of kinds) {
    const pieceRule = rule[kind];
    if (pieceRule.scope === 'group' && totals[kind] > pieceRule.maxPieces) {
      groupIssues.push(`${BAG_LABELS[kind]}共 ${totals[kind]} 件，超过团队额度 ${pieceRule.maxPieces} 件`);
    }
  }

  return { memberIssues, groupIssues, totals };
}
