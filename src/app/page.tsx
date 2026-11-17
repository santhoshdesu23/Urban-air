'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context/app-context';
import { AqiCard } from '@/components/features/air-quality/aqi-card';
import { PollutantGrid } from '@/components/features/air-quality/pollutant-grid';
import { HourlyChart } from '@/components/features/air-quality/hourly-chart';
import { DailyOutlook } from '@/components/features/air-quality/daily-outlook';
import { RoutineTimeline } from '@/components/features/planner/routine-timeline';
import { ProfileModal } from '@/components/features/planner/profile-modal';
import {
  Sparkles,
  ArrowRight,
  Home,
  TrendingDown,
  Loader2,
  AlertCircle,
} from 'lucide-react';

export default function DashboardPage() {
  const {
    airQuality,
    isLoadingAqi,
    aqiError,
    activeStandard,
    setActiveStandard,
    dailyPlan,
    profile,
    toggleRoutineComplete,
    toggleRoutineSkip,
    regeneratePlan,
  } = useApp();

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  if (isLoadingAqi && !airQuality) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
        <h2 className="mt-4 text-base font-bold text-slate-800">
          Retrieving Copernicus Atmospheric Data...
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Calculating CPCB and international pollutant sub-indices for your location.
        </p>
      </div>
    );
  }

  if (aqiError && !airQuality) {
    return (
      <div className="rounded-3xl border border-rose-200 bg-rose-50/80 p-8 text-center">
        <AlertCircle className="mx-auto h-8 w-8 text-rose-600" />
        <h2 className="mt-2 text-base font-bold text-rose-900">
          Unable to Retrieve Live Air Quality Data
        </h2>
        <p className="mt-1 text-xs text-rose-700">{aqiError}</p>
        <p className="mt-3 text-xs text-slate-600">
          Please check your network connection or choose another city from the location selector.
        </p>
      </div>
    );
  }

  if (!airQuality) return null;

  return (
    <div className="space-y-10">
      {/* 1. Main AQI Overview (Module A) */}
      <AqiCard
        data={airQuality}
        activeStandard={activeStandard}
        onStandardChange={setActiveStandard}
      />

      {/* 2. Pollutant Breakdown Grid */}
      <PollutantGrid
        pollutants={airQuality.current.pollutants}
        dominantPollutant={airQuality.current.dominantPollutant}
      />

      {/* 3. Hourly Forecast & Risk Trend */}
      <HourlyChart
        hourly={airQuality.forecast.hourly}
        bestWindow={airQuality.forecast.bestOutdoorWindow}
        highestRisk={airQuality.forecast.highestRiskPeriod}
      />

      {/* 4. 5-Day Outlook */}
      <DailyOutlook daily={airQuality.forecast.daily} />

      {/* 5. Personalized Daily Routine Teaser (Module B) */}
      <section aria-labelledby="daily-routine-teaser-heading" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 id="daily-routine-teaser-heading" className="text-lg font-bold text-slate-900">
              Personalized Air-Conscious Routine
            </h2>
            <p className="text-xs text-slate-500">
              Tailored for your {profile.lifestyle.replace('_', ' ')} lifestyle and{' '}
              {profile.transport.replace('_', ' ')} commute.
            </p>
          </div>
          <Link
            href="/planner"
            className="flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
          >
            Full Planner <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <RoutineTimeline
          plan={dailyPlan}
          profile={profile}
          onToggleComplete={toggleRoutineComplete}
          onToggleSkip={toggleRoutineSkip}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          onRegenerate={regeneratePlan}
        />
      </section>

      {/* 6. Quick Cross-Module Action Cards (Indoor, Impact, AI Assistant) */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Indoor Air Intelligence Card */}
        <Link
          href="/indoor-air"
          className="group flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs transition hover:border-emerald-500 hover:shadow-sm"
        >
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 group-hover:bg-teal-600 group-hover:text-white transition">
              <Home className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition">
              Indoor Air Sanctuary
            </h3>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              Interactive HEPA filtration sizing, smart ventilation flushes, and zero-cost habits to
              keep indoor air clean.
            </p>
          </div>
          <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-teal-700">
            Open Indoor Guide{' '}
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition" />
          </span>
        </Link>

        {/* Avoided Emissions & Impact */}
        <Link
          href="/impact"
          className="group flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs transition hover:border-emerald-500 hover:shadow-sm"
        >
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition">
              <TrendingDown className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition">
              Direct Impact Engine
            </h3>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              Calculate kilograms of CO₂e avoided from cleaner transit with transparent mathematical
              formulas and DEFRA factors.
            </p>
          </div>
          <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
            View Impact Engine{' '}
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition" />
          </span>
        </Link>

        {/* GenAI Assistant Entry Point */}
        <Link
          href="/assistant"
          className="group flex flex-col justify-between rounded-3xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 p-6 shadow-xs transition hover:border-emerald-500 hover:shadow-sm"
        >
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-xs">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition">
              GenAI Environmental Advisor
            </h3>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              Ask questions on running safely, opening windows, and protecting vulnerable children
              during severe winter smog.
            </p>
          </div>
          <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
            Chat with Advisor{' '}
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition" />
          </span>
        </Link>
      </div>

      {/* Profile Modal */}
      {isProfileModalOpen && <ProfileModal onClose={() => setIsProfileModalOpen(false)} />}
    </div>
  );
}
