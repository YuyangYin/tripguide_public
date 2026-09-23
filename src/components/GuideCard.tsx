import React from 'react';
import { motion } from 'motion/react';
import { GuideItem, ThemeConfig } from '../types';
import * as Icons from 'lucide-react';
import { Camera, Sparkles, HelpCircle } from 'lucide-react';
import TornEdge from './TornEdge';
import WikiImage from './WikiImage';

interface GuideCardProps {
  key?: React.Key | string | number;
  item: GuideItem;
  theme: ThemeConfig;
  onSelect: (item: GuideItem) => void;
}

export default function GuideCard({ item, theme, onSelect }: GuideCardProps) {
  const countryLabel: Record<string, string> = {
    spain: '🇪🇸 西班牙', switzerland: '🇨🇭 瑞士', netherlands: '🇳🇱 荷兰', norway: '🇳🇴 挪威', sweden: '🇸🇪 瑞典', iceland: '🇮🇸 冰岛', both: '🌐 通用',
  };
  // Dynamically map icon name to Lucide components
  const getIcon = (name: string) => {
    const named: Record<string, React.ComponentType<{ className?: string }>> = {
      Camera,
      Sparkles,
      HelpCircle,
    };
    try {
      const IconComp = named[name] || (Icons as Record<string, unknown>)[name];
      if (typeof IconComp === 'function' || (typeof IconComp === 'object' && IconComp)) {
        const Comp = IconComp as React.ComponentType<{ className?: string }>;
        return <Comp className="w-5 h-5 shrink-0" />;
      }
    } catch {
      // fall through
    }
    return <HelpCircle className="w-5 h-5 shrink-0" />;
  };

  const isCozy = theme.id === 'cozy';
  const isAurora = theme.id === 'aurora';
  const isCyber = theme.id === 'cyber';
  const isGlacial = theme.id === 'glacial';
  const isNewspaper = theme.id === 'newspaper';
  const isFrosted = theme.id === 'frosted';
  const isMidnight = theme.id === 'midnight';

  // Customize card animations based on theme characteristics
  const cardAnimation = isCyber 
    ? {
        hover: { scale: 1.03, borderColor: '#FF007F', boxShadow: '0 0 15px rgba(255,0,127,0.5)' },
        tap: { scale: 0.97 }
      }
    : isFrosted
      ? {
          hover: { y: -4, scale: 1.015, borderColor: 'rgba(168, 85, 247, 0.4)', backgroundColor: 'rgba(255, 255, 255, 0.12)', boxShadow: '0 12px 30px rgba(139,92,246,0.25)' },
          tap: { scale: 0.985 }
        }
      : isMidnight
        ? {
            hover: { y: -3, scale: 1.01, borderColor: 'rgba(56, 189, 248, 0.4)', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.7)' },
            tap: { scale: 0.985 }
          }
      : isGlacial
        ? {
            hover: { y: -4, scale: 1.01, backgroundColor: 'rgba(255, 255, 255, 0.7)', boxShadow: '0 12px 36px rgba(31,38,135,0.08)' },
            tap: { scale: 0.99 }
          }
      : isAurora
        ? {
            hover: { scale: 1.02, borderColor: '#10B981', boxShadow: '0 10px 25px -5px rgba(16,185,129,0.2)' },
            tap: { scale: 0.98 }
          }
        : isNewspaper
          ? {
              hover: { 
                scale: 1.015, 
                rotateX: 1.5, 
                rotateY: -1.5, 
                boxShadow: '5px 5px 0px rgba(27,25,23,1)',
                y: -2
              },
              tap: { 
                scale: 0.985,
                boxShadow: '1px 1px 0px rgba(27,25,23,1)',
                y: 1
              }
            }
          : {
              hover: { scale: 1.01, borderColor: '#b59a7c', boxShadow: '0 8px 16px -4px rgba(192,86,33,0.08)' },
              tap: { scale: 0.99 }
            };

  return (
    <motion.button
      onClick={() => onSelect(item)}
      whileHover={cardAnimation.hover}
      whileTap={cardAnimation.tap}
      className={`relative z-10 w-full text-left p-4 cursor-pointer select-none transition-all duration-300 flex ${
        item.coverImage || item.wikiTitle ? 'flex-row items-stretch gap-2 overflow-visible min-[390px]:gap-3' : 'flex-col justify-between'
      } ${theme.cardBgClass} ${
        isNewspaper 
          ? 'rounded-none border-l-2 border-r-2 border-[#1B1917] pt-6 pb-6' 
          : theme.borderRadius
      }`}
      style={{
        contentVisibility: 'auto'
      }}
    >
      {isNewspaper && <TornEdge position="top" bgColor="#F4ECE1" cardColor="#FCFBF7" />}
      {isNewspaper && <TornEdge position="bottom" bgColor="#F4ECE1" cardColor="#FCFBF7" />}
      <div className={`space-y-2 ${item.coverImage || item.wikiTitle ? 'flex-1 min-w-0' : 'w-full'}`}>
        {/* Row 1: icon + title inline */}
        <div className="flex items-center gap-2.5 w-full">
          <div className={`p-2 shrink-0 ${isNewspaper ? 'rounded-none' : 'rounded-lg'} ${
            isCyber
              ? 'bg-[#FF007F]/10 text-[#FF007F] border border-[#FF007F]/30'
              : isFrosted
                ? 'bg-purple-500/20 text-purple-200 border border-purple-400/20'
                : isMidnight
                  ? 'bg-sky-950/60 text-sky-400 border border-sky-500/30'
                : isGlacial
                  ? 'bg-blue-100/60 text-[#0077B6]'
                  : isAurora
                    ? 'bg-emerald-950/40 text-emerald-300'
                    : isNewspaper
                      ? 'bg-stone-50 text-stone-900 border-2 border-[#1B1917]'
                      : 'bg-[#FEEBC8] text-[#C05621]'
          }`}>
            {getIcon(item.iconName)}
          </div>

          <h4 className={`flex-1 min-w-0 text-sm leading-snug ${theme.textPrimaryClass} ${theme.fontHeading}`}>
            {item.title}
          </h4>
        </div>

        {/* Row 2: short description */}
        <p className={`text-xs line-clamp-2 leading-relaxed ${theme.textSecondaryClass}`}>
          {item.shortDesc}
        </p>

      {/* Footer tags: [country] [urgency? if high] [tag1] [tag2] ... */}
      <div className="flex flex-wrap gap-1 mt-3 pt-2.5 border-t border-dashed border-stone-200/50 dark:border-stone-800/30">
        {/* Leading country flag pill */}
        <span className={`text-[10px] font-bold px-2 py-0.5 ${isNewspaper ? 'rounded-none border border-[#1B1917]' : 'rounded-md'} ${
          isCyber
            ? 'bg-stone-900 border border-[#00F5FF]/30 text-[#00F5FF]'
            : isFrosted
              ? 'bg-white/10 border border-white/15 text-purple-100'
              : isMidnight
                ? 'bg-slate-800/80 border border-slate-700/60 text-slate-300'
              : isNewspaper
                ? 'bg-[#FCFBF7] text-[#1B1917] font-serif'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
        }`}>
          {countryLabel[item.country] || '🌐 通用'}
        </span>

        {/* Item tags */}
        {(item.tags || []).map((tag, tIdx) => (
          <span
            key={tIdx}
            className={`text-[10px] font-medium px-1.5 py-0.5 ${isNewspaper ? 'rounded-none' : 'rounded-md'} ${
              isCyber
                ? 'bg-stone-900 border border-[#00F5FF]/30 text-[#00F5FF]'
                : isFrosted
                  ? 'bg-purple-950/40 border border-purple-500/20 text-purple-200'
                  : isMidnight
                    ? 'bg-slate-800/80 border border-slate-700/60 text-slate-300'
                  : isGlacial
                    ? 'bg-blue-50/70 border border-blue-200/40 text-[#1F4E79]'
                    : isAurora
                      ? 'bg-stone-800 text-stone-300'
                      : isNewspaper
                        ? 'bg-[#FCFBF7] border border-[#1B1917] text-[#1B1917] font-serif'
                        : 'bg-[#F2EDE2] text-[#3D3025]'
            }`}
          >
            #{tag}
          </span>
        ))}
      </div>
      </div>
      {item.coverImage || item.wikiTitle ? (
        <div className="w-[3.65rem] shrink-0 self-center overflow-visible pr-0.5 min-[390px]:w-[4.7rem] sm:w-[5.4rem]">
          {item.wikiTitle ? <WikiImage title={item.wikiTitle} alt={item.title} className="h-[4.2rem] w-[3.3rem] rotate-[7deg] object-cover rounded-lg border border-white/30 shadow-[3px_8px_16px_rgba(0,0,0,0.32)] min-[390px]:h-[5.15rem] min-[390px]:w-[4.1rem] sm:h-[5.75rem] sm:w-[4.6rem] sm:rotate-[8deg]" /> : <img src={item.coverImage} alt="" className="h-[4.2rem] w-[3.3rem] rotate-[7deg] object-cover rounded-lg border border-white/30 shadow-[3px_8px_16px_rgba(0,0,0,0.32)] min-[390px]:h-[5.15rem] min-[390px]:w-[4.1rem] sm:h-[5.75rem] sm:w-[4.6rem] sm:rotate-[8deg]" />}
        </div>
      ) : null}
    </motion.button>
  );
}
