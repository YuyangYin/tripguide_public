import { extractGoogleMapsListId, parseGoogleMapsListPayload, placeToGuideItem } from '../src/lib/googleMapsList';

const ALLOWED_HOSTS = new Set(['google.com', 'www.google.com', 'maps.google.com', 'maps.app.goo.gl', 'goo.gl']);

function isAllowedGoogleMapsUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && ALLOWED_HOSTS.has(url.hostname.toLowerCase());
  } catch {
    return false;
  }
}

export default async function handler(request: any, response: any) {
  if (request.method !== 'POST') return response.status(405).json({ error: '仅支持 POST 请求。' });
  const input = String(request.body?.url || '').trim();
  if (!isAllowedGoogleMapsUrl(input)) return response.status(400).json({ error: '请粘贴有效的 Google Maps 收藏链接。' });

  try {
    let sourceUrl = input;
    let listId = extractGoogleMapsListId(sourceUrl);
    if (!listId) {
      const resolved = await fetch(sourceUrl, { redirect: 'follow', headers: { 'user-agent': 'Mozilla/5.0 TripGuide Maps Importer' } });
      sourceUrl = resolved.url;
      if (!isAllowedGoogleMapsUrl(sourceUrl)) throw new Error('短链接跳转到了不受支持的网站。');
      listId = extractGoogleMapsListId(sourceUrl);
    }
    if (!listId) throw new Error('没有在链接中找到 Google Maps 收藏列表 ID。');

    const params = new URLSearchParams({ authuser: '0', hl: 'zh-CN', gl: 'us', pb: `!1m1!1s${listId}!2e2!3e2!4i500!16b1` });
    const listResponse = await fetch(`https://www.google.com/maps/preview/entitylist/getlist?${params}`, { headers: { 'user-agent': 'Mozilla/5.0 TripGuide Maps Importer' } });
    if (!listResponse.ok) throw new Error(`Google Maps 返回 HTTP ${listResponse.status}`);
    const parsed = parseGoogleMapsListPayload(await listResponse.text(), sourceUrl);
    const items = parsed.places.map((place) => placeToGuideItem(place, parsed));
    return response.status(200).json({ listId: parsed.listId, title: parsed.title, owner: parsed.owner, count: items.length, items });
  } catch (error) {
    return response.status(422).json({ error: error instanceof Error ? error.message : '无法解析该收藏链接。' });
  }
}
