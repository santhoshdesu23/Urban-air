import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { airQualityService } from '@/lib/air-quality/service';

const querySchema = z.object({
  q: z.string().min(2).max(100),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');

    const validation = querySchema.safeParse({ q });
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Search query must be between 2 and 100 characters.' },
        { status: 400 }
      );
    }

    const results = await airQualityService.searchLocations(validation.data.q);
    return NextResponse.json({ results });
  } catch (err) {
    console.error('API Location search error:', err);
    return NextResponse.json(
      { error: 'Failed to search locations. Please try again.' },
      { status: 500 }
    );
  }
}
