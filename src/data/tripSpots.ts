export interface TripSpot {
  id: string;
  name: string;
  country: 'spain' | 'switzerland' | 'norway' | 'sweden' | 'netherlands' | 'china';
  description: string;
  mapQuery: string;
  wikiTitle: string;
  photoSpots: string[];
}

const spots: TripSpot[] = [
  { id:'born', name:'El Born 老城', country:'spain', description:'巴塞罗那最适合步行的中世纪街区之一，小巷、设计店和咖啡馆集中。', mapQuery:'El Born Barcelona', wikiTitle:'El Born', photoSpots:['Passeig del Born 长街纵深', 'Santa Maria del Mar 门前广场'] },
  { id:'sagrada', name:'圣家堂', country:'spain', description:'高迪最具代表性的建筑，外立面与室内彩色光影差异极大。', mapQuery:'Sagrada Familia Barcelona', wikiTitle:'Sagrada Família', photoSpots:['Plaça de Gaudí 水池倒影', '诞生立面斜侧广角'] },
  { id:'gothic', name:'巴塞罗那哥特区', country:'spain', description:'主教座堂、主教桥和古罗马遗迹密集，清晨最适合避开人流。', mapQuery:'Gothic Quarter Barcelona', wikiTitle:'Gothic Quarter, Barcelona', photoSpots:['Carrer del Bisbe 主教桥', 'Plaça del Rei 石阶'] },
  { id:'park-guell', name:'桂尔公园', country:'spain', description:'高迪将建筑、马赛克和自然地形结合的山坡公园，可俯瞰巴塞罗那。', mapQuery:'Park Güell Barcelona', wikiTitle:'Park Güell', photoSpots:['希腊剧场彩色长椅', '糖果屋入口轴线'] },
  { id:'montjuic', name:'蒙锥克山', country:'spain', description:'港口与城市之间的高地，集缆车、城堡、博物馆和日落视野于一体。', mapQuery:'Montjuïc Barcelona', wikiTitle:'Montjuïc', photoSpots:['MNAC 台阶城市轴线', 'Montjuïc Castle 海港侧'] },
  { id:'murren', name:'Mürren 米伦', country:'switzerland', description:'伯尔尼高地无汽车山村，可近距离看到艾格峰、僧侣峰与少女峰。', mapQuery:'Mürren Switzerland', wikiTitle:'Mürren', photoSpots:['村南端看三峰', 'Allmendhubel Flower Trail'] },
  { id:'lauterbrunnen', name:'Lauterbrunnen', country:'switzerland', description:'狭长冰川谷地与瀑布村，以 Staubbach 瀑布和两侧悬崖闻名。', mapQuery:'Lauterbrunnen Switzerland', wikiTitle:'Lauterbrunnen', photoSpots:['村口公路与教堂', 'Staubbachfall 下方草地'] },
  { id:'oeschinen', name:'Oeschinensee 厄希嫩湖', country:'switzerland', description:'坎德斯泰格上方的高山湖，碧蓝湖面与雪峰组成经典瑞士风景。', mapQuery:'Oeschinensee Switzerland', wikiTitle:'Oeschinen Lake', photoSpots:['湖西岸木屋前', '缆车站下行步道俯瞰点'] },
  { id:'bern', name:'伯尔尼老城', country:'switzerland', description:'被阿勒河环抱的世界遗产老城，拱廊、钟楼和红瓦屋顶保存完整。', mapQuery:'Bern Old Town Switzerland', wikiTitle:'Old City of Bern', photoSpots:['Rosengarten 玫瑰园俯瞰', 'Nydeggbrücke 桥头'] },
  { id:'huldefossen', name:'Huldefossen 瀑布', country:'norway', description:'靠近 Førde 的双股瀑布，水流落入开阔农田，停车后步行距离短。', mapQuery:'Huldefossen Norway', wikiTitle:'Huldefossen', photoSpots:['农田小路正面长焦', '瀑布下游溪流前景'] },
  { id:'loen', name:'Loen Skylift', country:'norway', description:'缆车直达 Hoven 山顶，天气清晰时可俯瞰 Nordfjord、Loen 湖和冰川群。', mapQuery:'Loen Skylift Norway', wikiTitle:'Loen Skylift', photoSpots:['Hoven 山顶玻璃护栏', 'Via Ferrata 吊桥方向'] },
  { id:'briksdal', name:'Briksdalsbreen Glacier', country:'norway', description:'Jostedalsbreen 冰川国家公园著名支流冰川，步道沿瀑布与峡谷上行。', mapQuery:'Briksdalsbreen Norway', wikiTitle:'Briksdalsbreen', photoSpots:['Kleivafossen 瀑布桥', '冰川湖岸安全线外'] },
  { id:'geiranger', name:'Geirangerfjord', country:'norway', description:'挪威代表性峡湾，陡峭山壁、瀑布与村庄构成世界遗产景观。', mapQuery:'Geirangerfjord Norway', wikiTitle:'Geirangerfjord', photoSpots:['Flydalsjuvet 观景台', 'Ørnesvingen 老鹰之路'] },
  { id:'stegastein', name:'Stegastein Viewpoint', country:'norway', description:'悬挑于 Aurlandsfjord 上方的木结构观景台，视线沿峡湾纵深展开。', mapQuery:'Stegastein Viewpoint Norway', wikiTitle:'Stegastein', photoSpots:['观景台尽头玻璃边', '停车场上方公路弯道'] },
  { id:'flam', name:'Flåm', country:'norway', description:'松恩峡湾支湾尽头的交通节点，以山谷铁路和游船闻名。', mapQuery:'Flåm Norway', wikiTitle:'Flåm', photoSpots:['港口草地看峡湾', 'Fretheim Hotel 后方坡地'] },
  { id:'floyen', name:'Fløyen 弗洛伊恩山', country:'norway', description:'卑尔根市中心最容易抵达的城市观景山，夜景和蓝调时刻尤其出片。', mapQuery:'Mount Fløyen Bergen', wikiTitle:'Fløyen', photoSpots:['山顶平台正对市区', 'Skomakerdiket 林间湖'] },
  { id:'henningsvaer', name:'Henningsvær 渔村', country:'norway', description:'由多座小岛组成的渔村，港口、木屋和海边足球场极具辨识度。', mapQuery:'Henningsvær Norway', wikiTitle:'Henningsvær', photoSpots:['Festvågtind 山腰俯瞰', 'Heimsundet Bridge 港口轴线'] },
  { id:'reinebringen', name:'Reinebringen', country:'norway', description:'罗弗敦经典高位观景徒步，石阶陡峭，顶部俯瞰 Reinefjorden 群岛。', mapQuery:'Reinebringen Norway', wikiTitle:'Reinebringen', photoSpots:['主观景平台峡湾全景', '靠内侧次平台避开拥挤'] },
  { id:'sakrisoy', name:'Sakrisøy', country:'norway', description:'以黄色木屋和锯齿山峰背景著称的小岛，连接 Reine 与 Hamnøy。', mapQuery:'Sakrisøy Norway', wikiTitle:'Sakrisøy', photoSpots:['Anitas Sjømat 对面桥边', 'Olstinden 山峰轴线'] },
  { id:'hamnoy', name:'Hamnøy Bridge', country:'norway', description:'红色 rorbu 木屋与 Festhelltinden 山峰构成罗弗敦最经典明信片画面。', mapQuery:'Hamnøy Bridge Norway', wikiTitle:'Hamnøy', photoSpots:['E10 桥东侧人行边', 'Eliassen Rorbuer 入口附近'] },
  { id:'ramberg', name:'Ramberg Beach', country:'norway', description:'北极圈白沙滩，海水颜色明亮，附近红色小屋是常见前景。', mapQuery:'Rambergstranda Norway', wikiTitle:'Ramberg, Nordland', photoSpots:['停车场西侧红屋', '沙滩东端低角度倒影'] },
  { id:'kabelvag', name:'Kabelvåg 老城', country:'norway', description:'罗弗敦历史悠久的渔业聚落，木屋街区和 Vågan Church 值得短停。', mapQuery:'Kabelvåg Norway', wikiTitle:'Kabelvåg', photoSpots:['Vågan Church 正面', '老港口木屋水面倒影'] },
  { id:'oslo-opera', name:'奥斯陆歌剧院', country:'norway', description:'白色石材屋顶可步行登顶，从水岸看建筑如冰面延伸入峡湾。', mapQuery:'Oslo Opera House', wikiTitle:'Oslo Opera House', photoSpots:['Sørenga 水岸侧面', '屋顶高点看 Barcode 天际线'] },
  { id:'gamla-stan', name:'Gamla Stan 老城', country:'sweden', description:'斯德哥尔摩历史核心，窄巷、彩色立面和王宫构成步行路线。', mapQuery:'Gamla Stan Stockholm', wikiTitle:'Gamla stan', photoSpots:['Stortorget 大广场', 'Mårten Trotzigs gränd 窄巷'] },
  { id:'montelius', name:'Monteliusvägen', country:'sweden', description:'Södermalm 山坡上的步道，可看骑士岛、市政厅和老城日落。', mapQuery:'Monteliusvägen Stockholm', wikiTitle:'Monteliusvägen', photoSpots:['Ivar Los Park 西侧', 'Mariaberget 木栈道'] },
  { id:'metro-art', name:'斯德哥尔摩地铁艺术站', country:'sweden', description:'多座地铁站以洞穴壁画、雕塑和灯光形成地下艺术长廊。', mapQuery:'T-Centralen blue line Stockholm', wikiTitle:'Stockholm metro art', photoSpots:['T-Centralen 蓝线站台', 'Stadion 彩虹洞穴'] },
  { id:'vasa', name:'瓦萨博物馆', country:'sweden', description:'展示 17 世纪沉船 Vasa 的专门博物馆，船体保存度极高。', mapQuery:'Vasa Museum Stockholm', wikiTitle:'Vasa Museum', photoSpots:['主展厅船首斜侧', '馆外桅杆与港口'] },
  { id:'city-hall', name:'斯德哥尔摩市政厅', country:'sweden', description:'诺贝尔奖晚宴举办地，砖红建筑与高塔是城市水岸地标。', mapQuery:'Stockholm City Hall', wikiTitle:'Stockholm City Hall', photoSpots:['Riddarholmen 岸边远眺', '市政厅花园拱廊'] },
  { id:'damrak', name:'Damrak 运河', country:'netherlands', description:'阿姆斯特丹中央车站前的城市水岸，窄屋倒影适合夜景拍摄。', mapQuery:'Damrak Amsterdam', wikiTitle:'Damrak', photoSpots:['Damrak Houses 水岸平台', 'Beurs van Berlage 对岸'] },
];

export const TRIP_SPOTS = spots;
export const TRIP_SPOT_BY_NAME = new Map(spots.map((spot) => [spot.name, spot]));

export function getTripSpot(name: string) {
  const matched = TRIP_SPOT_BY_NAME.get(name) || spots.find((spot) => name.includes(spot.name) || spot.name.includes(name));
  if (matched) return matched;
  return {
    id: `dynamic-${name}`,
    name,
    country: 'norway' as const,
    description: `${name} 是本次行程中的游览或交通停靠点。出发前请结合当天开放时间、天气和交通情况决定停留时长。`,
    mapQuery: name,
    wikiTitle: name,
    photoSpots: [`${name} 正面或入口视角`, `${name} 周边高处或开阔处`],
  };
}
