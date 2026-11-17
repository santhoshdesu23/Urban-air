import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { airQualityService } from '@/lib/air-quality/service';

const airQualityQuerySchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lon: z.coerce.number().min(-180).max(180),
  name: z.string().min(1).max(100).default('Selected Location'),
  country: z.string().max(100).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rawParams = {
      lat: searchParams.get('lat'),
      lon: searchParams.get('lon'),
      name: searchParams.get('name') ?? 'Selected Location',
      country: searchParams.get('country') ?? undefined,
    };

    const parsed = airQualityQuerySchema.safeParse(rawParams);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid coordinates or parameters', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { lat, lon, name, country } = parsed.data;
    const data = await airQualityService.getAirQuality(lat, lon, name, country);

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=300',
      },
    });
  } catch (err: unknown) {
    console.error('Air quality API error:', err);
    const message =
      err instanceof Error
        ? err.message
        : 'Unable to retrieve air quality data. Please check connection and try again.';
    return NextResponse.json(
      {
        error: message,
      },
      { status: 502 }
    );
  }
}
