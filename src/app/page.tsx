'use client';

import { useState, useEffect, useRef } from 'react';
import { parseISO, isToday, format } from 'date-fns';
import Header from '@/components/layout/Header';
import WeatherCard from '@/components/ui/WeatherCard';
import DaySelector from '@/components/ui/DaySelector';
import ActivityCard from '@/components/cards/ActivityCard';
import TransportCard from '@/components/cards/TransportCard';
import ExchangeRateBadge from '@/components/ui/ExchangeRateBadge';
import type { Itinerary, Activity } from '@/types';

const CITY_NAMES: Record<string, string> = {
  shenzhen: '深圳',
  hongkong: '香港',
  taipei: '台北',
};

// 測試模式：設定一個假的「現在時間」來測試
// 正式上線時設為 null
// 例如：'2026-01-29T14:30:00' 表示 Day 2 下午 2:30
const TEST_NOW: string | null = null; // '2026-01-29T14:30:00'
// const TEST_NOW: string | null = '2026-01-29T15:30:00'; // '2026-01-29T14:30:00'


function getCurrentTime(): Date {
  if (TEST_NOW) {
    return new Date(TEST_NOW);
  }
  return new Date();
}

// 解析時間字串 "14:30" 為當天的 Date
function parseTimeToDate(timeStr: string, dateStr: string): Date | null {
  if (!timeStr || !dateStr) return null;
  const match = timeStr.match(/^(\d{1,2}):(\d{2})/);
  if (!match) return null;
  const [, hours, minutes] = match;
  const date = parseISO(dateStr);
  date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  return date;
}

// 判斷活動是否為「當前進行中」
function isCurrentActivity(activity: Activity, dayDate: string, now: Date): boolean {
  if (!activity.startTime) return false;

  const activityStart = parseTimeToDate(activity.startTime, dayDate);
  if (!activityStart) return false;

  // 如果有結束時間，檢查是否在範圍內
  if (activity.endTime) {
    const activityEnd = parseTimeToDate(activity.endTime, dayDate);
    if (activityEnd) {
      return now >= activityStart && now <= activityEnd;
    }
  }

  // 沒有結束時間，檢查是否在開始時間後 2 小時內
  const twoHoursLater = new Date(activityStart.getTime() + 2 * 60 * 60 * 1000);
  return now >= activityStart && now <= twoHoursLater;
}

// 判斷活動是否為「下一個」
function isNextActivity(activity: Activity, dayDate: string, now: Date): boolean {
  if (!activity.startTime) return false;

  const activityStart = parseTimeToDate(activity.startTime, dayDate);
  if (!activityStart) return false;

  return activityStart > now;
}

export default function HomePage() {
  const [days, setDays] = useState<Itinerary[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState<Date>(getCurrentTime());
  const currentActivityRef = useRef<HTMLDivElement>(null);

  // 每分鐘更新當前時間
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(getCurrentTime());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedDay) {
      fetchActivities(selectedDay);
    }
  }, [selectedDay]);

  // 滾動到當前活動
  useEffect(() => {
    if (currentActivityRef.current) {
      setTimeout(() => {
        currentActivityRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }, [activities]);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/itinerary');
      if (res.ok) {
        const data = await res.json();
        setDays(data);
        if (data.length > 0) {
          // 自動選擇當天的行程
          const today = getCurrentTime();
          const todayStr = format(today, 'yyyy-MM-dd');
          const todayItinerary = data.find((d: Itinerary) => d.date === todayStr);

          if (todayItinerary) {
            setSelectedDay(todayItinerary.id);
          } else {
            // 如果不是旅行期間，選擇第一天
            setSelectedDay(data[0].id);
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch itinerary:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivities = async (dayId: string) => {
    try {
      const res = await fetch(`/api/activities?dayId=${dayId}`);
      if (res.ok) {
        const data = await res.json();
        setActivities(data);
      }
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    }
  };

  const currentDay = days.find((d) => d.id === selectedDay);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">載入中...</p>
        </div>
      </div>
    );
  }

  // 如果沒有從 Notion 取得資料，顯示設定提示
  if (days.length === 0) {
    return (
      <div className="min-h-screen">
        <Header
          title="深圳香港 5天4夜"
          subtitle="2026/1/28 - 2026/2/1"
          rightElement={<ExchangeRateBadge />}
        />
        <div className="px-4 py-8">
          <div className="bg-white rounded-2xl p-6 text-center">
            <div className="text-4xl mb-4">📝</div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">尚未設定行程</h2>
            <p className="text-gray-500 text-sm mb-4">
              請在 Notion 資料庫中新增行程資料，<br />
              或點擊下方按鈕快速建立範例資料
            </p>
            <button
              onClick={() => window.open('https://notion.so', '_blank')}
              className="px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
            >
              開啟 Notion
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header
        title="深圳香港 5天4夜"
        subtitle="2026/1/28 - 2026/2/1"
        rightElement={<ExchangeRateBadge />}
      />

      <div className="px-4 py-4 space-y-4">
        {/* Day Selector */}
        <DaySelector
          days={days}
          selectedDay={selectedDay}
          onSelectDay={setSelectedDay}
        />

        {/* Weather Card */}
        {currentDay && (
          <WeatherCard
            city={currentDay.city}
            cityName={CITY_NAMES[currentDay.city] || currentDay.city}
            date={currentDay.date}
          />
        )}

        {/* Day Title */}
        {currentDay && (
          <div className="pt-2">
            <h2 className="text-lg font-bold text-gray-900">{currentDay.name}</h2>
          </div>
        )}

        {/* Activities */}
        <div className="space-y-3">
          {activities.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 text-center">
              <p className="text-gray-500">暫無行程項目</p>
              <p className="text-sm text-gray-400 mt-1">請在 Notion 中新增活動</p>
            </div>
          ) : (
            (() => {
              const dayDate = currentDay?.date || '';
              let foundNext = false;

              return activities.map((activity) => {
                const isCurrent = isCurrentActivity(activity, dayDate, now);
                const isNext = !foundNext && !isCurrent && isNextActivity(activity, dayDate, now);

                if (isNext) foundNext = true;

                const statusLabel = isCurrent ? '進行中' : isNext ? '下一個' : null;

                return (
                  <div
                    key={activity.id}
                    ref={isCurrent ? currentActivityRef : null}
                    className={`relative ${statusLabel ? 'pt-4' : ''}`}
                  >
                    {statusLabel && (
                      <div className={`absolute top-1 left-4 z-10 px-2.5 py-0.5 text-xs font-medium rounded-full shadow-sm ${
                        isCurrent
                          ? 'bg-green-500 text-white'
                          : 'bg-amber-500 text-white'
                      }`}>
                        {statusLabel}
                      </div>
                    )}
                    <div className={isCurrent ? 'ring-2 ring-green-500 ring-offset-4 rounded-2xl' : ''}>
                      {activity.type === 'transport' ? (
                        <TransportCard activity={activity} />
                      ) : (
                        <ActivityCard activity={activity} />
                      )}
                    </div>
                  </div>
                );
              });
            })()
          )}
        </div>
      </div>
    </div>
  );
}
