import type { SharedExpense } from './expenseSettlement';

export type ExpenseSettlementFilter = 'all' | 'settled' | 'partial' | 'unsettled';

export interface ExpenseFilters {
  category: string;
  date: string;
  settlement: ExpenseSettlementFilter;
}

export interface ExpenseDateGroup {
  date: string;
  expenses: SharedExpense[];
}

export function filterExpenses(expenses: SharedExpense[], filters: ExpenseFilters) {
  return expenses.filter((expense) => {
    if (filters.category !== 'all' && expense.category !== filters.category) return false;
    if (filters.date !== 'all' && expense.date !== filters.date) return false;
    if (filters.settlement === 'settled' && !expense.settled) return false;
    if (filters.settlement === 'partial' && (expense.settled || (expense.settledMemberIds || []).length === 0)) return false;
    if (filters.settlement === 'unsettled' && expense.settled) return false;
    return true;
  });
}

export function groupExpensesByDate(expenses: SharedExpense[]): ExpenseDateGroup[] {
  const groups = new Map<string, SharedExpense[]>();
  [...expenses]
    .sort((left, right) => right.date.localeCompare(left.date))
    .forEach((expense) => groups.set(expense.date, [...(groups.get(expense.date) || []), expense]));
  return [...groups].map(([date, rows]) => ({ date, expenses: rows }));
}
