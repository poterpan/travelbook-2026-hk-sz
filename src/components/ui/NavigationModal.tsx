'use client';

import { X, Map, Navigation } from 'lucide-react';
import { getNavigationLinks } from '@/lib/amap';

interface NavigationModalProps {
  isOpen: boolean;
  onClose: () => void;
  destination: {
    lng: number;
    lat: number;
    name: string;
  };
}

export default function NavigationModal({ isOpen, onClose, destination }: NavigationModalProps) {
  if (!isOpen) return null;

  const links = getNavigationLinks(destination.lng, destination.lat, destination.name);

  const handleNavigation = (url: string) => {
    window.open(url, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl p-6 pb-8 animate-slide-up">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">選擇導航方式</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-4">目的地：{destination.name}</p>

        <div className="space-y-3">
          {/* 高德地圖 */}
          <button
            onClick={() => handleNavigation(links.amap)}
            className="w-full flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <Navigation className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">高德地圖</p>
              <p className="text-sm text-gray-500">在中國大陸最準確</p>
            </div>
          </button>

          {/* Google Maps */}
          <button
            onClick={() => handleNavigation(links.google)}
            className="w-full flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <Map className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Google Maps</p>
              <p className="text-sm text-gray-500">國際通用，大陸需 VPN</p>
            </div>
          </button>

          {/* Apple Maps */}
          <button
            onClick={() => handleNavigation(links.apple)}
            className="w-full flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center">
              <Map className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Apple 地圖</p>
              <p className="text-sm text-gray-500">iPhone 原生地圖</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
