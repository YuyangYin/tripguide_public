import type { CategoryId, GuideCountryId, GuideItem } from '../types';

export interface ParsedGoogleMapsPlace {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  googleEntityId?: string;
  rawType?: string;
  imageUrl?: string;
}

export interface ParsedGoogleMapsList {
  listId: string;
  title: string;
  owner: string;
  sourceUrl: string;
  places: ParsedGoogleMapsPlace[];
}

const COUNTRY_RULES: { pattern: RegExp; id: GuideCountryId; label: string; emoji: string }[] = [
  { pattern: /瑞典|sweden|stockholm|斯德哥尔摩/i, id: 'sweden', label: '瑞典', emoji: '🇸🇪' },
  { pattern: /挪威|norway|oslo|bergen|lofoten/i, id: 'norway', label: '挪威', emoji: '🇳🇴' },
  { pattern: /荷兰|netherlands|amsterdam/i, id: 'netherlands', label: '荷兰', emoji: '🇳🇱' },
  { pattern: /瑞士|switzerland|suisse|schweiz/i, id: 'switzerland', label: '瑞士', emoji: '🇨🇭' },
  { pattern: /西班牙|spain|barcelona/i, id: 'spain', label: '西班牙', emoji: '🇪🇸' },
  { pattern: /冰岛|iceland|reykjav/i, id: 'iceland', label: '冰岛', emoji: '🇮🇸' },
];

const sanitizeSlug = (value: string) => value.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 50) || 'place';

