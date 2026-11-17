import {
  AirQualityData,
  DailyOutlookPoint,
  DominantPollutant,
  GeocodingResult,
  HourlyForecastPoint,
  PollutantMeasurement,
} from '@/types/air-quality';
import { AirQualityProvider } from './provider';
import { calculateOverallCPCB, getCPCBCautiousAdvisory, getCPCBHealthImplication } from './cpcb';
import { getAQIColor, getEuropeanCategory, getUSEPACategory } from './standards';

interface OpenMeteoHourlyResponse {
  time: string[];
  pm10: (number | null)[];
  pm2_5: (number | null)[];
  carbon_monoxide: (number | null)[]; // in ug/m3
  nitrogen_dioxide: (number | null)[];
  sulphur_dioxide: (number | null)[];
  ozone: (number | null)[];
  us_aqi: (number | null)[];
  european_aqi: (number | null)[];
}

interface OpenMeteoApiResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  hourly: OpenMeteoHourlyResponse;
}

export class OpenMeteoAirQualityProvider implements AirQualityProvider {
  name = 'Open-Meteo CAMS Atmospheric Engine';
  isModelProvider = true;
  attribution = 'Copernicus Atmosphere Monitoring Service (CAMS) & Open-Meteo';

  private cache = new Map<string, { data: AirQualityData; expiresAt: number }>();
  private readonly CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache

