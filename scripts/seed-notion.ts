/**
 * Notion Database Seeding Script
 *
 * This script populates the Notion databases with initial trip data
 * Run with: npx tsx scripts/seed-notion.ts
 */

import { Client } from '@notionhq/client';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const notion = new Client({ auth: process.env.NOTION_TOKEN });

const ITINERARY_DB = process.env.NOTION_ITINERARY_DB!;
const ACTIVITIES_DB = process.env.NOTION_ACTIVITIES_DB!;
const FLIGHTS_DB = process.env.NOTION_FLIGHTS_DB!;
const ATTRACTIONS_DB = process.env.NOTION_ATTRACTIONS_DB!;
const TRAVELINFO_DB = process.env.NOTION_TRAVELINFO_DB!;

// ============================================
// 航班資料
// ============================================
const flights = [
  {
    name: '去程',
    flightNo: 'UO115',
    date: '2026-01-28',
    departureAirport: '台北桃園 TPE T1',
    arrivalAirport: '香港 HKG T1',
    departureTime: '17:40',
    arrivalTime: '19:40',
    checkInCounter: '',
    gate: '',
    seat: '',
    baggageAllowance: '20kg 托運 + 7kg 手提',
    bookingRef: '',
    notes: '提前2小時到機場',
    order: 1,
  },
  {
    name: '回程',
    flightNo: 'HB706',
    date: '2026-02-01',
    departureAirport: '香港 HKG T1',
    arrivalAirport: '台北桃園 TPE T1',
    departureTime: '20:10',
    arrivalTime: '22:15',
    checkInCounter: '',
    gate: '',
    seat: '',
    baggageAllowance: '20kg 托運 + 7kg 手提',
    bookingRef: '',
    notes: '',
    order: 2,
  },
];

// ============================================
// 景點/美食攻略資料
// ============================================
const attractions = [
  // 深圳景點
  {
    name: 'SEG電子市場（賽格廣場）',
    city: '深圳',
    type: '購物',
    description: '亞洲最大的電子市場，9層樓，手機配件、電腦零件、數碼產品應有盡有',
    tips: '記得殺價！開價通常可以打6-7折',
    highlight: '',
    mustBuy: ['手機配件', '耐機設備', '科技小物'],
    order: 1,
  },
  {
    name: '華僑城創意園 OCT-LOFT',
    city: '深圳',
    type: '景點',
    description: '文青拍照聖地，類似台北華山文創園區，有各種藝術展覽和特色咖啡廳',
    tips: '適合下午去，可以待到傍晚拍照',
    highlight: '',
    mustBuy: [],
    order: 2,
  },
  {
    name: '深圳灣公園',
    city: '深圳',
    type: '景點',
    description: '海濱長廊，可遠眺香港，看夕陽絕佳地點',
    tips: '傍晚5-6點去最美，記得帶水',
    highlight: '',
    mustBuy: [],
    order: 3,
  },
  // 香港景點
  {
    name: '太平山頂',
    city: '香港',
    type: '景點',
    description: '香港最著名的觀景台，可以俯瞰整個維多利亞港和香港島',
    tips: '建議傍晚上去看夜景，山頂纜車來回HK$88',
    highlight: '',
    mustBuy: [],
    order: 4,
  },
  {
    name: '女人街（登打士街）',
    city: '香港',
    type: '購物',
    description: '香港最著名的街頭市集，服飾、小物、紀念品應有盡有',
    tips: '可以講價，但不像深圳那麼大的議價空間',
    highlight: '',
    mustBuy: ['紀念品', '服飾', '小飾品'],
    order: 5,
  },
  {
    name: '維多利亞港',
    city: '香港',
    type: '景點',
    description: '香港最著名的海港，每晚8點有幻彩詠香江燈光秀',
    tips: '天星小輪只要HK$3.4，很值得體驗',
    highlight: '',
    mustBuy: [],
    order: 6,
  },
  // 深圳美食
  {
    name: '八合里牛肉火鍋',
    city: '深圳',
    type: '餐廳',
    description: '潮汕牛肉火鍋',
    tips: '新鮮牛肉現切，必點吊龍、胸口油',
    highlight: '新鮮牛肉',
    mustBuy: [],
    order: 10,
  },
  {
    name: '潤園四季',
    city: '深圳',
    type: '餐廳',
    description: '椰子雞火鍋',
    tips: '椰子水煮雞，清甜好喝',
    highlight: '深圳特色',
    mustBuy: [],
    order: 11,
  },
  {
    name: '點都德',
    city: '深圳',
    type: '餐廳',
    description: '廣式早茶點心',
    tips: '蝦餃、燒賣、腸粉必點',
    highlight: '廣東點心',
    mustBuy: [],
    order: 12,
  },
  // 香港美食
  {
    name: '九記牛腩',
    city: '香港',
    type: '餐廳',
    description: '清湯牛腩、咖哩牛腩',
    tips: '要排隊，只收現金',
    highlight: '米其林推薦',
    mustBuy: [],
    order: 20,
  },
  {
    name: '蘭芳園',
    city: '香港',
    type: '餐廳',
    description: '絲襪奶茶創始店',
    tips: '必點絲襪奶茶、蔥油雞扒撈丁',
    highlight: '絲襪奶茶創始店',
    mustBuy: [],
    order: 21,
  },
  {
    name: '澳洲牛奶公司',
    city: '香港',
    type: '餐廳',
    description: '炒蛋多士、燉奶',
    tips: '要排隊但翻桌快，店員態度很兇但味道很好',
    highlight: '炒蛋多士必吃',
    mustBuy: [],
    order: 22,
  },
  {
    name: '鏞記酒家',
    city: '香港',
    type: '餐廳',
    description: '燒鵝專門店',
    tips: '價位較高但值得',
    highlight: '米其林星級',
    mustBuy: [],
    order: 23,
  },
  {
    name: '添好運',
    city: '香港',
    type: '餐廳',
    description: '平價米其林點心',
    tips: '必點酥皮焗叉燒包',
    highlight: '米其林點心',
    mustBuy: [],
    order: 24,
  },
];