export function extractGoogleMapsListId(input: string) {
  const decoded = decodeURIComponent(input.trim());
  const dataMatch = decoded.match(/!2s([^!?#&]+)/);
  if (dataMatch) return dataMatch[1];
  const pathMatch = decoded.match(/\/maps\/placelists\/list\/([^/?#]+)/);
  if (pathMatch) return pathMatch[1];
  return '';
}

export function parseGoogleMapsListPayload(payload: string, sourceUrl: string): ParsedGoogleMapsList {
  const cleaned = payload.replace(/^\)\]\}'\s*/, '');
  const data = JSON.parse(cleaned) as unknown[];
  const root = data[0] as unknown[];
  const meta = root?.[0] as unknown[];
  const owner = root?.[3] as unknown[];
  const rawPlaces = root?.[8] as unknown[][];
  if (!Array.isArray(rawPlaces)) throw new Error('Google Maps 返回的数据中没有找到收藏地点。');
  const listId = String(meta?.[0] || extractGoogleMapsListId(sourceUrl));
  const places = rawPlaces.map((raw, index) => {
    const location = raw?.[1] as unknown[];
    const coordinates = location?.[5] as unknown[];
    const ids = location?.[6] as unknown[];
    const name = String(raw?.[2] || '').trim();
    const address = String(location?.[2] || location?.[4] || '').trim();
    const latitude = Number(coordinates?.[2]);
    const longitude = Number(coordinates?.[3]);
    return {
      id: `${listId}-${String(ids?.[1] || ids?.[0] || index)}`,
      name,
      address,
      latitude,
      longitude,
      googleEntityId: ids?.[1] ? String(ids[1]) : undefined,
    };
  }).filter((place) => place.name && Number.isFinite(place.latitude) && Number.isFinite(place.longitude));
  return { listId, title: String(root?.[4] || 'Google Maps 收藏'), owner: String(owner?.[0] || ''), sourceUrl, places };
}

export function inferGuideCountry(place: Pick<ParsedGoogleMapsPlace, 'name' | 'address'>, listTitle = '') {
  const text = `${place.name} ${place.address} ${listTitle}`;
  const known = COUNTRY_RULES.find((rule) => rule.pattern.test(text));
  if (known) return known;
  const label = place.address.split(',').map((part) => part.trim()).filter(Boolean).at(-1) || listTitle || '其他地区';
  return { id: `custom:${sanitizeSlug(label)}` as GuideCountryId, label, emoji: '📍' };
}

export function classifyGooglePlace(place: Pick<ParsedGoogleMapsPlace, 'name' | 'address' | 'rawType'>): CategoryId {
  const text = `${place.name} ${place.address} ${place.rawType || ''}`.toLowerCase();
  if (/hotel|hostel|宾馆|酒店|民宿/.test(text)) return 'stay';
  if (/café|cafe|coffee|bageri|bakery|konditori|糕点|咖啡|餐厅|restaurant|bar|food/.test(text)) return 'food';
  if (/ikea|shop|store|shopping|market|gift|商店|礼品|购物|百货|drottninggatan/.test(text)) return 'grocery';
  if (/metro|station|terminal|ferry|码头|地铁|t-bana|centralen|rinkeby|stadion|ropsten|nybroplan|allmänna gränd/.test(text)) return 'traffic';
  if (/museum|博物馆|palace|宫殿|cathedral|教堂/.test(text)) return 'activity';
  return 'photo';
}

const categoryLabel: Record<CategoryId, string> = {
  emergency: '紧急信息', parking: '停车', traffic: '交通', grocery: '购物', stay: '住宿', activity: '游玩', experience: '体验', food: '餐饮', aurora: '极光', photo: '景点机位', drone: '无人机', history: '历史',
};

const iconForCategory: Record<CategoryId, string> = {
  emergency: 'ShieldAlert', parking: 'SquareParking', traffic: 'TrainFront', grocery: 'ShoppingBag', stay: 'Hotel', activity: 'Sparkles', experience: 'Compass', food: 'Utensils', aurora: 'Sparkles', photo: 'MapPinned', drone: 'Plane', history: 'Landmark',
};

export function placeToGuideItem(place: ParsedGoogleMapsPlace, list: Pick<ParsedGoogleMapsList, 'listId' | 'title' | 'sourceUrl'>): GuideItem {
  const country = inferGuideCountry(place, list.title);
  const category = classifyGooglePlace(place);
  const coordinates = `${place.latitude.toFixed(6)}, ${place.longitude.toFixed(6)}`;
  const exactMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place.name} ${place.address}`)}`;
  const mapPreview = `https://static-maps.yandex.ru/1.x/?lang=en_US&ll=${place.longitude},${place.latitude}&z=15&l=map&size=450,300&pt=${place.longitude},${place.latitude},pm2rdm`;
  return {
    id: `maps-${sanitizeSlug(list.listId)}-${sanitizeSlug(place.googleEntityId || place.id)}`,
    category,
    country: country.id,
    countryLabel: country.label,
    countryEmoji: country.emoji,
    title: place.name,
    shortDesc: `${place.address || country.label} · 来自 Google Maps 收藏“${list.title}”`,
    iconName: iconForCategory[category],
    tags: [country.label, 'Google收藏', categoryLabel[category], list.title],
    location: place.address || country.label,
    mapQuery: `${place.name} ${place.address}`.trim(),
    googleMapsUrl: exactMapUrl,
    coordinates,
    coverImage: place.imageUrl || mapPreview,
    details: [
      { sectionTitle: '收藏信息', items: [`地址：${place.address || 'Google Maps 未提供文字地址'}`, `坐标：${coordinates}`, `自动分类：${categoryLabel[category]}（导入预览中可修改）`] },
      { sectionTitle: '使用方式', items: ['点击地图定位可直接打开 Google Maps。', '图片优先使用地点缩略图；没有可用照片时显示坐标地图预览。'] },
    ],
    sources: [
      { title: `Google Maps 收藏列表：${list.title}`, url: list.sourceUrl },
      { title: `Google Maps 地点：${place.name}`, url: exactMapUrl },
    ],
    quickChecklist: ['出发前核对营业时间或开放状态', '确认当天路线与交通时间', '查看 Google Maps 最新评价'],
    importedListId: list.listId,
    importedAt: new Date().toISOString(),
  };
}

export function mergeGuideItems(staticItems: GuideItem[], importedItems: GuideItem[]) {
  const result = [...staticItems];
  importedItems.forEach((incoming) => {
    const normalized = incoming.title.trim().toLowerCase();
    const index = result.findIndex((item) => item.title.trim().toLowerCase() === normalized);
    if (index < 0) result.push(incoming);
    else {
      const current = result[index];
      result[index] = {
        ...incoming,
        ...current,
        coverImage: current.coverImage || incoming.coverImage,
        coordinates: current.coordinates || incoming.coordinates,
        googleMapsUrl: current.googleMapsUrl || incoming.googleMapsUrl,
        mapQuery: current.mapQuery || incoming.mapQuery,
        tags: [...new Set([...(current.tags || []), ...(incoming.tags || [])])],
        sources: [...new Map([...(current.sources || []), ...(incoming.sources || [])].map((source) => [source.url, source])).values()],
      };
    }
  });
  return result;
}
