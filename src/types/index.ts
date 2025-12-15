// 行程總覽
export interface Itinerary {
  id: string;
  name: string;
  date: string;
  dayNumber: number;
  city: 'shenzhen' | 'hongkong' | 'taipei';
}

// 行程項目
export interface Activity {
  id: string;
  name: string;
  dayId: string;
  time: string;
  startTime?: string; // 開始時間 "HH:mm"
  endTime?: string;   // 結束時間 "HH:mm"
  type: 'attraction' | 'transport' | 'food' | 'hotel' | 'shopping';
  location: string;
  coordinates: string;
  description: string;
  tips: string;
  mustEat: string[];
  mustBuy: string[];
  price: string;
  order: number;
}

// 航班資訊
export interface Flight {
  id: string;
  name: string; // 去程/回程
  flightNo: string;
  date: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  checkInCounter: string;
  gate: string;
  seat: string;
  baggageAllowance: string;
  bookingRef: string;
  notes: string;
  order: number;
}

// 景點/美食攻略
export interface Attraction {
  id: string;
  name: string;
  city: 'shenzhen' | 'hongkong';
  type: 'attraction' | 'shopping' | 'restaurant';
  description: string;
  tips: string;
  highlight: string;
  mustBuy: string[];
  order: number;
}

// 旅遊資訊
export interface TravelInfo {
  id: string;
  name: string;
  category: 'hotel' | 'emergency' | 'souvenir' | 'notice' | 'clothing';
  content: string;
  subContent: string;
  city: 'shenzhen' | 'hongkong' | '';
  dateRange: string;
  phone: string;
  important: boolean;
  order: number;
}

// 天氣資料
export interface WeatherData {
  temp: string;
  text: string;
  icon: string;
  humidity: string;
  windDir: string;
  windScale: string;
}

// 匯率資料
export interface ExchangeRate {
  currency: string;
  cashBuy: number;
  cashSell: number;
  spotBuy: number;
  spotSell: number;
  updateTime: string;
}

// 餐廳 POI 資料
export interface Restaurant {
  id: string;
  name: string;
  type: string;
  address: string;
  tel: string;
  distance: string;
  rating: string;
  location: {
    lng: number;
    lat: number;
  };
}

// 城市座標
export const CITY_COORDS: Record<string, { lng: number; lat: number; name: string }> = {
  shenzhen: { lng: 114.0579, lat: 22.5431, name: '深圳' },
  hongkong: { lng: 114.1694, lat: 22.3193, name: '香港' },
  taipei: { lng: 121.5654, lat: 25.033, name: '台北' },
};
