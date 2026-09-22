import { GuideItem } from '../types';

/** WorkBuddy 手册全量 97 条，一条问答一张卡。 */
export const GUIDE_ITEMS: GuideItem[] = [
  {
    id: "wb-01",
    category: "traffic",
    country: "both",
    title: "中国驾照与国际驾照要求",
    shortDesc: "持中国驾照能否直接租车、需要补什么证件。",
    iconName: "FileText",
    urgency: "high",
    tags: ["中国驾照与国际驾照要求","冰岛","挪威"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "中国驾照为中文（非拉丁字母），冰岛警察与租车行只认有法律效力的驾照文件：驾照原件 + 国际驾照（International Driving Permit, IDP，1949 版）或公证翻译件。Hertz 冰岛明确不接受普通翻译件；小租车行可能放行，但遇警察查照即失效。",
          "出发前到本地交管/公安部门或指定机构办理 1949 版 IDP，与原件两样一起带，别只带翻译件。驾龄须满 1 年（大型 SUV/房车部分公司要 3 年）。",
          "挪威：拉丁字母驾照通常可直接用，但同样建议带 IDP 兜底。"
        ]
      }
    ],
    quickChecklist: ["办 1949 版国际驾照 IDP","驾照原件和 IDP 一起带","驾龄满 1 年，SUV/房车部分要 3 年"]
  },
  {
    id: "wb-02",
    category: "traffic",
    country: "both",
    title: "租车年龄与年轻驾驶附加费",
    shortDesc: "几岁能租、25 岁以下有什么附加费。",
    iconName: "FileText",
    urgency: "medium",
    tags: ["租车年龄与年轻驾驶附加费","冰岛","挪威"],
    details: [
      {
        sectionTitle: "车型最低年龄说明",
        items: [
          "经济/紧凑/中型车20 岁部分公司 23 岁",
          "SUV / 4x4 / 房车23 岁豪华车部分 25 岁"
        ]
      },
      {
        sectionTitle: "补充",
        items: [
          "25 岁以下加收年轻驾驶附加费（Young Driver Fee）$10–30 / 天（挪威 15–40 欧元/天）。冰岛 Cars Iceland、Reykjavik Cars 免收此费。"
        ]
      }
    ],
    quickChecklist: ["核对车型最低租车年龄","25 岁以下问清年轻驾驶附加费","Cars Iceland / Reykjavik Cars 免此费"]
  },
  {
    id: "wb-03",
    category: "traffic",
    country: "both",
    title: "押金与信用卡要求",
    shortDesc: "取车要刷多少押金、用什么卡。",
    iconName: "Receipt",
    urgency: "high",
    tags: ["押金与信用卡要求","冰岛","挪威"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "必须主驾驶员名下实体信用卡（Visa / MasterCard）。不接受 Apple Pay、虚拟卡、借记卡（除非买 Platinum 全险）。押金为预授权（冻结，非实扣）：冰岛轿车约 €1,000（约 ¥7,500）、房车 €1,700；挪威 500–2,000 欧元。",
          "出发前确认卡额度足够覆盖押金冻结，可带两张卡分摊预授权，避免单卡额度不足取不到车。"
        ]
      }
    ],
    quickChecklist: ["带主驾名下实体信用卡","确认额度够冻押金","不接受 Apple Pay / 虚拟卡 / 借记卡"]
  },
  {
    id: "wb-04",
    category: "traffic",
    country: "both",
    title: "车型与驱动选择",
    shortDesc: "两驱还是四驱、按什么定。",
    iconName: "Compass",
    urgency: "medium",
    tags: ["车型与驱动选择","冰岛"],
    details: [
      {
        sectionTitle: "场景选车依据",
        items: [
          "夏季 1 号环岛 + 黄金圈 + 南岸2WD铺装路面，够用",
          "F 路（内陆高地）4x4（法律强制）2WD 进 F 路违法 + 保险失效",
          "冬季 / 10 月底起4x4 + 冬季胎冰雪路面抓地"
        ]
      },
      {
        sectionTitle: "补充",
        items: [
          "冰岛手动挡为主，自动挡须提前订并加价；左舵换挡与国内右舵习惯不同，不熟就订自动挡。"
        ]
      }
    ],
    quickChecklist: ["夏季环岛 + 黄金圈选 2WD 即可","F 路必须 4x4，2WD 违法且保险失效","冬季或 10 月底起选 4x4 + 冬季胎"]
  },
  {
    id: "wb-05",
    category: "traffic",
    country: "both",
    title: "取车验车与取证",
    shortDesc: "取还车如何留证，避免还车后被索赔划痕。",
    iconName: "FileText",
    urgency: "high",
    tags: ["取车验车与取证","冰岛"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "取车：绕车一周拍视频（开时间戳），逐面拍下划痕、凹痕、轮胎、玻璃、油表刻度，仪表盘里程一并入镜；当场向柜台确认燃油类型（柴油 Diesel / 汽油 Bensín）并记下24 小时救援电话。还车：同样再拍一遍全车视频，最好让店员当面验车签字确认。",
          "损害争议高频点：车门（风）、挡风玻璃（碎石）、底盘（F 路）、轮胎——取车时逐项核对原始状态。"
        ]
      }
    ],
    quickChecklist: ["取车绕车拍带时间戳的视频","拍清划痕、轮胎、玻璃、油表","记下 24 小时救援电话和燃油类型"]
  },
  {
    id: "wb-06",
    category: "traffic",
    country: "both",
    title: "额外驾驶员与里程油费政策",
    shortDesc: "多人轮流开、里程与油费政策怎么算。",
    iconName: "FileText",
    urgency: "high",
    tags: ["额外驾驶员与里程油费政策","冰岛","挪威"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "多人轮流开必须在租车协议登记 extra driver（额外收费），未登记司机出事不赔付。里程分有限里程 / 无限里程，长途选无限。油费分满油还车（full-to-full）与满到空（full-to-empty），前者占多数。",
          "取车时问清油费政策；满油还车的，还车前 5–10 km 内加满并保留最后一张加油小票作凭证。"
        ]
      },
      {
        sectionTitle: "补充",
        items: [
          "冰岛有欧洲别处没有的专有险种（碎石 / 沙尘 / 涉水 / 动物），自付额分三档；挪威 CDW 自付额为欧洲最高之一。险种名常以缩写出现，先认准再买。"
        ]
      }
    ],
    quickChecklist: ["多人轮流开必须登记 extra driver","长途选无限里程","满油还车前 5–10 km 加满并留小票"]
  },
  {
    id: "wb-07",
    category: "traffic",
    country: "iceland",
    title: "冰岛基础三险与自付额分档",
    shortDesc: "租车已含哪些基础险、自付额多少。",
    iconName: "Shield",
    urgency: "high",
    tags: ["冰岛基础三险与自付额分档","冰岛"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "冰岛租车法定必含三项：TPL 第三方责任险（法律强制）、CDW 碰撞险（自付额 350,000 ISK 轿车 / 480,000 ISK 房车）、TP 盗抢险（自付额 0）。"
        ]
      },
      {
        sectionTitle: "档位自付额（excess）说明",
        items: [
          "Basic 基础350,000 ISK≈ ¥17,500，出险自付高",
          "Premium 进阶110,000–150,000 ISK降自付 + 加碎石/沙尘险",
          "Platinum 全险0 ISK含轮胎/动物险，免押金"
        ]
      },
      {
        sectionTitle: "补充",
        items: [
          "自付额（self-risk / excess）= 出险时你自掏腰包的上限，超出部分由保险赔。"
        ]
      }
    ],
    quickChecklist: ["认清 TPL / CDW / TP 三件基础险","记下本车自付额档位","出险自付额 = 你最多自掏的上限"]
  },
  {
    id: "wb-08",
    category: "traffic",
    country: "iceland",
    title: "冰岛特色险种缩写对照",
    shortDesc: "SCDW、GP、SADW、轮胎/涉水/动物/拖车各保什么。",
    iconName: "Shield",
    urgency: "high",
    tags: ["冰岛特色险种缩写对照","冰岛"],
    details: [
      {
        sectionTitle: "险种（缩写）中文保什么",
        items: [
          "SCDW超级碰撞险再降 CDW 自付额",
          "GP碎石险 Gravel Protection挡风玻璃/车头灯/前杠被石子击伤（高频，无自付）",
          "SADW / SAAP沙尘火山灰险 Sand & Ash南岸风暴沙石刮伤车漆/玻璃",
          "Tire轮胎险爆胎/轮毂，但换胎自己动手（Platinum 才含）",
          "Animal动物碰撞险撞羊/马（Platinum 才含）",
          "River Crossing涉水险仅 4x4 F 路，发动机/变速箱进水",
          "Towing拖车险拖车费最高 600,000 ISK，投保后自付 35,000"
        ]
      },
      {
        sectionTitle: "补充",
        items: [
          "南岸风大，GP 碎石险 + SADW 沙尘险必加；进 F 路另加涉水险。"
        ]
      }
    ],
    quickChecklist: ["南岸必加 GP 碎石险 + SADW 沙尘险","进 F 路另加涉水险","轮胎 / 动物碰撞多半要 Platinum"]
  },
  {
    id: "wb-09",
    category: "traffic",
    country: "iceland",
    title: "冰岛保险不赔清单",
    shortDesc: "哪些情形买了保险也一分不赔。",
    iconName: "ShieldAlert",
    urgency: "high",
    tags: ["冰岛保险不赔清单","冰岛"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "任何档位都不赔：车门（强风）、底盘/undercarriage、挡风玻璃（基础险）、涉水、越野/off-road、酒驾、加错燃油、丢钥匙、座椅烧洞。房车在 15 m/s（54 km/h）以上风力行驶受损也不赔。",
          "取车时逐条对照租车协议确认哪几项被除外，重点盯车门与挡风玻璃。"
        ]
      }
    ],
    quickChecklist: ["车门、底盘、挡风玻璃基础险常不赔","越野、酒驾、加错油一律不赔","取车时逐条核对除外项"]
  },
  {
    id: "wb-10",
    category: "traffic",
    country: "norway",
    title: "挪威保险自付额与碎石/动物风险",
    shortDesc: "挪威 CDW 自付额多少、有哪些特殊风险。",
    iconName: "Shield",
    urgency: "high",
    tags: ["挪威保险自付额与碎石/动物风险","罗弗敦"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "挪威 CDW 自付额 8,000–20,000 NOK（欧洲最高之一）；SCDW 柜台价 150–300 NOK/天。基础险不含轮胎、玻璃、底盘、内饰，且碎石路（gravel road）损伤常被排除。",
          "罗弗敦多碎石与麋鹿/驯鹿（moose/reindeer）横穿，动物碰撞维修可达 50,000–200,000 NOK。可在第三方买 excess 险（5–8 欧元/天），比柜台 SCDW 便宜一半。"
        ]
      }
    ],
    quickChecklist: ["挪威 CDW 自付额 8,000–20,000 NOK","碎石路损伤常被排除","可买第三方 excess 险比柜台便宜"]
  },
  {
    id: "wb-11",
    category: "traffic",
    country: "both",
    title: "信用卡自带保险的坑",
    shortDesc: "用信用卡自带租车险能不能省下加购费。",
    iconName: "ShieldAlert",
    urgency: "high",
    tags: ["信用卡自带保险的坑","冰岛","挪威"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "信用卡租车险多数不覆盖冰岛专有风险（碎石/沙尘/涉水），且理赔是你先垫付车行、再向银行报销，回程后才到账。",
          "若依赖信用卡保险，先确认条款是否含冰岛并保留全部单据；否则直接买车行全险，出险即结算、无需垫付。"
        ]
      },
      {
        sectionTitle: "补充",
        items: [
          "冰岛超速以固定罚单表（sektir）执行，非现场裁量；摄像头覆盖乡村公路，处罚不区分游客与本地人，租车公司会把罚单转嫁到租车人名下并加收手续费。"
        ]
      }
    ],
    quickChecklist: ["信用卡租车险多不含冰岛碎石/沙尘/涉水","靠信用卡险要先垫付给车行","不确定条款就直接买车行全险"]
  },
  {
    id: "wb-12",
    category: "traffic",
    country: "iceland",
    title: "冰岛限速规则",
    shortDesc: "冰岛全国限速上限是多少，不同道路类型各限多少。",
    iconName: "Gauge",
    urgency: "high",
    tags: ["冰岛限速规则","冰岛"],
    details: [
      {
        sectionTitle: "道路类型限速说明",
        items: [
          "城市 / 居民区50 km/h住宅区与学校区再降至 30 km/h，按路牌执行",
          "铺装乡村路（含 1 号环岛公路大部分）90 km/h全国上限，任何路段不超过 90 km/h",
          "碎石路（gravel road）80 km/h松散路面抓地力骤降，多数 F 路为碎石",
          "单车道桥（einbreið brú）50 km/h先到先过"
        ]
      }
    ],
    quickChecklist: ["城区 50，乡村铺装 90，碎石 80","全国上限 90 km/h","单车道桥 50 km/h、先到先过"]
  },
  {
    id: "wb-13",
    category: "traffic",
    country: "iceland",
    title: "冰岛超速罚款规则",
    shortDesc: "超速被拍后罚多少、什么程度会吊销驾照。",
    iconName: "Gauge",
    urgency: "high",
    tags: ["冰岛超速罚款规则","冰岛"],
    details: [
      {
        sectionTitle: "情形罚款（ISK）备注",
        items: [
          "轻微超速（摄像头自约 +5 km/h 起拍）5,000–20,00090 区开到 95 已可能被拍",
          "超速 10–20 km/h10,000–30,000—",
          "90 区开 110（超 20）15,000约 ¥750",
          "90 区开 121（超 31）45,000约 ¥2,250",
          "超 40 km/h 或累计 13 次违章—吊销驾照（licence suspension）"
        ]
      },
      {
        sectionTitle: "补充",
        items: [
          "限期内缴纳：按罚单截至日付款可享 25% 折扣。"
        ]
      }
    ],
    quickChecklist: ["90 区开到 95 就可能被拍","限期内缴可享 25% 折扣","超 40 km/h 或累计 13 次会吊销"]
  },
  {
    id: "wb-14",
    category: "traffic",
    country: "iceland",
    title: "冰岛酒驾限制",
    shortDesc: "冰岛酒精上限与处罚。",
    iconName: "ShieldAlert",
    urgency: "high",
    tags: ["冰岛酒驾限制","冰岛"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "血液酒精浓度（BAC）上限 0.02%，为全球最严之一，半杯啤酒即可能超标。",
          "最低罚 70,000 ISK 并吊销驾照 ≥2 个月。饮酒后不坐驾驶位，任何含酒精饮品后不碰方向盘。"
        ]
      }
    ],
    quickChecklist: ["BAC 上限 0.02%，半杯啤酒就可能超","酒后不坐驾驶位","最低罚 70,000 ISK 并吊销 ≥2 个月"]
  },
  {
    id: "wb-15",
    category: "traffic",
    country: "iceland",
    title: "冰岛其他违章罚款",
    shortDesc: "未开灯、未系安全带、手持手机、越野驾驶各自的处罚。",
    iconName: "Gauge",
    urgency: "high",
    tags: ["冰岛其他违章罚款","冰岛","挪威"],
    details: [
      {
        sectionTitle: "违章罚款（ISK）说明",
        items: [
          "未开大灯≈10,000昼夜、全年均须开近光/日行灯",
          "未系安全带20,000按人计；驾驶员对 15 岁以下乘客担责",
          "手持手机40,000仅允许免提",
          "越野驾驶（off-road driving）100,000–500,000刑事罪；苔原恢复需数十年"
        ]
      },
      {
        sectionTitle: "补充",
        items: [
          "挪威以固定罚单（forenklet forelegg）执行超速，2025-03-15 起启用新版罚表；乡村公路摄像头密集，租车公司代缴会加收手续费。"
        ]
      }
    ],
    quickChecklist: ["昼夜全年开近光/日行灯","全员系安全带，15 岁以下司机担责","越野碾苔藓是刑事罪"]
  },
  {
    id: "wb-16",
    category: "traffic",
    country: "norway",
    title: "挪威限速规则",
    shortDesc: "挪威不同道路类型的限速，尤其是罗弗敦 E10 沿线。",
    iconName: "Gauge",
    urgency: "high",
    tags: ["挪威限速规则","罗弗敦"],
    details: [
      {
        sectionTitle: "道路类型限速说明",
        items: [
          "城市 / 村镇30–50 km/h按路牌",
          "乡村路（默认）80 km/h—",
          "标线双向快速路90 km/h—",
          "高速公路（E6 / E18 等）100–110 km/h—",
          "罗弗敦 E10 沿线60–80 km/h弯道与隧道前常临时降至 60；受房车压车流，实际均速常低于 50 km/h"
        ]
      }
    ],
    quickChecklist: ["挪威乡村默认 80，高速 100–110","罗弗敦 E10 常 60–80","弯道和隧道前看临时限速牌"]
  },
  {
    id: "wb-17",
    category: "traffic",
    country: "norway",
    title: "挪威超速罚款规则",
    shortDesc: "超速罚单金额如何按超出幅度与限速区分档。",
    iconName: "Gauge",
    urgency: "high",
    tags: ["挪威超速罚款规则","挪威"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "超出幅度限速 50 区限速 80 区",
          "超 1–5 km/h1,200 NOK1,200 NOK",
          "超 6–10 km/h3,250 NOK3,250 NOK",
          "超 11–15 km/h5,800 NOK5,200 NOK",
          "超 16–20 km/h8,400 NOK7,250 NOK",
          "超 21–25 km/h13,050 NOK9,800 NOK",
          "超 26–30 km/h吊销 + 上庭13,050 NOK"
        ]
      }
    ],
    quickChecklist: ["超 1–5 km/h 也要罚 1,200 NOK","50 区超 26 即吊销上庭","按官方罚表执行，游客同样适用"]
  },
  {
    id: "wb-18",
    category: "traffic",
    country: "norway",
    title: "挪威吊销阈值",
    shortDesc: "超速到什么程度会当场吊销驾照。",
    iconName: "ShieldAlert",
    urgency: "high",
    tags: ["挪威吊销阈值","挪威"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "限速 ≤60 km/h 区超 26 km/h、限速 ≥70 km/h 区超 36 km/h，即现场吊销驾照并移交法院，游客同样适用。"
        ]
      }
    ],
    quickChecklist: ["≤60 区超 26 km/h 当场吊销","≥70 区超 36 km/h 当场吊销","游客同样适用，移交法院"]
  },
  {
    id: "wb-19",
    category: "traffic",
    country: "norway",
    title: "挪威其他违章罚款",
    shortDesc: "手持手机、闯红灯的处罚金额。",
    iconName: "Gauge",
    urgency: "high",
    tags: ["挪威其他违章罚款","冰岛","挪威"],
    details: [
      {
        sectionTitle: "违章罚款",
        items: [
          "手持手机7,450 NOK",
          "闯红灯6,800–10,200 NOK"
        ]
      },
      {
        sectionTitle: "补充",
        items: [
          "租车转嫁：租车公司代缴罚单会另收 300–500 NOK 手续费。"
        ]
      },
      {
        sectionTitle: "补充",
        items: [
          "加错燃油是两国自驾损失最惨重的单项错误——发动机损坏且保险不赔。冰岛油枪配色与多数国家相反，是误判的主因。"
        ]
      }
    ],
    quickChecklist: ["手持手机罚 7,450 NOK","闯红灯 6,800–10,200 NOK","租车代缴另加 300–500 NOK 手续费"]
  },
  {
    id: "wb-20",
    category: "emergency",
    country: "iceland",
    title: "加错燃油应急",
    shortDesc: "冰岛油枪颜色与多数国家相反，如何选对油、加错后怎么办。",
    iconName: "Fuel",
    urgency: "high",
    tags: ["加错燃油应急","冰岛"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "冰岛油枪配色与常见认知相反：绿色 = 汽油（Bensín / Okt 95），黑色 = 柴油（Dísill）。切勿按本国习惯判断颜色。",
          "每次插枪前：低头看油箱盖内侧贴纸（标注 DIESEL 或 BENSIN 95）→ 再核对租车钥匙牌上的油品标签 → 最后读油枪本体字样，三者一致才插枪。",
          "一旦加错：不要拧钥匙、不要点火。点火会把错误燃料泵入全油路，扩大损坏且保险不赔。留在原地，立即拨打租车公司救援电话，说明\"misfuelling\"。"
        ]
      }
    ],
    quickChecklist: ["冰岛绿枪是汽油、黑枪是柴油","油箱盖、钥匙牌、油枪字样三者一致再插","加错立刻停火，拨 misfuelling 救援"]
  },
  {
    id: "wb-21",
    category: "traffic",
    country: "iceland",
    title: "无人自助油站支付",
    shortDesc: "冰岛自助/无人油站如何用卡完成支付。",
    iconName: "Fuel",
    urgency: "high",
    tags: ["无人自助油站支付","冰岛"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "冰岛多数油站为自助、部分完全无人。支付需芯片 + 4 位 PIN 卡；美国式\"芯片 + 签名\"卡会被拒。插卡后先选语言（旗标/English）→ 输 PIN → 选油枪号 → 选\"加满（Fylla dæluna）\"或固定金额（5,000 / 10,000 ISK）。",
          "系统会预授权冻结最高 20,000–25,000 ISK，仅实际加油金额入账。提前向银行确认卡片 PIN 可用；备一张 N1 / Orkan 预付油卡（5,000 / 10,000 ISK 面值）作兜底。"
        ]
      }
    ],
    quickChecklist: ["无人油站必须芯片 + 4 位 PIN","先选英语再输 PIN 再选枪号","系统会预授权冻结 20,000–25,000 ISK"]
  },
  {
    id: "wb-22",
    category: "traffic",
    country: "iceland",
    title: "N1 加油卡替代芯片卡",
    shortDesc: "没有芯片 + 4 位 PIN 信用卡时，冰岛油站如何免预授权加油。",
    iconName: "Fuel",
    urgency: "medium",
    tags: ["N1","加油卡替代芯片卡","冰岛"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "买 N1 加油卡（5,000 / 10,000 / 20,000 ISK 三档面值），加油站便利店均有售；卡内余额可再买新卡，用不完可在便利店消费，彻底避开信用卡预授权冻结。"
        ]
      }
    ],
    quickChecklist: ["没有 PIN 卡就买 N1 加油卡","5,000 / 10,000 / 20,000 ISK 三档","用不完可在便利店花掉"]
  },
  {
    id: "wb-23",
    category: "traffic",
    country: "both",
    title: "偏远路段油料中断应急",
    shortDesc: "两国哪些路段油站缺口长，如何避免断油。",
    iconName: "Fuel",
    urgency: "high",
    tags: ["偏远路段油料中断应急","罗弗敦"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "环岛公路无油站缺口：Kirkjubæjarklaustur → Höfn 约 200 km、Höfn → Egilsstaðir 约 270 km 无正规油站；高地 F 路全程无站。挪威罗弗敦 E10 山区段站间距可达 150 km，仅 Svolvær、Leknes、Reine、Å 等城镇有站。",
          "执行\"半箱规则（half-tank rule）\"：油表到 50% 即在下个油站补满，不赌下一站是否营业或故障。驶入长缺口前，在前一个城镇加满，并在导航里核对到下一油站的里程是否小于续航。"
        ]
      }
    ],
    quickChecklist: ["油表到一半就补满，不赌下一站","进长缺口前在上一个城镇加满","高地 F 路全程无站"]
  },
  {
    id: "wb-24",
    category: "traffic",
    country: "both",
    title: "油站品牌与油价",
    shortDesc: "两国油站品牌、价格水平与营业时长。",
    iconName: "Fuel",
    urgency: "medium",
    tags: ["油站品牌与油价","冰岛","罗弗敦"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "冰岛：N1Olís / ÓBOrkanAtlantsolía，ÓB 通常最便宜，N1 网络最广且多 24 小时；油价约 270–320 ISK/L。挪威：罗弗敦段约 20+ NOK/L，自助站夜间无人，仍须 PIN 卡。"
        ]
      },
      {
        sectionTitle: "补充",
        items: [
          "停车费与路费多走线上应用，漏缴会收到追缴加罚款的单据，且租车公司代缴加手续费。"
        ]
      }
    ],
    quickChecklist: ["ÓB 通常最便宜，N1 网点最广","冰岛油价大约 270–320 ISK/L","挪威自助站夜间也要 PIN 卡"]
  },
  {
    id: "wb-25",
    category: "parking",
    country: "both",
    title: "判断停车场是否收费",
    shortDesc: "北欧路边/景区一堆 P 牌，怎么快速判断到底要不要缴费。",
    iconName: "ParkingSquare",
    urgency: "high",
    tags: ["判断停车场是否收费","冰岛","罗弗敦"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "冰岛速判 3 步：①看 P 牌下方是否印有 \"Gjaldskylda\"（挪威语\"需付费\"变体，冰岛用同类词）或价格牌（ISK/时）；②环顾停车场入口 20 米内有没有 Parka 蓝色标识 / 缴费机 / 二维码；③打开 Parka App 定位车牌位置，能查到当前停车场名就是收费的，查不到基本免费。景区停车场 99% 收费——Þingvellir p1、Seljalandsfoss、Skógafoss 老区、Dyrhólaey、Kerið（含门票）都要缴。公认免费：Skógafoss 现在的主停车场、Reynisfjara 黑沙滩、Öxarárfoss p3（辛格维利尔小停车场）、大部分远足起点。",
          "挪威速判 3 步：①P 牌下有 \"Avgift\"（收费）或 NOK/h / NOK/døgn 费率贴纸的一律收费；②贴纸上会有 EasyPark 4 位区号（Zone Code） 或 Skiltet 二维码——有码即收费；③标 \"Gratis\"（免费）、只有孤零零一个 P 无任何数字/机器/贴纸的基本免费。罗弗敦景区几乎全收费——Reine Utsiktspunkt、Haukland、Ryten、Uttakleiv、Hamnøy Viewpoint、Ramberg、Skagsanden 都要缴（35–200 NOK 不等）。",
          "一个原则解决 90% 疑虑：只要有 P 铺装 + 费率贴纸/二维码/机器任一元素，一律当收费处理，用 App 扫车牌确认——App 里查不到该场地才判为免费；宁可多花 30 秒确认，也别赌租车公司会不会寄追缴单。",
          "特殊坑点：①冰岛景区免费\"1 小时时段\"也要在 Parka 里预设时长，否则超时段自动补收费+高额手续费；②挪威私人土地（如 Nusfjord 渔村 150 NOK 入村费）不算停车费，是入村门票，缴费机在村口栏杆；③城市路边看划线颜色：白色多数免费、蓝黄带数字或彩色标注区一定收费（雷市市中心多为 P1–P4 收费区）。"
        ]
      }
    ],
    quickChecklist: ["有费率牌 / 机器 / 二维码就当收费","冰岛看 Gjaldskylda 和 Parka","挪威看 Avgift 和 EasyPark 区号"]
  },
  {
    id: "wb-26",
    category: "parking",
    country: "iceland",
    title: "冰岛景点停车场缴费",
    shortDesc: "冰岛热门景点哪些收费、金额多少、如何缴。",
    iconName: "ParkingSquare",
    urgency: "high",
    tags: ["冰岛景点停车场缴费","冰岛"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "Seljalandsfoss（塞里雅兰瀑布）900 ISK；Skógafoss（斯科加瀑布）免费；Kerið 火山口为入场收费（约 450 ISK）；黑沙滩 Reynisfjara 停车免费但见「高危路况」浪风险。",
          "缴费走 Parka 应用或 P 标志处扫码。离开前回到应用确认订单已生成、扣费成功，再驶离；否则事后追缴连同罚款一起寄到租车公司。"
        ]
      }
    ],
    quickChecklist: ["Seljalandsfoss 停车 900 ISK","Skógafoss 主停车场免费","离开前确认 Parka 订单已入账"]
  },
  {
    id: "wb-27",
    category: "parking",
    country: "iceland",
    title: "冰岛停车免费时段与补缴陷阱",
    shortDesc: "停好后才设时长、或离开后才想缴费，会怎样。",
    iconName: "ParkingSquare",
    urgency: "high",
    tags: ["冰岛停车免费时段与补缴陷阱","冰岛"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "冰岛停车逻辑是\"停好当下、立刻计时\"：若没在 App 里预设总时长，免费时段一过 App 自动停止计费，后续停留时间不被记录，同样被系统补收费；离开后才想缴费，通常无法补缴，账单 = 停车费 + 租车公司高额手续费。",
          "停好车第一件事：打开 App 设好预计停车总时长，再离开车位。"
        ]
      }
    ],
    quickChecklist: ["停好当下立刻在 App 设时长","免费时段过了再缴通常补不上","离开后补缴会变停车费 + 高额手续费"]
  },
  {
    id: "wb-28",
    category: "parking",
    country: "iceland",
    title: "Parka 手续费与现场机器替代",
    shortDesc: "Parka 每次缴费收多少手续费、如何绕开。",
    iconName: "ParkingSquare",
    urgency: "medium",
    tags: ["Parka","手续费与现场机器替代","冰岛"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "Parka 每次缴费收 86 ISK 手续费（可开 480 ISK 包月）；部分景区 App 实际加价约 10%。",
          "想省钱：到停车场现场自助机输入车牌刷信用卡或 Apple Pay，免手续费；机器位置多在通往景点方向的顺路处。短期多停用 App 包月才划算。"
        ]
      }
    ],
    quickChecklist: ["Parka 每次加收 86 ISK 手续费","现场自助机刷卡可免手续费","短期多停才值得开包月"]
  },
  {
    id: "wb-29",
    category: "parking",
    country: "norway",
    title: "罗弗敦停车场缴费",
    shortDesc: "罗弗敦停车场价格与缴费方式。",
    iconName: "ParkingSquare",
    urgency: "high",
    tags: ["罗弗敦停车场缴费","罗弗敦"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "Reine 外港（Reine Outer Harbour）35 NOK/小时；Ryten、Haukland 海滩等一天 100–200 NOK。",
          "用 EasyPark 或 Parka 缴费，输入正确车牌号（挪威车牌），付后截图留存车牌与金额作为凭证。"
        ]
      }
    ],
    quickChecklist: ["Reine 外港约 35 NOK/小时","Ryten / Haukland 一天 100–200 NOK","缴完截图留存车牌和金额"]
  },
  {
    id: "wb-30",
    category: "parking",
    country: "norway",
    title: "罗弗敦 EasyPark 隐形缴费失败",
    shortDesc: "EasyPark 缴费\"看似成功实际未入账\"及漏缴后果。",
    iconName: "ParkingSquare",
    urgency: "high",
    tags: ["罗弗敦","EasyPark","隐形缴费失败"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "自助缴费机默认丹麦语，先手动切英文；中国大陆 Apple ID 搜不到 EasyPark，须备一台安卓机负责缴费；两次\"付款成功\"可能实际未入账（隐形缴费失败）。",
          "每次缴费当场核对订单成功再离开。漏缴不留罚单≠没事——还车时租车行会筛查全部停车记录，每笔未缴记录加收 158 NOK 代办服务费。"
        ]
      }
    ],
    quickChecklist: ["缴费机先切英文，别停在丹麦语","当场核对订单入账再离开","漏缴还车时每笔加 158 NOK 代办费"]
  },
  {
    id: "wb-31",
    category: "traffic",
    country: "norway",
    title: "隧道与桥路费（AutoPASS）",
    shortDesc: "挪威隧道/桥路费如何自动结算。",
    iconName: "Coins",
    urgency: "high",
    tags: ["隧道与桥路费","AutoPASS","挪威"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "挪威租车自带 AutoPASS 芯片，隧道/桥费全程自动扣，离境后从卡划扣，无需现场操作。自驾车（非租车）须提前注册 AutoPASS 账户或 FerryPay，否则外籍车牌事后经 EPASS24 追缴并加费。",
          "取车时向柜台确认：该车 AutoPASS 是否已开通、路费如何结算。"
        ]
      }
    ],
    quickChecklist: ["挪威租车已带 AutoPASS，过门架自动扣","取车时问清路费怎么结算","自驾车须提前注册，否则事后加费追缴"]
  },
  {
    id: "wb-32",
    category: "traffic",
    country: "iceland",
    title: "冰岛隧道费在线缴纳时限",
    shortDesc: "冰岛隧道收费标识不明显，漏缴会怎样。",
    iconName: "Coins",
    urgency: "high",
    tags: ["冰岛隧道费在线缴纳时限","冰岛"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "众神瀑布（Goðafoss）与阿克雷里之间的隧道（Vaðlaheiðargöng）每次收费 2,216 ISK，收费标识极不明显，是公认的\"隐藏陷阱\"。",
          "过隧道后 24 小时内到 veggjald.is（原 tunnel.is）线上缴费，逾期会吃高额罚单。把该网站提前存书签。"
        ]
      }
    ],
    quickChecklist: ["Vaðlaheiðargöng 单程 2,216 ISK","过隧道后 24 小时内上 veggjald.is 缴","逾期转租车行并加催收费"]
  },
  {
    id: "wb-33",
    category: "parking",
    country: "iceland",
    title: "停车缴费异常核对",
    shortDesc: "Parka 应用绑定/扣费异常如何处理。",
    iconName: "ParkingSquare",
    urgency: "high",
    tags: ["停车缴费异常核对"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "小红书多帖反馈 Parka 存在绑定/扣费异常：缴费后务必核对车牌号与扣费金额，留截图凭证；若显示失败但已扣款，立即截图联系应用客服或租车公司，避免因\"未缴费\"被追缴加罚款。"
        ]
      }
    ],
    quickChecklist: ["缴费后核对车牌和扣费金额","显示失败但已扣款立刻截图","异常马上找 Parka 客服或租车行"]
  },
  {
    id: "wb-34",
    category: "traffic",
    country: "norway",
    title: "电车充电点兼容确认",
    shortDesc: "罗弗敦电车充电点的占位与接口兼容。",
    iconName: "Fuel",
    urgency: "medium",
    tags: ["电车充电点兼容确认","冰岛","罗弗敦"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "罗弗敦充电点存在占位/接口兼容问题：出发前查清车型适配的充电接口与充电网络，规划沿途可用的充电点并确认可用状态，避免到点无法充电。"
        ]
      },
      {
        sectionTitle: "补充",
        items: [
          "车门被风反向吹断是冰岛自驾最高频、最昂贵的非事故损失，且\"全险\"常明确除外车门、挡风玻璃与底盘。"
        ]
      }
    ],
    quickChecklist: ["出发前确认车型充电接口","沿途桩位先查占用和可用状态","补给桩主要在 Svolvær 与 Leknes"]
  },
  {
    id: "wb-35",
    category: "emergency",
    country: "iceland",
    title: "强风开车门受损应急",
    shortDesc: "强风下如何停车、开门、下车，避免车门被吹断。",
    iconName: "Wind",
    urgency: "high",
    tags: ["强风开车门受损应急","冰岛"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "冰岛阵风（wind gust）可超过 30–50 m/s（约 108–180 km/h，相当于 12 级以上台风）；20 m/s（约 72 km/h）时单手已无法控制车门。车门铰链被反向吹开到极限即撕裂。",
          "停车方向：永远逆风停放——车头或车尾对准来风方向，让风从车前/车后吹来，使两扇门都位于背风侧（leeward side）。切勿侧面朝风。",
          "开门动作：两手死死握住门把手内侧，先只开 10–15 cm 的缝，停住，感受风的拉力；确认拉力可控后再缓慢推开，全程不松手。门一旦被风夺走，立即双手抱回、用整个身体抵住门板，合上并锁止。",
          "下车顺序：背风侧先下，下车者转身用身体从内侧顶住门；驾驶员最后下，下车前先压低重心、背对来风。",
          "损失金额参考：车门吹断常达 10,000–30,000 RMB（约 1,400–4,300 USD），且 CDW 全险多不含车门/挡风玻璃/底盘。"
        ]
      }
    ],
    quickChecklist: ["永远逆风停，别让车门侧面朝风","开门只开 10–15 cm 再感受拉力","两手握住门，全程不松手"]
  },
  {
    id: "wb-36",
    category: "emergency",
    country: "iceland",
    title: "强风行驶稳定性",
    shortDesc: "强风中如何握方向、控制车身不被风推偏。",
    iconName: "Wind",
    urgency: "high",
    tags: ["强风行驶稳定性"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "桥面、山口、开阔海岸为阵风最烈区。双手握方向盘 9 点与 3 点，双臂微屈留出修正余量；车身被风推偏时轻带方向、不要猛打；遇横向强风立即减速，车越高越早减速（厢式车/房车受风面积最大）。"
        ]
      }
    ],
    quickChecklist: ["桥面、山口、海岸按阵风最烈区开","双手 9 点和 3 点握方向","横向强风立刻减速，房车更早减速"]
  },
  {
    id: "wb-37",
    category: "emergency",
    country: "iceland",
    title: "风力分级响应",
    shortDesc: "黄色/橙色/红色风警下各自该做什么。",
    iconName: "Wind",
    urgency: "high",
    tags: ["风力分级响应","冰岛"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "黄色预警（be aware）→ 减速、逆风停；橙色（be prepared）→ 避免暴露路段开门；红色（take action）→ 禁止出行，原地等待。"
        ]
      }
    ],
    quickChecklist: ["黄色风警：减速、逆风停","橙色风警：避开暴露路段开门","红色风警：禁止出行，原地等"]
  },
  {
    id: "wb-38",
    category: "emergency",
    country: "iceland",
    title: "车门吹断夜间救援",
    shortDesc: "车门被吹断后如何联系救援、临时处置。",
    iconName: "Wind",
    urgency: "high",
    tags: ["车门吹断夜间救援","冰岛"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "拨打 112 会转告联系租车公司；租车公司语音提示\"已休息\"时，直接按 3 可接通人工，约 30 分钟到场。到场前用绑带把车门固定在车座上，避免门板再被风掀；切勿顶风低速硬开长路。"
        ]
      }
    ],
    quickChecklist: ["车门吹断先打 112 再转租车行","语音提示休息时按 3 接人工","到场前用绑带把车门固定在座椅上"]
  },
  {
    id: "wb-39",
    category: "traffic",
    country: "iceland",
    title: "租车平台\"假全险\"与风沙碎石险",
    shortDesc: "第三方平台\"全险\"与车行保险的衔接真空在哪。",
    iconName: "ShieldAlert",
    urgency: "high",
    tags: ["租车平台\"假全险\"与风沙碎石险","冰岛"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "平台全险条款实为\"对车行基础碰撞险（CDW）起赔额以下部分兜底\"：若车行 CDW 明确不含车门，平台同样不赔。车行全险含风沙碎石险（Sand & Ash Damage Waiver, SADW）、并把三者责任降到 0，平台全险均不含；但平台全险含底盘/轮胎/救援，车行全险反而不含。",
          "风沙碎石险（SADW）务必在车行单独加购——冰岛风暴频繁，车窗车漆被沙石击伤是高频项，别被平台\"全险\"字面迷惑。"
        ]
      }
    ],
    quickChecklist: ["平台「全险」不含车门就不赔车门","风沙碎石险 SADW 必须在车行加","别被第三方全险字面迷惑"]
  },
  {
    id: "wb-40",
    category: "traffic",
    country: "iceland",
    title: "租车下单走官网与多人驾驶登记",
    shortDesc: "租车下单渠道与多人轮流驾驶的登记。",
    iconName: "FileText",
    urgency: "high",
    tags: ["租车下单走官网与多人驾驶登记","冰岛"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "优先到本地租车公司官网（Lotus / Blue / Zero）或国际连锁官网直接下单，尽量不用第三方平台——第三方\"全险\"可能不覆盖冰岛本地风险，是\"天价索赔\"高发源头。多人轮流开必须加 extra driver，否则未登记司机出事不赔付。"
        ]
      },
      {
        sectionTitle: "补充",
        items: [
          "保险前置确认：取车时逐条确认保单是否覆盖车门、挡风玻璃、底盘、沙石（Sand & Ash）、涉水（river crossing），未覆盖项为高频自付点。"
        ]
      }
    ],
    quickChecklist: ["优先走 Lotus / Blue / Zero 官网","尽量不用第三方平台下单","轮流开必须加 extra driver"]
  },
  {
    id: "wb-41",
    category: "emergency",
    country: "iceland",
    title: "F 路涉水深度判定",
    shortDesc: "F 路涉水段如何判定能否通过、如何通过。",
    iconName: "Waves",
    urgency: "high",
    tags: ["路涉水深度判定"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "F 路（mountain road，编号前带 F）仅 4x4 合法，2WD 驶入即违法。涉水段（river crossing）水深超过轮胎侧壁中线（约轮毂中心）即不可通过。",
          "涉水前：下车在岸边目测水深与水底软硬，找最浅、底最实的线位；挂低速挡（低四驱）、匀速通过、切勿中途换挡或停车，防止排气管进水；对向来车时单车依次通过。"
        ]
      }
    ],
    quickChecklist: ["水深超过轮毂中线就不要过","下车目测水深和水底软硬","低速匀速通过，中途不换挡不停车"]
  },
  {
    id: "wb-42",
    category: "traffic",
    country: "iceland",
    title: "越野驾驶刑事风险",
    shortDesc: "驶离标定道路的后果。",
    iconName: "ShieldAlert",
    urgency: "high",
    tags: ["越野驾驶刑事风险","冰岛"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "任何驶离标定道路/车辙，压上苔原、砾石滩或干河床的行为均为刑事犯罪，罚 100,000–500,000 ISK；冰岛苔藓（moss）遭碾压后需数十年恢复。",
          "停在标定停车场、只走标定道路。"
        ]
      }
    ],
    quickChecklist: ["只走标定道路和车辙","只停标定停车场","碾苔藓是刑事罪，罚 10–50 万 ISK"]
  },
  {
    id: "wb-43",
    category: "traffic",
    country: "iceland",
    title: "高地导航非法路段",
    shortDesc: "Google Maps 可能把非法路段标为可通行，误入后果。",
    iconName: "Compass",
    urgency: "high",
    tags: ["高地导航非法路段","冰岛"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "Google Maps 可能标记非法的\"捷径\"路段（非 F 路但实际禁止驶入）；误入后保险救援公司会以\"非法路段\"为由拒绝免费服务，需额外自费救援（实测约 340,000 ISK）。",
          "驶入高地前只用冰岛本地地图与官方路况核对路线；一旦路面不对劲（无标定车辙、越来越野），立刻掉头，不抱\"再开一段就好了\"的侥幸。"
        ]
      }
    ],
    quickChecklist: ["不走 Google Maps 灰色虚线捷径","只走 road.is 标为开放的编号路","路面不对劲立刻掉头"]
  },
  {
    id: "wb-44",
    category: "traffic",
    country: "iceland",
    title: "单车道桥会车",
    shortDesc: "单车道桥如何会车。",
    iconName: "Milestone",
    urgency: "high",
    tags: ["单车道桥会车"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "路牌 einbreið brú 提示单车道桥临近。限速 50 km/h，先到桥者优先，慢速接近并在桥头判断对向来车，对向已上桥则停车让行。"
        ]
      }
    ],
    quickChecklist: ["看到 einbreið brú 就减速到 50","先到桥者优先","对向已上桥则在桥头停车让行"]
  },
  {
    id: "wb-45",
    category: "traffic",
    country: "iceland",
    title: "沥青转碎石失控",
    shortDesc: "沥青路面突然转为碎石如何防失控。",
    iconName: "Construction",
    urgency: "high",
    tags: ["沥青转碎石失控","冰岛"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "路牌 malbik endar = 沥青路面结束、转碎石。碎石抓地力骤降，在路面转换前就提前减速，转碎石后缓给油、避免急刹急打方向。"
        ]
      }
    ],
    quickChecklist: ["看到 malbik endar 提前减速","转碎石后缓给油","碎石路上不急刹不急打方向"]
  },
  {
    id: "wb-46",
    category: "emergency",
    country: "iceland",
    title: "黑沙滩偷袭浪卷入",
    shortDesc: "Reynisfjara 黑沙滩的 sneaker wave 如何防范。",
    iconName: "Waves",
    urgency: "high",
    tags: ["黑沙滩偷袭浪卷入","冰岛"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "Reynisfjara 黑沙滩的 sneaker wave（偷袭浪） 会突然冲上数米、将人卷离海岸。",
          "靠近时面向大海、倒着走，始终与浪头保持安全距离，永不背对海浪、不下到湿沙带。"
        ]
      }
    ],
    quickChecklist: ["黑沙滩始终面向大海","倒着走，和浪头保持安全距离","浪来立刻往高处撤，不回头捡东西"]
  },
  {
    id: "wb-47",
    category: "traffic",
    country: "norway",
    title: "罗弗敦雪天打滑与超车",
    shortDesc: "罗弗敦雨夹雪路面如何超车、打滑如何救车。",
    iconName: "Snowflake",
    urgency: "high",
    tags: ["罗弗敦雪天打滑与超车","罗弗敦"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "雪天超车：先并到对向车道 → 再加速 → 再并回原道，不要习惯性斜着加速。打滑时两手握紧方向盘、尽量别乱打方向，用点刹减速；电车油门大、转速高更易打滑，先多适应雪地。"
        ]
      }
    ],
    quickChecklist: ["雪天超车先并线再加速","罗弗敦弯道窄，不强超房车","湿滑路面拉大车距"]
  },
  {
    id: "wb-48",
    category: "emergency",
    country: "norway",
    title: "隧道灯光与动物横穿",
    shortDesc: "隧道灯光要求与动物横穿应对。",
    iconName: "ShieldAlert",
    urgency: "high",
    tags: ["隧道灯光与动物横穿","冰岛","挪威"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "冰岛 Hvalfjörður 隧道 70 km/h；挪威长隧道内用近光灯（非日行灯）。环岛公路常有绵羊（sheep）横穿，挪威山路段有驯鹿。",
          "遇动物慢速通过、不鸣笛惊吓。"
        ]
      }
    ],
    quickChecklist: ["进隧道开近光，摘墨镜","遇动物慢速通过，不鸣笛惊吓","长隧道跟前车灯，不急刹"]
  },
  {
    id: "wb-49",
    category: "emergency",
    country: "both",
    title: "紧急号码速查",
    shortDesc: "两国紧急/非紧急/拖车号码。",
    iconName: "PhoneCall",
    urgency: "high",
    tags: ["紧急号码速查","冰岛","挪威"],
    details: [
      {
        sectionTitle: "场景冰岛挪威",
        items: [
          "紧急（警察/急救/消防）112112 / 113（急救）/ 110（火）",
          "非紧急报警444 1000—",
          "抛锚 / 拖车租车公司救援（多数支持 WhatsApp），号码在租车单上"
        ]
      }
    ],
    quickChecklist: ["冰岛 112 全能，挪威 112/113/110","记下租车行 24 小时救援号","装 112 Iceland App 共享定位"]
  },
  {
    id: "wb-50",
    category: "emergency",
    country: "both",
    title: "无伤事故处置",
    shortDesc: "无人员受伤的碰撞事故如何固定证据、上报。",
    iconName: "FileText",
    urgency: "high",
    tags: ["无伤事故处置","冰岛"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "安全停车 → 开双闪 → 从手套箱取事故单（accident statement form），双方拍照记录车牌、位置、受损部位；无事故单则用 Carcrash.is（冰岛）上报。随后联系租车公司走保险。"
        ]
      }
    ],
    quickChecklist: ["安全停车、开双闪、取事故单","双方拍车牌、位置、受损部位","立刻报租车行，不私下和解开走"]
  },
  {
    id: "wb-51",
    category: "emergency",
    country: "both",
    title: "受伤事故处置",
    shortDesc: "有人受伤时如何报警与定位。",
    iconName: "ShieldAlert",
    urgency: "high",
    tags: ["受伤事故处置"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "有人受伤立即拨 112/113，报出精确位置（用路牌编号、GPS 坐标或最近村镇名），不要自行移动伤者，等专业人员抵达。"
        ]
      }
    ],
    quickChecklist: ["有人受伤立刻拨 112/113","报出路牌编号或 GPS","不自行移动伤者"]
  },
  {
    id: "wb-52",
    category: "emergency",
    country: "iceland",
    title: "暴风雪抛锚无信号自救",
    shortDesc: "暴风雪中抛锚、手机无信号时如何联系道路援助。",
    iconName: "CloudSnow",
    urgency: "high",
    tags: ["暴风雪抛锚无信号自救","冰岛"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "冰岛道路援助 24ra 热线 +354 419 2400；接线后需登录 24ra 网站，用 WhatsApp / Instagram 发送文字与 GPS 定位，并信用卡在线付款后才会立案（分两次付款，勿付款后离开信号区）。需提供：车牌、租车人姓名、车中人数、GPS 位置。",
          "出发前：把信用卡号/有效期存进记事本便于复制；备好 WhatsApp 或 Instagram 账号；浏览器存好救援站书签。全程穿速干压缩衣 + 硬壳防水冲锋衣裤，棉质衣物湿透后几分钟内即失温。"
        ]
      }
    ],
    quickChecklist: ["留在车内保暖，开双闪","无信号也先开 112 App 待补发","不弃车徒步走进暴风雪"]
  },
  {
    id: "wb-53",
    category: "emergency",
    country: "iceland",
    title: "行程备案",
    shortDesc: "冰岛出发前如何让救援方知晓路线。",
    iconName: "Compass",
    urgency: "high",
    tags: ["行程备案","冰岛","罗弗敦"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "冰岛出发前在 safetravel.is 登记行程，遇险时救援方能知晓你的路线与位置。"
        ]
      },
      {
        sectionTitle: "补充",
        items: [
          "实时信息三件套（冰岛）：vedur.is 天气与风警 · road.is / umferdin.is 路况与封路 · safetravel.is 安全告警。挪威：yr.no 天气 · Vegvesen Trafikk 路况。"
        ]
      },
      {
        sectionTitle: "补充",
        items: [
          "10渡轮与跨海",
          "进入罗弗敦两条主通道：南线 Bodø → Moskenes 渡轮（直达 Reine / Å，夏季舱位紧俏）；北线直飞埃沃内斯（EVE）取车自驾约 3 h 到 Svolvær，免预订舱位之扰。"
        ]
      }
    ],
    quickChecklist: ["出发前在 safetravel.is 登记行程","同时装 112 Iceland App","vedur.is 和 road.is 存书签"]
  },
  {
    id: "wb-54",
    category: "traffic",
    country: "norway",
    title: "Bodø–Moskenes 渡轮预订",
    shortDesc: "渡轮航程、价格、预订与候补规则。",
    iconName: "Ship",
    urgency: "high",
    tags: ["Bodø–Moskenes","渡轮预订"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "航程约 3h15，运营方 Torghatten Nord。车（≤6 米）夏季约 834 NOK（含 250 NOK 预订费）；仅 50% 舱位开放预订——预订页显示\"售罄\"只代表可预订名额已满，早到仍可排队候补。行人/骑行者免费且无需预订。",
          "已预订车辆须在开航前 45 分钟 进入标有 Reserved / Prepaid 的车道排队；未预订车辆进入普通候补车道，旺季可能等数班。预订走新系统 torghatten.no，勿用旧站 torghatten-nord.no；租车填车牌处可写 RENTAL。"
        ]
      }
    ],
    quickChecklist: ["Bodø–Moskenes 渡轮约 3 小时 15 分","已订车须开航前 45 分钟进指定车道","时刻以 Torghatten 官网为准"]
  },
  {
    id: "wb-55",
    category: "traffic",
    country: "norway",
    title: "旺季舱位抢订",
    shortDesc: "旺季渡轮舱位如何确保订到。",
    iconName: "Ship",
    urgency: "high",
    tags: ["旺季舱位抢订"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "7–8 月务必提前预订车辆舱位；淡季班次减少，出发前在官网核对当日时刻表。"
        ]
      }
    ],
    quickChecklist: ["7–8 月务必提前订车辆舱位","淡季也尽量先订，避免到港无舱","旺季当天买票很容易满员"]
  },
  {
    id: "wb-56",
    category: "traffic",
    country: "norway",
    title: "飞抵埃沃内斯（EVE）自驾进罗弗敦",
    shortDesc: "不坐渡轮、飞进罗弗敦的取车与自驾路线要点。",
    iconName: "Plane",
    urgency: "medium",
    tags: ["飞抵埃沃内斯","EVE","自驾进罗弗敦","罗弗敦"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "Evenes / Harstad-Narvik（EVE）是罗弗敦的主要航空门户，Avis / Hertz / Sixt / Europcar / Budget 柜台集中在到达厅。取车后走 E10 经 Tjeldsund 跨海桥与 Lofast 快速段到 Svolvær，里程约 170–190 km、纯驾 2.5–3.5 h（不含停留）。沿途跨海桥与隧道段为 AutoPASS 自动扣费，无需停车缴费（见第 06 章）。另有 Widerøe 支线 EVE → Svolvær（SVJ）约 25–30 min，可省去首段自驾。",
          "同日「国际航班 + 长途自驾」衔接时，取车柜台按营业时间办理，落地先加油再上路（EVE 沿线加油站稀疏，见第 05 章）；傍晚取车则把跨海桥段留足 3.5 h 余量，罗弗敦段弯道多、限速 60–80 km/h，慢开优先。机场免税店位于出发区安检后与国际到达区，挪威国内段航班购买受限——酒类在奥斯陆中转的国际到达区买更稳妥（见第 16 章）。"
        ]
      },
      {
        sectionTitle: "补充",
        items: [
          "11超市购物",
          "北欧物价高，自炊能显著压低成本；但超市营业时间短、周日与公共假日大面积关门，需提前囤货。"
        ]
      }
    ],
    quickChecklist: ["EVE 取车后走 E10 约 170–190 km","傍晚取车留足 3.5 小时余量","落地先加油再上路"]
  },
  {
    id: "wb-57",
    category: "grocery",
    country: "iceland",
    title: "冰岛超市选择与营业时间",
    shortDesc: "冰岛三家主要超市的定位与营业时段。",
    iconName: "ShoppingBag",
    urgency: "medium",
    tags: ["冰岛超市选择与营业时间","冰岛"],
    details: [
      {
        sectionTitle: "超市特点营业时间参考",
        items: [
          "Bónus（黄色小猪）最便宜，品类精简约 10:00–18:00，周日多数关",
          "Krónan（黄色笑脸橙）价格略高、品类更全约 9:00–21:00",
          "Nettó（绿色苹果）日用品最全，部分 24h多为 9:00–21:00"
        ]
      }
    ],
    quickChecklist: ["日常采购优先 Bónus","要日用品去 Nettó","酒只能去 Vínbúðin"]
  },
  {
    id: "wb-58",
    category: "grocery",
    country: "norway",
    title: "挪威超市选择",
    shortDesc: "挪威主流超市与物价水平。",
    iconName: "ShoppingBag",
    urgency: "medium",
    tags: ["挪威超市选择","冰岛","罗弗敦"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "主流为 KiwiRema 1000Coop Prix，物价约为国内 3 倍；营业时间较冰岛长，但周日挪威多数超市也关门，罗弗敦城镇外无店。"
        ]
      }
    ],
    quickChecklist: ["挪威日常采购优先 Kiwi / Rema 1000","酒去 Vinmonopolet","村镇店打烊早，傍晚先补货"]
  },
  {
    id: "wb-59",
    category: "grocery",
    country: "both",
    title: "周日与节假日关门囤货",
    shortDesc: "周日/节假日超市关门，如何不断粮。",
    iconName: "ShoppingBag",
    urgency: "high",
    tags: ["周日与节假日关门囤货","冰岛"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "冰岛多数超市周日关门或缩短营业，复活节等节日几乎全关。",
          "抵达当天先在首站城镇囤好次日所需；规划行程时把采购放在营业日白天。"
        ]
      }
    ],
    quickChecklist: ["周日和节假日超市常关门或缩短营业","抵达当天先囤次日所需","出发前查 Grapevine 节日营业时间"]
  },
  {
    id: "wb-60",
    category: "grocery",
    country: "both",
    title: "酒类购买限制",
    shortDesc: "两国超市能否买到酒、到哪买。",
    iconName: "Wine",
    urgency: "high",
    tags: ["酒类购买限制","冰岛","挪威"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "两国超市不售酒精（仅淡啤等低度饮）。烈酒/葡萄酒须到国有专营店：冰岛 Vínbúðin、挪威 Vinmonopolet，营业时间短、周日关门，且对烈度有营业时段限制。",
          "需要酒请在工作日白天专程购买。"
        ]
      }
    ],
    quickChecklist: ["超市不卖烈酒，只卖低度淡啤","冰岛酒去 Vínbúðin，挪威去 Vinmonopolet","工作日白天专程买，别拖到晚上"]
  },
  {
    id: "wb-61",
    category: "grocery",
    country: "iceland",
    title: "冰岛超市必买食物清单",
    shortDesc: "自炊省钱的游客在超市里该认准哪些当地食物、哪几样值得买。",
    iconName: "Utensils",
    urgency: "low",
    tags: ["冰岛超市必买食物清单","冰岛"],
    details: [
      {
        sectionTitle: "食物是什么 / 怎么吃参考价",
        items: [
          "Skyr脱脂高蛋白酸奶（口感似浓稠奶酪），品牌 Ísey、KEA400–600 ISK",
          "SS Pylsur羊肉热狗，配 pylsusinnep（甜棕芥末）+ remúlaði + cronions（脆洋葱）；超市买料自炊比热狗摊便宜约 3 倍—",
          "Harðfiskur鳕鱼风干鱼干，抹 smjör 黄油当高蛋白零食500–1,200 ISK",
          "Rúgbrauð地热慢烤黑麦面包，微甜，配黄油或烟熏三文鱼—",
          "Lakkrís海盐黑甘草糖，品牌 Nói Síríus、Sambó400–800 ISK",
          "巧克力Omnom（手工）、Nói Síríus；超市价低于机场与纪念品店约 790–1,000 ISK"
        ]
      },
      {
        sectionTitle: "补充",
        items: [
          "认准黄色招牌粉红猪的 Bónus 与黄色笑脸的 Krónan 最便宜；大超市热食柜台（heitar máltíðir）的烤鸡、按重量计价的沙拉吧是自炊替代。"
        ]
      }
    ],
    quickChecklist: ["Skyr、SS 热狗、黑麦面包值得买","风干鱼干配黄油很好吃","乳制品选 Ísey 或 MS"]
  },
  {
    id: "wb-62",
    category: "grocery",
    country: "iceland",
    title: "冰岛伴手礼红榜",
    shortDesc: "回国带什么最有冰岛特色、在哪买最便宜。",
    iconName: "Gift",
    urgency: "low",
    tags: ["冰岛伴手礼红榜","冰岛"],
    details: [
      {
        sectionTitle: "伴手礼要点参考价",
        items: [
          "海鹦鹉 / 维京人陶瓷杯本土设计生产，全岛统一价1,599 ISK",
          "Lopapeysa 羊毛衫手工编织，认 Prjónasamband Íslands 认证 / Handknitting Association 店15,000–30,000 ISK",
          "羊毛皂羊毛包裹的香皂，机场免税店最便宜2,200–3,000 ISK",
          "Lysi 深海鱼油深海鳕鱼油，Bónus 或机场免税店有售，机场更便宜市区约 1,819 ISK",
          "Lurity Herbs / BioEffect本土护肤（唇膏/面霜），机场免税店最划算唇膏 950–1,290 ISK",
          "海盐 / NS 巧克力地热海盐；NS 间歇泉味咸甜平衡海盐 1,500–3,000 ISK",
          "冰岛羊挂件冰岛羊不出口，本地纪念品店有售—"
        ]
      },
      {
        sectionTitle: "补充",
        items: [
          "食品类（鱼油、唇膏、巧克力、海盐）优先在机场免税店买，比市区便宜约 15–30%；羊毛衫只在认证店买，翻看 made in Iceland 标签。"
        ]
      }
    ],
    quickChecklist: ["羊毛衫认认证标签再买","Lysi 鱼油在 Bónus 更便宜","陶瓷杯选本土设计生产"]
  },
  {
    id: "wb-63",
    category: "grocery",
    country: "iceland",
    title: "冰岛伴手礼黑榜",
    shortDesc: "哪些\"伴手礼\"容易踩雷、别买或别买多。",
    iconName: "Gift",
    urgency: "medium",
    tags: ["冰岛伴手礼黑榜","冰岛"],
    details: [
      {
        sectionTitle: "避雷品原因",
        items: [
          "Drauma 肉桂夹心糖肉桂味极冲，非肉桂爱好者难以下咽",
          "Omnom 巧克力手工质感但甜度偏高，甜食不耐者买一块试即可",
          "义乌货海鹦公仔 / 维京头盔多为中国制造，认准 made in Iceland 标签",
          "Marianne 薄荷糖实为芬兰产、非冰岛特色，机场有售，别一路背"
        ]
      },
      {
        sectionTitle: "补充",
        items: [
          "买前翻看包装产地标签；\"全岛统一价 1,599 ISK\"的本地设计款才值得入手，通用旅游品先对比机场价再决定。"
        ]
      },
      {
        sectionTitle: "补充",
        items: [
          "12活动项目预约",
          "哪些必须提前订、哪些现场即可、以及各自硬性条件。"
        ]
      }
    ],
    quickChecklist: ["海鹦公仔和维京头盔多为义乌货","Omnom 巧克力偏甜，按口味决定","Marianne 薄荷糖是芬兰产"]
  },
  {
    id: "wb-64",
    category: "activity",
    country: "iceland",
    title: "冰岛大裂缝浮潜 Silfra 预订",
    shortDesc: "Silfra 浮潜的预约要求与身体硬性条件。",
    iconName: "Anchor",
    urgency: "medium",
    tags: ["冰岛大裂缝浮潜","Silfra","预订","冰岛"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "必须预订，冬季名额更紧。位于辛格维利尔国家公园（Þingvellir）内，为干衣潜水（drysuit snorkeling），全年水温约 2–4°C。",
          "硬性条件：会游泳；多数运营商年龄下限 12 岁（部分 14 岁）；身高约 145–200 cm、体重 ≥45 kg；无心脏病、哮喘、幽闭恐惧。自带保暖内衣 + 羊毛袜，其余干衣/面镜由运营方提供。预订走 Dive.is、Arctic Adventures 等运营商官网。"
        ]
      }
    ],
    quickChecklist: ["Silfra 必须预订，冬季名额更紧","会游泳，多数运营商 12 岁起","水温接近 2°C，听完安全讲解再下水"]
  },
  {
    id: "wb-65",
    category: "activity",
    country: "iceland",
    title: "丁丁博物馆（Phallological Museum）",
    shortDesc: "丁丁博物馆是否需要预约、门票与开放时间。",
    iconName: "Gift",
    urgency: "low",
    tags: ["丁丁博物馆","Phallological","Museum"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "无需预订，现场购票入场，约 2,800 ISK，每日开放，位于雷克雅未克市区。",
          "到店直接买票即可；官网 phallus.is 可查当日开放时间。"
        ]
      }
    ],
    quickChecklist: ["现场买票即可，不用提前订","门票约 2,800 ISK，每日开放","出发前上 phallus.is 查当日时间"]
  },
  {
    id: "wb-66",
    category: "activity",
    country: "iceland",
    title: "蓝湖 / 天空湖预订",
    shortDesc: "蓝湖等温泉是否需要提前订。",
    iconName: "Droplet",
    urgency: "medium",
    tags: ["蓝湖","天空湖预订"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "必须提前网上预订时段，旺季名额常满。蓝湖（Blue Lagoon）需预约入场时间与套餐。"
        ]
      }
    ],
    quickChecklist: ["蓝湖 / 天空湖必须网上订时段","旺季名额常满，尽早订"," morena 毛巾和硅胶帽可自带"]
  },
  {
    id: "wb-67",
    category: "activity",
    country: "iceland",
    title: "冰川徒步 / 冰洞预订",
    shortDesc: "冰川徒步与冰洞的预约与季节限制。",
    iconName: "Mountain",
    urgency: "medium",
    tags: ["冰川徒步","冰洞预订"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "必须跟团预订。Skaftafell / Vatnajökull 冰川徒步全年可订；冰洞（ice cave）仅冬季（约 11 月至次年 3 月），务必提前数周订。"
        ]
      }
    ],
    quickChecklist: ["冰川徒步 / 冰洞必须跟团","冰洞季节大约 11 月到 3 月","按运营商通知带防水靴和头盔"]
  },
  {
    id: "wb-68",
    category: "activity",
    country: "iceland",
    title: "观鲸预订",
    shortDesc: "观鲸是否需要预订与注意事项。",
    iconName: "Anchor",
    urgency: "medium",
    tags: ["观鲸预订"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "Húsavík / Akureyri 观鲸建议预订，旺季船位紧张；晕船者提前服晕船药。"
        ]
      }
    ],
    quickChecklist: ["Húsavík / Akureyri 观鲸建议预订","晕船药提前吃","天气差可能改期或取消"]
  },
  {
    id: "wb-69",
    category: "activity",
    country: "norway",
    title: "罗弗敦海鹰巡游 Sea Eagle Safari",
    shortDesc: "海鹰巡游的预订与着装要求。",
    iconName: "Compass",
    urgency: "low",
    tags: ["罗弗敦海鹰巡游","Sea","Eagle","罗弗敦"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "建议预订。RIB 快艇从 Svolvær 出发进 Trollfjord，全年运营，旺季紧俏；穿足防风防水衣物。"
        ]
      }
    ],
    quickChecklist: ["海鹰巡游建议预订 RIB 快艇","从 Svolvær 出发","海上风大，穿硬壳外套"]
  },
  {
    id: "wb-70",
    category: "activity",
    country: "norway",
    title: "Reinebringen 徒步",
    shortDesc: "Reinebringen 步道的开放与装备要求。",
    iconName: "Mountain",
    urgency: "medium",
    tags: ["Reinebringen","徒步","冰岛"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "Sherpa 石阶步道，冬季与融雪期关闭。出发前查官网/当地告示确认开放状态；山脚停车收费，早到占位。结冰石阶需冰爪。"
        ]
      },
      {
        sectionTitle: "补充",
        items: [
          "13本地玩法与体验",
          "自驾之外，本地人泡什么温泉、吃什么、哪些村与机位值得停、哪些名不副实。"
        ]
      },
      {
        sectionTitle: "补充",
        items: [
          "冰岛 · 温泉"
        ]
      }
    ],
    quickChecklist: ["出发前查 Reinebringen 是否开放","冬季和融雪期阶梯关闭","结冰带冰爪，山脚停车收费要早到"]
  },
  {
    id: "wb-71",
    category: "activity",
    country: "iceland",
    title: "冰岛免费天然温泉 Reykjadalur",
    shortDesc: "不想花高价泡蓝湖，免费的天然热河怎么去、有何代价。",
    iconName: "Droplet",
    urgency: "low",
    tags: ["冰岛免费天然温泉","Reykjadalur","冰岛"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "Reykjadalur 热河不是温泉池，是一条冒热气的天然河流，位于 Hveragerði 附近，距雷克雅未克约 45 分钟车程；入场免费，仅需付停车场费（约 200 ISK 首小时，之后每小时约 250 ISK）。",
          "代价是徒步单程约 1 小时的山路；沿河上溯水温递增（约 30–40°C），走到体感合适的河段再下水。自带泳衣、毛巾、防水袋；岸边无更衣室，换衣在简易挡板后就地完成。"
        ]
      }
    ],
    quickChecklist: ["Reykjadalur 是热河不是温泉池","单程徒步大约 1 小时","换衣在岸边，不占用木栈桥通道"]
  },
  {
    id: "wb-72",
    category: "activity",
    country: "iceland",
    title: "冰岛付费温泉选择",
    shortDesc: "除了蓝湖，沿途还有哪些更便宜、更本地的温泉可选。",
    iconName: "Droplet",
    urgency: "medium",
    tags: ["冰岛付费温泉选择","冰岛"],
    details: [
      {
        sectionTitle: "温泉位置成人价特点",
        items: [
          "Secret LagoonFlúðir（黄金圈）4,500 ISK最老池（1891 年建），边泡边看小间歇泉喷发",
          "HrunalaugFlúðir 农场3,000 ISK私人农场石池，现金/卡现场付",
          "Laugarvatn FontanaLaugarvatn（黄金圈）5,490 ISK湖边温泉，可加购地热面包 tour（3,190 ISK）看黑麦面包地热烤制",
          "Mývatn Nature Baths米湖（北部）7,400 ISK\"北部蓝湖\"，同款奶蓝水色"
        ]
      },
      {
        sectionTitle: "补充",
        items: [
          "旺季热门池（尤其 Secret Lagoon）建议官网预订；入场前必须裸身淋浴（冰岛浴场统一卫生要求），租毛巾/泳衣另付费（约 1,200 ISK）。"
        ]
      },
      {
        sectionTitle: "补充",
        items: [
          "冰岛 · 沿途美食"
        ]
      }
    ],
    quickChecklist: ["Secret Lagoon 比蓝湖便宜好订","Hrunalaug 是农场温泉，可能只收现金或卡","Mývatn 北线值得顺路泡"]
  },
  {
    id: "wb-73",
    category: "activity",
    country: "iceland",
    title: "冰岛沿途餐厅（中国胃参考）",
    shortDesc: "吃腻白人饭，沿途哪些餐厅有接近中餐 / 热汤热饭的选择。",
    iconName: "Utensils",
    urgency: "low",
    tags: ["冰岛沿途餐厅","中国胃参考","冰岛","罗弗敦"],
    details: [
      {
        sectionTitle: "餐厅位置人均推荐",
        items: [
          "Pakkhus霍芬（Höfn）约 500+ RMB冰岛最佳龙虾，肉鲜嫩",
          "Loki雷克雅未克（教堂对面）约 400 RMB羊肉汤料足，可看教堂",
          "Fine 饭雷克雅未克约 400 RMB鱼香肉丝盖饭，中国胃救赎",
          "wok in vik维克（Vík）约 150 RMB越南炒粉有锅气，前台会中文",
          "冰河湖龙虾热狗冰河湖（Jökulsárlón）约 100+ RMB/个龙虾汤 + 虾肉热狗，饥寒时救急"
        ]
      },
      {
        sectionTitle: "补充",
        items: [
          "雷市热门餐厅（Old Iceland、Apotek）提前订位；环岛沿途村镇餐厅少且早关门，午餐错峰或自备干粮兜底。"
        ]
      },
      {
        sectionTitle: "补充",
        items: [
          "罗弗敦 · 玩法与机位"
        ]
      }
    ],
    quickChecklist: ["Höfn 吃龙虾去 Pakkhús","维克想吃热菜看 wok in vik","雷市教堂对面 Loki 适合中国胃"]
  },
  {
    id: "wb-74",
    category: "activity",
    country: "norway",
    title: "罗弗敦必去村落与机位",
    shortDesc: "罗弗敦有哪些免费必停的村与拍照点、哪些名不副实。",
    iconName: "Camera",
    urgency: "medium",
    tags: ["罗弗敦必去村落与机位","罗弗敦"],
    details: [
      {
        sectionTitle: "点位看点停车",
        items: [
          "Hamnøy Viewpoint孤独星球同款红木屋机位，导航 Fotospot Hamnøy 桥上广角拍免费",
          "Sakrisøy 黄屋黄色渔屋 + 雪山对称构图，紧邻 Hamnøy免费 4 小时",
          "Reine 红屋导航 Reine photo 拍雪山红屋免费",
          "Å 镇（世界尽头）名字只有一个字母 A，标志牌 + 海边观景台 + 老渔村博物馆免费",
          "Skagsanden 海滩白沙滩 + 雪山倒影，导航 Rasteplass Flakstad免费",
          "Henningsvær 足球场无无人机别专程去：地面看就是普通球场，航拍才出片—"
        ]
      },
      {
        sectionTitle: "补充",
        items: [
          "把车停进路边 pull-out（停车带）拍照，别占行车道；旺季热门机位早到占位。"
        ]
      }
    ],
    quickChecklist: ["Hamnøy 大桥是经典机位","Reine 红屋导航 Reinebringen 观景","Å 镇名字只有一个字母 A"]
  },
  {
    id: "wb-75",
    category: "activity",
    country: "norway",
    title: "Nusfjord 渔村收费",
    shortDesc: "号称最古老渔村的 Nusfjord 值不值得进、要不要门票。",
    iconName: "Coins",
    urgency: "medium",
    tags: ["Nusfjord","渔村收费"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "Nusfjord 是收费的保存完好的渔村，门票约 150 NOK/人；它稍偏离 E10 主路，需绕行一段。小红书多篇实测称\"早知道收费就不来了\"，村景与其他免费渔村差别不大。",
          "时间紧或预算敏感可直接跳过，转去免费的 Å、Hamnøy、Sakrisøy；若已进村，村内 Landhandleriet Café 卖手工毛衣（5,500 NOK 起）与简餐，可当休息点。"
        ]
      }
    ],
    quickChecklist: ["Nusfjord 是收费渔村，不是免费景点","入村费在村口栏杆缴","时间紧或预算敏感可以直接跳过"]
  },
  {
    id: "wb-76",
    category: "activity",
    country: "norway",
    title: "罗弗敦极光与午夜太阳",
    shortDesc: "什么时候能看到极光、什么时候是午夜太阳，怎么提升成功率。",
    iconName: "Sparkles",
    urgency: "low",
    tags: ["罗弗敦极光与午夜太阳","罗弗敦"],
    details: [
      {
        sectionTitle: "现象时间要点",
        items: [
          "极光（Northern Lights）约 9 月至次年 3 月挑晴夜、远离村镇灯光（朝海/朝北），耐心等",
          "午夜太阳（Midnight Sun）约 5 月底至 7 月中太阳不落，可通宵徒步 / 拍照",
          "冲浪 Unstad全年，大浪 9–4 月冷水泥沙滩，5/4 湿衣 + 头套手套必备"
        ]
      },
      {
        sectionTitle: "补充",
        items: [
          "追极光避开满月与云层，带三脚架长曝光；冬季傍晚前后查 yr.no 云量预报，选云量低、光污染小的海岸。"
        ]
      },
      {
        sectionTitle: "补充",
        items: [
          "罗弗敦 · 美食与补给"
        ]
      }
    ],
    quickChecklist: ["极光大约 9 月到 3 月","午夜太阳大约 5 月到 7 月","Unstad 冲浪全年，大浪在 9–4 月"]
  },
  {
    id: "wb-77",
    category: "activity",
    country: "norway",
    title: "罗弗敦美食与补给点",
    shortDesc: "罗弗敦沿途吃什么、在哪里补给最稳。",
    iconName: "Utensils",
    urgency: "low",
    tags: ["罗弗敦美食与补给点","罗弗敦"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "补给站集中在 Svolvær（Kiwi、Extra 超市）与 Leknes（超市、加油站、餐厅），出发前在这些大镇囤水囤粮；村镇外几乎无店。"
        ]
      },
      {
        sectionTitle: "地点吃什么",
        items: [
          "Anita's Seafood（Sakrisøy）全罗弗敦最出名的鱼汤与鲑鱼 / 鱼汉堡",
          "Å 村面包店肉桂卷（kanelsnurr）午后即售罄，早去",
          "Fiskekrogen（Henningsvær）炸鳕鱼、鲜虾三明治，\"渔夫版 Brunch\""
        ]
      },
      {
        sectionTitle: "补充",
        items: [
          "周日村镇店铺与超市多数关门，加油站（Circle K 等）是最后的零食/热食兜底；海鲜餐厅旺季提前订位。"
        ]
      }
    ],
    quickChecklist: ["补给集中在 Svolvær 和 Leknes","Anita's Seafood 值得停","村镇外晚上很难再买到热食"]
  },
  {
    id: "wb-78",
    category: "grocery",
    country: "both",
    title: "冰岛与挪威无现金支付",
    shortDesc: "需不需要换现金，用什么方式付款。",
    iconName: "Receipt",
    urgency: "medium",
    tags: ["冰岛与挪威无现金支付","冰岛","挪威"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "两国几乎全面无现金（cashless）：信用卡 / 借记卡 + 联系支付（Apple Pay / Google Pay）在餐厅、超市、加油、停车、景点处处可用，连偏远小镇也不收现金。冰岛货币克朗（ISK）、挪威克朗（NOK）基本不必兑换现钞，带少量作极端备用即可。",
          "出发前向银行确认：卡片支持芯片 + 4 位 PIN（自助油站硬性要求）、已开通境外交易、并了解境外手续费。优先选免境外手续费的卡。"
        ]
      }
    ],
    quickChecklist: ["两国几乎全面无现金，不必换大额现钞","带一张带 PIN 的实体信用卡","无人油站碰一下有时不够"]
  },
  {
    id: "wb-79",
    category: "grocery",
    country: "iceland",
    title: "冰岛退税（Tax Free）",
    shortDesc: "购物满多少可退税、税率多少、在哪里办。",
    iconName: "Receipt",
    urgency: "medium",
    tags: ["冰岛退税","Tax","Free","冰岛"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "冰岛增值税（VAT）24%（书籍 11%）。单张收据满 6,000 ISK 可在参与退税门店索要退税单；净退约 14–15%（24% 减去手续费）。",
          "离境时在凯夫拉维克机场（KEF）抵达大厅（开放 4:30–21:00）先到 Arion Bank 窗口盖出口章，再到 Global Blue / Planet Payment 退钱；办完再托运行李，因海关可能要求查验未使用的商品。单笔超 100,000 ISK 须先经海关验章。购买后 3 个月内须带出镜。",
          "不适用：餐食、油费、住宿、旅游服务。"
        ]
      }
    ],
    quickChecklist: ["冰岛 VAT 24%，离境在 KEF 办退税","先到 Arion Bank 盖章再退钱","办完再托运，海关可能查未用商品"]
  },
  {
    id: "wb-80",
    category: "grocery",
    country: "norway",
    title: "挪威退税（Tax Free）",
    shortDesc: "挪威退税门槛、税率与操作时限。",
    iconName: "Receipt",
    urgency: "medium",
    tags: ["挪威退税","Tax","Free","挪威"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "挪威 VAT 25%（食品 15%）。单张收据满 315 NOK（标准品）/ 290 NOK（食品）即可；净退约 19% 减去 3–6% 服务费（Global Blue 另收固定 35 NOK 转卡费）。",
          "购物时出示护照当场开退税单；离境时在机场 Global Blue / Planet / PIE VAT 柜台出口验证 + 退款一次办结，商品须未使用且随身（勿先托运）。30 天内出口、1 个月内验证，盖章后单据 1 年内有效。",
          "不适用：燃油、车辆、书籍、服务类。"
        ]
      }
    ],
    quickChecklist: ["挪威 VAT 25%，单张收据满 315 NOK 可退","购物时出示护照当场开退税单","商品须未使用且随身，勿先托运"]
  },
  {
    id: "wb-81",
    category: "grocery",
    country: "both",
    title: "冰岛与挪威移动网络覆盖",
    shortDesc: "环岛与罗弗敦哪些路段有信号、没信号怎么办。",
    iconName: "Compass",
    urgency: "medium",
    tags: ["冰岛与挪威移动网络覆盖","冰岛","罗弗敦"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "冰岛三大运营商 SíminnVodafoneNova：1 号环岛、黄金圈、南岸至 Höfn 均有 4G/5G；但内陆高地 F 路、西峡湾深处信号会完全消失（所有运营商皆然）。挪威 TelenorTelia 在 E10 罗弗敦沿线覆盖良好，山区段落偶有缺口。",
          "出发前下载 Google Maps 离线地图，把 road.is / vedur.is / vegvesen.no 存书签；进入高地前先把路线缓存到本地。数据量参考：环岛自驾约 1–2 GB/天（持续导航 + 查路况）。"
        ]
      }
    ],
    quickChecklist: ["环岛和黄金圈有 4G，F 路和西峡湾会全灭","出发前下载 Google 离线地图","road.is / vedur.is 存书签"]
  },
  {
    id: "wb-82",
    category: "grocery",
    country: "both",
    title: "eSIM 与本地 SIM 选择",
    shortDesc: "用漫游、eSIM 还是本地卡，各自注意什么。",
    iconName: "Compass",
    urgency: "medium",
    tags: ["eSIM","与本地","SIM","冰岛"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "EU/EEA 用户漫游通常免费；中国大陆 / 美加用户建议用旅行 eSIM（data-only）（Instabridge、Nomad、Airalo 等），落地即连、无需换卡、可切 Síminn 网络；需本地号则买 Síminn 实体卡。",
          "eSIM 出发前在 Wi-Fi 下装好，落地 KEF 开数据漫游 60 秒内连网。数据卡不能打电话——拨 112 或用 WhatsApp 通话；下载 112 Iceland App，可把 GPS 实时共享给搜救队，无信号区段靠它兜底。"
        ]
      }
    ],
    quickChecklist: ["出发前在 Wi-Fi 下装好旅行 eSIM","数据卡打不了电话，用 112 或 WhatsApp","再装 112 Iceland App 兜底"]
  },
  {
    id: "wb-83",
    category: "drone",
    country: "iceland",
    title: "冰岛无人机注册与限飞",
    shortDesc: "冰岛飞无人机要注册吗、哪里禁飞、限高多少。",
    iconName: "Plane",
    urgency: "high",
    tags: ["冰岛无人机注册与限飞","冰岛"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "重量 >250g 或带摄像头的无人机须注册运营者（operator）并考取 A1/A3 在线证书（EASA 通用，任意成员国产出均有效）。飞行上限 120 m，全程目视（VLOS）。"
        ]
      },
      {
        sectionTitle: "禁飞 / 受限区规则",
        items: [
          "机场KEF 国际机场 2 km、其他机场 1.5 km 内禁飞",
          "国家公园Þingvellir、Vatnajökull、Snæfellsjökull 禁飞",
          "热门景点Gullfoss、Seljalandsfoss、Skógafoss、Reynisfjara、Jökulsárlón 等禁飞",
          "雷克雅未克市区须低于市中心建筑高度；城市内重量 ≤3 kg",
          "建筑物私人建筑 50 m、公共建筑 150 m 外"
        ]
      },
      {
        sectionTitle: "补充",
        items: [
          "起飞前用冰岛官方无人机地图核对空域；现场见 No Drones 牌即停。大风天（冰岛常见）小型机抗风不足，先查 vedur.is 风速再决定。"
        ]
      }
    ],
    quickChecklist: [">250g 或带摄像头须注册并考 A1/A3","限高 120 m，全程目视","起飞前用官方无人机地图核空域"]
  },
  {
    id: "wb-84",
    category: "drone",
    country: "norway",
    title: "挪威无人机注册与传感器申报",
    shortDesc: "挪威飞无人机的注册、保险与\"外籍传感器申报\"要求。",
    iconName: "Plane",
    urgency: "high",
    tags: ["挪威无人机注册与传感器申报","挪威"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "挪威沿用 EASA：>250g 或带摄像头须在 flydrone.no 注册（230 NOK/年）并考 A1/A3 在线证书；>250g 强制买保险（最低约 100 万欧元）。限高 120 m，机场 5 km 禁飞，国家公园与大型景观保护区原则上禁飞。",
          "挪威独有：外籍人士须提前向挪威国安局（NSM）在线申报摄像头 / 传感器使用（geodataonline.no），漏报可罚款、没收设备甚至驱逐。最高罚 NOK 1,000,000 + 6 个月监禁。",
          "在 Reine、Henningsvær 等渔村，勿拍居民日常与私人宅院——住户明确不愿被拍；这些村落人气高但隐私敏感，能避则避。"
        ]
      }
    ],
    quickChecklist: ["挪威在 flydrone.no 注册","外籍须向 NSM 申报摄像头/传感器","Reine / Henningsvær 不拍民宅"]
  },
  {
    id: "wb-85",
    category: "traffic",
    country: "norway",
    title: "挪威冬季胎法定要求",
    shortDesc: "挪威冬季胎何时强制、花纹多深、违规罚多少。",
    iconName: "Snowflake",
    urgency: "high",
    tags: ["挪威冬季胎法定要求","罗弗敦"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "挪威法定冬季胎（M+S 或 3PMSF 雪峰标）：南部 11月1日–3月31日；北部（Nordland、Troms、Finnmark——罗弗敦属 Nordland）提前至 10月16日–4月30日。花纹深度≥3 mm（推荐 5 mm）。"
        ]
      },
      {
        sectionTitle: "情形罚款 / 后果",
        items: [
          "每胎无冬季设备1,500 NOK/胎",
          "四胎全无（上限）6,000 NOK",
          "花纹不足1,500 NOK/胎",
          "无冬季胎出事故保险可整单拒赔"
        ]
      },
      {
        sectionTitle: "补充",
        items: [
          "钉胎（piggdekk）季 10月15日–4月30日（Nordland 到 5月1日），四轮都要装；进市区另收 ~30 NOK/天 toll。取车时蹲下看胎侧确认是冬季胎、量花纹，不符就换车。"
        ]
      }
    ],
    quickChecklist: ["罗弗敦冬季胎 10 月 16 日到 4 月 30 日","花纹深度至少 3 mm，推荐 5 mm","无冬季胎出事故保险可整单拒赔"]
  },
  {
    id: "wb-86",
    category: "traffic",
    country: "norway",
    title: "冬季随车应急装备清单",
    shortDesc: "雪天自驾后备箱该装什么，为何这些是硬性需求。",
    iconName: "Snowflake",
    urgency: "high",
    tags: ["冬季随车应急装备清单","冰岛","挪威"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "挪威公路局（Vegvesen）推荐随车：防滑链（前驱/后驱 2 条，四驱 4 条）、反光背心 + 三角警示牌、可伸缩铲 + 5 kg 沙袋、保温毯或轻睡袋 + 暖宝宝、高热量零食 + 保温杯热饮、LED 手电 + 备用电池。",
          "防滑链别压在行李箱最底下——暴风雪里你要在路边几分钟内取用。冬季进山前先查 vegvesen.no 是否有封路 / 排队放行（kolonnekjøring），积雪路段匀速、拉大车距、忌急刹。"
        ]
      },
      {
        sectionTitle: "补充",
        items: [
          "16机场免税店购物",
          "免税店（duty free）与第 14 章「退税」（tax free refund）是两回事：免税店是机场内直接免关税 + 增值税购买，退税是市区买完、出境时退回增值税。冰岛与挪威都不在欧盟增值税区内，本行程每一段跨区飞行都可合法购买免税品。"
        ]
      }
    ],
    quickChecklist: ["后备箱放防滑链、反光背心、三角牌","再加铲子、沙袋、保温毯和热饮","防滑链不要压在行李箱最底下"]
  },
  {
    id: "wb-87",
    category: "grocery",
    country: "both",
    title: "免税资格与欧盟增值税区边界",
    shortDesc: "哪些航班能真正免税，本行程哪些环节能买免税品。",
    iconName: "Plane",
    urgency: "medium",
    tags: ["免税资格与欧盟增值税区边界","冰岛","挪威"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "免税只对「离开欧盟增值税区（EU VAT area）」的旅客成立。芬兰是欧盟成员；冰岛、挪威都是 EEA/EFTA 成员，但不在欧盟增值税区内。因此本行程中 赫尔辛基↔冰岛、冰岛↔挪威、挪威↔赫尔辛基 每一段都跨增值税区边界，可合法购买免税品；唯独欧盟内部飞行（如赫尔辛基→巴黎）按含税价计，不享受免税。",
          "转机时只认最终目的地是否在欧盟增值税区内：去冰岛、挪威、英国、美国即成立；去欧盟内部国家则不成立。免税额度按入境国标准执行，与中转国无关。"
        ]
      }
    ],
    quickChecklist: ["只有离开欧盟增值税区才免税","HEL↔冰岛/挪威每段都可买免税","欧盟内部续飞按含税价"]
  },
  {
    id: "wb-88",
    category: "grocery",
    country: "both",
    title: "赫尔辛基机场免税店购物",
    shortDesc: "在赫尔辛基转机能买什么、哪些芬兰品牌值得、退税门槛多少。",
    iconName: "Plane",
    urgency: "low",
    tags: ["赫尔辛基机场免税店购物","冰岛","挪威"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "HEL 是 Finnair 枢纽，Schengen 区与非申根区各有两家 Helsinki Duty Free。芬兰设计品牌是主角：Marimekko（印花织物/服饰）、Iittala（玻璃/陶瓷）、Arabia（陶瓷）、Fazer（巧克力，Fazer Blue 经典）、Moomin 周边。芬兰 VAT 24%，非欧盟居民单店消费满 €40 可办退税。",
          "转机去冰岛/挪威（非欧盟增值税区）时，在中转区（airside）免税店购买即成立，无需办退税单；若回程经赫尔辛基回中国，出境前在 Global Blue 柜台验章退税。酒类、香水、化妆品对非欧盟旅客价差约 30–50%。"
        ]
      }
    ],
    quickChecklist: ["转机去冰岛/挪威可在 HEL 直接免税","芬兰设计看 Marimekko / Iittala / Fazer","回中国再走 Global Blue 退税"]
  },
  {
    id: "wb-89",
    category: "grocery",
    country: "iceland",
    title: "冰岛凯夫拉维克机场免税店购物",
    shortDesc: "冰岛在哪买酒最便宜、KEF 免税店如何分布、值得买什么。",
    iconName: "Plane",
    urgency: "medium",
    tags: ["冰岛凯夫拉维克机场免税店购物","冰岛"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "冰岛全境免税（非欧盟增值税区），机场免税店是买酒最便宜的地方——市区酒类只在国营 Vínbúðin 高价售卖。KEF 在出发区（安检后）与到达区（取行李前）共设多家 Iceland Duty Free，60,000 种免税商品、14 个品类。值得买：Brennivín 黑死酒、雷鸟精酿啤酒、Blue Lagoon 护肤、66°North 户外、羊毛针织（lopapeysa）、熔岩首饰、海鹦（puffin）周边。",
          "落地冰岛就在到达区免税店（取行李前）把酒买齐，比市区便宜 30%+；离境时再补货。酒类按入境限额携带（见下条），验章前切勿撕开免税袋封条。"
        ]
      }
    ],
    quickChecklist: ["落地 KEF 先在到达区把酒买齐","市区 Vínbúðin 比机场贵 30%+","验章前不要撕免税袋封条"]
  },
  {
    id: "wb-90",
    category: "grocery",
    country: "norway",
    title: "挪威机场免税店与到达区价差",
    shortDesc: "挪威免税店值得买什么、比市区便宜多少、有什么反直觉的坑。",
    iconName: "Plane",
    urgency: "medium",
    tags: ["挪威机场免税店与到达区价差","冰岛","挪威"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "挪威（非欧盟增值税区）烈酒税极高，机场免税店是最便宜渠道，且到达区也有免税店（挪威特色，入境即可买）。价差实例：Jack Daniel's 1L 机场 299.9 NOK vs Vinmonopolet 639.9 NOK；Linie Aquavit 1L 机场 250 vs 392.9 NOK；Freia 巧克力 机场 49.9 vs Meny 超市 62.9 NOK。但美妆/香水反而不划算——Prisjakt 对比 1,400 件商品，78% 线上更便宜（香水贵约 34%、护手霜贵约 21%）。",
          "酒、巧克力、Aquavit 在机场买；美妆香水别在机场买，市区或线上更省。购买位置按航段性质区分：奥斯陆（OSL）到达区免税店对国际到达开放——从冰岛飞抵即属国际到达，转挪威国内段前、过海关前先买齐；埃沃内斯（EVE）免税店位于出发区安检后与国际到达区，但挪威国内段航班购买数量受限——酒类留在 OSL 中转时买最稳妥。"
        ]
      }
    ],
    quickChecklist: ["酒和 Aquavit 在机场买最划算","美妆香水别在挪威机场买","从冰岛飞抵可在到达区先买酒"]
  },
  {
    id: "wb-91",
    category: "grocery",
    country: "iceland",
    title: "冰岛入境酒精免税限额",
    shortDesc: "带酒进冰岛能带多少、超出怎么办。",
    iconName: "Wine",
    urgency: "high",
    tags: ["冰岛入境酒精免税限额","冰岛"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "20 岁以上可免税带酒精（18 岁可带烟草）。标准组合：1L 烈酒（22–55%）+ 0.75L 葡萄酒 + 3L 啤酒；或 1L 烈酒 + 6L 啤酒；或 3L 葡萄酒 + 6L 啤酒；或 1.5L 葡萄酒 + 12L 啤酒。总量上限 6 个「酒精单位」（1L 烈酒=4 单位、0.75L 葡萄酒=1 单位、3L 啤酒=1 单位）。食品免税上限 3 kg / 25,000 ISK。",
          "超额走红色通道申报并补税，不确定就申报；肉类、奶制品（非 EEA 产）禁止带入，违者没收。"
        ]
      }
    ],
    quickChecklist: ["冰岛酒限额按 6 个酒精单位算","超额走红色通道申报补税","非 EEA 肉奶禁止带入"]
  },
  {
    id: "wb-92",
    category: "grocery",
    country: "norway",
    title: "挪威入境酒精免税限额",
    shortDesc: "带酒进挪威能带多少、年龄门槛、超限怎么算。",
    iconName: "Wine",
    urgency: "high",
    tags: ["挪威入境酒精免税限额","挪威"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "烈酒（>22%）须 20 岁，啤酒/葡萄酒 18 岁即可。标准额度：1L 烈酒 + 1.5L 葡萄酒 + 2L 啤酒；或 3L 葡萄酒 + 2L 啤酒；或纯啤酒 5L。额度可置换（1L 烈酒可换 1.5L 葡萄酒/啤酒；葡萄酒可 1:1 换啤酒，反之不行）。停留境外 >24h 可再带总值 6,000 NOK 的其他商品（<24h 降至 3,000 NOK 且不可买免税酒）。超限须申报补税（烈酒超量 423 NOK/L、葡萄酒 69 NOK/L）。",
          "落地挪威就在到达区免税店按额度买酒（最便宜合法渠道）；超量先用 Norwegian Customs app 清关再走绿色通道，否则可能没收+罚款。禁止带入 >60% 酒精度饮品。"
        ]
      },
      {
        sectionTitle: "补充",
        items: [
          "17封路与道路收费",
          "哪条路会临时封闭、哪条路要收钱、能不能绕——出发前和当天各查一次，是北欧自驾最省钱的习惯。"
        ]
      }
    ],
    quickChecklist: ["挪威烈酒须 20 岁，啤酒葡萄酒 18 岁","落地到达区按额度买最便宜","超量先用挪威海关 App 申报"]
  },
  {
    id: "wb-93",
    category: "traffic",
    country: "iceland",
    title: "冰岛道路收费全览",
    shortDesc: "冰岛哪些路收费、走经典南部路线是否要缴费。",
    iconName: "Coins",
    urgency: "high",
    tags: ["冰岛道路收费全览","冰岛"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "冰岛 99.9% 的道路免费，但 2026 年起全境有 2 处收费点，均无收费亭、无现金，靠摄像头识别车牌（ANPR）后线上缴费：① **Vaðlaheiðargöng** 隧道（北部 Akureyri 以东，环岛公路一段），小车单程 2,216 ISK（2026-03 起调价），24 小时内到 veggjald.is 或 Veggjald App 缴，2026-07 起隧道两端另设自助缴费机，逾期转租车行加收催收费；② **Hornafjörður** 环岛段（东南部 Höfn 附近，2026-09-01 起新增收费），新建约 19 km 路段 + 4 座桥、2026-06-24 通车，小车单程 1,500 ISK，无闸口、无现场缴费点，摄像头读牌后由车主（租车公司）按月收账单再转嫁给你并加行政费，想自付需提前在 spolur.is 注册车牌。曾收费的 Hvalfjörður 隧道（雷克雅未克北）自 2018 年起免费。黄金圈、南岸经典路线（Seljalandsfoss → Skógafoss → Vík → Jökulsárlón 冰河湖）全程无收费站，只有继续东行至 Höfn 或环岛才触发 Hornafjörður 段。另：2026-01-01 起全国征收每公里道路税 kílómetragjald（轿车 6.95 ISK/km，取代燃油税），租车公司取还车时读里程自动结算，与上述 2 处收费点无关、无需自缴。",
          "走南部经典路线无需准备过路费；若计划去 Höfn 吃龙虾或环岛东段，提前在 spolur.is 注册车牌预缴（或接受租车行转嫁 + 行政费）；误入 Vaðlaheiðargöng 则 24 小时内 veggjald.is 缴，绕行北侧 Víkurskarð 山路（免费，多 16 km / 约 20 分钟，冬季常封）是唯一绕法。"
        ]
      }
    ],
    quickChecklist: ["南部经典路线无需过路费","Hornafjörður 和 Vaðlaheiðargöng 要缴","误入隧道 24 小时内上 veggjald.is"]
  },
  {
    id: "wb-94",
    category: "traffic",
    country: "iceland",
    title: "冰岛封路查询与实时路况",
    shortDesc: "冰岛哪条路会临时封、怎么提前知道当天能不能开。",
    iconName: "Compass",
    urgency: "high",
    tags: ["冰岛封路查询与实时路况","冰岛"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "铺装公路（环岛公路、黄金圈、南岸）无季节性封路，只在急性天气（强风警报、暴雪、罕见冰川洪）下短暂封闭——这是当天决定而非规划期能预判的。唯一官方封路信源是公路局 Vegagerðin 的 umferdin.is / road.is，道路分色：绿=正常、黄=困难、橙=极难、红=封闭；红色路段绝对不可开。配套看 vedur.is（气象局）的风力与暴风警报（黄/橙/红三级），以及 safetravel.is 的行程备案与预警。",
          "出发前与途中每次休息时都查一遍：先看 road.is 封路色，再看 vedur.is 阵风数字（>20 m/s 单手控不住方向，见第 07 章），红/橙就改计划。拿不准打公路热线 1777（英语），并装 112 Iceland App 一键发送 GPS 定位求救。"
        ]
      }
    ],
    quickChecklist: ["出发前先查 road.is 封路色","再看 vedur.is 阵风数字","红/橙路段改计划，拿不准打 1777"]
  },
  {
    id: "wb-95",
    category: "traffic",
    country: "norway",
    title: "挪威道路收费与 AutoPASS",
    shortDesc: "挪威哪些路收费、罗弗敦自驾要不要缴、怎么缴。",
    iconName: "Coins",
    urgency: "high",
    tags: ["挪威道路收费与","AutoPASS","罗弗敦"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "挪威全国 AutoPASS 电子收费，无人工收费亭、无现金——开车穿过龙门架（标 bomstasjon）即被拍照扣费。收费点集中在南部大城市（奥斯陆进城 38–47 NOK/次）；北挪威 / 罗弗敦收费点极少，仅个别较新的跨海桥与海底隧道设 AutoPASS 龙门架，小车每处约 30–100 NOK。租车出厂已预装 AutoPASS 感应器，无需自己注册，还车后由租车行合并账单扣款，另加每笔 10–50 NOK 行政费；电车享折扣（部分项目减半）。",
          "罗弗敦 E10 主路基本免缴、个别点自动扣——桥隧是唯一通道，绕行要改坐渡轮反而更贵更慢，不必绕、直接过。取车时问清租车行行政费标准；短期游客让租车行自动结算即可，无需自办 AutoPASS 账户。"
        ]
      }
    ],
    quickChecklist: ["挪威过门架自动扣，不用停车缴","罗弗敦 E10 主路基本免缴","让租车行合并账单即可，不必自办账户"]
  },
  {
    id: "wb-96",
    category: "traffic",
    country: "norway",
    title: "Nappstraum 隧道施工封闭与放行",
    shortDesc: "罗弗敦 E10 上的 Nappstraum 海底隧道 2026 年施工，什么时段封闭",
    iconName: "Construction",
    urgency: "high",
    tags: ["Nappstraum","隧道施工封闭与放行","罗弗敦"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "Nappstraumtunnelen（长 1,780 m，连接 Flakstadøya 与 Vestvågøya，E10 上 Svolvær→Reine 的必经段）正做隧道安全升级，工期到 2027-12。通行规则（官方）：夜间 23:00–06:00 封闭，此间只在 02:00 放行一次；白天跟引导车（convoy）分批通过——06:00–09:00 与 15:00–17:00 每小时放行 2 次，09:00–15:00 与 17:00–23:00 每小时放行 1 次，整点从 Leknes 侧出发、半点从 Napp 侧出发。全程对行人与自行车封闭。",
          "白天行车会被压进半小时到一小时一批的引导车队，到隧道口排队等引导车再跟着开，别抢、别逆向插队；从 Leknes 侧过去赶整点放行最顺。若行程可能拖到 23:00 后，别硬闯夜间封闭——只 02:00 放一次，错过要在隧道口过夜等。出发当天用 vegvesen.no 搜「Nappstraumtunnelen」核对当天放行时刻（偶有额外放行，如 9/19 就临时加开了 23:30 一班）。"
        ]
      }
    ],
    quickChecklist: ["Nappstraum 夜间 23:00–06:00 封闭","白天跟引导车分批过，别抢道","出发当天用 vegvesen.no 核对放行时刻"]
  },
  {
    id: "wb-97",
    category: "traffic",
    country: "norway",
    title: "挪威天气性封路与实时查询",
    shortDesc: "挪威 E10 会不会封路、怎么查当天路况。",
    iconName: "Compass",
    urgency: "high",
    tags: ["挪威天气性封路与实时查询","罗弗敦"],
    details: [
      {
        sectionTitle: "要点",
        items: [
          "E10 是罗弗敦唯一主路、全年开放，只在极端情况（暴雪、落石/岩崩、雪崩、事故）下封闭数小时，属少见事件。9–10 月雪崩风险仍为低/中，11 月起转高。官方实时信源：vegvesen.no/trafikk（公路局地图，标注封路/施工/摄像头）、热线 175、App Vegvesen trafikk；天气用 yr.no。",
          "每天出发前开 vegvesen.no 查 E10 有无红标封路或单侧交替通行（道路施工常设红绿灯单车道）；罗弗敦段平均车速仅 40–50 km/h、弯多路窄，按小时排行程别按公里。封路绕行通常无捷径——就地等放行或折返。"
        ]
      }
    ],
    quickChecklist: ["每天出发前查 vegvesen.no 的 E10","罗弗敦均速只有 40–50 km/h","封路通常无捷径，就地等放行"]
  }
];
