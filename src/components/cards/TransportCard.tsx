'use client';

import { useState } from 'react';
import {
  Train,
  Bus,
  Plane,
  Navigation,
  Clock,
  DollarSign,
  ArrowRight,
} from 'lucide-react';
import type { Activity } from '@/types';
import NavigationModal from '@/components/ui/NavigationModal';

interface TransportCardProps {
  activity: Activity;
}

export default function TransportCard({ activity }: TransportCardProps) {
  const [showNavModal, setShowNavModal] = useState(false);

  // 判斷交通類型圖標
  const getTransportIcon = (name: string) => {
    if (name.includes('高鐵') || name.includes('地鐵') || name.includes('港鐵')) {
      return Train;
    }
    if (name.includes('巴士') || name.includes('機場快線')) {
      return Bus;
    }
    if (name.includes('飛機') || name.includes('航班')) {
      return Plane;
    }
    return Train;
  };

  const Icon = getTransportIcon(activity.name);

  // 解析座標
  const coords = activity.coordinates?.split(',');
  const hasCoords = coords && coords.length === 2;
  const lng = hasCoords ? parseFloat(coords[0]) : 0;
  const lat = hasCoords ? parseFloat(coords[1]) : 0;

  return (
    <>
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100">
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div className="p-3 bg-blue-500 rounded-xl shadow-sm">
            <Icon className="w-5 h-5 text-white" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-xs text-blue-600 mb-1">
              <Clock className="w-3 h-3" />
              <span>{activity.time}</span>
            </div>
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              {activity.name}
            </h3>
            {activity.description && (
              <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                <ArrowRight className="w-3 h-3" />
                {activity.description}
              </p>
            )}
          </div>

          {/* Navigation Button */}
          {hasCoords && (
            <button
              onClick={() => setShowNavModal(true)}
              className="p-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <Navigation className="w-5 h-5 text-blue-500" />
            </button>
          )}
        </div>

        {/* Price */}
        {activity.price && (
          <div className="flex items-center gap-1 mt-3 text-sm text-gray-600">
            <DollarSign className="w-4 h-4 text-green-500" />
            <span>{activity.price}</span>
          </div>
        )}

        {/* Tips */}
        {activity.tips && (
          <div className="mt-3 bg-white/60 rounded-xl p-3">
            <p className="text-sm text-gray-600">
              <span className="font-medium">💡</span> {activity.tips}
            </p>
          </div>
        )}
      </div>

      {/* Navigation Modal */}
      <NavigationModal
        isOpen={showNavModal}
        onClose={() => setShowNavModal(false)}
        destination={{ name: activity.location || activity.name }}
      />
    </>
  );
}
