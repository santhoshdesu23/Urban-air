import { describe, it, expect } from 'vitest';
import {
  calculateAvoidedEmissions,
  getPersonalExposureExplanation,
} from '@/lib/impact/calculator';

describe('Avoided Emissions & Impact Engine', () => {
  it('correctly calculates avoided emissions between petrol car and electric metro', () => {
    // 15 km, 10 trips = 150 km
    // Petrol car: 150 * 0.170 = 25.5 kg CO2e
    // Metro: 150 * 0.018 = 2.7 kg CO2e
    // Avoided: 25.5 - 2.7 = 22.8 kg CO2e
    const result = calculateAvoidedEmissions({
      baselineMode: 'petrol_car',
      alternativeMode: 'metro',
      distanceKm: 15,
      tripsCount: 10,
    });

    expect(result.distanceKmTotal).toBe(150);
    expect(result.baselineEmissionsKg).toBe(25.5);
    expect(result.alternativeEmissionsKg).toBe(2.7);
    expect(result.avoidedKgCO2e).toBe(22.8);
    expect(result.formula).toContain('Avoided Emissions');
    expect(result.sourceCitation).toContain('DEFRA');
  });

  it('correctly calculates avoided emissions for zero-emission active transit (walking/cycling)', () => {
    const result = calculateAvoidedEmissions({
      baselineMode: 'petrol_car',
      alternativeMode: 'walking',
      distanceKm: 5,
      tripsCount: 2,
    });

    expect(result.distanceKmTotal).toBe(10);
    expect(result.alternativeEmissionsKg).toBe(0);
    expect(result.avoidedKgCO2e).toBe(1.7); // 10 * 0.170
  });

  it('handles negative or zero distance inputs safely', () => {
    const result = calculateAvoidedEmissions({
      baselineMode: 'petrol_car',
      alternativeMode: 'metro',
      distanceKm: -5,
      tripsCount: 0,
    });

    expect(result.distanceKmTotal).toBe(0);
    expect(result.avoidedKgCO2e).toBe(0);
  });

  it('calculates carpooling 50% savings over solo car', () => {
    const identicalModes = calculateAvoidedEmissions({
      baselineMode: 'petrol_car',
      alternativeMode: 'metro',
      distanceKm: 0,
      tripsCount: 1,
    });
    expect(identicalModes.avoidedKgCO2e).toBe(0);

    const carpool = calculateAvoidedEmissions({
      baselineMode: 'petrol_car',
      alternativeMode: 'carpool_2p',
      distanceKm: 20,
      tripsCount: 1,
    });
    // 20 * (0.170 - 0.085) = 1.7 kg CO2e avoided
    expect(carpool.avoidedKgCO2e).toBe(1.7);
  });

  it('provides cautious non-medical personal exposure explanations', () => {
    const highAqiExplanation = getPersonalExposureExplanation(3.5, 320);
    expect(highAqiExplanation.headline).toContain('3.5 hours');
    expect(highAqiExplanation.cautiousCaveat).toContain(
      'does not constitute clinical medical diagnosis'
    );

    const moderateExplanation = getPersonalExposureExplanation(1.0, 80);
    expect(moderateExplanation.cautiousCaveat).toContain('Individual respiratory responses vary');
  });
});
