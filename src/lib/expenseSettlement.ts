import { TRAVEL_MEMBER_IDS, TravelMemberId } from './travelMembers';

export type SupportedCurrency = 'CNY' | 'NOK' | 'EUR' | 'CHF' | 'SEK';
export type ExpenseCurrency = SupportedCurrency | 'ISK';

export interface SharedExpense {
  id: string;
  title: string;
  amount: number;
  currency: ExpenseCurrency;
  category: string;
  date: string;
  payerId?: TravelMemberId;
  splitMemberIds?: TravelMemberId[];
  settled?: boolean;
  payer?: string;
  payers?: { name: string }[];
}

export interface MemberBalance {
  memberId: TravelMemberId;
  paid: number;
  owed: number;
  balance: number;
}

export interface SettlementTransfer {
  from: TravelMemberId;
  to: TravelMemberId;
  amount: number;
}

const roundMoney = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

export function normalizeExpense(expense: SharedExpense): SharedExpense {
  const legacyPayer = expense.payer?.trim().toLowerCase();
  const legacyPayers = expense.payers?.map((payer) => payer.name.trim().toLowerCase()) || [];
  const payerId = expense.payerId || TRAVEL_MEMBER_IDS.find((id) => id === legacyPayer) || TRAVEL_MEMBER_IDS.find((id) => legacyPayers.includes(id)) || 'yyy';
  const splitMemberIds = expense.splitMemberIds?.filter((id) => TRAVEL_MEMBER_IDS.includes(id)) || TRAVEL_MEMBER_IDS;
  return {
    ...expense,
    payerId,
    splitMemberIds: splitMemberIds.length > 0 ? [...new Set(splitMemberIds)] : TRAVEL_MEMBER_IDS,
    settled: Boolean(expense.settled),
  };
}

export function calculateMemberBalances(
  expenses: SharedExpense[],
  rates: Record<SupportedCurrency, number>,
): MemberBalance[] {
  const balances = new Map<TravelMemberId, MemberBalance>(
    TRAVEL_MEMBER_IDS.map((memberId) => [memberId, { memberId, paid: 0, owed: 0, balance: 0 }]),
  );

  expenses.filter((expense) => !expense.settled).forEach((rawExpense) => {
    const expense = normalizeExpense(rawExpense);
    const rate = expense.currency === 'ISK' ? 0.051 : rates[expense.currency];
    const total = roundMoney(Math.abs(Number(expense.amount) || 0) * (rate || 1));
    const splitMembers = expense.splitMemberIds || TRAVEL_MEMBER_IDS;
    if (!expense.payerId || splitMembers.length === 0 || total <= 0) return;

    balances.get(expense.payerId)!.paid += total;
    const perPerson = total / splitMembers.length;
    splitMembers.forEach((memberId) => { balances.get(memberId)!.owed += perPerson; });
  });

  return TRAVEL_MEMBER_IDS.map((memberId) => {
    const item = balances.get(memberId)!;
    return {
      memberId,
      paid: roundMoney(item.paid),
      owed: roundMoney(item.owed),
      balance: roundMoney(item.paid - item.owed),
    };
  });
}

export function calculateSettlementTransfers(balances: MemberBalance[]): SettlementTransfer[] {
  const debtors = balances.filter((item) => item.balance < -0.009).map((item) => ({ ...item, remaining: -item.balance }));
  const creditors = balances.filter((item) => item.balance > 0.009).map((item) => ({ ...item, remaining: item.balance }));
  const transfers: SettlementTransfer[] = [];
  let debtorIndex = 0;
  let creditorIndex = 0;

  while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
    const debtor = debtors[debtorIndex];
    const creditor = creditors[creditorIndex];
    const amount = roundMoney(Math.min(debtor.remaining, creditor.remaining));
    if (amount > 0) transfers.push({ from: debtor.memberId, to: creditor.memberId, amount });
    debtor.remaining = roundMoney(debtor.remaining - amount);
    creditor.remaining = roundMoney(creditor.remaining - amount);
    if (debtor.remaining <= 0.009) debtorIndex += 1;
    if (creditor.remaining <= 0.009) creditorIndex += 1;
  }
  return transfers;
}
