import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CopyButton } from './CopyButton';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Car, 
  Hotel, 
  Coffee, 
  Utensils,
  ShoppingBag,
  Plus,
  Info, 
  Navigation, 
  CheckCircle, 
  Circle, 
  Compass, 
  ArrowRight,
  Check,
  ExternalLink,
  Pencil,
  Save,
  X
} from 'lucide-react';
import { ThemeConfig } from '../types';
import { useSharedTable, useSharedValue } from '../lib/useSharedTable';
import { enrichItineraryDay, ITINERARY_2026 } from '../data/itinerary2026';
import { getTripSpot, TripSpot } from '../data/tripSpots';
import TripSpotModal from './TripSpotModal';
import ScreenshotPlaceImporter from './ScreenshotPlaceImporter';
import type { TravelScreenshotResult } from '../lib/parseTravelScreenshot';

interface ItineraryTimelineProps {
  theme: ThemeConfig;
}

export interface ItineraryDay {
  id: string;
  dayNum: number;
  date: string;
  route: string;
  region: 'finland' | 'iceland' | 'spain' | 'switzerland' | 'netherlands' | 'norway' | 'lofoten' | 'sweden' | 'home';
  regionLabel: string;
  regionEmoji: string;
  sights: string[];
  schedule: string;
  transport: string;
  drivingEstimate: string;
  hotel: string;
  breakfast: string;
  dining?: string[];
  shopping?: string[];
  alternativeSights?: string[];
  tips: string;
  highlights: string;
}

// 示例行程：冰岛 + 罗弗敦（挪威）12 天，香港往返。
// 仅作为开源项目的演示数据；「今日 / 已完成」高亮依赖下方 ITINERARY_YEAR，按需调整。
// 用户可在「票根夹 / 记账 / 行程」中替换为自己的真实安排。
const ITINERARY_YEAR = 2026;

const mergeUnique = (current: string[] | undefined, incoming: string[]) => [
  ...new Set([...(current || []), ...incoming].map((item) => item.trim()).filter(Boolean)),
];

