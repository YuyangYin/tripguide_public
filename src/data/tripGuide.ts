import { GuideItem } from '../types';
import { TRIP_SPOTS } from './tripSpots';

const countryLabels = { spain: '西班牙', switzerland: '瑞士', norway: '挪威', sweden: '瑞典', netherlands: '荷兰', china: '中国' } as const;

const spotItems: GuideItem[] = TRIP_SPOTS.filter((spot) => ['spain', 'switzerland', 'norway', 'sweden'].includes(spot.country)).map((spot) => ({
  id: `trip-spot-${spot.id}`,
  category: 'photo',
  country: spot.country as GuideItem['country'],
  title: spot.name,
  shortDesc: spot.description,
  iconName: 'MapPinned',
  tags: [countryLabels[spot.country], '本次行程', '景点', ...spot.photoSpots],
  location: spot.mapQuery,
  mapQuery: spot.mapQuery,
  wikiTitle: spot.wikiTitle,
  details: [
    { sectionTitle: '简单介绍', items: [spot.description] },
    { sectionTitle: '推荐机位', items: spot.photoSpots },
  ],
  quickChecklist: ['出发前检查开放时间与天气', '点击地图按钮确认实时路线', '人多时优先清晨或日落前抵达'],
}));

const guide = (item: GuideItem) => item;

const RESEARCH_DATE = '2026-09-23';
const xhsSearch = (keyword: string) => `https://www.xiaohongshu.com/search_result?keyword=${encodeURIComponent(keyword)}&source=web_search_result_notes`;
const wikiSource = (title: string) => `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`;

