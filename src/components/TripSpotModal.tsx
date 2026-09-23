import { useEffect, useState } from 'react';
import { Camera, ExternalLink, Loader2, MapPin, X } from 'lucide-react';
import { TripSpot } from '../data/tripSpots';

export default function TripSpotModal({ spot, onClose }: { spot: TripSpot; onClose: () => void }) {
  const [image, setImage] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    setLoading(true);
    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(spot.wikiTitle)}`)
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('image unavailable')))
      .then((data) => { if (active) { setImage(data.originalimage?.source || data.thumbnail?.source || ''); setSourceUrl(data.content_urls?.desktop?.page || ''); } })
      .catch(() => undefined)
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [spot]);

  return (
    <div className="absolute inset-0 z-[180] grid place-items-center bg-black/65 p-4 backdrop-blur-md" onClick={onClose}>
      <div className="max-h-[90%] w-full max-w-md overflow-y-auto rounded-3xl bg-stone-950 text-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-sky-900 via-slate-900 to-emerald-950">
          {image && <img src={image} alt={spot.name} className="h-full w-full object-cover" />}
          {loading && <Loader2 className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 animate-spin" />}
          <button onClick={onClose} className="absolute right-3 top-3 rounded-full bg-black/55 p-2"><X className="h-4 w-4" /></button>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-4 pt-12"><p className="text-[10px] font-black uppercase tracking-wider text-sky-300">{spot.country}</p><h3 className="text-xl font-black">{spot.name}</h3></div>
        </div>
        <div className="space-y-4 p-4">
          <p className="text-xs leading-relaxed text-white/75">{spot.description}</p>
          <div className="rounded-2xl bg-white/8 p-3"><h4 className="flex items-center gap-1.5 text-xs font-black"><Camera className="h-4 w-4 text-amber-300" />推荐机位</h4><div className="mt-2 space-y-1.5">{spot.photoSpots.map((item) => <a key={item} target="_blank" rel="noreferrer" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${item} ${spot.mapQuery}`)}`} className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-[10px] font-bold hover:bg-white/10"><span>{item}</span><ExternalLink className="h-3 w-3" /></a>)}</div></div>
          <div className="grid grid-cols-2 gap-2"><a target="_blank" rel="noreferrer" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(spot.mapQuery)}`} className="flex items-center justify-center gap-1 rounded-xl bg-sky-400 py-2.5 text-xs font-black text-slate-950"><MapPin className="h-4 w-4" />Google Maps</a>{sourceUrl ? <a target="_blank" rel="noreferrer" href={sourceUrl} className="flex items-center justify-center gap-1 rounded-xl bg-white/10 py-2.5 text-xs font-black">图片来源<ExternalLink className="h-3 w-3" /></a> : <span className="rounded-xl bg-white/5 py-2.5 text-center text-[10px] opacity-50">图片暂不可用</span>}</div>
        </div>
      </div>
    </div>
  );
}
