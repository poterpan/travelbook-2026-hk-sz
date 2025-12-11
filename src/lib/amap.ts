import type { Restaurant } from '@/types';

const AMAP_WEB_KEY = process.env.AMAP_WEB_KEY;

// POI 類型代碼
const POI_TYPES = {
  restaurant: '050000', // 餐飲
  food: '050100', // 中餐廳
  fastfood: '050300', // 快餐
  cafe: '050500', // 咖啡廳
};

// 搜索附近餐廳
export async function searchNearbyRestaurants(
  lng: number,
  lat: number,
  radius: number = 1000,
  limit: number = 20
): Promise<Restaurant[]> {
  try {
    const location = `${lng},${lat}`;
    const url = `https://restapi.amap.com/v3/place/around?key=${AMAP_WEB_KEY}&location=${location}&radius=${radius}&types=${POI_TYPES.restaurant}&offset=${limit}&extensions=all&sortrule=weight`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`AMap API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== '1') {
      throw new Error(`AMap API error: ${data.info}`);
    }

    return data.pois.map((poi: {
      id: string;
      name: string;
      type: string;
      address: string;
      tel: string;
      distance: string;
      biz_ext?: { rating?: string };
      location: string;
    }) => {
      const [lngStr, latStr] = poi.location.split(',');
      return {
        id: poi.id,
        name: poi.name,
        type: poi.type,
        address: poi.address || '',
        tel: poi.tel || '',
        distance: poi.distance,
        rating: poi.biz_ext?.rating || '',
        location: {
          lng: parseFloat(lngStr),
          lat: parseFloat(latStr),
        },
      };
    });
  } catch (error) {
    console.error('Failed to search restaurants:', error);
    return [];
  }
}

// 搜索地點
export async function searchPlace(keyword: string, city: string = ''): Promise<Restaurant[]> {
  try {
    const url = `https://restapi.amap.com/v3/place/text?key=${AMAP_WEB_KEY}&keywords=${encodeURIComponent(keyword)}&city=${encodeURIComponent(city)}&offset=10&extensions=all`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`AMap API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== '1') {
      throw new Error(`AMap API error: ${data.info}`);
    }

    return data.pois.map((poi: {
      id: string;
      name: string;
      type: string;
      address: string;
      tel: string;
      biz_ext?: { rating?: string };
      location: string;
    }) => {
      const [lngStr, latStr] = poi.location.split(',');
      return {
        id: poi.id,
        name: poi.name,
        type: poi.type,
        address: poi.address || '',
        tel: poi.tel || '',
        distance: '0',
        rating: poi.biz_ext?.rating || '',
        location: {
          lng: parseFloat(lngStr),
          lat: parseFloat(latStr),
        },
      };
    });
  } catch (error) {
    console.error('Failed to search place:', error);
    return [];
  }
}

// 取得導航連結
export function getNavigationLinks(
  destLng: number,
  destLat: number,
  destName: string
): { amap: string; google: string; apple: string } {
  const encodedName = encodeURIComponent(destName);

  return {
    // 高德地圖
    amap: `https://uri.amap.com/navigation?to=${destLng},${destLat},${encodedName}&mode=bus&coordinate=gaode`,
    // Google Maps
    google: `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}&travelmode=transit`,
    // Apple Maps
    apple: `https://maps.apple.com/?daddr=${destLat},${destLng}&dirflg=r`,
  };
}

// 取得地點標記連結
export function getMapLink(lng: number, lat: number, name: string): string {
  const encodedName = encodeURIComponent(name);
  return `https://uri.amap.com/marker?position=${lng},${lat}&name=${encodedName}`;
}
