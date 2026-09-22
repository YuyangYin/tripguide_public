import { useCallback, useEffect, useRef, useState } from 'react';
import { SHARED_TRIP_ID, supabase } from './supabase';

function readLocal<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    return saved === null ? fallback : JSON.parse(saved) as T;
  } catch {
    return fallback;
  }
}

function writeLocal<T>(key: string, value: T) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* cloud remains primary */ }
}

export function useSharedTable<T extends { id: string }>(
  tableName: string,
  fallbackKey: string,
  defaults: T[],
): [T[], (next: T[] | ((prev: T[]) => T[])) => void, boolean, string | null] {
  const [rows, setRowsRaw] = useState<T[]>(() => readLocal(fallbackKey, defaults));
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const rowsRef = useRef(rows);

  const applyRows = useCallback((next: T[]) => {
    rowsRef.current = next;
    setRowsRaw(next);
    writeLocal(fallbackKey, next);
  }, [fallbackKey]);

  useEffect(() => {
    let active = true;
    let channel: ReturnType<typeof supabase.channel> | null = null;
    const load = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;
      if (!user || !active) return;
      const { data, error: loadError } = await supabase.from('shared_rows').select('id,data')
        .eq('trip_id', SHARED_TRIP_ID).eq('table_name', tableName).order('updated_at', { ascending: false });
      if (!active) return;
      if (loadError) setError(loadError.message);
      else {
        const cloudRows = (data || []).map((entry) => ({ ...(entry.data as object), id: entry.id })) as T[];
        if (cloudRows.length > 0) applyRows(cloudRows);
        else if (rowsRef.current.length > 0) {
          const { error: seedError } = await supabase.from('shared_rows').upsert(rowsRef.current.map((row) => ({
            trip_id: SHARED_TRIP_ID, table_name: tableName, id: row.id, data: row,
            updated_by: user.id, updated_at: new Date().toISOString(),
          })));
          if (seedError) setError(seedError.message);
        }
      }
      setLoaded(true);
      channel = supabase.channel(`shared_rows:${tableName}`).on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'shared_rows', filter: `trip_id=eq.${SHARED_TRIP_ID}` },
        (payload) => {
          const nextRecord = payload.new as { table_name?: string; id?: string; data?: object };
          const oldRecord = payload.old as { table_name?: string; id?: string };
          const changed = payload.eventType === 'DELETE' ? oldRecord : nextRecord;
          if (changed.table_name !== tableName || !changed.id) return;
          const current = rowsRef.current;
          applyRows(payload.eventType === 'DELETE'
            ? current.filter((row) => row.id !== changed.id)
            : [{ ...(nextRecord.data || {}), id: changed.id } as T, ...current.filter((row) => row.id !== changed.id)]);
        },
      ).subscribe();
    };
    load();
    return () => { active = false; if (channel) supabase.removeChannel(channel); };
  }, [applyRows, tableName]);

  const setRows = useCallback((next: T[] | ((prev: T[]) => T[])) => {
    const previous = rowsRef.current;
    const nextRows = typeof next === 'function' ? (next as (prev: T[]) => T[])(previous) : next;
    const previousById = new Map(previous.map((row) => [row.id, row]));
    const changedRows = nextRows.filter((row) => JSON.stringify(previousById.get(row.id)) !== JSON.stringify(row));
    applyRows(nextRows);
    void (async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;
      if (!user) return;
      const nextIds = new Set(nextRows.map((row) => row.id));
      const deletedIds = previous.filter((row) => !nextIds.has(row.id)).map((row) => row.id);
      if (deletedIds.length > 0) {
        const { error: deleteError } = await supabase.from('shared_rows').delete()
          .eq('trip_id', SHARED_TRIP_ID).eq('table_name', tableName).in('id', deletedIds);
        if (deleteError) setError(deleteError.message);
      }
      if (changedRows.length > 0) {
        const { error: upsertError } = await supabase.from('shared_rows').upsert(changedRows.map((row) => ({
          trip_id: SHARED_TRIP_ID, table_name: tableName, id: row.id, data: row,
          updated_by: user.id, updated_at: new Date().toISOString(),
        })));
        if (upsertError) setError(upsertError.message);
      }
    })();
  }, [applyRows, tableName]);

  return [rows, setRows, loaded, error];
}

export function useSharedValue<T>(
  key: string,
  fallbackKey: string,
  defaultValue: T,
): [T, (next: T | ((prev: T) => T)) => void, boolean, string | null] {
  const [value, setValueRaw] = useState<T>(() => readLocal(fallbackKey, defaultValue));
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const valueRef = useRef(value);

  const applyValue = useCallback((next: T) => {
    valueRef.current = next;
    setValueRaw(next);
    writeLocal(fallbackKey, next);
  }, [fallbackKey]);

  useEffect(() => {
    let active = true;
    let channel: ReturnType<typeof supabase.channel> | null = null;
    const load = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;
      if (!user || !active) return;
      const { data, error: loadError } = await supabase.from('shared_settings').select('value')
        .eq('trip_id', SHARED_TRIP_ID).eq('key', key).maybeSingle();
      if (!active) return;
      if (loadError) setError(loadError.message);
      else if (data) applyValue(data.value as T);
      else {
        const { error: seedError } = await supabase.from('shared_settings').upsert({
          trip_id: SHARED_TRIP_ID, key, value: valueRef.current,
          updated_by: user.id, updated_at: new Date().toISOString(),
        });
        if (seedError) setError(seedError.message);
      }
      setLoaded(true);
      channel = supabase.channel(`shared_settings:${key}`).on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'shared_settings', filter: `trip_id=eq.${SHARED_TRIP_ID}` },
        (payload) => {
          const record = payload.new as { key?: string; value?: T };
          if (record.key === key && record.value !== undefined) applyValue(record.value);
        },
      ).subscribe();
    };
    load();
    return () => { active = false; if (channel) supabase.removeChannel(channel); };
  }, [applyValue, key]);

  const setValue = useCallback((next: T | ((prev: T) => T)) => {
    const nextValue = typeof next === 'function' ? (next as (prev: T) => T)(valueRef.current) : next;
    applyValue(nextValue);
    void (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session?.user) return;
      const { error: saveError } = await supabase.from('shared_settings').upsert({
        trip_id: SHARED_TRIP_ID, key, value: nextValue,
        updated_by: data.session.user.id, updated_at: new Date().toISOString(),
      });
      if (saveError) setError(saveError.message);
    })();
  }, [applyValue, key]);

  return [value, setValue, loaded, error];
}
