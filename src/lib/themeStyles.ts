import { ThemeId } from '../types';

export const isDarkTheme = (themeId: ThemeId): boolean => {
  return ['midnight', 'aurora', 'cyber', 'frosted'].includes(themeId);
};

export const getCardStyle = (
  themeId: ThemeId, 
  variant: 'primary' | 'subcard' | 'interactive' = 'primary'
): string => {
  switch (themeId) {
    case 'cyber':
      if (variant === 'subcard') {
        return 'border border-[#00F5FF]/20 bg-black/60 text-[#00F5FF] rounded-lg';
      }
      if (variant === 'interactive') {
        return 'border border-[#00F5FF]/30 bg-black/50 text-[#00F5FF] hover:border-[#00F5FF] hover:bg-black/70 transition-all rounded-xl cursor-pointer';
      }
      return 'border-2 border-[#00F5FF]/30 bg-[#0D0E15]/95 text-[#00F5FF] shadow-[0_0_15px_rgba(0,245,255,0.12)] rounded-xl';

    case 'frosted':
      if (variant === 'subcard') {
        return 'border border-white/10 bg-white/5 text-purple-100 rounded-xl';
      }
      if (variant === 'interactive') {
        return 'border border-white/10 bg-white/5 hover:border-purple-400/40 hover:bg-white/10 text-white transition-all rounded-2xl cursor-pointer';
      }
      return 'border border-white/20 bg-white/10 text-white backdrop-blur-xl shadow-[0_8px_32px_rgba(139,92,246,0.18)] rounded-2xl';

    case 'newspaper':
      if (variant === 'subcard') {
        return 'border border-[#1B1917] bg-[#FAF8F0] text-[#1B1917] rounded-none';
      }
      if (variant === 'interactive') {
        return 'border-2 border-[#1B1917] bg-[#FCFBF7] text-[#1B1917] hover:bg-[#FAF8F0] transition-all rounded-none cursor-pointer';
      }
      return 'border-2 border-[#1B1917] bg-[#FCFBF7] text-[#1B1917] shadow-[3px_3px_0px_#1B1917] rounded-none';

    case 'midnight':
      if (variant === 'subcard') {
        return 'border border-slate-800/80 bg-[#161D2B] text-slate-100 rounded-xl';
      }
      if (variant === 'interactive') {
        return 'border border-slate-800/80 bg-[#151922] hover:border-slate-700 hover:bg-[#1A2232] text-slate-100 transition-all rounded-xl shadow-sm cursor-pointer';
      }
      return 'border border-slate-800/80 bg-[#121622] text-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.4)] rounded-2xl';

    case 'aurora':
      if (variant === 'subcard') {
        return 'border border-emerald-500/15 bg-[#141E30] text-slate-100 rounded-xl';
      }
      if (variant === 'interactive') {
        return 'border border-emerald-500/20 bg-[#12192C]/90 hover:border-emerald-500/40 hover:bg-[#162238] text-slate-100 transition-all rounded-xl shadow-sm cursor-pointer';
      }
      return 'border border-emerald-500/20 bg-[#101726]/95 text-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.5)] rounded-2xl';

    default: // glacial, cozy, glassy, ivory, copenhagen
      if (variant === 'subcard') {
        return 'border border-stone-200/60 bg-stone-50/70 text-stone-800 rounded-xl';
      }
      if (variant === 'interactive') {
        return 'border border-stone-200/70 bg-stone-50/50 hover:bg-white hover:border-stone-300 hover:shadow-md text-stone-900 transition-all rounded-xl shadow-xs cursor-pointer';
      }
      return 'border border-stone-200/70 bg-white text-stone-900 shadow-sm rounded-2xl';
  }
};

export const getInputStyle = (themeId: ThemeId): string => {
  switch (themeId) {
    case 'cyber':
      return 'bg-black/70 border border-[#00F5FF]/40 text-[#00F5FF] placeholder-[#00F5FF]/40 focus:border-[#00F5FF] focus:ring-1 focus:ring-[#00F5FF]/30 rounded-lg';
    case 'frosted':
      return 'bg-white/10 border border-white/20 text-white placeholder-purple-200/50 focus:border-purple-400 focus:bg-white/15 rounded-xl';
    case 'newspaper':
      return 'bg-[#FCFBF7] border-2 border-[#1B1917] text-[#1B1917] placeholder-stone-500 focus:bg-stone-50 rounded-none';
    case 'midnight':
      return 'bg-[#0C0F17] border border-slate-700/80 text-slate-100 placeholder-slate-500 focus:border-sky-400 focus:ring-1 focus:ring-sky-400/20 rounded-xl';
    case 'aurora':
      return 'bg-[#0C121E] border border-emerald-500/30 text-slate-100 placeholder-slate-500 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/20 rounded-xl';
    default:
      return 'bg-stone-50 border border-stone-200 text-stone-900 placeholder-stone-400 focus:bg-white focus:border-stone-400 focus:ring-1 focus:ring-stone-400/20 rounded-xl';
  }
};

