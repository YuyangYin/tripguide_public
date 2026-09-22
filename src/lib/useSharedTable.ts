import { useCallback, useState } from 'react';

// ---------- localStorage helpers ----------

function readLocal<T>(key: string, fallback: T[]): T[] {
  try {
    const saved = localStorage.getItem(key);
    if (saved !== null) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // 解析失败则回落到默认值，不阻塞界面
  }
  return fallback;
}

function writeLocal<T>(key: string, rows: T[]) {
  try {
    localStorage.setItem(key, JSON.stringify(rows));
  } catch {
    // 配额超限或隐私模式禁用存储时静默忽略
  }
}

/**
 * useSharedTable — 本地优先的列表状态 Hook。
 *
 * 本开源版本已移除 Supabase：所有数据仅存于当前浏览器的 localStorage，
 * 仅本人本机可见、不与任何服务端或其他用户实时同步。Hook 签名与旧版一致，
 * 调用方（票根夹 / 记账本）无需改动。
 *
 * @param _table      逻辑表名（兼容旧调用，本地模式下不再使用）
 * @param fallbackKey localStorage 键名
 * @param defaults    首次无本地数据时使用的默认值
 */
export function useSharedTable<T extends { id: string }>(
  _table: string,
  fallbackKey: string,
  defaults: T[]
): [T[], (next: T[] | ((prev: T[]) => T[])) => void, boolean] {
  const [rows, setRowsRaw] = useState<T[]>(() => readLocal(fallbackKey, defaults));
  // 本地模式下数据同步是同步写入，首屏即已就绪
  const [loaded, setLoaded] = useState(true);

  const setRows = useCallback(
    (next: T[] | ((prev: T[]) => T[])) => {
      setRowsRaw((prev) => {
        const newRows: T[] = typeof next === 'function' ? (next as (p: T[]) => T[])(prev) : next;
        writeLocal(fallbackKey, newRows);
        return newRows;
      });
    },
    [fallbackKey]
  );

  return [rows, setRows, loaded];
}
