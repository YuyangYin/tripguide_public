import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { isCompleteFlightParse, parseFlightText, sortFlightsByDeparture } from './parseFlightText.ts';

describe('parseFlightText', () => {
  it('parses a typical English boarding pass', () => {
    const parsed = parseFlightText(`
      SAS Scandinavian Airlines
      BOARDING PASS
      Flight SK 4683
      From Keflavik KEF
      To Oslo OSL
      Date 19SEP26
      Dep 11:15  Arr 14:55
      Seat 16C  Gate D14
      Class Economy
    `);
    assert.equal(parsed.flightNo, 'SK4683');
    assert.equal(parsed.airline, '北欧航空 SAS');
    assert.match(parsed.depAirport || '', /KEF/);
    assert.match(parsed.arrAirport || '', /OSL/);
    assert.equal(parsed.depDate, '2026-09-19');
    assert.equal(parsed.depTime, '11:15');
    assert.equal(parsed.arrTime, '14:55');
    assert.equal(parsed.seatNo, '16C');
    assert.equal(parsed.gate, 'D14');
    assert.equal(parsed.classType, '经济舱');
    assert.equal(isCompleteFlightParse(parsed), true);
  });

  it('parses a Chinese itinerary screenshot', () => {
    const parsed = parseFlightText(`
      中国国际航空
      航班号 CA911
      出发 北京首都 PEK
      到达 斯德哥尔摩 ARN
      日期 2026年9月11日
      起飞 13:50 到达 17:20
      座位 22A 登机口 E19
      舱位 经济舱
    `);
    assert.equal(parsed.flightNo, 'CA911');
    assert.equal(parsed.airline, '中国国航 Air China');
    assert.match(parsed.depAirport || '', /PEK/);
    assert.match(parsed.arrAirport || '', /ARN/);
    assert.equal(parsed.depDate, '2026-09-11');
    assert.equal(parsed.depTime, '13:50');
    assert.equal(parsed.arrTime, '17:20');
    assert.equal(parsed.seatNo, '22A');
    assert.equal(isCompleteFlightParse(parsed), true);
  });

  it('does not treat city names like NEW YORK as airport codes', () => {
    const parsed = parseFlightText(`
      Lufthansa Flight LH 400
      From Frankfurt FRA
      To New York JFK
      Date 21SEP26
      Dep 10:15 Arr 13:40
    `);
    assert.equal(parsed.flightNo, 'LH400');
    assert.match(parsed.depAirport || '', /FRA/);
    assert.match(parsed.arrAirport || '', /JFK/);
    assert.doesNotMatch(parsed.arrAirport || '', /NEW/);
  });

  it('parses FROM/TO IATA route on one line', () => {
    const parsed = parseFlightText('AY991 HEL-KEF 16:20-18:15 13SEP26 SEAT 08D');
    assert.equal(parsed.flightNo, 'AY991');
    assert.match(parsed.depAirport || '', /HEL/);
    assert.match(parsed.arrAirport || '', /KEF/);
    assert.equal(parsed.depDate, '2026-09-13');
    assert.equal(parsed.depTime, '16:20');
    assert.equal(parsed.arrTime, '18:15');
  });

  it('parses itinerary dates in full month, numeric and Chinese forms', () => {
    assert.equal(parseFlightText('SK4786 KEF OSL 19 September 2026 23:10').depDate, '2026-09-19');
    assert.equal(parseFlightText('SK4786 KEF-OSL September 19, 2026 23:10').depDate, '2026-09-19');
    assert.equal(parseFlightText('航班 SK4786 日期 19/09/2026 23:10 KEF OSL').depDate, '2026-09-19');
    assert.equal(parseFlightText('SK4786 19.09.26 KEF OSL').depDate, '2026-09-19');
    assert.equal(parseFlightText('航班 SK4786 9月19日 KEF OSL').depDate, `${new Date().getFullYear()}-09-19`);
    assert.equal(parseFlightText('DATE 19 SEP SK4786 KEF OSL').depDate, `${new Date().getFullYear()}-09-19`);
  });

  it('does not treat a flight as complete when the date is missing', () => {
    const parsed = parseFlightText('Flight SK 4786 From Keflavik KEF To Oslo OSL Dep 23:10 Arr 08:40');
    assert.equal(parsed.flightNo, 'SK4786');
    assert.equal(parsed.depDate, undefined);
    assert.equal(isCompleteFlightParse(parsed), false);
  });

  it('sorts flights by departure date and time', () => {
    const sorted = sortFlightsByDeparture([
      { id: 'c', depDate: '2026-09-21', depTime: '08:00' },
      { id: 'a', depDate: '2026-09-19', depTime: '23:10' },
      { id: 'x', depDate: '', depTime: '10:00' },
      { id: 'b', depDate: '2026-09-21', depTime: '06:30' },
    ]);
    assert.deepEqual(sorted.map((item) => item.id), ['a', 'b', 'c', 'x']);
  });

  it('does not invent an Iceland flight from unrelated photo text', () => {
    const parsed = parseFlightText(`
      Golden Circle tour
      Gulfoss waterfall Iceland
      Hotel Lotus Reykjavik
      Saturday brunch menu
    `);
    assert.equal(parsed.flightNo, undefined);
    assert.equal(isCompleteFlightParse(parsed), false);
  });

  it('treats empty or garbage OCR as unparsed', () => {
    assert.equal(isCompleteFlightParse(parseFlightText('')), false);
    assert.equal(isCompleteFlightParse(parseFlightText('lorem ipsum 1234 abcd')), false);
  });
});
