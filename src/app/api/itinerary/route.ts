import { NextResponse } from 'next/server';
import { getItineraries, createItinerary } from '@/lib/notion';

export const runtime = 'edge';

export async function GET() {
  try {
    const itineraries = await getItineraries();
    return NextResponse.json(itineraries);
  } catch (error) {
    console.error('Error fetching itineraries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch itineraries' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = await createItinerary(body);
    return NextResponse.json({ id });
  } catch (error) {
    console.error('Error creating itinerary:', error);
    return NextResponse.json(
      { error: 'Failed to create itinerary' },
      { status: 500 }
    );
  }
}
