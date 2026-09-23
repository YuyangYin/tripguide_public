import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { applySettlementPayments, calculateMemberBalances, calculateSettlementTransfers, normalizeExpense, SupportedCurrency } from './expenseSettlement.ts';

const rates: Record<SupportedCurrency, number> = { CNY: 1, HKD: 0.91, EUR: 7.8, NOK: 0.67, CHF: 8.2, SEK: 0.7 };

describe('expense settlement', () => {
  it('splits one payer expense across all four members', () => {
    const balances = calculateMemberBalances([{ id: '1', title: '酒店', amount: 400, currency: 'CNY', category: '住宿', date: '2026-09-23', payerId: 'wyw', splitMemberIds: ['wyw', 'yyy', 'yh', 'lqw'] }], rates);
    assert.deepEqual(balances.map((item) => item.balance), [300, -100, -100, -100]);
    assert.deepEqual(calculateSettlementTransfers(balances), [
      { from: 'yyy', to: 'wyw', amount: 100 },
      { from: 'yh', to: 'wyw', amount: 100 },
      { from: 'lqw', to: 'wyw', amount: 100 },
    ]);
  });

  it('excludes settled expenses and supports personal expenses', () => {
    const balances = calculateMemberBalances([
      { id: '1', title: '个人', amount: 80, currency: 'CNY', category: '其他', date: '2026-09-23', payerId: 'yh', splitMemberIds: ['yh'] },
      { id: '2', title: '已结算', amount: 400, currency: 'CNY', category: '住宿', date: '2026-09-23', payerId: 'wyw', splitMemberIds: ['wyw', 'yyy', 'yh', 'lqw'], settled: true },
    ], rates);
    assert.deepEqual(balances.map((item) => item.balance), [0, 0, 0, 0]);
  });

  it('removes only selected members from a partially settled expense', () => {
    const balances = calculateMemberBalances([{ id: '1', title: '酒店', amount: 400, currency: 'CNY', category: '住宿', date: '2026-09-23', payerId: 'wyw', splitMemberIds: ['wyw', 'yyy', 'yh', 'lqw'], settledMemberIds: ['yyy'] }], rates);
    assert.deepEqual(balances.map((item) => item.balance), [200, 0, -100, -100]);
  });

  it('migrates old rows to four-person split', () => {
    const normalized = normalizeExpense({ id: '1', title: '旧账', amount: 1, currency: 'CNY', category: '其他', date: '2026-09-23', payer: 'wyw' });
    assert.equal(normalized.payerId, 'wyw');
    assert.deepEqual(normalized.splitMemberIds, ['wyw', 'yyy', 'yh', 'lqw']);
    assert.equal(normalized.settled, false);
  });

  it('removes completed person-to-person payments from outstanding transfers', () => {
    const balances = calculateMemberBalances([{ id: '1', title: '酒店', amount: 400, currency: 'CNY', category: '住宿', date: '2026-09-23', payerId: 'wyw', splitMemberIds: ['wyw', 'yyy', 'yh', 'lqw'] }], rates);
    const adjusted = applySettlementPayments(balances, [{ id: 'paid-1', from: 'yyy', to: 'wyw', amount: 100, date: '2026-09-23' }]);
    assert.deepEqual(adjusted.map((item) => item.balance), [200, 0, -100, -100]);
    assert.deepEqual(calculateSettlementTransfers(adjusted), [
      { from: 'yh', to: 'wyw', amount: 100 },
      { from: 'lqw', to: 'wyw', amount: 100 },
    ]);
  });

  it('does not over-apply a final payment after an expense member is already settled', () => {
    const balances = calculateMemberBalances([{ id: '1', title: '酒店', amount: 400, currency: 'CNY', category: '住宿', date: '2026-09-23', payerId: 'wyw', splitMemberIds: ['wyw', 'yyy', 'yh', 'lqw'], settledMemberIds: ['yyy'] }], rates);
    const adjusted = applySettlementPayments(balances, [{ id: 'duplicate', from: 'yyy', to: 'wyw', amount: 100, date: '2026-09-23' }]);
    assert.deepEqual(adjusted.map((item) => item.balance), [200, 0, -100, -100]);
  });
});
