'use client';

import React, { useState } from 'react';
import {
  calculateAvoidedEmissions,
  getPersonalExposureExplanation,
} from '@/lib/impact/calculator';
import { TransportImpactCalculationInput } from '@/types/impact';
import { useApp } from '@/lib/context/app-context';
import {
  Calculator,
  ShieldCheck,
  TrendingDown,
  BarChart3,
  Calendar,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function ImpactView() {
  const { airQuality, dailyPlan } = useApp();

  const [calcInput, setCalcInput] = useState<TransportImpactCalculationInput>({
    baselineMode: 'petrol_car',
    alternativeMode: 'metro',
    distanceKm: 15,
    tripsCount: 10, // e.g. 5 days round-trip
  });

  const calculationResult = calculateAvoidedEmissions(calcInput);
  const exposureHours = dailyPlan?.exposureHoursAvoided || 2.5;
  const currentAqi = airQuality?.current.aqi || 150;
  const exposureMeta = getPersonalExposureExplanation(exposureHours, currentAqi);

  // Mock weekly history grounded in routine completion
  const weeklyData = [
    { day: 'Mon', co2e: 2.8, exposure: 3.0 },
    { day: 'Tue', co2e: 3.2, exposure: 3.5 },
    { day: 'Wed', co2e: 2.4, exposure: 2.0 },
    { day: 'Thu', co2e: 3.6, exposure: 4.0 },
    { day: 'Fri', co2e: 3.0, exposure: 2.5 },
    { day: 'Sat', co2e: 1.5, exposure: 1.5 },
    { day: 'Sun', co2e: 1.2, exposure: 1.0 },
  ];

  const totalWeeklyCo2 = weeklyData.reduce((acc, curr) => acc + curr.co2e, 0);
  const totalWeeklyExposure = weeklyData.reduce((acc, curr) => acc + curr.exposure, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
          Direct Impact & Measurement Tracker
        </h1>
        <p className="mt-1 text-sm text-slate-600 max-w-3xl leading-relaxed">
          Transparent, verifiable calculations separating personal exposure mitigation, avoided
          vehicular emissions, and indoor air enhancements.
        </p>
      </div>

      {/* 3 High-Level KPI Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Exposure Avoided */}
        <div className="rounded-3xl border border-teal-200/80 bg-teal-50/40 p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
              Personal Exposure Shield
            </span>
            <ShieldCheck className="h-5 w-5 text-teal-600" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-black text-slate-900">{exposureHours}</span>
            <span className="text-sm font-semibold text-slate-500">hours today</span>
          </div>
          <p className="mt-2 text-xs text-slate-600 leading-snug">{exposureMeta.explanation}</p>
        </div>

        {/* Emissions Avoided */}
        <div className="rounded-3xl border border-emerald-200/80 bg-emerald-50/40 p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Estimated CO₂e Avoided
            </span>
            <TrendingDown className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-black text-slate-900">
              {calculationResult.avoidedKgCO2e}
            </span>
            <span className="text-sm font-semibold text-slate-500">kg CO₂e</span>
          </div>
          <p className="mt-2 text-xs text-slate-600 leading-snug">
            Across {calculationResult.distanceKmTotal} km traveled via cleaner transit alternatives.
          </p>
        </div>

        {/* Weekly Cumulative */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              7-Day Cumulative
            </span>
            <Calendar className="h-5 w-5 text-slate-400" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-black text-slate-900">{totalWeeklyCo2.toFixed(1)}</span>
            <span className="text-sm font-semibold text-slate-500">kg CO₂e saved</span>
          </div>
          <p className="mt-2 text-xs text-slate-600 leading-snug">
            Plus {totalWeeklyExposure.toFixed(1)} hours of peak smog avoidance recorded this week.
          </p>
        </div>
      </div>

      {/* Transparent Avoided Emissions Engine */}
      <section
        aria-labelledby="calculator-heading"
        className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
          <div className="rounded-xl bg-emerald-100 p-2 text-emerald-800">
            <Calculator className="h-5 w-5" />
          </div>
          <div>
            <h2 id="calculator-heading" className="text-lg font-bold text-slate-900">
              Transparent Avoided Emissions Engine
            </h2>
            <p className="text-xs text-slate-500">
              Compute precise tailpipe emissions avoided with fully disclosed mathematical formulas
              and government citations.
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700">
                Baseline Commute Mode (Replaced)
              </label>
              <select
                value={calcInput.baselineMode}
                onChange={(e) =>
                  setCalcInput({
                    ...calcInput,
                    baselineMode: e.target.value as TransportImpactCalculationInput['baselineMode'],
                  })
                }
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900"
              >
                <option value="petrol_car">Petrol Passenger Car (0.170 kg CO2e/km)</option>
                <option value="diesel_car">Diesel Passenger Car (0.165 kg CO2e/km)</option>
                <option value="two_wheeler">Solo Two-Wheeler 125cc (0.045 kg CO2e/km)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700">
                Cleaner Alternative Chosen
              </label>
              <select
                value={calcInput.alternativeMode}
                onChange={(e) =>
                  setCalcInput({
                    ...calcInput,
                    alternativeMode: e.target.value as TransportImpactCalculationInput['alternativeMode'],
                  })
                }
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900"
              >
                <option value="metro">Electric Metro Rail (0.018 kg CO2e/pkm)</option>
                <option value="bus">Public City Bus (0.035 kg CO2e/pkm)</option>
                <option value="carpool_2p">2-Person Carpooling (0.085 kg CO2e/km)</option>
                <option value="bicycle">Bicycle (0.000 kg CO2e/km)</option>
                <option value="walking">Walking (0.000 kg CO2e/km)</option>
                <option value="wfh">Work / Study from Home (0.000 kg CO2e/km)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700">Trip Distance</label>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="150"
                    value={calcInput.distanceKm}
                    onChange={(e) =>
                      setCalcInput({
                        ...calcInput,
                        distanceKm: Math.max(1, parseFloat(e.target.value) || 1),
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900"
                  />
                  <span className="text-xs text-slate-500 font-semibold">km</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Number of Trips</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={calcInput.tripsCount}
                  onChange={(e) =>
                    setCalcInput({
                      ...calcInput,
                      tripsCount: Math.max(1, parseInt(e.target.value) || 1),
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Results & Math Breakdown Column */}
          <div className="lg:col-span-7 flex flex-col justify-between rounded-2xl bg-slate-50 p-6 border border-slate-200/60">
            <div>
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Emissions Avoidance Output
                </span>
                <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-black text-emerald-800">
                  {calculationResult.avoidedKgCO2e} kg CO₂e Avoided
                </span>
              </div>

              {/* Comparison Bar */}
              <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
                <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-3">
                  <span className="text-slate-500">Baseline Carbon:</span>
                  <div className="text-lg font-bold text-rose-800">
                    {calculationResult.baselineEmissionsKg} kg CO₂e
                  </div>
                </div>

                <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3">
                  <span className="text-slate-500">Clean Alternative:</span>
                  <div className="text-lg font-bold text-emerald-800">
                    {calculationResult.alternativeEmissionsKg} kg CO₂e
                  </div>
                </div>
              </div>

              {/* Mathematical Formula */}
              <div className="mt-4 rounded-xl bg-white p-3 border border-slate-200 text-xs">
                <span className="font-bold text-slate-700 block">Calculation Formula:</span>
                <code className="text-[11px] text-emerald-800 break-all">
                  {calculationResult.formula}
                </code>
              </div>
            </div>

            {/* Documented Assumptions & Citation */}
            <div className="mt-4 space-y-1 text-[11px] text-slate-500 border-t border-slate-200 pt-3">
              <div>
                <strong className="text-slate-700">Official Data Source:</strong>{' '}
                {calculationResult.sourceCitation}
              </div>
              <div>
                <strong className="text-slate-700">Assumptions:</strong>{' '}
                {calculationResult.assumptions[0]}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Weekly Progress Bar Chart */}
      <section
        aria-labelledby="history-heading"
        className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2
              id="history-heading"
              className="text-base font-bold text-slate-900 flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4 text-emerald-600" />
              Weekly Progress & Savings History
            </h2>
            <p className="text-xs text-slate-500">
              Estimated emissions avoided day-by-day based on completed cleaner commute routines.
            </p>
          </div>
        </div>

        <div className="mt-6 h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="co2e" name="CO2e Avoided (kg)" fill="#10b981" radius={[6, 6, 0, 0]} />
              <Bar
                dataKey="exposure"
                name="Exposure Shield (hrs)"
                fill="#0d9488"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
