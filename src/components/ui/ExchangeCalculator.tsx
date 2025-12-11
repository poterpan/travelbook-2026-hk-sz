'use client';

import { useState, useEffect } from 'react';
import { ArrowRightLeft, RefreshCw } from 'lucide-react';
import type { ExchangeRate } from '@/types';

interface ExchangeCalculatorProps {
  embedded?: boolean;
}

export default function ExchangeCalculator({ embedded = false }: ExchangeCalculatorProps) {
  const [rates, setRates] = useState<ExchangeRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState<string>('100');
  const [fromCurrency, setFromCurrency] = useState<'TWD' | 'HKD' | 'CNY'>('TWD');
  const [toCurrency, setToCurrency] = useState<'TWD' | 'HKD' | 'CNY'>('HKD');
  const [currentLocation, setCurrentLocation] = useState<string | null>(null);

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
    // 檢查是否為安全環境 (HTTPS 或 localhost)
    if (typeof window !== 'undefined' && !window.isSecureContext) {
      setCurrentLocation('unknown');
      return;
    }

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // 簡單判斷位置
          // 香港約 22.3, 114.2
          // 深圳約 22.5, 114.1
          // 台北約 25.0, 121.5
          if (latitude > 24) {
            setCurrentLocation('taiwan');
            setFromCurrency('TWD');
          } else if (longitude > 114.15) {
            setCurrentLocation('hongkong');
            setToCurrency('HKD');
          } else {
            setCurrentLocation('shenzhen');
            setToCurrency('CNY');
          }
        },
        () => {
          // 定位失敗，默認顯示港幣
          setCurrentLocation('unknown');
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    } else {
      setCurrentLocation('unknown');
    }
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const calculateResult = (): string => {
    const numAmount = parseFloat(amount) || 0;
    if (numAmount === 0) return '0.00';

    const hkdRate = rates.find((r) => r.currency === 'HKD');
    const cnyRate = rates.find((r) => r.currency === 'CNY');

    if (!hkdRate || !cnyRate) return '0.00';

    // 使用現金賣出匯率
    // 先轉換為台幣
    let twdAmount = numAmount;
    if (fromCurrency === 'HKD') {
      twdAmount = numAmount * hkdRate.cashSell;
    } else if (fromCurrency === 'CNY') {
      twdAmount = numAmount * cnyRate.cashSell;
    }

    // 再從台幣轉換為目標貨幣
    let result = twdAmount;
    if (toCurrency === 'HKD') {
      result = twdAmount / hkdRate.cashSell;
    } else if (toCurrency === 'CNY') {
      result = twdAmount / cnyRate.cashSell;
    }

    return result.toFixed(2);
  };

  const getCurrencySymbol = (currency: string) => {
    const symbols: Record<string, string> = {
      TWD: 'NT$',
      HKD: 'HK$',
      CNY: '¥',
    };
    return symbols[currency] || currency;
  };

  if (loading) {
    return (
      <div className={`animate-pulse ${embedded ? '' : 'bg-white rounded-2xl p-6 shadow-sm border border-gray-100'}`}>
        <div className="h-40"></div>
      </div>
    );
  }

  const hkdRate = rates.find((r) => r.currency === 'HKD');
  const cnyRate = rates.find((r) => r.currency === 'CNY');

  return (
    <div className={embedded ? '' : 'bg-white rounded-2xl p-6 shadow-sm border border-gray-100'}>
      {!embedded && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">即時匯率換算</h3>
          <button
            onClick={fetchRates}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <RefreshCw className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      )}

      {/* 匯率顯示 - 現金賣出 */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-blue-50 rounded-xl p-3">
          <p className="text-xs text-blue-600 mb-1">港幣 HKD</p>
          <p className="text-lg font-semibold text-blue-700">
            {hkdRate ? `${hkdRate.cashSell.toFixed(2)}` : '-'}
          </p>
          <p className="text-xs text-gray-500">NT$ / HK$1</p>
        </div>
        <div className="bg-red-50 rounded-xl p-3">
          <p className="text-xs text-red-600 mb-1">人民幣 CNY</p>
          <p className="text-lg font-semibold text-red-700">
            {cnyRate ? `${cnyRate.cashSell.toFixed(2)}` : '-'}
          </p>
          <p className="text-xs text-gray-500">NT$ / ¥1</p>
        </div>
      </div>

      {/* 換算器 */}
      <div className="space-y-4">
        {/* From */}
        <div className="flex items-center gap-3">
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value as 'TWD' | 'HKD' | 'CNY')}
            className="w-24 shrink-0 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="TWD">新台幣</option>
            <option value="HKD">港幣</option>
            <option value="CNY">人民幣</option>
          </select>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 min-w-0 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-right text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0"
          />
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <button
            onClick={swapCurrencies}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
          >
            <ArrowRightLeft className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* To */}
        <div className="flex items-center gap-3">
          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value as 'TWD' | 'HKD' | 'CNY')}
            className="w-24 shrink-0 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="TWD">新台幣</option>
            <option value="HKD">港幣</option>
            <option value="CNY">人民幣</option>
          </select>
          <div className="flex-1 min-w-0 bg-blue-50 border border-blue-200 rounded-xl px-4 py-2 text-right">
            <span className="text-lg font-semibold text-blue-700">
              {getCurrencySymbol(toCurrency)} {calculateResult()}
            </span>
          </div>
        </div>
      </div>

      {/* Location hint */}
      {currentLocation && currentLocation !== 'unknown' && (
        <p className="text-xs text-gray-400 mt-4 text-center">
          📍 已偵測您的位置，自動選擇適用匯率
        </p>
      )}

      <p className="text-xs text-gray-400 mt-2 text-center">
        資料來源：台灣銀行牌告匯率
      </p>
    </div>
  );
}
