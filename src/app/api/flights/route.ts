import { NextResponse } from 'next/server';
import { getFlights } from '@/lib/notion';

export const runtime = 'edge';

export async function GET() {
  try {
    const flights = await getFlights();
    return NextResponse.json(flights);
  } catch (error) {
    console.error('Error fetching flights:', error);
    return NextResponse.json(
      { error: 'Failed to fetch flights' },
      { status: 500 }
    );
  }
}
