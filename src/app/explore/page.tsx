'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { Navigation } from 'lucide-react';
import NavigationModal from '@/components/ui/NavigationModal';
import type { Attraction } from '@/types';

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState<'attractions' | 'food'>('attractions');
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNavModal, setShowNavModal] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<string>('');

  useEffect(() => {
    fetchAttractions();
  }, []);

  const fetchAttractions = async () => {
    try {
      const res = await fetch('/api/attractions');
      if (res.ok) {
        const data = await res.json();
        setAttractions(data);
      }
    } catch (error) {
      console.error('Failed to fetch attractions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (name: string) => {
    setSelectedDestination(name);
    setShowNavModal(true);
  };

  // 分類：景點/購物 vs 餐廳
  const attractionsList = attractions.filter((item) => item.type === 'attraction' || item.type === 'shopping');
  const restaurantsList = attractions.filter((item) => item.type === 'restaurant');

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header title="探索" subtitle="景點攻略與必吃美食" />
        <div className="px-4 py-8">
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header title="探索" subtitle="景點攻略與必吃美食" />

      <div className="px-4 py-4 space-y-4">
        {/* Tab Buttons */}
        <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('attractions')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'attractions'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            景點攻略
          </button>
          <button
            onClick={() => setActiveTab('food')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'food'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            必吃美食
          </button>
        </div>

        {/* Attractions Tab */}
        {activeTab === 'attractions' && (
          <div className="space-y-3">
            {attractionsList.length === 0 ? (
              <div className="bg-white rounded-2xl p-6 text-center">
                <p className="text-gray-500">尚無景點資料</p>
                <p className="text-sm text-gray-400 mt-1">請在 Notion 中新增景點</p>
              </div>
            ) : (
              attractionsList.map((attraction) => (
                <div
                  key={attraction.id}
                  className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          attraction.city === 'shenzhen'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-red-50 text-red-700'
                        }`}>
                          {attraction.city === 'shenzhen' ? '深圳' : '香港'}
                        </span>
                        <span className="text-xs text-gray-400">
                          {attraction.type === 'shopping' ? '購物' : '景點'}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900">{attraction.name}</h3>
                      {attraction.description && (
                        <p className="text-sm text-gray-500 mt-1">{attraction.description}</p>
                      )}
                      {attraction.tips && (
                        <p className="text-sm text-blue-600 mt-2">
                          <span className="font-medium">💡</span> {attraction.tips}
                        </p>
                      )}
                      {attraction.mustBuy.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {attraction.mustBuy.map((item, i) => (
                            <span
                              key={i}
                              className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full"
                            >
                              📦 {item}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleNavigate(attraction.name)}
                      className="p-2 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
                    >
                      <Navigation className="w-5 h-5 text-blue-500" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Must Eat Tab */}
        {activeTab === 'food' && (
          <div className="space-y-3">
            {restaurantsList.length === 0 ? (
              <div className="bg-white rounded-2xl p-6 text-center">
                <p className="text-gray-500">尚無美食資料</p>
                <p className="text-sm text-gray-400 mt-1">請在 Notion 中新增餐廳</p>
              </div>
            ) : (
              restaurantsList.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          item.city === 'shenzhen'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-red-50 text-red-700'
                        }`}>
                          {item.city === 'shenzhen' ? '深圳' : '香港'}
                        </span>
                        {item.description && (
                          <span className="text-xs text-gray-400">{item.description}</span>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      {item.tips && (
                        <p className="text-sm text-gray-500 mt-1">
                          <span className="font-medium">💡</span> {item.tips}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {item.highlight && (
                        <span className="text-xs px-3 py-1 bg-orange-100 text-orange-700 rounded-full font-medium">
                          {item.highlight}
                        </span>
                      )}
                      <button
                        onClick={() => handleNavigate(item.name)}
                        className="p-2 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
                      >
                        <Navigation className="w-5 h-5 text-blue-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

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
