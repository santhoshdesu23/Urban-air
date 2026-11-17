'use client';

import React from 'react';
import { PollutantMeasurement, DominantPollutant } from '@/types/air-quality';

interface PollutantGridProps {
  pollutants: Record<DominantPollutant, PollutantMeasurement>;
  dominantPollutant: DominantPollutant;
}

const POLLUTANT_DESCRIPTIONS: Record<DominantPollutant, { sources: string; healthEffect: string }> =
  {
    'PM2.5': {
      sources:
        'Vehicle exhaust, biomass/stubble burning, coal power generation, industrial emissions.',
      healthEffect: 'Penetrates deeply into the alveolar region and can pass into bloodstream.',
    },
    PM10: {
      sources: 'Road dust, construction and demolition sites, windblown soil, mechanical crushing.',
      healthEffect: 'Irritates eyes, nose, throat, and exacerbates asthma and bronchitis.',
    },
    NO2: {
      sources: 'Diesel trucks, cars, buses, high-temperature industrial combustion.',
      healthEffect:
        'Inflames airway linings, increases infection vulnerability, and triggers ozone formation.',
    },
    SO2: {
      sources: 'Thermal coal power plants, oil refineries, heavy industrial boilers.',
      healthEffect: 'Causes acute bronchial constriction and participates in acid smog generation.',
    },
    CO: {
      sources: 'Incomplete combustion in motor vehicles, idling engines, unvented biomass stoves.',
      healthEffect: 'Binds with hemoglobin to reduce oxygen-carrying capacity in the bloodstream.',
    },
    O3: {
      sources:
        'Secondary photochemical pollutant formed when NOx and VOCs react in strong sunlight.',
      healthEffect:
        'Powerful oxidant that irritates lung tissue and reduces athletic lung capacity.',
    },
  };

export function PollutantGrid({ pollutants, dominantPollutant }: PollutantGridProps) {
  const pollutantKeys: DominantPollutant[] = ['PM2.5', 'PM10', 'NO2', 'SO2', 'CO', 'O3'];

  return (
    <section aria-labelledby="pollutants-heading" className="mt-8">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 id="pollutants-heading" className="text-base font-bold text-slate-900">
            Observed Pollutant Breakdown
          </h2>
          <p className="text-xs text-slate-500">
            Concentrations measured against CPCB national 24-hr and 8-hr ambient air quality
            standards.
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pollutantKeys.map((code) => {
          const item = pollutants[code];
          if (!item) return null;

          const isDominant = code === dominantPollutant;
          const ratio = Math.min(2.5, item.value / (item.safeLimit || 1));
          const isOverLimit = item.value > item.safeLimit;
          const meta = POLLUTANT_DESCRIPTIONS[code];

          return (
            <div
              key={code}
              className={`relative flex flex-col justify-between rounded-2xl border bg-white p-5 shadow-xs transition hover:shadow-sm ${
                isDominant
                  ? 'border-orange-300 ring-2 ring-orange-500/20 bg-orange-50/10'
                  : 'border-slate-200'
              }`}
            >
              {/* Card Header */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900">{code}</span>
                  {isDominant && (
                    <span className="rounded-md bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-800">
                      Dominant
                    </span>
                  )}
                </div>
                <div className="mt-0.5 text-xs text-slate-500">{item.name}</div>
              </div>

              {/* Value & Unit */}
              <div className="mt-4 flex items-baseline justify-between">
                <div>
                  <span className="text-3xl font-extrabold tracking-tight text-slate-900">
                    {item.value}
                  </span>
                  <span className="ml-1 text-xs font-semibold text-slate-500">{item.unit}</span>
                </div>

                {item.subIndex !== undefined && (
                  <div className="text-right">
                    <span className="text-xs font-medium text-slate-400">Sub-Index</span>
                    <div className="text-sm font-bold text-slate-700">{item.subIndex}</div>
                  </div>
                )}
              </div>

              {/* Ratio Bar against Safe Limit */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>
                    Safe standard: {item.safeLimit} {item.unit}
                  </span>
                  <span
                    className={`font-semibold ${
                      isOverLimit ? 'text-rose-600' : 'text-emerald-600'
                    }`}
                  >
                    {isOverLimit
                      ? `${(item.value / item.safeLimit).toFixed(1)}x Limit`
                      : 'Within limit'}
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isOverLimit ? 'bg-rose-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, (ratio / 2) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Educational Context */}
              <div className="mt-3 border-t border-slate-100 pt-2 text-[11px] text-slate-500">
                <p>
                  <strong className="text-slate-700">Source:</strong> {meta.sources}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
