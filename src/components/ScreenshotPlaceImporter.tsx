import { useRef, useState } from 'react';
import { Check, ImageUp, Loader2, Sparkles, X } from 'lucide-react';
import { extractDocumentText } from '../lib/extractDocumentText';
import { parseTravelScreenshotText, TravelScreenshotResult } from '../lib/parseTravelScreenshot';

type ResultKey = 'sights' | 'alternativeSights' | 'dining' | 'shopping';
export type ScreenshotImportMode = 'append' | 'replace';
const LABELS: Record<ResultKey, string> = { sights: '主景点', alternativeSights: '备选景点', dining: '餐饮', shopping: '购物' };

export default function ScreenshotPlaceImporter({ cityHint, onApply }: {
  cityHint: string;
  onApply: (result: TravelScreenshotResult, mode: ScreenshotImportMode) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [result, setResult] = useState<TravelScreenshotResult | null>(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [importMode, setImportMode] = useState<ScreenshotImportMode>('append');

  const parseFile = async (file: File) => {
    setError(''); setResult(null);
    try {
      const text = await extractDocumentText(file, setStatus);
      if (!text.trim()) throw new Error('没有识别到文字，请换一张更清晰的截图。');
      const parsed = parseTravelScreenshotText(text);
      if (parsed.sights.length + parsed.alternativeSights.length + parsed.dining.length + parsed.shopping.length === 0) throw new Error('识别到文字，但没有找到明确的景点、餐饮或购物点。可在预览中手动补充。');
      setResult(parsed); setStatus('识别完成，请检查后导入');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : '截图识别失败'); setStatus('');
    } finally {
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const update = (key: ResultKey, value: string) => setResult((current) => current ? { ...current, [key]: value.split('\n').map((item) => item.trim()).filter(Boolean) } : current);

  return <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-3">
    <div className="flex items-start justify-between gap-2"><div><h4 className="flex items-center gap-1.5 text-xs font-black text-cyan-300"><Sparkles className="h-4 w-4" />截图智能录入</h4><p className="mt-1 text-[9px] leading-relaxed text-white/50">上传小红书/攻略截图，本地 OCR 自动提取并分类。图片不会上传。</p></div><button type="button" onClick={() => inputRef.current?.click()} className="flex shrink-0 items-center gap-1 rounded-lg bg-cyan-300 px-2.5 py-1.5 text-[10px] font-black text-slate-950"><ImageUp className="h-3.5 w-3.5" />选择截图</button></div>
    <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(event) => event.target.files?.[0] && parseFile(event.target.files[0])} />
    {status && <p className="mt-2 flex items-center gap-1 text-[9px] text-cyan-200">{status.includes('识别完成') ? <Check className="h-3 w-3" /> : <Loader2 className="h-3 w-3 animate-spin" />}{status}</p>}
    {error && <p className="mt-2 rounded-lg bg-red-500/10 px-2 py-1.5 text-[9px] text-red-300">{error}</p>}
    {result && <div className="mt-3 space-y-2">{(Object.keys(LABELS) as ResultKey[]).map((key) => <label key={key} className="block text-[9px] font-bold text-white/60">{LABELS[key]} · {result[key].length} 项<textarea rows={Math.max(2, Math.min(4, result[key].length + 1))} value={result[key].join('\n')} onChange={(event) => update(key, event.target.value)} placeholder={`没有识别到${LABELS[key]}，可手动补充`} className="mt-1 w-full rounded-lg border border-white/10 bg-black/25 px-2 py-1.5 text-[10px] text-white" /></label>)}
      <div className="rounded-xl border border-white/10 bg-black/20 p-2">
        <p className="mb-1.5 text-[9px] font-bold text-white/55">导入方式</p>
        <div className="grid grid-cols-2 gap-1.5">
          <button type="button" onClick={() => setImportMode('append')} className={`rounded-lg px-2 py-2 text-[10px] font-black transition ${importMode === 'append' ? 'bg-cyan-300 text-slate-950' : 'bg-white/10 text-white/65'}`}>增加到当前</button>
          <button type="button" onClick={() => setImportMode('replace')} className={`rounded-lg px-2 py-2 text-[10px] font-black transition ${importMode === 'replace' ? 'bg-amber-300 text-slate-950' : 'bg-white/10 text-white/65'}`}>修改当前</button>
        </div>
        <p className="mt-1.5 text-[8px] leading-relaxed text-white/40">{importMode === 'append' ? '保留原内容，并合并识别结果、自动去重。' : '用识别结果替换对应栏目；截图中没有内容的栏目保持不变。'}</p>
      </div>
      <div className="flex gap-2"><button type="button" onClick={() => setResult(null)} className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-white/10 py-2 text-[10px] font-bold"><X className="h-3 w-3" />取消</button><button type="button" onClick={() => { onApply(result, importMode); setResult(null); setStatus(`${importMode === 'append' ? '已增加到' : '已修改'} ${cityHint} 当天编辑表单，点击底部保存并同步`); }} className="flex-[2] rounded-lg bg-cyan-300 py-2 text-[10px] font-black text-slate-950">{importMode === 'append' ? '增加到' : '修改'} {cityHint || '当天行程'}</button></div></div>}
  </div>;
}
