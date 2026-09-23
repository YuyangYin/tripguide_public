import { TRIP_SPOTS } from '../data/tripSpots';

export interface TravelScreenshotResult {
  sights: string[];
  alternativeSights: string[];
  dining: string[];
  shopping: string[];
  ignoredCount: number;
}

type ImportCategory = 'sights' | 'alternativeSights' | 'dining' | 'shopping';

const SHOPPING_WORDS = /购物|商场|商城|市场|市集|超市|药妆|免税|百货|设计店|买手店|纪念品|伴手礼|旗舰店|outlet|mall|market|shop|store|shopping|coop|migros|rema|zara|ikea|åhléns|svenskt tenn|bijenkorf/i;
const DINING_WORDS = /餐厅|餐馆|咖啡|咖啡馆|面包|甜品|酒吧|早午餐|早餐|午餐|晚餐|海鲜|牛排|米饭|小吃|必吃|美食|restaurant|cafe|coffee|bakery|bistro|bar|steak|seafood|brunch/i;
const SIGHT_WORDS = /景点|必去|打卡|经典|教堂|博物馆|美术馆|公园|广场|老城|古城|宫殿|城堡|山|湖|峡湾|瀑布|冰川|沙滩|海滩|观景台|步道|徒步|渔村|小镇|桥|运河|缆车|viewpoint|museum|church|cathedral|park|square|palace|castle|mount|lake|fjord|waterfall|glacier|beach|trail|village|bridge|canal/i;
const ALTERNATIVE_WORDS = /备选|可选|顺路|有时间|如果时间|plan\s*b|alternative|optional/i;
const NOISE_WORDS = /小红书|赞|收藏|评论|关注|笔记|展开|发布于|编辑于|作者|主页|搜索|推荐页|举报|分享|复制链接|打开app|更多|查看全部|广告|赞助|浏览|粉丝|保存并同步|每行一个|可跳转地图/i;

const cleanLine = (line: string) => {
  let cleaned = line
    .replace(/^\s*[•·●○◆◇▪▫★☆✓✔→➡️📍🍽️🛍️☕️🏞️🏔️⛪️🏛️]+\s*/u, '')
    .replace(/^\s*(?:\d{1,2}[.)、：:]|[一二三四五六七八九十]+[、.：:])\s*/, '')
    .replace(/^[#＃]+/, '')
    .replace(/\s+/g, ' ')
    .trim();
  // Chinese OCR often inserts a space between every character.
  while (/([\u3400-\u9fff])\s+([\u3400-\u9fff])/.test(cleaned)) {
    cleaned = cleaned.replace(/([\u3400-\u9fff])\s+([\u3400-\u9fff])/g, '$1$2');
  }
  return cleaned
    .replace(/^EI Born\b/i, 'El Born')
    .replace(/^B\s+(?=保存并同步)/i, '')
    .trim();
};

const isNoise = (line: string) => {
  if (!line || line.length < 2 || line.length > 90) return true;
  if (/^[\d\s:：./+-]+$/.test(line)) return true;
  if (/^\d+(?:\.\d+)?[万wk]?$/i.test(line)) return true;
  if (/^(?:li|vi|zz(?:\s+mits)?\s+zz)$/i.test(line)) return true;
  if (NOISE_WORDS.test(line) && line.length < 18) return true;
  return false;
};

const uniq = (items: string[]) => [...new Set(items.map(cleanLine).filter(Boolean))];

function classifyLine(line: string, section: ImportCategory | null): ImportCategory | null {
  if (section) return section;
  if (SHOPPING_WORDS.test(line)) return 'shopping';
  if (DINING_WORDS.test(line)) return 'dining';
  if (SIGHT_WORDS.test(line)) return 'sights';
  return null;
}

function stripLabel(line: string) {
  return cleanLine(line.replace(/^(?:主景点|景点|必去景点|经典景点|备选景点|可选景点|餐饮|美食|必吃|购物|购物点|推荐)\s*[：:|-]?\s*/i, ''));
}

export function parseTravelScreenshotText(text: string): TravelScreenshotResult {
  const result: Record<ImportCategory, string[]> = { sights: [], alternativeSights: [], dining: [], shopping: [] };
  let ignoredCount = 0;
  let section: ImportCategory | null = null;
  const rawLines = text.split(/\r?\n/);

  for (const rawLine of rawLines) {
    const line = cleanLine(rawLine);
    if (!line) continue;
    if (/^(主景点|景点|必去|经典景点|打卡点)(?:\s*[（(《].*?[）)》])?\s*[：:]?$/i.test(line)) { section = 'sights'; continue; }
    if (/^(备选|备选景点|可选|可选景点|顺路景点)(?:\s*[（(《].*?[）)》])?\s*[：:]?$/i.test(line)) { section = 'alternativeSights'; continue; }
    if (/^(餐饮|餐饮安排|美食|餐厅|吃什么|必吃)(?:\s*[（(《].*?[）)》])?\s*[：:]?$/i.test(line)) { section = 'dining'; continue; }
    if (/^(购物|购物推荐|购物点|买什么|伴手礼)(?:\s*[（(《].*?[）)》])?\s*[：:]?$/i.test(line)) { section = 'shopping'; continue; }

    const pieces = line.split(/[｜|、；;]/).map(stripLabel).filter(Boolean);
    for (const piece of pieces) {
      if (isNoise(piece)) { ignoredCount += 1; continue; }
      const knownSpots = TRIP_SPOTS.filter((spot) => piece.toLowerCase().includes(spot.name.toLowerCase()) || piece.toLowerCase().includes(spot.mapQuery.toLowerCase()));
      if (knownSpots.length > 0) {
        knownSpots.forEach((spot) => result[section === 'alternativeSights' || ALTERNATIVE_WORDS.test(line) ? 'alternativeSights' : 'sights'].push(spot.name));
        continue;
      }
      const category = classifyLine(piece, section);
      if (category) result[category].push(stripLabel(piece));
      else ignoredCount += 1;
    }
  }

  return {
    sights: uniq(result.sights),
    alternativeSights: uniq(result.alternativeSights),
    dining: uniq(result.dining),
    shopping: uniq(result.shopping),
    ignoredCount,
  };
}
