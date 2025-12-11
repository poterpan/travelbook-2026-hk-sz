import { NextResponse } from 'next/server';
import { getExchangeRates } from '@/lib/exchange';

export const runtime = 'edge';

export async function GET() {
  try {
    const rates = await getExchangeRates();
    return NextResponse.json(rates);
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exchange rates' },
      { status: 500 }
    );
  }
}
