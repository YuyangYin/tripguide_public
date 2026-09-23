import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Check, ChevronDown, CircleDollarSign, FileSpreadsheet, Pencil, Plus, Receipt, Trash2, Upload, X } from 'lucide-react';
import { ThemeConfig } from '../types';
import { getCardStyle, getInputStyle, getPrimaryButtonStyle } from '../lib/themeStyles';
import { useSharedTable, useSharedValue } from '../lib/useSharedTable';
import { applySettlementPayments, calculateMemberBalances, calculateSettlementTransfers, getRepayableMemberIds, normalizeExpense, SharedExpense, SupportedCurrency, type SettlementPayment } from '../lib/expenseSettlement';
import { parseExpenseFile, ExpenseImportResult } from '../lib/expenseImport';
import { TRAVEL_MEMBERS, TRAVEL_MEMBER_IDS, TravelMemberId } from '../lib/travelMembers';
import { useCurrentTravelMember } from './TravelMemberContext';
import { filterExpenses, groupExpensesByDate, type ExpenseSettlementFilter } from '../lib/expenseFilters';
import { calculateExpenseStatistics } from '../lib/expenseStats';

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

const DEFAULT_RATES: Record<SupportedCurrency, number> = { CNY: 1, HKD: 0.91, NOK: 0.67, EUR: 7.8, CHF: 8.2, SEK: 0.7 };
const CURRENCY_LABELS: Record<SupportedCurrency | 'ISK', string> = {
  CNY: '人民币',
  HKD: '港币',
  NOK: '挪威克朗',
  EUR: '欧元',
  CHF: '瑞士法郎',
  SEK: '瑞典克朗',
  ISK: '冰岛克朗',
};
const TRIP_BUDGET = 105849.96;
const LEGACY_DIRECTORY_ID = '__payer_directory__';
const getLocalDate = () => new Date().toLocaleDateString('en-CA');

