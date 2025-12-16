import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

interface AmapRegeoResponse {
  status: string;
  info: string;
  regeocode?: {
    formatted_address: string;
    addressComponent: {
      country: string;
      province: string;
      city: string;
      district: string;
      township: string;
      neighborhood: {
        name: string;
        type: string;
      };
      building: {
        name: string;
        type: string;
      };
      streetNumber: {
        street: string;
        number: string;
        direction: string;
        distance: string;
      };
    };
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lng = searchParams.get('lng');
  const lat = searchParams.get('lat');

  if (!lng || !lat) {
    return NextResponse.json(
      { error: 'Missing lng or lat parameter' },
      { status: 400 }
    );
  }

  const AMAP_WEB_KEY = process.env.AMAP_WEB_KEY;

  if (!AMAP_WEB_KEY) {
    return NextResponse.json(
      { error: 'AMAP API key not configured' },
      { status: 500 }
    );
  }

  try {
    // 高德逆地理編碼 API
    const url = `https://restapi.amap.com/v3/geocode/regeo?key=${AMAP_WEB_KEY}&location=${lng},${lat}&extensions=base`;

    const response = await fetch(url);
    const data: AmapRegeoResponse = await response.json();

    if (data.status !== '1' || !data.regeocode) {
      return NextResponse.json(
        { error: 'Geocoding failed', info: data.info },
        { status: 500 }
      );
    }

    const addr = data.regeocode.addressComponent;

    // 輔助函數：檢查值是否為有效字串（非空陣列、非空字串）
    const isValidString = (val: unknown): val is string => {
      return typeof val === 'string' && val.length > 0;
    };

    const getValidString = (val: unknown): string | null => {
      if (isValidString(val)) return val;
      return null;
    };

    // 組合一個簡短的位置名稱
    // 優先顯示：street > neighborhood > building > township > district
    let shortName = '';

    const street = addr.streetNumber?.street;
    const neighborhood = addr.neighborhood?.name;
    const building = addr.building?.name;
    const township = addr.township;
    const district = addr.district;
    const city = addr.city;
    const province = addr.province;

    if (getValidString(street)) {
      shortName = street as string;
    } else if (getValidString(neighborhood)) {
      shortName = neighborhood as string;
    } else if (getValidString(building)) {
      shortName = building as string;
    } else if (getValidString(township)) {
      shortName = township as string;
    } else if (getValidString(district)) {
      shortName = district as string;
    } else if (getValidString(city)) {
      shortName = city as string;
    } else if (getValidString(province)) {
      shortName = province as string;
    }

    return NextResponse.json({
      shortName,
      district: getValidString(district) || '',
      city: getValidString(city) || getValidString(province) || '',
      fullAddress: data.regeocode.formatted_address,
    });
  } catch (error) {
    console.error('Geocode API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch geocode data' },
      { status: 500 }
    );
  }
}
