'use client';

import React from 'react';
import {
  ShieldAlert,
  Info,
  Clock,
  Radio,
  Flame,
  AlertTriangle,
} from 'lucide-react';
import { AirQualityData, AQIStandard } from '@/types/air-quality';
import { STANDARDS_INFO } from '@/lib/air-quality/standards';

interface AqiCardProps {
  data: AirQualityData;
  activeStandard: AQIStandard;
  onStandardChange: (std: AQIStandard) => void;
}

export function AqiCard({ data, activeStandard, onStandardChange }: AqiCardProps) {
  const current = data.current;
  const standardMeta = STANDARDS_INFO[activeStandard];

  // Pick index and category based on active standard
  let displayAqi = current.aqi;
  let displayCategory = current.category;

  if (activeStandard === 'US_EPA') {
    displayAqi = current.standardBreakdown.usEpa.aqi;
    displayCategory = current.standardBreakdown.usEpa.category;
  } else if (activeStandard === 'EUROPEAN') {
    displayAqi = current.standardBreakdown.european.aqi;
    displayCategory = current.standardBreakdown.european.category;
  }

  // Last updated format
  const updatedDate = new Date(data.timestamp);
  const updatedTimeStr = updatedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <article
      className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all sm:p-8"
      aria-labelledby="aqi-heading"
    >
      {/* Decorative subtle backdrop gradient based on AQI category */}
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-10 blur-3xl"
        style={{ backgroundColor: current.colorHex }}
        aria-hidden="true"
      />

      {/* Top Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 font-semibold text-slate-900">
            <Radio className="h-3.5 w-3.5 text-emerald-600 animate-pulse" />
            {data.location.name}
          </span>
          <span>·</span>
          <span>{data.location.country}</span>
          <span className="hidden sm:inline">
            ({data.location.latitude.toFixed(2)}°N, {data.location.longitude.toFixed(2)}°E)
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Measured vs Model estimate badge */}
          <span
            className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700 border border-slate-200"
            title={data.provider.modelInfo}
          >
            <Info className="h-3 w-3 text-slate-500" />
            {data.isModelEstimate ? 'Model-Based Dispersion (CAMS)' : 'Official Monitoring Station'}
          </span>

          <span className="flex items-center gap-1 text-[11px] text-slate-400">
            <Clock className="h-3 w-3" />
            Observed: {updatedTimeStr}
          </span>
        </div>
      </div>

      {/* Main AQI Section: 3-Second Comprehension */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
        {/* Left Col: Giant AQI Display & Category */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <div className="flex items-baseline gap-4">
            <span
              id="aqi-heading"
              className="text-6xl font-black tracking-tight sm:text-7xl font-sans"
              style={{ color: current.colorHex }}
              aria-label={`Air Quality Index: ${displayAqi}`}
            >
              {displayAqi}
            </span>
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Index Value
              </span>
              <span className="text-xs font-semibold text-slate-600">
                {activeStandard === 'EUROPEAN' ? 'Scale 1 to 6' : 'Scale 0 to 500'}
              </span>
            </div>
          </div>

          {/* Category Banner with Color Indicator (Never color alone!) */}
          <div className="mt-3 flex items-center gap-3">
            <span
              className="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-sm font-bold border shadow-xs"
              style={{
                backgroundColor: `${current.colorHex}15`,
                color: current.colorHex,
                borderColor: `${current.colorHex}40`,
              }}
            >
              <AlertTriangle className="h-4 w-4" aria-hidden="true" />
              Category: {displayCategory}
            </span>

            {/* Dominant Pollutant Chip */}
            <span className="inline-flex items-center gap-1 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-800 border border-slate-200">
              <Flame className="h-3.5 w-3.5 text-orange-600" />
              Dominant: {current.dominantPollutant}
            </span>
          </div>

          {/* Standard Indicator */}
          <div className="mt-3 text-[11px] text-slate-500">
            Standard Displayed:{' '}
            <strong className="text-slate-800 font-semibold">{standardMeta.fullName}</strong>
          </div>
        </div>

        {/* Right Col: Health Advisory & Meaningful Explanation */}
        <div className="lg:col-span-7 flex flex-col justify-center rounded-2xl bg-slate-50/80 p-5 border border-slate-200/60">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600">
            <ShieldAlert className="h-4 w-4 text-emerald-700" />
            Immediate Action Advisory
          </div>
          <p className="mt-2 text-sm font-medium leading-relaxed text-slate-800">
            {current.cautiousAdvisory}
          </p>

          <div className="mt-3 border-t border-slate-200/60 pt-3 text-xs text-slate-600">
            <span className="font-semibold text-slate-700">Health Impact:</span>{' '}
            {current.healthImplication}
          </div>

          {/* Standard Compare Bar */}
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-200/60 pt-3 text-[11px]">
            <span className="font-semibold text-slate-500">Cross-Standard Values:</span>
            <button
              type="button"
              onClick={() => onStandardChange('CPCB')}
              className={`rounded-md px-2 py-0.5 font-medium transition ${
                activeStandard === 'CPCB'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              CPCB (India): {current.standardBreakdown.cpcb.aqi} (
              {current.standardBreakdown.cpcb.category})
            </button>
            <button
              type="button"
              onClick={() => onStandardChange('US_EPA')}
              className={`rounded-md px-2 py-0.5 font-medium transition ${
                activeStandard === 'US_EPA'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              US EPA: {current.standardBreakdown.usEpa.aqi} (
              {current.standardBreakdown.usEpa.category})
            </button>
            <button
              type="button"
              onClick={() => onStandardChange('EUROPEAN')}
              className={`rounded-md px-2 py-0.5 font-medium transition ${
                activeStandard === 'EUROPEAN'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              EAQI: {current.standardBreakdown.european.aqi} (
              {current.standardBreakdown.european.category})
            </button>
          </div>
        </div>
      </div>

      {/* Grounded Summary Footer */}
      <div className="mt-6 rounded-xl bg-emerald-50/60 border border-emerald-100 px-4 py-3 text-xs text-emerald-900">
        <span className="font-bold text-emerald-950">Atmospheric Summary: </span>
        {data.summaryText}
      </div>
    </article>
  );
}
