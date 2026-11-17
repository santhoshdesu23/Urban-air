import { AQICategoryUSEPA, AQICategoryEuropean, AQIStandard } from '@/types/air-quality';

export function getUSEPACategory(aqi: number): AQICategoryUSEPA {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
}

export function getEuropeanCategory(index: number): AQICategoryEuropean {
  if (index <= 1) return 'Good';
  if (index === 2) return 'Fair';
  if (index === 3) return 'Moderate';
  if (index === 4) return 'Poor';
  if (index === 5) return 'Very Poor';
  return 'Extremely Poor';
}

export interface StandardMeta {
  standard: AQIStandard;
  fullName: string;
  governingBody: string;
  scaleDescription: string;
  maxHealthyThreshold: number;
}

export const STANDARDS_INFO: Record<AQIStandard, StandardMeta> = {
  CPCB: {
    standard: 'CPCB',
    fullName: 'Indian National Air Quality Index (NAQI)',
    governingBody: 'Central Pollution Control Board (MoEFCC, India)',
    scaleDescription: '0 - 500+ scale divided into 6 distinct color-coded health bands',
    maxHealthyThreshold: 100, // Satisfactory or better
  },
  US_EPA: {
    standard: 'US_EPA',
    fullName: 'United States Environmental Protection Agency AQI',
    governingBody: 'US EPA',
    scaleDescription: '0 - 500 normalized index across 6 categories',
    maxHealthyThreshold: 50, // Good
  },
  EUROPEAN: {
    standard: 'EUROPEAN',
    fullName: 'European Air Quality Index (EAQI)',
    governingBody: 'European Environment Agency (EEA)',
    scaleDescription: '1 to 6 banded index based on hourly pollutant thresholds',
    maxHealthyThreshold: 2, // Fair or Good
  },
};

export function getAQIColor(category: string): {
  hex: string;
  bgClass: string;
  textClass: string;
  badgeVariant: 'good' | 'satisfactory' | 'moderate' | 'poor' | 'veryPoor' | 'severe';
} {
  const normalized = category.toLowerCase();

  if (normalized.includes('good')) {
    return {
      hex: '#10b981',
      bgClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      textClass: 'text-emerald-700',
      badgeVariant: 'good',
    };
  }
  if (normalized.includes('satisfactory') || normalized.includes('fair')) {
    return {
      hex: '#84cc16',
      bgClass: 'bg-lime-50 text-lime-800 border-lime-200',
      textClass: 'text-lime-700',
      badgeVariant: 'satisfactory',
    };
  }
  if (normalized.includes('moderate') || normalized.includes('sensitive')) {
    return {
      hex: '#f59e0b',
      bgClass: 'bg-amber-50 text-amber-800 border-amber-200',
      textClass: 'text-amber-700',
      badgeVariant: 'moderate',
    };
  }
  if (normalized === 'poor' || normalized.includes('unhealthy')) {
    return {
      hex: '#f97316',
      bgClass: 'bg-orange-50 text-orange-800 border-orange-200',
      textClass: 'text-orange-700',
      badgeVariant: 'poor',
    };
  }
  if (normalized.includes('very poor') || normalized.includes('very unhealthy')) {
    return {
      hex: '#ef4444',
      bgClass: 'bg-rose-50 text-rose-800 border-rose-200',
      textClass: 'text-rose-700',
      badgeVariant: 'veryPoor',
    };
  }
  // Severe / Hazardous / Extremely Poor
  return {
    hex: '#7e22ce',
    bgClass: 'bg-purple-50 text-purple-900 border-purple-300',
    textClass: 'text-purple-700',
    badgeVariant: 'severe',
  };
}
