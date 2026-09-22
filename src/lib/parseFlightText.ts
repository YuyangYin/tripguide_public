export type ParsedFlightFields = {
  flightNo?: string;
  airline?: string;
  depAirport?: string;
  arrAirport?: string;
  depDate?: string;
  depTime?: string;
  arrTime?: string;
  seatNo?: string;
  gate?: string;
  classType?: string;
};

const AIRLINES: Record<string, string> = {
  FI: '冰岛航空 Icelandair',
  SK: '北欧航空 SAS',
  AY: '芬兰航空 Finnair',
  DY: '挪威航空 Norwegian',
  D8: '挪威航空 Norwegian',
  WF: '维德勒航空 Widerøe',
  NY: '冰岛国内航空 Air Iceland',
  OG: 'PLAY',
  CA: '中国国航 Air China',
  CZ: '南方航空 China Southern',
  MU: '东方航空 China Eastern',
  HU: '海南航空 Hainan Airlines',
  CX: '国泰航空 Cathay Pacific',
  KA: '国泰港龙 Cathay Dragon',
  HX: '香港航空 Hong Kong Airlines',
  NX: '澳门航空 Air Macau',
  BR: '长荣航空 EVA Air',
  CI: '中华航空 China Airlines',
  ZH: '深圳航空 Shenzhen Airlines',
  SC: '山东航空 Shandong Airlines',
  '3U': '四川航空 Sichuan Airlines',
  HO: '吉祥航空 Juneyao Airlines',
  MF: '厦门航空 XiamenAir',
  '9C': '春秋航空 Spring Airlines',
  BA: '英国航空 British Airways',
  LH: '汉莎航空 Lufthansa',
  KL: '荷兰皇家航空 KLM',
  AF: '法国航空 Air France',
  QR: '卡塔尔航空 Qatar Airways',
  EK: '阿联酋航空 Emirates',
  SQ: '新加坡航空 Singapore Airlines',
  NH: '全日空 ANA',
  JL: '日本航空 JAL',
  TK: '土耳其航空 Turkish Airlines',
  LX: '瑞士航空 SWISS',
  OS: '奥地利航空 Austrian',
};

const AIRPORTS: Record<string, string> = {
  KEF: '雷克雅未克',
  RKV: '雷克雅未克',
  AEY: '阿克雷里',
  OSL: '奥斯陆',
  BGO: '卑尔根',
  TRD: '特隆赫姆',
  SVG: '斯塔万格',
  TOS: '特罗姆瑟',
  EVE: '埃沃内斯',
  BOO: '博德',
  HEL: '赫尔辛基',
  TMP: '坦佩雷',
  ARN: '斯德哥尔摩',
  GOT: '哥德堡',
  CPH: '哥本哈根',
  LHR: '伦敦希思罗',
  LGW: '伦敦盖特威克',
  AMS: '阿姆斯特丹',
  CDG: '巴黎戴高乐',
  FRA: '法兰克福',
  MUC: '慕尼黑',
  VIE: '维也纳',
  ZRH: '苏黎世',
  IST: '伊斯坦布尔',
  DOH: '多哈',
  DXB: '迪拜',
  SIN: '新加坡',
  HKG: '香港',
  TPE: '台北',
  NRT: '东京成田',
  HND: '东京羽田',
  ICN: '首尔仁川',
  PEK: '北京首都',
  PKX: '北京大兴',
  PVG: '上海浦东',
  SHA: '上海虹桥',
  CAN: '广州',
  SZX: '深圳',
  CTU: '成都',
  TFU: '成都天府',
  XIY: '西安',
  HGH: '杭州',
  NKG: '南京',
  WUH: '武汉',
  CSX: '长沙',
  XMN: '厦门',
  KMG: '昆明',
  URC: '乌鲁木齐',
  JFK: '纽约肯尼迪',
  EWR: '纽瓦克',
  SFO: '旧金山',
  LAX: '洛杉矶',
};

const MONTHS: Record<string, string> = {
  JAN: '01', FEB: '02', MAR: '03', APR: '04', MAY: '05', JUN: '06',
  JUL: '07', AUG: '08', SEP: '09', OCT: '10', NOV: '11', DEC: '12',
};

const MONTH_TOKEN = '(?:JAN(?:UARY)?|FEB(?:RUARY)?|MAR(?:CH)?|APR(?:IL)?|MAY|JUN(?:E)?|JUL(?:Y)?|AUG(?:UST)?|SEP(?:T(?:EMBER)?)?|OCT(?:OBER)?|NOV(?:EMBER)?|DEC(?:EMBER)?)';

const monthFromToken = (token: string) => MONTHS[token.slice(0, 3).toUpperCase()] || '';

