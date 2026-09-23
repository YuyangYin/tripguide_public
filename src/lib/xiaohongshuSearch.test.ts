import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { getRouteSearchLocation, getXiaohongshuSearchUrls } from './xiaohongshuSearch';

describe('Xiaohongshu search helpers', () => {
  it('uses the last location in a route as the current place', () => {
    assert.equal(getRouteSearchLocation('北京 → 巴塞罗那', '西班牙'), '巴塞罗那');
    assert.equal(getRouteSearchLocation('巴塞罗那', '西班牙'), '巴塞罗那');
  });

  it('removes parenthetical notes and falls back to the region label', () => {
    assert.equal(getRouteSearchLocation('香港 ✈ 雷克雅未克（冰岛）', '冰岛'), '雷克雅未克');
    assert.equal(getRouteSearchLocation('', '瑞典'), '瑞典');
  });

  it('builds app and web search URLs with the same encoded keyword', () => {
    const urls = getXiaohongshuSearchUrls('巴塞罗那 美食');
    assert.match(urls.app, /^xhsdiscover:\/\/search\/result\?keyword=/);
    assert.ok(urls.app.includes('%E5%B7%B4%E5%A1%9E'));
    assert.ok(urls.web.includes('xiaohongshu.com/search_result'));
  });
});
