import { THEME_CONFIGS } from '../data/guideData';
import { ThemeId, ThemeConfig } from '../types';
import { Sparkles, Check, X, Moon, Sun } from 'lucide-react';
import { useState } from 'react';

interface ThemeSelectorProps {
  currentTheme: ThemeId;
  onChangeTheme: (theme: ThemeId) => void;
  onClose?: () => void;
}

export default function ThemeSelector({ currentTheme, onChangeTheme, onClose }: ThemeSelectorProps) {
  const [filterMode, setFilterMode] = useState<'all' | 'dark' | 'light'>('all');

  const getThemeEmoji = (id: ThemeId) => {
    switch (id) {
      case 'midnight': return '🌑 极夜黑曜';
      case 'cozy': return '🪵 壁炉木屋';
      case 'aurora': return '🌌 极光浩瀚';
      case 'cyber': return '⚡ 赛博北欧';
      case 'glacial': return '❄️ 冰川晶莹';
      case 'glassy': return '✨ 莹润微光';
      case 'ivory': return '📜 书卷温润';
      case 'copenhagen': return '🌫️ 北欧冷白';
      case 'newspaper': return '📰 复古纸间';
      case 'frosted': return '💎 磨砂紫幻';
      default: return '🏔️ 探索';
    }
  };

  const isDarkTheme = (id: ThemeId) => ['midnight', 'aurora', 'cyber', 'frosted'].includes(id);

  const filteredThemes = (Object.values(THEME_CONFIGS) as ThemeConfig[]).filter(t => {
    if (filterMode === 'dark') return isDarkTheme(t.id);
    if (filterMode === 'light') return !isDarkTheme(t.id);
    return true;
  });

  return (
    <div className="p-3.5 border-b border-stone-200/50 dark:border-slate-800/80 bg-white/95 dark:bg-[#0C0E14]/95 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300 shadow-md">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold tracking-widest text-stone-500 dark:text-slate-400 uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-500 animate-pulse" />
              NORDIC ROADBOOK · 风格美学实验室
            </span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onChangeTheme('glacial')}
              className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 border transition-all cursor-pointer ${
                currentTheme === 'glacial'
                  ? 'bg-sky-50 text-sky-700 border-sky-300 shadow-xs'
                  : 'bg-stone-50 dark:bg-slate-800 text-stone-600 dark:text-slate-300 border-stone-200 dark:border-slate-700 hover:bg-stone-100'
              }`}
              title="切换为经典冰川明亮主题"
            >
              <Sun className="w-2.5 h-2.5 text-amber-500" />
              明亮
            </button>

            <button
              onClick={() => onChangeTheme('midnight')}
              className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 border transition-all cursor-pointer ${
                currentTheme === 'midnight'
                  ? 'bg-slate-800 text-sky-300 border-sky-400 shadow-xs'
                  : 'bg-stone-50 dark:bg-slate-800 text-stone-600 dark:text-slate-300 border-stone-200 dark:border-slate-700 hover:bg-stone-100'
              }`}
              title="切换为极夜黑曜暗黑主题"
            >
              <Moon className="w-2.5 h-2.5 text-indigo-400" />
              暗黑
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors ml-1"
                title="收起风格面板"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 mb-2">
          {[
            { id: 'all', label: '全部 10 款' },
            { id: 'dark', label: '🌙 暗黑深色系' },
            { id: 'light', label: '☀️ 明亮纯色系' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterMode(tab.id as any)}
              className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
                filterMode === tab.id
                  ? 'bg-stone-900 text-white dark:bg-slate-100 dark:text-slate-950 font-bold'
                  : 'text-stone-400 dark:text-slate-500 hover:text-stone-700 dark:hover:text-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1.5 pt-0.5">
          {filteredThemes.map((theme) => {
            const isActive = currentTheme === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => onChangeTheme(theme.id)}
                className={`px-3 py-1.5 rounded-full shrink-0 text-xs font-semibold transition-all duration-300 flex items-center gap-1.5 border cursor-pointer ${
                  isActive 
                    ? 'bg-stone-900 text-white border-stone-900 dark:bg-slate-100 dark:text-slate-950 dark:border-slate-100 shadow-sm' 
                    : 'bg-stone-50/70 dark:bg-slate-800/60 hover:bg-stone-100/80 dark:hover:bg-slate-700/60 border-stone-200/50 dark:border-slate-700/50 text-stone-600 dark:text-slate-300'
                }`}
              >
                <span>{getThemeEmoji(theme.id)}</span>
                {isActive && <Check className="w-3 h-3 text-white dark:text-slate-950 shrink-0" />}
              </button>
            );
          })}
        </div>
        
        <p className="text-[10px] text-stone-500 dark:text-slate-400 mt-1.5 text-center leading-relaxed">
          当前美学：<span className="font-bold text-stone-800 dark:text-slate-200">{THEME_CONFIGS[currentTheme].chineseName}</span>
          <br />
          <span className="text-stone-400/90 dark:text-slate-400">{THEME_CONFIGS[currentTheme].description}</span>
        </p>
      </div>
    </div>
  );
}
