import { FormEvent, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Check, CircleDollarSign, FileSpreadsheet, Pencil, Plus, Receipt, Trash2, Upload, X } from 'lucide-react';
import { ThemeConfig } from '../types';
import { getCardStyle, getInputStyle, getPrimaryButtonStyle } from '../lib/themeStyles';
import { useSharedTable, useSharedValue } from '../lib/useSharedTable';
import { calculateMemberBalances, calculateSettlementTransfers, normalizeExpense, SharedExpense, SupportedCurrency } from '../lib/expenseSettlement';
import { parseExpenseFile, ExpenseImportResult } from '../lib/expenseImport';
import { TRAVEL_MEMBERS, TRAVEL_MEMBER_IDS, TravelMemberId } from '../lib/travelMembers';
import { useCurrentTravelMember } from './TravelMemberContext';

interface ExpenseTrackerProps { theme: ThemeConfig; }

const CATEGORIES = [
  { name: '🏠 住宿', color: '#8B5CF6' },
  { name: '🚆 交通', color: '#0EA5E9' },
  { name: '⛽️ 加油', color: '#F59E0B' },
  { name: '🍔 餐饮', color: '#EF4444' },
  { name: '🎫 景点', color: '#10B981' },
  { name: '🚗 租车', color: '#3B82F6' },
  { name: '🛍️ 购物', color: '#EC4899' },
  { name: '🛠️ 其他', color: '#6B7280' },
];

const DEFAULT_RATES: Record<SupportedCurrency, number> = { CNY: 1, NOK: 0.67, EUR: 7.8, CHF: 8.2, SEK: 0.7 };
const TRIP_BUDGET = 105849.96;
const LEGACY_DIRECTORY_ID = '__payer_directory__';
const getLocalDate = () => new Date().toLocaleDateString('en-CA');

function MemberSelector({ selected, onChange, single = false }: {
  selected: TravelMemberId[];
  onChange: (members: TravelMemberId[]) => void;
  single?: boolean;
}) {
  return (
    <div className="grid grid-cols-4 gap-1.5">
      {TRAVEL_MEMBERS.map((member) => {
        const active = selected.includes(member.id);
        return (
          <button key={member.id} type="button" onClick={() => onChange(single ? [member.id] : active ? selected.filter((id) => id !== member.id) : [...selected, member.id])}
            className={`rounded-lg border px-1 py-2 text-[10px] font-black transition ${active ? 'border-sky-400 bg-sky-500/15 text-sky-500' : 'border-stone-200/30 bg-white/5 opacity-55'}`}>
            {active && <Check className="mx-auto mb-0.5 h-3 w-3" />}{member.label}
          </button>
        );
      })}
    </div>
  );
}

