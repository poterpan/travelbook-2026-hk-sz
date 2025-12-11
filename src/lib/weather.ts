import type { WeatherData } from '@/types';

const QWEATHER_HOST = process.env.QWEATHER_HOST;
const QWEATHER_KEY = process.env.QWEATHER_KEY;

// 城市 ID 對照表（和風天氣使用 Location ID）
const CITY_IDS: Record<string, string> = {
  shenzhen: '101280601', // 深圳
  hongkong: '101320101', // 香港
  taipei: '101340101', // 台北（備用）
};

// 取得即時天氣
export async function getCurrentWeather(city: string): Promise<WeatherData | null> {
  try {
    const locationId = CITY_IDS[city] || CITY_IDS.hongkong;
    const url = `https://${QWEATHER_HOST}/v7/weather/now?location=${locationId}&key=${QWEATHER_KEY}`;

    const response = await fetch(url, {
      next: { revalidate: 1800 }, // 快取 30 分鐘
    });

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.code !== '200') {
      throw new Error(`Weather API error code: ${data.code}`);
    }

    return {
      temp: data.now.temp,
      text: data.now.text,
      icon: data.now.icon,
      humidity: data.now.humidity,
      windDir: data.now.windDir,
      windScale: data.now.windScale,
    };
  } catch (error) {
    console.error('Failed to fetch weather:', error);
    return null;
  }
}

// 取得天氣預報（未來 7 天）
export async function getWeatherForecast(city: string): Promise<Array<WeatherData & { date: string }>> {
  try {
    const locationId = CITY_IDS[city] || CITY_IDS.hongkong;
    const url = `https://${QWEATHER_HOST}/v7/weather/7d?location=${locationId}&key=${QWEATHER_KEY}`;

    const response = await fetch(url, {
      next: { revalidate: 3600 }, // 快取 1 小時
    });

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.code !== '200') {
      throw new Error(`Weather API error code: ${data.code}`);
    }

    return data.daily.map((day: {
      fxDate: string;
      tempMax: string;
      tempMin: string;
      textDay: string;
      iconDay: string;
      humidity: string;
      windDirDay: string;
      windScaleDay: string;
    }) => ({
      date: day.fxDate,
      temp: `${day.tempMin}~${day.tempMax}`,
      text: day.textDay,
      icon: day.iconDay,
      humidity: day.humidity,
      windDir: day.windDirDay,
      windScale: day.windScaleDay,
    }));
  } catch (error) {
    console.error('Failed to fetch weather forecast:', error);
    return [];
  }
}

// 根據日期取得天氣（當天用即時，非當天用預報，找不到預報則 fallback 即時）
export async function getWeatherByDate(city: string, date: string): Promise<{ weather: WeatherData; isForecast: boolean } | null> {
  const today = new Date().toISOString().split('T')[0];

  if (date === today) {
    // 當天：使用即時天氣
    const weather = await getCurrentWeather(city);
    return weather ? { weather, isForecast: false } : null;
  } else {
    // 非當天：先嘗試取得預報
    const forecast = await getWeatherForecast(city);
    const dayForecast = forecast.find(f => f.date === date);

    if (dayForecast) {
      return {
        weather: {
          temp: dayForecast.temp,
          text: dayForecast.text,
          icon: dayForecast.icon,
          humidity: dayForecast.humidity,
          windDir: dayForecast.windDir,
          windScale: dayForecast.windScale,
        },
        isForecast: true,
      };
    }

    // 如果找不到預報（超過 7 天），fallback 到即時天氣
    const weather = await getCurrentWeather(city);
    return weather ? { weather, isForecast: false } : null;
  }
}

// 根據座標取得天氣
export async function getWeatherByCoords(lng: number, lat: number): Promise<WeatherData | null> {
  try {
    const location = `${lng.toFixed(2)},${lat.toFixed(2)}`;
    const url = `https://${QWEATHER_HOST}/v7/weather/now?location=${location}&key=${QWEATHER_KEY}`;

    const response = await fetch(url, {
      next: { revalidate: 1800 },
    });

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.code !== '200') {
      throw new Error(`Weather API error code: ${data.code}`);
    }

    return {
      temp: data.now.temp,
      text: data.now.text,
      icon: data.now.icon,
      humidity: data.now.humidity,
      windDir: data.now.windDir,
      windScale: data.now.windScale,
    };
  } catch (error) {
    console.error('Failed to fetch weather by coords:', error);
    return null;
  }
}
