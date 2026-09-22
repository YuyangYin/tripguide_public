import React, { useState } from 'react';
import { ThemeConfig } from '../types';
import { CopyButton } from './CopyButton';
import { Phone, MessageSquare, ShieldAlert, Compass, Users } from 'lucide-react';
import { getCardStyle, getInputStyle, getTabBarStyle, getTabItemStyle } from '../lib/themeStyles';

interface EmergencyPhonesProps {
  theme: ThemeConfig;
}

interface EmergencyContact {
  name: string;
  phone: string;
  desc: string;
  badge: string;
  category: 'rescue' | 'road' | 'consular';
}

const EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    name: '冰岛统一紧急救援',
    phone: '112',
    desc: '警察 / 急救 / 消防 / 山地搜救。无 SIM 卡也能拨。',
    badge: '24 小时',
    category: 'rescue'
  },
  {
    name: '冰岛路况热线',
    phone: '1777',
    desc: '环岛 1 号 / F 路况、封路、铲雪进度实时查询。',
    badge: '08:00–20:00',
    category: 'road'
  },
  {
    name: 'ICE-SAR 志愿搜救',
    phone: '+354 570 5900',
    desc: '恶劣天气、冰川徒步、火山突发的离线搜救监视。',
    badge: '专业搜救',
    category: 'rescue'
  },
  {
    name: '中国驻冰岛大使馆',
    phone: '+354 893 1899',
    desc: '护照遗失、事故伤害、失联搜寻的领事保护。',
    badge: '华人专线',
    category: 'consular'
  },
  {
    name: '冰岛气象局灾害预警',
    phone: '+354 522 6000',
    desc: '暴风雪、沙尘、雪崩、火山毒气等紧急动态。',
    badge: '权威气象',
    category: 'road'
  },
  {
    name: '国际 SOS 紧急医疗',
    phone: '+86 10 6462 9100',
    desc: '野外重症、骨折、冻伤的直升机转运与保险对接。',
    badge: '国际救援',
    category: 'rescue'
  }
];

