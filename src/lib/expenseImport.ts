import * as XLSX from '@e965/xlsx';
import { SharedExpense, SupportedCurrency } from './expenseSettlement';
import { parseMemberIds, TRAVEL_MEMBER_IDS, TravelMemberId } from './travelMembers';

type RawRow = Record<string, unknown>;

export interface ExpenseImportResult {
  rows: SharedExpense[];
  warnings: string[];
  sheetName: string;
}

const HEADER_ALIASES = {
  title: ['项目', '名称', '支出名称', '账单名称', 'item', 'title', 'description'],
  amount: ['金额', '支付金额', '实际金额', '已付', 'paid', '总额', '总计(人民币)', 'total (cny)', 'total', 'amount', '费用', '单价', 'unit price'],
  currency: ['币种', '货币', 'currency'],
  category: ['分类', '类别', 'category', 'type', '支出类型'],
  date: ['日期', 'date', '消费日期', '支出日期'],
  payer: ['支出人', '付款人', '支付人', 'payer', 'paid by'],
  splitMembers: ['分账人', '参与人', '均摊人', 'split', 'split members', 'participants'],
  settled: ['已结算', '是否结算', 'settled', '结算状态'],
} as const;

const normalizeHeader = (value: unknown) => String(value ?? '').trim().toLowerCase().replace(/\s+/g, ' ');
const headerMatches = (header: string, alias: string) => Boolean(header && alias) && (header === alias || header.includes(alias) || alias.includes(header));

function findValue(row: RawRow, aliases: readonly string[]) {
  const entries = Object.entries(row);
  for (const alias of aliases) {
    const entry = entries.find(([key]) => headerMatches(normalizeHeader(key), normalizeHeader(alias)));
    if (entry && entry[1] !== '' && entry[1] !== null && entry[1] !== undefined) return entry[1];
  }
  return undefined;
}

function findAmountValue(row: RawRow) {
  const entries = Object.entries(row);
  let zeroValue: unknown;
  for (const alias of HEADER_ALIASES.amount) {
    const entry = entries.find(([key]) => headerMatches(normalizeHeader(key), normalizeHeader(alias)));
    if (!entry || entry[1] === '' || entry[1] === null || entry[1] === undefined) continue;
    const amount = parseAmount(entry[1]);
    if (amount > 0) return entry[1];
    if (Number.isFinite(amount)) zeroValue = entry[1];
  }
  return zeroValue;
}

const parseAmount = (value: unknown) => {
  if (typeof value === 'number') return Math.abs(value);
  const parsed = Number(String(value ?? '').replace(/[¥￥€$£,\s]/g, ''));
  return Number.isFinite(parsed) ? Math.abs(parsed) : NaN;
};

const parseCurrency = (value: unknown): SupportedCurrency => {
  const text = String(value ?? '').trim().toUpperCase();
  if (text.includes('CHF') || text.includes('瑞士')) return 'CHF';
  if (text.includes('SEK') || text.includes('瑞典')) return 'SEK';
  if (text.includes('NOK') || text.includes('挪威')) return 'NOK';
  if (text.includes('EUR') || text.includes('欧元') || text.includes('€')) return 'EUR';
  return 'CNY';
};

const parseDate = (value: unknown) => {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString().slice(0, 10);
  if (typeof value === 'number') {
    const parsed = XLSX.SSF.parse_date_code(value);
    if (parsed) return `${parsed.y}-${String(parsed.m).padStart(2, '0')}-${String(parsed.d).padStart(2, '0')}`;
  }
  const text = String(value ?? '').trim();
  const match = text.match(/(20\d{2})[\/.年-](\d{1,2})[\/.月-](\d{1,2})/);
  if (match) return `${match[1]}-${match[2].padStart(2, '0')}-${match[3].padStart(2, '0')}`;
  return new Date().toLocaleDateString('en-CA');
};

const parseSettled = (value: unknown) => /^(是|已|完成|true|yes|y|1|settled)$/i.test(String(value ?? '').trim());

