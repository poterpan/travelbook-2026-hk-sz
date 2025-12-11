# 旅遊小工具 - 深圳香港 5天4夜

一個行動優先的旅遊行程 Web App，提供即時天氣、匯率換算、GPS 美食推薦等功能，並與 Notion 資料庫雙向同步。

## 功能特色

- 📅 **每日行程卡片** - 依日期自動選擇當天行程，標示「進行中」與「下一個」活動
- 🌤️ **即時天氣** - 和風天氣 API，依城市顯示當前天氣
- 💱 **匯率換算** - 台灣銀行即時匯率，支援 TWD/HKD/CNY 換算
- 🍜 **GPS 美食推薦** - 高德地圖 POI 搜尋附近 20 間高評價餐廳
- 🗺️ **多平台導航** - 支援高德/Google/Apple 地圖一鍵導航
- 📝 **Notion 同步** - 行程資料存放於 Notion，支援即時更新
- 📱 **PWA 支援** - 可安裝至手機主畫面

## 技術架構

```
Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
```

### 專案結構

```
src/
├── app/
│   ├── page.tsx          # 首頁 - 每日行程
│   ├── explore/          # 探索 - 景點攻略、必吃美食
│   ├── food/             # 美食 - GPS 附近餐廳
│   ├── tools/            # 工具 - 航班、住宿、匯率等
│   └── api/              # API Routes
│       ├── itinerary/    # 行程 API
│       ├── activities/   # 活動 API
│       ├── weather/      # 天氣 API
│       ├── exchange/     # 匯率 API
│       ├── restaurants/  # 餐廳 API
│       └── travelinfo/   # 旅遊資訊 API
├── components/
│   ├── ui/               # UI 元件
│   ├── cards/            # 卡片元件
│   └── layout/           # 版面元件
├── lib/
│   ├── notion.ts         # Notion API 封裝
│   ├── weather.ts        # 和風天氣 API
│   ├── exchange.ts       # 台銀匯率 API
│   └── amap.ts           # 高德地圖 API
└── types/
    └── index.ts          # TypeScript 型別定義
```

## 資料架構

### Notion 資料庫結構

本專案使用 3 個 Notion 資料庫：

#### 1. Itinerary（行程總覽）

| 欄位 | 類型 | 說明 |
|------|------|------|
| Name | Title | 行程名稱，如「Day 1 - 抵達深圳」 |
| Date | Date | 日期，如 2026-01-28 |
| DayNumber | Number | 第幾天，如 1 |
| City | Select | 城市：深圳 / 香港 / 台北 |

#### 2. Activities（活動項目）

| 欄位 | 類型 | 說明 |
|------|------|------|
| Name | Title | 活動名稱 |
| Day | Relation | 關聯到 Itinerary |
| Time | Text | 時間，格式 `HH:mm` 或 `HH:mm-HH:mm` |
| Type | Select | 類型：景點 / 交通 / 餐飲 / 住宿 / 購物 |
| Location | Text | 地點名稱 |
| Coordinates | Text | 座標，格式 `經度,緯度` |
| Description | Text | 描述 |
| Tips | Text | 小提示 |
| MustEat | Multi-select | 必吃美食標籤 |
| MustBuy | Multi-select | 必買伴手禮標籤 |
| Price | Text | 價格資訊 |
| Order | Number | 排序順序 |

#### 3. TravelInfo（旅遊資訊）

| 欄位 | 類型 | 說明 |
|------|------|------|
| Name | Title | 資訊名稱 |
| Category | Select | 類別：flight / hotel / emergency / souvenir / notice / clothing |
| Content | Text | 內容 |
| Important | Checkbox | 是否重要 |

### 資料流程圖

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Notion    │────▶│  Next.js    │────▶│   前端頁面   │
│  Database   │◀────│  API Routes │◀────│  Components │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │     外部 API 服務       │
              ├────────────────────────┤
              │ • 和風天氣 (天氣資料)   │
              │ • 台灣銀行 (匯率 CSV)   │
              │ • 高德地圖 (餐廳 POI)   │
              └────────────────────────┘
```

## 環境設定

### 1. 複製環境變數

```bash
cp .env.example .env.local
```

### 2. 設定 API Keys

編輯 `.env.local`：

```env
# Notion
NOTION_TOKEN=your_notion_integration_token
NOTION_ITINERARY_DB=your_itinerary_database_id
NOTION_ACTIVITIES_DB=your_activities_database_id
NOTION_TRAVELINFO_DB=your_travelinfo_database_id