// ============================================
// 旅遊資訊資料
// ============================================
const travelInfo = [
  // 住宿
  {
    name: '凱季星畔酒店',
    category: '住宿',
    content: '',
    subContent: '華強北街道振華路21號',
    city: '深圳',
    dateRange: '1/28-1/30（2晚）',
    phone: '',
    important: false,
    order: 1,
  },
  {
    name: '香港金堡賓館',
    category: '住宿',
    content: '',
    subContent: '旺角彌敦道607號新興大廈21樓2108室',
    city: '香港',
    dateRange: '1/30-2/1（2晚）',
    phone: '',
    important: false,
    order: 2,
  },
  // 緊急聯絡
  {
    name: '台北駐港經濟文化辦事處',
    category: '緊急聯絡',
    content: '護照遺失、緊急事件',
    subContent: '',
    city: '香港',
    dateRange: '',
    phone: '+852 2525 8316',
    important: true,
    order: 10,
  },
  {
    name: '香港報警',
    category: '緊急聯絡',
    content: '',
    subContent: '',
    city: '香港',
    dateRange: '',
    phone: '999',
    important: false,
    order: 11,
  },
  {
    name: '深圳報警',
    category: '緊急聯絡',
    content: '',
    subContent: '',
    city: '深圳',
    dateRange: '',
    phone: '110',
    important: false,
    order: 12,
  },
  // 伴手禮
  {
    name: '珍妮曲奇',
    category: '伴手禮',
    content: '要排隊，建議早點去',
    subContent: '',
    city: '香港',
    dateRange: '',
    phone: '',
    important: false,
    order: 20,
  },
  {
    name: '奇華餅家',
    category: '伴手禮',
    content: '蛋捲、老婆餅',
    subContent: '',
    city: '香港',
    dateRange: '',
    phone: '',
    important: false,
    order: 21,
  },
  {
    name: '鉅記手信',
    category: '伴手禮',
    content: '杏仁餅、豬肉乾',
    subContent: '',
    city: '香港',
    dateRange: '',
    phone: '',
    important: false,
    order: 22,
  },
  {
    name: '位元堂',
    category: '伴手禮',
    content: '龜苓膏、涼茶',
    subContent: '',
    city: '香港',
    dateRange: '',
    phone: '',
    important: false,
    order: 23,
  },
  {
    name: '屈臣氏/萬寧',
    category: '伴手禮',
    content: '藥妝、面膜',
    subContent: '',
    city: '香港',
    dateRange: '',
    phone: '',
    important: false,
    order: 24,
  },
  // 注意事項
  {
    name: '深圳需要台胞證',
    category: '注意事項',
    content: '入境深圳必備，請提前辦理',
    subContent: '',
    city: '',
    dateRange: '',
    phone: '',
    important: true,
    order: 30,
  },
  {
    name: '深圳很多地方不收現金',
    category: '注意事項',
    content: '務必設定好微信/支付寶',
    subContent: '',
    city: '',
    dateRange: '',
    phone: '',
    important: true,
    order: 31,
  },
  {
    name: '需要 VPN',
    category: '注意事項',
    content: '深圳上 Google、IG、FB、LINE 需要翻牆',
    subContent: '',
    city: '',
    dateRange: '',
    phone: '',
    important: true,
    order: 32,
  },
  {
    name: '華強北記得殺價',
    category: '注意事項',
    content: '通常可以砍到6-7折',
    subContent: '',
    city: '',
    dateRange: '',
    phone: '',
    important: false,
    order: 33,
  },
  {
    name: '香港地鐵站內禁止飲食',
    category: '注意事項',
    content: '包括喝水，會被罰款',
    subContent: '',
    city: '',
    dateRange: '',
    phone: '',
    important: true,
    order: 34,
  },
  {
    name: '香港塑膠袋要收費',
    category: '注意事項',
    content: 'HK$1-2，自備環保袋',
    subContent: '',
    city: '',
    dateRange: '',
    phone: '',
    important: false,
    order: 35,
  },
  // 衣著建議
  {
    name: '深圳/香港 1-2月：15-20°C',
    category: '衣著建議',
    content: '',
    subContent: '',
    city: '',
    dateRange: '',
    phone: '',
    important: false,
    order: 40,
  },
  {
    name: '建議穿著：長袖+薄外套',
    category: '衣著建議',
    content: '',
    subContent: '',
    city: '',
    dateRange: '',
    phone: '',
    important: false,
    order: 41,
  },
  {
    name: '偶有降雨，記得帶傘',
    category: '衣著建議',
    content: '',
    subContent: '',
    city: '',
    dateRange: '',
    phone: '',
    important: false,
    order: 42,
  },
  {
    name: '室內冷氣強，建議帶薄外套',
    category: '衣著建議',
    content: '',
    subContent: '',
    city: '',
    dateRange: '',
    phone: '',
    important: false,
    order: 43,
  },
];

