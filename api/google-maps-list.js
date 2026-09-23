const ALLOWED_HOSTS = new Set(['google.com', 'www.google.com', 'maps.google.com', 'maps.app.goo.gl', 'goo.gl']);

const COUNTRY_RULES = [
  { pattern: /瑞典|sweden|stockholm|斯德哥尔摩/i, id: 'sweden', label: '瑞典', emoji: '🇸🇪' },
  { pattern: /挪威|norway|oslo|bergen|lofoten/i, id: 'norway', label: '挪威', emoji: '🇳🇴' },
  { pattern: /荷兰|netherlands|amsterdam/i, id: 'netherlands', label: '荷兰', emoji: '🇳🇱' },
  { pattern: /瑞士|switzerland|suisse|schweiz/i, id: 'switzerland', label: '瑞士', emoji: '🇨🇭' },
  { pattern: /西班牙|spain|barcelona/i, id: 'spain', label: '西班牙', emoji: '🇪🇸' },
  { pattern: /冰岛|iceland|reykjav/i, id: 'iceland', label: '冰岛', emoji: '🇮🇸' },
];

const CATEGORY_LABELS = { traffic: '交通', food: '餐饮', grocery: '购物', photo: '景点机位', activity: '游玩', stay: '住宿' };
const CATEGORY_ICONS = { traffic: 'TrainFront', food: 'Utensils', grocery: 'ShoppingBag', photo: 'MapPinned', activity: 'Sparkles', stay: 'Hotel' };

const slug = (value) => String(value || '').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 50) || 'place';

function isAllowedUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && ALLOWED_HOSTS.has(url.hostname.toLowerCase());
  } catch { return false; }
}

