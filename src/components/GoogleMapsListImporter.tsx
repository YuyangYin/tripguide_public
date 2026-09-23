import { useState } from 'react';
import { Check, ChevronDown, Link2, Loader2, MapPinned, X } from 'lucide-react';
import type { CategoryId, GuideCountryId, GuideItem } from '../types';

const COUNTRIES: { id: GuideCountryId; label: string }[] = [
  { id: 'spain', label: '🇪🇸 西班牙' },
  { id: 'switzerland', label: '🇨🇭 瑞士' },
  { id: 'netherlands', label: '🇳🇱 荷兰' },
  { id: 'norway', label: '🇳🇴 挪威' },
  { id: 'sweden', label: '🇸🇪 瑞典' },
  { id: 'iceland', label: '🇮🇸 冰岛' },
];

const CATEGORIES: { id: CategoryId; label: string }[] = [
  { id: 'traffic', label: '交通' }, { id: 'food', label: '餐饮' }, { id: 'grocery', label: '购物' },
  { id: 'photo', label: '景点机位' }, { id: 'activity', label: '游玩' }, { id: 'stay', label: '住宿' },
  { id: 'parking', label: '停车' }, { id: 'experience', label: '体验' },
];

interface ImportResponse { title: string; count: number; items: GuideItem[]; error?: string }

export default function GoogleMapsListImporter({ onImport }: { onImport: (items: GuideItem[]) => void }) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [items, setItems] = useState<GuideItem[]>([]);

  const parse = async () => {
    setLoading(true); setError(''); setItems([]);
    try {
      const response = await fetch('/api/google-maps-list', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ url }) });
      const data = await response.json() as ImportResponse;
      if (!response.ok) throw new Error(data.error || 'Google Maps 收藏解析失败');
      setTitle(data.title); setItems(data.items);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Google Maps 收藏解析失败');
    } finally { setLoading(false); }
  };

  const updateItem = (id: string, patch: Partial<GuideItem>) => setItems((current) => current.map((item) => item.id === id ? { ...item, ...patch } : item));

  return (
    <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-2.5">
      <button type="button" onClick={() => setOpen((value) => !value)} className="flex w-full items-center gap-2 text-left">
        <MapPinned className="h-4 w-4 text-emerald-500" />
        <span className="text-[10px] font-black">导入 Google Maps 收藏</span>
        <span className="ml-auto text-[9px] opacity-50">粘贴共享列表链接</span>
        <ChevronDown className={`h-3.5 w-3.5 transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="mt-2 space-y-2">
        <div className="flex gap-1.5"><input value={url} onChange={(event) => setUrl(event.target.value)} placeholder="粘贴 Google Maps 收藏链接" className="min-w-0 flex-1 rounded-lg border border-stone-200 bg-white px-2.5 py-2 text-[10px] text-stone-900 outline-none focus:border-emerald-400 dark:border-stone-700 dark:bg-stone-900 dark:text-white" /><button type="button" disabled={!url.trim() || loading} onClick={() => void parse()} className="flex shrink-0 items-center gap-1 rounded-lg bg-emerald-500 px-3 text-[9px] font-black text-white disabled:opacity-40">{loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Link2 className="h-3 w-3" />}解析</button></div>
        <p className="text-[8px] leading-relaxed opacity-50">自动读取名称、地址、坐标与地点 ID，并推断国家和类型。确认前可以逐项修改，不会修改原 Google 收藏。</p>
        {error && <p className="rounded-lg bg-red-500/10 px-2 py-1.5 text-[9px] font-bold text-red-500">{error}</p>}
        {items.length > 0 && <div className="space-y-2"><div className="flex items-center justify-between"><p className="text-[10px] font-black">{title} · {items.length} 个地点</p><button type="button" onClick={() => setItems([])} className="text-stone-400"><X className="h-3.5 w-3.5" /></button></div><div className="max-h-72 space-y-1.5 overflow-y-auto pr-1">{items.map((item) => {
          const countryChoices = COUNTRIES.some((country) => country.id === item.country) ? COUNTRIES : [...COUNTRIES, { id: item.country, label: `${item.countryEmoji || '📍'} ${item.countryLabel || String(item.country).replace(/^custom:/, '')}` }];
          return <div key={item.id} className="rounded-lg border border-stone-200/40 bg-white/45 p-2 dark:border-stone-700/50 dark:bg-stone-950/20"><input value={item.title} onChange={(event) => updateItem(item.id, { title: event.target.value })} className="w-full rounded border border-stone-200 bg-white px-1.5 py-1 text-[10px] font-black text-stone-900 dark:border-stone-700 dark:bg-stone-900 dark:text-white" /><input value={item.location || ''} onChange={(event) => updateItem(item.id, { location: event.target.value, mapQuery: `${item.title} ${event.target.value}`.trim() })} className="mt-1 w-full rounded border border-stone-200 bg-white px-1.5 py-1 text-[8px] text-stone-700 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300" /><div className="mt-1.5 grid grid-cols-2 gap-1.5"><select value={item.country} onChange={(event) => updateItem(item.id, { country: event.target.value as GuideCountryId, countryLabel: countryChoices.find((country) => country.id === event.target.value)?.label.slice(3) })} className="rounded border border-stone-200 bg-white px-1.5 py-1 text-[9px] text-stone-900 dark:border-stone-700 dark:bg-stone-900 dark:text-white">{countryChoices.map((country) => <option key={country.id} value={country.id}>{country.label}</option>)}</select><select value={item.category} onChange={(event) => updateItem(item.id, { category: event.target.value as CategoryId })} className="rounded border border-stone-200 bg-white px-1.5 py-1 text-[9px] text-stone-900 dark:border-stone-700 dark:bg-stone-900 dark:text-white">{CATEGORIES.map((category) => <option key={category.id} value={category.id}>{category.label}</option>)}</select></div></div>;
        })}</div><button type="button" onClick={() => { onImport(items); setItems([]); setUrl(''); setOpen(false); }} className="flex w-full items-center justify-center gap-1 rounded-lg bg-emerald-500 py-2 text-[10px] font-black text-white"><Check className="h-3.5 w-3.5" />确认导入并同步</button></div>}
      </div>}
    </div>
  );
}
