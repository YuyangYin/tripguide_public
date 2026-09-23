import { useEffect, useState } from 'react';

export default function WikiImage({ title, alt, className }: { title: string; alt: string; className: string }) {
  const [src, setSrc] = useState('');
  useEffect(() => {
    let active = true;
    const mediaWikiUrl = new URL('https://en.wikipedia.org/w/api.php');
    mediaWikiUrl.search = new URLSearchParams({
      action: 'query',
      prop: 'pageimages',
      piprop: 'original|thumbnail',
      pithumbsize: '1200',
      titles: title,
      format: 'json',
      origin: '*',
    }).toString();
    fetch(mediaWikiUrl)
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data) => {
        const pages = Object.values(data.query?.pages || {}) as { original?: { source?: string }; thumbnail?: { source?: string } }[];
        const image = pages[0]?.original?.source || pages[0]?.thumbnail?.source || '';
        if (active) setSrc(image);
      })
      .catch(() => fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`)
        .then((response) => response.ok ? response.json() : Promise.reject())
        .then((data) => { if (active) setSrc(data.originalimage?.source || data.thumbnail?.source || ''); })
        .catch(() => undefined));
    return () => { active = false; };
  }, [title]);
  if (!src) return <div className={`${className} bg-gradient-to-br from-sky-900 via-slate-800 to-emerald-900`} aria-label={`${alt} 图片加载中`} />;
  return <img src={src} alt={alt} className={className} loading="lazy" referrerPolicy="no-referrer" />;
}
