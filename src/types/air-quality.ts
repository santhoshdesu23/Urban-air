export type AQIStandard = 'CPCB' | 'US_EPA' | 'EUROPEAN';

export type AQICategoryCPCB =
  'Good' | 'Satisfactory' | 'Moderate' | 'Poor' | 'Very Poor' | 'Severe';

export type AQICategoryUSEPA =
  | 'Good'
  | 'Moderate'
  | 'Unhealthy for Sensitive Groups'
  | 'Unhealthy'
  | 'Very Unhealthy'
  | 'Hazardous';

export type AQICategoryEuropean =
  'Good' | 'Fair' | 'Moderate' | 'Poor' | 'Very Poor' | 'Extremely Poor';

export type DominantPollutant = 'PM2.5' | 'PM10' | 'NO2' | 'SO2' | 'CO' | 'O3';

export interface PollutantMeasurement {
  code: DominantPollutant;
  name: string;
  value: number; // in ug/m3 or mg/m3 for CO
  unit: string;
  subIndex?: number; // CPCB Sub-Index or standard sub-index
  category?: string;
  safeLimit: number; // reference safe standard (e.g. 24-hr CPCB or WHO guideline)
  standardName: string;
}

export interface HourlyForecastPoint {
  time: string; // ISO 8601 string
  hourFormatted: string; // "14:00"
  cpcbAqi: number;
  usAqi: number;
  europeanAqi: number;
  pm25: number;
  pm10: number;
  no2: number;
  so2: number;
  co: number;
  o3: number;
  dominantPollutant: DominantPollutant;
  isFavorableForOutdoor: boolean;
}

export interface DailyOutlookPoint {
  date: string; // YYYY-MM-DD
  dayOfWeek: string; // "Mon", "Tue"
  minAqi: number;
  maxAqi: number;
  avgAqi: number;
  category: string;
  dominantPollutant: DominantPollutant;
  highRiskPeriod: string; // e.g. "Morning 06:00 - 09:00"
  bestActivityWindow: string; // e.g. "Afternoon 13:00 - 16:00"
}

export interface AirQualityData {
  location: {
    name: string;
    admin1?: string; // State / Province
    country: string;
    countryCode?: string;
    latitude: number;
    longitude: number;
    timezone?: string;
  };
  timestamp: string; // ISO 8601 of reading / model run
  retrievedAt: string; // ISO 8601 when fetched
  isModelEstimate: boolean; // true for CAMS / Open-Meteo model
  provider: {
    name: string;
    attribution: string;
    modelInfo: string;
  };
  activeStandard: AQIStandard;
  current: {
    aqi: number;
    category: string;
    colorHex: string;
    badgeVariant: 'good' | 'satisfactory' | 'moderate' | 'poor' | 'veryPoor' | 'severe';
    dominantPollutant: DominantPollutant;
    healthImplication: string;
    cautiousAdvisory: string;
    pollutants: Record<DominantPollutant, PollutantMeasurement>;
    standardBreakdown: {
      cpcb: { aqi: number; category: AQICategoryCPCB };
      usEpa: { aqi: number; category: AQICategoryUSEPA };
      european: { aqi: number; category: AQICategoryEuropean };
    };
  };
  forecast: {
    hourly: HourlyForecastPoint[];
    daily: DailyOutlookPoint[];
    bestOutdoorWindow: {
      start: string;
      end: string;
      aqi: number;
      recommendation: string;
    } | null;
    highestRiskPeriod: {
      start: string;
      end: string;
      aqi: number;
      pollutant: DominantPollutant;
      warning: string;
    } | null;
  };
  summaryText: string;
}

export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  admin1?: string;
  country: string;
  countryCode?: string;
}