const ITINERARY_DATA: ItineraryDay[] = [
  {
    id: 'day-1',
    dayNum: 1,
    date: '10/3',
    route: '香港 ✈ 雷克雅未克（冰岛）',
    region: 'iceland',
    regionLabel: '冰岛',
    regionEmoji: '🇮🇸',
    sights: ['国际航班飞抵凯夫拉维克', '蓝湖温泉初体验'],
    schedule: 'HKG 夜间起飞，经中转抵达 KEF；取车后前往蓝湖度假区',
    transport: 'KEF 机场取车（豪华四驱 SUV）',
    drivingEstimate: 'KEF → 蓝湖 / 雷克雅未克 约 50 km，1 小时',
    hotel: 'The Retreat at Blue Lagoon（蓝湖奢华度假酒店）',
    breakfast: '机上 / 酒店',
    tips: '落地先泡蓝湖缓解长途疲劳；冰岛秋季风大，备好防风外套与泳衣。',
    highlights: '落地冰岛 & 蓝湖暖汤'
  },
  {
    id: 'day-2',
    dayNum: 2,
    date: '10/4',
    route: '雷克雅未克 + 黄金圈',
    region: 'iceland',
    regionLabel: '冰岛',
    regionEmoji: '🇮🇸',
    sights: ['雷克雅未克老港', 'Þingvellir 辛格维利尔国家公园', 'Geysir 间歇泉'],
    schedule: '上午市区漫步，下午黄金圈：辛格维利尔 → 盖歇尔间歇泉 → 黄金瀑布',
    transport: '自驾（豪华四驱 SUV）',
    drivingEstimate: '环线约 200 km，纯驾 3-4 小时',
    hotel: 'Canopy by Hilton Reykjavík City Centre（五星设计酒店）',
    breakfast: '含早餐',
    tips: '黄金圈逆时针走最顺；间歇泉每几分钟喷发一次，站在上风口拍摄。',
    highlights: '板块裂缝 & 黄金飞瀑'
  },
  {
    id: 'day-3',
    dayNum: 3,
    date: '10/5',
    route: '南岸瀑布与黑沙滩',
    region: 'iceland',
    regionLabel: '冰岛',
    regionEmoji: '🇮🇸',
    sights: ['Seljalandsfoss 塞里雅兰瀑布', 'Skógafoss 斯科加瀑布', 'Reynisfjara 黑沙滩'],
    schedule: '沿南岸一号公路东行：瀑布群 + 维克镇黑沙滩',
    transport: '自驾',
    drivingEstimate: '单程约 180 km，3.5 小时',
    hotel: 'Hotel Rangá（兰加河精品酒店，极光观测顶级）',
    breakfast: '含早餐',
    tips: '黑沙滩疯狗浪致命，严守警戒线、切勿背对大海；塞里雅兰可从水帘后穿行。',
    highlights: '水帘洞 & 黑沙惊涛'
  },
  {
    id: 'day-4',
    dayNum: 4,
    date: '10/6',
    route: '冰河湖与钻石沙滩',
    region: 'iceland',
    regionLabel: '冰岛',
    regionEmoji: '🇮🇸',
    sights: ['Jökulsárlón 杰古沙龙冰河湖', 'Diamond Beach 钻石沙滩', 'Skaftafell 冰川徒步'],
    schedule: '向东深入瓦特纳冰川：冰河湖游船 + 钻石沙滩',
    transport: '自驾',
    drivingEstimate: '往返约 260 km，4-5 小时',
    hotel: 'Fosshotel Glacier Lagoon（冰川泻湖畔设计酒店）',
    breakfast: '含早餐',
    tips: '冰河湖可报 amphibian 船游；钻石沙滩冰块蓝白相间，清晨光线最好。',
    highlights: '漂浮蓝冰 & 钻石海岸'
  },
  {
    id: 'day-5',
    dayNum: 5,
    date: '10/7',
    route: '斯奈山半岛',
    region: 'iceland',
    regionLabel: '冰岛',
    regionEmoji: '🇮🇸',
    sights: ['Kirkjufell 草帽山', 'Snæfellsjökull 斯奈菲尔火山', 'Arnarstapi 海蚀拱'],
    schedule: '折返西部，斯奈山半岛一日：草帽山 + 火山口徒步',
    transport: '自驾',
    drivingEstimate: '约 300 km，4.5 小时',
    hotel: 'Hotel Búðir（布迪尔精品酒店，婚纱照圣地）',
    breakfast: '含早餐',
    tips: '草帽山倒影机位在路边小河；半岛天气多变，随身带雨具。',
    highlights: '草帽山倒影 & 火山秘境'
  },
  {
    id: 'day-6',
    dayNum: 6,
    date: '10/8',
    route: '雷克雅未克 → 飞挪威罗弗敦',
    region: 'norway',
    regionLabel: '挪威罗弗敦',
    regionEmoji: '🇳🇴',
    sights: ['凯夫拉维克还车', '奥斯陆中转', 'Evenes 机场提车'],
    schedule: '上午还车飞奥斯陆，转机至 Evenes；驱车进入罗弗敦群岛',
    transport: 'KEF 还车；OSL 中转；EVE 提车',
    drivingEstimate: 'EVE → Svolvær 约 180 km，2.5-3.5 小时',
    hotel: 'Svinøya Rorbuer（斯沃尔韦尔海景红渔屋，高端 rorbu）',
    breakfast: '机上 / 含早',
    tips: '挪威段走 E10，单向桥多需让行；抵达早可在港口追极光。',
    highlights: '飞越北海 ➔ 驶入罗弗敦'
  },
  {
    id: 'day-7',
    dayNum: 7,
    date: '10/9',
    route: '斯沃尔韦尔 + 亨宁斯韦尔',
    region: 'norway',
    regionLabel: '挪威罗弗敦',
    regionEmoji: '🇳🇴',
    sights: ['Henningsvær 亨宁斯韦尔足球场', 'Svolvær 渔港漫步', 'Lofoten War Museum'],
    schedule: '上午亨宁斯韦尔传奇渔村足球场，下午回港散步',
    transport: '自驾',
    drivingEstimate: '短途约 70 km，1.5 小时',
    hotel: 'Svinøya Rorbuer',
    breakfast: '含早餐',
    tips: '亨宁斯韦尔足球场建在礁石上，被称为世界最美球场之一。',
    highlights: '世界最美足球场'
  },
  {
    id: 'day-8',
    dayNum: 8,
    date: '10/10',
    route: '雷讷 · Hamnøy · Å',
    region: 'norway',
    regionLabel: '挪威罗弗敦',
    regionEmoji: '🇳🇴',
    sights: ['Reine 雷讷明信片湾', 'Hamnøy 经典红渔屋', 'Å 奥镇最西渔村'],
    schedule: '沿 E10 纵贯罗弗敦，抵达雷讷；途经哈姆尼與奥镇',
    transport: '自驾',
    drivingEstimate: '约 90 km，2 小时（单向桥慢行）',
    hotel: 'Eliassen Rorbuer（雷讷湾畔高档红渔屋）',
    breakfast: '渔屋自炊',
    tips: '雷讷是罗弗敦名片；Å 镇有挪威渔村博物馆，尽头可看海。',
    highlights: '明信片红屋 & 峡湾尽头'
  },
  {
    id: 'day-9',
    dayNum: 9,
    date: '10/11',
    route: '雷讷布林根徒步',
    region: 'norway',
    regionLabel: '挪威罗弗敦',
    regionEmoji: '🇳🇴',
    sights: ['Reinebringen 雷讷布林根登山', '峡湾海钓体验', 'Kjerkfjorden 峡湾'],
    schedule: '清晨登雷讷布林根俯瞰雷讷全景；下午峡湾海钓',
    transport: '徒步 + 自驾',
    drivingEstimate: '登山步道约 2 km 陡坡，1.5 小时',
    hotel: 'Eliassen Rorbuer',
    breakfast: '渔屋自炊',
    tips: '雷讷布林根台阶已修缮，但仍陡；山顶俯瞰雷讷是最好的机位。',
    highlights: '俯瞰雷讷 & 峡湾海钓'
  },
  {
    id: 'day-10',
    dayNum: 10,
    date: '10/12',
    route: '罗弗敦活动日',
    region: 'norway',
    regionLabel: '挪威罗弗敦',
    regionEmoji: '🇳🇴',
    sights: ['Sea Kayak 峡湾皮划艇', 'Henningsvær 攀岩', 'Lofotr 维京博物馆'],
    schedule: '上午峡湾皮划艇，下午维京博物馆或小镇咖啡',
    transport: '自驾 + 水上活动',
    drivingEstimate: '短途移动',
    hotel: 'Henningsvær Bryggehotell（亨宁斯韦尔海港精品酒店）',
    breakfast: '含早餐',
    tips: '秋季海水冷，皮划艇穿防水保暖；维京博物馆可试穿铠甲。',
    highlights: '峡湾划行 & 维京回响'
  },
  {
    id: 'day-11',
    dayNum: 11,
    date: '10/13',
    route: '罗弗敦 → 飞香港',
    region: 'norway',
    regionLabel: '挪威罗弗敦',
    regionEmoji: '🇳🇴',
    sights: ['Evenes 还车', '奥斯陆中转', '长途返程'],
    schedule: '上午还车飞奥斯陆，转机返回香港（跨夜航班）',
    transport: 'EVE 还车；OSL 中转；HKG 抵达',
    drivingEstimate: 'EVE 机场还车',
    hotel: '—（国际航班客舱）',
    breakfast: '不含',
    tips: '还车前加满油；挪威 / 冰岛退税可在机场办理 Global Blue。',
    highlights: '告别罗弗敦 ➔ 夜航返港'
  },
  {
    id: 'day-12',
    dayNum: 12,
    date: '10/14',
    route: '抵达香港（归途）',
    region: 'home',
    regionLabel: '香港',
    regionEmoji: '🇭🇰',
    sights: ['香港机场抵达', '退税 / 休整'],
    schedule: '清晨 / 上午抵达香港，结束旅程',
    transport: '机场接驳',
    drivingEstimate: '无需自驾',
    hotel: '—',
    breakfast: '机上',
    tips: '回家好好睡一觉，整理这趟北欧记忆。',
    highlights: '平安抵港 & 旅程收官'
  }
];

