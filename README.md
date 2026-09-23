# 2026 欧洲五国同行指南

面向四人欧洲行程的移动端协作网页：包含 2026 年 9 月 24 日至 10 月 7 日的西班牙、瑞士、荷兰、挪威和瑞典行程，并整合路况指南、实时共享记账与云端票根夹。登录后，同行成员可同步编辑行程、账单、汇率与票据。

> 当前版本用于四人同行协作，默认静态内容来自 `2026北欧行程表_9.24-10.7.xlsx`。

---

## 📱 产品界面

### 行程规划与地图导航

按天查看路线、景点与住宿信息，景点可一键跳转到 Google 地图。

![行程规划与 Google 地图导航](./docs/screenshots/itinerary-map.png)

### 欧洲五国旅行手册

覆盖西班牙、瑞士、挪威与瑞典的交通、停车、餐饮、购物、景点机位与紧急信息。

![北欧自驾手册与交通规则](./docs/screenshots/guidebook-rules.png)

![罗弗敦拍摄机位与详细攻略](./docs/screenshots/guidebook-photo-spots.png)

### 自驾工具箱

集成多币种记账、紧急电话和无人机风控工具。

![多币种记账、紧急救援与无人机风控](./docs/screenshots/toolbox.png)

### 票根夹

集中保存机票、酒店与景点票据，支持图片和 PDF 导入及本地 OCR 解析。

![机票、酒店与景点票据管理](./docs/screenshots/voucher-folder.png)

---

## ✨ 功能特性

- **五国手册**：西班牙、瑞士、荷兰、挪威和瑞典的交通、停车、餐饮、购物、景点机位与紧急信息。
- **带来源的目的地资料**：新增巴塞罗那、瑞士山区、阿姆斯特丹、挪威峡湾、罗弗敦、奥斯陆和斯德哥尔摩实用卡片，标注官方、Wikipedia/Wikimedia 与小红书公开搜索来源及检索日期。
- **Google Maps 收藏导入**：粘贴共享收藏链接后自动解析地点名称、地址、坐标、国家、类型和图片预览，确认后写入共享万能手册；支持合并重复地点并保留 Google Maps 直达链接。
- **行程时间线**：按天展示 2026 年 9 月 24 日至 10 月 7 日的 14 天路线、景点、交通、住宿、餐饮和购物；支持主/备选景点详情、在线编辑、实时同步和完成状态。展开当天行程可按地点一键搜索小红书景点、美食、购物和攻略；编辑时也可上传小红书或攻略截图，由浏览器本地 OCR 自动提取并分类，可选择增加到当前或替换已识别栏目，确认后再保存同步。
- **每日天气、日出日落与穿衣建议**：从 Open-Meteo 获取计划地点逐日预报，显示温度、体感、降雨、风力、当地日出日落和穿衣建议，并给出日落拍摄建议到达时间；每天打开时自动刷新并共享给同行成员。
- **机票与行李额检查**：机票夹内置国航、瑞士航空、伏林航空、荷兰皇家航空、挪威穿梭航空和北欧航空的本次票面额度；每张航班卡下方标注“每人”或“四人合计”的额度，四位成员也可分别填写逐件重量，自动检查个人单件重量、件数、随身组合重量和团队共享件数是否超额。
- **工具箱**：
  - 随手记账：新增和编辑均使用弹窗；固定四成员、付款人与分账人、个人支出、单笔账单支持全部结算或勾选部分已结算成员、按人净额结算、成员间已转账流水及 XLSX/XLS/CSV 批量导入；可导出包含账单、成员结算和共享汇率的 Excel，统计团队分类总额、每人总花费与每人的分类花费。
  - 多币种：人民币、港币、挪威克朗、欧元、瑞士法郎、瑞典克朗，共享汇率。
  - 无人机风控：输入实时风力，评估起飞安全与抗风等级。
  - 紧急救援：西班牙、瑞士、挪威和瑞典紧急电话、道路信息与领事保护。
- **票根夹**：上传机票 / 酒店 / 景点门票截图或 PDF，自动 OCR 解析航班与酒店信息；文件存入私有云端桶，并通过短时签名链接预览。
- **餐饮与租车票根**：票根可按餐饮预订、租车预订和其他文件筛选，卡片展示日期时间、人数、地址、电话、预订号、车型与费用等关键信息。
- **共享架构**：前台成员 ID 登录（wyw / yyy / yh / lqw），底层 Supabase Auth、Postgres、RLS 与 Realtime；票据使用私有 Storage 与短时签名链接预览。

---

## 🔒 隐私与开源说明

- 行程、票根、记账和汇率会同步到同一旅行空间；只有已登录账号可以访问。
- 默认行程来自 `2026北欧行程表_9.24-10.7.xlsx`，可在网页内继续编辑。

---

## 🚀 快速开始

需要 Node.js 18+（推荐 20+）。

```bash
npm install      # 安装依赖
npm run dev      # 本地开发，默认 http://localhost:3000
npm run build    # 产物输出到 dist/
npm run preview  # 本地预览构建产物
```

需配置 `VITE_SUPABASE_URL` 和 `VITE_SUPABASE_PUBLISHABLE_KEY`（也兼容旧名 `VITE_SUPABASE_ANON_KEY`）。数据库结构见 `supabase/migrations/`。

---

## 🌐 部署

纯静态站点，可直接托管到任意静态平台：

- **Vercel / Netlify / Cloudflare Pages / GitHub Pages**：构建命令 `npm run build`，发布目录 `dist`。
- 也可 `npm run preview` 后用任意静态服务器托管 `dist/`。

---

## 🧱 技术栈

- React 19 + Vite 6 + TypeScript（strict）
- Tailwind CSS v4（`@tailwindcss/vite`）
- `motion` 动画、`lucide-react` 图标
- `tesseract.js` + `pdfjs-dist` 用于票根 OCR / PDF 解析（均在浏览器本地完成）
- 状态持久化：Supabase Postgres + Realtime；`localStorage` 仅作本地缓存与首次迁移

---

## 📁 目录结构（节选）

```
src/
  App.tsx                    # 四底栏路由：行程 / 手册 / 工具箱 / 票根夹
  components/
    ItineraryTimeline.tsx    # 共享行程时间线与在线编辑
    VoucherFolder.tsx        # 票根夹（机票/酒店/门票、本地 OCR、云端文件）
    ExpenseTracker.tsx       # 四人记账、自动分账、结算与表格导入
    DroneCalculator.tsx      # 无人机风速风控
    EmergencyPhones.tsx      # 紧急电话
    ...
  data/                      # 本次行程、五国手册与景点资料库
  lib/
    useSharedTable.ts        # Supabase 共享数据与实时订阅 Hook
    themeStyles.ts           # 主题配色
```

---

## 📄 License

[MIT](./LICENSE) © 2026 gasoooline
