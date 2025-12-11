'use client';

import { useState } from 'react';
import {
  MapPin,
  Navigation,
  Clock,
  Train,
  Utensils,
  Camera,
  ShoppingBag,
  Hotel,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { Activity } from '@/types';
import NavigationModal from '@/components/ui/NavigationModal';

interface ActivityCardProps {
  activity: Activity;
}

const typeConfig: Record<string, { icon: React.ElementType; color: string; bg: string; label: string }> = {
  attraction: { icon: Camera, color: 'text-orange-600', bg: 'bg-orange-50', label: '景點' },
  transport: { icon: Train, color: 'text-blue-600', bg: 'bg-blue-50', label: '交通' },
  food: { icon: Utensils, color: 'text-red-600', bg: 'bg-red-50', label: '餐飲' },
  hotel: { icon: Hotel, color: 'text-purple-600', bg: 'bg-purple-50', label: '住宿' },
  shopping: { icon: ShoppingBag, color: 'text-pink-600', bg: 'bg-pink-50', label: '購物' },
};

export default function ActivityCard({ activity }: ActivityCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showNavModal, setShowNavModal] = useState(false);

  const config = typeConfig[activity.type] || typeConfig.attraction;
  const Icon = config.icon;

  // 解析座標
  const coords = activity.coordinates?.split(',');
  const hasCoords = coords && coords.length === 2;
  const lng = hasCoords ? parseFloat(coords[0]) : 0;
  const lat = hasCoords ? parseFloat(coords[1]) : 0;

  return (
    <>
      <div className={`${config.bg} rounded-2xl p-4 border border-gray-100`}>
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-xl bg-white shadow-sm`}>
            <Icon className={`w-5 h-5 ${config.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs px-2 py-0.5 rounded-full ${config.bg} ${config.color} font-medium`}>
                {config.label}
              </span>
              {activity.time && (
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {activity.time}
                </span>
              )}
            </div>
            <h3 className="font-semibold text-gray-900 truncate">{activity.name}</h3>
            {activity.location && (
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{activity.location}</span>
              </p>
            )}
          </div>
          {hasCoords && (
            <button
              onClick={() => setShowNavModal(true)}
              className="p-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <Navigation className="w-5 h-5 text-blue-500" />
            </button>
          )}
        </div>

        {/* Tags */}
        {(activity.mustEat.length > 0 || activity.mustBuy.length > 0) && (
          <div className="flex flex-wrap gap-2 mt-3">
            {activity.mustEat.map((item, i) => (
              <span
                key={`eat-${i}`}
                className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full font-medium"
              >
                🍴 {item}
              </span>
            ))}
            {activity.mustBuy.map((item, i) => (
              <span
                key={`buy-${i}`}
                className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full font-medium"
              >
                📦 {item}
              </span>
            ))}
          </div>
        )}

        {/* Price */}
        {activity.price && (
          <p className="text-sm text-gray-600 mt-2">
            <span className="font-medium">費用：</span> {activity.price}
          </p>
        )}

        {/* Expandable Content */}
        {(activity.description || activity.tips) && (
          <>
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-sm text-gray-500 mt-3 hover:text-gray-700"
            >
              {expanded ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  收起詳情
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  查看詳情
                </>
              )}
            </button>

            {expanded && (
              <div className="mt-3 pt-3 border-t border-gray-200/50 space-y-2">
                {activity.description && (
                  <p className="text-sm text-gray-600">{activity.description}</p>
                )}
                {activity.tips && (
                  <div className="bg-white/50 rounded-xl p-3">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">💡 小技巧：</span> {activity.tips}
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Navigation Modal */}
      <NavigationModal
        isOpen={showNavModal}
        onClose={() => setShowNavModal(false)}
        destination={{ lng, lat, name: activity.name }}
      />
    </>
  );
}
