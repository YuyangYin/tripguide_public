import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  createPayerProfile,
  getExpensePayers,
  getPayerDirectory,
  NORDIC_AVATAR_COUNT,
  packExpenseAttribution,
  resolvePayerAttribution,
  unpackExpenseAttribution
} from './expenseAttribution.ts';

describe('expense attribution', () => {
  it('packs multiple payers into the existing category column and restores them', () => {
    const payers = [
      { name: '小北', avatarId: 7 },
      { name: '阿圆', avatarId: 12 }
    ];
    const packed = packExpenseAttribution({ category: '🍔 餐饮', payers });
    assert.equal(packed.payers, undefined);
    assert.match(packed.category, /^🍔 餐饮 \[\[payers:/);

    const restored = unpackExpenseAttribution(packed);
    assert.equal(restored.category, '🍔 餐饮');
    assert.deepEqual(restored.payers, payers);
  });

  it('upgrades the legacy single-payer category marker', () => {
    const restored = unpackExpenseAttribution<Record<string, any>>({ category: '🏠 住宿 [[payer:%E5%B0%8F%E5%8C%97|avatar:7]]' });
    assert.equal(restored.category, '🏠 住宿');
    assert.equal(restored.payer, '小北');
    assert.deepEqual(restored.payers, [{ name: '小北', avatarId: 7 }]);
  });

  it('keeps old expense rows unchanged', () => {
    const row = { category: '🏠 住宿' };
    assert.deepEqual(unpackExpenseAttribution(row), row);
  });

  it('returns every selected payer for a multi-payer expense', () => {
    const payers = [{ name: '小北', avatarId: 2 }, { name: '阿圆', avatarId: 5 }];
    assert.deepEqual(getExpensePayers({ payers }), payers);
  });

  it('reuses an existing payer avatar regardless of name casing', () => {
    const result = resolvePayerAttribution([{ payer: 'Gasoline', payerAvatar: 11 }], ' gasoline ');
    assert.deepEqual(result, { name: 'Gasoline', avatarId: 11 });
  });

  it('assigns all 20 avatars without duplicates before reuse is needed', () => {
    const profiles: { name: string; avatarId: number }[] = [];
    for (let index = 0; index < NORDIC_AVATAR_COUNT; index += 1) {
      profiles.push(createPayerProfile(profiles, `Person ${index}`));
    }

    assert.equal(new Set(profiles.map((profile) => profile.avatarId)).size, NORDIC_AVATAR_COUNT);
    assert.equal(getPayerDirectory([{ payers: profiles }]).length, NORDIC_AVATAR_COUNT);
  });
});