const curatedItems: GuideItem[] = [
  guide({
    id: 'curated-barcelona-booking', category: 'activity', country: 'spain', title: '巴塞罗那热门景点预约与入场',
    shortDesc: '圣家堂、桂尔公园按时段入场，迟到可能无法进入；把二维码和证件提前准备好。', iconName: 'TicketCheck',
    tags: ['巴塞罗那', '预约', '圣家堂', '桂尔公园'], location: 'Barcelona', bookingNeeded: 'yes', costRange: '$$',
    mapQuery: 'Sagrada Família Barcelona', wikiTitle: 'Sagrada Família',
    details: [
      { sectionTitle: '圣家堂', items: ['使用官方渠道购买指定日期和时间的门票，至少提前 15–20 分钟到达并预留安检时间。', '进入教堂需遵守着装与安检要求；塔楼、电梯或特殊区域可能因天气临时关闭，以当天通知为准。'] },
      { sectionTitle: '桂尔公园', items: ['2026 年 9 月游客购票时段为 09:30–19:30；预约时段后最多有 30 分钟入场宽限，逾时会失去入场资格。', '门票覆盖纪念区、绿地和观景区；离场后不能再次进入。优先从官方网页提前购买。'] },
      { sectionTitle: '小红书经验检索', items: [`搜索“巴塞罗那 圣家堂 入场 机位”“桂尔公园 路线”，重点核对排队、入口和拍照时段。资料检索日期：${RESEARCH_DATE}。`] },
    ],
    quickChecklist: ['保存离线门票二维码', '携带护照或证件', '核对预约入口与交通时间'],
    sources: [
      { title: '圣家堂官方参观信息', url: 'https://sagradafamilia.org/en/tickets' },
      { title: '桂尔公园官方票务与入场规则', url: 'https://parkguell.barcelona/en/buy-tickets' },
      { title: `小红书公开搜索：巴塞罗那景点预约（检索于 ${RESEARCH_DATE}）`, url: xhsSearch('巴塞罗那 圣家堂 桂尔公园 预约 避坑') },
      { title: 'Wikipedia 背景与图片：Sagrada Família', url: wikiSource('Sagrada Família') },
    ],
  }),
  guide({
    id: 'curated-barcelona-old-town', category: 'activity', country: 'spain', title: '老城步行、防盗与用餐习惯',
    shortDesc: 'El Born、哥特区和兰布拉大道适合步行，但拥挤区域要重点保护手机、护照和钱包。', iconName: 'ShieldCheck',
    tags: ['El Born', '哥特区', '防盗', 'Tapas'], location: 'El Born / Gothic Quarter', mapQuery: 'El Born Barcelona', wikiTitle: 'Gothic Quarter, Barcelona',
    details: [
      { sectionTitle: '随身安全', items: ['手机和钱包放在身前有拉链的包内，地铁上车、景点排队和餐厅露台尤其注意。', '不把手机放桌边、不把包挂椅背；有人主动靠近、泼洒液体或制造分心时先保护随身物品。'] },
      { sectionTitle: '用餐节奏', items: ['热门餐厅晚餐时间偏晚，已预约餐厅按确认邮件提前到店；海鲜饭等现做菜预留较长出餐时间。', '结账前核对是否已含面包、服务费或额外小食；刷卡时选择欧元计价，避免动态货币转换。'] },
      { sectionTitle: '小红书经验检索', items: [`搜索“巴塞罗那 防盗”“El Born 美食”“巴塞罗那 海鲜饭 避坑”。资料检索日期：${RESEARCH_DATE}。`] },
    ],
    quickChecklist: ['护照复印件与原件分开', '手机开启云端定位', '餐厅预约截图离线保存'],
    sources: [
      { title: '巴塞罗那旅游局实用信息', url: 'https://www.barcelonaturisme.com/wv3/en/' },
      { title: `小红书公开搜索：巴塞罗那防盗与美食（检索于 ${RESEARCH_DATE}）`, url: xhsSearch('巴塞罗那 防盗 美食 避坑') },
      { title: 'Wikipedia 背景与图片：Gothic Quarter', url: wikiSource('Gothic Quarter, Barcelona') },
    ],
  }),
  guide({
    id: 'curated-oeschinen-live', category: 'activity', country: 'switzerland', title: '厄希嫩湖当日运营与徒步选择',
    shortDesc: '2026 秋季缆车上山需预约时段；滑道受天气影响，出发前必须查看实时开放状态。', iconName: 'MountainSnow',
    tags: ['厄希嫩湖', '缆车', '徒步', '实时状态'], location: 'Kandersteg', bookingNeeded: 'yes', mapQuery: 'Oeschinensee cable car', wikiTitle: 'Oeschinen Lake',
    details: [
      { sectionTitle: '2026 秋季规则', items: ['官方信息显示 2026 年秋季缆车通常 08:30–17:00 运行；夏秋季至 11 月 8 日上山需要预约时段。', 'Swiss Travel Pass 对缆车通常为 50% 折扣，不代表已经包含上山时段；交通票和时段预约需分别确认。'] },
      { sectionTitle: '徒步与天气', items: ['缆车山站到湖边的基础步道约 20–35 分钟；高位全景线需要登山鞋和山地经验。', '山地滑道下雨会关闭。出发前查看官方 Live 页面，不以社交平台旧攻略判断当天开放情况。'] },
      { sectionTitle: '小红书经验检索', items: [`搜索“厄希嫩湖 徒步 路线”“厄希嫩湖 滑道 排队”，用来判断拍照点和体力分配。资料检索日期：${RESEARCH_DATE}。`] },
    ],
    quickChecklist: ['预约上山时段', '查看 Live 运营页', '穿防滑登山鞋并带防水层'],
    sources: [
      { title: '厄希嫩湖官方预约说明', url: 'https://www.oeschinensee.ch/en/reservation/' },
      { title: '厄希嫩湖官方实时运营状态', url: 'https://www.oeschinensee.ch/en/live/' },
      { title: '厄希嫩湖官方徒步安全信息', url: 'https://www.oeschinensee.ch/en/wandern/' },
      { title: `小红书公开搜索：厄希嫩湖徒步（检索于 ${RESEARCH_DATE}）`, url: xhsSearch('厄希嫩湖 徒步 滑道 攻略') },
      { title: 'Wikipedia 背景与图片：Oeschinen Lake', url: wikiSource('Oeschinen Lake') },
    ],
  }),
  guide({
    id: 'curated-murren-daytrip', category: 'activity', country: 'switzerland', title: '米伦高山一日游节奏',
    shortDesc: '无车山村换乘多，先锁定下山缆车与返程列车，再安排 Allmendhubel 步道。', iconName: 'CableCar',
    tags: ['米伦', 'Allmendhubel', '换乘', '高山天气'], location: 'Mürren', mapQuery: 'Mürren Switzerland', wikiTitle: 'Mürren',
    details: [
      { sectionTitle: '路线安排', items: ['米伦为无汽车山村，进出依赖火车、缆车和接驳；SBB App 中保存完整返程方案并关注临时站台变化。', '把最后一班下山交通作为硬截止时间，拍照和步道安排向前倒推，避免晚到 Wynigen。'] },
      { sectionTitle: '穿衣与机位', items: ['山上体感通常明显低于伯尔尼，采用短袖/长袖、抓绒、防风防水外套分层。', '村南端和 Allmendhubel 开阔区域适合看艾格峰、僧侣峰和少女峰；云层很低时不要为机位冒险离开标记步道。'] },
      { sectionTitle: '小红书经验检索', items: [`搜索“米伦 一日游 路线”“Allmendhubel 徒步 机位”。资料检索日期：${RESEARCH_DATE}。`] },
    ],
    quickChecklist: ['下载 SBB 离线行程', '记录最后下山班次', '准备保暖和防雨层'],
    sources: [
      { title: 'SBB 官方时刻与票务', url: 'https://www.sbb.ch/en' },
      { title: 'Jungfrau 地区官方信息', url: 'https://www.jungfrau.ch/en-gb/' },
      { title: `小红书公开搜索：米伦徒步与机位（检索于 ${RESEARCH_DATE}）`, url: xhsSearch('米伦 Allmendhubel 徒步 机位') },
      { title: 'Wikipedia 背景与图片：Mürren', url: wikiSource('Mürren') },
    ],
  }),
  guide({
    id: 'curated-amsterdam-transit', category: 'traffic', country: 'netherlands', title: '阿姆斯特丹夜间抵达与市内交通',
    shortDesc: '机场、Hotel2Stay、中央车站和 Damrak 之间优先使用火车、电车和地铁，进出站都要正确刷卡。', iconName: 'TramFront',
    tags: ['阿姆斯特丹', 'GVB', '夜间交通', '刷卡'], location: 'Amsterdam', mapQuery: 'Amsterdam Centraal', wikiTitle: 'Amsterdam Centraal station',
    details: [
      { sectionTitle: '交通使用', items: ['市内 GVB 覆盖地铁、电车和巴士；使用银行卡或交通票时按系统要求进站和出站都刷卡。', '从巴塞尔飞抵后先确认末班交通；若餐厅结束较晚，提前保存酒店的夜间公共交通和出租车备选路线。'] },
      { sectionTitle: '短停策略', items: ['只有一晚时以中央车站—Damrak—运河带为主，不为打卡横跨多个街区。', '自行车道与人行道边界明确，过街前同时观察汽车、电车和自行车。'] },
      { sectionTitle: '小红书经验检索', items: [`搜索“阿姆斯特丹 一晚 路线”“阿姆斯特丹 交通 刷卡”“Damrak 机位”。资料检索日期：${RESEARCH_DATE}。`] },
    ],
    quickChecklist: ['保存 Hotel2Stay 返回路线', '上下车均确认刷卡', '不要站在自行车道拍照'],
    sources: [
      { title: 'GVB 阿姆斯特丹公共交通官网', url: 'https://www.gvb.nl/en' },
      { title: 'I amsterdam 官方城市指南', url: 'https://www.iamsterdam.com/en' },
      { title: `小红书公开搜索：阿姆斯特丹短停路线（检索于 ${RESEARCH_DATE}）`, url: xhsSearch('阿姆斯特丹 一晚 路线 交通 避坑') },
      { title: 'Wikipedia 背景与图片：Amsterdam Centraal', url: wikiSource('Amsterdam Centraal station') },
    ],
  }),
  guide({
    id: 'curated-amsterdam-canal', category: 'photo', country: 'netherlands', title: 'Damrak 与运河带拍照路线',
    shortDesc: '中央车站前的窄屋倒影、运河桥和蓝调时刻适合短时间集中拍摄。', iconName: 'Camera',
    tags: ['Damrak', '运河', '夜景', '机位'], location: 'Damrak', mapQuery: 'Damrak Houses Amsterdam', wikiTitle: 'Damrak',
    details: [
      { sectionTitle: '推荐机位', items: ['Damrak Houses 水岸平台拍窄屋倒影，使用中长焦压缩建筑层次。', '蓝调时刻沿 Damrak 向中央车站方向拍摄灯光和水面；三脚架不要阻挡狭窄人行区域。'] },
      { sectionTitle: '小红书经验检索', items: [`搜索“阿姆斯特丹 Damrak 机位”“运河夜景 拍照”。资料检索日期：${RESEARCH_DATE}。`] },
    ],
    quickChecklist: ['镜头防雨布', '擦镜布', '留意自行车与电车'],
    sources: [
      { title: 'I amsterdam 官方城市探索', url: 'https://www.iamsterdam.com/en/explore' },
      { title: `小红书公开搜索：Damrak 拍照机位（检索于 ${RESEARCH_DATE}）`, url: xhsSearch('阿姆斯特丹 Damrak 机位 夜景') },
      { title: 'Wikipedia 背景与图片：Damrak', url: wikiSource('Damrak') },
    ],
  }),
  guide({
    id: 'curated-norway-road-live', category: 'traffic', country: 'norway', title: '挪威自驾当天必查三件事',
    shortDesc: '天气、道路事件和轮渡状态必须当天确认，峡湾与罗弗敦不要只按地图公里数估时。', iconName: 'Route',
    tags: ['自驾', '路况', '轮渡', '天气'], location: 'Western Norway / Lofoten', mapQuery: 'Norwegian Scenic Routes', wikiTitle: 'Norwegian County Road 63',
    details: [
      { sectionTitle: '每天出发前', items: ['查看挪威公路局实时路况、施工、封路和道路摄像头；恶劣天气时服从关闭和车队放行安排。', '峡湾轮渡、单车道和山路会显著拉长时间，导航到达时间之外保留停车、拍照和排队缓冲。', '电车出发前确认下一站和备选充电点，低温、逆风和山路会增加能耗。'] },
      { sectionTitle: '小红书经验检索', items: [`搜索“挪威 峡湾 自驾 充电”“罗弗敦 自驾 停车 避坑”，经验只用于补充，封路和渡轮以官方实时信息为准。资料检索日期：${RESEARCH_DATE}。`] },
    ],
    quickChecklist: ['查 Vegvesen 路况', '确认轮渡班次', '车辆电量和备选充电点', '下载离线地图'],
    sources: [
      { title: '挪威公路局实时交通信息', url: 'https://www.vegvesen.no/en/traffic-information/traffic-information/' },
      { title: 'Visit Norway 官方自驾信息', url: 'https://www.visitnorway.com/plan-your-trip/getting-around/by-car/' },
      { title: `小红书公开搜索：挪威自驾避坑（检索于 ${RESEARCH_DATE}）`, url: xhsSearch('挪威 峡湾 罗弗敦 自驾 充电 停车 避坑') },
      { title: 'Wikipedia 背景与图片：Norwegian County Road 63', url: wikiSource('Norwegian County Road 63') },
    ],
  }),
  guide({
    id: 'curated-aurlandsfjellet', category: 'activity', country: 'norway', title: 'Aurlandsfjellet 与 Stegastein 备选策略',
    shortDesc: '雪路景观公路与悬挑观景台风景突出，但是否通行必须依据当天官方路况。', iconName: 'Mountain',
    tags: ['Aurlandsfjellet', 'Stegastein', '景观公路', '备选路线'], location: 'Aurland', mapQuery: 'Stegastein Viewpoint Norway', wikiTitle: 'Stegastein',
    details: [
      { sectionTitle: '行程判断', items: ['高山公路可能因天气和季节关闭；不能通行时改走 Lærdal Tunnel 并仅前往 Stegastein 可达路段。', '观景台停车位有限，短暂停留、服从交通组织，不在狭窄道路临时停车拍摄。'] },
      { sectionTitle: '拍摄', items: ['观景台尽端拍峡湾纵深，风大时相机和手机必须使用腕带。', '云雾遮挡时降低停留时间，把时间留给 Flåm、Tvindefossen 或卑尔根。'] },
      { sectionTitle: '小红书经验检索', items: [`搜索“Aurlandsfjellet 自驾”“Stegastein 停车 机位”。资料检索日期：${RESEARCH_DATE}。`] },
    ],
    quickChecklist: ['当天查道路开放', '准备隧道备选路线', '观景台注意强风'],
    sources: [
      { title: '挪威国家旅游公路：Aurlandsfjellet', url: 'https://www.nasjonaleturistveger.no/en/routes/aurlandsfjellet/' },
      { title: '挪威公路局实时交通信息', url: 'https://www.vegvesen.no/en/traffic-information/traffic-information/' },
      { title: `小红书公开搜索：Stegastein 自驾机位（检索于 ${RESEARCH_DATE}）`, url: xhsSearch('Aurlandsfjellet Stegastein 自驾 停车 机位') },
      { title: 'Wikipedia 背景与图片：Stegastein', url: wikiSource('Stegastein') },
    ],
  }),
  guide({
    id: 'curated-reinebringen', category: 'activity', country: 'norway', title: 'Reinebringen 徒步放弃条件',
    shortDesc: '1978 级石阶、陡坡和无遮蔽山脊；雨、霜、强风或低云时应直接放弃。', iconName: 'Footprints',
    urgency: 'high', tags: ['Reinebringen', '徒步', '安全', '罗弗敦'], location: 'Reine', mapQuery: 'Reinebringen trailhead', wikiTitle: 'Reinebringen',
    details: [
      { sectionTitle: '出发条件', items: ['检查降雨、阵风、低云和步道公告；石阶湿滑、结霜或风力过强时不登顶。', '穿防滑徒步鞋，带水和保暖防水层；不要为了拍照跨出步道或站在悬崖边。'] },
      { sectionTitle: '时间与停车', items: ['越早到越容易停车和避开拥挤；为上下山和山顶等待预留充足时间。', '若天气不适合，改为 Reine Viewpoint、Sakrisøy、Hamnøy Bridge 等低风险机位。'] },
      { sectionTitle: '小红书经验检索', items: [`搜索“Reinebringen 台阶 难度”“Reinebringen 停车 天气”。社交平台照片不能替代当天安全判断。资料检索日期：${RESEARCH_DATE}。`] },
    ],
    quickChecklist: ['查看天气和步道公告', '防滑徒步鞋', '带头灯和备用保暖层', '预设低风险替代景点'],
    sources: [
      { title: 'Visit Lofoten 官方旅行信息', url: 'https://visitlofoten.com/en/' },
      { title: '挪威公路局实时交通信息', url: 'https://www.vegvesen.no/en/traffic-information/traffic-information/' },
      { title: `小红书公开搜索：Reinebringen 徒步（检索于 ${RESEARCH_DATE}）`, url: xhsSearch('Reinebringen 徒步 难度 停车 天气') },
      { title: 'Wikipedia 背景与图片：Reinebringen', url: wikiSource('Reinebringen') },
    ],
  }),
  guide({
    id: 'curated-lofoten-photo', category: 'photo', country: 'norway', title: '罗弗敦经典机位与停车礼仪',
    shortDesc: 'Hamnøy、Sakrisøy、Ramberg 和 Henningsvær 机位集中，但公路桥面和私人土地不能随意停车。', iconName: 'Camera',
    tags: ['Hamnøy', 'Sakrisøy', 'Ramberg', 'Henningsvær'], location: 'Lofoten', mapQuery: 'Hamnøy Bridge Norway', wikiTitle: 'Hamnøy',
    details: [
      { sectionTitle: '经典机位', items: ['Hamnøy Bridge 拍红色渔屋和山峰；Sakrisøy 拍黄色木屋与 Olstinden；Ramberg 拍白沙滩和红屋。', 'Henningsvær 海边足球场的高角度画面通常需要徒步或合法航拍条件，不要在公路上停车仰拍。'] },
      { sectionTitle: '礼仪与安全', items: ['只停正式停车位，不占居民入口、不跨越私人土地；桥边拍摄保持在人行安全区域。', '海边机位留意潮水、湿滑礁石和阵风；无人机需同时遵守当地禁飞、隐私和天气限制。'] },
      { sectionTitle: '小红书经验检索', items: [`搜索“罗弗敦 机位 定位”“Hamnøy Sakrisøy 拍照”。资料检索日期：${RESEARCH_DATE}。`] },
    ],
    quickChecklist: ['只用合法停车位', '手机相机加腕带', '不进入私人土地', '起飞前再次查无人机限制'],
    sources: [
      { title: 'Visit Lofoten 官方旅行信息', url: 'https://visitlofoten.com/en/' },
      { title: `小红书公开搜索：罗弗敦经典机位（检索于 ${RESEARCH_DATE}）`, url: xhsSearch('罗弗敦 Hamnøy Sakrisøy 机位 定位') },
      { title: 'Wikipedia 背景与图片：Hamnøy', url: wikiSource('Hamnøy') },
    ],
  }),
  guide({
    id: 'curated-oslo-short-stop', category: 'traffic', country: 'norway', title: '奥斯陆短停 City Walk 与机场衔接',
    shortDesc: '酒店靠近中央车站，清晨以歌剧院、Bjørvika 水岸和咖啡为主，严格按返店取行李时间倒推。', iconName: 'Clock3',
    tags: ['奥斯陆', '短停', '机场', '公共交通'], location: 'Oslo Sentralstasjon', mapQuery: 'Oslo Opera House', wikiTitle: 'Oslo Opera House',
    details: [
      { sectionTitle: '短停路线', items: ['Radisson Blu Plaza—中央车站—歌剧院—Bjørvika 水岸适合清晨短走，不建议临时增加跨城景点。', '把回酒店取行李和前往机场作为硬截止时间；机场列车和区域列车出发站台以当日屏幕为准。'] },
      { sectionTitle: '公共交通', items: ['市区交通使用 Ruter 查询实时路线和购买适用车票；机场列车是否包含在所选票种内需单独确认。'] },
      { sectionTitle: '小红书经验检索', items: [`搜索“奥斯陆 半日 City Walk”“奥斯陆机场 中央车站”。资料检索日期：${RESEARCH_DATE}。`] },
    ],
    quickChecklist: ['设置返店闹钟', '确认机场交通票种', '提前查看出发站台'],
    sources: [
      { title: 'Ruter 奥斯陆公共交通官网', url: 'https://ruter.no/en/' },
      { title: 'Visit Oslo 官方城市指南', url: 'https://www.visitoslo.com/en/' },
      { title: `小红书公开搜索：奥斯陆短停（检索于 ${RESEARCH_DATE}）`, url: xhsSearch('奥斯陆 半日 City Walk 机场 交通') },
      { title: 'Wikipedia 背景与图片：Oslo Opera House', url: wikiSource('Oslo Opera House') },
    ],
  }),
  guide({
    id: 'curated-stockholm-transit', category: 'traffic', country: 'sweden', title: '斯德哥尔摩机场、地铁与 80 路轮渡',
    shortDesc: '机场进城、地铁艺术站和 80 路轮渡分别核对票种与班次，机场交通不要默认包含在市内票中。', iconName: 'ShipWheel',
    tags: ['斯德哥尔摩', 'SL', '80路轮渡', '机场'], location: 'Stockholm', mapQuery: 'T-Centralen Stockholm', wikiTitle: 'Stockholm metro',
    details: [
      { sectionTitle: '交通核对', items: ['使用 SL 官方渠道查看地铁、公交和轮渡实时班次；80 路轮渡受日期和时段影响，出发当天重新确认。', 'Arlanda Express、通勤铁路与机场巴士的价格和适用票种不同，买票前确认终点和行李便利性。'] },
      { sectionTitle: '地铁艺术', items: ['T-Centralen 蓝线、Stadion、Solna centrum 可按同一方向串联；拍照时不要挡住扶梯、站台边缘和通勤人流。'] },
      { sectionTitle: '小红书经验检索', items: [`搜索“斯德哥尔摩 地铁艺术 路线”“80路轮渡 IKEA”“Arlanda 进城”。资料检索日期：${RESEARCH_DATE}。`] },
    ],
    quickChecklist: ['查 SL 实时班次', '核对机场票是否另购', '下载地铁艺术站清单'],
    sources: [
      { title: 'SL 斯德哥尔摩公共交通官网', url: 'https://sl.se/en/in-english' },
      { title: 'Visit Stockholm 官方城市指南', url: 'https://www.visitstockholm.com/' },
      { title: `小红书公开搜索：斯德哥尔摩交通与地铁（检索于 ${RESEARCH_DATE}）`, url: xhsSearch('斯德哥尔摩 地铁艺术 80路轮渡 机场') },
      { title: 'Wikipedia 背景与图片：Stockholm metro', url: wikiSource('Stockholm metro') },
    ],
  }),
  guide({
    id: 'curated-stockholm-design', category: 'grocery', country: 'sweden', title: '斯德哥尔摩设计购物与退税整理',
    shortDesc: 'NK、Svenskt Tenn、Åhléns 和老城纪念品适合集中采购，购买后立即整理退税单与未使用商品。', iconName: 'ShoppingBag',
    tags: ['购物', '北欧设计', '退税', '伴手礼'], location: 'Stockholm city centre', mapQuery: 'Svenskt Tenn Stockholm', wikiTitle: 'Svenskt Tenn',
    details: [
      { sectionTitle: '购物路线', items: ['NK 和 Åhléns City 适合集中比较品牌与日用品；Svenskt Tenn 偏经典瑞典家居设计；老城纪念品要比较产地。', '易碎品和液体提前规划托运/手提位置，结合每段航班行李额，不要到机场才重新分装。'] },
      { sectionTitle: '退税整理', items: ['购买时确认商户是否支持退税并核对姓名、护照信息；单据、商品和付款凭证放在一起。', '离开欧盟的最后一个出境点可能要求查验未使用商品，退税前不要拆封或托运无法出示的高价值物品。'] },
      { sectionTitle: '小红书经验检索', items: [`搜索“斯德哥尔摩 必买”“瑞典 伴手礼”“Svenskt Tenn 购物”。资料检索日期：${RESEARCH_DATE}。`] },
    ],
    quickChecklist: ['退税单逐张核对姓名', '商品与单据放在一起', '提前计算行李重量'],
    sources: [
      { title: 'Visit Stockholm 官方购物指南', url: 'https://www.visitstockholm.com/see-do/shopping/' },
      { title: `小红书公开搜索：斯德哥尔摩购物（检索于 ${RESEARCH_DATE}）`, url: xhsSearch('斯德哥尔摩 必买 瑞典 伴手礼 Svenskt Tenn') },
      { title: 'Wikipedia 背景与图片：Svenskt Tenn', url: wikiSource('Svenskt Tenn') },
    ],
  }),
];

