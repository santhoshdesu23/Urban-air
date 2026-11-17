import { AQICategoryCPCB, DominantPollutant } from '@/types/air-quality';

interface Breakpoint {
  cLow: number;
  cHigh: number;
  iLow: number;
  iHigh: number;
}

/**
 * CPCB Indian National Air Quality Index (NAQI) Breakpoints (2014 standard)
 * Concentrations in ug/m3, except CO in mg/m3.
 */
const CPCB_BREAKPOINTS: Record<DominantPollutant, Breakpoint[]> = {
  'PM2.5': [
    { cLow: 0, cHigh: 30, iLow: 0, iHigh: 50 },
    { cLow: 31, cHigh: 60, iLow: 51, iHigh: 100 },
    { cLow: 61, cHigh: 90, iLow: 101, iHigh: 200 },
    { cLow: 91, cHigh: 120, iLow: 201, iHigh: 300 },
    { cLow: 121, cHigh: 250, iLow: 301, iHigh: 400 },
    { cLow: 251, cHigh: 500, iLow: 401, iHigh: 500 },
  ],
  PM10: [
    { cLow: 0, cHigh: 50, iLow: 0, iHigh: 50 },
    { cLow: 51, cHigh: 100, iLow: 51, iHigh: 100 },
    { cLow: 101, cHigh: 250, iLow: 101, iHigh: 200 },
    { cLow: 251, cHigh: 350, iLow: 201, iHigh: 300 },
    { cLow: 351, cHigh: 430, iLow: 301, iHigh: 400 },
    { cLow: 431, cHigh: 600, iLow: 401, iHigh: 500 },
  ],
  NO2: [
    { cLow: 0, cHigh: 40, iLow: 0, iHigh: 50 },
    { cLow: 41, cHigh: 80, iLow: 51, iHigh: 100 },
    { cLow: 81, cHigh: 180, iLow: 101, iHigh: 200 },
    { cLow: 181, cHigh: 280, iLow: 201, iHigh: 300 },
    { cLow: 281, cHigh: 400, iLow: 301, iHigh: 400 },
    { cLow: 401, cHigh: 600, iLow: 401, iHigh: 500 },
  ],
  SO2: [
    { cLow: 0, cHigh: 40, iLow: 0, iHigh: 50 },
    { cLow: 41, cHigh: 80, iLow: 51, iHigh: 100 },
    { cLow: 81, cHigh: 380, iLow: 101, iHigh: 200 },
    { cLow: 381, cHigh: 800, iLow: 201, iHigh: 300 },
    { cLow: 801, cHigh: 1600, iLow: 301, iHigh: 400 },
    { cLow: 1601, cHigh: 2000, iLow: 401, iHigh: 500 },
  ],
  CO: [
    { cLow: 0.0, cHigh: 1.0, iLow: 0, iHigh: 50 },
    { cLow: 1.1, cHigh: 2.0, iLow: 51, iHigh: 100 },
    { cLow: 2.1, cHigh: 10.0, iLow: 101, iHigh: 200 },
    { cLow: 10.1, cHigh: 17.0, iLow: 201, iHigh: 300 },
    { cLow: 17.1, cHigh: 34.0, iLow: 301, iHigh: 400 },
    { cLow: 34.1, cHigh: 50.0, iLow: 401, iHigh: 500 },
  ],
  O3: [
    { cLow: 0, cHigh: 50, iLow: 0, iHigh: 50 },
    { cLow: 51, cHigh: 100, iLow: 51, iHigh: 100 },
    { cLow: 101, cHigh: 168, iLow: 101, iHigh: 200 },
    { cLow: 169, cHigh: 208, iLow: 201, iHigh: 300 },
    { cLow: 209, cHigh: 748, iLow: 301, iHigh: 400 },
    { cLow: 749, cHigh: 1000, iLow: 401, iHigh: 500 },
  ],
};

/**
 * Calculates a single pollutant's CPCB Sub-Index via linear interpolation.
 */
