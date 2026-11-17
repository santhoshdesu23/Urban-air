import { AirQualityData, GeocodingResult } from '@/types/air-quality';

export interface AirQualityProvider {
  name: string;
  isModelProvider: boolean;
  attribution: string;
  fetchAirQuality(
    lat: number,
    lon: number,
    locationName: string,
    country?: string
  ): Promise<AirQualityData>;
  searchLocations(query: string): Promise<GeocodingResult[]>;
}
