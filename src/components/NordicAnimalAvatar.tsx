import { NORDIC_ANIMAL_AVATARS } from '../data/nordicAnimalAvatars';

const STROKE = '#403A36';

interface NordicAnimalAvatarProps {
  avatarId?: number;
  size?: number;
  className?: string;
}

export function NordicAnimalAvatar({ avatarId = 0, size = 32, className = '' }: NordicAnimalAvatarProps) {
  const normalizedId = Number.isInteger(avatarId)
    ? ((avatarId % NORDIC_ANIMAL_AVATARS.length) + NORDIC_ANIMAL_AVATARS.length) % NORDIC_ANIMAL_AVATARS.length
    : 0;
  const animal = NORDIC_ANIMAL_AVATARS[normalizedId];
  const common = { fill: animal.fur, stroke: STROKE, strokeWidth: 2.2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  const line = { fill: 'none', stroke: STROKE, strokeWidth: 2.2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

  const face = (() => {
    switch (animal.kind) {
      case 'bear':
        return <><circle cx="22" cy="21" r="7" {...common}/><circle cx="42" cy="21" r="7" {...common}/><circle cx="32" cy="34" r="18" {...common}/><ellipse cx="32" cy="40" rx="8" ry="6" fill={animal.accent} stroke={STROKE} strokeWidth="2.2"/><circle cx="26" cy="33" r="1.7" fill={STROKE}/><circle cx="38" cy="33" r="1.7" fill={STROKE}/><path d="M29 39q3 3 6 0M32 40v4" {...line}/></>;
      case 'fox':
        return <><path d="M15 18l13 7L19 8zM49 18l-13 7L45 8z" {...common}/><path d="M16 25q16-13 32 0l-6 23-10 7-10-7z" {...common}/><path d="M20 26l12 26 12-26-12 10z" fill={animal.accent} opacity=".55"/><circle cx="25" cy="34" r="1.6" fill={STROKE}/><circle cx="39" cy="34" r="1.6" fill={STROKE}/><path d="M29 43l3 2 3-2M32 45v3" {...line}/></>;
      case 'reindeer':
        return <><path d="M22 22l-8-8m4 4-6 1m6-1 1-7M42 22l8-8m-4 4 6 1m-6-1-1-7" {...line}/><path d="M20 22l-6 6 9 1M44 22l6 6-9 1" {...common}/><ellipse cx="32" cy="36" rx="15" ry="18" {...common}/><circle cx="26" cy="34" r="1.7" fill={STROKE}/><circle cx="38" cy="34" r="1.7" fill={STROKE}/><ellipse cx="32" cy="44" rx="5" ry="4" fill={animal.accent} stroke={STROKE} strokeWidth="2.2"/></>;
      case 'puffin':
        return <><ellipse cx="32" cy="35" rx="17" ry="20" {...common}/><ellipse cx="32" cy="37" rx="11" ry="15" fill="#FFFDF7"/><circle cx="27" cy="30" r="1.8" fill="#FFF"/><circle cx="37" cy="30" r="1.8" fill="#FFF"/><path d="M25 36l7-5 8 5-8 7z" fill={animal.accent} stroke={STROKE} strokeWidth="2.2"/><path d="M32 32v10" {...line}/></>;
      case 'seal':
        return <><ellipse cx="32" cy="36" rx="18" ry="17" {...common}/><circle cx="26" cy="33" r="1.7" fill={STROKE}/><circle cx="38" cy="33" r="1.7" fill={STROKE}/><ellipse cx="32" cy="39" rx="4" ry="3" fill={animal.accent} stroke={STROKE} strokeWidth="2"/><path d="M20 39l8 2m-9 3 9-1m16-4-8 2m9 3-9-1M30 43q2 3 4 0" {...line}/><path d="M20 51l-7 5m31-5 7 5" {...line}/></>;
      case 'whale':
        return <><path d="M13 38q3-18 22-18 13 0 17 9 2 5-2 11-5 8-18 8H18q-7 0-5-10z" {...common}/><path d="M48 24q7-8 10-3-1 6-8 8M48 24q-1-10-6-10-4 6 2 12" {...common}/><circle cx="25" cy="32" r="1.8" fill={STROKE}/><path d="M18 38q5 4 10 0M35 22q0-8 5-10m-7 10q-4-7-8-5" {...line}/></>;
      case 'owl':
        return <><path d="M18 20l8 4 6-8 6 8 8-4 2 17q0 17-16 19-16-2-16-19z" {...common}/><circle cx="25" cy="34" r="7" fill="#FFF" stroke={STROKE} strokeWidth="2"/><circle cx="39" cy="34" r="7" fill="#FFF" stroke={STROKE} strokeWidth="2"/><circle cx="25" cy="34" r="2" fill={STROKE}/><circle cx="39" cy="34" r="2" fill={STROKE}/><path d="M28 42l4-4 4 4-4 4z" fill={animal.accent} stroke={STROKE} strokeWidth="1.8"/></>;
      case 'hare':
        return <><ellipse cx="24" cy="17" rx="6" ry="14" transform="rotate(-8 24 17)" {...common}/><ellipse cx="40" cy="17" rx="6" ry="14" transform="rotate(8 40 17)" {...common}/><ellipse cx="24" cy="17" rx="2" ry="9" fill={animal.accent}/><ellipse cx="40" cy="17" rx="2" ry="9" fill={animal.accent}/><circle cx="32" cy="39" r="17" {...common}/><circle cx="26" cy="36" r="1.7" fill={STROKE}/><circle cx="38" cy="36" r="1.7" fill={STROKE}/><path d="M29 43l3 2 3-2m-3 2v5m-5-2h10" {...line}/></>;
      case 'moose':
        return <><path d="M21 24L13 9m5 7-7-2m7 2 1-8m24 16L51 9m-5 7 7-2m-7 2-1-8" {...line}/><path d="M21 24l-8 5 10 2m18-7 8 5-10 2" {...common}/><ellipse cx="32" cy="37" rx="14" ry="19" {...common}/><ellipse cx="32" cy="45" rx="8" ry="7" fill={animal.accent} stroke={STROKE} strokeWidth="2.2"/><circle cx="27" cy="34" r="1.7" fill={STROKE}/><circle cx="37" cy="34" r="1.7" fill={STROKE}/></>;
      case 'otter':
        return <><circle cx="20" cy="24" r="7" {...common}/><circle cx="44" cy="24" r="7" {...common}/><ellipse cx="32" cy="37" rx="17" ry="19" {...common}/><ellipse cx="32" cy="42" rx="8" ry="7" fill={animal.accent}/><circle cx="26" cy="35" r="1.7" fill={STROKE}/><circle cx="38" cy="35" r="1.7" fill={STROKE}/><path d="M29 40l3 2 3-2m-3 2v4m-13-5 9 1m17-1-9 1" {...line}/></>;
      case 'lynx':
        return <><path d="M17 25l3-15 9 11m18 4-3-15-9 11M20 10l-2-5m26 5 2-5" {...common}/><path d="M18 28q14-14 28 0l-4 21-10 6-10-6z" {...common}/><circle cx="26" cy="34" r="1.8" fill={STROKE}/><circle cx="38" cy="34" r="1.8" fill={STROKE}/><path d="M26 44q6-4 12 0M29 41l3 2 3-2" {...line}/><path d="M20 31l6 2m18-2-6 2" stroke={animal.accent} strokeWidth="2.5" strokeLinecap="round"/></>;
      case 'wolf':
        return <><path d="M16 27l5-18 11 13L43 9l5 18-5 21-11 8-11-8z" {...common}/><path d="M20 26l12 28 12-28-12 12z" fill={animal.accent} opacity=".5"/><circle cx="25" cy="34" r="1.8" fill={STROKE}/><circle cx="39" cy="34" r="1.8" fill={STROKE}/><path d="M28 44l4 3 4-3" {...line}/></>;
      case 'sheep':
        return <><circle cx="20" cy="26" r="9" {...common}/><circle cx="28" cy="21" r="10" {...common}/><circle cx="38" cy="21" r="10" {...common}/><circle cx="46" cy="27" r="9" {...common}/><ellipse cx="32" cy="39" rx="14" ry="17" fill={animal.accent} stroke={STROKE} strokeWidth="2.2"/><circle cx="27" cy="36" r="1.7" fill={STROKE}/><circle cx="37" cy="36" r="1.7" fill={STROKE}/><path d="M29 44q3 3 6 0" {...line}/></>;
      case 'goat':
        return <><path d="M23 24q-10-12-4-18 9 3 10 15m12 3q10-12 4-18-9 3-10 15" {...common}/><path d="M19 26l-7 3 9 4m24-7 7 3-9 4" {...common}/><ellipse cx="32" cy="37" rx="14" ry="18" {...common}/><circle cx="27" cy="34" r="1.7" fill={STROKE}/><circle cx="37" cy="34" r="1.7" fill={STROKE}/><path d="M29 43l3 2 3-2m-3 2v9l-5-6m5 6 5-6" {...line}/></>;
      case 'swan':
        return <><path d="M40 15q-12-5-16 5-3 8 7 12-13 3-14 14-1 8 13 9h22q-5-8-15-10 10-15 3-30z" {...common}/><path d="M39 18l12 4-10 5" fill={animal.accent} stroke={STROKE} strokeWidth="2.2"/><circle cx="36" cy="19" r="1.5" fill={STROKE}/><path d="M23 45q10-8 22 0" {...line}/></>;
      case 'walrus':
        return <><circle cx="32" cy="36" r="19" {...common}/><circle cx="25" cy="32" r="1.7" fill={STROKE}/><circle cx="39" cy="32" r="1.7" fill={STROKE}/><ellipse cx="32" cy="39" rx="9" ry="7" fill={animal.accent} stroke={STROKE} strokeWidth="2"/><path d="M27 43l-3 12 6-8m7-4 3 12-6-8M17 40l10 1m20-1-10 1M18 45l9-2m19 2-9-2" {...line}/></>;
      case 'narwhal':
        return <><path d="M14 39q2-17 20-18 16-1 19 12 3 14-17 16H20q-8 0-6-10z" {...common}/><path d="M38 22L49 6l-5 19" fill={animal.accent} stroke={STROKE} strokeWidth="2.2"/><path d="M43 14l4 2m-6 2 4 2" {...line}/><circle cx="26" cy="34" r="1.8" fill={STROKE}/><path d="M20 40q5 4 10 0M50 29q7-5 9 0-3 6-8 6" {...line}/></>;
      case 'squirrel':
        return <><path d="M44 48q13 3 12-13-1-15-13-11 10 5 5 15-3 6-10 6" {...common}/><path d="M19 28l3-13 9 9 10-9 4 14-4 20-10 6-10-6z" {...common}/><circle cx="26" cy="34" r="1.7" fill={STROKE}/><circle cx="38" cy="34" r="1.7" fill={STROKE}/><path d="M28 42l4 3 4-3" {...line}/><path d="M22 17l5 7m14-7-5 7" stroke={animal.accent} strokeWidth="3" strokeLinecap="round"/></>;
      case 'hedgehog':
        return <><path d="M12 39l5-5-3-7 7-1 2-7 7 4 6-6 4 7 8-2 1 8 7 3-5 7 3 7-8 1-4 7-7-4-7 4-3-7-8-2z" fill={animal.fur} stroke={STROKE} strokeWidth="2.2" strokeLinejoin="round"/><ellipse cx="34" cy="39" rx="14" ry="13" fill={animal.accent} stroke={STROKE} strokeWidth="2"/><circle cx="32" cy="36" r="1.7" fill={STROKE}/><circle cx="44" cy="40" r="2.5" fill={STROKE}/><path d="M35 45q4 2 6-1" {...line}/></>;
      case 'muskox':
        return <><path d="M18 25q-9-12-2-17 8 2 13 13m17 4q9-12 2-17-8 2-13 13" {...common}/><path d="M17 24q15-13 30 0l-2 23-13 10-13-10z" {...common}/><path d="M22 25q10 7 20 0M22 31v18m7-18v24m7-24v24m7-24v18" stroke={animal.accent} strokeWidth="3" strokeLinecap="round"/><circle cx="27" cy="34" r="1.7" fill={STROKE}/><circle cx="37" cy="34" r="1.7" fill={STROKE}/><path d="M29 43q3 3 6 0" {...line}/></>;
    }
  })();

  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      role="img"
      aria-label={animal.name}
      className={`shrink-0 ${className}`}
    >
      <circle cx="32" cy="32" r="31" fill={animal.bg} />
      {face}
    </svg>
  );
}
