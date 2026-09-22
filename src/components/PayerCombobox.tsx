import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Check, ChevronsUpDown, Sparkles, Trash2, X } from 'lucide-react';
import { ThemeId } from '../types';
import { normalizePayerName, PayerProfile } from '../lib/expenseAttribution';
import { getInputStyle } from '../lib/themeStyles';
import { NordicAnimalAvatar } from './NordicAnimalAvatar';

interface PayerComboboxProps {
  selected: PayerProfile[];
  options: PayerProfile[];
  themeId: ThemeId;
  onToggle: (profile: PayerProfile) => void;
  onCreate: (name: string) => void;
  onDelete: (profile: PayerProfile) => void;
}

export function PayerCombobox({ selected, options, themeId, onToggle, onCreate, onDelete }: PayerComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const selectedKeys = useMemo(
    () => new Set(selected.map((profile) => normalizePayerName(profile.name))),
    [selected]
  );
  const filtered = useMemo(() => {
    const normalizedQuery = normalizePayerName(query);
    if (!normalizedQuery) return options;
    return options.filter((option) => normalizePayerName(option.name).includes(normalizedQuery));
  }, [query, options]);

  const commitQuery = () => {
    const name = query.trim().replace(/\s+/g, ' ');
    if (!name) return;
    onCreate(name);
    setQuery('');
  };

  useEffect(() => {
    const handleOutside = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setPendingDelete(null);
      }
    };
    const handleFocusOutside = (event: FocusEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setPendingDelete(null);
      }
    };
    document.addEventListener('pointerdown', handleOutside);
    document.addEventListener('focusin', handleFocusOutside);
    return () => {
      document.removeEventListener('pointerdown', handleOutside);
      document.removeEventListener('focusin', handleFocusOutside);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative min-w-0">
      <div className={`min-w-0 overflow-hidden ${getInputStyle(themeId)}`}>
        {selected.length > 0 && (
          <div className="flex flex-wrap gap-1.5 px-2.5 pt-2">
            {selected.map((profile) => (
              <span key={profile.name} className="inline-flex min-w-0 items-center gap-1 rounded-full bg-current/10 py-0.5 pl-1 pr-1.5">
                <NordicAnimalAvatar avatarId={profile.avatarId} size={22} />
                <span className="max-w-24 truncate text-[10px] font-bold">{profile.name}</span>
                <button
                  type="button"
                  aria-label={`取消选择 ${profile.name}`}
                  onClick={() => onToggle(profile)}
                  className="rounded-full p-0.5 opacity-55 hover:bg-current/10 hover:opacity-100 cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="relative flex items-center">
          <Sparkles className="absolute left-3 h-3.5 w-3.5 opacity-55 pointer-events-none" />
          <input
            type="text"
            role="combobox"
            aria-label="新建支出人"
            aria-expanded={open}
            aria-controls={listId}
            aria-autocomplete="list"
            autoComplete="off"
            value={query}
            onFocus={() => setOpen(true)}
            onBlur={() => {
              commitQuery();
            }}
            onChange={(event) => {
              setQuery(event.target.value);
              setOpen(true);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                commitQuery();
              }
              if (event.key === 'Escape') {
                setQuery('');
                setOpen(false);
              }
              if (event.key === 'ArrowDown') setOpen(true);
            }}
            placeholder={selected.length > 0 ? '继续输入新支出人' : '输入新支出人'}
            className="w-full min-w-0 bg-transparent py-2 pl-9 pr-10 text-xs outline-none"
          />
          <button
            type="button"
            aria-label="切换支出人列表"
            onClick={() => setOpen((current) => !current)}
            className="absolute right-0 inset-y-0 w-9 flex items-center justify-center cursor-pointer opacity-60 hover:opacity-100"
          >
            <ChevronsUpDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {open && (
        <div
          id={listId}
          role="listbox"
          aria-multiselectable="true"
          className={`absolute z-40 mt-1.5 w-full max-h-60 overflow-y-auto p-1.5 shadow-xl ${getInputStyle(themeId)}`}
        >
          {filtered.map((option) => {
            const active = selectedKeys.has(normalizePayerName(option.name));
            const confirmingDelete = pendingDelete === normalizePayerName(option.name);

            return (
              <div key={option.name} className="rounded-lg hover:bg-current/10">
                <div className="flex items-center gap-2 px-2 py-1.5">
                  <label className="flex min-w-0 flex-1 items-center gap-2 cursor-pointer">
                    <span className={`h-4 w-4 shrink-0 rounded border flex items-center justify-center ${active ? 'bg-current text-white border-current' : 'border-current/35'}`}>
                      {active && <Check className="h-3 w-3" />}
                    </span>
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={() => onToggle(option)}
                      className="sr-only"
                    />
                    <NordicAnimalAvatar avatarId={option.avatarId} size={30} />
                    <span className="min-w-0 flex-1 truncate text-xs font-bold">{option.name}</span>
                  </label>
                  <button
                    type="button"
                    aria-label={`删除支出人 ${option.name}`}
                    onClick={() => setPendingDelete(normalizePayerName(option.name))}
                    className="p-1.5 shrink-0 rounded-full opacity-40 hover:opacity-100 hover:text-red-500 hover:bg-red-500/10 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                {confirmingDelete && (
                  <div className="mx-2 mb-2 flex items-center justify-between gap-2 rounded-lg bg-red-500/10 px-2 py-1.5 text-[10px]">
                    <span className="min-w-0 truncate">确认删除 {option.name}？</span>
                    <div className="flex shrink-0 gap-1">
                      <button
                        type="button"
                        onClick={() => setPendingDelete(null)}
                        className="px-2 py-1 rounded-md bg-current/10 cursor-pointer"
                      >
                        取消
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onDelete(option);
                          setPendingDelete(null);
                        }}
                        className="px-2 py-1 rounded-md bg-red-500 text-white font-bold cursor-pointer"
                      >
                        删除
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {query.trim() && filtered.length === 0 && (
            <p className="px-2 py-3 text-center text-[10px] opacity-55">移开焦点后新建“{query.trim()}”</p>
          )}

          {!query.trim() && options.length === 0 && (
            <p className="px-2 py-3 text-center text-[10px] opacity-55">暂无支出人</p>
          )}
        </div>
      )}
    </div>
  );
}
