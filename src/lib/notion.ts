import { Client } from '@notionhq/client';
import type { Itinerary, Activity, Flight, Attraction, TravelInfo } from '@/types';

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const ITINERARY_DB = process.env.NOTION_ITINERARY_DB!;
const ACTIVITIES_DB = process.env.NOTION_ACTIVITIES_DB!;
const FLIGHTS_DB = process.env.NOTION_FLIGHTS_DB!;
const ATTRACTIONS_DB = process.env.NOTION_ATTRACTIONS_DB!;
const TRAVELINFO_DB = process.env.NOTION_TRAVELINFO_DB!;

// Helper to safely get property values
function getTextProperty(property: unknown): string {
  const prop = property as { type: string; title?: { plain_text: string }[]; rich_text?: { plain_text: string }[] };
  if (prop?.type === 'title' && prop.title) {
    return prop.title.map((t) => t.plain_text).join('');
  }
  if (prop?.type === 'rich_text' && prop.rich_text) {
    return prop.rich_text.map((t) => t.plain_text).join('');
  }
  return '';
}

function getNumberProperty(property: unknown): number {
  const prop = property as { type: string; number?: number };
  if (prop?.type === 'number' && prop.number !== null) {
    return prop.number ?? 0;
  }
  return 0;
}

function getSelectProperty(property: unknown): string {
  const prop = property as { type: string; select?: { name: string } };
  if (prop?.type === 'select' && prop.select) {
    return prop.select.name;
  }
  return '';
}

function getMultiSelectProperty(property: unknown): string[] {
  const prop = property as { type: string; multi_select?: { name: string }[] };
  if (prop?.type === 'multi_select' && prop.multi_select) {
    return prop.multi_select.map((s) => s.name);
  }
  return [];
}

function getDateProperty(property: unknown): string {
  const prop = property as { type: string; date?: { start: string } };
  if (prop?.type === 'date' && prop.date) {
    return prop.date.start;
  }
  return '';
}

function getCheckboxProperty(property: unknown): boolean {
  const prop = property as { type: string; checkbox?: boolean };
  if (prop?.type === 'checkbox') {
    return prop.checkbox ?? false;
  }
  return false;
}

function getRelationProperty(property: unknown): string[] {
  const prop = property as { type: string; relation?: { id: string }[] };
  if (prop?.type === 'relation' && prop.relation) {
    return prop.relation.map((r) => r.id);
  }
  return [];
}

// 取得所有行程
export async function getItineraries(): Promise<Itinerary[]> {
  const response = await notion.databases.query({
    database_id: ITINERARY_DB,
    sorts: [{ property: 'DayNumber', direction: 'ascending' }],
  });

  return response.results.map((page) => {
    const props = (page as { properties: Record<string, unknown> }).properties;
    const cityMap: Record<string, 'shenzhen' | 'hongkong' | 'taipei'> = {
      '深圳': 'shenzhen',
      '香港': 'hongkong',
      '台北': 'taipei',
    };
    const cityName = getSelectProperty(props.City);
    return {
      id: page.id,
      name: getTextProperty(props.Name),
      date: getDateProperty(props.Date),
      dayNumber: getNumberProperty(props.DayNumber),
      city: cityMap[cityName] || 'hongkong',
    };
  });
}

// 解析時間字串，支援 "14:30" 或 "14:30-16:00" 格式
function parseTimeString(timeStr: string): { startTime?: string; endTime?: string } {
  if (!timeStr) return {};
  const timeMatch = timeStr.match(/^(\d{1,2}:\d{2})(?:\s*[-~]\s*(\d{1,2}:\d{2}))?/);
  if (timeMatch) {
    return {
      startTime: timeMatch[1],
      endTime: timeMatch[2],
    };
  }
  return {};
}

// 取得特定日期的活動
export async function getActivitiesByDay(dayId: string): Promise<Activity[]> {
  const response = await notion.databases.query({
    database_id: ACTIVITIES_DB,
    filter: {
      property: 'Day',
      relation: {
        contains: dayId,
      },
    },
    sorts: [{ property: 'Order', direction: 'ascending' }],
  });

  return response.results.map((page) => {
    const props = (page as { properties: Record<string, unknown> }).properties;
    const typeMap: Record<string, Activity['type']> = {
      '景點': 'attraction',
      '交通': 'transport',
      '餐飲': 'food',
      '住宿': 'hotel',
      '購物': 'shopping',
    };
    const typeName = getSelectProperty(props.Type);
    const timeStr = getTextProperty(props.Time);
    const { startTime, endTime } = parseTimeString(timeStr);

    return {
      id: page.id,
      name: getTextProperty(props.Name),
      dayId: getRelationProperty(props.Day)[0] || '',
      time: timeStr,
      startTime,
      endTime,
      type: typeMap[typeName] || 'attraction',
      location: getTextProperty(props.Location),
      coordinates: getTextProperty(props.Coordinates),
      description: getTextProperty(props.Description),
      tips: getTextProperty(props.Tips),
      mustEat: getMultiSelectProperty(props.MustEat),
      mustBuy: getMultiSelectProperty(props.MustBuy),
      price: getTextProperty(props.Price),
      order: getNumberProperty(props.Order),
    };
  });
}

