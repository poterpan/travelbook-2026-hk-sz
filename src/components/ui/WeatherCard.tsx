'use client';

import { useEffect, useState } from 'react';
import { Droplets, Wind } from 'lucide-react';
import type { WeatherData } from '@/types';

interface WeatherApiResponse extends WeatherData {
  isForecast: boolean;
}

interface WeatherCardProps {
  city: string;
  cityName: string;
  date?: string; // 行程日期 YYYY-MM-DD
}

// 天氣圖標映射
function getWeatherIcon(icon: string): string {
  const iconMap: Record<string, string> = {
    '100': '☀️', // 晴
    '101': '⛅', // 多雲
    '102': '⛅', // 少雲
    '103': '⛅', // 晴間多雲
    '104': '☁️', // 陰
    '150': '🌙', // 晴（夜）
    '151': '🌙', // 多雲（夜）
    '300': '🌧️', // 陣雨
    '301': '🌧️', // 強陣雨
    '302': '⛈️', // 雷陣雨
    '303': '⛈️', // 強雷陣雨
    '304': '⛈️', // 雷陣雨伴有冰雹
    '305': '🌦️', // 小雨
    '306': '🌧️', // 中雨
    '307': '🌧️', // 大雨
    '308': '🌧️', // 極端降雨
    '309': '🌦️', // 毛毛雨
    '310': '🌧️', // 暴雨
    '311': '🌧️', // 大暴雨
    '312': '🌧️', // 特大暴雨
    '313': '🌧️', // 凍雨
    '314': '🌦️', // 小到中雨
    '315': '🌧️', // 中到大雨
    '316': '🌧️', // 大到暴雨
    '400': '🌨️', // 小雪
    '401': '🌨️', // 中雪
    '402': '🌨️', // 大雪
    '403': '🌨️', // 暴雪
    '404': '🌨️', // 雨夾雪
    '405': '🌨️', // 雨雪天氣
    '406': '🌨️', // 陣雨夾雪
    '407': '🌨️', // 陣雪
    '500': '🌫️', // 薄霧
    '501': '🌫️', // 霧
    '502': '🌫️', // 霾
    '503': '🌫️', // 揚沙
    '504': '🌫️', // 浮塵
    '507': '🌪️', // 沙塵暴
    '508': '🌪️', // 強沙塵暴
    '509': '🌫️', // 濃霧
    '510': '🌫️', // 強濃霧
    '511': '🌫️', // 中度霾
    '512': '🌫️', // 重度霾
    '513': '🌫️', // 嚴重霾
    '514': '🌫️', // 大霧
    '515': '🌫️', // 特強濃霧
  };
  return iconMap[icon] || '☁️';
}

export default function WeatherCard({ city, cityName, date }: WeatherCardProps) {
  const [weather, setWeather] = useState<WeatherApiResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWeather() {
      try {
        // 帶上日期參數
        const url = date
          ? `/api/weather?city=${city}&date=${date}`
          : `/api/weather?city=${city}`;

        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setWeather(data);
        }
      } catch (error) {
        console.error('Failed to fetch weather:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, [city, date]);

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-sky-400 to-blue-500 rounded-xl p-3 text-white animate-pulse">
        <div className="h-12"></div>
      </div>
    );
  }

  if (!weather) {
    return null;
  }

  // 判斷溫度顯示格式（預報是 "min~max"，即時是單一數值）
  const isTempRange = weather.temp.includes('~');

  return (
    <div className="bg-gradient-to-r from-sky-400 to-blue-500 rounded-xl p-3 text-white shadow-md">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{getWeatherIcon(weather.icon)}</span>
          <div>
            <p className="text-2xl font-light">
              {isTempRange ? weather.temp : `${weather.temp}`}°
            </p>
            <p className="text-xs opacity-90">{weather.text}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-medium">{cityName}</p>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">
              {weather.isForecast ? '預報' : '即時'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs opacity-80 mt-0.5">
            <span className="flex items-center gap-0.5">
              <Droplets className="w-3 h-3" />
              {weather.humidity}%
            </span>
            <span className="flex items-center gap-0.5">
              <Wind className="w-3 h-3" />
              {weather.windScale}級
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
