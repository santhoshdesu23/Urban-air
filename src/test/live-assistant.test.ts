import { describe, it, expect } from 'vitest';
import { POST as assistantRoute } from '@/app/api/assistant/route';
import { NextRequest } from 'next/server';

describe('Live Assistant API & Multi-Provider Integration Verification', () => {
  it('generates a live structured AI response using Gemini when keys are present', async () => {
    // If Gemini keys exist in local environment
    const hasGemini = Boolean(
      process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
      process.env.GOOGLE_GENERATIVE_AI_API_KEY_1 ||
      process.env.GOOGLE_GENERATIVE_AI_API_KEY_2
    );

    if (!hasGemini) {
      console.log('Skipping live call: No Gemini key present');
      return;
    }

    const req = new NextRequest('http://localhost:3000/api/assistant', {
      method: 'POST',
      body: JSON.stringify({
        message: 'Is it safe to go running outside today?',
        locationName: 'Delhi',
        currentAqi: 310,
        dominantPollutant: 'PM2.5',
        activeStandard: 'CPCB',
      }),
    });

    const res = await assistantRoute(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.structuredResponse).toBeDefined();
    expect(body.structuredResponse.summary).toBeDefined();
    expect(body.structuredResponse.recommendedActions.length).toBeGreaterThan(0);
    expect(body.structuredResponse.sources.length).toBeGreaterThan(0);
    expect(body.structuredResponse.safetyCaveats.length).toBeGreaterThan(0);

    // Should successfully generate live AI response
    expect(body.isDeterministicFallback).toBe(false);
    expect(body.provider).toBe('google');
    expect(body.providerNotice).toContain('Google Gemini');
  }, 15000);

  it('cascades from OpenAI to Google Gemini fallback when OpenAI keys fail', async () => {
    const hasGemini = Boolean(
      process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
      process.env.GOOGLE_GENERATIVE_AI_API_KEY_1 ||
      process.env.GOOGLE_GENERATIVE_AI_API_KEY_2
    );

    if (!hasGemini) {
      return;
    }

    // Force OpenAI as preferred provider
    const prevProvider = process.env.AI_PROVIDER;
    process.env.AI_PROVIDER = 'openai';

    const req = new NextRequest('http://localhost:3000/api/assistant', {
      method: 'POST',
      body: JSON.stringify({
        message: 'Should I open my windows right now?',
        locationName: 'Delhi',
        currentAqi: 240,
        dominantPollutant: 'PM2.5',
        activeStandard: 'CPCB',
      }),
    });

    const res = await assistantRoute(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.structuredResponse).toBeDefined();
    expect(body.structuredResponse.summary).toBeDefined();

    // Since OpenAI keys fail due to 0 credits, it must cascade to Google Gemini!
    expect(body.isDeterministicFallback).toBe(false);
    expect(body.provider).toBe('google');
    expect(body.providerNotice).toContain('after automatic fallback');

    process.env.AI_PROVIDER = prevProvider;
  }, 30000);

  it('cascades to deterministic engine when credentials are fully cleared', async () => {
    const backupEnv = { ...process.env };
    delete process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_API_KEY_1;
    delete process.env.OPENAI_API_KEY_2;
    delete process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    delete process.env.GOOGLE_GENERATIVE_AI_API_KEY_1;
    delete process.env.GOOGLE_GENERATIVE_AI_API_KEY_2;

    const req = new NextRequest('http://localhost:3000/api/assistant', {
      method: 'POST',
      body: JSON.stringify({
        message: 'What should my family do during severe smog?',
        locationName: 'Kolkata',
        currentAqi: 350,
        dominantPollutant: 'PM2.5',
        activeStandard: 'CPCB',
      }),
    });

    const res = await assistantRoute(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.isDeterministicFallback).toBe(true);
    expect(body.structuredResponse).toBeDefined();
    expect(body.providerNotice).toContain('BreatheWise deterministic');

    process.env = backupEnv;
  });
});