export function calculateCPCBSubIndex(pollutant: DominantPollutant, concentration: number): number {
  if (concentration < 0 || isNaN(concentration)) return 0;

  const ranges = CPCB_BREAKPOINTS[pollutant];
  if (!ranges) return 0;

  for (const range of ranges) {
    if (concentration >= range.cLow && concentration <= range.cHigh) {
      const index =
        ((range.iHigh - range.iLow) / (range.cHigh - range.cLow)) * (concentration - range.cLow) +
        range.iLow;
      return Math.round(index);
    }
  }

  // If concentration exceeds the highest breakpoint:
  const lastRange = ranges[ranges.length - 1];
  if (concentration > lastRange.cHigh) {
    const extrapolated =
      ((lastRange.iHigh - lastRange.iLow) / (lastRange.cHigh - lastRange.cLow)) *
        (concentration - lastRange.cLow) +
      lastRange.iLow;
    return Math.min(500, Math.round(extrapolated));
  }

  return 0;
}

/**
 * Returns the official CPCB category for a given AQI index.
 */
export function getCPCBCategory(aqi: number): AQICategoryCPCB {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Satisfactory';
  if (aqi <= 200) return 'Moderate';
  if (aqi <= 300) return 'Poor';
  if (aqi <= 400) return 'Very Poor';
  return 'Severe';
}

/**
 * Health implication text according to CPCB documentation.
 */
export function getCPCBHealthImplication(category: AQICategoryCPCB): string {
  switch (category) {
    case 'Good':
      return 'Minimal health impact. Air quality is considered satisfactory.';
    case 'Satisfactory':
      return 'May cause minor breathing discomfort to sensitive people.';
    case 'Moderate':
      return 'May cause breathing discomfort to people with lung disease, asthma, and heart conditions.';
    case 'Poor':
      return 'May cause breathing discomfort to most people on prolonged outdoor exposure.';
    case 'Very Poor':
      return 'May cause respiratory illness to the people on prolonged exposure. Significant effect on sensitive groups.';
    case 'Severe':
      return 'May cause respiratory effects even on healthy people and serious health impacts on sensitive groups.';
  }
}

/**
 * Cautious, practical everyday advice for CPCB categories.
 */
export function getCPCBCautiousAdvisory(
  category: AQICategoryCPCB,
  dominant: DominantPollutant
): string {
  switch (category) {
    case 'Good':
      return 'Ideal conditions for outdoor walks, exercise, and natural ventilation.';
    case 'Satisfactory':
      return 'Generally safe for outdoor activities. Highly sensitive individuals should observe how they feel.';
    case 'Moderate':
      return `Elevated ${dominant} levels. Sensitive groups, elderly, and young children should moderate strenuous outdoor activities.`;
    case 'Poor':
      return `High ${dominant} concentration. Consider moving intense workouts indoors and keeping windows closed during peak traffic hours.`;
    case 'Very Poor':
      return `Critical ${dominant} levels. Avoid prolonged outdoor exertion. Use an effective N95/FFP2 mask when commuting outside. Keep air purifiers active indoors.`;
    case 'Severe':
      return `Severe pollution emergency. Remain indoors where possible, seal window gaps, run HEPA filtration, and avoid all unnecessary outdoor transit.`;
  }
}

/**
 * Determines overall CPCB AQI and dominant pollutant from pollutant concentrations.
 * Requires at least 3 pollutants with at least one being PM2.5 or PM10.
 */
export function calculateOverallCPCB(pollutants: Partial<Record<DominantPollutant, number>>): {
  aqi: number;
  category: AQICategoryCPCB;
  dominantPollutant: DominantPollutant;
  subIndices: Partial<Record<DominantPollutant, number>>;
  isSufficientData: boolean;
} {
  const subIndices: Partial<Record<DominantPollutant, number>> = {};
  let maxIndex = 0;
  let dominant: DominantPollutant = 'PM2.5';
  let hasParticulate = false;
  let count = 0;

  for (const [key, val] of Object.entries(pollutants)) {
    const code = key as DominantPollutant;
    if (val !== undefined && val !== null && !isNaN(val)) {
      const sub = calculateCPCBSubIndex(code, val);
      subIndices[code] = sub;
      count++;
      if (code === 'PM2.5' || code === 'PM10') {
        hasParticulate = true;
      }
      if (sub > maxIndex) {
        maxIndex = sub;
        dominant = code;
      }
    }
  }

  // CPCB NAQI guideline requirement: at least 3 pollutants, including PM10 or PM2.5
  const isSufficientData = count >= 3 && hasParticulate;

  return {
    aqi: maxIndex,
    category: getCPCBCategory(maxIndex),
    dominantPollutant: dominant,
    subIndices,
    isSufficientData,
  };
}