// ============================================
// 行程資料
// ============================================
const itineraries = [
  { name: 'Day 1 - 1/28 台北→香港→深圳', date: '2026-01-28', dayNumber: 1, city: '深圳' },
  { name: 'Day 2 - 1/29 深圳華強北深度遊', date: '2026-01-29', dayNumber: 2, city: '深圳' },
  { name: 'Day 3 - 1/30 深圳→香港', date: '2026-01-30', dayNumber: 3, city: '香港' },
  { name: 'Day 4 - 1/31 香港經典一日遊', date: '2026-01-31', dayNumber: 4, city: '香港' },
  { name: 'Day 5 - 2/1 香港→台北', date: '2026-02-01', dayNumber: 5, city: '香港' },
];

// Day 1 活動
const day1Activities = [
  {
    name: '台北桃園機場起飛',
    time: '17:40',
    type: '交通',
    location: '台北桃園國際機場',
    description: '航班 UO115',
    tips: '提前2小時到機場',
    price: '',
    order: 1,
  },
  {
    name: '抵達香港國際機場',
    time: '19:40',
    type: '交通',
    location: '香港國際機場',
    description: '下機、入境、領行李',
    tips: '預留 35 分鐘',
    price: '',
    order: 2,
  },
  {
    name: '機場快線到西九龍站',
    time: '20:15-20:45',
    type: '交通',
    location: '香港機場快線',
    description: '車程約30分鐘',
    tips: '',
    price: 'HK$115',
    order: 3,
  },
  {
    name: '西九龍站過關、候車',
    time: '20:45-21:45',
    type: '交通',
    location: '香港西九龍站',
    description: '取票、過關、候車，預留1小時',
    tips: '',
    price: '',
    order: 4,
  },
  {
    name: '高鐵往深圳福田站',
    time: '22:14-22:32',
    type: '交通',
    location: '深圳福田站',
    description: '車程14分鐘',
    tips: '提前購票',
    price: 'HK$68-80',
    order: 5,
  },
  {
    name: '地鐵到1號線到華強北站',
    time: '22:32-22:40',
    type: '交通',
    location: '深圳地鐵',
    description: '2站，約5分鐘',
    tips: '',
    price: '¥2',
    order: 6,
  },
  {
    name: '凱季星畔酒店 Check-in',
    time: '23:00',
    type: '住宿',
    location: '華強北街道振華路21號',
    description: '深圳2晚住宿',
    tips: '',
    price: '',
    order: 7,
  },
  {
    name: '附近吃宵夜',
    time: '23:00-00:00',
    type: '餐飲',
    location: '華強北美食城',
    description: '華強北美食城或便利店',
    tips: '早點休息',
    price: '',
    order: 8,
  },
];

