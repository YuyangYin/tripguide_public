const ROUTE_SEPARATOR = /\s*(?:→|➔|->|—>|✈|·|\+)\s*/;

export const getRouteSearchLocation = (route: string, fallback: string) => {
  const locations = route
    .split(ROUTE_SEPARATOR)
    .map((part) => part.replace(/[（(].*?[）)]/g, '').trim())
    .filter(Boolean);

  return locations.at(-1) || fallback.trim();
};

export const getXiaohongshuSearchUrls = (keyword: string) => {
  const encodedKeyword = encodeURIComponent(keyword.trim());
  return {
    app: `xhsdiscover://search/result?keyword=${encodedKeyword}`,
    web: `https://www.xiaohongshu.com/search_result?keyword=${encodedKeyword}&source=web_search_result_notes`,
  };
};

export const openXiaohongshuSearch = (keyword: string) => {
  const normalizedKeyword = keyword.trim();
  if (!normalizedKeyword) return;

  const urls = getXiaohongshuSearchUrls(normalizedKeyword);
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (!isMobile) {
    window.open(urls.web, '_blank', 'noopener,noreferrer');
    return;
  }

  let fallbackTimer = window.setTimeout(() => {
    if (document.visibilityState === 'visible') window.location.href = urls.web;
  }, 1400);
  const stopFallback = () => {
    if (document.visibilityState !== 'visible') {
      window.clearTimeout(fallbackTimer);
      fallbackTimer = 0;
      document.removeEventListener('visibilitychange', stopFallback);
    }
  };

  document.addEventListener('visibilitychange', stopFallback);
  try {
    window.location.href = urls.app;
  } catch {
    window.clearTimeout(fallbackTimer);
    document.removeEventListener('visibilitychange', stopFallback);
    window.location.href = urls.web;
  }
};
