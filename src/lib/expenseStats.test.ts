import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { calculateExpenseStatistics } from './expenseStats';
import type { SharedExpense, SupportedCurrency } from './expenseSettlement';

const rates: Record<SupportedCurrency, number> = { CNY: 1, HKD: 0.91, EUR: 7.8, NOK: 0.67, CHF: 8.2, SEK: 0.7 };

describe('expense statistics', () => {
  it('attributes shared expenses equally to selected split members', () => {
    const expenses: SharedExpense[] = [
      { id: '1', title: '晚餐', amount: 400, currency: 'CNY', category: '🍔 餐饮', date: '2026-09-23', payerId: 'wyw', splitMemberIds: ['wyw', 'yyy', 'yh', 'lqw'] },
    ];
    const stats = calculateExpenseStatistics(expenses, rates);
    assert.equal(stats.total, 400);
    assert.deepEqual(stats.members.map((member) => member.total), [100, 100, 100, 100]);
    assert.equal(stats.categories[0].amount, 400);
  });

  it('keeps personal expenses with the selected member and groups categories', () => {
    const expenses: SharedExpense[] = [
      { id: '1', title: '个人购物', amount: 100, currency: 'HKD', category: '🛍️ 购物', date: '2026-09-23', payerId: 'yyy', splitMemberIds: ['yyy'] },
      { id: '2', title: '地铁', amount: 40, currency: 'CNY', category: '🚆 交通', date: '2026-09-23', payerId: 'wyw', splitMemberIds: ['wyw', 'yyy'] },
    ];
    const stats = calculateExpenseStatistics(expenses, rates);
    assert.equal(stats.total, 131);
    assert.equal(stats.members.find((member) => member.memberId === 'yyy')?.total, 111);
    assert.deepEqual(stats.members.find((member) => member.memberId === 'yyy')?.categories, [
      { category: '🛍️ 购物', amount: 91 },
      { category: '🚆 交通', amount: 20 },
    ]);
  });

  it('does not change spending attribution when settlement status changes', () => {
    const base: SharedExpense = { id: '1', title: '酒店', amount: 400, currency: 'CNY', category: '🏠 住宿', date: '2026-09-23', payerId: 'wyw', splitMemberIds: ['wyw', 'yyy', 'yh', 'lqw'] };
    const open = calculateExpenseStatistics([base], rates);
    const settled = calculateExpenseStatistics([{ ...base, settled: true, settledMemberIds: ['yyy', 'yh', 'lqw'] }], rates);
    assert.deepEqual(settled, open);
  });
});
