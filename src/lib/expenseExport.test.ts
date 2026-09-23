import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import * as XLSX from '@e965/xlsx';
import { createExpenseWorkbook } from './expenseExport';
import type { SupportedCurrency } from './expenseSettlement';

const rates: Record<SupportedCurrency, number> = { CNY: 1, HKD: 0.91, NOK: 0.67, EUR: 7.8, CHF: 8.2, SEK: 0.7 };

describe('expense Excel export', () => {
  it('exports bills, member settlements and exchange rates as readable sheets', () => {
    const workbook = createExpenseWorkbook([
      { id: 'bill-1', title: '晚餐', amount: 400, currency: 'HKD', category: '🍔 餐饮', date: '2026-09-24', payerId: 'wyw', splitMemberIds: ['wyw', 'yyy', 'yh', 'lqw'], settledMemberIds: ['yyy'] },
    ], [{ id: 'payment-1', from: 'yh', to: 'wyw', amount: 91, date: '2026-09-24' }], rates);
    const buffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
    const reopened = XLSX.read(buffer, { type: 'array' });
    assert.deepEqual(reopened.SheetNames, ['账单流水', '成员结算流水', '共享汇率']);
    const bills = XLSX.utils.sheet_to_json<Record<string, unknown>>(reopened.Sheets['账单流水']);
    assert.equal(bills[0]['币种代码'], 'HKD');
    assert.equal(bills[0]['折合人民币'], 364);
    assert.equal(bills[0]['结算状态'], '部分结算 1/3');
    const payments = XLSX.utils.sheet_to_json<Record<string, unknown>>(reopened.Sheets['成员结算流水']);
    assert.equal(payments[0]['付款人'], 'yh');
  });
});
