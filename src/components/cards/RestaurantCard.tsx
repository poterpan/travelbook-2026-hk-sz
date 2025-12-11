'use client';

import { useState } from 'react';
import { MapPin, Phone, Star, Navigation } from 'lucide-react';
import type { Restaurant } from '@/types';
import NavigationModal from '@/components/ui/NavigationModal';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const [showNavModal, setShowNavModal] = useState(false);

  return (
    <>
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start gap-3">
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {restaurant.rating && (
                <span className="flex items-center gap-1 text-xs bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full">
                  <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                  {restaurant.rating}
                </span>
              )}
              <span className="text-xs text-gray-400">
                {restaurant.distance}m
              </span>
            </div>
            <h3 className="font-semibold text-gray-900">{restaurant.name}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{restaurant.type}</p>
            {restaurant.address && (
              <p className="text-sm text-gray-500 flex items-start gap-1 mt-2">
                <MapPin className="w-3 h-3 flex-shrink-0 mt-0.5" />
                <span className="line-clamp-2">{restaurant.address}</span>
              </p>
            )}
            {restaurant.tel && (
              <a
                href={`tel:${restaurant.tel}`}
                className="text-sm text-blue-500 flex items-center gap-1 mt-1"
              >
                <Phone className="w-3 h-3" />
                {restaurant.tel}
              </a>
            )}
          </div>

          {/* Navigation Button */}
          <button
            onClick={() => setShowNavModal(true)}
            className="p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
          >
            <Navigation className="w-5 h-5 text-blue-500" />
          </button>
        </div>
      </div>

      {/* Navigation Modal */}
      <NavigationModal
        isOpen={showNavModal}
        onClose={() => setShowNavModal(false)}
        destination={{ name: restaurant.name }}
      />
    </>
  );
}