export const getTabBarStyle = (themeId: ThemeId): string => {
  switch (themeId) {
    case 'cyber':
      return 'bg-black/80 border border-[#00F5FF]/30 rounded-xl p-1';
    case 'frosted':
      return 'bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-1';
    case 'newspaper':
      return 'bg-[#FCFBF7] border-2 border-[#1B1917] rounded-none p-1';
    case 'midnight':
      return 'bg-[#151A26] border border-slate-800/80 rounded-xl p-1';
    case 'aurora':
      return 'bg-[#101726] border border-emerald-500/20 rounded-xl p-1';
    default:
      return 'bg-stone-100 border border-stone-200/60 rounded-xl p-1';
  }
};

export const getTabItemStyle = (themeId: ThemeId, isActive: boolean): string => {
  if (!isActive) {
    switch (themeId) {
      case 'cyber':
        return 'text-[#00F5FF]/50 hover:text-[#00F5FF] transition-all rounded-lg';
      case 'frosted':
        return 'text-purple-200/60 hover:text-white transition-all rounded-xl';
      case 'newspaper':
        return 'text-[#1B1917]/60 hover:text-[#1B1917] transition-all rounded-none';
      case 'midnight':
      case 'aurora':
        return 'text-slate-400 hover:text-slate-200 transition-all rounded-lg';
      default:
        return 'text-stone-500 hover:text-stone-800 transition-all rounded-lg';
    }
  }

  // Active
  switch (themeId) {
    case 'cyber':
      return 'bg-[#00F5FF]/20 text-[#00F5FF] border border-[#00F5FF]/40 shadow-[0_0_10px_rgba(0,245,255,0.3)] font-bold rounded-lg';
    case 'frosted':
      return 'bg-purple-600/35 text-white border border-purple-400/40 shadow-sm font-bold rounded-xl';
    case 'newspaper':
      return 'bg-[#1B1917] text-white border border-[#1B1917] font-bold rounded-none';
    case 'midnight':
      return 'bg-[#20293A] text-sky-300 border border-sky-500/40 shadow-sm font-black rounded-lg';
    case 'aurora':
      return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm font-black rounded-lg';
    default:
      return 'bg-white text-stone-950 shadow-sm border border-stone-200/60 font-black rounded-lg';
  }
};

export const getPrimaryButtonStyle = (themeId: ThemeId): string => {
  switch (themeId) {
    case 'cyber':
      return 'bg-[#00F5FF]/20 text-[#00F5FF] border border-[#00F5FF]/50 hover:bg-[#00F5FF]/30 shadow-[0_0_12px_rgba(0,245,255,0.25)] rounded-lg font-bold transition-all';
    case 'frosted':
      return 'bg-purple-600/40 text-white border border-purple-400/40 hover:bg-purple-600/50 shadow-md rounded-xl font-bold transition-all';
    case 'newspaper':
      return 'bg-[#1B1917] text-white border-2 border-[#1B1917] hover:bg-stone-900 shadow-[2px_2px_0px_#1B1917] rounded-none font-bold transition-all';
    case 'midnight':
      return 'bg-sky-500 text-slate-950 hover:bg-sky-400 shadow-sm rounded-xl font-black transition-all';
    case 'aurora':
      return 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-sm rounded-xl font-black transition-all';
    default:
      return 'bg-stone-900 text-white hover:bg-stone-800 shadow-sm rounded-xl font-bold transition-all';
  }
};

export const getDropzoneStyle = (themeId: ThemeId, active = false): string => {
  if (active) return 'border-sky-400 bg-sky-500/10 animate-pulse rounded-xl';
  switch (themeId) {
    case 'cyber':
      return 'border-[#00F5FF]/30 bg-black/40 hover:border-[#00F5FF] rounded-xl';
    case 'frosted':
      return 'border-white/10 bg-white/5 hover:border-purple-400/40 rounded-2xl';
    case 'newspaper':
      return 'border-2 border-[#1B1917] bg-[#FCFBF7] rounded-none';
    case 'midnight':
      return 'border-slate-700/80 bg-[#0C0F17] hover:border-sky-500/40 hover:bg-[#151A26] rounded-xl';
    case 'aurora':
      return 'border-emerald-500/25 bg-[#0C121E] hover:border-emerald-400/40 hover:bg-[#12192C] rounded-xl';
    default:
      return 'border-stone-200 bg-stone-50/50 hover:bg-stone-100 rounded-xl';
  }
};

export const getSecondaryButtonStyle = (themeId: ThemeId): string => {
  switch (themeId) {
    case 'cyber':
      return 'bg-[#00F5FF]/15 text-[#00F5FF] border border-[#00F5FF]/30 hover:bg-[#00F5FF]/25 rounded-md font-extrabold transition-all';
    case 'frosted':
      return 'bg-purple-600/20 text-white border border-purple-400/30 hover:bg-purple-600/30 rounded-lg font-extrabold transition-all';
    case 'newspaper':
      return 'bg-[#FCFBF7] text-[#1B1917] border-2 border-[#1B1917] hover:bg-stone-100 rounded-none font-bold transition-all';
    case 'midnight':
      return 'bg-slate-800 text-sky-300 border border-slate-700 hover:bg-slate-700 rounded-lg font-bold transition-all';
    case 'aurora':
      return 'bg-emerald-950/50 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-900/50 rounded-lg font-bold transition-all';
    default:
      return 'bg-stone-900 text-white hover:bg-stone-800 rounded-lg font-bold transition-all shadow-xs';
  }
};
