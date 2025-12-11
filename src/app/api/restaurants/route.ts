import { NextResponse } from 'next/server';
import { searchNearbyRestaurants, searchPlace } from '@/lib/amap';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lng = searchParams.get('lng');
    const lat = searchParams.get('lat');
    const keyword = searchParams.get('keyword');
    const city = searchParams.get('city') || '';
    const radius = parseInt(searchParams.get('radius') || '1000');
    const limit = parseInt(searchParams.get('limit') || '20');

    let restaurants;

    if (keyword) {
      restaurants = await searchPlace(keyword, city);
    } else if (lng && lat) {
      restaurants = await searchNearbyRestaurants(
        parseFloat(lng),
        parseFloat(lat),
        radius,
        limit
      );
    } else {
      return NextResponse.json(
        { error: 'Coordinates or keyword required' },
        { status: 400 }
      );
    }

    return NextResponse.json(restaurants);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch restaurants' },
      { status: 500 }
    );
  }
}