const padYmd = (year: string, month: string, day: string) =>
  `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

const inferYear = () => String(new Date().getFullYear());

const expandYear = (raw: string) => (raw.length === 2 ? `20${raw}` : raw);

const KNOWN_PREFIXES = new Set(Object.keys(AIRLINES));

const formatAirport = (code: string) => {
  const city = AIRPORTS[code];
  return city ? `${city} ${code}` : code;
};

const normalize = (raw: string) =>
  raw
    .replace(/\u00a0/g, ' ')
    .replace(/[–—−]/g, '-')
    .replace(/[➔→➜]/g, '->')
    .replace(/\s+/g, ' ')
    .trim();

const pickFlightNumber = (text: string): { code: string; number: string } | undefined => {
  const upper = text.toUpperCase();
  const labeled = upper.match(/(?:FLIGHT|FLT|航班号?|航班)\s*[:#]?\s*([A-Z]{2}|[A-Z]\d|\d[A-Z])\s*-?\s*(\d{1,4})\b/);
  if (labeled) return { code: labeled[1], number: labeled[2] };

  const all = [...upper.matchAll(/\b([A-Z]{2}|[A-Z]\d|\d[A-Z])\s*-?\s*(\d{2,4})\b/g)];
  const known = all.find(m => KNOWN_PREFIXES.has(m[1]));
  if (known) return { code: known[1], number: known[2] };

  const nearby = all.find(m => {
    const idx = m.index ?? -1;
    const window = upper.slice(Math.max(0, idx - 18), idx + 18);
    return /FLIGHT|FLT|航班/.test(window);
  });
  if (nearby) return { code: nearby[1], number: nearby[2] };
  return undefined;
};

const pickAirline = (text: string, prefix?: string): string | undefined => {
  if (prefix && AIRLINES[prefix]) return AIRLINES[prefix];
  const pairs: Array<[RegExp, string]> = [
    [/ICELANDAIR|冰岛航空/i, AIRLINES.FI],
    [/SCANDINAVIAN|北欧航空|\bSAS\b/i, AIRLINES.SK],
    [/FINNAIR|芬兰航空/i, AIRLINES.AY],
    [/NORWEGIAN|挪威航空/i, AIRLINES.DY],
    [/AIR\s*CHINA|中国国际航空|中国国航/i, AIRLINES.CA],
    [/CATHAY|国泰/i, AIRLINES.CX],
    [/LUFTHANSA|汉莎/i, AIRLINES.LH],
    [/BRITISH\s*AIRWAYS|英国航空/i, AIRLINES.BA],
    [/EMIRATES|阿联酋/i, AIRLINES.EK],
    [/QATAR|卡塔尔/i, AIRLINES.QR],
  ];
  for (const [re, name] of pairs) {
    if (re.test(text)) return name;
  }
  return undefined;
};

const knownCodesIn = (chunk: string): string[] => {
  const found: string[] = [];
  for (const match of chunk.toUpperCase().matchAll(/\b([A-Z]{3})\b/g)) {
    if (AIRPORTS[match[1]] && !found.includes(match[1])) found.push(match[1]);
  }
  return found;
};

const pickAirports = (text: string): { dep?: string; arr?: string } => {
  const upper = text.toUpperCase();
  const fromChunk = upper.match(/(?:FROM|DEPART|出发|起飞)(.{0,48}?)(?:TO|ARRIV|到达|抵达|$)/);
  const toChunk = upper.match(/(?:TO|ARRIV|到达|抵达)(.{0,48})/);
  const dep = fromChunk ? knownCodesIn(fromChunk[1])[0] : undefined;
  const arr = toChunk ? knownCodesIn(toChunk[1])[0] : undefined;
  if (dep && arr && dep !== arr) return { dep, arr };

  const arrow = upper.match(/\b([A-Z]{3})\b\s*(?:->|-|\/)\s*\b([A-Z]{3})\b/);
  if (arrow && AIRPORTS[arrow[1]] && AIRPORTS[arrow[2]] && arrow[1] !== arrow[2]) {
    return { dep: arrow[1], arr: arrow[2] };
  }

  const unique = knownCodesIn(upper);
  if (unique.length >= 2) return { dep: unique[0], arr: unique[1] };
  return {};
};

export const parseDateFromText = (text: string): string | undefined => {
  const ymd = text.match(/\b(20\d{2})[-/.](\d{1,2})[-/.](\d{1,2})\b/);
  if (ymd) return padYmd(ymd[1], ymd[2], ymd[3]);

  const cnYear = text.match(/20(\d{2})\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*日?/);
  if (cnYear) return padYmd(`20${cnYear[1]}`, cnYear[2], cnYear[3]);

  const cn = text.match(/(\d{1,2})\s*月\s*(\d{1,2})\s*日/);
  if (cn) return padYmd(inferYear(), cn[1], cn[2]);

  const upper = text.toUpperCase();
  const dayMonthYear = upper.match(new RegExp(`\\b(\\d{1,2})\\s*(${MONTH_TOKEN})\\s*(\\d{2,4})\\b`));
  if (dayMonthYear) {
    return padYmd(expandYear(dayMonthYear[3]), monthFromToken(dayMonthYear[2]), dayMonthYear[1]);
  }

  const monthDayYear = upper.match(new RegExp(`\\b(${MONTH_TOKEN})\\s*(\\d{1,2})(?:ST|ND|RD|TH)?,?\\s*(\\d{2,4})\\b`));
  if (monthDayYear) {
    return padYmd(expandYear(monthDayYear[3]), monthFromToken(monthDayYear[1]), monthDayYear[2]);
  }

  const dayMonth = upper.match(new RegExp(`\\b(\\d{1,2})\\s*(${MONTH_TOKEN})\\b`));
  if (dayMonth) {
    return padYmd(inferYear(), monthFromToken(dayMonth[2]), dayMonth[1]);
  }

  const monthDay = upper.match(new RegExp(`\\b(${MONTH_TOKEN})\\s*(\\d{1,2})(?:ST|ND|RD|TH)?\\b`));
  if (monthDay) {
    return padYmd(inferYear(), monthFromToken(monthDay[1]), monthDay[2]);
  }

  const numeric = text.match(/\b(\d{1,2})[./](\d{1,2})[./](\d{2,4})\b/);
  if (numeric) {
    const first = parseInt(numeric[1], 10);
    const second = parseInt(numeric[2], 10);
    const year = expandYear(numeric[3]);
    if (second > 12 && first <= 12) return padYmd(year, numeric[1], numeric[2]);
    return padYmd(year, numeric[2], numeric[1]);
  }

  return undefined;
};

const pickTimes = (text: string): { dep?: string; arr?: string } => {
  const labeledDep = text.match(/(?:DEP(?:ART(?:URE)?)?|起飞|出发)\s*[:\s]*([01]?\d|2[0-3])[:.]([0-5]\d)/i);
  const labeledArr = text.match(/(?:ARR(?:IVAL)?|到达|抵达)\s*[:\s]*([01]?\d|2[0-3])[:.]([0-5]\d)/i);
  const clock = [...text.matchAll(/\b([01]?\d|2[0-3])[:.]([0-5]\d)\b/g)];
  const fmt = (h: string, m: string) => `${h.padStart(2, '0')}:${m}`;
  const dep = labeledDep ? fmt(labeledDep[1], labeledDep[2]) : clock[0] ? fmt(clock[0][1], clock[0][2]) : undefined;
  const arr = labeledArr ? fmt(labeledArr[1], labeledArr[2]) : clock[1] ? fmt(clock[1][1], clock[1][2]) : undefined;
  return { dep, arr };
};

const pickSeat = (text: string): string | undefined => {
  const labeled = text.toUpperCase().match(/(?:SEAT|座位号?)\s*[:#]?\s*([1-9]\d{0,2}\s?[A-HK])/);
  if (labeled) return labeled[1].replace(/\s+/g, '');
  return undefined;
};

const pickGate = (text: string): string | undefined => {
  const labeled = text.toUpperCase().match(/(?:GATE|登机口)\s*[:#]?\s*([A-Z]?\d{1,3}[A-Z]?)/);
  return labeled?.[1];
};

const pickClass = (text: string): string | undefined => {
  if (/头等|FIRST\s*CLASS/i.test(text)) return '头等舱';
  if (/商务|公务|BUSINESS/i.test(text)) return '公务舱';
  if (/超级经济|PREMIUM\s*ECON/i.test(text)) return '超级经济舱';
  if (/经济|ECONOMY/i.test(text)) return '经济舱';
  return undefined;
};

export function parseFlightText(raw: string): ParsedFlightFields {
  const text = normalize(raw || '');
  if (!text) return {};

  const flight = pickFlightNumber(text);
  const airports = pickAirports(text);
  const times = pickTimes(text);

  const parsed: ParsedFlightFields = {};
  if (flight) parsed.flightNo = `${flight.code}${flight.number}`;
  const airline = pickAirline(text, flight?.code);
  if (airline) parsed.airline = airline;
  if (airports.dep) parsed.depAirport = formatAirport(airports.dep);
  if (airports.arr) parsed.arrAirport = formatAirport(airports.arr);
  const date = parseDateFromText(text);
  if (date) parsed.depDate = date;
  if (times.dep) parsed.depTime = times.dep;
  if (times.arr) parsed.arrTime = times.arr;
  const seat = pickSeat(text);
  if (seat) parsed.seatNo = seat;
  const gate = pickGate(text);
  if (gate) parsed.gate = gate;
  const cabin = pickClass(text);
  if (cabin) parsed.classType = cabin;
  return parsed;
}

export function isCompleteFlightParse(parsed: ParsedFlightFields): boolean {
  return Boolean(parsed.flightNo && parsed.depAirport && parsed.arrAirport && parsed.depDate);
}

export function hasAnyFlightField(parsed: ParsedFlightFields): boolean {
  return Boolean(parsed.flightNo || (parsed.depAirport && parsed.arrAirport));
}

export function flightDepartureValue(flight: { depDate?: string | null; depTime?: string | null }): number {
  const date = (flight.depDate || '').trim();
  if (!date) return Number.POSITIVE_INFINITY;
  const time = (flight.depTime || '00:00').trim() || '00:00';
  const timestamp = Date.parse(`${date}T${time}`);
  return Number.isNaN(timestamp) ? Number.POSITIVE_INFINITY : timestamp;
}

export function sortFlightsByDeparture<T extends { depDate?: string | null; depTime?: string | null }>(flights: T[]): T[] {
  return [...flights].sort((a, b) => flightDepartureValue(a) - flightDepartureValue(b));
}
