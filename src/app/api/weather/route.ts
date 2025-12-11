import { NextResponse } from 'next/server';
import { getCurrentWeather, getWeatherByCoords, getWeatherByDate } from '@/lib/weather';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const date = searchParams.get('date'); // 新增 date 參數
    const lng = searchParams.get('lng');
    const lat = searchParams.get('lat');

    if (lng && lat) {
      const weather = await getWeatherByCoords(parseFloat(lng), parseFloat(lat));
      if (!weather) {
        return NextResponse.json(
          { error: 'Failed to fetch weather' },
          { status: 500 }
        );
      }
      return NextResponse.json({ ...weather, isForecast: false });
    } else if (city && date) {
      // 有指定日期：根據日期決定用即時或預報
      const result = await getWeatherByDate(city, date);
      if (!result) {
        return NextResponse.json(
          { error: 'Failed to fetch weather' },
          { status: 500 }
        );
      }
      return NextResponse.json({ ...result.weather, isForecast: result.isForecast });
    } else if (city) {
      // 沒有日期：用即時天氣
      const weather = await getCurrentWeather(city);
      if (!weather) {
        return NextResponse.json(
          { error: 'Failed to fetch weather' },
          { status: 500 }
        );
      }
      return NextResponse.json({ ...weather, isForecast: false });
    } else {
      return NextResponse.json(
        { error: 'City or coordinates required' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error fetching weather:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather' },
      { status: 500 }
    );
  }
}
