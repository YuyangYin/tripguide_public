import * as XLSX from '@e965/xlsx';
import { getRepayableMemberIds, normalizeExpense, type SettlementPayment, type SharedExpense, type SupportedCurrency } from './expenseSettlement';

const CURRENCY_LABELS: Record<SharedExpense['currency'], string> = {
  CNY: '人民币', HKD: '港币', NOK: '挪威克朗', EUR: '欧元', CHF: '瑞士法郎', SEK: '瑞典克朗', ISK: '冰岛克朗',
};

const currencyRate = (currency: SharedExpense['currency'], rates: Record<SupportedCurrency, number>) => currency === 'ISK' ? 0.051 : rates[currency];

export function expenseSettlementLabel(expense: SharedExpense) {
  const normalized = normalizeExpense(expense);
  const repayable = getRepayableMemberIds(normalized);
  const settledMembers = normalized.settledMemberIds || [];
  if (normalized.settled) return '全部已结算';
  if (settledMembers.length > 0) return `部分结算 ${settledMembers.length}/${repayable.length}`;
  return '未结算';
}

export function createExpenseWorkbook(
  expenses: SharedExpense[],
  payments: SettlementPayment[],
  rates: Record<SupportedCurrency, number>,
) {
  const expenseRows = expenses.map((rawExpense) => {
    const expense = normalizeExpense(rawExpense);
    const rate = currencyRate(expense.currency, rates);
    return {
      账单ID: expense.id,
      支出名称: expense.title,
      原始金额: expense.amount,
      币种代码: expense.currency,
      币种: CURRENCY_LABELS[expense.currency],
      兑人民币汇率: rate,
      折合人民币: Math.round(expense.amount * rate * 100) / 100,
      分类: expense.category,
      记录日期: expense.date,
      支出人: expense.payerId || '',
      分账人: (expense.splitMemberIds || []).join(','),
      已结算成员: (expense.settledMemberIds || []).join(','),
      结算状态: expenseSettlementLabel(expense),
    };
  });
  const paymentRows = payments.map((payment) => ({
    结算ID: payment.id,
    付款人: payment.from,
    收款人: payment.to,
    金额人民币: payment.amount,
    结算日期: payment.date,
    记录时间: payment.createdAt || '',
  }));
  const rateRows = (Object.keys(rates) as SupportedCurrency[]).map((currency) => ({
    币种代码: currency,
    币种: CURRENCY_LABELS[currency],
    '1单位兑人民币': rates[currency],
  }));

  const workbook = XLSX.utils.book_new();
  const expenseSheet = XLSX.utils.json_to_sheet(expenseRows);
  const paymentSheet = XLSX.utils.json_to_sheet(paymentRows);
  const rateSheet = XLSX.utils.json_to_sheet(rateRows);
  expenseSheet['!cols'] = [
    { wch: 38 }, { wch: 24 }, { wch: 12 }, { wch: 10 }, { wch: 12 }, { wch: 15 }, { wch: 14 },
    { wch: 12 }, { wch: 13 }, { wch: 10 }, { wch: 24 }, { wch: 24 }, { wch: 16 },
  ];
  paymentSheet['!cols'] = [{ wch: 38 }, { wch: 10 }, { wch: 10 }, { wch: 14 }, { wch: 13 }, { wch: 24 }];
  rateSheet['!cols'] = [{ wch: 12 }, { wch: 14 }, { wch: 18 }];
  if (expenseRows.length > 0) expenseSheet['!autofilter'] = { ref: expenseSheet['!ref']! };
  if (paymentRows.length > 0) paymentSheet['!autofilter'] = { ref: paymentSheet['!ref']! };
  XLSX.utils.book_append_sheet(workbook, expenseSheet, '账单流水');
  XLSX.utils.book_append_sheet(workbook, paymentSheet, '成员结算流水');
  XLSX.utils.book_append_sheet(workbook, rateSheet, '共享汇率');
  workbook.Props = { Title: '欧洲五国同行账单', Subject: '共享账单、成员结算和汇率', Author: 'Travel Guidance' };
  return workbook;
}

export function downloadExpenseWorkbook(
  expenses: SharedExpense[],
  payments: SettlementPayment[],
  rates: Record<SupportedCurrency, number>,
  date: string,
) {
  const workbook = createExpenseWorkbook(expenses, payments, rates);
  XLSX.writeFileXLSX(workbook, `欧洲五国同行账单_${date}.xlsx`, { compression: true });
}