export default function EmergencyPhones({ theme }: EmergencyPhonesProps) {
  const isCyber = theme.id === 'cyber';
  const isFrosted = theme.id === 'frosted';
  const isNewspaper = theme.id === 'newspaper';

  const [selectedCategory, setSelectedCategory] = useState<'all' | 'rescue' | 'road' | 'consular'>('all');

  // Emergency Satellite SOS Generator states
  const [sosSituation, setSosSituation] = useState('car_stuck');
  const [customDetail, setCustomDetail] = useState('');
  const [passengerCount, setPassengerCount] = useState('2');
  const [gpsCoords, setGpsCoords] = useState('64.1265° N, 21.8174° W');
  const [generatedSms, setGeneratedSms] = useState('');
  const [showSmsResult, setShowSmsResult] = useState(false);

  const handleGenerateSms = () => {
    let sitText = '车轮深陷积雪/泥沙中，无法脱困 (Car stuck in snow/mud)';
    if (sosSituation === 'tire_flat') sitText = '爆胎且风沙过大，需要紧急道路救援 (Flat tire, windy)';
    if (sosSituation === 'lost') sitText = '迷失于内陆 F 路段，无数据信号 (Lost in highland F-road)';
    if (sosSituation === 'injured') sitText = '同伴受寒/突发身体不适，需要医疗协助 (Cold/Injured, need medical)';
    if (sosSituation === 'custom') sitText = customDetail.trim() || '遭遇紧急情况需要救援 (Emergency help needed)';

    const sms = `SOS HELP! 
Location GPS: ${gpsCoords}
Situation: ${sitText}
Info: ${passengerCount} Pax. We have warm clothes & food. Please reply.`;
    
    setGeneratedSms(sms);
    setShowSmsResult(true);
  };

  const filteredContacts = selectedCategory === 'all' 
    ? EMERGENCY_CONTACTS 
    : EMERGENCY_CONTACTS.filter(c => c.category === selectedCategory);

  return (
    <div className="space-y-4 text-xs animate-fadeIn">
      {/* Compact header hint */}
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] ${
        isCyber
          ? 'bg-[#00F5FF]/5 text-[#00F5FF]'
          : isFrosted
            ? 'bg-white/5 text-purple-200/80'
            : isNewspaper
              ? 'bg-[#FCFBF7] border-2 border-[#1B1917] rounded-none text-[#1B1917]'
              : 'bg-rose-50/70 dark:bg-rose-950/15 text-rose-700 dark:text-rose-300'
      }`}>
        <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
        <span>以下号码支持无 SIM 卡离线拨打</span>
      </div>

      {/* Category Toggles */}
      <div className={`flex gap-1 ${getTabBarStyle(theme.id)}`}>
        {[
          { id: 'all', label: '全部电话' },
          { id: 'rescue', label: '🚨 紧急救援' },
          { id: 'road', label: '🛣️ 气象路况' },
          { id: 'consular', label: '🇨🇳 领事保护' }
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id as any)}
            className={`flex-1 py-1 text-[10px] font-black cursor-pointer ${getTabItemStyle(theme.id, selectedCategory === cat.id)}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Emergency Contacts List */}
      <div className="space-y-2.5">
        {filteredContacts.map((contact, idx) => (
          <div
            key={idx}
            className={`p-3.5 flex flex-col justify-between space-y-2.5 transition-all ${getCardStyle(theme.id, 'interactive')}`}
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1 pr-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h5 className="font-black text-stone-800 dark:text-stone-100 text-xs leading-tight">
                    {contact.name}
                  </h5>
                  <span className="px-1.5 py-0.5 text-[8px] font-black rounded bg-stone-100 dark:bg-stone-800 text-stone-500">
                    {contact.badge}
                  </span>
                </div>
                <p className="text-[10px] text-stone-500 dark:text-stone-400 leading-normal">
                  {contact.desc}
                </p>
              </div>

              {/* Instant Call Button / Direct Link */}
              <a
                href={`tel:${contact.phone}`}
                className={`p-1.5 rounded-lg border flex items-center justify-center shrink-0 cursor-pointer ${
                  isCyber
                    ? 'bg-[#00F5FF]/10 border-[#00F5FF]/20 text-[#00F5FF]'
                    : 'bg-rose-50 dark:bg-rose-950/20 border-rose-100 text-rose-500'
                }`}
                title="模拟拨号"
              >
                <Phone className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Quick Actions (Call link, and copy number) */}
            <div className="flex items-center justify-between pt-2 border-t border-dashed border-stone-200/50 dark:border-stone-800/50">
              <div className="flex items-center gap-1 text-[10px] font-mono font-black text-rose-600 dark:text-rose-400">
                <Phone className="w-3 h-3" />
                {contact.phone}
              </div>

              <CopyButton 
                textToCopy={contact.phone} 
                label="复制" 
                copiedLabel="已复制" 
                variant={isCyber ? 'cyber' : 'rose'} 
              />
            </div>
          </div>
        ))}
      </div>

      {/* Satellite SMS Generator for Offline Emergencies */}
      <div className={`p-4 space-y-3.5 relative overflow-hidden ${getCardStyle(theme.id, 'subcard')}`}>
        <div className="flex items-center gap-1.5 border-b border-stone-200/40 dark:border-stone-800/40 pb-2">
          <MessageSquare className="w-4 h-4 text-purple-500" />
          <h5 className="font-black text-stone-800 dark:text-stone-100">
            📌 离线卫星求助短信生成器 (Offline SOS SMS)
          </h5>
        </div>

        <p className="text-[10px] text-stone-400 dark:text-stone-500 leading-normal">
          偏远地区无网络信号时，SMS 卫星短信成功率极高。此工具可在离线状态下一键组合标准化救援格式，大幅减少打字时间和定位错漏。
        </p>

        <div className="space-y-2">
          {/* Situation Picker */}
          <div className="space-y-1">
            <label className="text-[9px] font-black opacity-75 uppercase">当前险情/状况</label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'car_stuck', label: '❄️ 车辆陷雪/泥' },
                { id: 'tire_flat', label: '🚗 车辆爆胎/损' },
                { id: 'lost', label: '🧭 Highland 迷路' },
                { id: 'injured', label: '🩹 受伤/极度受寒' },
                { id: 'custom', label: '✍️ 手动录入险情' }
              ].map((sit) => (
                <button
                  type="button"
                  key={sit.id}
                  onClick={() => setSosSituation(sit.id)}
                  className={`py-1.5 px-2 text-[10px] font-bold text-left border cursor-pointer rounded-lg transition-all ${
                    sosSituation === sit.id
                      ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-400/30'
                      : 'bg-stone-50 dark:bg-stone-800 text-stone-500 border-stone-200/40 dark:border-stone-800/40 hover:bg-stone-100'
                  }`}
                >
                  {sit.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom situation input */}
          {sosSituation === 'custom' && (
            <div className="space-y-1 animate-fadeIn">
              <label className="text-[9px] font-black opacity-75">请输入具体英文紧急状况 (如: Engine fire, no heat)</label>
              <input
                type="text"
                placeholder="例如: Engine oil leak, freezing temp"
                value={customDetail}
                onChange={(e) => setCustomDetail(e.target.value)}
                className={`w-full px-2.5 py-1.5 text-xs focus:outline-none ${getInputStyle(theme.id)}`}
              />
            </div>
          )}

          {/* Coordinates and numbers */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[9px] font-black opacity-75 flex items-center gap-1">
                <Compass className="w-3 h-3 text-stone-400" />
                当前经纬度 GPS Coordinates
              </label>
              <input
                type="text"
                value={gpsCoords}
                onChange={(e) => setGpsCoords(e.target.value)}
                className={`w-full px-2.5 py-1.5 font-mono text-[10px] focus:outline-none ${getInputStyle(theme.id)}`}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black opacity-75 flex items-center gap-1">
                <Users className="w-3 h-3 text-stone-400" />
                人数 Passengers
              </label>
              <select
                value={passengerCount}
                onChange={(e) => setPassengerCount(e.target.value)}
                className={`w-full px-2.5 py-1.5 text-xs focus:outline-none ${getInputStyle(theme.id)}`}
              >
                <option value="1">1 人 (1 Pax)</option>
                <option value="2">2 人 (2 Pax)</option>
                <option value="3">3 人 (3 Pax)</option>
                <option value="4">4 人 (4 Pax)</option>
                <option value="5+">5+ 人 (5+ Pax)</option>
              </select>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGenerateSms}
          className="w-full py-2 text-xs font-black bg-rose-600 text-white hover:bg-rose-500 rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          🆘 一键组合标准 112 求救文本
        </button>

        {showSmsResult && (
          <div className="p-3 bg-rose-500/5 border border-rose-500/10 rounded-lg space-y-2.5 animate-fadeIn">
            <div className="flex justify-between items-center border-b border-rose-500/10 pb-1.5">
              <span className="text-[9px] font-black text-rose-500 tracking-wider">SMS RECIPIENT: 112</span>
              <CopyButton 
                textToCopy={generatedSms} 
                label="复制求助短信" 
                copiedLabel="已复制" 
                variant="rose" 
              />
            </div>
            <pre className="font-mono text-[10px] text-stone-800 dark:text-stone-200 whitespace-pre-wrap leading-relaxed select-all">
              {generatedSms}
            </pre>
            <p className="text-[8px] text-stone-400 leading-normal">
              * 提示：求助短信已翻译为国际搜救队与112接线员最易读的英文格式，离线状态下粘贴发送即可。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
