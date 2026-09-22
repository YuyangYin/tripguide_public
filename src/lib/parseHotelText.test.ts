import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { expandHotelNights, isCompleteHotelParse, parseHotelText } from './parseHotelText.ts';

describe('parseHotelText', () => {
  it('parses a Chinese booking confirmation', () => {
    const parsed = parseHotelText(`
      预订成功
      酒店名称 Hotel Reykjavik Centrum
      入住 2026年9月27日
      离店 2026年10月1日
      确认号 AB123456
      房型 标准双人间
      地址 Austurstraeti 16, Reykjavik
      电话 +354 514 6000
    `);
    assert.equal(parsed.hotelName, 'Hotel Reykjavik Centrum');
    assert.equal(parsed.checkIn, '2026-09-27');
    assert.equal(parsed.checkOut, '2026-10-01');
    assert.deepEqual(parsed.nights, ['2026-09-27', '2026-09-28', '2026-09-29', '2026-09-30']);
    assert.equal(parsed.confirmationNo, 'AB123456');
    assert.match(parsed.roomType || '', /标准双人间/);
    assert.match(parsed.address || '', /Austurstraeti/);
    assert.match(parsed.phone || '', /354/);
    assert.equal(isCompleteHotelParse(parsed), true);
  });

  it('parses an English Booking.com confirmation', () => {
    const parsed = parseHotelText(`
      Your booking is confirmed
      Hotel Lotus
      Check-in: Fri 18 Sep 2026
      Check-out: Sun 20 Sep 2026
      Confirmation number: 1234.567.890
      Address: Laugavegur 170, Reykjavik
      Room type: Twin Room
    `);
    assert.equal(parsed.hotelName, 'Hotel Lotus');
    assert.equal(parsed.checkIn, '2026-09-18');
    assert.equal(parsed.checkOut, '2026-09-20');
    assert.deepEqual(parsed.nights, ['2026-09-18', '2026-09-19']);
    assert.match(parsed.confirmationNo || '', /1234/);
    assert.equal(isCompleteHotelParse(parsed), true);
  });

  it('parses a date range on one line', () => {
    const parsed = parseHotelText('Glass Cottages Iceland  9月27日-10月1日  确认号 GC9988');
    assert.match(parsed.hotelName || '', /Glass Cottages/i);
    assert.equal(parsed.checkIn, `${new Date().getFullYear()}-09-27`);
    assert.equal(parsed.checkOut, `${new Date().getFullYear()}-10-01`);
  });

  it('does not treat a hotel as complete when the name or date is missing', () => {
    assert.equal(isCompleteHotelParse(parseHotelText('入住 2026年9月27日 离店 2026年9月28日')), false);
    assert.equal(isCompleteHotelParse(parseHotelText('Hotel Lotus Reykjavik')), false);
  });

  it('does not invent a hotel from unrelated photo text', () => {
    const parsed = parseHotelText(`
      Golden Circle tour
      Gulfoss waterfall Iceland
      Saturday brunch menu
    `);
    assert.equal(parsed.hotelName, undefined);
    assert.equal(isCompleteHotelParse(parsed), false);
  });

  it('expands check-in/out into nightly stays', () => {
    assert.deepEqual(expandHotelNights('2026-09-27', '2026-09-29'), ['2026-09-27', '2026-09-28']);
    assert.deepEqual(expandHotelNights('2026-09-27'), ['2026-09-27']);
  });
});
