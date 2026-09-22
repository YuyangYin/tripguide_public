import React, { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
}

interface CopyButtonProps {
  textToCopy: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
  copiedClassName?: string;
  onCopy?: () => void;
  iconSize?: number;
  variant?: 'stone' | 'sky' | 'rose' | 'cyber';
  showToastOnCopy?: boolean;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  textToCopy,
  label = '复制',
  copiedLabel = '已复制',
  className = '',
  copiedClassName = '',
  onCopy,
  iconSize = 12,
  variant = 'stone',
}) => {
  const [copied, setCopied] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  // Check user preference for reduced motion
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    // Copy to clipboard
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    
    if (onCopy) {
      onCopy();
    }

    // Spawn 8-14 particles if motion is not reduced
    if (!prefersReducedMotion) {
      const numParticles = 8 + Math.floor(Math.random() * 6); // 8 to 13 particles
      const newParticles: Particle[] = [];
      
      // Determine color palette based on variant
      const colors = {
        stone: ['#a8a29e', '#78716c', '#57534e', '#38bdf8', '#34d399'],
        sky: ['#38bdf8', '#0ea5e9', '#0284c7', '#7dd3fc', '#a7f3d0'],
        rose: ['#fb7185', '#f43f5e', '#e11d48', '#fda4af', '#fcd34d'],
        cyber: ['#00F5FF', '#00FF66', '#FF007F', '#9D00FF', '#00E5FF'],
      }[variant];

      for (let i = 0; i < numParticles; i++) {
        // Distribute angles evenly with a small random jitter to cover full circular eruption
        const angle = (i * (360 / numParticles) + Math.random() * 20) * (Math.PI / 180);
        const distance = 25 + Math.random() * 35; // 25px to 60px expansion radius
        
        newParticles.push({
          id: Math.random() + i,
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
          size: 3 + Math.random() * 4, // 3px to 7px particle diameter
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
      
      setParticles(newParticles);
      
      // Auto-clear particles after animation completes
      setTimeout(() => {
        setParticles([]);
      }, 750);
    }

    // Reset copied status after 2 seconds
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  // Base style configurations based on variants
  const defaultColors = {
    stone: 'bg-stone-200/50 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-300/50 border border-stone-200/5 dark:border-stone-800/10',
    sky: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 hover:bg-sky-500/20 border border-sky-500/10',
    rose: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 border border-rose-500/10',
    cyber: 'bg-black/40 text-[#00F5FF] border border-[#00F5FF]/20 hover:border-[#00F5FF]/40',
  }[variant];

  const copiedColors = {
    stone: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
    sky: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
    rose: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
    cyber: 'bg-[#00FF66]/15 text-[#00FF66] border border-[#00FF66]/30',
  }[variant];

  const activeClass = copied 
    ? (copiedClassName || copiedColors) 
    : (className || defaultColors);

  return (
    <div className="relative inline-block overflow-visible">
      <motion.button
        type="button"
        onClick={handleCopy}
        whileTap={prefersReducedMotion ? {} : { scale: 0.94 }}
        className={`px-2 py-0.5 rounded text-[9px] font-bold transition-colors flex items-center gap-1 cursor-pointer select-none ${activeClass}`}
      >
        {copied ? (
          <>
            <Check className="shrink-0" style={{ width: iconSize, height: iconSize }} />
            <span>{copiedLabel}</span>
          </>
        ) : (
          <>
            <Copy className="shrink-0" style={{ width: iconSize, height: iconSize }} />
            <span>{label}</span>
          </>
        )}
      </motion.button>

      {/* Particle eruption container */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.span
            key={particle.id}
            initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
            animate={{ 
              x: particle.x, 
              y: particle.y, 
              scale: [1, 1.2, 0], 
              opacity: [1, 0.9, 0] 
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 0.55, 
              ease: [0.1, 0.8, 0.25, 1.0] // smooth ease-out curve 
            }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-full z-[100]"
            style={{
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
