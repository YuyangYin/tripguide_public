import { TRAVEL_MEMBER_IDS, type TravelMemberId } from './travelMembers';
import { normalizeExpense, type SharedExpense, type SupportedCurrency } from './expenseSettlement';

export interface ExpenseCategoryStat {
  category: string;
  amount: number;
}

export interface MemberExpenseStat {
  memberId: TravelMemberId;
  total: number;
  categories: ExpenseCategoryStat[];
}

export interface ExpenseStatistics {
  total: number;
  categories: ExpenseCategoryStat[];
  members: MemberExpenseStat[];
}

const roundMoney = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

export function calculateExpenseStatistics(
  expenses: SharedExpense[],
  rates: Record<SupportedCurrency, number>,
): ExpenseStatistics {
  const categoryTotals = new Map<string, number>();
  const memberCategoryTotals = new Map<TravelMemberId, Map<string, number>>(
    TRAVEL_MEMBER_IDS.map((memberId) => [memberId, new Map<string, number>()]),
  );

  expenses.forEach((rawExpense) => {
    const expense = normalizeExpense(rawExpense);
    const rate = expense.currency === 'ISK' ? 0.051 : rates[expense.currency];
    const total = Math.abs(Number(expense.amount) || 0) * (rate || 1);
    const splitMembers = expense.splitMemberIds || TRAVEL_MEMBER_IDS;
    if (total <= 0 || splitMembers.length === 0) return;

    categoryTotals.set(expense.category, (categoryTotals.get(expense.category) || 0) + total);
    const perPerson = total / splitMembers.length;
    splitMembers.forEach((memberId) => {
      const categories = memberCategoryTotals.get(memberId);
      if (!categories) return;
      categories.set(expense.category, (categories.get(expense.category) || 0) + perPerson);
    });
  });

  const toCategoryRows = (source: Map<string, number>) => [...source]
    .map(([category, amount]) => ({ category, amount: roundMoney(amount) }))
    .sort((left, right) => right.amount - left.amount || left.category.localeCompare(right.category));

  const categories = toCategoryRows(categoryTotals);
  return {
    total: roundMoney(categories.reduce((sum, item) => sum + item.amount, 0)),
    categories,
    members: TRAVEL_MEMBER_IDS.map((memberId) => {
      const memberCategories = toCategoryRows(memberCategoryTotals.get(memberId)!);
      return {
        memberId,
        total: roundMoney(memberCategories.reduce((sum, item) => sum + item.amount, 0)),
        categories: memberCategories,
      };
    }),
  };
}
