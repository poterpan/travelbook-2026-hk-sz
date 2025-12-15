import { NextResponse } from 'next/server';
import { getAttractions } from '@/lib/notion';

export const runtime = 'edge';

export async function GET() {
  try {
    const attractions = await getAttractions();
    return NextResponse.json(attractions);
  } catch (error) {
    console.error('Error fetching attractions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attractions' },
      { status: 500 }
    );
  }
}
