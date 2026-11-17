'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context/app-context';
import { RoutineTimeline } from '@/components/features/planner/routine-timeline';
import { ProfileModal } from '@/components/features/planner/profile-modal';
import { SlidersHorizontal } from 'lucide-react';

export default function PlannerPage() {
  const { dailyPlan, profile, toggleRoutineComplete, toggleRoutineSkip, regeneratePlan } = useApp();

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Personalized AI Daily Routine Planner
            </h1>
            <p className="mt-1 text-sm text-slate-600 max-w-3xl leading-relaxed">
              Dynamically adapted to today&apos;s ambient air quality, diurnal smog temperature
              inversions, your daily work commute, and household vulnerability.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsProfileModalOpen(true)}
            className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition"
          >
            <SlidersHorizontal className="h-4 w-4" /> Edit Profile & Schedule
          </button>
        </div>
      </div>

      {/* Routine Timeline */}
      <RoutineTimeline
        plan={dailyPlan}
        profile={profile}
        onToggleComplete={toggleRoutineComplete}
        onToggleSkip={toggleRoutineSkip}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onRegenerate={regeneratePlan}
      />

      {isProfileModalOpen && <ProfileModal onClose={() => setIsProfileModalOpen(false)} />}
    </div>
  );
}
