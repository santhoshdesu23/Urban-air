'use client';

import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { HourlyForecastPoint } from '@/types/air-quality';
import { AlertTriangle, TrendingUp, Sun } from 'lucide-react';

interface HourlyChartProps {
  hourly: HourlyForecastPoint[];
  bestWindow: {
    start: string;
    end: string;
    aqi: number;
    recommendation: string;
  } | null;
  highestRisk: {
    start: string;
    end: string;
    aqi: number;
    pollutant: string;
    warning: string;
  } | null;
}

export function HourlyChart({ hourly, bestWindow, highestRisk }: HourlyChartProps) {
  const [forecastHorizon, setForecastHorizon] = useState<24 | 48>(24);

  const displayData = hourly.slice(0, forecastHorizon).map((pt) => ({
    time: pt.hourFormatted,
    cpcbAqi: pt.cpcbAqi,
    pm25: pt.pm25,
    pm10: pt.pm10,
    dominant: pt.dominantPollutant,
    isOutdoorOk: pt.isFavorableForOutdoor,
  }));

  const maxAqi = Math.max(...displayData.map((d) => d.cpcbAqi), 200);

  // Custom accessible Tooltip
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{ payload: (typeof displayData)[0] }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-md text-xs">
          <div className="font-bold text-slate-900 border-b border-slate-100 pb-1 flex justify-between gap-4">
            <span>Time: {label}</span>
            <span className="font-semibold text-emerald-700">
              {data.isOutdoorOk ? 'Favorable' : 'Elevated Risk'}
            </span>
          </div>
          <div className="mt-2 space-y-1">
            <div className="flex justify-between gap-4">
              <span className="text-slate-500">CPCB AQI:</span>
              <strong className="text-slate-900">{data.cpcbAqi}</strong>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-500">PM2.5:</span>
              <span>{data.pm25} µg/m³</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-500">PM10:</span>
              <span>{data.pm10} µg/m³</span>
            </div>
            <div className="flex justify-between gap-4 text-[11px] pt-1 border-t border-slate-100 text-slate-400">
              <span>Dominant: {data.dominant}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <section
      aria-labelledby="hourly-forecast-heading"
      className="mt-8 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
        <div>
          <h2
            id="hourly-forecast-heading"
            className="text-base font-bold text-slate-900 flex items-center gap-2"
          >
            <TrendingUp className="h-4 w-4 text-emerald-600" />
            Atmospheric Hourly Forecast & Risk Trend
          </h2>
          <p className="text-xs text-slate-500">
            Continuously modelled hourly dispersion data from Copernicus CAMS.
          </p>
        </div>

        {/* 24h vs 48h Toggle */}
        <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1 text-xs">
          <button
            type="button"
            onClick={() => setForecastHorizon(24)}
            className={`rounded-lg px-3 py-1 font-semibold transition ${
              forecastHorizon === 24
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Next 24 Hours
          </button>
          <button
            type="button"
            onClick={() => setForecastHorizon(48)}
            className={`rounded-lg px-3 py-1 font-semibold transition ${
              forecastHorizon === 48
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            48 Hours
          </button>
        </div>
      </div>

      {/* Strategic Risk Callouts */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {bestWindow && (
          <div className="flex items-start gap-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/60 p-3.5">
            <div className="rounded-xl bg-emerald-100 p-2 text-emerald-800">
              <Sun className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                Optimal Outdoor Window ({bestWindow.start} - {bestWindow.end})
              </span>
              <p className="text-xs text-emerald-950 mt-0.5 leading-snug">
                {bestWindow.recommendation} (Est. AQI: ~{bestWindow.aqi})
              </p>
            </div>
          </div>
        )}

        {highestRisk && (
          <div className="flex items-start gap-3 rounded-2xl bg-rose-50/70 border border-rose-200/60 p-3.5">
            <div className="rounded-xl bg-rose-100 p-2 text-rose-800">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800">
                Peak Hazard Window ({highestRisk.start} - {highestRisk.end})
              </span>
              <p className="text-xs text-rose-950 mt-0.5 leading-snug">
                {highestRisk.warning} (Est. AQI: ~{highestRisk.aqi})
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Chart Visualizer */}
      <div className="mt-6 h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={displayData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="aqiGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: '#64748b' }}
              interval="preserveStartEnd"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: '#64748b' }}
              domain={[0, Math.ceil(maxAqi * 1.15)]}
            />
            <Tooltip content={<CustomTooltip />} />
            {/* CPCB Satisfactory Threshold Reference Line */}
            <ReferenceLine
              y={100}
              stroke="#84cc16"
              strokeDasharray="4 4"
              label={{
                value: 'Satisfactory limit (100)',
                fill: '#65a30d',
                fontSize: 10,
                position: 'top',
              }}
            />
            {/* CPCB Poor Threshold Reference Line */}
            <ReferenceLine
              y={200}
              stroke="#f97316"
              strokeDasharray="4 4"
              label={{
                value: 'Poor threshold (200)',
                fill: '#c2410c',
                fontSize: 10,
                position: 'top',
              }}
            />
            <Area
              type="monotone"
              dataKey="cpcbAqi"
              stroke="#059669"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#aqiGradient)"
              activeDot={{ r: 5, fill: '#047857' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Screen-Reader Friendly Summary Table */}
      <details className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs text-slate-600">
        <summary className="font-semibold text-slate-800 cursor-pointer focus:outline-none">
          View Accessible Hourly Data Table (for screen readers)
        </summary>
        <div className="mt-2 max-h-48 overflow-y-auto">
          <table className="w-full text-left text-[11px]">
            <thead>
              <tr className="border-b border-slate-200 font-semibold text-slate-700">
                <th className="py-1">Hour</th>
                <th className="py-1">CPCB AQI</th>
                <th className="py-1">PM2.5 (µg/m³)</th>
                <th className="py-1">Dominant</th>
              </tr>
            </thead>
            <tbody>
              {displayData.map((d, i) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="py-1">{d.time}</td>
                  <td className="py-1 font-semibold">{d.cpcbAqi}</td>
                  <td className="py-1">{d.pm25}</td>
                  <td className="py-1">{d.dominant}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </section>
  );
}