const parseCategory = (value: unknown) => {
  const text = String(value ?? '').trim();
  if (/住宿|酒店|hotel|stay/i.test(text)) return '🏠 住宿';
  if (/交通|机票|火车|地铁|公交|船|flight|train|transport/i.test(text)) return '🚆 交通';
  if (/加油|充电|燃油|fuel|gas/i.test(text)) return '⛽️ 加油';
  if (/餐|吃|food|meal|restaurant/i.test(text)) return '🍔 餐饮';
  if (/景点|门票|ticket|attraction/i.test(text)) return '🎫 景点';
  if (/租车|rental|car/i.test(text)) return '🚗 租车';
  return text || '🛠️ 其他';
};

export function parseExpenseRows(rawRows: RawRow[], currentMemberId: TravelMemberId): ExpenseImportResult {
  const warnings: string[] = [];
  const rows: SharedExpense[] = [];
  rawRows.forEach((raw, index) => {
    const title = String(findValue(raw, HEADER_ALIASES.title) ?? '').trim();
    const amount = parseAmount(findAmountValue(raw));
    if (!title && !Number.isFinite(amount)) return;
    if (/subtotal|grand total|小计|合计|总预算|每人平均|类别|category/i.test(title)) return;
    if (!title || !Number.isFinite(amount) || amount <= 0) {
      warnings.push(`第 ${index + 2} 行缺少名称或有效金额，已跳过。`);
      return;
    }
    const payerIds = parseMemberIds(findValue(raw, HEADER_ALIASES.payer));
    const splitIds = parseMemberIds(findValue(raw, HEADER_ALIASES.splitMembers));
    rows.push({
      id: `import-${Date.now()}-${index}`,
      title,
      amount,
      currency: parseCurrency(findValue(raw, HEADER_ALIASES.currency)),
      category: parseCategory(findValue(raw, HEADER_ALIASES.category)),
      date: parseDate(findValue(raw, HEADER_ALIASES.date)),
      payerId: payerIds[0] || currentMemberId,
      splitMemberIds: splitIds.length > 0 ? splitIds : TRAVEL_MEMBER_IDS,
      settled: parseSettled(findValue(raw, HEADER_ALIASES.settled)),
    });
  });
  return { rows, warnings, sheetName: '' };
}

export async function parseExpenseFile(file: File, currentMemberId: TravelMemberId): Promise<ExpenseImportResult> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array', cellDates: true });
  let sheetName = '';
  let rawRows: RawRow[] = [];
  let bestScore = -1;
  let bestParsedCount = -1;
  for (const candidate of workbook.SheetNames) {
    const matrix = XLSX.utils.sheet_to_json<unknown[]>(workbook.Sheets[candidate], { header: 1, defval: '' });
    const headerIndex = matrix.slice(0, 30).reduce((best, row, index) => {
      const headers = row.map(normalizeHeader);
      const score = Object.values(HEADER_ALIASES).filter((aliases) => aliases.some((alias) => headers.some((header) => headerMatches(header, normalizeHeader(alias))))).length;
      return score > best.score ? { index, score } : best;
    }, { index: -1, score: 0 });
    if (headerIndex.index >= 0) {
      const headers = matrix[headerIndex.index].map((value, index) => String(value || `column_${index + 1}`));
      const candidateRows = matrix.slice(headerIndex.index + 1).map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index] ?? ''])));
      const parsedCount = parseExpenseRows(candidateRows, currentMemberId).rows.length;
      if (parsedCount > bestParsedCount || (parsedCount === bestParsedCount && headerIndex.score > bestScore)) {
        rawRows = candidateRows;
        sheetName = candidate;
        bestScore = headerIndex.score;
        bestParsedCount = parsedCount;
      }
    }
  }
  if (!sheetName || bestScore < 2 || bestParsedCount <= 0) throw new Error('未找到包含“名称/金额”等字段的账单表头。请另存为 xlsx 或 csv 后重试。');
  const result = parseExpenseRows(rawRows, currentMemberId);
  return { ...result, sheetName };
}
