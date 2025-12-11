'use client';

import { format, parseISO } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import type { Itinerary } from '@/types';

interface DaySelectorProps {
  days: Itinerary[];
  selectedDay: string | null;
  onSelectDay: (dayId: string) => void;
}

const cityColors: Record<string, string> = {
  shenzhen: 'bg-emerald-500',
  hongkong: 'bg-red-500',
  taipei: 'bg-blue-500',
};

const cityNames: Record<string, string> = {
  shenzhen: '深圳',
  hongkong: '香港',
  taipei: '台北',
};

export default function DaySelector({ days, selectedDay, onSelectDay }: DaySelectorProps) {
  return (
    <div className="-mx-4 -mb-2">
      <div className="overflow-x-auto scrollbar-hide" style={{ paddingBottom: '8px', marginBottom: '-8px' }}>
        <div className="flex gap-3 px-4 pt-2 pb-6">
          {days.map((day) => {
            const isSelected = selectedDay === day.id;
            const date = day.date ? parseISO(day.date) : null;

            return (
              <button
                key={day.id}
                onClick={() => onSelectDay(day.id)}
                className={`flex-shrink-0 px-4 py-3 rounded-2xl transition-all ${
                  isSelected
                    ? 'bg-gray-900 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <div className="text-center">
                  <p className={`text-xs font-medium ${isSelected ? 'text-gray-300' : 'text-gray-400'}`}>
                    Day {day.dayNumber}
                  </p>
                  <p className={`text-lg font-bold ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                    {date ? format(date, 'M/d', { locale: zhTW }) : '-'}
                  </p>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <span className={`w-2 h-2 rounded-full ${cityColors[day.city] || 'bg-gray-400'}`} />
                    <span className={`text-xs ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>
                      {cityNames[day.city] || day.city}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
          {/* 右側留白確保最後一個卡片陰影不被裁 */}
          <div className="flex-shrink-0 w-1" />
        </div>
      </div>
    </div>
  );
}
