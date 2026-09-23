import { useState } from 'react';
import { ExternalLink, MapPin, MessageSquare, Phone, ShieldAlert } from 'lucide-react';
import { ThemeConfig } from '../types';
import { CopyButton } from './CopyButton';
import { getCardStyle, getInputStyle, getTabBarStyle, getTabItemStyle } from '../lib/themeStyles';

interface EmergencyPhonesProps { theme: ThemeConfig; }
type Country = 'spain' | 'switzerland' | 'norway' | 'sweden';

const CONTACTS: Record<Country, { name: string; phone: string; desc: string; source?: string }[]> = {
  spain: [
    { name: '欧洲统一紧急电话', phone: '112', desc: '警察、消防与急救，紧急情况优先拨打。' },
    { name: '西班牙国家警察', phone: '091', desc: '治安、盗抢和警方紧急协助。' },
    { name: '驻西班牙使馆领保', phone: '+34 915438877', desc: '中国公民紧急领事保护与协助。', source: 'https://es.china-embassy.gov.cn/lqsw/lingshi13/' },
    { name: '驻巴塞罗那总领馆领保', phone: '+34 932125622', desc: '加泰罗尼亚地区中国公民紧急协助。', source: 'https://es.china-embassy.gov.cn/chn/lqsw/lsbhhxz/202505/t20250528_11635513.htm' },
  ],
  switzerland: [
    { name: '欧洲统一紧急电话', phone: '112', desc: '无法判断部门时使用。' },
    { name: '瑞士警察', phone: '117', desc: '报警、盗抢与人身安全。' },
    { name: '瑞士消防', phone: '118', desc: '火灾与救援。' },
    { name: '瑞士医疗急救', phone: '144', desc: '救护车与紧急医疗。' },
    { name: '瑞士道路救援', phone: '140', desc: '车辆故障与道路救援。' },
    { name: '驻瑞士使馆领保', phone: '+41 313501258', desc: '中国公民 24 小时领事保护。', source: 'https://ch.china-embassy.gov.cn/ls_fw_s/tz/202509/t20250929_11719844.htm' },
  ],
  norway: [
    { name: '挪威警察', phone: '112', desc: '人身危险、犯罪和紧急警方协助。', source: 'https://www.politiet.no/kontakt-politiet/ring-politiet' },
    { name: '挪威消防救援', phone: '110', desc: '火灾、车辆起火与救援。' },
    { name: '挪威医疗急救', phone: '113', desc: '严重受伤、急症与救护车。' },
    { name: '挪威警察非紧急', phone: '02800', desc: '报案、咨询和非紧急警务。' },
    { name: '挪威道路信息', phone: '175', desc: '路况、封路、山路与轮渡信息。' },
    { name: '驻挪威使馆领保', phone: '+47 93066621', desc: '中国公民 24 小时领事保护。', source: 'https://no.china-embassy.gov.cn/chn/lsfw_0/' },
  ],
  sweden: [
    { name: '瑞典统一紧急电话', phone: '112', desc: '警察、消防、救护车与海上救援。' },
    { name: '瑞典警察非紧急', phone: '11414', desc: '非紧急报案和警方咨询；中国号码可拨 +46 77 114 14 00。' },
    { name: '瑞典医疗咨询', phone: '1177', desc: '非危及生命的医疗咨询。' },
    { name: '驻瑞典使馆领保', phone: '+46 763383654', desc: '中国公民 24 小时领事保护。', source: 'https://se.china-embassy.gov.cn/lsfw/gywm/lxwm/201403/t20140311_2996121.htm' },
  ],
};

const COUNTRY_OPTIONS: { id: Country; label: string; emoji: string }[] = [
  { id: 'spain', label: '西班牙', emoji: '🇪🇸' }, { id: 'switzerland', label: '瑞士', emoji: '🇨🇭' },
  { id: 'norway', label: '挪威', emoji: '🇳🇴' }, { id: 'sweden', label: '瑞典', emoji: '🇸🇪' },
];