// Day 2 活動
const day2Activities = [
  {
    name: '酒店早餐或附近茶餐廳',
    time: '09:00-09:30',
    type: '餐飲',
    location: '華強北',
    description: '',
    tips: '',
    price: '',
    order: 1,
  },
  {
    name: 'SEG電子市場（賽格廣場）',
    time: '09:30-12:30',
    type: '景點',
    location: '深圳賽格廣場',
    description: '9層樓，最大最有名的電子市場，手機配件、電腦零件、數碼產品',
    tips: '記得殺價！開價通常可以打6-7折，多比價不要第一家就買',
    price: '',
    order: 2,
    mustBuy: ['手機配件', '電腦零件', '數碼產品'],
  },
  {
    name: '午餐',
    time: '12:30-14:00',
    type: '餐飲',
    location: '華強北',
    description: '推薦：點都德、海底撈、潮汕牛肉火鍋、椰子雞火鍋',
    tips: '',
    price: '¥150-200',
    order: 3,
    mustEat: ['點都德', '海底撈', '潮汕牛肉火鍋'],
  },
  {
    name: '華僑城創意園 OCT-LOFT',
    time: '14:00-17:00',
    type: '景點',
    location: '深圳華僑城創意園',
    description: '文青拍照聖地，類似台北華山文創園區',
    tips: '地鐵約15分鐘可到',
    price: '免費',
    order: 4,
  },
  {
    name: '晚餐',
    time: '18:00-20:00',
    type: '餐飲',
    location: '華強北',
    description: '推薦：老街美食街、翠華餐廳、探魚烤魚',
    tips: '試試喜茶/奈雪的茶（深圳發跡的手搖飲）',
    price: '¥100-150',
    order: 5,
    mustEat: ['喜茶', '奈雪的茶'],
  },
  {
    name: '深圳灣公園看夜景',
    time: '20:00-21:00',
    type: '景點',
    location: '深圳灣公園',
    description: '海濱長廊，可遠眺香港',
    tips: '或回酒店附近逛街',
    price: '免費',
    order: 6,
  },
];

