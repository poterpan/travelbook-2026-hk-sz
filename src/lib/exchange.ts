import type { ExchangeRate } from '@/types';

const BOT_RATE_URL = 'https://rate.bot.com.tw/xrt/flcsv/0/day';

// 解析台灣銀行匯率 CSV
// CSV 格式：幣別,匯率,現金,即期,遠期...,匯率,現金,即期,遠期...
// 例如：HKD,本行買入,3.86100,3.98200,...,本行賣出,4.06500,4.05200,...
// Index 0: 幣別
// Index 1: 本行買入（文字）
// Index 2: 現金買入
// Index 3: 即期買入
// Index 11: 本行賣出（文字）
// Index 12: 現金賣出
// Index 13: 即期賣出
function parseCSV(csv: string): ExchangeRate[] {
  const lines = csv.trim().split('\n');
  const rates: ExchangeRate[] = [];

  // 跳過標題行
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const parts = line.split(',');
    if (parts.length >= 14) {
      const currency = parts[0].trim();
      // 只保留我們需要的幣別
      if (currency === 'HKD' || currency === 'CNY') {
        rates.push({
          currency: currency as 'HKD' | 'CNY',
          cashBuy: parseFloat(parts[2]) || 0,   // 現金買入
          cashSell: parseFloat(parts[12]) || 0, // 現金賣出
          spotBuy: parseFloat(parts[3]) || 0,   // 即期買入
          spotSell: parseFloat(parts[13]) || 0, // 即期賣出
          updateTime: new Date().toISOString(),
        });
      }
    }
  }

  return rates;
}

// 取得台灣銀行匯率
export async function getExchangeRates(): Promise<ExchangeRate[]> {
  try {
    const response = await fetch(BOT_RATE_URL, {
      next: { revalidate: 3600 }, // 快取 1 小時
    });

    if (!response.ok) {
      throw new Error(`Exchange rate API error: ${response.status}`);
    }

    const csv = await response.text();
    return parseCSV(csv);
  } catch (error) {
    console.error('Failed to fetch exchange rates:', error);
    // 返回備用匯率
    return [
      {
        currency: 'HKD',
        cashBuy: 3.9,
        cashSell: 4.1,
        spotBuy: 3.95,
        spotSell: 4.05,
        updateTime: new Date().toISOString(),
      },
      {
        currency: 'CNY',
        cashBuy: 4.3,
        cashSell: 4.5,
        spotBuy: 4.35,
        spotSell: 4.45,
        updateTime: new Date().toISOString(),
      },
    ];
  }
}

// 換算匯率
export function convertCurrency(
  amount: number,
  fromCurrency: 'TWD' | 'HKD' | 'CNY',
  toCurrency: 'TWD' | 'HKD' | 'CNY',
  rates: ExchangeRate[]
): number {
  if (fromCurrency === toCurrency) return amount;

  const hkdRate = rates.find((r) => r.currency === 'HKD');
  const cnyRate = rates.find((r) => r.currency === 'CNY');

  // 先轉換為台幣
  let twdAmount = amount;
  if (fromCurrency === 'HKD' && hkdRate) {
    twdAmount = amount * hkdRate.spotBuy;
  } else if (fromCurrency === 'CNY' && cnyRate) {
    twdAmount = amount * cnyRate.spotBuy;
  }

  // 再從台幣轉換為目標貨幣
  if (toCurrency === 'TWD') {
    return twdAmount;
  } else if (toCurrency === 'HKD' && hkdRate) {
    return twdAmount / hkdRate.spotSell;
  } else if (toCurrency === 'CNY' && cnyRate) {
    return twdAmount / cnyRate.spotSell;
  }

  return amount;
}