function MemberSelector({ selected, onChange, single = false, allowed }: {
  selected: TravelMemberId[];
  onChange: (members: TravelMemberId[]) => void;
  single?: boolean;
  allowed?: TravelMemberId[];
}) {
  return (
    <div className="grid grid-cols-4 gap-1.5">
      {TRAVEL_MEMBERS.map((member) => {
        const active = selected.includes(member.id);
        const disabled = allowed ? !allowed.includes(member.id) : false;
        return (
          <button key={member.id} type="button" disabled={disabled} onClick={() => onChange(single ? [member.id] : active ? selected.filter((id) => id !== member.id) : [...selected, member.id])}
            className={`rounded-lg border px-1 py-2 text-[10px] font-black transition disabled:cursor-not-allowed disabled:opacity-20 ${active ? 'border-sky-400 bg-sky-500/15 text-sky-500' : 'border-stone-200/30 bg-white/5 opacity-55'}`}>
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
  const [settlementPayments, setSettlementPayments, , settlementPaymentsError] = useSharedTable<SettlementPayment>('settlement_payments', 'polar_settlement_payments_v1', []);
  const [rates, setRates, , ratesError] = useSharedValue('exchange_rates_v2', 'polar_rates_v2', DEFAULT_RATES);
  const expenses = useMemo(() => rawExpenses.filter((expense) => expense.id !== LEGACY_DIRECTORY_ID).map(normalizeExpense), [rawExpenses]);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<SupportedCurrency>('CNY');
  const [category, setCategory] = useState('🍔 餐饮');
  const [date, setDate] = useState(getLocalDate());
  const [payerId, setPayerId] = useState<TravelMemberId>(currentMember.id);
  const [splitMemberIds, setSplitMemberIds] = useState<TravelMemberId[]>(TRAVEL_MEMBER_IDS);
  const [settlementMode, setSettlementMode] = useState<'unsettled' | 'partial' | 'all'>('unsettled');
  const [settledMemberIds, setSettledMemberIds] = useState<TravelMemberId[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [settlementFilter, setSettlementFilter] = useState<ExpenseSettlementFilter>('all');
  const [expandedMemberStat, setExpandedMemberStat] = useState<TravelMemberId | null>(currentMember.id);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<SharedExpense | null>(null);
  const [importResult, setImportResult] = useState<ExpenseImportResult | null>(null);
  const [importError, setImportError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const normalizedRates = useMemo(() => ({ ...DEFAULT_RATES, ...rates }), [rates]);
  useEffect(() => {
    if (!rates.HKD) setRates((current) => ({ ...DEFAULT_RATES, ...current, HKD: DEFAULT_RATES.HKD }));
  }, [rates.HKD, setRates]);
  const baseBalances = useMemo(() => calculateMemberBalances(expenses, normalizedRates), [expenses, normalizedRates]);
  const balances = useMemo(() => applySettlementPayments(baseBalances, settlementPayments), [baseBalances, settlementPayments]);
  const transfers = useMemo(() => calculateSettlementTransfers(balances), [balances]);
  const expenseStats = useMemo(() => calculateExpenseStatistics(expenses, normalizedRates), [expenses, normalizedRates]);
  const unsettledExpenses = expenses.filter((expense) => !expense.settled);
  const toCNY = (expense: SharedExpense) => expense.amount * (expense.currency === 'ISK' ? 0.051 : normalizedRates[expense.currency]);
  const totalCNY = expenseStats.total;
  const expenseDates = useMemo(() => [...new Set(expenses.map((expense) => expense.date).filter(Boolean))].sort((a, b) => b.localeCompare(a)), [expenses]);
  const filteredExpenses = useMemo(() => filterExpenses(expenses, { category: categoryFilter, date: dateFilter, settlement: settlementFilter }), [categoryFilter, dateFilter, expenses, settlementFilter]);
  const filteredGroups = useMemo(() => groupExpensesByDate(filteredExpenses), [filteredExpenses]);
  const filteredTotalCNY = filteredExpenses.reduce((sum, expense) => sum + toCNY(expense), 0);

  const resetForm = () => {
    setTitle(''); setAmount(''); setCurrency('CNY'); setCategory('🍔 餐饮'); setDate(getLocalDate()); setPayerId(currentMember.id);
    setSplitMemberIds(TRAVEL_MEMBER_IDS); setSettlementMode('unsettled'); setSettledMemberIds([]); setEditingId(null);
  };

  const repayableMemberIds = splitMemberIds.filter((id) => id !== payerId);
  useEffect(() => {
    setSettledMemberIds((current) => current.filter((id) => repayableMemberIds.includes(id)));
  }, [payerId, splitMemberIds]);

  const saveExpense = (event: FormEvent) => {
    event.preventDefault();
    const numericAmount = Number(amount);
    if (!title.trim() || !Number.isFinite(numericAmount) || numericAmount <= 0 || splitMemberIds.length === 0) return;
    const completedMembers = settlementMode === 'all' ? repayableMemberIds : settlementMode === 'partial' ? settledMemberIds.filter((id) => repayableMemberIds.includes(id)) : [];
    const row: SharedExpense = { id: editingId || crypto.randomUUID(), title: title.trim(), amount: numericAmount, currency, category, date, payerId, splitMemberIds, settledMemberIds: completedMembers, settled: settlementMode === 'all' };
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
    setCategory(item.category); setDate(item.date); setPayerId(item.payerId!); setSplitMemberIds(item.splitMemberIds!); setSettledMemberIds(item.settledMemberIds || []); setSettlementMode(item.settled ? 'all' : (item.settledMemberIds || []).length > 0 ? 'partial' : 'unsettled');
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

  const markTransferSettled = (from: TravelMemberId, to: TravelMemberId, amount: number) => {
    setSettlementPayments((current) => [{
      id: crypto.randomUUID(),
      from,
      to,
      amount,
      date: getLocalDate(),
      createdAt: new Date().toISOString(),
    }, ...current]);
  };

  return (
    <div className={`relative space-y-4 p-4 ${getCardStyle(theme.id, 'primary')}`}>
      {(expensesError || ratesError || settlementPaymentsError) && <p className="rounded-lg bg-red-500/10 px-3 py-2 text-[10px] font-bold text-red-500">云端同步异常：{expensesError || ratesError || settlementPaymentsError}</p>}

      <section className={`p-4 ${getCardStyle(theme.id, 'subcard')}`}>
        <div className="flex items-start justify-between gap-3">
          <div><p className="text-[10px] font-black uppercase opacity-60">实际支出</p><p className="mt-1 text-2xl font-black">¥{totalCNY.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p></div>
          <div className="text-right"><p className="text-[10px] font-black uppercase opacity-60">计划预算</p><p className="mt-1 text-sm font-black">¥{TRIP_BUDGET.toLocaleString()}</p></div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-[10px]">
          {(['HKD', 'NOK', 'EUR', 'CHF', 'SEK'] as const).map((code) => (
            <label key={code} className="flex items-center gap-1"><span className="w-14 shrink-0 font-black">1 {CURRENCY_LABELS[code]}</span><input aria-label={`${CURRENCY_LABELS[code]}兑人民币汇率`} type="number" step="0.001" min="0" value={normalizedRates[code]} onChange={(event) => setRates({ ...normalizedRates, [code]: Number(event.target.value) || DEFAULT_RATES[code] })} className={`min-w-0 flex-1 px-2 py-1 text-[10px] ${getInputStyle(theme.id)}`} /><span className="shrink-0 opacity-60">元</span></label>
          ))}
        </div>

        <div className="mt-4 border-t border-stone-300/20 pt-3">
          <div className="mb-2 flex items-center justify-between"><p className="text-[10px] font-black">团队各分类花费</p><span className="text-[9px] opacity-50">按账单总额统计</span></div>
          {expenseStats.categories.length === 0 ? <p className="rounded-lg bg-white/5 px-3 py-2 text-center text-[9px] opacity-50">暂无分类统计</p> : <div className="grid grid-cols-2 gap-1.5">{expenseStats.categories.map((item) => <div key={item.category} className="flex items-center justify-between rounded-lg bg-white/5 px-2 py-1.5 text-[9px]"><span className="font-bold">{item.category}</span><span className="font-black">¥{item.amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span></div>)}</div>}
        </div>

        <div className="mt-4 border-t border-stone-300/20 pt-3">
          <div className="mb-2 flex items-center justify-between"><p className="text-[10px] font-black">每个人的实际花费</p><span className="text-[9px] opacity-50">按分账人归属，可点开</span></div>
          <div className="space-y-1.5">{expenseStats.members.map((member) => {
            const expanded = expandedMemberStat === member.memberId;
            return <div key={member.memberId} className="overflow-hidden rounded-xl border border-stone-200/20 bg-white/5"><button type="button" onClick={() => setExpandedMemberStat(expanded ? null : member.memberId)} className="flex w-full items-center gap-2 px-3 py-2 text-left"><span className="text-[10px] font-black">{member.memberId}</span><span className="ml-auto text-[11px] font-black text-sky-500">¥{member.total.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span><ChevronDown className={`h-3.5 w-3.5 opacity-50 transition ${expanded ? 'rotate-180' : ''}`} /></button>{expanded && <div className="border-t border-stone-300/15 px-3 py-2">{member.categories.length === 0 ? <p className="text-[9px] opacity-45">暂无个人花费</p> : <div className="space-y-1">{member.categories.map((item) => <div key={item.category} className="flex items-center justify-between text-[9px]"><span className="opacity-70">{item.category}</span><span className="font-black">¥{item.amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span></div>)}</div>}</div>}</div>;
          })}</div>
        </div>
      </section>

      <section className={`p-4 ${getCardStyle(theme.id, 'subcard')}`}>
        <div className="mb-3 flex items-center justify-between"><h4 className="flex items-center gap-1.5 text-xs font-black"><CircleDollarSign className="h-4 w-4 text-emerald-500" />按人自动分账</h4><span className="text-[9px] opacity-55">未结算账单 - 已完成转账</span></div>
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
            <div key={`${transfer.from}-${transfer.to}-${index}`} className="flex items-center gap-2 rounded-lg bg-sky-500/10 px-3 py-2 text-[11px] font-black"><span>{transfer.from}</span><ArrowRight className="h-3.5 w-3.5" /><span>{transfer.to}</span><span className="ml-auto">¥{transfer.amount.toFixed(2)}</span><button type="button" onClick={() => markTransferSettled(transfer.from, transfer.to, transfer.amount)} className="flex items-center gap-1 rounded-lg bg-emerald-500 px-2 py-1 text-[9px] font-black text-white"><Check className="h-3 w-3" />已转账</button></div>
          ))}
        </div>
        {settlementPayments.length > 0 && <div className="mt-3 border-t border-stone-300/20 pt-3"><div className="mb-2 flex items-center justify-between"><p className="text-[10px] font-black">成员结算流水</p><span className="text-[9px] opacity-50">{settlementPayments.length} 笔已完成</span></div><div className="space-y-1.5">{[...settlementPayments].sort((a, b) => (b.createdAt || b.date).localeCompare(a.createdAt || a.date)).map((payment) => <div key={payment.id} className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2 text-[10px]"><Check className="h-3.5 w-3.5 shrink-0 text-emerald-500" /><span className="font-black">{payment.from}</span><ArrowRight className="h-3 w-3" /><span className="font-black">{payment.to}</span><span className="ml-auto font-black text-emerald-500">¥{payment.amount.toFixed(2)}</span><span className="opacity-45">{payment.date}</span><button type="button" onClick={() => setSettlementPayments((current) => current.filter((item) => item.id !== payment.id))} className="rounded px-1.5 py-1 text-[8px] font-bold text-rose-500 hover:bg-rose-500/10">撤销</button></div>)}</div></div>}
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
        <div className="grid grid-cols-2 gap-2"><input required inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value.replace(/[^0-9.]/g, ''))} placeholder="金额" className={`px-3 py-2 text-xs ${getInputStyle(theme.id)}`} /><select value={currency} onChange={(event) => setCurrency(event.target.value as SupportedCurrency)} className={`px-3 py-2 text-xs ${getInputStyle(theme.id)}`}>{(Object.keys(DEFAULT_RATES) as SupportedCurrency[]).map((code) => <option key={code} value={code}>{CURRENCY_LABELS[code]}</option>)}</select></div>
        <input type="date" value={date} onChange={(event) => setDate(event.target.value)} className={`w-full px-3 py-2 text-xs ${getInputStyle(theme.id)}`} />
        <select value={category} onChange={(event) => setCategory(event.target.value)} className={`w-full px-3 py-2 text-xs ${getInputStyle(theme.id)}`}>{CATEGORIES.map((item) => <option key={item.name}>{item.name}</option>)}</select>
        <div><p className="mb-1 text-[9px] font-black opacity-60">支出人</p><MemberSelector selected={[payerId]} onChange={(members) => setPayerId(members[0])} single /></div>
        <div>
          <div className="mb-1 flex items-center justify-between"><p className="text-[9px] font-black opacity-60">分账人</p><button type="button" onClick={() => setSplitMemberIds([currentMember.id])} className="text-[9px] font-bold text-sky-500">个人（仅自己）</button></div>
          <MemberSelector selected={splitMemberIds} onChange={setSplitMemberIds} />
          {splitMemberIds.length === 0 && <p className="mt-1 text-[9px] text-red-500">至少选择一名分账人</p>}
        </div>
        <div className="space-y-2"><p className="text-[9px] font-black opacity-60">账单结算方式</p><div className="grid grid-cols-3 gap-1.5">{([['unsettled', '未结算'], ['partial', '部分人结算'], ['all', '全部已结算']] as const).map(([mode, label]) => <button key={mode} type="button" onClick={() => { setSettlementMode(mode); if (mode === 'unsettled') setSettledMemberIds([]); }} className={`rounded-lg border px-1 py-2 text-[9px] font-black ${settlementMode === mode ? 'border-emerald-400 bg-emerald-500/15 text-emerald-500' : 'border-stone-200/30 bg-white/5 opacity-55'}`}>{label}</button>)}</div>{settlementMode === 'partial' && <div className="rounded-xl border border-emerald-500/15 bg-emerald-500/5 p-2"><p className="mb-1.5 text-[9px] font-bold opacity-65">勾选已经向支出人完成结算的分账人</p><MemberSelector selected={settledMemberIds} onChange={setSettledMemberIds} allowed={repayableMemberIds} />{settledMemberIds.length === 0 && <p className="mt-1 text-[9px] text-amber-500">请选择至少一名已结算成员</p>}</div>}</div>
        <button disabled={splitMemberIds.length === 0 || (settlementMode === 'partial' && settledMemberIds.length === 0)} className={`flex w-full items-center justify-center gap-1 py-2 text-xs ${getPrimaryButtonStyle(theme.id)}`}><Plus className="h-4 w-4" />{editingId ? '保存修改' : '保存账单'}</button>
      </form>

      <section className="space-y-2">
        <div className="flex items-center justify-between"><h4 className="flex items-center gap-1 text-xs font-black"><Receipt className="h-4 w-4" />账单流水</h4><span className="text-[9px] opacity-50">{unsettledExpenses.length} 笔待结算</span></div>
        <div className={`space-y-2 p-3 ${getCardStyle(theme.id, 'subcard')}`}>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <label className="text-[9px] font-black opacity-65">支出分类<select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className={`mt-1 w-full px-2 py-2 text-[10px] ${getInputStyle(theme.id)}`}><option value="all">全部分类</option>{CATEGORIES.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}</select></label>
            <label className="text-[9px] font-black opacity-65">记录日期<select value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} className={`mt-1 w-full px-2 py-2 text-[10px] ${getInputStyle(theme.id)}`}><option value="all">全部日期</option>{expenseDates.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
            <label className="text-[9px] font-black opacity-65">结算状态<select value={settlementFilter} onChange={(event) => setSettlementFilter(event.target.value as ExpenseSettlementFilter)} className={`mt-1 w-full px-2 py-2 text-[10px] ${getInputStyle(theme.id)}`}><option value="all">全部状态</option><option value="unsettled">待结算（含部分）</option><option value="partial">部分人已结算</option><option value="settled">全部已结算</option></select></label>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-sky-500/10 px-3 py-2 text-[10px]"><span className="font-bold">筛选结果：{filteredExpenses.length} 笔</span><span className="font-black text-sky-500">折合 ¥{filteredTotalCNY.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span></div>
          {(categoryFilter !== 'all' || dateFilter !== 'all' || settlementFilter !== 'all') && <button type="button" onClick={() => { setCategoryFilter('all'); setDateFilter('all'); setSettlementFilter('all'); }} className="w-full rounded-lg bg-white/5 py-1.5 text-[9px] font-bold text-sky-500">清除全部筛选</button>}
        </div>
        {!loaded ? <p className="py-4 text-center text-[10px] opacity-50">正在加载…</p> : expenses.length === 0 ? <p className="py-4 text-center text-[10px] opacity-50">暂无账单</p> : filteredExpenses.length === 0 ? <p className="py-4 text-center text-[10px] opacity-50">没有符合筛选条件的账单</p> : filteredGroups.map((group) => <div key={group.date} className="space-y-2"><div className="flex items-center gap-2 px-1"><span className="text-[10px] font-black">{group.date}</span><span className="h-px flex-1 bg-stone-300/30" /><span className="text-[9px] opacity-50">{group.expenses.length} 笔</span></div>{group.expenses.map((expense) => {
          const repayable = getRepayableMemberIds(expense);
          const completed = expense.settledMemberIds || [];
          const settlementLabel = expense.settled ? '全部已结算' : completed.length > 0 ? `部分结算 ${completed.length}/${repayable.length}` : '待结算';
          return (
          <div key={expense.id} className={`p-3 ${getCardStyle(theme.id, 'subcard')}`}>
            <div className="flex items-start gap-2"><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-1"><h5 className="font-black">{expense.title}</h5><span className={`rounded px-1.5 py-0.5 text-[8px] font-black ${expense.settled ? 'bg-emerald-500/15 text-emerald-500' : completed.length > 0 ? 'bg-sky-500/15 text-sky-500' : 'bg-amber-500/15 text-amber-500'}`}>{settlementLabel}</span></div><p className="mt-1 text-[9px] opacity-55">{expense.date} · {expense.category} · {expense.payerId} 支付 · 分账 {expense.splitMemberIds?.join('/')}</p>{completed.length > 0 && <p className="mt-1 text-[9px] font-bold text-emerald-500">已结算成员：{completed.join(' / ')}</p>}</div><p className="font-black">{expense.amount.toLocaleString()} {CURRENCY_LABELS[expense.currency]}</p></div>
            <div className="mt-2 flex justify-end gap-1"><button onClick={() => setExpenses((current) => current.map((item) => item.id === expense.id ? { ...item, settled: !expense.settled, settledMemberIds: expense.settled ? [] : getRepayableMemberIds(expense) } : item))} className="rounded-lg bg-emerald-500/10 px-2 py-1 text-[9px] font-bold text-emerald-500">{expense.settled ? '重置结算' : '全部结算'}</button><button onClick={() => editExpense(expense)} className="rounded-lg bg-sky-500/10 px-2 py-1 text-[9px] font-bold text-sky-500">结算设置</button><button onClick={() => editExpense(expense)} className="p-1.5 text-sky-500"><Pencil className="h-3.5 w-3.5" /></button><button onClick={() => setConfirmDelete(expense)} className="p-1.5 text-red-500"><Trash2 className="h-3.5 w-3.5" /></button></div>
          </div>
        )})}</div>)}
      </section>

      <AnimatePresence>
        {importResult && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="max-h-[85%] w-full max-w-md overflow-y-auto rounded-2xl bg-stone-950 p-4 text-white"><div className="flex justify-between"><h4 className="font-black">导入预览 · {importResult.sheetName}</h4><button onClick={() => setImportResult(null)}><X className="h-4 w-4" /></button></div><p className="mt-1 text-[10px] opacity-60">识别 {importResult.rows.length} 笔账单</p><div className="mt-3 space-y-1.5">{importResult.rows.slice(0, 30).map((row) => <div key={row.id} className="rounded-lg bg-white/10 p-2 text-[10px]"><b>{row.title}</b><span className="float-right">{row.amount} {CURRENCY_LABELS[row.currency]}</span><p className="mt-1 opacity-60">{row.payerId} 支付 · {row.splitMemberIds?.join('/')} · {row.settled ? '已结算' : '未结算'}</p></div>)}</div>{importResult.warnings.map((warning) => <p key={warning} className="mt-1 text-[9px] text-amber-300">{warning}</p>)}<button onClick={applyImport} className="mt-4 w-full rounded-xl bg-sky-400 py-2.5 text-xs font-black text-slate-950">确认导入 {importResult.rows.length} 笔</button></div>
        </motion.div>}
        {confirmDelete && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 grid place-items-center bg-black/60 p-4"><div className="w-full max-w-sm rounded-2xl bg-stone-950 p-4 text-white"><h4 className="font-black">删除账单</h4><p className="mt-2 text-xs opacity-70">确认删除“{confirmDelete.title}”？</p><div className="mt-4 grid grid-cols-2 gap-2"><button onClick={() => setConfirmDelete(null)} className="rounded-lg bg-white/10 py-2 text-xs">取消</button><button onClick={() => { setExpenses((current) => current.filter((item) => item.id !== confirmDelete.id)); setConfirmDelete(null); }} className="rounded-lg bg-red-500 py-2 text-xs font-black">删除</button></div></div></motion.div>}
      </AnimatePresence>
    </div>
  );
}