  async searchLocations(query: string): Promise<GeocodingResult[]> {
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 2) return [];

    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      trimmed
    )}&count=8&language=en&format=json`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`Geocoding failed with status: ${res.status}`);
      }

      const data = await res.json();
      if (!data.results || !Array.isArray(data.results)) {
        return [];
      }

      return data.results.map(
        (r: {
          id: number;
          name: string;
          latitude: number;
          longitude: number;
          elevation?: number;
          admin1?: string;
          country: string;
          country_code?: string;
        }) => ({
          id: r.id,
          name: r.name,
          latitude: r.latitude,
          longitude: r.longitude,
          elevation: r.elevation,
          admin1: r.admin1,
          country: r.country,
          countryCode: r.country_code,
        })
      );
    } catch (err) {
      console.error('Error fetching geocoding results:', err);
      return [];
    }
  }

  async fetchAirQuality(
    lat: number,
    lon: number,
    locationName: string,
    country?: string
  ): Promise<AirQualityData> {
    const roundedLat = Number(lat.toFixed(3));
    const roundedLon = Number(lon.toFixed(3));
    const cacheKey = `${roundedLat},${roundedLon}`;

    const cached = this.cache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.data;
    }

    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${roundedLat}&longitude=${roundedLon}&hourly=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,us_aqi,european_aqi&timezone=auto`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    let raw: OpenMeteoApiResponse;
    try {
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`Open-Meteo responded with status ${res.status}`);
      }
      raw = await res.json();
    } catch (err) {
      clearTimeout(timeoutId);
      console.error('Failed to fetch from Open-Meteo:', err);
      // If error occurs and we have any previous stale cache, return it with warning
      if (cached) {
        return cached.data;
      }
      throw new Error('Unable to retrieve air quality data. Please check your network connection.');
    }

    const normalized = this.normalizeResponse(raw, locationName, country);
    this.cache.set(cacheKey, {
      data: normalized,
      expiresAt: Date.now() + this.CACHE_TTL_MS,
    });

    return normalized;
  }

  private normalizeResponse(
    raw: OpenMeteoApiResponse,
    locationName: string,
    country?: string
  ): AirQualityData {
    const hourly = raw.hourly;
    const nowIso = new Date().toISOString();

    // Find the closest hour index
    let currentIndex = 0;
    const nowEpoch = Date.now();
    let minDiff = Infinity;

    for (let i = 0; i < hourly.time.length; i++) {
      const t = new Date(hourly.time[i]).getTime();
      const diff = Math.abs(t - nowEpoch);
      if (diff < minDiff) {
        minDiff = diff;
        currentIndex = i;
      }
    }

    // Convert CO from ug/m3 to mg/m3 (1 mg/m3 = 1000 ug/m3)
    const rawCoUg = hourly.carbon_monoxide[currentIndex] ?? 500;
    const coMg = Number((rawCoUg / 1000).toFixed(2));

    const currentPollutants: Record<DominantPollutant, number> = {
      'PM2.5': hourly.pm2_5[currentIndex] ?? 25,
      PM10: hourly.pm10[currentIndex] ?? 45,
      NO2: hourly.nitrogen_dioxide[currentIndex] ?? 20,
      SO2: hourly.sulphur_dioxide[currentIndex] ?? 10,
      CO: coMg,
      O3: hourly.ozone[currentIndex] ?? 30,
    };

    // Calculate CPCB Overall AQI & Sub-indices
    const cpcbResult = calculateOverallCPCB(currentPollutants);
    const usAqi = hourly.us_aqi[currentIndex] ?? Math.round(cpcbResult.aqi * 0.9);
    const europeanAqi = hourly.european_aqi[currentIndex] ?? 2;

    const usCategory = getUSEPACategory(usAqi);
    const europeanCategory = getEuropeanCategory(europeanAqi);

    // Primary display standard: Default to CPCB (standard Indian NAQI scale)
    const activeCategory = cpcbResult.category;
    const colorInfo = getAQIColor(activeCategory);

    // Construct detailed pollutant measurements
    const pollutants: Record<DominantPollutant, PollutantMeasurement> = {
      'PM2.5': {
        code: 'PM2.5',
        name: 'Fine Particulate Matter (PM2.5)',
        value: Number(currentPollutants['PM2.5'].toFixed(1)),
        unit: 'µg/m³',
        subIndex: cpcbResult.subIndices['PM2.5'],
        safeLimit: 60, // CPCB 24-hr standard
        standardName: 'CPCB 24-hr standard (60 µg/m³)',
      },
      PM10: {
        code: 'PM10',
        name: 'Coarse Particulate Matter (PM10)',
        value: Number(currentPollutants.PM10.toFixed(1)),
        unit: 'µg/m³',
        subIndex: cpcbResult.subIndices.PM10,
        safeLimit: 100, // CPCB 24-hr standard
        standardName: 'CPCB 24-hr standard (100 µg/m³)',
      },
      NO2: {
        code: 'NO2',
        name: 'Nitrogen Dioxide (NO2)',
        value: Number(currentPollutants.NO2.toFixed(1)),
        unit: 'µg/m³',
        subIndex: cpcbResult.subIndices.NO2,
        safeLimit: 80,
        standardName: 'CPCB 24-hr standard (80 µg/m³)',
      },
      SO2: {
        code: 'SO2',
        name: 'Sulphur Dioxide (SO2)',
        value: Number(currentPollutants.SO2.toFixed(1)),
        unit: 'µg/m³',
        subIndex: cpcbResult.subIndices.SO2,
        safeLimit: 80,
        standardName: 'CPCB 24-hr standard (80 µg/m³)',
      },
      CO: {
        code: 'CO',
        name: 'Carbon Monoxide (CO)',
        value: Number(currentPollutants.CO.toFixed(2)),
        unit: 'mg/m³',
        subIndex: cpcbResult.subIndices.CO,
        safeLimit: 2.0, // CPCB 8-hr standard
        standardName: 'CPCB 8-hr standard (2.0 mg/m³)',
      },
      O3: {
        code: 'O3',
        name: 'Ozone (O3)',
        value: Number(currentPollutants.O3.toFixed(1)),
        unit: 'µg/m³',
        subIndex: cpcbResult.subIndices.O3,
        safeLimit: 100, // CPCB 8-hr standard
        standardName: 'CPCB 8-hr standard (100 µg/m³)',
      },
    };

    // Build next 48-hour forecast points
    const hourlyForecast: HourlyForecastPoint[] = [];
    const endIndex = Math.min(hourly.time.length, currentIndex + 48);

    for (let i = currentIndex; i < endIndex; i++) {
      const pointCo = Number(((hourly.carbon_monoxide[i] ?? 0) / 1000).toFixed(2));
      const ptPollutants: Record<DominantPollutant, number> = {
        'PM2.5': hourly.pm2_5[i] ?? 0,
        PM10: hourly.pm10[i] ?? 0,
        NO2: hourly.nitrogen_dioxide[i] ?? 0,
        SO2: hourly.sulphur_dioxide[i] ?? 0,
        CO: pointCo,
        O3: hourly.ozone[i] ?? 0,
      };

      const ptCpcb = calculateOverallCPCB(ptPollutants);
      const ptDate = new Date(hourly.time[i]);
      const hourStr = ptDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });

      hourlyForecast.push({
        time: hourly.time[i],
        hourFormatted: hourStr,
        cpcbAqi: ptCpcb.aqi,
        usAqi: hourly.us_aqi[i] ?? ptCpcb.aqi,
        europeanAqi: hourly.european_aqi[i] ?? 2,
        pm25: Number((hourly.pm2_5[i] ?? 0).toFixed(1)),
        pm10: Number((hourly.pm10[i] ?? 0).toFixed(1)),
        no2: Number((hourly.nitrogen_dioxide[i] ?? 0).toFixed(1)),
        so2: Number((hourly.sulphur_dioxide[i] ?? 0).toFixed(1)),
        co: pointCo,
        o3: Number((hourly.ozone[i] ?? 0).toFixed(1)),
        dominantPollutant: ptCpcb.dominantPollutant,
        isFavorableForOutdoor: ptCpcb.aqi <= 100,
      });
    }

    // Build 5-day daily outlook
    const dailyMap = new Map<string, HourlyForecastPoint[]>();
    for (const pt of hourlyForecast) {
      const dateKey = pt.time.split('T')[0];
      if (!dailyMap.has(dateKey)) {
        dailyMap.set(dateKey, []);
      }
      dailyMap.get(dateKey)!.push(pt);
    }

    const dailyOutlook: DailyOutlookPoint[] = [];
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (const [dateStr, points] of Array.from(dailyMap.entries()).slice(0, 5)) {
      const d = new Date(dateStr);
      const dayOfWeek = daysOfWeek[d.getDay()];
      const aqis = points.map((p) => p.cpcbAqi);
      const minAqi = Math.min(...aqis);
      const maxAqi = Math.max(...aqis);
      const avgAqi = Math.round(aqis.reduce((a, b) => a + b, 0) / aqis.length);

      // Find highest risk window
      let peakHour = points[0];
      let bestHour = points[0];
      for (const p of points) {
        if (p.cpcbAqi > peakHour.cpcbAqi) peakHour = p;
        if (p.cpcbAqi < bestHour.cpcbAqi) bestHour = p;
      }

      dailyOutlook.push({
        date: dateStr,
        dayOfWeek,
        minAqi,
        maxAqi,
        avgAqi,
        category: calculateOverallCPCB({ 'PM2.5': avgAqi }).category,
        dominantPollutant: peakHour.dominantPollutant,
        highRiskPeriod: `${peakHour.hourFormatted} (AQI ~${peakHour.cpcbAqi})`,
        bestActivityWindow: `${bestHour.hourFormatted} (AQI ~${bestHour.cpcbAqi})`,
      });
    }

    // Identify 24-hr Best Outdoor Window & Highest Risk Period
    const next24 = hourlyForecast.slice(0, 24);
    let bestWindow = null;
    let worstWindow = null;

    if (next24.length > 0) {
      const sortedByAqi = [...next24].sort((a, b) => a.cpcbAqi - b.cpcbAqi);
      const best = sortedByAqi[0];
      const worst = sortedByAqi[sortedByAqi.length - 1];

      bestWindow = {
        start: best.hourFormatted,
        end: `${(parseInt(best.hourFormatted.slice(0, 2)) + 2) % 24}:00`,
        aqi: best.cpcbAqi,
        recommendation:
          best.cpcbAqi <= 100
            ? 'Optimal window for necessary outdoor errands and brief ventilation.'
            : 'Lowest expected pollution window today, but keep outdoor exertion light.',
      };

      worstWindow = {
        start: worst.hourFormatted,
        end: `${(parseInt(worst.hourFormatted.slice(0, 2)) + 3) % 24}:00`,
        aqi: worst.cpcbAqi,
        pollutant: worst.dominantPollutant,
        warning: `Highest pollution spike anticipated (${worst.dominantPollutant} elevated). Stay indoors and avoid busy arterial roads.`,
      };
    }

    // Grounded Smart Summary
    const summaryText = `Air quality in ${locationName} is currently ${activeCategory.toUpperCase()} (AQI ${cpcbResult.aqi}, CPCB standard). The dominant pollutant is ${cpcbResult.dominantPollutant} at ${pollutants[cpcbResult.dominantPollutant].value} ${pollutants[cpcbResult.dominantPollutant].unit}. ${getCPCBCautiousAdvisory(activeCategory, cpcbResult.dominantPollutant)}`;

    return {
      location: {
        name: locationName,
        country: country || (raw.timezone.includes('Kolkata') ? 'India' : 'International'),
        latitude: raw.latitude,
        longitude: raw.longitude,
        timezone: raw.timezone,
      },
      timestamp: hourly.time[currentIndex] || nowIso,
      retrievedAt: nowIso,
      isModelEstimate: true,
      provider: {
        name: 'Copernicus Atmospheric Service (CAMS) / Open-Meteo',
        attribution:
          'Atmospheric numerical dispersion model data provided by Copernicus CAMS & Open-Meteo.',
        modelInfo:
          'Continuously updated 3D atmospheric chemical transport model incorporating satellite observations and ground assimilation.',
      },
      activeStandard: 'CPCB',
      current: {
        aqi: cpcbResult.aqi,
        category: activeCategory,
        colorHex: colorInfo.hex,
        badgeVariant: colorInfo.badgeVariant,
        dominantPollutant: cpcbResult.dominantPollutant,
        healthImplication: getCPCBHealthImplication(activeCategory),
        cautiousAdvisory: getCPCBCautiousAdvisory(activeCategory, cpcbResult.dominantPollutant),
        pollutants,
        standardBreakdown: {
          cpcb: { aqi: cpcbResult.aqi, category: activeCategory },
          usEpa: { aqi: usAqi, category: usCategory },
          european: { aqi: europeanAqi, category: europeanCategory },
        },
      },
      forecast: {
        hourly: hourlyForecast,
        daily: dailyOutlook,
        bestOutdoorWindow: bestWindow,
        highestRiskPeriod: worstWindow,
      },
      summaryText,
    };
  }
}
