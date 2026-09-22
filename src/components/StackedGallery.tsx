import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

interface StackedGalleryProps {
  images: string[];
  title: string;
}

const SPRING = { type: 'spring' as const, stiffness: 380, damping: 32, mass: 0.85 };
const TAP_MOVE = 22;
const TAP_MS = 500;
const SWIPE_X = 42;

function wrapOffset(i: number, index: number, n: number) {
  let d = i - index;
  if (d > n / 2) d -= n;
  if (d < -n / 2) d += n;
  return d;
}

export default function StackedGallery({ images, title }: StackedGalleryProps) {
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [nudge, setNudge] = useState(0);
  const pointer = useRef<{ id: number; x: number; y: number; t: number } | null>(null);

  useEffect(() => {
    setIndex(0);
    setExpanded(false);
    setNudge(0);
    pointer.current = null;
  }, [images]);

  const n = images.length;
  if (n === 0) return null;

  const go = (dir: number) => setIndex((i) => (i + dir + n) % n);

  const endPointer = (clientX: number, clientY: number) => {
    const start = pointer.current;
    pointer.current = null;
    setNudge(0);
    if (!start) return;

    const dx = clientX - start.x;
    const dy = clientY - start.y;
    const dt = Date.now() - start.t;
    const dist = Math.hypot(dx, dy);

    if (n > 1 && Math.abs(dx) >= SWIPE_X && Math.abs(dx) > Math.abs(dy) * 1.15) {
      go(dx < 0 ? 1 : -1);
      return;
    }

    if (dist <= TAP_MOVE && dt <= TAP_MS) {
      setExpanded((open) => !open);
    }
  };

  return (
    <div className="relative z-0 isolate select-none">
      <motion.div
        className="relative z-0 overflow-visible"
        animate={{ height: expanded ? 380 : 280 }}
        transition={SPRING}
      >
        {images.map((src, i) => {
          const d = wrapOffset(i, index, n);
          const abs = Math.abs(d);
          if (abs > 2) return null;

          const isFront = d === 0;
          const fanX = expanded ? d * 18 : d * 56;
          const rotate = expanded ? d * 2 : d * 16;
          const scale = isFront ? 1 : expanded ? 0.74 : 0.9;
          const y = isFront ? 0 : 14;

          return (
            <div
              key={src}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{ zIndex: isFront ? 3 : 3 - abs }}
            >
              <motion.button
                type="button"
                onPointerDown={(e) => {
                  if (!isFront || e.button !== 0) return;
                  e.stopPropagation();
                  pointer.current = { id: e.pointerId, x: e.clientX, y: e.clientY, t: Date.now() };
                  setNudge(0);
                  try {
                    e.currentTarget.setPointerCapture(e.pointerId);
                  } catch {
                    /* untrusted / already released */
                  }
                }}
                onPointerMove={(e) => {
                  if (!isFront || pointer.current?.id !== e.pointerId) return;
                  const dx = e.clientX - pointer.current.x;
                  const dy = e.clientY - pointer.current.y;
                  if (n > 1 && Math.abs(dx) > 8 && Math.abs(dx) >= Math.abs(dy)) {
                    setNudge(dx);
                  }
                }}
                onPointerUp={(e) => {
                  if (!isFront || !pointer.current || pointer.current.id !== e.pointerId) return;
                  e.stopPropagation();
                  try {
                    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
                      e.currentTarget.releasePointerCapture(e.pointerId);
                    }
                  } catch {
                    /* already released */
                  }
                  endPointer(e.clientX, e.clientY);
                }}
                onPointerCancel={(e) => {
                  if (pointer.current?.id !== e.pointerId) return;
                  pointer.current = null;
                  setNudge(0);
                }}
                className="border-0 bg-transparent p-0 cursor-pointer pointer-events-auto touch-manipulation"
                style={{ touchAction: 'none' }}
                data-gallery-card={isFront ? 'front' : 'back'}
                aria-label={isFront ? (expanded ? '收起图片' : '预览图片') : undefined}
                initial={false}
                animate={{
                  x: fanX + (isFront ? nudge * 0.35 : 0),
                  y,
                  rotate,
                  scale,
                  opacity: abs > 1 ? 0.45 : 1,
                }}
                transition={nudge !== 0 && isFront ? { duration: 0 } : SPRING}
              >
                <motion.div
                  className="bg-[#F6F1E8] rounded-[3px] p-[7px] pb-7"
                  animate={{
                    width: isFront && expanded ? 252 : 152,
                    boxShadow: isFront
                      ? expanded
                        ? '0 28px 56px rgba(0,0,0,0.38), 0 8px 16px rgba(0,0,0,0.16)'
                        : '0 12px 26px rgba(0,0,0,0.24), 0 2px 6px rgba(0,0,0,0.1)'
                      : '0 6px 16px rgba(0,0,0,0.16)',
                  }}
                  transition={SPRING}
                >
                  <motion.img
                    src={src}
                    alt={title}
                    draggable={false}
                    className="block w-full object-cover rounded-[2px] bg-stone-200 pointer-events-none"
                    animate={{ height: isFront && expanded ? 292 : 172 }}
                    transition={SPRING}
                  />
                </motion.div>
              </motion.button>
            </div>
          );
        })}
      </motion.div>

      {n > 1 ? (
        <div className="flex justify-center gap-1.5 -mt-1">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              aria-label={`第 ${i + 1} 张`}
              onClick={(e) => {
                e.stopPropagation();
                setIndex(i);
              }}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? 'w-4 bg-stone-500 dark:bg-slate-300' : 'w-1.5 bg-stone-300 dark:bg-slate-600'
              }`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
