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

export const TRIP_GUIDE_ITEMS: GuideItem[] = [
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
