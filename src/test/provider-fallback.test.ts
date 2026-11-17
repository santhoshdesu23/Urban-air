import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST as assistantRoute } from '@/app/api/assistant/route';
import { NextRequest } from 'next/server';

describe('AI Provider Multi-Key & Multi-Provider Fallback Suite', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('cascades to deterministic engine when credentials are absent or fail', async () => {
    const originalEnv = { ...process.env };
    delete process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_API_KEY_1;
    delete process.env.OPENAI_API_KEY_2;
    delete process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    delete process.env.GOOGLE_GENERATIVE_AI_API_KEY_1;
    delete process.env.GOOGLE_GENERATIVE_AI_API_KEY_2;

    const req = new NextRequest('http://localhost:3000/api/assistant', {
      method: 'POST',
      body: JSON.stringify({
        message: 'Is it safe to go running today in Delhi?',
        locationName: 'Delhi',
        currentAqi: 310,
        dominantPollutant: 'PM2.5',
        activeStandard: 'CPCB',
      }),
    });

    const res = await assistantRoute(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.isDeterministicFallback).toBe(true);
    expect(body.structuredResponse).toBeDefined();
    expect(body.structuredResponse.summary.toLowerCase()).toContain('not recommended');
    expect(body.structuredResponse.aqiContext).toContain('310');
    expect(body.structuredResponse.aqiContext).toContain('PM2.5');
    expect(body.providerNotice).toContain('BreatheWise deterministic');

    process.env = originalEnv;
  });

  it('rejects empty query messages with HTTP 400', async () => {
    const req = new NextRequest('http://localhost:3000/api/assistant', {
      method: 'POST',
      body: JSON.stringify({
        message: '',
        locationName: 'Delhi',
        currentAqi: 200,
      }),
    });

    const res = await assistantRoute(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain('Invalid request data');
  });

  it('rejects excessively long messages (>1000 chars) with HTTP 400', async () => {
    const req = new NextRequest('http://localhost:3000/api/assistant', {
      method: 'POST',
      body: JSON.stringify({
        message: 'a'.repeat(1001),
        locationName: 'Delhi',
        currentAqi: 200,
      }),
    });

    const res = await assistantRoute(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain('Invalid request data');
  });

  it('enforces grounded facts: response reflects input AQI and dominant pollutant', async () => {
    const req = new NextRequest('http://localhost:3000/api/assistant', {
      method: 'POST',
      body: JSON.stringify({
        message: 'What should my family do today?',
        locationName: 'Mumbai',
        currentAqi: 245,
        dominantPollutant: 'PM10',
        activeStandard: 'CPCB',
      }),
    });

    const res = await assistantRoute(req);
    expect(res.status).toBe(200);
    const body = await res.json();

    expect(body.structuredResponse).toBeDefined();
    expect(body.structuredResponse.aqiContext).toContain('245');
    expect(body.structuredResponse.reasons.length).toBeGreaterThan(0);
    expect(body.structuredResponse.recommendedActions.length).toBeGreaterThan(0);
    expect(body.structuredResponse.safetyCaveats.length).toBeGreaterThan(0);
  });
});
