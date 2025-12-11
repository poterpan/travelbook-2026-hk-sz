'use client';

import { useState, useEffect } from 'react';
import { MapPin, RefreshCw, Loader2 } from 'lucide-react';
import Header from '@/components/layout/Header';
import RestaurantCard from '@/components/cards/RestaurantCard';
import type { Restaurant } from '@/types';
import { CITY_COORDS } from '@/types';

export default function FoodPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{ lng: number; lat: number } | null>(null);
  const [locationName, setLocationName] = useState<string>('定位中...');
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    detectLocation();
  }, []);

  const detectLocation = () => {
    setLoading(true);
    setError(null);
    setLocationError(null);

    // 檢查是否為安全環境 (HTTPS 或 localhost)
    const isSecureContext = window.isSecureContext;

    if (!isSecureContext) {
      // 非 HTTPS 環境，直接讓用戶選擇城市
      setLocationError('需要 HTTPS 才能定位，請選擇城市');
      setLocationName('請選擇城市');
      setLoading(false);
      return;
    }

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lng: longitude, lat: latitude });
          setLocationError(null);

          // 判斷位置名稱
          if (latitude > 24) {
            setLocationName('台灣');
          } else if (longitude > 114.15) {
            setLocationName('香港');
          } else {
            setLocationName('深圳');
          }

          fetchRestaurants(longitude, latitude);
        },
        (err) => {
          console.error('Geolocation error:', err);
          // 根據錯誤類型顯示不同訊息
          let errorMsg = '定位失敗，請選擇城市';
          if (err.code === 1) {
            errorMsg = '定位權限被拒絕，請選擇城市';
          } else if (err.code === 2) {
            errorMsg = '無法取得位置，請選擇城市';
          } else if (err.code === 3) {
            errorMsg = '定位逾時，請選擇城市';
          }
          setLocationError(errorMsg);
          setLocationName('請選擇城市');
          setLoading(false);
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000 // 5分鐘快取
        }
      );
    } else {
      // 不支持地理定位
      setLocationError('此瀏覽器不支援定位，請選擇城市');
      setLocationName('請選擇城市');
      setLoading(false);
    }
  };

  const fetchRestaurants = async (lng: number, lat: number) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/restaurants?lng=${lng}&lat=${lat}&radius=2000&limit=20`);
      if (res.ok) {
        const data = await res.json();
        setRestaurants(data);
      } else {
        setError('無法取得餐廳資料');
      }
    } catch (err) {
      console.error('Failed to fetch restaurants:', err);
      setError('無法取得餐廳資料');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    if (currentLocation) {
      fetchRestaurants(currentLocation.lng, currentLocation.lat);
    } else {
      detectLocation();
    }
  };

  const handleUseCity = (city: 'shenzhen' | 'hongkong') => {
    const coords = CITY_COORDS[city];
    setCurrentLocation(coords);
    setLocationName(coords.name);
    setLocationError(null); // 清除錯誤訊息
    fetchRestaurants(coords.lng, coords.lat);
  };

  return (
    <div className="min-h-screen">
      <Header title="美食推薦" subtitle="附近評價最高的餐廳" />

      <div className="px-4 py-4 space-y-4">
        {/* Location Bar */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">{locationName}</p>
                <p className="text-xs text-gray-500">搜尋範圍 2km 內</p>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 text-gray-500 animate-spin" />
              ) : (
                <RefreshCw className="w-5 h-5 text-gray-500" />
              )}
            </button>
          </div>

          {/* Location Error */}
          {locationError && (
            <p className="text-xs text-amber-600 mt-2 bg-amber-50 px-3 py-2 rounded-lg">
              ⚠️ {locationError}
            </p>
          )}

          {/* Quick City Buttons */}
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => handleUseCity('shenzhen')}
              className={`flex-1 py-2 px-3 text-sm rounded-xl transition-colors ${
                locationName.includes('深圳')
                  ? 'bg-emerald-500 text-white'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              📍 深圳
            </button>
            <button
              onClick={() => handleUseCity('hongkong')}
              className={`flex-1 py-2 px-3 text-sm rounded-xl transition-colors ${
                locationName.includes('香港')
                  ? 'bg-red-500 text-white'
                  : 'bg-red-50 text-red-700 hover:bg-red-100'
              }`}
            >
              📍 香港
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={handleRefresh}
              className="mt-2 text-sm text-red-500 underline"
            >
              重試
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && restaurants.length === 0 && (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-4 animate-pulse">
                <div className="h-20"></div>
              </div>
            ))}
          </div>
        )}

        {/* Restaurant List */}
        {!loading && restaurants.length === 0 && !error && (
          <div className="bg-white rounded-2xl p-6 text-center">
            <div className="text-4xl mb-4">🍽️</div>
            <p className="text-gray-500">附近沒有找到餐廳</p>
            <p className="text-sm text-gray-400 mt-1">試試切換到其他城市</p>
          </div>
        )}

        {restaurants.length > 0 && (
          <>
            <p className="text-sm text-gray-500">找到 {restaurants.length} 間餐廳</p>
            <div className="space-y-3">
              {restaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
