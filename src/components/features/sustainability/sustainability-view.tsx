'use client';

import React, { useState } from 'react';
import { SUSTAINABLE_RECOMMENDATIONS } from '@/lib/sustainability/recommendations';
import { SustainableCategory } from '@/types/sustainability';
import {
  Car,
  Zap,
  Users,
  Info,
  CheckCircle2,
  TrendingDown,
} from 'lucide-react';

export function SustainabilityView() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | SustainableCategory>('all');

  const filtered =
    selectedFilter === 'all'
      ? SUSTAINABLE_RECOMMENDATIONS
      : SUSTAINABLE_RECOMMENDATIONS.filter((r) => r.category === selectedFilter);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
          Sustainable Alternatives & Low-Emission Routines
        </h1>
        <p className="mt-1 text-sm text-slate-600 max-w-3xl leading-relaxed">
          Connect your daily lifestyle habits with verifiable emissions avoidance. Explore practical
          alternatives across commuting, household energy, and community stewardship.
        </p>
      </div>

      {/* Honest Scientific Disclaimer */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-700 flex items-start gap-3">
        <Info className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-900">Atmospheric Impact Realism: </strong>
          Individual behavioral changes avoid personal exposure and reduce your household’s carbon
          footprint. However, a single person’s lifestyle change will not immediately lower an
          entire metropolitan city’s ambient AQI. Durable ambient clean air requires mass community
          participation and systemic industrial enforcement.
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSelectedFilter('all')}
          className={`rounded-2xl border px-4 py-2 text-xs font-bold transition ${
            selectedFilter === 'all'
              ? 'border-emerald-600 bg-emerald-600 text-white shadow-xs'
              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
          }`}
        >
          All Categories ({SUSTAINABLE_RECOMMENDATIONS.length})
        </button>

        <button
          type="button"
          onClick={() => setSelectedFilter('transport')}
          className={`flex items-center gap-1.5 rounded-2xl border px-4 py-2 text-xs font-bold transition ${
            selectedFilter === 'transport'
              ? 'border-emerald-600 bg-emerald-600 text-white shadow-xs'
              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Car className="h-3.5 w-3.5" /> Clean Transportation
        </button>

        <button
          type="button"
          onClick={() => setSelectedFilter('energy')}
          className={`flex items-center gap-1.5 rounded-2xl border px-4 py-2 text-xs font-bold transition ${
            selectedFilter === 'energy'
              ? 'border-emerald-600 bg-emerald-600 text-white shadow-xs'
              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Zap className="h-3.5 w-3.5" /> Household Energy & Cooking
        </button>

        <button
          type="button"
          onClick={() => setSelectedFilter('community')}
          className={`flex items-center gap-1.5 rounded-2xl border px-4 py-2 text-xs font-bold transition ${
            selectedFilter === 'community'
              ? 'border-emerald-600 bg-emerald-600 text-white shadow-xs'
              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Users className="h-3.5 w-3.5" /> Community & Anti-Burning
        </button>
      </div>

      {/* Recommendation Cards Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {filtered.map((item) => (
          <article
            key={item.id}
            className="flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs transition hover:shadow-sm"
          >
            <div>
              {/* Header Badge */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-lg">
                  {item.category === 'transport' && <Car className="h-3 w-3" />}
                  {item.category === 'energy' && <Zap className="h-3 w-3" />}
                  {item.category === 'community' && <Users className="h-3 w-3" />}
                  {item.category}
                </span>

                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                  Difficulty: {item.difficulty}
                </span>
              </div>

              {/* Title & Action */}
              <h2 className="mt-3 text-base font-bold text-slate-900">{item.title}</h2>
              <p className="mt-1 text-xs font-medium leading-relaxed text-slate-700">
                {item.actionSummary}
              </p>

              {/* Why it Matters & User Benefit */}
              <div className="mt-4 space-y-2 rounded-2xl bg-slate-50 p-3.5 border border-slate-200/60 text-xs">
                <div>
                  <strong className="text-slate-800">Why it matters: </strong>
                  <span className="text-slate-600">{item.whyItMatters}</span>
                </div>
                <div>
                  <strong className="text-emerald-800">Your direct benefit: </strong>
                  <span className="text-slate-600">{item.personalBenefit}</span>
                </div>
              </div>

              {/* Verified Environmental Impact */}
              <div className="mt-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 p-3.5 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                  <TrendingDown className="h-4 w-4 text-emerald-700" />
                  Estimated Environmental Avoidance:
                </div>
                <div className="mt-1 font-bold text-slate-900">
                  {item.environmentalImpact.estimatedSaving}
                </div>
                <div className="mt-0.5 text-[11px] text-slate-500">
                  Basis: {item.environmentalImpact.factorBasis}
                </div>
              </div>

              {/* Practical Steps */}
              <div className="mt-4">
                <span className="text-xs font-bold text-slate-800">Practical Action Steps:</span>
                <ul className="mt-2 space-y-1.5 text-xs text-slate-600">
                  {item.practicalSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Assumptions & Limitations Footer */}
            <div className="mt-5 border-t border-slate-100 pt-3 text-[11px] text-slate-400">
              <strong className="text-slate-600">Assumptions & Caveats:</strong>{' '}
              {item.limitationsAndAssumptions}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
