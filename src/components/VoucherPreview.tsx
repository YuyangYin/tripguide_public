import { useEffect, useRef, type PointerEvent } from 'react';
import { motion } from 'motion/react';
import { ThemeConfig } from '../types';
import { Calendar, ChevronLeft, ChevronRight, FileText, Tag, X } from 'lucide-react';

interface VoucherPreviewProps {
  item: any;
  list: any[];
  theme: ThemeConfig;
  onChange: (item: any) => void;
  onClose: () => void;
}

export default function VoucherPreview({ item, list, theme, onChange, onClose }: VoucherPreviewProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const index = Math.max(0, list.findIndex((v) => v.id === item.id));
  const hasPrev = index > 0;
  const hasNext = index < list.length - 1;

  const isCyber = theme.id === 'cyber';
  const isFrosted = theme.id === 'frosted';
  const isNewspaper = theme.id === 'newspaper';
  const isMidnight = theme.id === 'midnight';

  // Open on the tapped ticket. Only depend on the scroller mounting, not on later swipe updates.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.clientWidth, behavior: 'instant' as ScrollBehavior });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goTo = (nextIndex: number) => {
    const el = scrollerRef.current;
    if (!el || nextIndex < 0 || nextIndex >= list.length) return;
    el.scrollTo({ left: nextIndex * el.clientWidth, behavior: 'smooth' });
    onChange(list[nextIndex]);
  };

  const handleScroll = () => {
    const el = scrollerRef.current;
    if (!el || el.clientWidth === 0) return;
    const nextIndex = Math.round(el.scrollLeft / el.clientWidth);
    const nextItem = list[nextIndex];
    if (nextItem && nextItem.id !== item.id) onChange(nextItem);
  };

  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const didSwipe = useRef(false);

  const onSwipeStart = (e: PointerEvent) => {
    swipeStart.current = { x: e.clientX, y: e.clientY };
    didSwipe.current = false;
  };

  const onSwipeEnd = (e: PointerEvent) => {
    if (!swipeStart.current) return;
    const dx = e.clientX - swipeStart.current.x;
    const dy = e.clientY - swipeStart.current.y;
    swipeStart.current = null;
    if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
    didSwipe.current = true;
    if (dx < 0) goTo(index + 1);
    else goTo(index - 1);
  };

  const handleBackdropClick = () => {
    if (didSwipe.current) {
      didSwipe.current = false;
      return;
    }
    onClose();
  };

  return (
    <div className="absolute inset-0 z-[150] flex flex-col overflow-hidden bg-black/60 backdrop-blur-[2px]">
      {hasPrev && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 z-[160]">
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              goTo(index - 1);
            }}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.82 }}
            className={`p-3 rounded-full backdrop-blur-xl border flex items-center justify-center cursor-pointer shadow-lg ${
              isCyber
                ? 'bg-black/60 border-[#00F5FF]/40 text-[#00F5FF] shadow-[0_0_12px_rgba(0,245,255,0.25)]'
                : 'bg-white/10 border-white/15 text-white'
            }`}
            title="上一张票根"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
        </div>
      )}

      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        onPointerDown={onSwipeStart}
        onPointerUp={onSwipeEnd}
        onPointerCancel={() => { swipeStart.current = null; }}
        className="scrollbar-none flex-1 w-full flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory overscroll-x-contain"
        style={{
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {list.map((voucher) => (
          <div
            key={voucher.id}
            className="h-full snap-center flex items-center justify-center p-2 sm:p-4"
            style={{ flex: '0 0 100%', width: '100%' }}
            onClick={handleBackdropClick}
          >
            <VoucherCard
              voucher={voucher}
              theme={theme}
              onClose={onClose}
            />
          </div>
        ))}
      </div>

      {hasNext && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 z-[160]">
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              goTo(index + 1);
            }}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.82 }}
            className={`p-3 rounded-full backdrop-blur-xl border flex items-center justify-center cursor-pointer shadow-lg ${
              isCyber
                ? 'bg-black/60 border-[#00F5FF]/40 text-[#00F5FF] shadow-[0_0_12px_rgba(0,245,255,0.25)]'
                : 'bg-white/10 border-white/15 text-white'
            }`}
            title="下一张票根"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      )}

      <div
        className={`pointer-events-none pb-3 text-center text-[9px] font-bold tracking-wider ${
          isCyber
            ? 'text-[#00F5FF]/50'
            : isFrosted
              ? 'text-purple-200/50'
              : isNewspaper
                ? 'text-[#1B1917]/60'
                : isMidnight
                  ? 'text-slate-400/70'
                  : 'text-stone-500/70 dark:text-stone-400/60'
        }`}
      >
        {list.length > 1 ? `${index + 1} / ${list.length}  ·  左右滑动切换票根` : '点击空白处关闭'}
      </div>
    </div>
  );
}

