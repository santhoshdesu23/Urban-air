import { AirQualityData, GeocodingResult } from '@/types/air-quality';
import { OpenMeteoAirQualityProvider } from './open-meteo';

export interface PresetLocation {
  name: string;
  admin1?: string;
  country: string;
  latitude: number;
  longitude: number;
}

export const PRESET_LOCATIONS: PresetLocation[] = [
  { name: 'New Delhi', admin1: 'Delhi', country: 'India', latitude: 28.6139, longitude: 77.209 },
  { name: 'Mumbai', admin1: 'Maharashtra', country: 'India', latitude: 19.076, longitude: 72.8777 },
  {
    name: 'Bengaluru',
    admin1: 'Karnataka',
    country: 'India',
    latitude: 12.9716,
    longitude: 77.5946,
  },
  {
    name: 'Kolkata',
    admin1: 'West Bengal',
    country: 'India',
    latitude: 22.5726,
    longitude: 88.3639,
  },
  {
    name: 'Chennai',
    admin1: 'Tamil Nadu',
    country: 'India',
    latitude: 13.0827,
    longitude: 80.2707,
  },
  {
    name: 'Hyderabad',
    admin1: 'Telangana',
    country: 'India',
    latitude: 17.385,
    longitude: 78.4867,
  },
  { name: 'Ahmedabad', admin1: 'Gujarat', country: 'India', latitude: 23.0225, longitude: 72.5714 },
  {
    name: 'London',
    admin1: 'Greater London',
    country: 'United Kingdom',
    latitude: 51.5074,
    longitude: -0.1278,
  },
  {
    name: 'New York',
    admin1: 'New York',
    country: 'United States',
    latitude: 40.7128,
    longitude: -74.006,
  },
];

export class AirQualityService {
  private static instance: AirQualityService;
  private provider = new OpenMeteoAirQualityProvider();

  public static getInstance(): AirQualityService {
    if (!AirQualityService.instance) {
      AirQualityService.instance = new AirQualityService();
    }
    return AirQualityService.instance;
  }

  async getAirQuality(
    lat: number,
    lon: number,
    locationName: string,
    country?: string
  ): Promise<AirQualityData> {
    return this.provider.fetchAirQuality(lat, lon, locationName, country);
  }

  async searchLocations(query: string): Promise<GeocodingResult[]> {
    return this.provider.searchLocations(query);
  }

  getDefaultLocation(): PresetLocation {
    return PRESET_LOCATIONS[0]; // New Delhi
  }
}

export const airQualityService = AirQualityService.getInstance();
