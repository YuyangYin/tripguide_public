import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { classifyGooglePlace, extractGoogleMapsListId, inferGuideCountry, parseGoogleMapsListPayload, placeToGuideItem } from './googleMapsList';

describe('Google Maps list import', () => {
  it('extracts list ids from shared-list URLs', () => {
    assert.equal(extractGoogleMapsListId('https://www.google.com/maps/@1,2,3z/data=!4m2!11m1!2sLIST_123?entry=ttu'), 'LIST_123');
    assert.equal(extractGoogleMapsListId('https://www.google.com/maps/placelists/list/LIST_456'), 'LIST_456');
  });

  it('parses Google list payload fields', () => {
    const payload = `)]}'\n[[["LIST",1],4,[2,1,"url"],["Owner"],"stockholm","",null,null,[[null,[null,null,"Address, 瑞典",null,"Address",[null,null,59.3,18.1],["a","b"]],"Cafe Test"]],[],null,null,1]]`;
    const parsed = parseGoogleMapsListPayload(payload, 'https://www.google.com/maps/data=!2sLIST');
    assert.equal(parsed.places[0].name, 'Cafe Test');
    assert.equal(parsed.places[0].latitude, 59.3);
  });

  it('classifies places and countries with robust fallbacks', () => {
    assert.equal(classifyGooglePlace({ name: 'Test Bageri', address: 'Stockholm', rawType: '糕点店' }), 'food');
    assert.equal(classifyGooglePlace({ name: 'T-Centralen', address: 'Stockholm' }), 'traffic');
    assert.equal(inferGuideCountry({ name: 'Test', address: 'Stockholm, Sweden' }).id, 'sweden');
  });

  it('creates a guide card with coordinates, image fallback and map sources', () => {
    const item = placeToGuideItem({ id: '1', name: 'Test Cafe', address: 'Stockholm, Sweden', latitude: 59.3, longitude: 18.1 }, { listId: 'LIST', title: 'stockholm', sourceUrl: 'https://www.google.com/maps/data=!2sLIST' });
    assert.equal(item.category, 'food');
    assert.match(item.coverImage || '', /static-maps\.yandex/);
    assert.match(item.googleMapsUrl || '', /google\.com\/maps/);
  });
});