export default function EmergencyPhones({ theme }: EmergencyPhonesProps) {
  const [country, setCountry] = useState<Country>('spain');
  const [situation, setSituation] = useState('vehicle');
  const [detail, setDetail] = useState('');
  const [gps, setGps] = useState('请粘贴手机地图中的经纬度');
  const [sms, setSms] = useState('');

  const generate = () => {
    const situationText: Record<string, string> = {
      vehicle: 'Our vehicle has broken down / we had a traffic accident.',
      injured: 'A traveler is injured or seriously ill and needs medical help.',
      lost: 'We are lost while hiking and need rescue assistance.',
      theft: 'Our passport or valuables were stolen. We need police assistance.',
      custom: detail || 'We need emergency assistance.',
    };
    setSms(`EMERGENCY HELP\nCountry: ${COUNTRY_OPTIONS.find((item) => item.id === country)?.label}\nLocation: ${gps}\nSituation: ${situationText[situation]}\nPeople: 4 Chinese travelers. Please reply in English.`);
  };

  return <div className="space-y-4 text-xs">
    <div className={`flex items-center gap-2 p-3 ${getCardStyle(theme.id, 'subcard')}`}><ShieldAlert className="h-4 w-4 text-rose-500" /><span className="font-bold">危及生命时直接拨打当地紧急号码；先联系当地救援，再联系领事保护。</span></div>
    <div className={`grid grid-cols-4 gap-1 ${getTabBarStyle(theme.id)}`}>{COUNTRY_OPTIONS.map((item) => <button key={item.id} onClick={() => setCountry(item.id)} className={`py-1.5 text-[10px] font-black ${getTabItemStyle(theme.id, country === item.id)}`}>{item.emoji}{item.label}</button>)}</div>
    <div className="space-y-2">{CONTACTS[country].map((contact) => <div key={`${country}-${contact.phone}`} className={`p-3 ${getCardStyle(theme.id, 'interactive')}`}><div className="flex items-start gap-2"><div className="min-w-0 flex-1"><h5 className="font-black">{contact.name}</h5><p className="mt-1 text-[10px] opacity-60">{contact.desc}</p></div><a href={`tel:${contact.phone}`} className="rounded-lg bg-rose-500/10 p-2 text-rose-500"><Phone className="h-4 w-4" /></a></div><div className="mt-2 flex items-center justify-between border-t border-dashed border-stone-200/30 pt-2"><b className="font-mono text-rose-500">{contact.phone}</b><div className="flex items-center gap-1"><CopyButton textToCopy={contact.phone} label="复制" copiedLabel="已复制" variant="rose" />{contact.source && <a href={contact.source} target="_blank" rel="noreferrer" className="rounded p-1 text-sky-500"><ExternalLink className="h-3.5 w-3.5" /></a>}</div></div></div>)}</div>
    <div className={`space-y-3 p-4 ${getCardStyle(theme.id, 'subcard')}`}><h4 className="flex items-center gap-1.5 font-black"><MessageSquare className="h-4 w-4 text-purple-500" />英文求助文本生成器</h4><select value={situation} onChange={(event) => setSituation(event.target.value)} className={`w-full px-3 py-2 ${getInputStyle(theme.id)}`}><option value="vehicle">车辆故障 / 交通事故</option><option value="injured">受伤 / 急病</option><option value="lost">徒步迷路</option><option value="theft">护照 / 财物被盗</option><option value="custom">其他情况</option></select>{situation === 'custom' && <input value={detail} onChange={(event) => setDetail(event.target.value)} placeholder="用中文或英文描述" className={`w-full px-3 py-2 ${getInputStyle(theme.id)}`} />}<label className="block text-[9px] font-black opacity-60"><MapPin className="mr-1 inline h-3 w-3" />GPS / 地址<input value={gps} onChange={(event) => setGps(event.target.value)} className={`mt-1 w-full px-3 py-2 font-mono text-[10px] ${getInputStyle(theme.id)}`} /></label><button onClick={generate} className="w-full rounded-lg bg-rose-600 py-2 font-black text-white">生成求助文本</button>{sms && <div className="rounded-lg bg-rose-500/5 p-3"><pre className="whitespace-pre-wrap text-[10px]">{sms}</pre><div className="mt-2"><CopyButton textToCopy={sms} label="复制求助文本" copiedLabel="已复制" variant="rose" /></div></div>}</div>
    <div className="rounded-lg bg-amber-500/10 px-3 py-2 text-[9px] leading-relaxed text-amber-600">外交部全球领事保护热线：+86 10 12308 / +86 10 65612308。使领馆不会要求向所谓“安全账户”转账。</div>
  </div>;
}