export const TRIP_GUIDE_ITEMS: GuideItem[] = [
  ...curatedItems,
  guide({ id:'spain-transport', category:'traffic', country:'spain', title:'巴塞罗那交通与防盗', shortDesc:'机场地铁、夜班巴士和人流密集区防盗重点。', iconName:'TrainFront', tags:['巴塞罗那','地铁','防盗'], details:[{sectionTitle:'交通',items:['机场 T1 乘 L9 Sud，可在 Torrassa 换 L1。','地铁末班后使用官方夜巴 NitBus 或正规网约车。']},{sectionTitle:'防盗',items:['兰布拉大道、地铁换乘站和景点入口把手机与证件放在身前拉链包。','餐厅露台不要把手机放桌边，行李不要挂椅背。']}], mapQuery:'Barcelona Metro' }),
  guide({ id:'spain-parking', category:'parking', country:'spain', title:'巴塞罗那停车与低排放区', shortDesc:'市中心不建议开车，注意 ZBE 低排放区与蓝绿停车位。', iconName:'SquareParking', tags:['停车','ZBE'], details:[{sectionTitle:'建议',items:['本次巴塞罗那段优先地铁和步行。','临时租车进入城区前核对车辆是否符合 ZBE 低排放区要求。','蓝线通常短时付费，绿线多优先居民，按现场标识和机器说明为准。']}]}),
  guide({ id:'spain-food', category:'food', country:'spain', title:'巴塞罗那餐饮清单', shortDesc:'米饭、海鲜、牛排与咖啡的本次预约点。', iconName:'Utensils', tags:['餐厅','巴塞罗那'], details:[{sectionTitle:'已排入行程',items:["L'Arrosseria Xàtiva：西班牙米饭，预留较长出餐时间。",'Paco Meralgo：晚间 tapas。',"O'Retorno / Lluritu：海鲜午餐。",'Carnal Steak House：已预约牛排晚餐。','Nomad Coffee：老城步行路线中的咖啡停靠。']}]}),
  guide({ id:'spain-shopping', category:'grocery', country:'spain', title:'巴塞罗那购物与退税', shortDesc:'Passeig de Gràcia、老城设计店和超市采购。', iconName:'ShoppingBag', tags:['购物','退税'], details:[{sectionTitle:'推荐',items:['Passeig de Gràcia：品牌店、Zara 与城市旗舰店。','El Born：独立设计、冰箱贴与小型手作店。','Santa Caterina Market：食品与纪念品。']},{sectionTitle:'退税',items:['非欧盟居民在支持 Tax Free 的商户索取退税单，离开欧盟前在最后一个欧盟出境机场办理。']}]}),
  guide({ id:'swiss-transport', category:'traffic', country:'switzerland', title:'瑞士通票与转车规则', shortDesc:'本次伯尔尼、因特拉肯、劳特布龙嫩和坎德斯泰格换乘。', iconName:'TrainFront', tags:['瑞士通票','火车'], details:[{sectionTitle:'使用',items:['上车前确认线路是否完全覆盖，山地缆车常为免费或折扣而非全免。','SBB App 保存当天换乘方案并留意站台临时变化。','伯尔尼寄存柜按柜计费，繁忙时段预留找柜时间。']}]}),
  guide({ id:'swiss-hiking', category:'activity', country:'switzerland', title:'米伦与厄希嫩湖徒步', shortDesc:'高山短线徒步、缆车衔接与天气备选。', iconName:'Footprints', tags:['徒步','米伦','厄希嫩湖'], details:[{sectionTitle:'注意',items:['高山天气变化快，带防水外层与保暖层。','最后一班缆车和返程火车时间优先于拍照。','湿滑或能见度差时缩短湖边和鲜花谷路线。']}]}),
  guide({ id:'swiss-shopping', category:'grocery', country:'switzerland', title:'瑞士超市与采购', shortDesc:'Coop / Migros 补给与民宿自炊。', iconName:'ShoppingBasket', tags:['Coop','Migros','采购'], details:[{sectionTitle:'采购建议',items:['伯尔尼车站 Coop 适合转车间隙采购即食餐、面包和晚餐食材。','周日和晚间营业时间更短，优先使用车站店。','山区价格更高，饮水和零食在大站提前买。']}]}),
  guide({ id:'norway-driving', category:'traffic', country:'norway', title:'挪威峡湾与罗弗敦自驾', shortDesc:'窄路、单车道桥、轮渡、电车补能和天气节奏。', iconName:'CarFront', tags:['自驾','E10','峡湾'], details:[{sectionTitle:'驾驶',items:['山路与 E10 实际均速显著低于导航限速，给轮渡和航班留缓冲。','单车道桥和会车点按先到与路权标识让行。','遇到横风、暴雨、结冰或低能见度时主动降低行程强度。']},{sectionTitle:'电车',items:['每天出发前确认 Tesla 超充与备选充电点。','还车按租车公司要求补足电量并拍照留存。']}]}),
  guide({ id:'norway-tolls', category:'parking', country:'norway', title:'挪威过路费、停车与轮渡', shortDesc:'AutoPASS、城市停车和 Geiranger 车渡。', iconName:'BadgeParking', tags:['AutoPASS','停车','轮渡'], details:[{sectionTitle:'费用',items:['租车通常通过 AutoPASS 自动记录收费，账单由租车公司后续结算。','停车必须按标牌、App 或机器完成，保留电子凭证。','Geiranger–Hellesylt 车渡提前核对车辆票、乘员和报到时间。']}]}),
  guide({ id:'norway-aurora', category:'aurora', country:'norway', title:'罗弗敦极光与天气', shortDesc:'Lyngvær 民宿周边低光污染观测与拍摄。', iconName:'Sparkles', tags:['极光','罗弗敦'], details:[{sectionTitle:'观测',items:['先看云量再看极光指数，晴空比高 KP 更重要。','避开车灯和民宿照明，给眼睛至少 10 分钟适应。','海边拍摄注意潮水、强风和湿滑岩石。']},{sectionTitle:'拍摄',items:['手机固定后使用夜景模式，避免数码变焦。','相机可从广角、F1.8–2.8、ISO 1600、2–8 秒试起。']}]}),
  guide({ id:'norway-shopping', category:'grocery', country:'norway', title:'挪威超市与伴手礼', shortDesc:'REMA 1000、Coop、羊毛制品和罗弗敦本地商品。', iconName:'ShoppingBag', tags:['超市','伴手礼'], details:[{sectionTitle:'补给',items:['Svolvær 的 REMA 1000 一次买齐罗弗敦多日食材。','山区小店关门早，晚餐自炊食材不要拖到返程再买。']},{sectionTitle:'伴手礼',items:['挪威羊毛、鳕鱼制品和本地咖啡优先选择有清晰产地标识的产品。']}]}),
  guide({ id:'sweden-transit', category:'traffic', country:'sweden', title:'斯德哥尔摩交通与地铁艺术', shortDesc:'Arlanda Express、市内票和艺术站串联方式。', iconName:'Train', tags:['斯德哥尔摩','地铁'], details:[{sectionTitle:'交通',items:['机场进城比较 Arlanda Express 与通勤铁路的时间和价格。','艺术站集中打卡时按同一线路串联，避免反复出站。','80 路轮渡受季节班次影响，出发当天查 SL App。']}]}),
  guide({ id:'sweden-shopping', category:'grocery', country:'sweden', title:'斯德哥尔摩购物', shortDesc:'北欧家居、设计品和市中心百货。', iconName:'ShoppingBag', tags:['购物','设计'], details:[{sectionTitle:'推荐',items:['NK：市中心综合百货。','Svenskt Tenn：经典瑞典室内设计。','Åhléns City：日用品、服装和本地品牌。','Gamla Stan：纪念品注意比较产地和价格。']}]}),
  guide({ id:'sweden-food', category:'food', country:'sweden', title:'瑞典餐饮与 Fika', shortDesc:'咖啡休息、肉丸、肉桂卷与老城用餐。', iconName:'Coffee', tags:['Fika','餐饮'], details:[{sectionTitle:'建议',items:['下午安排一次 Fika，尝试肉桂卷或豆蔻面包。','老城核心区价格偏高，可到 Södermalm 用餐。','瑞典自来水可直接饮用，餐厅可询问 tap water。']}]}),
  ...spotItems,
];
