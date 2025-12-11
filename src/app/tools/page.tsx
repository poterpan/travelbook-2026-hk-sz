'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import {
  Plane,
  Hotel,
  Phone,
  ShoppingBag,
  AlertTriangle,
  Shirt,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Coins,
} from 'lucide-react';
import ExchangeCalculator from '@/components/ui/ExchangeCalculator';
import type { TravelInfo } from '@/types';

// 預設資料（當 Notion 沒有資料時使用）
const defaultData = {
  flights: [
    {
      type: '去程',
      date: '2026/1/28',
      time: '17:40-19:40',
      flight: 'UO115',
      route: '台北→香港',
    },
    {
      type: '回程',
      date: '2026/2/1',
      time: '20:10-22:15',
      flight: 'HB706',
      route: '香港→台北',
    },
  ],
  hotels: [
    {
      name: '凱季星畔酒店',
      city: '深圳',
      dates: '1/28-1/30（2晚）',
      address: '華強北街道振華路21號',
    },
    {
      name: '香港金堡賓館',
      city: '香港',
      dates: '1/30-2/1（2晚）',
      address: '旺角彌敦道607號新興大廈21樓2108室',
    },
  ],
  emergency: [
    { name: '台北駐港經濟文化辦事處', phone: '+852 2525 8316' },
    { name: '香港報警', phone: '999' },
    { name: '深圳報警', phone: '110' },
  ],
  souvenirs: [
    { name: '珍妮曲奇', note: '要排隊，建議早點去', city: '香港' },
    { name: '奇華餅家', note: '蛋捲、老婆餅', city: '香港' },
    { name: '鉅記手信', note: '杏仁餅、豬肉乾', city: '香港' },
    { name: '位元堂', note: '龜苓膏、涼茶', city: '香港' },
    { name: '屈臣氏/萬寧', note: '藥妝、面膜', city: '香港' },
  ],
  notices: [
    { title: '深圳需要台胞證', content: '入境深圳必備，請提前辦理', important: true },
    { title: '深圳很多地方不收現金', content: '務必設定好微信/支付寶', important: true },
    { title: '需要 VPN', content: '深圳上 Google、IG、FB、LINE 需要翻牆', important: true },
    { title: '華強北記得殺價', content: '通常可以砍到6-7折', important: false },
    { title: '香港地鐵站內禁止飲食', content: '包括喝水，會被罰款', important: true },
    { title: '香港塑膠袋要收費', content: 'HK$1-2，自備環保袋', important: false },
  ],
  clothing: [
    '深圳/香港 1-2月：15-20°C',
    '建議穿著：長袖+薄外套',
    '偶有降雨，記得帶傘',
    '室內冷氣強，建議帶薄外套',
  ],
};

type SectionKey = 'exchange' | 'flights' | 'hotels' | 'emergency' | 'souvenirs' | 'notices' | 'clothing';

export default function ToolsPage() {
  const [expandedSections, setExpandedSections] = useState<SectionKey[]>(['exchange', 'flights', 'hotels']);
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);
  const [notionData, setNotionData] = useState<TravelInfo[]>([]);

  useEffect(() => {
    fetchNotionData();
  }, []);

  const fetchNotionData = async () => {
    try {
      const res = await fetch('/api/travelinfo');
      if (res.ok) {
        const data = await res.json();
        setNotionData(data);
      }
    } catch (error) {
      console.error('Failed to fetch travel info:', error);
    }
  };

  const toggleSection = (section: SectionKey) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const copyPhone = async (phone: string) => {
    try {
      await navigator.clipboard.writeText(phone);
      setCopiedPhone(phone);
      setTimeout(() => setCopiedPhone(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const Section = ({
    id,
    icon: Icon,
    title,
    color,
    children,
  }: {
    id: SectionKey;
    icon: React.ElementType;
    title: string;
    color: string;
    children: React.ReactNode;
  }) => {
    const isExpanded = expandedSections.includes(id);

    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <button
          onClick={() => toggleSection(id)}
          className="w-full flex items-center justify-between p-4"
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${color}`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-gray-900">{title}</span>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>
        {isExpanded && <div className="px-4 pb-4">{children}</div>}
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <Header title="工具" subtitle="重要資訊與準備清單" />

      <div className="px-4 py-4 space-y-3">
        {/* Exchange */}
        <Section id="exchange" icon={Coins} title="匯率換算" color="bg-amber-500">
          <ExchangeCalculator />
        </Section>

        {/* Flights */}
        <Section id="flights" icon={Plane} title="航班資訊" color="bg-blue-500">
          <div className="space-y-3">
            {defaultData.flights.map((flight, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl ${
                  flight.type === '去程' ? 'bg-blue-50' : 'bg-green-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    flight.type === '去程'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {flight.type}
                  </span>
                  <span className="text-sm text-gray-500">{flight.date}</span>
                </div>
                <p className="font-semibold text-gray-900">{flight.flight}</p>
                <p className="text-sm text-gray-600">
                  {flight.time} • {flight.route}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* Hotels */}
        <Section id="hotels" icon={Hotel} title="住宿資訊" color="bg-purple-500">
          <div className="space-y-3">
            {defaultData.hotels.map((hotel, i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    hotel.city === '深圳'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {hotel.city}
                  </span>
                  <span className="text-xs text-gray-500">{hotel.dates}</span>
                </div>
                <p className="font-semibold text-gray-900">{hotel.name}</p>
                <p className="text-sm text-gray-500 mt-1">{hotel.address}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Emergency */}
        <Section id="emergency" icon={Phone} title="緊急聯絡" color="bg-red-500">
          <div className="space-y-2">
            {defaultData.emergency.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
              >
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <a
                    href={`tel:${item.phone}`}
                    className="text-sm text-blue-500"
                  >
                    {item.phone}
                  </a>
                </div>
                <button
                  onClick={() => copyPhone(item.phone)}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  {copiedPhone === item.phone ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </Section>

        {/* Souvenirs */}
        <Section id="souvenirs" icon={ShoppingBag} title="必買伴手禮" color="bg-yellow-500">
          <div className="space-y-2">
            {defaultData.souvenirs.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      item.city === '深圳'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {item.city}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{item.note}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Notices */}
        <Section id="notices" icon={AlertTriangle} title="旅遊注意事項" color="bg-orange-500">
          <div className="space-y-2">
            {defaultData.notices.map((item, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl ${
                  item.important ? 'bg-orange-50 border border-orange-200' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-2">
                  {item.important && (
                    <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full font-medium">
                      重要
                    </span>
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{item.title}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{item.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Clothing */}
        <Section id="clothing" icon={Shirt} title="衣著建議" color="bg-teal-500">
          <div className="space-y-2">
            {defaultData.clothing.map((item, i) => (
              <div key={i} className="flex items-center gap-2 p-2">
                <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
                <p className="text-gray-700">{item}</p>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}
