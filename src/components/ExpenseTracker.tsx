import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ThemeConfig } from '../types';
import { Plus, Trash2, Coins, Receipt, ArrowUpDown, CreditCard, CircleUserRound, Pencil, X } from 'lucide-react';
import { getCardStyle, getInputStyle, getPrimaryButtonStyle } from '../lib/themeStyles';
import { useSharedTable, useSharedValue } from '../lib/useSharedTable';
import { createPayerProfile, getExpensePayers, getPayerDirectory, normalizePayerName, PayerProfile } from '../lib/expenseAttribution';
import { sanitizeAmountInput } from '../lib/expenseInput';
import { NordicAnimalAvatar } from './NordicAnimalAvatar';
import { PayerCombobox } from './PayerCombobox';

interface ExpenseItem {
  id: string;
  title: string;
  amount: number;
  currency: 'CNY' | 'ISK' | 'NOK' | 'EUR';
  category: string;
  date: string;
  payer?: string;
  payerAvatar?: number;
  payers?: PayerProfile[];
}

interface ExpenseTrackerProps {
  theme: ThemeConfig;
}

const CATEGORIES = [
  { id: 'stay', name: '🏠 住宿', color: '#8B5CF6' },
  { id: 'gas', name: '⛽️ 加油', color: '#F59E0B' },
  { id: 'food', name: '🍔 餐饮', color: '#EF4444' },
  { id: 'ticket', name: '🎫 景点', color: '#10B981' },
  { id: 'rent', name: '🚗 租车', color: '#3B82F6' },
  { id: 'other', name: '🛠️ 其他', color: '#6B7280' },
];

// Default rates relative to CNY (travelers can override and share them).
const DEFAULT_RATES: Record<'CNY' | 'ISK' | 'NOK' | 'EUR', number> = {
  CNY: 1,
  ISK: 0.051, // 1 ISK = 0.051 CNY
  NOK: 0.67,  // 1 NOK = 0.67 CNY
  EUR: 7.80,  // 1 EUR = 7.80 CNY
};

const DEFAULT_EXPENSES: ExpenseItem[] = [];
const PAYER_DIRECTORY_ID = '__payer_directory__';
const TRIP_BUDGET = 105849.96;
const BUDGET_CATEGORIES = [
  ['大交通', 37914], ['租车与本地交通', 14349], ['景点', 4685], ['住宿', 21969.96], ['餐饮与日常', 26932],
] as const;

const createPayerDirectoryRow = (profiles: PayerProfile[]): ExpenseItem => ({
  id: PAYER_DIRECTORY_ID,
  title: PAYER_DIRECTORY_ID,
  amount: 0,
  currency: 'CNY',
  category: '__payer_directory__',
  date: new Date().toISOString().split('T')[0],
  payers: profiles
});