// Day 3 活動
const day3Activities = [
  {
    name: '華強北最後採購',
    time: '09:00-11:00',
    type: '購物',
    location: '華強北電子市場',
    description: '補買遺漏的東西，最後比價',
    tips: '',
    price: '',
    order: 1,
  },
  {
    name: '退房、整理行李',
    time: '11:00-12:00',
    type: '住宿',
    location: '凱季星畔酒店',
    description: '',
    tips: '',
    price: '',
    order: 2,
  },
  {
    name: '午餐',
    time: '12:00-13:00',
    type: '餐飲',
    location: '酒店附近',
    description: '',
    tips: '',
    price: '',
    order: 3,
  },
  {
    name: '深圳→香港（過關）',
    time: '13:00-15:00',
    type: '交通',
    location: '羅湖/福田口岸',
    description: '華強北站地鐵→1號線到羅湖站→2過關→港鐵東鐵線到旺角東站→轉觀塘線1站到旺角站',
    tips: '過關預留1-1.5小時',
    price: '¥30 + HK$70',
    order: 4,
  },
  {
    name: '金堡賓館 Check-in',
    time: '15:00-15:30',
    type: '住宿',
    location: '旺角彌敦道607號新興大廈21樓2108室',
    description: '香港2晚住宿',
    tips: '放行李、休息',
    price: '',
    order: 5,
  },
  {
    name: '旺角周邊逛街',
    time: '15:30-18:00',
    type: '購物',
    location: '旺角',
    description: '女人街、波鞋街、朗豪坊、旺角中心、新世紀廣場、西洋菜街',
    tips: '',
    price: '',
    order: 6,
    mustBuy: ['球鞋', '運動用品'],
  },
  {
    name: '晚餐',
    time: '18:00-19:30',
    type: '餐飲',
    location: '旺角',
    description: '推薦：九記牛腩、蘭芳園、富記粥品、澳洲牛奶公司',
    tips: '九記牛腩要排隊',
    price: 'HK$100-150',
    order: 7,
    mustEat: ['九記牛腩', '蘭芳園絲襪奶茶'],
  },
  {
    name: '尖沙咀維港夜景',
    time: '19:30-21:30',
    type: '景點',
    location: '尖沙咀星光大道',
    description: '星光大道、維多利亞港、20:00幻彩詠香江燈光秀、天星小輪',
    tips: '天星小輪HK$3.4，超便宜',
    price: 'HK$3.4',
    order: 8,
  },
  {
    name: '旺角宵夜',
    time: '22:00',
    type: '餐飲',
    location: '旺角',
    description: '文輝墨魚丸、媽咪雞蛋仔、富記粥品',
    tips: '24小時營業餐廳很多',
    price: '',
    order: 9,
    mustEat: ['雞蛋仔', '墨魚丸'],
  },
];

// Day 4 活動
const day4Activities = [
  {
    name: '早餐',
    time: '09:00-10:00',
    type: '餐飲',
    location: '旺角',
    description: '推薦：澳洲牛奶公司、翠華餐廳',
    tips: '澳洲牛奶公司要排隊但很值得',
    price: 'HK$50-80',
    order: 1,
    mustEat: ['炒蛋多士'],
  },
  {
    name: '中環區域漫步',
    time: '10:00-12:30',
    type: '景點',
    location: '中環',
    description: '中環街市、石板街、蘭桂坊、中環摩天輪、香港摩天輪碼頭看海',
    tips: '石板街是拍照打卡聖地',
    price: '',
    order: 2,
  },
  {
    name: '午餐',
    time: '12:30-14:00',
    type: '餐飲',
    location: '中環',
    description: '推薦：鏞記酒家、蓮香樓、蘭芳園、IFC商場各式餐廳',
    tips: '鏞記酒家是米其林燒鵝',
    price: 'HK$100-200',
    order: 3,
    mustEat: ['鏞記燒鵝'],
  },
  {
    name: '銅鑼灣購物',
    time: '14:00-18:00',
    type: '購物',
    location: '銅鑼灣',
    description: '時代廣場、SOGO百貨、希慈廣場、利舞台廣場',
    tips: '',
    price: '',
    order: 4,
  },
  {
    name: '晚餐',
    time: '18:00-19:30',
    type: '餐飲',
    location: '銅鑼灣',
    description: '推薦：何洪記、一蘭拉麵、添好運',
    tips: '添好運是米其林點心',
    price: 'HK$100-150',
    order: 5,
    mustEat: ['添好運點心'],
  },
  {
    name: '太平山頂看夜景',
    time: '19:30-21:30',
    type: '景點',
    location: '太平山頂',
    description: '從銅鑼灣地鐵到中環站→轉山頂纜車上太平山→凌霄閣看夜景→山頂廣場',
    tips: '山頂纜車來回HK$88',
    price: 'HK$88',
    order: 6,
  },
  {
    name: '回旺角宵夜、逛街',
    time: '22:00',
    type: '餐飲',
    location: '旺角',
    description: '',
    tips: '',
    price: '',
    order: 7,
  },
];

