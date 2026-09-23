import { useState, useMemo, useEffect, Component, type ReactNode } from 'react';

import { motion, AnimatePresence } from 'motion/react';
import { THEME_CONFIGS } from './data/guideData';
import { TRIP_GUIDE_ITEMS } from './data/tripGuide';
import { ThemeId, CountryId, CategoryId, GuideItem } from './types';
import { getTabBarStyle, getTabItemStyle, getCardStyle, isDarkTheme } from './lib/themeStyles';

// Components
import MobileFrame from './components/MobileFrame';
import GuideCard from './components/GuideCard';
import DetailDrawer from './components/DetailDrawer';
import DroneCalculator from './components/DroneCalculator';
import DynamicBackground from './components/DynamicBackground';
import ExpenseTracker from './components/ExpenseTracker';
import VoucherFolder from './components/VoucherFolder';
import VoucherPreview from './components/VoucherPreview';
import EmergencyPhones from './components/EmergencyPhones';
import ItineraryTimeline from './components/ItineraryTimeline';

// Icons
import { Search, Compass, ShieldAlert, ShoppingBag, CheckCircle, HelpCircle, X, MapPin, Ghost, BookOpen, Briefcase, FolderClosed, Coins, Calendar } from 'lucide-react';

class HandbookErrorBoundary extends Component<{ children: ReactNode }, { error: string | null }> {
  state = { error: null as string | null };
  static getDerivedStateFromError(error: Error) {
    return { error: error?.message || String(error) };
  }
  render() {
    if (this.state.error) {
      return (
        <div className="flex-1 p-4 text-xs text-red-300 overflow-auto">
          手册加载失败：{this.state.error}
        </div>
      );
    }
    return this.props.children;
  }
}

const COUNTRIES_OPTIONS = [
  { id: 'all', label: '全部大区', emoji: '🌍' },
  { id: 'spain', label: '西班牙', emoji: '🇪🇸' },
  { id: 'switzerland', label: '瑞士', emoji: '🇨🇭' },
  { id: 'netherlands', label: '荷兰', emoji: '🇳🇱' },
  { id: 'norway', label: '挪威', emoji: '🇳🇴' },
  { id: 'sweden', label: '瑞典', emoji: '🇸🇪' }
] as const;

const HANDBOOK_CATEGORIES = [
  { id: 'all', name: '全部大类', emoji: '🎯' },
  { id: 'parking', name: '停车缴费', emoji: '🅿️' },
  { id: 'traffic', name: '路况法规', emoji: '🧭' },
  { id: 'grocery', name: '超市和免税店', emoji: '🛒' },
  { id: 'activity', name: '游玩避坑', emoji: '✨' },
  { id: 'food', name: '吃好喝好', emoji: '🍽️' },
  { id: 'aurora', name: '极光猎人', emoji: '🌌' },
  { id: 'photo', name: '景点与机位', emoji: '📷' },
];

const getSystemTheme = (): ThemeId => {
  try {
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'midnight';
    }
  } catch (e) {
    // ignore
  }
  return 'glacial';
};

