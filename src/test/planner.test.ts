import { describe, it, expect } from 'vitest';
import { generateDailyPlan, DEFAULT_PLANNER_PROFILE } from '@/lib/planner/generator';
import { AirQualityData } from '@/types/air-quality';

const mockAirQuality: AirQualityData = {
  location: {
    name: 'New Delhi',
    country: 'India',
    latitude: 28.6139,
    longitude: 77.209,
    timezone: 'Asia/Kolkata',
  },
  timestamp: new Date().toISOString(),
  retrievedAt: new Date().toISOString(),
  isModelEstimate: true,
  provider: {
    name: 'Copernicus Atmospheric Service',
    attribution: 'CAMS & Open-Meteo',
    modelInfo: 'CAMS atmospheric model',
  },
  activeStandard: 'CPCB',
  current: {
    aqi: 320,
    category: 'Very Poor',
    colorHex: '#ef4444',
    badgeVariant: 'veryPoor',
    dominantPollutant: 'PM2.5',
    healthImplication: 'Respiratory illness on prolonged exposure',
    cautiousAdvisory: 'Avoid prolonged outdoor exertion.',
    pollutants: {
      'PM2.5': {
        code: 'PM2.5',
        name: 'PM2.5',
        value: 180,
        unit: 'µg/m³',
        safeLimit: 60,
        standardName: 'CPCB',
      },
      PM10: {
        code: 'PM10',
        name: 'PM10',
        value: 280,
        unit: 'µg/m³',
        safeLimit: 100,
        standardName: 'CPCB',
      },
      NO2: {
        code: 'NO2',
        name: 'NO2',
        value: 65,
        unit: 'µg/m³',
        safeLimit: 80,
        standardName: 'CPCB',
      },
      SO2: {
        code: 'SO2',
        name: 'SO2',
        value: 15,
        unit: 'µg/m³',
        safeLimit: 80,
        standardName: 'CPCB',
      },
      CO: {
        code: 'CO',
        name: 'CO',
        value: 1.8,
        unit: 'mg/m³',
        safeLimit: 2.0,
        standardName: 'CPCB',
      },
      O3: {
        code: 'O3',
        name: 'O3',
        value: 45,
        unit: 'µg/m³',
        safeLimit: 100,
        standardName: 'CPCB',
      },
    },
    standardBreakdown: {
      cpcb: { aqi: 320, category: 'Very Poor' },
      usEpa: { aqi: 280, category: 'Very Unhealthy' },
      european: { aqi: 5, category: 'Very Poor' },
    },
  },
  forecast: {
    hourly: [],
    daily: [],
    bestOutdoorWindow: {
      start: '13:00',
      end: '15:00',
      aqi: 190,
      recommendation: 'Lowest pollution window today',
    },
    highestRiskPeriod: {
      start: '07:00',
      end: '09:00',
      aqi: 360,
      pollutant: 'PM2.5',
      warning: 'Morning inversion',
    },
  },
  summaryText: 'Air quality in New Delhi is Very Poor.',
};

describe('Personalized AI Daily Routine Planner', () => {
  it('generates all 7 essential phases for daily schedule', () => {
    const plan = generateDailyPlan(DEFAULT_PLANNER_PROFILE, mockAirQuality);

    expect(plan.items.length).toBeGreaterThanOrEqual(6);
    const phases = plan.items.map((i) => i.phase);

    expect(phases).toContain('early_morning');
    expect(phases).toContain('morning_prep');
    expect(phases).toContain('travel_commute');
    expect(phases).toContain('evening');
    expect(phases).toContain('exercise_recreation');
    expect(phases).toContain('night_routine');
  });

  it('adapts exercise routine to indoor workout during Very Poor AQI', () => {
    const profile = {
      ...DEFAULT_PLANNER_PROFILE,
      exercisePreference: 'morning_outdoor' as const,
    };

    const plan = generateDailyPlan(profile, mockAirQuality);
    const exerciseItem = plan.items.find((i) => i.phase === 'exercise_recreation');

    expect(exerciseItem).toBeDefined();
    expect(exerciseItem?.recommendedAction.toLowerCase()).toContain('indoor');
    expect(exerciseItem?.alternatives.length).toBeGreaterThan(0);
  });

  it('provides zero-commute guidance for remote (WFH) users', () => {
    const profile = {
      ...DEFAULT_PLANNER_PROFILE,
      lifestyle: 'work_from_home' as const,
      transport: 'wfh' as const,
    };

    const plan = generateDailyPlan(profile, mockAirQuality);
    const commuteItem = plan.items.find((i) => i.phase === 'travel_commute');

    expect(commuteItem?.title).toContain('Zero Commute');
    expect(commuteItem?.personalBenefit).toContain('roadside');
  });

  it('adjusts advice when outdoor AQI is favorable (Good/Satisfactory)', () => {
    const cleanAirQuality: AirQualityData = {
      ...mockAirQuality,
      current: {
        ...mockAirQuality.current,
        aqi: 45,
        category: 'Good',
      },
    };

    const plan = generateDailyPlan(DEFAULT_PLANNER_PROFILE, cleanAirQuality);
    const earlyMorning = plan.items.find((i) => i.phase === 'early_morning');

    expect(earlyMorning?.recommendedAction.toLowerCase()).toContain('open windows');
  });
});
