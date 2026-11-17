import { describe, it, expect } from 'vitest';
import {
  calculateCPCBSubIndex,
  getCPCBCategory,
  calculateOverallCPCB,
  getCPCBHealthImplication,
} from '@/lib/air-quality/cpcb';

describe('CPCB National Air Quality Index (NAQI) Engine', () => {
  it('correctly maps CPCB categories across standard bounds', () => {
    expect(getCPCBCategory(0)).toBe('Good');
    expect(getCPCBCategory(50)).toBe('Good');
    expect(getCPCBCategory(51)).toBe('Satisfactory');
    expect(getCPCBCategory(100)).toBe('Satisfactory');
    expect(getCPCBCategory(101)).toBe('Moderate');
    expect(getCPCBCategory(200)).toBe('Moderate');
    expect(getCPCBCategory(201)).toBe('Poor');
    expect(getCPCBCategory(300)).toBe('Poor');
    expect(getCPCBCategory(301)).toBe('Very Poor');
    expect(getCPCBCategory(400)).toBe('Very Poor');
    expect(getCPCBCategory(401)).toBe('Severe');
    expect(getCPCBCategory(500)).toBe('Severe');
    expect(getCPCBCategory(650)).toBe('Severe');
  });

  it('calculates PM2.5 sub-indices accurately using linear interpolation', () => {
    // 0 ug/m3 -> 0 AQI
    expect(calculateCPCBSubIndex('PM2.5', 0)).toBe(0);
    // 30 ug/m3 -> 50 AQI (Good boundary)
    expect(calculateCPCBSubIndex('PM2.5', 30)).toBe(50);
    // 60 ug/m3 -> 100 AQI (Satisfactory boundary)
    expect(calculateCPCBSubIndex('PM2.5', 60)).toBe(100);
    // 90 ug/m3 -> 200 AQI (Moderate boundary)
    expect(calculateCPCBSubIndex('PM2.5', 90)).toBe(200);
    // 120 ug/m3 -> 300 AQI (Poor boundary)
    expect(calculateCPCBSubIndex('PM2.5', 120)).toBe(300);
    // 250 ug/m3 -> 400 AQI (Very Poor boundary)
    expect(calculateCPCBSubIndex('PM2.5', 250)).toBe(400);
  });

  it('calculates PM10 sub-indices accurately', () => {
    expect(calculateCPCBSubIndex('PM10', 50)).toBe(50);
    expect(calculateCPCBSubIndex('PM10', 100)).toBe(100);
    expect(calculateCPCBSubIndex('PM10', 250)).toBe(200);
    expect(calculateCPCBSubIndex('PM10', 350)).toBe(300);
    expect(calculateCPCBSubIndex('PM10', 430)).toBe(400);
  });

  it('calculates CO sub-indices in mg/m3 accurately', () => {
    expect(calculateCPCBSubIndex('CO', 1.0)).toBe(50);
    expect(calculateCPCBSubIndex('CO', 2.0)).toBe(100);
    expect(calculateCPCBSubIndex('CO', 10.0)).toBe(200);
  });

  it('determines dominant pollutant and checks sufficient data rules', () => {
    // Meets CPCB criteria: >= 3 pollutants, including PM2.5 or PM10
    const pollutants = {
      'PM2.5': 120, // Sub-index: 300
      PM10: 100, // Sub-index: 100
      NO2: 40, // Sub-index: 50
    };

    const result = calculateOverallCPCB(pollutants);
    expect(result.aqi).toBe(300);
    expect(result.category).toBe('Poor');
    expect(result.dominantPollutant).toBe('PM2.5');
    expect(result.isSufficientData).toBe(true);
  });

  it('handles negative or NaN concentrations safely', () => {
    expect(calculateCPCBSubIndex('PM2.5', -10)).toBe(0);
    expect(calculateCPCBSubIndex('PM2.5', NaN)).toBe(0);
  });

  it('returns valid health implications', () => {
    const text = getCPCBHealthImplication('Very Poor');
    expect(text).toContain('respiratory');
  });
});
