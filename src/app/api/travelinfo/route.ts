import { NextResponse } from 'next/server';
import { getTravelInfo, createTravelInfo } from '@/lib/notion';

export const runtime = 'edge';

export async function GET() {
  try {
    const info = await getTravelInfo();
    return NextResponse.json(info);
  } catch (error) {
    console.error('Error fetching travel info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch travel info' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = await createTravelInfo(body);
    return NextResponse.json({ id });
  } catch (error) {
    console.error('Error creating travel info:', error);
    return NextResponse.json(
      { error: 'Failed to create travel info' },
      { status: 500 }
    );
  }
}
