import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { normalizeMultilineItems, splitMultilineDraft } from './multilineInput';

describe('multiline itinerary input', () => {
  it('keeps the trailing empty line while the user is editing', () => {
    assert.deepEqual(splitMultilineDraft('景点一\n'), ['景点一', '']);
    assert.equal(splitMultilineDraft('景点一\n').join('\n'), '景点一\n');
  });

  it('keeps multiple blank lines until save', () => {
    assert.deepEqual(splitMultilineDraft('餐厅一\n\n餐厅二'), ['餐厅一', '', '餐厅二']);
  });

  it('trims and removes blank rows only when saving', () => {
    assert.deepEqual(normalizeMultilineItems([' 景点一 ', '', '  ', '景点二']), ['景点一', '景点二']);
  });
});
