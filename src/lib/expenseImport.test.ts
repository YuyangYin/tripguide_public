import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { parseExpenseRows } from './expenseImport.ts';

describe('expense import', () => {
  it('recognizes Chinese headers and defaults to all split members', () => {
    const result = parseExpenseRows([{ 项目: '火车票', 金额: '1,200', 币种: 'CNY', 支出人: 'wyw', 分类: '交通', 日期: '2026/09/24' }], 'yyy');
    assert.equal(result.rows[0].payerId, 'wyw');
    assert.deepEqual(result.rows[0].splitMemberIds, ['wyw', 'yyy', 'yh', 'lqw']);
    assert.equal(result.rows[0].category, '🚆 交通');
    assert.equal(result.rows[0].amount, 1200);
  });

  it('recognizes member lists and settlement status', () => {
    const result = parseExpenseRows([{ title: '个人购物', amount: 20, currency: 'CHF', payer: 'yh', participants: 'yh', settled: '是' }], 'yyy');
    assert.deepEqual(result.rows[0].splitMemberIds, ['yh']);
    assert.equal(result.rows[0].settled, true);
    assert.equal(result.rows[0].currency, 'CHF');
  });

  it('falls back to the signed-in member when payer is blank', () => {
    const result = parseExpenseRows([{ 项目: '咖啡', 金额: 35, 分账人: 'wyw,yyy' }], 'lqw');
    assert.equal(result.rows[0].payerId, 'lqw');
    assert.deepEqual(result.rows[0].splitMemberIds, ['wyw', 'yyy']);
  });

  it('recognizes bilingual headers and skips subtotal rows', () => {
    const result = parseExpenseRows([
      { 'Item 项目': 'Barcelona hotel', 'Paid（CNY）\n已付': 1885, 'Category 类别': '住宿' },
      { 'Item 项目': 'Subtotal 住宿小计', 'Paid（CNY）\n已付': 1885, 'Category 类别': '住宿' },
    ], 'yyy');
    assert.equal(result.rows.length, 1);
    assert.equal(result.rows[0].amount, 1885);
  });

  it('recognizes Hong Kong dollars', () => {
    const result = parseExpenseRows([{ 项目: '机场快线', 金额: 120, 币种: '港币' }], 'yyy');
    assert.equal(result.rows[0].currency, 'HKD');
  });
});