// Day 5 活動
const day5Activities = [
  {
    name: '睡到自然醒、退房',
    time: '09:00-10:00',
    type: '住宿',
    location: '金堡賓館',
    description: '可寄放行李在櫃台',
    tips: '',
    price: '',
    order: 1,
  },
  {
    name: '最後採購伴手禮',
    time: '10:00-12:00',
    type: '購物',
    location: '旺角彌敦道',
    description: '珍妮曲奇、奇華餅家、鉅記手信、位元堂、屈臣氏/萬寧',
    tips: '珍妮曲奇要排隊，建議早點去',
    price: '',
    order: 2,
    mustBuy: ['珍妮曲奇', '奇華餅家', '鉅記手信'],
  },
  {
    name: '午餐',
    time: '12:00-13:00',
    type: '餐飲',
    location: '旺角或機場',
    description: '旺角隨便吃或直接去機場吃',
    tips: '',
    price: '',
    order: 3,
  },
  {
    name: '回金堡賓館拿行李',
    time: '13:00-13:10',
    type: '住宿',
    location: '金堡賓館',
    description: '',
    tips: '',
    price: '',
    order: 4,
  },
  {
    name: 'A21巴士往機場',
    time: '13:10-14:30',
    type: '交通',
    location: '彌敦道巴士站',
    description: '車程50-60分鐘，班距10-20分鐘一班',
    tips: '',
    price: 'HK$33',
    order: 5,
  },
  {
    name: '抵達香港國際機場',
    time: '14:30',
    type: '交通',
    location: '香港國際機場',
    description: '',
    tips: '',
    price: '',
    order: 6,
  },
  {
    name: '辦理登機、逛免稅店',
    time: '14:30-17:00',
    type: '購物',
    location: '香港國際機場',
    description: '提前3小時辦理登機手續，逛免稅店、機場美食廣場',
    tips: '',
    price: '',
    order: 7,
  },
  {
    name: '起飛回台北',
    time: '20:10',
    type: '交通',
    location: '香港國際機場',
    description: '航班 HB706',
    tips: '',
    price: '',
    order: 8,
  },
  {
    name: '抵達台北桃園機場',
    time: '22:15',
    type: '交通',
    location: '台北桃園國際機場',
    description: '平安歸來！',
    tips: '',
    price: '',
    order: 9,
  },
];

// ============================================
// Create Functions
// ============================================

async function createFlight(data: typeof flights[0]) {
  await notion.pages.create({
    parent: { database_id: FLIGHTS_DB },
    properties: {
      Name: { title: [{ text: { content: data.name } }] },
      FlightNo: { rich_text: [{ text: { content: data.flightNo } }] },
      Date: { rich_text: [{ text: { content: data.date } }] },
      DepartureAirport: { rich_text: [{ text: { content: data.departureAirport } }] },
      ArrivalAirport: { rich_text: [{ text: { content: data.arrivalAirport } }] },
      DepartureTime: { rich_text: [{ text: { content: data.departureTime } }] },
      ArrivalTime: { rich_text: [{ text: { content: data.arrivalTime } }] },
      CheckInCounter: { rich_text: [{ text: { content: data.checkInCounter } }] },
      Gate: { rich_text: [{ text: { content: data.gate } }] },
      Seat: { rich_text: [{ text: { content: data.seat } }] },
      BaggageAllowance: { rich_text: [{ text: { content: data.baggageAllowance } }] },
      BookingRef: { rich_text: [{ text: { content: data.bookingRef } }] },
      Notes: { rich_text: [{ text: { content: data.notes } }] },
      Order: { number: data.order },
    },
  });
  console.log(`  Created flight: ${data.name} - ${data.flightNo}`);
}

async function createAttraction(data: typeof attractions[0]) {
  await notion.pages.create({
    parent: { database_id: ATTRACTIONS_DB },
    properties: {
      Name: { title: [{ text: { content: data.name } }] },
      City: { select: { name: data.city } },
      Type: { select: { name: data.type } },
      Description: { rich_text: [{ text: { content: data.description } }] },
      Tips: { rich_text: [{ text: { content: data.tips } }] },
      Highlight: { rich_text: [{ text: { content: data.highlight } }] },
      MustBuy: { multi_select: data.mustBuy.map(name => ({ name })) },
      Order: { number: data.order },
    },
  });
  console.log(`  Created attraction: ${data.name}`);
}

