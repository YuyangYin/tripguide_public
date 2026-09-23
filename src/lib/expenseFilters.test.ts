import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { filterExpenses, groupExpensesByDate } from './expenseFilters';
import type { SharedExpense } from './expenseSettlement';

const rows: SharedExpense[] = [
  { id: '1', title: '午餐', amount: 100, currency: 'CNY', category: '🍔 餐饮', date: '2026-09-25', settled: false },
  { id: '2', title: '地铁', amount: 20, currency: 'CNY', category: '🚆 交通', date: '2026-09-25', settled: true },
  { id: '3', title: '晚餐', amount: 200, currency: 'CNY', category: '🍔 餐饮', date: '2026-09-26', settled: true },
];

describe('expense filters', () => {
  it('combines category, date and settlement filters', () => {
    assert.deepEqual(filterExpenses(rows, { category: '🍔 餐饮', date: '2026-09-25', settlement: 'unsettled' }).map((row) => row.id), ['1']);
  });

  it('groups filtered rows by date in descending order', () => {
    const groups = groupExpensesByDate(rows);
    assert.deepEqual(groups.map((group) => group.date), ['2026-09-26', '2026-09-25']);
    assert.equal(groups[1].expenses.length, 2);
  });
});