// 取得所有活動
export async function getAllActivities(): Promise<Activity[]> {
  const response = await notion.databases.query({
    database_id: ACTIVITIES_DB,
    sorts: [{ property: 'Order', direction: 'ascending' }],
  });

  return response.results.map((page) => {
    const props = (page as { properties: Record<string, unknown> }).properties;
    const typeMap: Record<string, Activity['type']> = {
      '景點': 'attraction',
      '交通': 'transport',
      '餐飲': 'food',
      '住宿': 'hotel',
      '購物': 'shopping',
    };
    const typeName = getSelectProperty(props.Type);
    const timeStr = getTextProperty(props.Time);
    const { startTime, endTime } = parseTimeString(timeStr);

    return {
      id: page.id,
      name: getTextProperty(props.Name),
      dayId: getRelationProperty(props.Day)[0] || '',
      time: timeStr,
      startTime,
      endTime,
      type: typeMap[typeName] || 'attraction',
      location: getTextProperty(props.Location),
      coordinates: getTextProperty(props.Coordinates),
      description: getTextProperty(props.Description),
      tips: getTextProperty(props.Tips),
      mustEat: getMultiSelectProperty(props.MustEat),
      mustBuy: getMultiSelectProperty(props.MustBuy),
      price: getTextProperty(props.Price),
      order: getNumberProperty(props.Order),
    };
  });
}

// 取得航班資訊
export async function getFlights(): Promise<Flight[]> {
  const response = await notion.databases.query({
    database_id: FLIGHTS_DB,
    sorts: [{ property: 'Order', direction: 'ascending' }],
  });

  return response.results.map((page) => {
    const props = (page as { properties: Record<string, unknown> }).properties;
    return {
      id: page.id,
      name: getTextProperty(props.Name),
      flightNo: getTextProperty(props.FlightNo),
      date: getTextProperty(props.Date),
      departureAirport: getTextProperty(props.DepartureAirport),
      arrivalAirport: getTextProperty(props.ArrivalAirport),
      departureTime: getTextProperty(props.DepartureTime),
      arrivalTime: getTextProperty(props.ArrivalTime),
      checkInCounter: getTextProperty(props.CheckInCounter),
      gate: getTextProperty(props.Gate),
      seat: getTextProperty(props.Seat),
      baggageAllowance: getTextProperty(props.BaggageAllowance),
      bookingRef: getTextProperty(props.BookingRef),
      notes: getTextProperty(props.Notes),
      order: getNumberProperty(props.Order),
    };
  });
}

// 取得景點/美食攻略
export async function getAttractions(): Promise<Attraction[]> {
  const response = await notion.databases.query({
    database_id: ATTRACTIONS_DB,
    sorts: [{ property: 'Order', direction: 'ascending' }],
  });

  return response.results.map((page) => {
    const props = (page as { properties: Record<string, unknown> }).properties;
    const cityMap: Record<string, 'shenzhen' | 'hongkong'> = {
      '深圳': 'shenzhen',
      '香港': 'hongkong',
    };
    const typeMap: Record<string, Attraction['type']> = {
      '景點': 'attraction',
      '購物': 'shopping',
      '餐廳': 'restaurant',
    };
    const cityName = getSelectProperty(props.City);
    const typeName = getSelectProperty(props.Type);

    return {
      id: page.id,
      name: getTextProperty(props.Name),
      city: cityMap[cityName] || 'hongkong',
      type: typeMap[typeName] || 'attraction',
      description: getTextProperty(props.Description),
      tips: getTextProperty(props.Tips),
      highlight: getTextProperty(props.Highlight),
      mustBuy: getMultiSelectProperty(props.MustBuy),
      order: getNumberProperty(props.Order),
    };
  });
}

