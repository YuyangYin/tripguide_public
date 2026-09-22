import { parseDateFromText } from './parseFlightText';

export type ParsedHotelFields = {
  hotelName?: string;
  checkIn?: string;
  checkOut?: string;
  nights?: string[];
  roomType?: string;
  address?: string;
  phone?: string;
  confirmationNo?: string;
};

const NAME_STOP = /预订|成功|确认|订单|入住|离店|地址|电话|房型|查看|更多|行程|首页|消息|我的|热门|想去|要去|回忆/;

const toYmd = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const normalize = (raw: string) =>
  (raw || '')
    .replace(/\u00a0/g, ' ')
    .replace(/[–—−]/g, '-')
    .replace(/\s+/g, ' ')
    .trim();

const cleanLine = (line: string) =>
  line.replace(/^[-•·\s]+/, '').replace(/\s+/g, ' ').trim();

const afterLabel = (text: string, labels: string): string | undefined => {
  const match = text.match(new RegExp(`(?:${labels})\\s*[:：#]?\\s*(.+)`, 'i'));
  if (!match) return undefined;
  const value = cleanLine(match[1].split(/(?:入住|离店|确认|地址|电话|房型|\bCheck-?in\b|\bCheck-?out\b|\bAddress\b|\bPhone\b|\bTel\b|\bRoom\b)/i)[0]);
  return value || undefined;
};

const HOTEL_WORD = 'Hotel|Guesthouse|Hostel|Inn|Lodge|Resort|Cottages?|Apartment|Apartments|酒店|客栈|民宿|公寓';

const tidyName = (value: string) =>
  cleanLine(
    value
      .replace(/\s+\d{1,2}\s*月.*$/, '')
      .replace(/\s+\d{4}[-/.].*$/, '')
      .replace(/\s+(提前订|预订成功|确认号.*|Confirmation.*)$/i, '')
  );

const pickHotelName = (text: string): string | undefined => {
  const labeled = afterLabel(text, '酒店名称|酒店名|住宿名称|Hotel\\s*name|Property\\s*name');
  if (labeled && labeled.length >= 2 && !NAME_STOP.test(labeled)) return labeled;

  const sourceLines = text.includes('\n')
    ? text.split('\n').map(cleanLine).filter(Boolean)
    : [text];

  for (const line of sourceLines) {
    const suffix = tidyName(line.match(new RegExp(`([\\w'&.\\u4e00-\\u9fff \\-]{2,48}(?:${HOTEL_WORD}))`, 'i'))?.[1] || '');
    const prefix = tidyName(line.match(new RegExp(`((?:${HOTEL_WORD})\\s+[\\w'&.\\u4e00-\\u9fff \\-]{2,48})`, 'i'))?.[1] || '');
    const candidate = [suffix, prefix].find((name) => name.length >= 3 && !NAME_STOP.test(name) && !/\d{2}/.test(name));
    if (candidate) return candidate;
  }

  return undefined;
};

const pickConfirmation = (text: string): string | undefined => {
  const match = text.match(/(?:确认(?:单|号|码)|Confirmation(?:\s*(?:no|number|#))?|Conf(?:\s*(?:no|number|#))|Booking\s*(?:no|number|ref|id)|订单号)\s*[:：#]?\s*([A-Z0-9][A-Z0-9.\-]{4,})/i);
  return match?.[1].replace(/[.\s]+$/, '');
};

const pickPhone = (text: string): string | undefined => {
  const labeled = text.match(/(?:电话|联系电话|Tel|Phone)\s*[:：]?\s*(\+?[\d][\d\s().-]{6,})/i);
  if (labeled) return labeled[1].replace(/\s+/g, ' ').trim();
  return undefined;
};

const pickAddress = (text: string): string | undefined => {
  return afterLabel(text, '地址|Address');
};

const pickRoom = (text: string): string | undefined => {
  return afterLabel(text, '房型|房间类型|Room(?:\\s*type)?');
};

const pickLabeledDate = (text: string, labels: string): string | undefined => {
  const match = text.match(new RegExp(`(?:${labels})\\s*[:：]?\\s*(.{0,40})`, 'i'));
  if (!match) return undefined;
  return parseDateFromText(match[1]);
};

const pickDateRange = (text: string): { checkIn?: string; checkOut?: string } => {
  const checkIn = pickLabeledDate(text, '入住|入住日期|Check\\s*-?\\s*in(?:\\s*date)?');
  const checkOut = pickLabeledDate(text, '离店|退房|Check\\s*-?\\s*out(?:\\s*date)?');
  if (checkIn || checkOut) return { checkIn, checkOut };

  const cnRange = text.match(/(\d{1,2}\s*月\s*\d{1,2}\s*日)\s*[-至到~]\s*(\d{1,2}\s*月\s*\d{1,2}\s*日)/);
  if (cnRange) {
    return { checkIn: parseDateFromText(cnRange[1]), checkOut: parseDateFromText(cnRange[2]) };
  }

  const enRange = text.match(/((?:\d{1,2}\s*)?(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*\d{1,2}(?:,?\s*\d{2,4})?)\s*[-–to]+\s*((?:\d{1,2}\s*)?(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*\d{1,2}(?:,?\s*\d{2,4})?)/i);
  if (enRange) {
    return { checkIn: parseDateFromText(enRange[1]), checkOut: parseDateFromText(enRange[2]) };
  }

  const single = parseDateFromText(text);
  return single ? { checkIn: single } : {};
};

export function expandHotelNights(checkIn?: string, checkOut?: string): string[] {
  if (!checkIn) return [];
  if (!checkOut || checkOut <= checkIn) return [checkIn];

  const nights: string[] = [];
  const cursor = new Date(`${checkIn}T00:00:00`);
  const end = new Date(`${checkOut}T00:00:00`);
  if (Number.isNaN(cursor.getTime()) || Number.isNaN(end.getTime())) return [checkIn];

  while (cursor < end) {
    nights.push(toYmd(cursor));
    cursor.setDate(cursor.getDate() + 1);
    if (nights.length > 30) break;
  }
  return nights.length ? nights : [checkIn];
}

export function parseHotelText(raw: string): ParsedHotelFields {
  const text = normalize(raw || '');
  if (!text) return {};

  const parsed: ParsedHotelFields = {};
  const name = pickHotelName(raw || text);
  if (name) parsed.hotelName = name;

  const dates = pickDateRange(text);
  if (dates.checkIn) parsed.checkIn = dates.checkIn;
  if (dates.checkOut) parsed.checkOut = dates.checkOut;
  const nights = expandHotelNights(parsed.checkIn, parsed.checkOut);
  if (nights.length) parsed.nights = nights;

  const room = pickRoom(text);
  if (room) parsed.roomType = room;
  const address = pickAddress(text);
  if (address) parsed.address = address;
  const phone = pickPhone(text);
  if (phone) parsed.phone = phone;
  const confirmation = pickConfirmation(text);
  if (confirmation) parsed.confirmationNo = confirmation;

  return parsed;
}

export function isCompleteHotelParse(parsed: ParsedHotelFields): boolean {
  return Boolean(parsed.hotelName && parsed.checkIn);
}

export function hasAnyHotelField(parsed: ParsedHotelFields): boolean {
  return Boolean(parsed.hotelName || parsed.checkIn || parsed.confirmationNo);
}
