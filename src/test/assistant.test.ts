import { describe, it, expect } from 'vitest';
import { generateDeterministicResponse } from '@/lib/assistant/expert-engine';
import { AssistantChatRequest } from '@/types/assistant';

describe('Deterministic Environmental Intelligence Engine', () => {
  const baseReq: AssistantChatRequest = {
    message: 'Is it safe to go running today?',
    locationName: 'Delhi',
    currentAqi: 310,
    dominantPollutant: 'PM2.5',
    activeStandard: 'CPCB',
  };

  it('answers running inquiry with high pollution warnings and indoor alternatives', () => {
    const res = generateDeterministicResponse(baseReq);

    expect(res.summary.toLowerCase()).toContain('not recommended');
    expect(res.recommendedActions.length).toBeGreaterThan(0);
    expect(res.reasons.length).toBeGreaterThan(0);
    expect(res.sources.length).toBeGreaterThan(0);
    expect(res.safetyCaveats.length).toBeGreaterThan(0);
    expect(res.confidence).toBe('High');
  });

  it('answers window opening inquiry with diurnal inversion advice', () => {
    const res = generateDeterministicResponse({
      ...baseReq,
      message: 'Should I open my windows right now?',
      currentAqi: 240,
    });

    expect(res.summary.toLowerCase()).toContain('window');
    expect(
      res.recommendedActions.some(
        (a) =>
          a.toLowerCase().includes('shut') ||
          a.toLowerCase().includes('flush') ||
          a.toLowerCase().includes('midday')
      )
    ).toBe(true);
  });

  it('answers commute inquiry with mass transit and N95 masking advice', () => {
    const res = generateDeterministicResponse({
      ...baseReq,
      message: 'How should I commute to work today?',
    });

    expect(
      res.recommendedActions.some(
        (a) => a.toLowerCase().includes('metro') || a.toLowerCase().includes('recirculate')
      )
    ).toBe(true);
    expect(res.environmentalImpact).toContain('kg CO2e');
  });

  it('answers severe smog inquiries with family sanctuary guidelines', () => {
    const res = generateDeterministicResponse({
      ...baseReq,
      message: 'What should my family do during severe winter smog?',
    });

    expect(
      res.recommendedActions.some(
        (a) => a.toLowerCase().includes('sanctuary') || a.toLowerCase().includes('hepa')
      )
    ).toBe(true);
    expect(res.safetyCaveats[0]).toContain('medical');
  });

  it('explains PM2.5 physics accurately without fabricated statistics', () => {
    const res = generateDeterministicResponse({
      ...baseReq,
      message: 'What does PM2.5 mean?',
    });

    expect(res.summary).toContain('2.5 micrometers');
    expect(res.sources).toContain('World Health Organization (WHO) Air Quality Guidelines');
  });
});
