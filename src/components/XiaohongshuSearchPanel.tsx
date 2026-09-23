import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { getRouteSearchLocation, openXiaohongshuSearch } from '../lib/xiaohongshuSearch';

const SEARCH_TYPES = [
  { label: '经典景点', suffix: '经典景点' },
  { label: '美食', suffix: '美食' },
  { label: '购物', suffix: '购物' },
  { label: '旅行攻略', suffix: '旅行攻略' },
] as const;

export default function XiaohongshuSearchPanel({ route, regionLabel }: { route: string; regionLabel: string }) {
  const defaultLocation = getRouteSearchLocation(route, regionLabel);
  const [location, setLocation] = useState(defaultLocation);

  useEffect(() => setLocation(defaultLocation), [defaultLocation]);

  const search = (suffix: string) => openXiaohongshuSearch(`${location.trim()} ${suffix}`);

  return (
    <div
      className="rounded-xl border border-red-400/15 bg-red-400/5 p-3"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="flex items-center gap-1.5 text-[11px] font-black text-red-500">
        <Search className="h-3.5 w-3.5" />
        小红书搜当地
      </div>
      <p className="mt-1 text-[9px] text-stone-400">自动带入当天地点；地点不准确时可以直接修改。</p>
      <div className="mt-2 flex items-center gap-2">
        <input
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          aria-label="小红书搜索地点"
          className="min-w-0 flex-1 rounded-lg border border-stone-200 bg-white/80 px-2.5 py-2 text-xs font-bold outline-none focus:border-red-400 dark:border-stone-700 dark:bg-stone-900"
          placeholder="输入城市或地点"
        />
      </div>
      <div className="mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
        {SEARCH_TYPES.map((item) => (
          <button
            key={item.suffix}
            type="button"
            disabled={!location.trim()}
            onClick={() => search(item.suffix)}
            className="rounded-lg bg-red-500 px-2 py-2 text-[10px] font-black text-white shadow-sm transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
