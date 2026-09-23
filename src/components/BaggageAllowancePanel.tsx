import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, ChevronDown, Luggage, Save } from 'lucide-react';
import { useCurrentTravelMember } from './TravelMemberContext';
import { useSharedTable, useSharedValue } from '../lib/useSharedTable';
import { AIRLINE_RULES, DEFAULT_BAGGAGE, evaluateBaggage, getAirlineRule, parseBaggageWeights, type AirlineId, type BaggageKind, type MemberBaggage } from '../lib/baggageAllowance';
import { TRAVEL_MEMBERS } from '../lib/travelMembers';

const INPUTS: { key: BaggageKind; label: string; placeholder: string }[] = [
  { key: 'checked', label: '托运行李', placeholder: '如：22, 20' },
  { key: 'carryOn', label: '手提行李', placeholder: '如：7.5' },
  { key: 'personal', label: '小包', placeholder: '如：2' },
];

const baggageSummary = (member: MemberBaggage) => INPUTS.map(({ key, label }) => {
  const weights = parseBaggageWeights(member[key]);
  return weights.length ? `${label} ${weights.length}件（${weights.join('/')}kg）` : `${label} 0件`;
}).join(' · ');

export default function BaggageAllowancePanel() {
  const currentMember = useCurrentTravelMember();
  const [airlineId, setAirlineId, , airlineError] = useSharedValue<AirlineId>('baggage_airline', 'trip_baggage_airline_v1', 'air-china');
  const [rows, setRows, , rowsError] = useSharedTable<MemberBaggage>('baggage', 'trip_baggage_v1', DEFAULT_BAGGAGE);
  const normalizedRows = useMemo(() => TRAVEL_MEMBERS.map((member) => rows.find((row) => row.id === member.id) || DEFAULT_BAGGAGE.find((row) => row.id === member.id)!), [rows]);
  const savedMine = normalizedRows.find((row) => row.id === currentMember.id)!;
  const [draft, setDraft] = useState(savedMine);
  const [savedNotice, setSavedNotice] = useState(false);
  const rule = getAirlineRule(airlineId);
  const evaluation = useMemo(() => evaluateBaggage(airlineId, normalizedRows), [airlineId, normalizedRows]);

  useEffect(() => setDraft(savedMine), [savedMine]);

  const saveMine = () => {
    const next = { ...draft, id: currentMember.id, updatedAt: new Date().toISOString() };
    setRows((current) => [next, ...current.filter((row) => row.id !== currentMember.id)]);
    setSavedNotice(true);
    window.setTimeout(() => setSavedNotice(false), 1800);
  };

  const hasAnyIssue = evaluation.groupIssues.length > 0 || Object.values(evaluation.memberIssues).some((issues) => issues.length > 0);

  return (
    <section className="rounded-2xl border border-amber-400/25 bg-gradient-to-br from-amber-400/10 to-orange-400/5 p-3 shadow-sm">
      <div className="flex items-start gap-2">
        <div className="rounded-xl bg-amber-400/15 p-2 text-amber-500"><Luggage className="h-5 w-5" /></div>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-black text-stone-900 dark:text-white">当前行李额</h2>
          <p className="mt-0.5 text-[9px] text-stone-500 dark:text-stone-400">选择当前航司，四个人分别填写自己的每件行李重量，自动判断是否超额。</p>
        </div>
      </div>

      <label className="mt-3 block text-[10px] font-black text-stone-500 dark:text-stone-300">
        当前航司
        <select value={airlineId} onChange={(event) => setAirlineId(event.target.value as AirlineId)} className="mt-1 w-full rounded-xl border border-amber-400/25 bg-white px-3 py-2 text-xs font-black text-stone-900 outline-none dark:bg-stone-900 dark:text-white">
          {AIRLINE_RULES.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
      </label>

      <div className="mt-2 rounded-xl bg-amber-400/10 px-3 py-2 text-[10px] font-bold leading-relaxed text-amber-800 dark:text-amber-200">{rule.summary}</div>

      <details className="mt-2 rounded-xl border border-stone-200/60 bg-white/45 px-3 py-2 dark:border-stone-700/60 dark:bg-stone-950/20">
        <summary className="flex cursor-pointer list-none items-center justify-between text-[10px] font-black text-stone-500 dark:text-stone-300">查看全部航空公司规则<ChevronDown className="h-3.5 w-3.5" /></summary>
        <div className="mt-2 space-y-1.5">{AIRLINE_RULES.map((item) => <p key={item.id} className={`rounded-lg px-2 py-1.5 text-[9px] leading-relaxed ${item.id === airlineId ? 'bg-amber-400/15 font-bold text-amber-800 dark:text-amber-200' : 'bg-stone-100/60 text-stone-500 dark:bg-stone-900/60 dark:text-stone-400'}`}><strong>{item.shortName}：</strong>{item.summary.replace(/^.*?：/, '')}</p>)}</div>
      </details>

      <div className="mt-3 rounded-xl border border-sky-400/20 bg-sky-400/5 p-3">
        <p className="text-[10px] font-black text-sky-600 dark:text-sky-300">填写我的行李 · {currentMember.label}</p>
        <p className="mt-1 text-[9px] text-stone-400">一件填一个重量；多件用逗号隔开。没有该类行李请留空。</p>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
          {INPUTS.map((input) => <label key={input.key} className="text-[9px] font-bold text-stone-500 dark:text-stone-300">{input.label}（kg）<input inputMode="decimal" value={draft[input.key]} onChange={(event) => setDraft((current) => ({ ...current, [input.key]: event.target.value }))} placeholder={input.placeholder} className="mt-1 w-full rounded-lg border border-stone-200 bg-white px-2.5 py-2 text-xs font-bold text-stone-900 outline-none focus:border-sky-400 dark:border-stone-700 dark:bg-stone-900 dark:text-white" /></label>)}
        </div>
        <button type="button" onClick={saveMine} className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg bg-sky-500 py-2 text-[10px] font-black text-white"><Save className="h-3.5 w-3.5" />{savedNotice ? '已保存并同步' : '保存我的行李'}</button>
      </div>

      <div className="mt-3 space-y-1.5">
        {TRAVEL_MEMBERS.map((member) => {
          const baggage = normalizedRows.find((row) => row.id === member.id)!;
          const issues = evaluation.memberIssues[member.id];
          const isPending = !baggage.updatedAt;
          return <div key={member.id} className="rounded-xl border border-stone-200/50 bg-white/55 px-3 py-2 dark:border-stone-700/50 dark:bg-stone-950/25"><div className="flex items-center justify-between gap-2"><span className="text-[10px] font-black text-stone-800 dark:text-white">{member.label}{member.id === currentMember.id ? '（我）' : ''}</span>{isPending ? <span className="text-[9px] font-bold text-stone-400">待填写</span> : issues.length ? <span className="flex items-center gap-1 text-[9px] font-black text-red-500"><AlertTriangle className="h-3 w-3" />个人超额</span> : <span className="flex items-center gap-1 text-[9px] font-black text-emerald-500"><CheckCircle2 className="h-3 w-3" />个人未超额</span>}</div><p className="mt-1 text-[9px] leading-relaxed text-stone-500 dark:text-stone-400">{isPending ? '尚未确认行李' : baggageSummary(baggage)}</p>{issues.map((issue) => <p key={issue} className="mt-1 text-[9px] font-bold text-red-500">• {issue}</p>)}</div>;
        })}
      </div>

      <div className={`mt-2 rounded-xl px-3 py-2 text-[10px] font-bold ${hasAnyIssue ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'}`}>
        <div className="flex items-center gap-1.5">{hasAnyIssue ? <AlertTriangle className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}{hasAnyIssue ? '当前有行李超额' : '当前未发现超额'}：托运 {evaluation.totals.checked} 件 · 手提 {evaluation.totals.carryOn} 件 · 小包 {evaluation.totals.personal} 件</div>
        {evaluation.groupIssues.map((issue) => <p key={issue} className="mt-1">• {issue}</p>)}
      </div>
      {(airlineError || rowsError) && <p role="alert" className="mt-2 text-[9px] font-bold text-red-500">行李数据同步异常：{airlineError || rowsError}</p>}
    </section>
  );
}