export default function App() {
  const [currentTheme, setCurrentTheme] = useState<ThemeId>(getSystemTheme);
  
  // Three-tier structure active tab: 'handbook' | 'itinerary' | 'toolbox' | 'folder'
  const [activeTab, setActiveTab] = useState<'handbook' | 'itinerary' | 'toolbox' | 'folder'>('itinerary');

  // Handbook country filter: horizontal tabs (top)
  const [selectedCountry, setSelectedCountry] = useState<CountryId | 'all'>('all');

  // Handbook category filter: vertical sidebar (left)
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeItem, setActiveItem] = useState<GuideItem | null>(null);
  const [previewVoucherItem, setPreviewVoucherItem] = useState<any>(null);
  const [previewVoucherList, setPreviewVoucherList] = useState<any[]>([]);

  const openVoucherPreview = (item: any | null, list?: any[]) => {
    if (!item) {
      setPreviewVoucherItem(null);
      setPreviewVoucherList([]);
      return;
    }
    setPreviewVoucherList(list && list.length > 0 ? list : [item]);
    setPreviewVoucherItem(item);
  };

  // Toolbox active tool: 'ledger' (记账) | 'drone_wind' (无人机风控) | 'emergency' (紧急电话)
  const [toolboxActiveTool, setToolboxActiveTool] = useState<'ledger' | 'drone_wind' | 'emergency'>('ledger');

  // Retrieve current active theme configurations
  const theme = THEME_CONFIGS[currentTheme];

  const isCyber = currentTheme === 'cyber';
  const isFrosted = currentTheme === 'frosted';
  const isNewspaper = currentTheme === 'newspaper';
  const isMidnight = currentTheme === 'midnight';
  const isDark = isDarkTheme(currentTheme);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.removeItem('nordic_roadbook_theme');
    } catch (e) {
      // ignore
    }
  }, [currentTheme, isDark]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const applySystemTheme = (isDarkMode: boolean) => {
      setCurrentTheme(isDarkMode ? 'midnight' : 'glacial');
    };
    applySystemTheme(mediaQuery.matches);
    const handleSystemChange = (e: MediaQueryListEvent) => {
      applySystemTheme(e.matches);
    };
    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, []);

  const handbookItems = useMemo<GuideItem[]>(() => TRIP_GUIDE_ITEMS, []);

  // Filtered handbook items based on vertical partition selection (country) & category & search query
  const filteredItems = useMemo(() => {
    return handbookItems.filter((item) => {
      // 1. Country vertical partition filter (items marked 'both' show in every country)
      const matchesCountry = selectedCountry === 'all' || item.country === selectedCountry || item.country === 'both';
      
      // 2. Category horizontal tab filter
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      
      // 3. Search query text filter
      const matchesSearch = 
        searchQuery.trim() === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.shortDesc || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.location || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.mapQuery || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.tags || []).some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.details || []).some(sec => (sec.items || []).some(bullet => bullet.toLowerCase().includes(searchQuery.toLowerCase())));

      return matchesCountry && matchesCategory && matchesSearch;
    });
  }, [handbookItems, selectedCountry, selectedCategory, searchQuery]);

  return (
    <MobileFrame themeId={currentTheme}>
      {/* Main Container - conforming to the selected theme styling with non-scrollable base (scrolling inside tiers) */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-500 relative ${theme.bgClass} ${theme.fontBody}`}>
        {/* Real-time canvas rendering for high-immersion environmental dynamic animations */}
        <DynamicBackground themeId={currentTheme} />

        {/* Dynamic header customized per top level tier tab */}
        <div className={`px-5 py-4 shrink-0 relative overflow-hidden z-20 border-b transition-colors duration-300 ${
          isCyber 
            ? 'border-[#00F5FF]/15 bg-black/60 shadow-[0_2px_15px_rgba(0,245,255,0.05)]' 
            : isFrosted
              ? 'bg-white/5 border-white/10 backdrop-blur-xl text-white'
              : isMidnight
                ? 'bg-[#0F131C]/90 border-slate-800/80 backdrop-blur-xl text-slate-100'
                : 'bg-white/80 dark:bg-stone-900/80 border-stone-200/50'
        }`}>
          <div className="flex justify-between items-end">
            <div>
              <h1 className={`text-xl font-black tracking-tight ${theme.fontHeading}`}>
                {activeTab === 'itinerary' && '欧洲五国行程'}
                {activeTab === 'handbook' && '欧洲五国旅行手册'}
                {activeTab === 'toolbox' && '欧洲旅行工具箱'}
                {activeTab === 'folder' && '票根夹'}
              </h1>
              <p className="text-xs mt-1 leading-snug opacity-75 text-pretty">
                {activeTab === 'itinerary' && '西班牙 · 瑞士 · 荷兰 · 挪威 · 瑞典 14 天 · 四人同行。'}
                {activeTab === 'handbook' && '西班牙、瑞士、挪威与瑞典的交通、景点、餐饮、购物与应急。'}
                {activeTab === 'toolbox' && '四人自动分账、账单导入、紧急救援与无人机风控。'}
                {activeTab === 'folder' && '支持私有云端存储、上传本地文件或预约单截图。'}
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Inner views based on top-level state */}
        <div className="flex-1 flex flex-col overflow-hidden relative z-10">
          <AnimatePresence initial={false}>
            
            {/* TIER 1: 万能手册 (Omni Handbook) */}
            {activeTab === 'handbook' && (
              <HandbookErrorBoundary>
              <motion.div
                key="handbook-tier"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex-1 flex flex-col overflow-hidden min-h-0"
              >
                {/* 1. Horizontal country filter */}
                <div className={`p-2 shrink-0 border-b flex gap-1.5 ${
                  isCyber ? 'border-[#00F5FF]/10' : 'border-stone-200/20'
                }`}>
                  {COUNTRIES_OPTIONS.map((cnt) => {
                    const isSelected = selectedCountry === cnt.id;
                    return (
                      <button
                        key={cnt.id}
                        onClick={() => setSelectedCountry(cnt.id)}
                        className={`flex-1 py-1.5 text-[10px] font-black rounded-full transition-all flex items-center justify-center gap-1 cursor-pointer border ${
                          isSelected
                            ? isCyber
                              ? 'bg-[#00F5FF] text-black border-[#00F5FF] shadow-[0_0_8px_#00F5FF]'
                              : isFrosted
                                ? 'bg-purple-600/30 text-white border-purple-400/40 shadow-sm shadow-purple-500/10'
                                : isNewspaper
                                  ? 'bg-[#1B1917] text-[#FCFBF7] border-2 border-[#1B1917] rounded-none'
                                  : isMidnight
                                    ? 'bg-[#20293A] text-sky-300 border-sky-500/40'
                                    : 'bg-stone-900 text-white dark:bg-white dark:text-stone-950 border-stone-900'
                            : isCyber
                              ? 'bg-black/40 text-stone-400 border-stone-900'
                              : isFrosted
                                ? 'bg-white/5 text-purple-200/60 border-white/5 hover:bg-white/10'
                                : isMidnight
                                  ? 'bg-[#151A26] text-slate-400 border-slate-800 hover:bg-[#1A2232]'
                                  : 'bg-stone-50 dark:bg-stone-800 text-stone-500 dark:text-stone-400 border-stone-200/50 hover:bg-stone-100'
                        }`}
                      >
                        <span>{cnt.emoji}</span>
                        <span>{cnt.id === 'all' ? '全部' : cnt.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex-1 flex overflow-hidden min-h-0">
                {/* 2. Vertical category sidebar */}
                <div className={`w-[84px] shrink-0 border-r flex flex-col items-center pt-3 gap-2 pb-3 overflow-y-auto scrollbar-none ${
                  isCyber 
                    ? 'border-[#00F5FF]/10 bg-black/40' 
                    : isFrosted
                      ? 'border-white/5 bg-white/5'
                      : isMidnight
                        ? 'border-slate-800/80 bg-[#10141C] text-slate-200'
                        : 'bg-stone-50/50 dark:bg-stone-900/30 border-stone-200/40'
                }`}>
                  <span className="text-[9px] opacity-40 uppercase tracking-widest font-black text-center px-1 block scale-90">分类</span>
                  <div className="flex flex-col gap-2 w-full px-1.5">
                    {HANDBOOK_CATEGORIES.map((cat) => {
                      const isSelected = selectedCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.id as any)}
                          className={`w-full py-2.5 px-1 rounded-xl flex flex-col items-center justify-center gap-1 transition-all relative cursor-pointer ${
                            isSelected
                              ? isCyber
                                ? 'bg-[#00F5FF]/15 text-white border border-[#00F5FF]/40 shadow-[0_0_8px_rgba(0,245,255,0.25)] font-black'
                                : isFrosted
                                  ? 'bg-purple-600/25 text-white border border-purple-400/30 font-black shadow-lg shadow-purple-500/10'
                                  : isNewspaper
                                    ? 'bg-[#1B1917] text-[#FCFBF7] border-2 border-[#1B1917] rounded-none'
                                    : isMidnight
                                      ? 'bg-[#20293A] text-sky-300 border border-sky-500/40 font-bold shadow-sm'
                                      : 'bg-stone-900 text-white dark:bg-white dark:text-stone-950 font-bold shadow-sm'
                              : isFrosted
                                ? 'text-purple-200/50 hover:text-white'
                                : isMidnight
                                  ? 'text-slate-500 hover:text-slate-200'
                                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-100'
                          }`}
                        >
                          {isSelected && (
                            <span className={`text-[8px] absolute top-1 left-1.5 ${
                              isCyber ? 'text-[#00F5FF]' : isMidnight ? 'text-sky-400' : 'text-emerald-400'
                            }`}>
                              ◆
                            </span>
                          )}
                          <span className="text-base leading-none">{cat.emoji}</span>
                          <span className={`text-[9px] font-black tracking-tight leading-tight text-center ${isNewspaper ? 'font-serif' : ''}`}>{cat.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Search + card list */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Search Input Box */}
                    <div className={`p-3 shrink-0 border-b ${isCyber ? 'border-[#00F5FF]/10' : 'border-stone-200/20'}`}>
                      <div className="relative">
                        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${
                          isCyber ? 'text-[#00F5FF]' : 'text-stone-400'
                        }`} />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder={`在${selectedCountry === 'all' ? '全部' : COUNTRIES_OPTIONS.find((country) => country.id === selectedCountry)?.label || ''}指南中搜索...`}
                          className={`w-full pl-9 pr-8 py-2 text-[11px] focus:outline-none transition-all duration-300 border ${
                            isCyber
                              ? 'bg-black/60 border-[#00F5FF]/30 text-white placeholder-stone-600 focus:border-[#00F5FF]'
                              : isFrosted
                                ? 'bg-white/5 border border-white/10 text-white placeholder-purple-300/40 focus:bg-white/10 focus:border-purple-400/40 rounded-xl'
                                : isNewspaper
                                  ? 'bg-[#FCFBF7] border-2 border-[#1B1917] rounded-none text-stone-950'
                                  : isMidnight
                                    ? 'bg-[#0C0F17] border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:border-sky-400'
                                    : 'bg-stone-50 border border-stone-200/50 rounded-xl text-stone-900 focus:bg-white'
                          }`}
                        />
                        {searchQuery && (
                          <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-stone-400 hover:text-stone-600 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Guides Scrollable items list */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
                      {filteredItems.length > 0 ? (
                        <div className="grid grid-cols-1 gap-3 pb-8">
                          {filteredItems.map((item) => (
                            <GuideCard
                              key={item.id}
                              item={item}
                              theme={theme}
                              onSelect={setActiveItem}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className={`p-8 text-center border-2 border-dashed ${
                          isCyber
                            ? 'border-[#00F5FF]/30 bg-black/50 text-[#00F5FF]'
                            : isFrosted
                              ? 'border-white/10 bg-white/5 text-purple-200'
                              : isMidnight
                                ? 'border-slate-700/70 bg-[#0C0F17] text-slate-400'
                                : 'border-stone-200 bg-stone-50/20 text-stone-500'
                        } rounded-2xl`}>
                          <Ghost className={`w-8 h-8 mx-auto mb-2 ${
                            isMidnight || isCyber || isFrosted ? 'text-sky-400/70' : 'text-stone-400'
                          }`} />
                          <h5 className="text-xs font-bold">没有找到匹配的攻略哎</h5>
                          <p className="text-[10px] opacity-75 mt-1">
                            试着更换搜索词，或者通过左侧切换分类、上方切换国家。
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
              </HandbookErrorBoundary>
            )}

            {/* TIER 4: 行程时间线可视化模块 (Itinerary Timeline) */}
            {activeTab === 'itinerary' && (
              <motion.div
                key="itinerary-tier"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.15 }}
                className="flex-1 flex flex-col overflow-hidden p-4 h-full"
              >
                <ItineraryTimeline theme={theme} />
              </motion.div>
            )}

          </AnimatePresence>

          {/* 票根夹始终挂载，避免切换时重新加载共享数据。 */}
          <div className={activeTab === 'folder' ? 'flex-1 flex flex-col overflow-hidden p-4' : 'hidden'}>
            <div className="flex-1 overflow-y-auto pb-8">
              <VoucherFolder theme={theme} onPreviewVoucher={openVoucherPreview} />
            </div>
          </div>

          {/* 工具箱始终挂载，保持共享账本状态。 */}
          <div className={activeTab === 'toolbox' ? 'flex-1 flex flex-col overflow-hidden p-4 space-y-4' : 'hidden'}>
            <div className="shrink-0 flex justify-center">
              <div className={`flex gap-1 w-full max-w-sm backdrop-blur-xl ${getTabBarStyle(theme.id)}`}>
                {[
                  { id: 'ledger', label: '💴 随手记账' },
                  { id: 'emergency', label: '📞 紧急救援' },
                  { id: 'drone_wind', label: '🛸 无人机' }
                ].map((tool) => {
                  const isSelected = toolboxActiveTool === tool.id;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => setToolboxActiveTool(tool.id as any)}
                      className={`flex-1 py-1.5 px-1 text-center cursor-pointer transition-all ${getTabItemStyle(theme.id, isSelected)}`}
                    >
                      <span className="text-[11px] font-bold block leading-normal whitespace-nowrap">{tool.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pb-8">
              <div className={toolboxActiveTool === 'ledger' ? '' : 'hidden'}>
                <ExpenseTracker theme={theme} />
              </div>
              {toolboxActiveTool === 'drone_wind' && (
                <div className="space-y-4">
                  <div className={`p-4 text-xs leading-relaxed ${getCardStyle(theme.id, 'subcard')}`}>
                    <p className="font-bold text-sky-700 dark:text-sky-400 flex items-center gap-1.5 mb-1">
                      <Compass className="w-4 h-4 text-sky-500 animate-pulse" />
                      无人机起飞风速模拟与抗风评级
                    </p>
                    <p className="opacity-80">北欧峡湾强阵风（突发风切变）极易导致无人机一去不复返。输入实时风力，物理姿态引擎将为你精确评估坠机概率。</p>
                  </div>
                  <DroneCalculator theme={theme} />
                </div>
              )}
              {toolboxActiveTool === 'emergency' && (
                <EmergencyPhones theme={theme} />
              )}
            </div>
          </div>
        </div>

        {/* BOTTOM TAB BAR - Dynamic Three-Tier Navigation Stickiness */}
        <div style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 0.75rem)' }} className={`p-2.5 border-t flex gap-1.5 shrink-0 z-40 relative backdrop-blur-xl ${
          isCyber 
            ? 'border-[#00F5FF]/20 bg-black/90 text-white' 
            : isFrosted
              ? 'border-white/10 bg-[#0E0B1E]/60 text-white shadow-[0_-8px_30px_rgba(139,92,246,0.1)]'
              : isNewspaper
                ? 'border-t-2 border-[#1B1917] bg-[#FCFBF7] text-[#1B1917]'
                : isMidnight
                  ? 'border-slate-800/80 bg-[#0C0E14]/95 text-slate-100'
                  : 'border-stone-200/50 bg-white/90 dark:bg-stone-900/95 text-stone-900'
        }`}>
          {[
            { id: 'itinerary', label: '行程', icon: Calendar, desc: '冰岛挪威大区日程' },
            { id: 'handbook', label: '万能手册', icon: BookOpen, desc: '指南/法规/交规' },
            { id: 'toolbox', label: '工具箱', icon: Briefcase, desc: '记账/航拍风控' },
            { id: 'folder', label: '票根夹', icon: FolderClosed, desc: '票根/本地存储' }
          ].map((tab) => {
            const isSelected = activeTab === tab.id;
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-1.5 flex flex-col items-center justify-center transition-all duration-300 relative cursor-pointer rounded-xl ${
                  isSelected
                    ? isCyber
                      ? 'text-white bg-[#00F5FF]/10 border border-[#00F5FF]/40 shadow-[0_0_12px_rgba(0,245,255,0.25)] font-bold'
                      : isFrosted
                        ? 'text-white bg-purple-600/30 border border-purple-400/40 shadow-lg shadow-purple-500/10 font-bold'
                          : isNewspaper
                          ? 'bg-[#1B1917] text-[#FCFBF7] rounded-none border-2 border-[#1B1917]'
                          : isMidnight
                            ? 'bg-[#20293A] text-sky-300 border border-sky-500/40 font-bold'
                            : 'bg-stone-900 dark:bg-white text-white dark:text-stone-950 font-bold'
                    : isFrosted
                      ? 'text-purple-200/50 hover:text-white'
                      : isMidnight
                        ? 'text-slate-500 hover:text-slate-200'
                        : 'text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span className="text-[10px] mt-0.5 tracking-tight">{tab.label}</span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Floating Bottom sheet / Detail Drawer for individual Handbook Guide details */}
      <AnimatePresence>
        {activeItem && (
          <DetailDrawer
            item={activeItem}
            theme={theme}
            onClose={() => setActiveItem(null)}
          />
        )}
      </AnimatePresence>

      {previewVoucherItem && (
        <VoucherPreview
          item={previewVoucherItem}
          list={previewVoucherList.length > 0 ? previewVoucherList : [previewVoucherItem]}
          theme={theme}
          onChange={setPreviewVoucherItem}
          onClose={() => openVoucherPreview(null)}
        />
      )}
    </MobileFrame>
  );
}
