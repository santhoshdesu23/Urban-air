'use client';

import React, { useState } from 'react';
import { DailyPlan, UserPlannerProfile } from '@/types/planner';
import {
  CheckCircle,
  Circle,
  Clock,
  Shield,
  Leaf,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  RotateCcw,
} from 'lucide-react';

interface RoutineTimelineProps {
  plan: DailyPlan | null;
  profile: UserPlannerProfile;
  onToggleComplete: (id: string) => void;
  onToggleSkip: (id: string) => void;
  onOpenProfile: () => void;
  onRegenerate: () => void;
}

export function RoutineTimeline({
  plan,
  profile: _profile,
  onToggleComplete,
  onToggleSkip,
  onOpenProfile,
  onRegenerate,
}: RoutineTimelineProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!plan) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-500">
        <Clock className="mx-auto h-8 w-8 text-slate-300" />
        <p className="mt-2 text-sm font-semibold">Generating your personalized routine...</p>
      </div>
    );
  }

  const completedCount = plan.items.filter((i) => i.completed).length;
  const progressPercent = Math.round((completedCount / plan.items.length) * 100);

  return (
    <div className="space-y-6">
      {/* Top Banner / Controls */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
                Live Dynamic Routine
              </span>
              <span className="text-xs text-slate-500">
                Grounded in AQI: {plan.aqiAtGeneration} ({plan.aqiCategoryAtGeneration})
              </span>
            </div>
            <h2 className="mt-1 text-lg font-bold text-slate-900">
              Today&apos;s Air-Conscious Daily Schedule
            </h2>
            <p className="text-xs text-slate-600 max-w-2xl mt-1 leading-relaxed">
              {plan.overallSummary}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onOpenProfile}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-emerald-600" /> Edit Preferences
            </button>
            <button
              type="button"
              onClick={onRegenerate}
              className="flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-800 transition hover:bg-emerald-100 focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Re-sync with AQI
            </button>
          </div>
        </div>

        {/* Progress & Exposure Shield Meter */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 border-t border-slate-100 pt-4">
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700">
              <span>Daily Routine Completion</span>
              <span>
                {completedCount} of {plan.items.length} completed ({progressPercent}%)
              </span>
            </div>
            <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-teal-50/60 border border-teal-100 p-2.5">
            <div className="rounded-xl bg-teal-100 p-2 text-teal-800">
              <Shield className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-teal-800">
                Personal Exposure Shield
              </div>
              <div className="text-xs text-teal-950 font-medium">
                ~{plan.exposureHoursAvoided} hours shielded from peak particulate exposure today.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Routine Timeline Items */}
      <div className="relative space-y-4 before:absolute before:inset-0 before:left-6 before:h-full before:w-0.5 before:bg-slate-200 sm:before:left-7">
        {plan.items.map((item, _idx) => {
          const isExpanded = expandedId === item.id;

          return (
            <div
              key={item.id}
              className={`relative flex items-start gap-4 rounded-3xl border bg-white p-5 shadow-xs transition sm:gap-6 ${
                item.completed
                  ? 'border-emerald-200 bg-emerald-50/20'
                  : item.skipped
                    ? 'border-slate-200 opacity-60 bg-slate-50'
                    : 'border-slate-200/80 hover:border-slate-300'
              }`}
            >
              {/* Step Marker Button */}
              <button
                type="button"
                onClick={() => onToggleComplete(item.id)}
                className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition ${
                  item.completed
                    ? 'border-emerald-600 bg-emerald-600 text-white'
                    : 'border-slate-300 bg-white text-slate-400 hover:border-emerald-500 hover:text-emerald-500'
                }`}
                aria-label={`Mark ${item.title} as ${item.completed ? 'incomplete' : 'complete'}`}
              >
                {item.completed ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <Circle className="h-4 w-4" />
                )}
              </button>

              {/* Main Card Content */}
              <div className="w-full">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {item.phaseTitle}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">{item.timeSlot}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                      {item.estimatedCost}
                    </span>
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                      {item.difficulty}
                    </span>
                    <button
                      type="button"
                      onClick={() => onToggleSkip(item.id)}
                      className="text-[11px] font-medium text-slate-400 hover:text-slate-600 underline"
                    >
                      {item.skipped ? 'Unskip' : 'Skip'}
                    </button>
                  </div>
                </div>

                {/* Title & Action */}
                <h3 className="mt-2 text-sm font-bold text-slate-900">{item.title}</h3>
                <p className="mt-1 text-xs font-medium leading-relaxed text-slate-800">
                  {item.recommendedAction}
                </p>

                {/* Expandable Reasons & Alternatives */}
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    <strong className="text-slate-700">Reason:</strong> {item.reason}
                  </span>

                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 ml-2"
                  >
                    {isExpanded ? (
                      <>
                        Less details <ChevronUp className="h-3 w-3" />
                      </>
                    ) : (
                      <>
                        More details & alternatives <ChevronDown className="h-3 w-3" />
                      </>
                    )}
                  </button>
                </div>

                {isExpanded && (
                  <div className="mt-3 rounded-2xl bg-slate-50 p-4 border border-slate-200/60 text-xs space-y-2">
                    <div>
                      <span className="font-semibold text-slate-800">AQI Context:</span>{' '}
                      <span className="text-slate-600">{item.aqiContext}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-emerald-800">Personal Benefit:</span>{' '}
                      <span className="text-slate-600">{item.personalBenefit}</span>
                    </div>
                    {item.environmentalBenefit && (
                      <div className="flex items-start gap-1">
                        <Leaf className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-slate-800">
                            Environmental Benefit:
                          </span>{' '}
                          <span className="text-slate-600">{item.environmentalBenefit}</span>
                        </div>
                      </div>
                    )}

                    {item.alternatives.length > 0 && (
                      <div className="pt-2 border-t border-slate-200">
                        <span className="font-semibold text-slate-800">
                          Can&apos;t follow this recommendation? Try these alternatives:
                        </span>
                        <ul className="mt-1 list-disc pl-4 space-y-1 text-slate-600">
                          {item.alternatives.map((alt, i) => (
                            <li key={i}>{alt}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
