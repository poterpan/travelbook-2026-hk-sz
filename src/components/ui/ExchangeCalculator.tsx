'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, ArrowDownUp } from 'lucide-react';
import type { ExchangeRate } from '@/types';

interface ExchangeCalculatorProps {
  embedded?: boolean;
}

type Direction = 'toTWD' | 'fromTWD';

export default function ExchangeCalculator({ embedded = false }: ExchangeCalculatorProps) {
  const [rates, setRates] = useState<ExchangeRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState<string>('100');
  const [currency, setCurrency] = useState<'HKD' | 'CNY'>('HKD');
  const [direction, setDirection] = useState<Direction>('toTWD');
  const [detectedLocation, setDetectedLocation] = useState<string | null>(null);

  useEffect(() => {
    fetchRates();
    detectLocation();
  }, []);

  const detectLocation = () => {
    if (typeof window === 'undefined') return;

    // 檢查是否為安全環境 (HTTPS 或 localhost)
    if (!window.isSecureContext) {
      setDetectedLocation('unknown');
      return;
    }

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // 香港約 22.3, 114.2
          // 深圳約 22.5, 114.1
          // 台北約 25.0, 121.5
          if (latitude > 24) {
            // 台灣，保持預設 HKD
            setDetectedLocation('taiwan');
          } else if (longitude > 114.15) {
            // 香港
            setDetectedLocation('hongkong');
            setCurrency('HKD');
          } else {
            // 深圳
            setDetectedLocation('shenzhen');
            setCurrency('CNY');
          }
        },
        () => {
          setDetectedLocation('unknown');
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000,
        }
      );
    } else {
      setDetectedLocation('unknown');
    }
  };

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

  const hkdRate = rates.find((r) => r.currency === 'HKD');
  const cnyRate = rates.find((r) => r.currency === 'CNY');

  // 當地 → 台幣
  const calculateToTWD = (): string => {
    const numAmount = parseFloat(amount) || 0;
    if (numAmount === 0) return '0';

    const rate = rates.find((r) => r.currency === currency);
    if (!rate) return '0';

    const result = numAmount * rate.cashSell;
    return Math.round(result).toLocaleString();
  };

  // 台幣 → 當地（回傳兩種幣值）
  const calculateFromTWD = (): { hkd: string; cny: string } => {
    const numAmount = parseFloat(amount) || 0;
    if (numAmount === 0 || !hkdRate || !cnyRate) {
      return { hkd: '0', cny: '0' };
    }

    const hkdResult = numAmount / hkdRate.cashSell;
    const cnyResult = numAmount / cnyRate.cashSell;

    return {
      hkd: hkdResult.toFixed(1),
      cny: cnyResult.toFixed(1),
    };
  };

  const toggleDirection = () => {
    setDirection(direction === 'toTWD' ? 'fromTWD' : 'toTWD');
  };

  if (loading) {
    return (
      <div className={`animate-pulse ${embedded ? '' : 'bg-white rounded-2xl p-6 shadow-sm border border-gray-100'}`}>
        <div className="h-32"></div>
      </div>
    );
  }

  const fromTWDResults = calculateFromTWD();

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

      {/* 匯率顯示 */}
      <div className="grid grid-cols-2 gap-3 mb-4">
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
      <div className="bg-gray-50 rounded-xl p-4">
        {/* 方向切換 */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-gray-500">
            {direction === 'toTWD' ? '當地價格 → 台幣' : '台幣 → 當地幣值'}
          </p>
          <button
            onClick={toggleDirection}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowDownUp className="w-3.5 h-3.5" />
            <span>切換</span>
          </button>
        </div>

        {/* 輸入區 */}
        <div className="flex items-center gap-3">
          {direction === 'toTWD' ? (
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as 'HKD' | 'CNY')}
              className="w-24 shrink-0 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="HKD">HKD $</option>
              <option value="CNY">CNY ¥</option>
            </select>
          ) : (
            <div className="w-24 shrink-0 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-700">
              NT$
            </div>
          )}
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 min-w-0 bg-white border border-gray-200 rounded-lg px-4 py-2 text-right text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0"
          />
        </div>

        {/* 結果區 */}
        {direction === 'toTWD' ? (
          <div className="mt-3 text-right">
            <span className="text-sm text-gray-500">約等於 </span>
            <span className="text-xl font-bold text-green-600">NT$ {calculateToTWD()}</span>
          </div>
        ) : (
          <div className="mt-3 flex justify-end gap-4">
            <div className="text-right">
              <p className="text-xs text-gray-400">港幣</p>
              <p className="text-lg font-bold text-blue-600">HKD $ {fromTWDResults.hkd}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">人民幣</p>
              <p className="text-lg font-bold text-red-600">CNY ¥ {fromTWDResults.cny}</p>
            </div>
          </div>
        )}
      </div>

      {/* 位置提示 */}
      {detectedLocation && detectedLocation !== 'unknown' && detectedLocation !== 'taiwan' && (
        <p className="text-xs text-blue-500 mt-3 text-center">
          📍 偵測到您在{detectedLocation === 'hongkong' ? '香港' : '深圳'}，已自動選擇幣別
        </p>
      )}

      <p className="text-xs text-gray-400 mt-3 text-center">
        資料來源：台灣銀行牌告匯率
      </p>
    </div>
  );
}
