import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { DEFAULT_BAGGAGE, evaluateBaggage, parseBaggageWeights, type MemberBaggage } from './baggageAllowance';

const members = (updates: Partial<Record<MemberBaggage['id'], Partial<MemberBaggage>>>) => DEFAULT_BAGGAGE.map((member) => ({
  ...member,
  ...updates[member.id],
  updatedAt: '2026-09-23T00:00:00.000Z',
}));

describe('baggage allowance', () => {
  it('parses one weight per bag from common separators', () => {
    assert.deepEqual(parseBaggageWeights('22kg，20 / 7.5'), [22, 20, 7.5]);
    assert.deepEqual(parseBaggageWeights(''), []);
    assert.deepEqual(parseBaggageWeights('0, 0kg'), []);
  });

  it('checks Air China per-person pieces and checked weight', () => {
    const result = evaluateBaggage('air-china', members({ wyw: { checked: '24', carryOn: '7,2' } }));
    assert.deepEqual(result.memberIssues.wyw, [
      '第 1 件托运行李 24kg，超出 23kg',
      '手提行李 2 件，超过每人 1 件',
    ]);
  });

  it('checks Vueling pooled checked bags and rejects carry-on bags', () => {
    const result = evaluateBaggage('vueling', members({
      wyw: { checked: '20', carryOn: '5' },
      yyy: { checked: '20' },
      yh: { checked: '20' },
      lqw: { checked: '20' },
    }));
    assert.ok(result.groupIssues.includes('托运行李共 4 件，超过团队额度 3 件'));
    assert.ok(result.groupIssues.includes('手提行李共 1 件，超过团队额度 0 件'));
  });

  it('checks Norwegian combined carry-on and personal-item weight', () => {
    const result = evaluateBaggage('norwegian', members({ wyw: { carryOn: '8', personal: '3' } }));
    assert.deepEqual(result.memberIssues.wyw, ['手提行李与小包合计 11kg，超出 10kg']);
  });

  it('checks Swiss combined carry-on and personal-item weight', () => {
    const result = evaluateBaggage('swiss', members({ lqw: { carryOn: '9', personal: '4' } }));
    assert.deepEqual(result.memberIssues.lqw, ['手提行李与小包合计 13kg，超出 12kg']);
  });

  it('checks SAS eight-kilogram carry-on limit', () => {
    const result = evaluateBaggage('sas', members({ yyy: { carryOn: '8.5' } }));
    assert.deepEqual(result.memberIssues.yyy, ['第 1 件手提行李 8.5kg，超出 8kg']);
  });
});
