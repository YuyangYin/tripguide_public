import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { sanitizeAmountInput } from './expenseInput.ts';

describe('sanitizeAmountInput', () => {
  it('keeps digits and one decimal point', () => {
    assert.equal(sanitizeAmountInput('123.45'), '123.45');
    assert.equal(sanitizeAmountInput('.75'), '0.75');
  });

  it('removes signs, exponent notation, spaces and letters', () => {
    assert.equal(sanitizeAmountInput('-1e2 元'), '12');
    assert.equal(sanitizeAmountInput('+ 98abc'), '98');
  });

  it('drops additional decimal points', () => {
    assert.equal(sanitizeAmountInput('1.2.3'), '1.23');
  });
});