// 取得旅遊資訊
export async function getTravelInfo(): Promise<TravelInfo[]> {
  const response = await notion.databases.query({
    database_id: TRAVELINFO_DB,
    sorts: [{ property: 'Order', direction: 'ascending' }],
  });

  return response.results.map((page) => {
    const props = (page as { properties: Record<string, unknown> }).properties;
    const categoryMap: Record<string, TravelInfo['category']> = {
      '住宿': 'hotel',
      '緊急聯絡': 'emergency',
      '伴手禮': 'souvenir',
      '注意事項': 'notice',
      '衣著建議': 'clothing',
    };
    const cityMap: Record<string, 'shenzhen' | 'hongkong' | ''> = {
      '深圳': 'shenzhen',
      '香港': 'hongkong',
    };
    const categoryName = getSelectProperty(props.Category);
    const cityName = getSelectProperty(props.City);

    return {
      id: page.id,
      name: getTextProperty(props.Name),
      category: categoryMap[categoryName] || 'notice',
      content: getTextProperty(props.Content),
      subContent: getTextProperty(props.SubContent),
      city: cityMap[cityName] || '',
      dateRange: getTextProperty(props.DateRange),
      phone: getTextProperty(props.Phone),
      important: getCheckboxProperty(props.Important),
      order: getNumberProperty(props.Order),
    };
  });
}

// 新增行程
export async function createItinerary(data: Omit<Itinerary, 'id'>): Promise<string> {
  const cityMap: Record<string, string> = {
    shenzhen: '深圳',
    hongkong: '香港',
    taipei: '台北',
  };

  const response = await notion.pages.create({
    parent: { database_id: ITINERARY_DB },
    properties: {
      Name: { title: [{ text: { content: data.name } }] },
      Date: { date: { start: data.date } },
      DayNumber: { number: data.dayNumber },
      City: { select: { name: cityMap[data.city] } },
    },
  });
  return response.id;
}

// 新增活動
export async function createActivity(data: Omit<Activity, 'id'>): Promise<string> {
  const typeMap: Record<string, string> = {
    attraction: '景點',
    transport: '交通',
    food: '餐飲',
    hotel: '住宿',
    shopping: '購物',
  };

  const response = await notion.pages.create({
    parent: { database_id: ACTIVITIES_DB },
    properties: {
      Name: { title: [{ text: { content: data.name } }] },
      Day: { relation: [{ id: data.dayId }] },
      Time: { rich_text: [{ text: { content: data.time } }] },
      Type: { select: { name: typeMap[data.type] } },
      Location: { rich_text: [{ text: { content: data.location } }] },
      Coordinates: { rich_text: [{ text: { content: data.coordinates } }] },
      Description: { rich_text: [{ text: { content: data.description } }] },
      Tips: { rich_text: [{ text: { content: data.tips } }] },
      MustEat: { multi_select: data.mustEat.map((name) => ({ name })) },
      MustBuy: { multi_select: data.mustBuy.map((name) => ({ name })) },
      Price: { rich_text: [{ text: { content: data.price } }] },
      Order: { number: data.order },
    },
  });
  return response.id;
}

// 更新活動
export async function updateActivity(id: string, data: Partial<Activity>): Promise<void> {
  const typeMap: Record<string, string> = {
    attraction: '景點',
    transport: '交通',
    food: '餐飲',
    hotel: '住宿',
    shopping: '購物',
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const properties: any = {};

  if (data.name !== undefined) {
    properties.Name = { title: [{ text: { content: data.name } }] };
  }
  if (data.time !== undefined) {
    properties.Time = { rich_text: [{ text: { content: data.time } }] };
  }
  if (data.type !== undefined) {
    properties.Type = { select: { name: typeMap[data.type] } };
  }
  if (data.location !== undefined) {
    properties.Location = { rich_text: [{ text: { content: data.location } }] };
  }
  if (data.description !== undefined) {
    properties.Description = { rich_text: [{ text: { content: data.description } }] };
  }
  if (data.tips !== undefined) {
    properties.Tips = { rich_text: [{ text: { content: data.tips } }] };
  }

  await notion.pages.update({
    page_id: id,
    properties,
  });
}

// 新增旅遊資訊
export async function createTravelInfo(data: Omit<TravelInfo, 'id'>): Promise<string> {
  const categoryMap: Record<string, string> = {
    flight: '航班',
    hotel: '住宿',
    emergency: '緊急聯絡',
    souvenir: '伴手禮',
    notice: '注意事項',
    clothing: '衣著建議',
  };

  const response = await notion.pages.create({
    parent: { database_id: TRAVELINFO_DB },
    properties: {
      Name: { title: [{ text: { content: data.name } }] },
      Category: { select: { name: categoryMap[data.category] } },
      Content: { rich_text: [{ text: { content: data.content } }] },
      Important: { checkbox: data.important },
    },
  });
  return response.id;
}