# 和風天氣
QWEATHER_HOST=your_qweather_host
QWEATHER_KEY=your_qweather_key

# 高德地圖
NEXT_PUBLIC_AMAP_JS_KEY=your_amap_js_key
AMAP_JS_SECRET=your_amap_js_secret
AMAP_WEB_KEY=your_amap_web_key
```

### 3. 建立 Notion 資料庫

1. 在 Notion 建立 3 個資料庫（結構如上）
2. 建立 [Notion Integration](https://www.notion.so/my-integrations)
3. 將 Integration 連結到資料庫（點擊資料庫右上角 ... → 連結）
4. 複製 Database ID（從資料庫 URL 取得，格式為 32 位元字串）

### 4. 初始化範例資料（選用）

```bash
npx ts-node scripts/seed-notion.ts
```

此腳本會依據 `TRIP.md` 的行程資料自動建立 Notion 頁面。

## 開發

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev

# 建置
npm run build

# 啟動正式環境
npm start
```

## 部署

本專案設計用於 Cloudflare Pages 部署：

```bash
npm run build
npx wrangler pages deploy .next
```

或連結 GitHub 自動部署。

## 測試時間功能

修改 `src/app/page.tsx` 中的 `TEST_NOW` 變數來模擬不同時間：

```typescript
// 測試 Day 2 下午 2:30
const TEST_NOW: string | null = '2026-01-29T14:30:00';

// 使用真實時間（正式環境）
const TEST_NOW: string | null = null;
```

## API 說明

| 端點 | 方法 | 說明 |
|------|------|------|
| `/api/itinerary` | GET | 取得所有行程日期 |
| `/api/activities?dayId={id}` | GET | 取得特定日期的活動 |
| `/api/weather?city={city}` | GET | 取得城市天氣（shenzhen/hongkong） |
| `/api/exchange` | GET | 取得台銀即時匯率（HKD、CNY） |
| `/api/restaurants?lng={lng}&lat={lat}` | GET | 搜尋附近餐廳 |
| `/api/travelinfo` | GET | 取得旅遊資訊 |

## 外部服務申請

| 服務 | 用途 | 申請連結 |
|------|------|----------|
| Notion API | 資料儲存 | [developers.notion.com](https://developers.notion.com/) |
| 和風天氣 | 天氣資料 | [dev.qweather.com](https://dev.qweather.com/) |
| 高德地圖 | POI 搜尋、導航 | [lbs.amap.com](https://lbs.amap.com/) |
| 台灣銀行 | 匯率資料 | 免申請，公開 CSV |

## 開發筆記

### 資料寫入流程

本專案的行程資料是透過 `scripts/seed-notion.ts` 腳本從 `TRIP.md` 解析後寫入 Notion：

1. **解析 Markdown** - 讀取 `TRIP.md` 中的行程資訊
2. **建立 Itinerary** - 為每一天建立一筆行程記錄
3. **建立 Activities** - 解析每日活動，關聯到對應的 Itinerary
4. **設定 Relation** - 活動透過 Day 欄位關聯到行程

```typescript
// 建立活動並關聯到行程
await notion.pages.create({
  parent: { database_id: ACTIVITIES_DB },
  properties: {
    Name: { title: [{ text: { content: '華強北電子市場' } }] },
    Day: { relation: [{ id: dayPageId }] },  // 關聯到 Itinerary
    Time: { rich_text: [{ text: { content: '14:00-17:00' } }] },
    Type: { select: { name: '景點' } },
    // ...其他欄位
  }
});
```

### 時間判斷邏輯

活動的「進行中」狀態判斷：

```typescript
// 從 Time 欄位解析開始/結束時間
// 支援格式："14:30" 或 "14:30-16:00"
const timeMatch = timeStr.match(/^(\d{1,2}:\d{2})(?:\s*[-~]\s*(\d{1,2}:\d{2}))?/);

// 判斷是否在時間範圍內
if (endTime) {
  return now >= startTime && now <= endTime;
} else {
  // 沒有結束時間，預設 2 小時
  return now >= startTime && now <= startTime + 2hours;
}
```

### 匯率解析

台灣銀行 CSV 格式：
```
幣別,匯率,現金,即期,...,匯率,現金,即期,...
HKD,本行買入,3.86100,3.98200,...,本行賣出,4.06500,4.05200,...
```

解析重點：
- Index 0: 幣別
- Index 2: 現金買入
- Index 12: 現金賣出（我們使用這個）

## 授權

MIT License

---

Built with Claude Code
