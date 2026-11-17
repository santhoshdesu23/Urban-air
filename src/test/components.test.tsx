import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AqiCard } from '@/components/features/air-quality/aqi-card';
import { PollutantGrid } from '@/components/features/air-quality/pollutant-grid';
import { AirQualityData } from '@/types/air-quality';

const mockData: AirQualityData = {
  location: {
    name: 'New Delhi',
    country: 'India',
    latitude: 28.61,
    longitude: 77.2,
  },
  timestamp: '2026-11-17T12:00:00Z',
  retrievedAt: '2026-11-17T12:05:00Z',
  isModelEstimate: true,
  provider: {
    name: 'Copernicus Atmospheric Service',
    attribution: 'CAMS & Open-Meteo',
    modelInfo: 'CAMS numerical dispersion model',
  },
  activeStandard: 'CPCB',
  current: {
    aqi: 285,
    category: 'Poor',
    colorHex: '#f97316',
    badgeVariant: 'poor',
    dominantPollutant: 'PM2.5',
    healthImplication: 'Breathing discomfort to most people on prolonged outdoor exposure.',
    cautiousAdvisory: 'High PM2.5 concentration. Consider moving intense workouts indoors.',
    pollutants: {
      'PM2.5': {
        code: 'PM2.5',
        name: 'Fine Particulate Matter (PM2.5)',
        value: 115,
        unit: 'µg/m³',
        safeLimit: 60,
        standardName: 'CPCB',
      },
      PM10: {
        code: 'PM10',
        name: 'Coarse Particulate Matter (PM10)',
        value: 240,
        unit: 'µg/m³',
        safeLimit: 100,
        standardName: 'CPCB',
      },
      NO2: {
        code: 'NO2',
        name: 'Nitrogen Dioxide (NO2)',
        value: 45,
        unit: 'µg/m³',
        safeLimit: 80,
        standardName: 'CPCB',
      },
      SO2: {
        code: 'SO2',
        name: 'Sulphur Dioxide (SO2)',
        value: 12,
        unit: 'µg/m³',
        safeLimit: 80,
        standardName: 'CPCB',
      },
      CO: {
        code: 'CO',
        name: 'Carbon Monoxide (CO)',
        value: 1.4,
        unit: 'mg/m³',
        safeLimit: 2.0,
        standardName: 'CPCB',
      },
      O3: {
        code: 'O3',
        name: 'Ozone (O3)',
        value: 50,
        unit: 'µg/m³',
        safeLimit: 100,
        standardName: 'CPCB',
      },
    },
    standardBreakdown: {
      cpcb: { aqi: 285, category: 'Poor' },
      usEpa: { aqi: 220, category: 'Very Unhealthy' },
      european: { aqi: 4, category: 'Poor' },
    },
  },
  forecast: {
    hourly: [],
    daily: [],
    bestOutdoorWindow: null,
    highestRiskPeriod: null,
  },
  summaryText: 'Air quality in New Delhi is currently POOR.',
};

describe('Component Rendering & Accessibility', () => {
  it('renders AQI Card with index, category, dominant pollutant, and model estimate notice', () => {
    const handleStandardChange = vi.fn();
    render(
      <AqiCard data={mockData} activeStandard="CPCB" onStandardChange={handleStandardChange} />
    );

    expect(screen.getByText('285')).toBeDefined();
    expect(screen.getByText(/Category: Poor/i)).toBeDefined();
    expect(screen.getByText(/Dominant: PM2.5/i)).toBeDefined();
    expect(screen.getByText(/Model-Based Dispersion/i)).toBeDefined();
  });

  it('renders Pollutant Grid with all 6 core pollutants', () => {
    render(
      <PollutantGrid
        pollutants={mockData.current.pollutants}
        dominantPollutant={mockData.current.dominantPollutant}
      />
    );

    expect(screen.getByText('PM2.5')).toBeDefined();
    expect(screen.getByText('PM10')).toBeDefined();
    expect(screen.getByText('NO2')).toBeDefined();
    expect(screen.getByText('SO2')).toBeDefined();
    expect(screen.getByText('CO')).toBeDefined();
    expect(screen.getByText('O3')).toBeDefined();
    expect(screen.getByText('Dominant')).toBeDefined();
  });
});
