import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { getClothingAdvice, getWeatherDescription, localDateKey } from './tripWeather';

describe('trip weather', () => {
  it('maps WMO weather codes to Chinese descriptions', () => {
    assert.equal(getWeatherDescription(0), '晴朗');
    assert.equal(getWeatherDescription(61), '小雨');
    assert.equal(getWeatherDescription(999), '天气待确认');
  });

  it('recommends rain and wind protection when needed', () => {
    const advice = getClothingAdvice({ apparentMax: 12, apparentMin: 4, precipitationProbability: 60, precipitationSum: 8, windGustMax: 55 });
    assert.match(advice, /抓绒/);
    assert.match(advice, /防水/);
    assert.match(advice, /阵风较强/);
  });

  it('formats a local calendar date without UTC shifting', () => {
    assert.equal(localDateKey(new Date(2026, 8, 23, 1, 0)), '2026-09-23');
  });
});
