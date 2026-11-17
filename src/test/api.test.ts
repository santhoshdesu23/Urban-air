import { describe, it, expect } from 'vitest';
import { GET as getAirQuality } from '@/app/api/air-quality/route';
import { GET as searchLocations } from '@/app/api/location/search/route';
import { POST as assistantRoute } from '@/app/api/assistant/route';
import { NextRequest } from 'next/server';

describe('API Route Handlers Validation & Security', () => {
  it('validates coordinates strictly on /api/air-quality', async () => {
    // Latitude > 90 should fail validation
    const req = new NextRequest('http://localhost:3000/api/air-quality?lat=999&lon=77');
    const res = await getAirQuality(req);

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain('Invalid coordinates');
  });

  it('validates search query length on /api/location/search', async () => {
    // Query less than 2 characters should be rejected
    const req = new NextRequest('http://localhost:3000/api/location/search?q=a');
    const res = await searchLocations(req);

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain('between 2 and 100');
  });

  it('validates assistant payload and returns structured fallback on /api/assistant', async () => {
    const req = new NextRequest('http://localhost:3000/api/assistant', {
      method: 'POST',
      body: JSON.stringify({
        message: 'Is it safe to run outside?',
        locationName: 'Delhi',
        currentAqi: 280,
        dominantPollutant: 'PM2.5',
      }),
    });

    const res = await assistantRoute(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.structuredResponse).toBeDefined();
    expect(body.structuredResponse.summary).toBeDefined();
    expect(body.isDeterministicFallback).toBe(true);
    expect(body.providerNotice).toContain('BreatheWise deterministic');
  });

  it('rejects empty message on /api/assistant', async () => {
    const req = new NextRequest('http://localhost:3000/api/assistant', {
      method: 'POST',
      body: JSON.stringify({
        message: '',
      }),
    });

    const res = await assistantRoute(req);
    expect(res.status).toBe(400);
  });
});