// Date calculation helper functions for real-time itinerary tracking
const getDayDateObj = (dateStr: string): Date => {
  const [mStr, dStr] = dateStr.split('/');
  const month = parseInt(mStr, 10) - 1; // Month is 0-indexed in JS Date
  const dayNum = parseInt(dStr, 10);
  return new Date(2026, month, dayNum);
};

const isDayToday = (dateStr: string, currentDate: Date): boolean => {
  const dayDate = getDayDateObj(dateStr);
  return (
    dayDate.getFullYear() === currentDate.getFullYear() &&
    dayDate.getMonth() === currentDate.getMonth() &&
    dayDate.getDate() === currentDate.getDate()
  );
};

const isDayCompleted = (dateStr: string, currentDate: Date): boolean => {
  const dayDate = getDayDateObj(dateStr);
  // Compare against the end of that day (23:59:59)
  const endOfDay = new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate(), 23, 59, 59);
  return currentDate > endOfDay;
};

export default function ItineraryTimeline({ theme }: ItineraryTimelineProps) {
  const [expandedDay, setExpandedDay] = useState<string | null>('day-2'); // default expand Day 2 as it starts the main iceland drive
  const [days, setDays, daysLoaded, daysError] = useSharedTable<ItineraryDay>('itinerary', 'polar_itinerary_v2', ITINERARY_2026);
  const [checkedDays, setCheckedDays, , checkedDaysError] = useSharedValue<Record<string, boolean>>('checked_days', 'polar_checked_days', {});
  const [editingDay, setEditingDay] = useState<ItineraryDay | null>(null);
  const [activeSpot, setActiveSpot] = useState<TripSpot | null>(null);
  const orderedDays = useMemo(() => [...days].sort((a, b) => a.dayNum - b.dayNum), [days]);

  useEffect(() => {
    if (!daysLoaded) return;
    const needsMigration = days.some((day) => !day.dining || !day.shopping || !day.alternativeSights);
    if (needsMigration) setDays((current) => current.map(enrichItineraryDay));
  }, [days, daysLoaded, setDays]);

  const currentDate = useMemo(() => new Date(), []);

  // Automatically expand active day card on page load based on real system date
  useEffect(() => {
    const activeDay = orderedDays.find(day => isDayToday(day.date, currentDate));
    if (activeDay) {
      setExpandedDay(activeDay.id);
    }
  }, [currentDate, orderedDays]);

  const toggleDayCheck = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCheckedDays((current) => ({ ...current, [id]: !current[id] }));
  };

  const saveEditingDay = (event: React.FormEvent) => {
    event.preventDefault();
    if (!editingDay) return;
    setDays((current) => current.map((day) => day.id === editingDay.id ? editingDay : day));
    setEditingDay(null);
  };

  const applyScreenshotImport = (result: TravelScreenshotResult) => {
    setEditingDay((current) => current ? {
      ...current,
      sights: mergeUnique(current.sights, result.sights),
      alternativeSights: mergeUnique(current.alternativeSights, result.alternativeSights),
      dining: mergeUnique(current.dining || [current.breakfast], result.dining),
      shopping: mergeUnique(current.shopping, result.shopping),
    } : current);
  };

  const promoteAlternative = (day: ItineraryDay, sight: string) => {
    setDays((current) => current.map((item) => item.id === day.id ? {
      ...item,
      sights: item.sights.includes(sight) ? item.sights : [...item.sights, sight],
      alternativeSights: (item.alternativeSights || []).filter((name) => name !== sight),
    } : item));
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden h-full">
      {(daysError || checkedDaysError) && <p role="alert" className="mb-2 rounded-lg bg-red-500/10 px-3 py-2 text-[10px] font-bold text-red-500">云端同步异常：{daysError || checkedDaysError}</p>}

      {/* TIMELINE LIST CONTAINER */}
      <div className="flex-1 overflow-y-auto pr-1 relative px-1 space-y-4 pb-24 select-none scrollbar-none">

        {orderedDays.map((day) => {
          const isExpanded = expandedDay === day.id;
          const isChecked = !!checkedDays[day.id];
          const isAutoCompleted = isDayCompleted(day.date, currentDate);
          const isToday = isDayToday(day.date, currentDate);
          const isDayFinished = isChecked || isAutoCompleted;
            
          const regionColors: Record<ItineraryDay['region'], string> = {
            finland: 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400',
            iceland: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400',
            spain: 'bg-orange-500/10 border-orange-500/20 text-orange-600 dark:text-orange-400',
            switzerland: 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400',
            netherlands: 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400',
            norway: 'bg-purple-500/10 border-purple-500/20 text-purple-600 dark:text-purple-400',
            lofoten: 'bg-violet-500/10 border-violet-500/20 text-violet-600 dark:text-violet-400',
            sweden: 'bg-sky-500/10 border-sky-500/20 text-sky-600 dark:text-sky-400',
            home: 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400'
          };
          const currentC = regionColors[day.region];

          return (
            <div key={day.id} className="relative">
              
              {/* Day Timeline Card - Apple-Style Premium Glassmorphism Selection */}
              <div 
                onClick={() => setExpandedDay(isExpanded ? null : day.id)}
                className={`border rounded-2xl overflow-hidden transition-all duration-500 ease-out relative cursor-pointer ${
                  isExpanded
                    ? 'bg-white dark:bg-stone-900 border-sky-400/80 dark:border-sky-500/50 shadow-[0_12px_36px_rgba(0,0,0,0.06),0_4px_12px_rgba(56,189,248,0.06)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.35)] scale-[1.01] -translate-y-0.5'
                    : isDayFinished
                      ? 'bg-stone-50/40 dark:bg-stone-900/15 border-stone-100 dark:border-stone-800/10 opacity-70 hover:opacity-100 shadow-none'
                      : 'bg-white/40 dark:bg-stone-900/40 border-stone-200/40 dark:border-stone-800/30 hover:bg-white/80 dark:hover:bg-stone-900/60 hover:border-sky-200/60 dark:hover:border-stone-700 shadow-sm hover:shadow-md'
                }`}
              >
                {/* Accent color tab left bar */}
                <div className={`absolute top-0 bottom-0 left-0 w-[4px] transition-all duration-300 ${
                  isExpanded ? 'scale-y-100' : 'scale-y-90'
                } ${
                  day.region === 'finland' ? 'bg-blue-400' : day.region === 'iceland' ? 'bg-emerald-400' : day.region === 'home' ? 'bg-rose-400' : 'bg-purple-400'
                }`} />

                {/* HEADER ROW */}
                <div className="p-3.5 flex items-center gap-3 pl-4 cursor-pointer select-none">
                  {/* Left circular toggle check button */}
                  <div 
                    onClick={(e) => toggleDayCheck(day.id, e)}
                    className="shrink-0 self-center z-10 p-0.5 hover:scale-110 active:scale-95 transition-all duration-200"
                  >
                    {isDayFinished ? (
                      <div className="w-5 h-5 rounded-full bg-emerald-500 dark:bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20">
                        <Check className="w-3.5 h-3.5 stroke-[3.5]" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-stone-300 dark:border-stone-700 hover:border-sky-500 dark:hover:border-sky-400 transition-colors" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[10px] font-black text-stone-400">
                        DAY {day.dayNum.toString().padStart(2, '0')}
                      </span>
                      <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${currentC}`}>
                        {day.regionEmoji} {day.regionLabel}
                      </span>

                      {/* Real-time reactive status badges */}
                      {isToday && (
                        <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-sky-500 text-white animate-pulse shadow-[0_2px_6px_rgba(56,189,248,0.3)]">
                          🔥 今日进行中
                        </span>
                      )}
                      {isAutoCompleted && (
                        <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                          ✓ 已完成
                        </span>
                      )}

                      <span className="text-[10px] font-black opacity-60 ml-auto">
                        {day.date}
                      </span>
                      <button
                        type="button"
                        title="编辑当天行程"
                        onClick={(event) => { event.stopPropagation(); setEditingDay({ ...day, sights: [...day.sights] }); }}
                        className="rounded-full p-1 text-stone-400 transition hover:bg-sky-500/10 hover:text-sky-500"
                      >
                        <Pencil className="h-3 w-3" />
                      </button>
                    </div>

                    <h3 className={`text-sm font-black mt-1 leading-normal tracking-wide text-stone-800 dark:text-stone-100 ${isDayFinished ? 'line-through opacity-60' : ''}`}>
                      {day.route}
                    </h3>

                    {/* Sights Sub-Chips (Only visible when collapsed to save space) */}
                    {!isExpanded && (
                      <div className="flex gap-1.5 mt-2 overflow-x-auto scrollbar-none flex-wrap">
                        {day.sights.slice(0, 3).map((sight, idx) => (
                          <span 
                            key={idx} 
                            className="text-[10px] font-bold bg-sky-500/5 dark:bg-sky-500/10 px-1.5 py-0.5 rounded-md text-stone-600 dark:text-stone-300 whitespace-nowrap"
                          >
                            📍 {sight}
                          </span>
                        ))}
                        {day.sights.length > 3 && (
                          <span className="text-[10px] font-bold text-stone-400 mt-1">+{day.sights.length - 3}</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="shrink-0 self-center">
                    <motion.div
                      animate={{ rotate: isExpanded ? 90 : 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                    </motion.div>
                  </div>
                </div>

                {/* COLLAPSIBLE DETAILS PANEL (Highly Structured, Grid layout) */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-stone-100 dark:border-stone-800/60"
                    >
                      <div className="p-4 pl-4 space-y-3.5 text-stone-700 dark:text-stone-300 select-text">
                        {/* MAIN CONTENT GRID (Sights Sliced Out elegantly) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          
                          {/* Sights Panel with Maps & Copies */}
                          <div className="space-y-2 border border-stone-100 dark:border-stone-800/60 bg-white/40 dark:bg-stone-950/20 p-3 rounded-xl">
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-stone-400 uppercase tracking-wider border-b border-stone-100 dark:border-stone-800/50 pb-1.5">
                              <MapPin className="w-3.5 h-3.5 text-rose-500" />
                              <span>游览地标景点</span>
                            </div>
                            <div className="space-y-1.5">
                              {day.sights.map((sight, idx) => {
                                const spot = getTripSpot(sight);
                                return (
                                <div key={idx} className="flex items-center justify-between gap-2 py-1 px-2.5 rounded-lg bg-stone-50/80 dark:bg-stone-900/60 border border-stone-100/50 dark:border-stone-800/30">
                                  <span className="font-bold text-xs text-stone-800 dark:text-stone-200">{sight}</span>
                                  <div className="flex items-center gap-1.5 shrink-0">
                                    {spot && <button type="button" onClick={(event) => { event.stopPropagation(); setActiveSpot(spot); }} className="rounded bg-sky-500/10 px-1.5 py-1 text-[9px] font-black text-sky-500">详情</button>}
                                    <CopyButton 
                                      textToCopy={sight} 
                                      label="" 
                                      copiedLabel="" 
                                      iconSize={12}
                                      variant={theme.id === 'cyber' ? 'cyber' : theme.id === 'aurora' ? 'sky' : 'stone'}
                                      className="p-1 hover:bg-stone-200/50 dark:hover:bg-stone-800/50 rounded text-stone-400 hover:text-sky-500 transition-all flex items-center justify-center cursor-pointer"
                                      copiedClassName="p-1 bg-emerald-500/15 rounded text-emerald-500 transition-all flex items-center justify-center"
                                    />
                                    <a
                                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(sight)}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={(e) => e.stopPropagation()}
                                      className="p-1 hover:bg-stone-200/50 dark:hover:bg-stone-800/50 rounded text-stone-400 hover:text-sky-500 transition-colors"
                                      title="在 Google 地图定位"
                                    >
                                      <ExternalLink className="w-3 h-3" />
                                    </a>
                                  </div>
                                </div>
                              )})}
                            </div>
                          </div>

                          {/* Driving Details & Times list */}
                          <div className="space-y-2 border border-stone-100 dark:border-stone-800/60 bg-white/40 dark:bg-stone-950/20 p-3 rounded-xl flex flex-col justify-between">
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-stone-400 uppercase tracking-wider border-b border-stone-100 dark:border-stone-800/50 pb-1.5">
                              <Clock className="w-3.5 h-3.5 text-sky-500" />
                              <span>自驾计划与日程建议</span>
                            </div>
                            
                            <div className="space-y-2 py-1 flex-1 flex flex-col justify-center">
                              {/* Schedule */}
                              <div className="flex items-start gap-2">
                                <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                                <div>
                                  <span className="text-[10px] text-stone-400 block uppercase font-bold leading-none mb-0.5">建议安排</span>
                                  <span className="font-bold text-xs text-stone-800 dark:text-stone-200">{day.schedule}</span>
                                </div>
                              </div>

                              {/* Fleet */}
                              <div className="flex items-start gap-2">
                                <Car className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                                <div>
                                  <span className="text-[10px] text-stone-400 block uppercase font-bold leading-none mb-0.5">交通方式</span>
                                  <span className="font-bold text-xs text-stone-800 dark:text-stone-200">{day.transport}</span>
                                </div>
                              </div>

                              {/* Mileage */}
                              <div className="flex items-start gap-2">
                                <Navigation className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                <div>
                                  <span className="text-[10px] text-stone-400 block uppercase font-bold leading-none mb-0.5">车程里程估算</span>
                                  <span className="font-bold text-xs text-stone-800 dark:text-stone-200">{day.drivingEstimate}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                        </div>

                        {/* Combined Accommodation & Meal Plan Card */}
                        <div className="p-3 rounded-xl border border-stone-100 dark:border-stone-800/60 bg-white/40 dark:bg-stone-950/20 space-y-2.5">
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-stone-400 uppercase tracking-wider border-b border-stone-100 dark:border-stone-800/50 pb-1.5">
                            <Hotel className="w-3.5 h-3.5 text-purple-500" />
                            <span>住宿与餐饮</span>
                          </div>
                          
                          <div className="space-y-2">
                            {/* Hotel Row */}
                            <div className="flex items-start justify-between gap-3 bg-stone-50/50 dark:bg-stone-900/40 p-2 rounded-lg border border-stone-100/30 dark:border-stone-800/20">
                              <div className="flex items-start gap-2 min-w-0">
                                <Hotel className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                                <div className="min-w-0">
                                  <span className="text-[10px] text-stone-400 block uppercase font-bold leading-none mb-0.5">入住酒店</span>
                                  <span className="font-black text-xs text-stone-800 dark:text-stone-100 block break-words">{day.hotel}</span>
                                </div>
                              </div>
                              
                              {day.hotel !== '— (国际航班客舱)' && day.hotel !== '—' && (
                                <div className="flex items-center gap-1 shrink-0 mt-0.5" onClick={(e) => e.stopPropagation()}>
                                  <CopyButton
                                    textToCopy={day.hotel}
                                    label=""
                                    copiedLabel=""
                                    iconSize={12}
                                    variant={theme.id === 'cyber' ? 'cyber' : theme.id === 'aurora' ? 'sky' : 'stone'}
                                    className="p-1 hover:bg-stone-200/50 dark:hover:bg-stone-800/50 rounded text-stone-400 hover:text-sky-500 transition-colors bg-transparent border-0"
                                    copiedClassName="p-1 bg-emerald-500/15 rounded text-emerald-500 border-0"
                                  />
                                  <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(day.hotel)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="p-1 hover:bg-stone-200/50 dark:hover:bg-stone-800/50 rounded text-stone-400 hover:text-sky-500 transition-colors"
                                    title="在 Google 地图查看"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                </div>
                              )}
                            </div>

                            {/* Dining Row */}
                            <div className="flex items-start gap-2 bg-stone-50/50 dark:bg-stone-900/40 p-2 rounded-lg border border-stone-100/30 dark:border-stone-800/20">
                              <Utensils className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                              <div className="min-w-0 flex-1">
                                <span className="text-[10px] text-stone-400 block uppercase font-bold leading-none mb-1">餐饮安排</span>
                                <div className="space-y-1">{(day.dining?.length ? day.dining : [day.breakfast]).map((place) => <a key={place} href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place)}`} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded bg-orange-500/5 px-2 py-1 text-xs font-bold hover:text-orange-500"><span>{place}</span><ExternalLink className="h-3 w-3 shrink-0" /></a>)}</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                          <div className="rounded-xl border border-stone-100 bg-white/40 p-3 dark:border-stone-800/60 dark:bg-stone-950/20">
                            <h4 className="flex items-center gap-1.5 text-[11px] font-bold text-stone-400"><Compass className="h-3.5 w-3.5 text-violet-500" />备选景点</h4>
                            <div className="mt-2 space-y-1.5">{(day.alternativeSights || []).length === 0 ? <p className="text-[10px] opacity-45">暂无备选，可点编辑添加</p> : day.alternativeSights!.map((sight) => { const spot = getTripSpot(sight); return <div key={sight} className="flex items-center gap-1 rounded-lg bg-violet-500/5 px-2 py-1.5"><button type="button" onClick={() => spot && setActiveSpot(spot)} className="min-w-0 flex-1 truncate text-left text-[10px] font-bold">{sight}</button><button type="button" onClick={() => promoteAlternative(day, sight)} className="flex items-center gap-0.5 rounded bg-violet-500/15 px-1.5 py-1 text-[8px] font-black text-violet-500"><Plus className="h-2.5 w-2.5" />加入</button></div> })}</div>
                          </div>
                          <div className="rounded-xl border border-stone-100 bg-white/40 p-3 dark:border-stone-800/60 dark:bg-stone-950/20">
                            <h4 className="flex items-center gap-1.5 text-[11px] font-bold text-stone-400"><ShoppingBag className="h-3.5 w-3.5 text-pink-500" />购物推荐</h4>
                            <div className="mt-2 space-y-1.5">{(day.shopping || []).length === 0 ? <p className="text-[10px] opacity-45">暂无购物点，可点编辑添加</p> : day.shopping!.map((place) => <a key={place} href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place)}`} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-lg bg-pink-500/5 px-2 py-1.5 text-[10px] font-bold hover:text-pink-500"><span>{place}</span><ExternalLink className="h-3 w-3" /></a>)}</div>
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {editingDay && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 grid place-items-center bg-black/55 p-4 backdrop-blur-sm"
            onClick={() => setEditingDay(null)}
          >
            <motion.form
              initial={{ y: 20, scale: 0.97 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: 0.97 }}
              onSubmit={saveEditingDay}
              onClick={(event) => event.stopPropagation()}
              className="max-h-[90%] w-full max-w-md space-y-3 overflow-y-auto rounded-2xl border border-white/15 bg-stone-950 p-4 text-white shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black">编辑第 {editingDay.dayNum} 天</h3>
                <button type="button" onClick={() => setEditingDay(null)} className="rounded-full p-1.5 hover:bg-white/10"><X className="h-4 w-4" /></button>
              </div>
              <ScreenshotPlaceImporter cityHint={editingDay.route} onApply={applyScreenshotImport} />
              {([
                ['date', '日期（MM/DD）'], ['route', '路线'], ['schedule', '日程安排'], ['transport', '交通方式'],
                ['drivingEstimate', '车程估算'], ['hotel', '酒店'], ['breakfast', '餐饮安排（兼容旧字段）'], ['tips', '提示'], ['highlights', '亮点'],
              ] as const).map(([field, label]) => (
                <label key={field} className="block text-[10px] font-bold text-white/65">
                  {label}
                  <textarea rows={field === 'schedule' || field === 'tips' ? 2 : 1} value={editingDay[field] as string}
                    onChange={(event) => setEditingDay({ ...editingDay, [field]: event.target.value })}
                    className="mt-1 w-full resize-none rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-xs text-white outline-none focus:border-sky-400" />
                </label>
              ))}
              <label className="block text-[10px] font-bold text-white/65">
                景点（每行一个）
                <textarea rows={4} value={editingDay.sights.join('\n')}
                  onChange={(event) => setEditingDay({ ...editingDay, sights: event.target.value.split('\n').map((value) => value.trim()).filter(Boolean) })}
                  className="mt-1 w-full rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-xs text-white outline-none focus:border-sky-400" />
              </label>
              <label className="block text-[10px] font-bold text-white/65">备选景点（每行一个）<textarea rows={4} value={(editingDay.alternativeSights || []).join('\n')} onChange={(event) => setEditingDay({ ...editingDay, alternativeSights: event.target.value.split('\n').map((value) => value.trim()).filter(Boolean) })} className="mt-1 w-full rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-xs text-white" /></label>
              <label className="block text-[10px] font-bold text-white/65">餐饮安排（每行一家，可跳转地图）<textarea rows={3} value={(editingDay.dining || [editingDay.breakfast]).join('\n')} onChange={(event) => setEditingDay({ ...editingDay, dining: event.target.value.split('\n').map((value) => value.trim()).filter(Boolean), breakfast: event.target.value.split('\n').map((value) => value.trim()).filter(Boolean).join('；') })} className="mt-1 w-full rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-xs text-white" /></label>
              <label className="block text-[10px] font-bold text-white/65">购物推荐（每行一个，可跳转地图）<textarea rows={3} value={(editingDay.shopping || []).join('\n')} onChange={(event) => setEditingDay({ ...editingDay, shopping: event.target.value.split('\n').map((value) => value.trim()).filter(Boolean) })} className="mt-1 w-full rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-xs text-white" /></label>
              <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-400 py-2.5 text-xs font-black text-slate-950"><Save className="h-4 w-4" />保存并同步</button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {activeSpot && <TripSpotModal spot={activeSpot} onClose={() => setActiveSpot(null)} />}

    </div>
  );
}
