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
  Luggage,
  Clock,
  MapPin,
} from 'lucide-react';
import ExchangeCalculator from '@/components/ui/ExchangeCalculator';
import NavigationModal from '@/components/ui/NavigationModal';
import type { Flight, TravelInfo } from '@/types';

type SectionKey = 'exchange' | 'flights' | 'hotels' | 'emergency' | 'souvenirs' | 'notices' | 'clothing';

export default function ToolsPage() {
  const [expandedSections, setExpandedSections] = useState<SectionKey[]>(['exchange', 'flights', 'hotels']);
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [travelInfo, setTravelInfo] = useState<TravelInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNavModal, setShowNavModal] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<string>('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [flightsRes, travelInfoRes] = await Promise.all([
        fetch('/api/flights'),
        fetch('/api/travelinfo'),
      ]);

      if (flightsRes.ok) {
        const data = await flightsRes.json();
        setFlights(data);
      }
      if (travelInfoRes.ok) {
        const data = await travelInfoRes.json();
        setTravelInfo(data);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
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

  const handleNavigate = (name: string) => {
    setSelectedDestination(name);
    setShowNavModal(true);
  };

  // 根據 category 分組 TravelInfo
  const hotels = travelInfo.filter((item) => item.category === 'hotel');
  const emergency = travelInfo.filter((item) => item.category === 'emergency');
  const souvenirs = travelInfo.filter((item) => item.category === 'souvenir');
  const notices = travelInfo.filter((item) => item.category === 'notice');
  const clothing = travelInfo.filter((item) => item.category === 'clothing');

  const Section = ({
    id,
    icon: Icon,
    title,
    color,
    children,
    isEmpty,
  }: {
    id: SectionKey;
    icon: React.ElementType;
    title: string;
    color: string;
    children: React.ReactNode;
    isEmpty?: boolean;
  }) => {
    const isExpanded = expandedSections.includes(id);

    if (isEmpty && !loading) return null;

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

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
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
        <Section id="flights" icon={Plane} title="航班資訊" color="bg-blue-500" isEmpty={flights.length === 0}>
          <div className="space-y-4">
            {flights.map((flight) => (
              <div
                key={flight.id}
                className={`p-4 rounded-xl ${
                  flight.name === '去程' ? 'bg-blue-50' : 'bg-green-50'
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    flight.name === '去程'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {flight.name}
                  </span>
                  <span className="text-sm text-gray-500">{formatDate(flight.date)}</span>
                </div>

                {/* Flight Number */}
                <p className="text-xl font-bold text-gray-900 mb-2">{flight.flightNo}</p>

                {/* Route */}
                <div className="flex items-center gap-2 text-sm mb-3">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{flight.departureAirport}</p>
                    <p className="text-gray-500">{flight.departureTime}</p>
                  </div>
                  <div className="text-gray-400">→</div>
                  <div className="flex-1 text-right">
                    <p className="font-medium text-gray-900">{flight.arrivalAirport}</p>
                    <p className="text-gray-500">{flight.arrivalTime}</p>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {flight.checkInCounter && (
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>櫃台 {flight.checkInCounter}</span>
                    </div>
                  )}
                  {flight.gate && (
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <Clock className="w-3.5 h-3.5" />
                      <span>登機口 {flight.gate}</span>
                    </div>
                  )}
                  {flight.seat && (
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <span className="w-3.5 h-3.5 text-center">💺</span>
                      <span>座位 {flight.seat}</span>
                    </div>
                  )}
                  {flight.baggageAllowance && (
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <Luggage className="w-3.5 h-3.5" />
                      <span>{flight.baggageAllowance}</span>
                    </div>
                  )}
                </div>

                {/* Booking Ref */}
                {flight.bookingRef && (
                  <div className="mt-3 pt-3 border-t border-gray-200/50">
                    <p className="text-xs text-gray-500">
                      訂位代號：<span className="font-mono font-medium text-gray-700">{flight.bookingRef}</span>
                    </p>
                  </div>
                )}

                {/* Notes */}
                {flight.notes && (
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="font-medium">📝</span> {flight.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Section>

        {/* Hotels */}
        <Section id="hotels" icon={Hotel} title="住宿資訊" color="bg-purple-500" isEmpty={hotels.length === 0}>
          <div className="space-y-3">
            {hotels.map((hotel) => (
              <div key={hotel.id} className="p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    {hotel.city && (
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        hotel.city === 'shenzhen'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {hotel.city === 'shenzhen' ? '深圳' : '香港'}
                      </span>
                    )}
                    {hotel.dateRange && (
                      <span className="text-xs text-gray-500">{hotel.dateRange}</span>
                    )}
                  </div>
                  <button
                    onClick={() => handleNavigate(hotel.name)}
                    className="p-1.5 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <MapPin className="w-4 h-4 text-blue-500" />
                  </button>
                </div>
                <p className="font-semibold text-gray-900">{hotel.name}</p>
                {hotel.subContent && (
                  <p className="text-sm text-gray-500 mt-1">{hotel.subContent}</p>
                )}
                {hotel.phone && (
                  <a href={`tel:${hotel.phone}`} className="text-sm text-blue-500 mt-1 block">
                    {hotel.phone}
                  </a>
                )}
              </div>
            ))}
          </div>
        </Section>

        {/* Emergency */}
        <Section id="emergency" icon={Phone} title="緊急聯絡" color="bg-red-500" isEmpty={emergency.length === 0}>
          <div className="space-y-2">
            {emergency.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
              >
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  {item.phone && (
                    <a href={`tel:${item.phone}`} className="text-sm text-blue-500">
                      {item.phone}
                    </a>
                  )}
                  {item.content && (
                    <p className="text-sm text-gray-500">{item.content}</p>
                  )}
                </div>
                {item.phone && (
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
                )}
              </div>
            ))}
          </div>
        </Section>

        {/* Souvenirs */}
        <Section id="souvenirs" icon={ShoppingBag} title="必買伴手禮" color="bg-yellow-500" isEmpty={souvenirs.length === 0}>
          <div className="space-y-2">
            {souvenirs.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    {item.city && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        item.city === 'shenzhen'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {item.city === 'shenzhen' ? '深圳' : '香港'}
                      </span>
                    )}
                  </div>
                  {item.content && (
                    <p className="text-sm text-gray-500">{item.content}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Notices */}
        <Section id="notices" icon={AlertTriangle} title="旅遊注意事項" color="bg-orange-500" isEmpty={notices.length === 0}>
          <div className="space-y-2">
            {notices.map((item) => (
              <div
                key={item.id}
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
                    <p className="font-medium text-gray-900">{item.name}</p>
                    {item.content && (
                      <p className="text-sm text-gray-500 mt-0.5">{item.content}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Clothing */}
        <Section id="clothing" icon={Shirt} title="衣著建議" color="bg-teal-500" isEmpty={clothing.length === 0}>
          <div className="space-y-2">
            {clothing.map((item) => (
              <div key={item.id} className="flex items-center gap-2 p-2">
                <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
                <p className="text-gray-700">{item.name}{item.content && ` - ${item.content}`}</p>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* Navigation Modal */}
      <NavigationModal
        isOpen={showNavModal}
        onClose={() => setShowNavModal(false)}
        destination={{ name: selectedDestination }}
      />
    </div>
  );
}