function VoucherCard({
  voucher,
  theme,
  onClose
}: {
  voucher: any;
  theme: ThemeConfig;
  onClose: () => void;
}) {
  const isCyber = theme.id === 'cyber';
  const isNewspaper = theme.id === 'newspaper';
  const isMidnight = theme.id === 'midnight';

  return (
    <motion.div
      onClick={(e) => e.stopPropagation()}
      initial={{ scale: 0.96, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`w-full max-w-[560px] rounded-3xl overflow-hidden relative flex flex-col border max-h-[92%] ${
        isCyber
          ? 'bg-[#0D0E15] border-[#00F5FF]/50 shadow-[0_40px_90px_-15px_rgba(0,245,255,0.35),0_18px_36px_-12px_rgba(0,0,0,0.55)]'
          : isNewspaper
            ? 'bg-[#FCFBF7] border-4 border-[#1B1917] rounded-none shadow-[6px_6px_0_rgba(27,25,23,0.9),0_40px_80px_-18px_rgba(27,25,23,0.35)]'
            : isMidnight
              ? 'bg-[#121622] border-slate-700/80 shadow-[0_44px_100px_-18px_rgba(0,0,0,0.75),0_20px_40px_-14px_rgba(0,0,0,0.45)]'
            : 'bg-stone-900 border-white/10 shadow-[0_44px_100px_-18px_rgba(15,23,42,0.55),0_20px_40px_-14px_rgba(15,23,42,0.35)]'
      }`}
    >
      <div className={`p-3.5 sm:px-5 sm:py-4 border-b flex justify-between items-center ${isCyber ? 'border-[#00F5FF]/20' : 'border-white/10'}`}>
        <div className="flex items-center gap-1.5 min-w-0 pr-2">
          <Tag className={`w-4 h-4 shrink-0 ${isCyber ? 'text-[#00F5FF]' : 'text-purple-400'}`} />
          <h3 className={`text-xs sm:text-sm font-black truncate ${isNewspaper ? 'text-[#1B1917]' : 'text-white/90'}`} title={voucher.title}>
            {voucher.title}
          </h3>
        </div>
        <motion.button
          onClick={onClose}
          whileHover={{ scale: 1.15, rotate: 90 }}
          whileTap={{ scale: 0.8 }}
          className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </motion.button>
      </div>

      <div className="p-3 sm:p-5 flex-1 min-h-0 overflow-y-auto">
        <div className={`p-3 sm:p-5 bg-white text-black rounded-2xl relative space-y-3 sm:space-y-4 shadow-inner ${isNewspaper ? 'rounded-none border-2 border-[#1B1917]' : ''}`}>
          <div className="absolute top-1/2 -left-3 w-6 h-6 rounded-full bg-[#141414]" />
          <div className="absolute top-1/2 -right-3 w-6 h-6 rounded-full bg-[#141414]" />

          <div className="text-[10px] border-b border-dashed border-stone-300 pb-3">
            <span className="text-[8px] font-black text-stone-400 block uppercase">{voucher.useDate || voucher.useTime ? 'USE DATE' : 'UPLOAD DATE'}</span>
            <span className="font-extrabold text-stone-800 flex items-center gap-1 mt-0.5">
              <Calendar className="w-3 h-3 text-stone-500" />
              {voucher.useDate || voucher.useTime
                ? [voucher.useDate, (voucher.useTime || '').slice(0, 5)].filter(Boolean).join(' ')
                : (voucher.uploadDate || '—')}
            </span>
          </div>

          <div className="pt-1">
            <span className="text-[8px] font-black text-stone-400 block uppercase mb-1.5">IMAGE / DOC SOURCE</span>
            {voucher.fileData ? (
              !voucher.fileType?.startsWith('image/') ? (
                <iframe
                  src={voucher.fileData}
                  title={voucher.title}
                  className="w-full h-[clamp(260px,52vh,520px)] rounded-xl border border-stone-200 shadow-sm"
                />
              ) : (
                <div className="relative h-[clamp(260px,52vh,520px)] w-full rounded-xl overflow-hidden border border-stone-200 bg-stone-50 flex items-center justify-center shadow-sm pointer-events-none">
                  <img
                    referrerPolicy="no-referrer"
                    src={voucher.fileData}
                    alt={voucher.title}
                    className="w-full h-full object-contain"
                  />
                </div>
              )
            ) : (
              <div className="min-h-64 p-5 bg-stone-50 border border-stone-200 rounded-xl text-center space-y-2 shadow-sm flex flex-col items-center justify-center">
                <FileText className="w-10 h-10 text-stone-400" />
                <p className="text-[10px] font-bold text-stone-700 truncate">{voucher.fileName}</p>
                <p className="text-[8px] text-stone-400 leading-normal">PDF 电子票证已安全缓存在北欧离线沙盒</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={`p-3.5 border-t text-center shrink-0 ${isCyber ? 'border-[#00F5FF]/20' : 'border-white/10'}`}>
        <motion.button
          onClick={onClose}
          whileHover={{ scale: 1.025 }}
          whileTap={{ scale: 0.94 }}
          className={`w-full py-2 text-xs font-black rounded-xl cursor-pointer shadow-sm transition-all ${
            isCyber
              ? 'bg-[#FF007F]/20 text-[#FF007F] border border-[#FF007F]/40 hover:bg-[#FF007F]/30'
              : isNewspaper
                ? 'bg-[#1B1917] text-white rounded-none hover:opacity-90'
                : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          返回票根列表
        </motion.button>
      </div>
    </motion.div>
  );
}