export default function ExpenseTracker({ theme }: ExpenseTrackerProps) {
  const currentMember = useCurrentTravelMember();
  const [rawExpenses, setExpenses, loaded, expensesError] = useSharedTable<SharedExpense>('expenses', 'polar_expenses_v2', []);
  const [rates, setRates, , ratesError] = useSharedValue('exchange_rates_v2', 'polar_rates_v2', DEFAULT_RATES);
  const expenses = useMemo(() => rawExpenses.filter((expense) => expense.id !== LEGACY_DIRECTORY_ID).map(normalizeExpense), [rawExpenses]);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<SupportedCurrency>('CNY');
  const [category, setCategory] = useState('🍔 餐饮');
  const [date, setDate] = useState(getLocalDate());
  const [payerId, setPayerId] = useState<TravelMemberId>(currentMember.id);
  const [splitMemberIds, setSplitMemberIds] = useState<TravelMemberId[]>(TRAVEL_MEMBER_IDS);
  const [settled, setSettled] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<SharedExpense | null>(null);
  const [importResult, setImportResult] = useState<ExpenseImportResult | null>(null);
  const [importError, setImportError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const balances = useMemo(() => calculateMemberBalances(expenses, rates), [expenses, rates]);
  const transfers = useMemo(() => calculateSettlementTransfers(balances), [balances]);
  const unsettledExpenses = expenses.filter((expense) => !expense.settled);
  const totalCNY = expenses.reduce((sum, expense) => sum + expense.amount * rates[expense.currency], 0);

  const resetForm = () => {
    setTitle(''); setAmount(''); setCurrency('CNY'); setCategory('🍔 餐饮'); setDate(getLocalDate()); setPayerId(currentMember.id);
    setSplitMemberIds(TRAVEL_MEMBER_IDS); setSettled(false); setEditingId(null);
  };

  const saveExpense = (event: FormEvent) => {
    event.preventDefault();
    const numericAmount = Number(amount);
    if (!title.trim() || !Number.isFinite(numericAmount) || numericAmount <= 0 || splitMemberIds.length === 0) return;
    const row: SharedExpense = { id: editingId || crypto.randomUUID(), title: title.trim(), amount: numericAmount, currency, category, date, payerId, splitMemberIds, settled };
    setExpenses((current) => editingId ? current.map((expense) => expense.id === editingId ? row : expense) : [row, ...current]);
    resetForm();
  };

  const editExpense = (expense: SharedExpense) => {
    const item = normalizeExpense(expense);
    setEditingId(item.id); setTitle(item.title);
    if (item.currency === 'ISK') {
      setAmount(String(Math.round(item.amount * 0.051 * 100) / 100));
      setCurrency('CNY');
    } else {
      setAmount(String(item.amount));
      setCurrency(item.currency);
    }
    setCategory(item.category); setDate(item.date); setPayerId(item.payerId!); setSplitMemberIds(item.splitMemberIds!); setSettled(Boolean(item.settled));
  };

  const handleImport = async (file: File) => {
    setImportError('');
    try { setImportResult(await parseExpenseFile(file, currentMember.id)); }
    catch (error) { setImportError(error instanceof Error ? error.message : '账单文件解析失败。'); }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const applyImport = () => {
    if (!importResult) return;
    setExpenses((current) => [...importResult.rows, ...current]);
    setImportResult(null);
  };

  return (
    <div className={`relative space-y-4 p-4 ${getCardStyle(theme.id, 'primary')}`}>
      {(expensesError || ratesError) && <p className="rounded-lg bg-red-500/10 px-3 py-2 text-[10px] font-bold text-red-500">云端同步异常：{expensesError || ratesError}</p>}

      <section className={`p-4 ${getCardStyle(theme.id, 'subcard')}`}>
        <div className="flex items-start justify-between gap-3">
          <div><p className="text-[10px] font-black uppercase opacity-60">实际支出</p><p className="mt-1 text-2xl font-black">¥{totalCNY.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p></div>
          <div className="text-right"><p className="text-[10px] font-black uppercase opacity-60">计划预算</p><p className="mt-1 text-sm font-black">¥{TRIP_BUDGET.toLocaleString()}</p></div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-[10px]">
          {(['NOK', 'EUR', 'CHF', 'SEK'] as const).map((code) => (
            <label key={code} className="flex items-center gap-1"><span className="w-8 font-black">{code}</span><input type="number" step="0.001" min="0" value={rates[code]} onChange={(event) => setRates({ ...rates, [code]: Number(event.target.value) || DEFAULT_RATES[code] })} className={`min-w-0 flex-1 px-2 py-1 text-[10px] ${getInputStyle(theme.id)}`} /></label>
          ))}
        </div>
      </section>

      <section className={`p-4 ${getCardStyle(theme.id, 'subcard')}`}>
        <div className="mb-3 flex items-center justify-between"><h4 className="flex items-center gap-1.5 text-xs font-black"><CircleDollarSign className="h-4 w-4 text-emerald-500" />自动分账</h4><span className="text-[9px] opacity-55">仅统计未结算账单</span></div>
        <div className="grid grid-cols-2 gap-2">
          {balances.map((balance) => (
            <div key={balance.memberId} className="rounded-xl border border-stone-200/30 bg-white/5 p-2 text-[10px]">
              <p className="font-black">{balance.memberId}</p><p className="mt-1 opacity-65">支付 ¥{balance.paid.toFixed(2)} · 应付 ¥{balance.owed.toFixed(2)}</p>
              <p className={`mt-1 font-black ${balance.balance >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>{balance.balance >= 0 ? `应收 ¥${balance.balance.toFixed(2)}` : `应还 ¥${Math.abs(balance.balance).toFixed(2)}`}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 space-y-1.5">
          {transfers.length === 0 ? <p className="rounded-lg bg-emerald-500/10 px-3 py-2 text-center text-[10px] font-bold text-emerald-500">当前无需转账</p> : transfers.map((transfer, index) => (
            <div key={`${transfer.from}-${transfer.to}-${index}`} className="flex items-center justify-center gap-2 rounded-lg bg-sky-500/10 px-3 py-2 text-[11px] font-black"><span>{transfer.from}</span><ArrowRight className="h-3.5 w-3.5" /><span>{transfer.to}</span><span className="ml-auto">¥{transfer.amount.toFixed(2)}</span></div>
          ))}
        </div>
      </section>

      <section className={`p-4 ${getCardStyle(theme.id, 'subcard')}`}>
        <div className="mb-3 flex items-center justify-between"><h4 className="flex items-center gap-1.5 text-xs font-black"><FileSpreadsheet className="h-4 w-4" />一键导入账单</h4><button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1 rounded-lg bg-sky-500 px-3 py-1.5 text-[10px] font-black text-white"><Upload className="h-3 w-3" />选择文件</button></div>
        <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={(event) => event.target.files?.[0] && handleImport(event.target.files[0])} />
        <p className="text-[9px] leading-relaxed opacity-55">识别名称、金额、币种、分类、日期、支出人、分账人和结算状态。没有分账人时默认四人。</p>
        {importError && <p className="mt-2 rounded-lg bg-red-500/10 px-3 py-2 text-[10px] text-red-500">{importError}</p>}
      </section>

      <form onSubmit={saveExpense} className={`space-y-3 p-4 ${getCardStyle(theme.id, 'subcard')}`}>
        <div className="flex items-center justify-between"><h4 className="text-xs font-black">{editingId ? '编辑账单' : '记一笔账'}</h4>{editingId && <button type="button" onClick={resetForm} className="p-1"><X className="h-4 w-4" /></button>}</div>
        <input required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="支出名称" className={`w-full px-3 py-2 text-xs ${getInputStyle(theme.id)}`} />
        <div className="grid grid-cols-2 gap-2"><input required inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value.replace(/[^0-9.]/g, ''))} placeholder="金额" className={`px-3 py-2 text-xs ${getInputStyle(theme.id)}`} /><select value={currency} onChange={(event) => setCurrency(event.target.value as SupportedCurrency)} className={`px-3 py-2 text-xs ${getInputStyle(theme.id)}`}>{Object.keys(DEFAULT_RATES).map((code) => <option key={code}>{code}</option>)}</select></div>
        <input type="date" value={date} onChange={(event) => setDate(event.target.value)} className={`w-full px-3 py-2 text-xs ${getInputStyle(theme.id)}`} />
        <select value={category} onChange={(event) => setCategory(event.target.value)} className={`w-full px-3 py-2 text-xs ${getInputStyle(theme.id)}`}>{CATEGORIES.map((item) => <option key={item.name}>{item.name}</option>)}</select>
        <div><p className="mb-1 text-[9px] font-black opacity-60">支出人</p><MemberSelector selected={[payerId]} onChange={(members) => setPayerId(members[0])} single /></div>
        <div>
          <div className="mb-1 flex items-center justify-between"><p className="text-[9px] font-black opacity-60">分账人</p><button type="button" onClick={() => setSplitMemberIds([currentMember.id])} className="text-[9px] font-bold text-sky-500">个人（仅自己）</button></div>
          <MemberSelector selected={splitMemberIds} onChange={setSplitMemberIds} />
          {splitMemberIds.length === 0 && <p className="mt-1 text-[9px] text-red-500">至少选择一名分账人</p>}
        </div>
        <label className="flex items-center gap-2 text-[10px] font-bold"><input type="checkbox" checked={settled} onChange={(event) => setSettled(event.target.checked)} />此账单已结算</label>
        <button disabled={splitMemberIds.length === 0} className={`flex w-full items-center justify-center gap-1 py-2 text-xs ${getPrimaryButtonStyle(theme.id)}`}><Plus className="h-4 w-4" />{editingId ? '保存修改' : '保存账单'}</button>
      </form>

      <section className="space-y-2">
        <div className="flex items-center justify-between"><h4 className="flex items-center gap-1 text-xs font-black"><Receipt className="h-4 w-4" />账单流水</h4><span className="text-[9px] opacity-50">{unsettledExpenses.length} 笔待结算</span></div>
        {!loaded ? <p className="py-4 text-center text-[10px] opacity-50">正在加载…</p> : expenses.length === 0 ? <p className="py-4 text-center text-[10px] opacity-50">暂无账单</p> : expenses.map((expense) => (
          <div key={expense.id} className={`p-3 ${getCardStyle(theme.id, 'subcard')}`}>
            <div className="flex items-start gap-2"><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-1"><h5 className="font-black">{expense.title}</h5><span className={`rounded px-1.5 py-0.5 text-[8px] font-black ${expense.settled ? 'bg-emerald-500/15 text-emerald-500' : 'bg-amber-500/15 text-amber-500'}`}>{expense.settled ? '已结算' : '待结算'}</span></div><p className="mt-1 text-[9px] opacity-55">{expense.date} · {expense.category} · {expense.payerId} 支付 · 分账 {expense.splitMemberIds?.join('/')}</p></div><p className="font-black">{expense.amount.toLocaleString()} {expense.currency}</p></div>
            <div className="mt-2 flex justify-end gap-1"><button onClick={() => setExpenses((current) => current.map((item) => item.id === expense.id ? { ...item, settled: !expense.settled } : item))} className="rounded-lg bg-emerald-500/10 px-2 py-1 text-[9px] font-bold text-emerald-500">{expense.settled ? '设为未结算' : '标记已结算'}</button><button onClick={() => editExpense(expense)} className="p-1.5 text-sky-500"><Pencil className="h-3.5 w-3.5" /></button><button onClick={() => setConfirmDelete(expense)} className="p-1.5 text-red-500"><Trash2 className="h-3.5 w-3.5" /></button></div>
          </div>
        ))}
      </section>

      <AnimatePresence>
        {importResult && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="max-h-[85%] w-full max-w-md overflow-y-auto rounded-2xl bg-stone-950 p-4 text-white"><div className="flex justify-between"><h4 className="font-black">导入预览 · {importResult.sheetName}</h4><button onClick={() => setImportResult(null)}><X className="h-4 w-4" /></button></div><p className="mt-1 text-[10px] opacity-60">识别 {importResult.rows.length} 笔账单</p><div className="mt-3 space-y-1.5">{importResult.rows.slice(0, 30).map((row) => <div key={row.id} className="rounded-lg bg-white/10 p-2 text-[10px]"><b>{row.title}</b><span className="float-right">{row.amount} {row.currency}</span><p className="mt-1 opacity-60">{row.payerId} 支付 · {row.splitMemberIds?.join('/')} · {row.settled ? '已结算' : '未结算'}</p></div>)}</div>{importResult.warnings.map((warning) => <p key={warning} className="mt-1 text-[9px] text-amber-300">{warning}</p>)}<button onClick={applyImport} className="mt-4 w-full rounded-xl bg-sky-400 py-2.5 text-xs font-black text-slate-950">确认导入 {importResult.rows.length} 笔</button></div>
        </motion.div>}
        {confirmDelete && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 grid place-items-center bg-black/60 p-4"><div className="w-full max-w-sm rounded-2xl bg-stone-950 p-4 text-white"><h4 className="font-black">删除账单</h4><p className="mt-2 text-xs opacity-70">确认删除“{confirmDelete.title}”？</p><div className="mt-4 grid grid-cols-2 gap-2"><button onClick={() => setConfirmDelete(null)} className="rounded-lg bg-white/10 py-2 text-xs">取消</button><button onClick={() => { setExpenses((current) => current.filter((item) => item.id !== confirmDelete.id)); setConfirmDelete(null); }} className="rounded-lg bg-red-500 py-2 text-xs font-black">删除</button></div></div></motion.div>}
      </AnimatePresence>
    </div>
  );
}
