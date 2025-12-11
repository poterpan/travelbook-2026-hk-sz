'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import { MapPin } from 'lucide-react';

// 預設景點攻略資料
const attractions = [
  {
    id: 1,
    name: 'SEG電子市場（賽格廣場）',
    city: '深圳',
    category: '購物',
    description: '亞洲最大的電子市場，9層樓，手機配件、電腦零件、數碼產品應有盡有',
    tips: '記得殺價！開價通常可以打6-7折',
    mustBuy: ['手機配件', '耐機設備', '科技小物'],
    coordinates: '114.0847,22.5474',
  },
  {
    id: 2,
    name: '華僑城創意園 OCT-LOFT',
    city: '深圳',
    category: '景點',
    description: '文青拍照聖地，類似台北華山文創園區，有各種藝術展覽和特色咖啡廳',
    tips: '適合下午去，可以待到傍晚拍照',
    mustBuy: [],
    coordinates: '113.9847,22.5411',
  },
  {
    id: 3,
    name: '深圳灣公園',
    city: '深圳',
    category: '景點',
    description: '海濱長廊，可遠眺香港，看夕陽絕佳地點',
    tips: '傍晚5-6點去最美，記得帶水',
    mustBuy: [],
    coordinates: '113.9543,22.5194',
  },
  {
    id: 4,
    name: '太平山頂',
    city: '香港',
    category: '景點',
    description: '香港最著名的觀景台，可以俯瞰整個維多利亞港和香港島',
    tips: '建議傍晚上去看夜景，山頂纜車來回HK$88',
    mustBuy: [],
    coordinates: '114.1456,22.2759',
  },
  {
    id: 5,
    name: '女人街（登打士街）',
    city: '香港',
    category: '購物',
    description: '香港最著名的街頭市集，服飾、小物、紀念品應有盡有',
    tips: '可以講價，但不像深圳那麼大的議價空間',
    mustBuy: ['紀念品', '服飾', '小飾品'],
    coordinates: '114.1694,22.3193',
  },
  {
    id: 6,
    name: '維多利亞港',
    city: '香港',
    category: '景點',
    description: '香港最著名的海港，每晚8點有幻彩詠香江燈光秀',
    tips: '天星小輪只要HK$3.4，很值得體驗',
    mustBuy: [],
    coordinates: '114.1722,22.2934',
  },
];

const mustEatList = [
  { name: '九記牛腩', city: '香港', type: '粿海南', highlight: '米其林推薦' },
  { name: '蘭芳園', city: '香港', type: '茶餐廳', highlight: '絲襪奶茶創始店' },
  { name: '澳洲牛奶公司', city: '香港', type: '茶餐廳', highlight: '炒蛋多士必吃' },
  { name: '鏞記酒家', city: '香港', type: '燒鵝', highlight: '米其林星級' },
  { name: '八合里牛肉火鍋', city: '深圳', type: '潮汕火鍋', highlight: '新鮮牛肉' },
  { name: '潤園四季', city: '深圳', type: '椰子雞', highlight: '深圳特色' },
  { name: '點都德', city: '深圳', type: '早茶', highlight: '廣東點心' },
  { name: '添好運', city: '香港', type: '點心', highlight: '米其林點心' },
];

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState<'attractions' | 'food'>('attractions');

  return (
    <div className="min-h-screen">
      <Header title="探索" subtitle="景點攻略與實用工具" />

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
            {attractions.map((attraction) => (
              <div
                key={attraction.id}
                className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        attraction.city === '深圳'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-red-50 text-red-700'
                      }`}>
                        {attraction.city}
                      </span>
                      <span className="text-xs text-gray-400">{attraction.category}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900">{attraction.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{attraction.description}</p>
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
                  {attraction.coordinates && (
                    <a
                      href={`https://uri.amap.com/marker?position=${attraction.coordinates}&name=${encodeURIComponent(attraction.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
                    >
                      <MapPin className="w-5 h-5 text-blue-500" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Must Eat Tab */}
        {activeTab === 'food' && (
          <div className="space-y-3">
            {mustEatList.map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        item.city === '深圳'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-red-50 text-red-700'
                      }`}>
                        {item.city}
                      </span>
                      <span className="text-xs text-gray-400">{item.type}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  </div>
                  <span className="text-xs px-3 py-1 bg-orange-100 text-orange-700 rounded-full font-medium">
                    {item.highlight}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