export default function ExpenseTracker({ theme }: ExpenseTrackerProps) {
  // Shared ledger with local cache and Supabase realtime synchronization.
  const [expenses, setExpenses, expensesLoaded, expensesError] = useSharedTable<ExpenseItem>('expenses', 'polar_expenses', DEFAULT_EXPENSES);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<'CNY' | 'ISK' | 'NOK' | 'EUR'>('ISK');
  const [category, setCategory] = useState('🏠 住宿');
  const [selectedPayers, setSelectedPayers] = useState<PayerProfile[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  // Exchange rates are shared by all signed-in travelers.
  const [rates, setRates, , ratesError] = useSharedValue('exchange_rates', 'polar_rates', DEFAULT_RATES);
  // Shared frosted-glass confirmation for clearing the ledger or deleting one expense.
  const [expenseConfirm, setExpenseConfirm] = useState<
    { type: 'clear' } | { type: 'delete'; item: ExpenseItem } | null
  >(null);

  const isCyber = theme.id === 'cyber';
  const isNewspaper = theme.id === 'newspaper';
  const isFrosted = theme.id === 'frosted';
  const ledgerExpenses = useMemo(
    () => expenses.filter((expense) => expense.id !== PAYER_DIRECTORY_ID),
    [expenses]
  );
  const payerDirectoryRow = expenses.find((expense) => expense.id === PAYER_DIRECTORY_ID);
  const payerOptions = useMemo(
    () => payerDirectoryRow ? getExpensePayers(payerDirectoryRow) : getPayerDirectory(ledgerExpenses),
    [ledgerExpenses, payerDirectoryRow]
  );

  // Migrate historical payer data into an independent shared directory once.
  // After this row exists, deleting every expense for a payer does not remove the payer option.
  useEffect(() => {
    if (!expensesLoaded || payerDirectoryRow) return;
    const historicalProfiles = getPayerDirectory(ledgerExpenses);
    if (historicalProfiles.length === 0) return;

    setExpenses((current) => {
      if (current.some((expense) => expense.id === PAYER_DIRECTORY_ID)) return current;
      return [createPayerDirectoryRow(historicalProfiles), ...current];
    });
  }, [expensesLoaded, ledgerExpenses, payerDirectoryRow, setExpenses]);

  const updateRate = (curr: 'ISK' | 'NOK' | 'EUR', raw: string) => {
    const trimmed = raw.trim();
    const next = { ...rates };
    if (trimmed === '') {
      next[curr] = DEFAULT_RATES[curr]; // 空值回退默认
    } else {
      const num = Number(trimmed);
      if (!isNaN(num) && num > 0) next[curr] = num;
      else return; // 非法输入忽略
    }
    setRates(next);
  };

  // Convert amount to CNY (uses current editable rates)
  const convertToCNY = (amt: number, curr: 'CNY' | 'ISK' | 'NOK' | 'EUR') => {
    return amt * rates[curr];
  };

  const formatShortDate = (date: string) => {
    const [, month, day] = date.split('-');
    return month && day ? `${month}/${day}` : date;
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !amount || isNaN(Number(amount)) || selectedPayers.length === 0) return;

    const newItem: ExpenseItem = {
      id: editingId || Date.now().toString(),
      title: title.trim(),
      amount: Math.abs(Number(amount)),
      currency,
      category,
      date: new Date().toISOString().split('T')[0],
      payers: selectedPayers
    };

    setExpenses((current) => editingId
      ? current.map((item) => item.id === editingId ? newItem : item)
      : [newItem, ...current]);
    setTitle('');
    setAmount('');
    setSelectedPayers([]);
    setEditingId(null);
  };

  const handleEditExpense = (item: ExpenseItem) => {
    setEditingId(item.id);
    setTitle(item.title);
    setAmount(String(item.amount));
    setCurrency(item.currency);
    setCategory(item.category);
    setSelectedPayers(getExpensePayers(item));
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setAmount('');
    setSelectedPayers([]);
  };

  const savePayerDirectory = (profiles: PayerProfile[]) => {
    const directoryRow = createPayerDirectoryRow(profiles);
    setExpenses((current) => [directoryRow, ...current.filter((expense) => expense.id !== PAYER_DIRECTORY_ID)]);
  };

  const handleCreatePayer = (name: string) => {
    const profile = createPayerProfile(payerOptions, name);
    const exists = payerOptions.some((option) => normalizePayerName(option.name) === normalizePayerName(profile.name));
    if (!exists) savePayerDirectory([...payerOptions, profile]);
    setSelectedPayers((current) => current.some((option) => normalizePayerName(option.name) === normalizePayerName(profile.name))
      ? current
      : [...current, profile]);
  };

  const handleTogglePayer = (profile: PayerProfile) => {
    const key = normalizePayerName(profile.name);
    setSelectedPayers((current) => current.some((option) => normalizePayerName(option.name) === key)
      ? current.filter((option) => normalizePayerName(option.name) !== key)
      : [...current, profile]);
  };

  const handleDeletePayer = (profile: PayerProfile) => {
    const key = normalizePayerName(profile.name);
    savePayerDirectory(payerOptions.filter((option) => normalizePayerName(option.name) !== key));
    setSelectedPayers((current) => current.filter((option) => normalizePayerName(option.name) !== key));
  };

  const handleDeleteExpense = (item: ExpenseItem) => setExpenseConfirm({ type: 'delete', item });

  const handleClearAll = () => setExpenseConfirm({ type: 'clear' });

  const confirmExpenseAction = () => {
    if (!expenseConfirm) return;
    if (expenseConfirm.type === 'clear') {
      setExpenses((current) => {
        const existingDirectory = current.find((expense) => expense.id === PAYER_DIRECTORY_ID);
        if (existingDirectory) return [existingDirectory];
        const preservedProfiles = getPayerDirectory(current);
        return preservedProfiles.length > 0 ? [createPayerDirectoryRow(preservedProfiles)] : [];
      });
    } else {
      setExpenses((current) => {
        const hasDirectory = current.some((expense) => expense.id === PAYER_DIRECTORY_ID);
        const currentLedger = current.filter((expense) => expense.id !== PAYER_DIRECTORY_ID);
        const preservedProfiles = hasDirectory ? [] : getPayerDirectory(currentLedger);
        const remaining = current.filter((expense) => expense.id !== expenseConfirm.item.id);

        return !hasDirectory && preservedProfiles.length > 0
          ? [createPayerDirectoryRow(preservedProfiles), ...remaining]
          : remaining;
      });
    }
    setExpenseConfirm(null);
  };

  // Calculations
  const totalCNY = ledgerExpenses.reduce((sum, item) => sum + convertToCNY(item.amount, item.currency), 0);

  // Grouped by Category for Stats
  const categoryTotals = ledgerExpenses.reduce((acc, item) => {
    const itemInCNY = convertToCNY(item.amount, item.currency);
    acc[item.category] = (acc[item.category] || 0) + itemInCNY;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className={`p-4 space-y-5 transition-all duration-300 relative ${getCardStyle(theme.id, 'primary')}`}>
      {(expensesError || ratesError) && (
        <p role="alert" className="rounded-lg bg-red-500/10 px-3 py-2 text-[10px] font-bold text-red-500">云端同步异常：{expensesError || ratesError}</p>
      )}
      {/* Header Ledger Dashboard */}
      <div className={`p-4 relative overflow-hidden ${getCardStyle(theme.id, 'subcard')}`}>
        <div className="flex justify-between items-center mb-1">
          <span className={`text-xs uppercase tracking-wider font-extrabold flex items-center gap-1.5 ${isNewspaper ? 'text-[#1B1917] font-serif' : 'opacity-75'}`}>
            <Receipt className="w-3.5 h-3.5" />
            开销汇总 (CNY)
          </span>
          <button 
            onClick={handleClearAll}
            className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer transition-colors ${
              isCyber 
                ? 'bg-[#FF007F]/20 text-[#FF007F] hover:bg-[#FF007F]/30' 
                : isNewspaper
                  ? 'border border-[#1B1917] text-[#1B1917] hover:bg-stone-100 rounded-none'
                  : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
            }`}
          >
            清空账本
          </button>
        </div>
        
        <div className="flex items-baseline gap-2 mt-2">
          <span className={`text-3xl font-black ${isNewspaper ? 'font-serif' : ''}`}>
            ¥ {totalCNY.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
          </span>
          <span className="text-[10px] opacity-60">
            ({ledgerExpenses.length} 笔支出)
          </span>
        </div>

        {/* Editable Exchange Rates */}
        <div className={`mt-3 pt-2 text-[10px] border-t ${isCyber ? 'border-[#00F5FF]/10' : 'border-stone-200/30'}`}>
          <div className="flex items-center gap-1 opacity-75 mb-1">
            <Coins className="w-3 h-3" />
            <span className="font-bold">汇率换算</span>
            <span className="text-[9px] opacity-70">（点击数字可修改；留空恢复默认）</span>
          </div>
          <div className="flex flex-col gap-1.5">
            {(['ISK', 'NOK', 'EUR'] as const).map((curr) => (
              <label key={curr} className="flex items-center gap-1.5">
                <span className="opacity-75 w-14 shrink-0">1 {curr} =</span>
                <input
                  type="number"
                  step="0.001"
                  min="0"
                  defaultValue={rates[curr]}
                  key={rates[curr]}  /* re-mount on rate change so defaultValue refreshes */
                  onBlur={(e) => updateRate(curr, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
                  }}
                  className={`w-20 px-1.5 py-0.5 text-center font-mono text-[10px] rounded border focus:outline-none transition-colors ${
                    isCyber
                      ? 'bg-black/60 border-[#00F5FF]/25 text-white focus:border-[#00F5FF]'
                      : isFrosted
                        ? 'bg-white/10 border-white/15 text-white focus:border-purple-400/50'
                        : isNewspaper
                          ? 'bg-white border-[#1B1917] rounded-none'
                          : 'bg-white dark:bg-stone-800 border-stone-200/60 dark:border-stone-700 focus:border-stone-400'
                  }`}
                />
                <span className="opacity-75">元</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className={`p-3 ${getCardStyle(theme.id, 'subcard')}`}>
        <div className="flex items-center justify-between text-[10px] font-black">
          <span>Excel 计划预算（4 人）</span>
          <span>¥{TRIP_BUDGET.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-[9px] opacity-70">
          {BUDGET_CATEGORIES.map(([name, value]) => <span key={name} className="flex justify-between gap-2"><span>{name}</span><span>¥{value.toLocaleString()}</span></span>)}
          <span className="flex justify-between gap-2 font-bold"><span>人均</span><span>¥26,462.49</span></span>
        </div>
        <p className="mt-2 text-[9px] opacity-55">计划预算与上方实际账单分开统计。</p>
      </div>

      {/* Visual Progress Bar Chart */}
      {expenses.length > 0 && (
        <div className="space-y-2">
          <h5 className={`text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1 ${isNewspaper ? 'text-[#1B1917]' : ''}`}>
            <ArrowUpDown className="w-3 h-3" /> 支出分类占比
          </h5>
          <div className="space-y-1.5">
            {CATEGORIES.map(cat => {
              const total = categoryTotals[cat.name] || 0;
              const percent = totalCNY > 0 ? (total / totalCNY) * 100 : 0;
              if (total === 0) return null;
              return (
                <div key={cat.id} className="text-xs">
                  <div className="flex justify-between text-[10px] opacity-80 mb-0.5">
                    <span>{cat.name}</span>
                    <span className="font-semibold">¥{total.toFixed(0)} ({percent.toFixed(0)}%)</span>
                  </div>
                  <div className="h-1.5 w-full bg-stone-200/40 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${percent}%`,
                        backgroundColor: isCyber ? '#00F5FF' : isFrosted ? '#C084FC' : cat.color 
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add New Transaction Form */}
      <form onSubmit={handleAddExpense} className="space-y-3">
        <h5 className={`text-[10px] font-extrabold uppercase tracking-widest ${isNewspaper ? 'text-[#1B1917]' : ''}`}>
          ✏️ 记一笔账
        </h5>

        <div className="grid grid-cols-2 gap-2">
          {/* Title input */}
          <div className="col-span-2">
            <input 
              type="text" 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="支出名称，如：一号公路加油"
              className={`w-full px-3 py-2 text-xs focus:outline-none transition-all ${getInputStyle(theme.id)}`}
            />
          </div>

          <div className="col-span-2 space-y-1">
            <label className="block px-0.5 text-[9px] font-black opacity-70">支出人</label>
            <PayerCombobox
              selected={selectedPayers}
              options={payerOptions}
              themeId={theme.id}
              onToggle={handleTogglePayer}
              onCreate={handleCreatePayer}
              onDelete={handleDeletePayer}
            />
          </div>

          {/* Amount input */}
          <div>
            <input
              type="text"
              required
              inputMode="decimal"
              pattern="[0-9]*[.]?[0-9]*"
              value={amount}
              onChange={(e) => setAmount(sanitizeAmountInput(e.target.value))}
              placeholder="金额"
              className={`w-full px-3 py-2 text-xs focus:outline-none transition-all ${getInputStyle(theme.id)}`}
            />
          </div>

          {/* Currency dropdown */}
          <div>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as any)}
              className={`w-full px-2.5 py-2 text-xs focus:outline-none cursor-pointer transition-all ${getInputStyle(theme.id)}`}
            >
              <option value="ISK">ISK (冰岛克朗)</option>
              <option value="NOK">NOK (挪威克朗)</option>
              <option value="CNY">CNY (人民币元)</option>
              <option value="EUR">EUR (欧元)</option>
            </select>
          </div>

          {/* Category dropdown */}
          <div className="col-span-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`w-full px-2.5 py-2 text-xs focus:outline-none cursor-pointer transition-all ${getInputStyle(theme.id)}`}
            >
              {CATEGORIES.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <button 
          type="submit"
          className={`w-full py-2 text-xs transition-all flex items-center justify-center gap-1 cursor-pointer ${getPrimaryButtonStyle(theme.id)}`}
        >
          {editingId ? <Pencil className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {editingId ? '保存账单修改' : '记录这笔账'}
        </button>
        {editingId && (
          <button type="button" onClick={cancelEdit} className="flex w-full items-center justify-center gap-1 py-1.5 text-[10px] font-bold opacity-70 hover:opacity-100">
            <X className="h-3 w-3" /> 取消编辑
          </button>
        )}
      </form>

      {/* Transaction list */}
      <div className="space-y-2 max-h-[220px] overflow-y-auto scrollbar-thin pr-1">
        <h5 className={`text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1 ${isNewspaper ? 'text-[#1B1917]' : ''}`}>
          <CreditCard className="w-3 h-3" /> 支出账单流水
        </h5>
        
        {ledgerExpenses.length === 0 ? (
          <p className="text-center text-[11px] opacity-50 py-4">暂无账单流水，在上方添加首笔支出吧</p>
        ) : (
          <div className="space-y-1.5">
            {ledgerExpenses.map((item) => {
              const itemPayers = getExpensePayers(item);
              return (
                <div
                  key={item.id}
                  className={`flex justify-between items-center p-2 text-xs ${getCardStyle(theme.id, 'subcard')}`}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1 pr-2">
                    {itemPayers.length > 0 ? (
                      <div className="flex shrink-0 -space-x-2">
                        {itemPayers.slice(0, 3).map((profile) => (
                          <span key={profile.name} className="shrink-0">
                            <NordicAnimalAvatar avatarId={profile.avatarId} size={34} className="rounded-full ring-2 ring-current/10" />
                          </span>
                        ))}
                        {itemPayers.length > 3 && (
                          <span className="w-[34px] h-[34px] rounded-full bg-stone-500/15 dark:bg-white/15 ring-2 ring-current/10 flex items-center justify-center text-[9px] font-black">
                            +{itemPayers.length - 3}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="w-[34px] h-[34px] rounded-full bg-stone-500/10 dark:bg-white/10 flex items-center justify-center shrink-0">
                        <CircleUserRound className="w-4 h-4 opacity-45" />
                      </div>
                    )}
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] bg-stone-500/10 dark:bg-white/10 px-1 py-0.5 rounded text-stone-500 dark:text-stone-300 font-bold shrink-0">{item.category.split(' ')[1]}</span>
                        <span className="font-bold truncate text-stone-800 dark:text-stone-100">{item.title}</span>
                      </div>
                      <div className="text-[9px] opacity-65 flex items-center gap-1 min-w-0 whitespace-nowrap overflow-hidden">
                        <span className="font-bold truncate max-w-24">{itemPayers.map((profile) => profile.name).join('、') || '未记录支出人'}</span>
                        <span>•</span>
                        <span className="shrink-0">{formatShortDate(item.date)}</span>
                        <span>•</span>
                        <span className="font-medium truncate">{item.amount.toLocaleString()} {item.currency}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-black text-right shrink-0">
                      ¥{convertToCNY(item.amount, item.currency).toFixed(1)}
                    </span>
                    <button
                      aria-label={`编辑支出 ${item.title}`}
                      onClick={() => handleEditExpense(item)}
                      className="p-1 rounded-full text-stone-400 hover:text-sky-500 hover:bg-sky-500/10 transition-colors cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      aria-label={`删除支出 ${item.title}`}
                      onClick={() => handleDeleteExpense(item)}
                      className="p-1 rounded-full text-stone-400 hover:text-red-500 hover:bg-red-500/10 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Apple-style frosted-glass confirm dialog — no backdrop scrim */}
      <AnimatePresence>
        {expenseConfirm && (
          <div className="absolute inset-0 flex items-center justify-center p-4 z-[200] pointer-events-none">
            <motion.div
              initial={{ scale: 1.12, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                default: { type: 'spring', damping: 26, stiffness: 340 },
                exit: { duration: 0.08, ease: 'easeOut' }
              } as any}
              onClick={(e) => e.stopPropagation()}
              className={`pointer-events-auto w-[270px] rounded-2xl overflow-hidden relative flex flex-col shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35),0_8px_20px_-8px_rgba(0,0,0,0.25)] ${
                isCyber
                  ? 'bg-[#0D0E15]/85 backdrop-blur-2xl backdrop-saturate-150 border border-white/10 text-white'
                  : isNewspaper
                    ? 'bg-[#FCFBF7]/95 backdrop-blur-xl border-2 border-[#1B1917] rounded-none text-[#1B1917]'
                    : 'bg-white/75 dark:bg-neutral-900/80 backdrop-blur-2xl backdrop-saturate-150 border border-black/5 dark:border-white/10 text-neutral-900 dark:text-white'
              }`}
            >
              <div className="px-5 pt-4 pb-3.5 text-center">
                <h4 className="text-[15px] font-semibold leading-tight tracking-tight">
                  {expenseConfirm.type === 'clear' ? '清空账本确认' : '删除支出确认'}
                </h4>
                <p className="mt-1.5 text-[13px] leading-snug opacity-70">
                  {expenseConfirm.type === 'clear'
                    ? `将清空全部 ${ledgerExpenses.length} 笔支出记录，此操作无法恢复。`
                    : `确认删除“${expenseConfirm.item.title}”这笔 ${expenseConfirm.item.amount.toLocaleString()} ${expenseConfirm.item.currency} 支出？此操作无法恢复。`}
                </p>
              </div>
              <div className={`flex border-t ${
                isCyber ? 'border-white/10' : isNewspaper ? 'border-[#1B1917]' : 'border-black/10 dark:border-white/10'
              }`}>
                <button
                  onClick={() => setExpenseConfirm(null)}
                  className={`flex-1 py-2.5 text-[15px] font-normal cursor-pointer transition-colors ${
                    isCyber
                      ? 'text-[#00F5FF] hover:bg-white/5'
                      : isNewspaper
                        ? 'text-[#1B1917] hover:bg-stone-100'
                        : 'text-blue-500 hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  取消
                </button>
                <div className={`w-px ${
                  isCyber ? 'bg-white/10' : isNewspaper ? 'bg-[#1B1917]' : 'bg-black/10 dark:bg-white/10'
                }`} />
                <button
                  onClick={confirmExpenseAction}
                  className={`flex-1 py-2.5 text-[15px] font-semibold cursor-pointer transition-colors ${
                    isCyber
                      ? 'text-[#FF007F] hover:bg-[#FF007F]/10'
                      : isNewspaper
                        ? 'text-[#1B1917] font-black hover:bg-stone-100'
                        : 'text-red-500 hover:bg-red-500/5'
                  }`}
                >
                  {expenseConfirm.type === 'clear' ? '清空' : '删除'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