async function createTravelInfo(data: typeof travelInfo[0]) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const properties: any = {
    Name: { title: [{ text: { content: data.name } }] },
    Category: { select: { name: data.category } },
    Content: { rich_text: [{ text: { content: data.content } }] },
    SubContent: { rich_text: [{ text: { content: data.subContent } }] },
    DateRange: { rich_text: [{ text: { content: data.dateRange } }] },
    Phone: { rich_text: [{ text: { content: data.phone } }] },
    Important: { checkbox: data.important },
    Order: { number: data.order },
  };

  // City 是選填的
  if (data.city) {
    properties.City = { select: { name: data.city } };
  }

  await notion.pages.create({
    parent: { database_id: TRAVELINFO_DB },
    properties,
  });
  console.log(`  Created travel info: ${data.name}`);
}

async function createItinerary(data: typeof itineraries[0]) {
  const response = await notion.pages.create({
    parent: { database_id: ITINERARY_DB },
    properties: {
      Name: { title: [{ text: { content: data.name } }] },
      Date: { date: { start: data.date } },
      DayNumber: { number: data.dayNumber },
      City: { select: { name: data.city } },
    },
  });
  console.log(`  Created itinerary: ${data.name}`);
  return response.id;
}

async function createActivity(dayId: string, data: typeof day1Activities[0] & { mustEat?: string[]; mustBuy?: string[] }) {
  await notion.pages.create({
    parent: { database_id: ACTIVITIES_DB },
    properties: {
      Name: { title: [{ text: { content: data.name } }] },
      Day: { relation: [{ id: dayId }] },
      Time: { rich_text: [{ text: { content: data.time } }] },
      Type: { select: { name: data.type } },
      Location: { rich_text: [{ text: { content: data.location } }] },
      Description: { rich_text: [{ text: { content: data.description } }] },
      Tips: { rich_text: [{ text: { content: data.tips } }] },
      Price: { rich_text: [{ text: { content: data.price } }] },
      Order: { number: data.order },
      ...(data.mustEat ? { MustEat: { multi_select: data.mustEat.map(name => ({ name })) } } : {}),
      ...(data.mustBuy ? { MustBuy: { multi_select: data.mustBuy.map(name => ({ name })) } } : {}),
    },
  });
  console.log(`    Created activity: ${data.name}`);
}

// ============================================
// Main
// ============================================

async function main() {
  console.log('🚀 Starting Notion database seeding...\n');

  // 1. 建立航班資料
  console.log('✈️  Creating flights...');
  for (const flight of flights) {
    await createFlight(flight);
  }

  // 2. 建立景點/美食攻略
  console.log('\n🏛️  Creating attractions...');
  for (const attraction of attractions) {
    await createAttraction(attraction);
  }

  // 3. 建立旅遊資訊
  console.log('\n📋 Creating travel info...');
  for (const info of travelInfo) {
    await createTravelInfo(info);
  }

  // 4. 建立行程
  console.log('\n📅 Creating itineraries...');
  const dayIds: string[] = [];
  for (const itinerary of itineraries) {
    const id = await createItinerary(itinerary);
    dayIds.push(id);
  }

  // 5. 建立活動
  console.log('\n📍 Creating activities...');

  console.log('  Day 1:');
  for (const activity of day1Activities) {
    await createActivity(dayIds[0], activity);
  }

  console.log('  Day 2:');
  for (const activity of day2Activities) {
    await createActivity(dayIds[1], activity);
  }

  console.log('  Day 3:');
  for (const activity of day3Activities) {
    await createActivity(dayIds[2], activity);
  }

  console.log('  Day 4:');
  for (const activity of day4Activities) {
    await createActivity(dayIds[3], activity);
  }

  console.log('  Day 5:');
  for (const activity of day5Activities) {
    await createActivity(dayIds[4], activity);
  }

  console.log('\n✅ Notion database seeding completed!');
}

main().catch(console.error);
