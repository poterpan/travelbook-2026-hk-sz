'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import type { ExchangeRate } from '@/types';
import ExchangeCalculator from './ExchangeCalculator';

export default function ExchangeRateBadge() {
  const [rates, setRates] = useState<ExchangeRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [displayCurrency, setDisplayCurrency] = useState<'HKD' | 'CNY'>('HKD');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    fetchRates();
    detectLocation();
  }, []);

  const fetchRates = async () => {
    try {
      const res = await fetch('/api/exchange');
      if (res.ok) {
        const data = await res.json();
        setRates(data);
      }
    } catch (error) {
      console.error('Failed to fetch rates:', error);
    } finally {
      setLoading(false);
    }
  };

  const detectLocation = () => {
    // 檢查是否為安全環境
    if (typeof window !== 'undefined' && !window.isSecureContext) {
      return; // 預設使用 HKD
    }

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude } = position.coords;
          // 深圳經度約 114.1，香港約 114.2
          if (longitude < 114.15) {
            setDisplayCurrency('CNY');
          } else {
            setDisplayCurrency('HKD');
          }
        },
        () => {
          // 定位失敗，預設港幣
        },
        {
          enableHighAccuracy: false,
          timeout: 5000,
          maximumAge: 300000
        }
      );
    }
  };

  const currentRate = rates.find((r) => r.currency === displayCurrency);
  const rateValue = currentRate?.cashSell?.toFixed(2) || '--';
  const currencySymbol = displayCurrency === 'HKD' ? 'HK$' : '¥';
  const currencyLabel = displayCurrency === 'HKD' ? '港幣' : '人民幣';

  const modalContent = showModal && mounted ? (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        style={{ zIndex: 9998 }}
        onClick={() => setShowModal(false)}
      />

      {/* Modal */}
      <div
        className="fixed inset-0 flex items-center justify-center p-4"
        style={{ zIndex: 9999 }}
      >
        <div
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl max-h-[80vh] overflow-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white px-4 py-3 border-b border-gray-100 flex items-center justify-between rounded-t-2xl">
            <h3 className="font-semibold text-gray-900">匯率換算</h3>
            <button
              onClick={() => setShowModal(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Calculator */}
          <div className="p-4">
            <ExchangeCalculator embedded />
          </div>
        </div>
      </div>
    </>
  ) : null;

  return (
    <>
      {/* Badge Button */}
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 rounded-full transition-colors"
      >
        {loading ? (
          <span className="text-xs text-amber-600">載入中...</span>
        ) : (
          <>
            <span className="text-xs text-amber-600">{currencyLabel}</span>
            <span className="text-sm font-semibold text-amber-700">
              {currencySymbol}1 = NT${rateValue}
            </span>
          </>
        )}
      </button>

      {/* Modal - 使用 Portal 確保渲染在 body 最上層 */}
      {mounted && createPortal(modalContent, document.body)}
    </>
  );
}