function extractListId(input) {
  const decoded = decodeURIComponent(String(input || '').trim());
  return decoded.match(/!2s([^!?#&]+)/)?.[1] || decoded.match(/\/maps\/placelists\/list\/([^/?#]+)/)?.[1] || '';
}

function parsePayload(payload, sourceUrl) {
  const data = JSON.parse(payload.replace(/^\)\]\}'\s*/, ''));
  const root = data[0];
  const listId = String(root?.[0]?.[0] || extractListId(sourceUrl));
  const rawPlaces = root?.[8];
  if (!Array.isArray(rawPlaces)) throw new Error('Google Maps 返回的数据中没有找到收藏地点。');
  return {
    listId,
    title: String(root?.[4] || 'Google Maps 收藏'),
    owner: String(root?.[3]?.[0] || ''),
    sourceUrl,
    places: rawPlaces.map((raw, index) => {
      const location = raw?.[1];
      const coordinates = location?.[5];
      const ids = location?.[6];
      return {
        id: `${listId}-${String(ids?.[1] || ids?.[0] || index)}`,
        name: String(raw?.[2] || '').trim(),
        address: String(location?.[2] || location?.[4] || '').trim(),
        latitude: Number(coordinates?.[2]), longitude: Number(coordinates?.[3]),
        googleEntityId: ids?.[1] ? String(ids[1]) : undefined,
      };
    }).filter((place) => place.name && Number.isFinite(place.latitude) && Number.isFinite(place.longitude)),
  };
}

function inferCountry(place, title) {
  const text = `${place.name} ${place.address} ${title}`;
  const known = COUNTRY_RULES.find((rule) => rule.pattern.test(text));
  if (known) return known;
  const label = place.address.split(',').map((part) => part.trim()).filter(Boolean).at(-1) || title || '其他地区';
  return { id: `custom:${slug(label)}`, label, emoji: '📍' };
}

function classify(place) {
  const text = `${place.name} ${place.address}`.toLowerCase();
  if (/hotel|hostel|宾馆|酒店|民宿/.test(text)) return 'stay';
  if (/café|cafe|coffee|bageri|bakery|konditori|糕点|咖啡|餐厅|restaurant|bar|food/.test(text)) return 'food';
  if (/ikea|shop|store|shopping|market|gift|商店|礼品|购物|百货|drottninggatan/.test(text)) return 'grocery';
  if (/metro|station|terminal|ferry|码头|地铁|t-bana|centralen|rinkeby|stadion|ropsten|nybroplan|allmänna gränd/.test(text)) return 'traffic';
  if (/museum|博物馆|palace|宫殿|cathedral|教堂/.test(text)) return 'activity';
  return 'photo';
}

function toGuideItem(place, list) {
  const country = inferCountry(place, list.title);
  const category = classify(place);
  const coordinates = `${place.latitude.toFixed(6)}, ${place.longitude.toFixed(6)}`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place.name} ${place.address}`)}`;
  return {
    id: `maps-${slug(list.listId)}-${slug(place.googleEntityId || place.id)}`,
    category, country: country.id, countryLabel: country.label, countryEmoji: country.emoji,
    title: place.name, shortDesc: `${place.address || country.label} · 来自 Google Maps 收藏“${list.title}”`,
    iconName: CATEGORY_ICONS[category], tags: [country.label, 'Google收藏', CATEGORY_LABELS[category], list.title],
    location: place.address || country.label, mapQuery: `${place.name} ${place.address}`.trim(), googleMapsUrl, coordinates,
    coverImage: `https://static-maps.yandex.ru/1.x/?lang=en_US&ll=${place.longitude},${place.latitude}&z=15&l=map&size=450,300&pt=${place.longitude},${place.latitude},pm2rdm`,
    details: [
      { sectionTitle: '收藏信息', items: [`地址：${place.address || 'Google Maps 未提供文字地址'}`, `坐标：${coordinates}`, `自动分类：${CATEGORY_LABELS[category]}（导入预览中可修改）`] },
      { sectionTitle: '使用方式', items: ['点击地图定位可直接打开 Google Maps。', '没有可用地点照片时显示坐标地图预览。'] },
    ],
    sources: [{ title: `Google Maps 收藏列表：${list.title}`, url: list.sourceUrl }, { title: `Google Maps 地点：${place.name}`, url: googleMapsUrl }],
    quickChecklist: ['出发前核对营业时间或开放状态', '确认当天路线与交通时间', '查看 Google Maps 最新评价'],
    importedListId: list.listId, importedAt: new Date().toISOString(),
  };
}

export default async function handler(request, response) {
  if (request.method !== 'POST') return response.status(405).json({ error: '仅支持 POST 请求。' });
  const input = String(request.body?.url || '').trim();
  if (!isAllowedUrl(input)) return response.status(400).json({ error: '请粘贴有效的 Google Maps 收藏链接。' });
  try {
    let sourceUrl = input;
    let listId = extractListId(sourceUrl);
    if (!listId) {
      const resolved = await fetch(sourceUrl, { redirect: 'follow', headers: { 'user-agent': 'Mozilla/5.0 TripGuide Maps Importer' } });
      sourceUrl = resolved.url;
      if (!isAllowedUrl(sourceUrl)) throw new Error('短链接跳转到了不受支持的网站。');
      listId = extractListId(sourceUrl);
    }
    if (!listId) throw new Error('没有在链接中找到 Google Maps 收藏列表 ID。');
    const params = new URLSearchParams({ authuser: '0', hl: 'zh-CN', gl: 'us', pb: `!1m1!1s${listId}!2e2!3e2!4i500!16b1` });
    const upstream = await fetch(`https://www.google.com/maps/preview/entitylist/getlist?${params}`, { headers: { 'user-agent': 'Mozilla/5.0 TripGuide Maps Importer' } });
    if (!upstream.ok) throw new Error(`Google Maps 返回 HTTP ${upstream.status}`);
    const parsed = parsePayload(await upstream.text(), sourceUrl);
    const items = parsed.places.map((place) => toGuideItem(place, parsed));
    return response.status(200).json({ listId: parsed.listId, title: parsed.title, owner: parsed.owner, count: items.length, items });
  } catch (error) {
    return response.status(422).json({ error: error instanceof Error ? error.message : '无法解析该收藏链接。' });
  }
}
