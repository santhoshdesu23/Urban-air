'use client';

import React, { useState, useEffect } from 'react';
import {
  BUDGET_SOLUTIONS,
  INDOOR_GUIDE_ITEMS,
  INITIAL_INDOOR_CHECKLIST,
} from '@/lib/indoor-air/guide-data';
import { IndoorBudgetTier, IndoorChecklistItem } from '@/types/indoor';
import {
  ShieldAlert,
  CheckCircle2,
  Circle,
  Wind,
  Fan,
  Flame,
  Sparkles,
  Check,
  X,
} from 'lucide-react';

const CHECKLIST_STORAGE_KEY = 'breathewise_indoor_checklist';

export function IndoorView() {
  const [selectedCategory, setSelectedCategory] = useState<
    'filtration' | 'ventilation' | 'sources' | 'maintenance'
  >('filtration');

  const [checklist, setChecklist] = useState<IndoorChecklistItem[]>(INITIAL_INDOOR_CHECKLIST);

  // Load saved checklist from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CHECKLIST_STORAGE_KEY);
      if (saved) {
        setChecklist(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed to load indoor checklist:', e);
    }
  }, []);

  const toggleChecklistItem = (id: string) => {
    const updated = checklist.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setChecklist(updated);
    try {
      localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save checklist:', e);
    }
  };

  const completedCount = checklist.filter((i) => i.completed).length;
  const progressPercent = Math.round((completedCount / checklist.length) * 100);

  const activeGuide = INDOOR_GUIDE_ITEMS.find((g) => g.category === selectedCategory);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
          Indoor Air Quality Intelligence
        </h1>
        <p className="mt-1 text-sm text-slate-600 max-w-3xl leading-relaxed">
          During severe winter smog, indoor particulate concentrations can equal or exceed outdoor
          levels. Learn how to transform your home into a clean air sanctuary using scientifically
          proven filtration, smart ventilation, and source elimination.
        </p>
      </div>

      {/* Safety Alert: Critical Scientific Caveats */}
      <div className="rounded-3xl border border-rose-200 bg-rose-50/70 p-6 shadow-xs">
        <div className="flex items-center gap-2 text-sm font-bold text-rose-900">
          <ShieldAlert className="h-5 w-5 text-rose-600" />
          Critical Indoor Air Safety Rules (Scientifically Disproven Myths)
        </div>
        <div className="mt-3 grid grid-cols-1 gap-3 text-xs text-rose-950 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-rose-200/80 bg-white/80 p-3">
            <strong className="text-rose-900 block font-bold">🚫 Ozone Generators</strong>
            Never use ozone generators or unverified ionizers. Ozone is a toxic pulmonary irritant
            that scars lung alveoli.
          </div>
          <div className="rounded-xl border border-rose-200/80 bg-white/80 p-3">
            <strong className="text-rose-900 block font-bold">🚫 Houseplants Myth</strong>
            Potted plants do NOT replace True HEPA filters. NASA chamber tests do not translate to
            real-world particle removal.
          </div>
          <div className="rounded-xl border border-rose-200/80 bg-white/80 p-3">
            <strong className="text-rose-900 block font-bold">🚫 Salt Lamps & Incense</strong>
            Himalayan salt lamps have zero particulate filtering capability. Scented candles and
            incense emit hazardous hydrocarbons.
          </div>
          <div className="rounded-xl border border-rose-200/80 bg-white/80 p-3">
            <strong className="text-rose-900 block font-bold">🚫 Blind Ventilation</strong>
            Never leave windows wide open during early morning winter inversion hours when outside
            soot is most concentrated.
          </div>
        </div>
      </div>

      {/* Interactive Indoor Checklist */}
      <section
        aria-labelledby="checklist-heading"
        className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 id="checklist-heading" className="text-lg font-bold text-slate-900">
              Interactive Indoor Protection Checklist
            </h2>
            <p className="text-xs text-slate-500">
              Check off daily actions to safeguard your family&apos;s indoor breathing zone.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-700">
              {completedCount} / {checklist.length} Completed ({progressPercent}%)
            </span>
            <div className="h-2 w-28 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {checklist.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleChecklistItem(item.id)}
              className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition ${
                item.completed
                  ? 'border-emerald-200 bg-emerald-50/40 text-slate-800'
                  : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800'
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {item.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                ) : (
                  <Circle className="h-5 w-5 text-slate-300" />
                )}
              </div>
              <div className="w-full">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-500 uppercase tracking-wider">
                    {item.timingHint}
                  </span>
                  <span
                    className={`rounded px-1.5 py-0.2 text-[10px] font-semibold ${
                      item.importance === 'Essential'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {item.importance}
                  </span>
                </div>
                <div
                  className={`mt-1 text-xs font-semibold ${item.completed ? 'line-through text-slate-500' : 'text-slate-900'}`}
                >
                  {item.label}
                </div>
                <p className="mt-1 text-[11px] text-slate-500">{item.scientificTip}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 4 Interactive Guide Modules */}
      <section aria-labelledby="guide-heading" className="space-y-6">
        <div>
          <h2 id="guide-heading" className="text-lg font-bold text-slate-900">
            Comprehensive Indoor Air Guide
          </h2>
          <p className="text-xs text-slate-500">
            Explore peer-reviewed scientific protocols across four critical household air
            dimensions.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {(
            [
              { id: 'filtration', label: '1. Air Filtration & HEPA', icon: Wind },
              { id: 'ventilation', label: '2. Smart Ventilation', icon: Fan },
              { id: 'sources', label: '3. Household Emitters', icon: Flame },
              { id: 'maintenance', label: '4. Cleaning & Maintenance', icon: Sparkles },
            ] as const
          ).map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-xs font-bold transition ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-600 text-white shadow-sm'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Active Guide Card */}
        {activeGuide && (
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">{activeGuide.title}</h3>
                <p className="text-xs text-slate-500">{activeGuide.shortDescription}</p>
              </div>
              <span className="rounded-xl bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                Tier: {activeGuide.budgetTier}
              </span>
            </div>

            {/* Guide Step Points */}
            <div className="mt-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Actionable Protocols
              </h4>
              <ul className="space-y-2 text-xs text-slate-700">
                {activeGuide.detailedGuide.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2 leading-relaxed">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-bold text-emerald-800">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Scientific Basis & Limitations */}
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 rounded-2xl bg-slate-50 p-4 border border-slate-200/60">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                  Scientific Basis
                </span>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  {activeGuide.scientificBasis}
                </p>
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                  Scientific Limitations
                </span>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  {activeGuide.limitationsAndCaveats}
                </p>
              </div>
            </div>

            {/* Dos and Don'ts */}
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-emerald-200/70 bg-emerald-50/30 p-4">
                <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-emerald-600" /> Recommended Best Practices
                </span>
                <ul className="mt-2 space-y-1.5 text-xs text-emerald-950">
                  {activeGuide.dos.map((d, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-rose-200/70 bg-rose-50/30 p-4">
                <span className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                  <X className="h-4 w-4 text-rose-600" /> Actions to Strictly Avoid
                </span>
                <ul className="mt-2 space-y-1.5 text-xs text-rose-950">
                  {activeGuide.donts.map((d, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-rose-600 font-bold">•</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Budget-Tier Solutions Overview */}
      <section aria-labelledby="budget-solutions-heading">
        <div>
          <h2 id="budget-solutions-heading" className="text-lg font-bold text-slate-900">
            Solutions by Budget Tier
          </h2>
          <p className="text-xs text-slate-500">
            Meaningful air quality interventions calibrated to free, low-cost, and moderate budgets.
          </p>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {(['Free', 'Low Budget', 'Moderate Budget'] as IndoorBudgetTier[]).map((tier) => {
            const data = BUDGET_SOLUTIONS[tier];

            return (
              <div
                key={tier}
                className="flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="text-sm font-bold text-slate-900">{tier}</span>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                      {data.costRange}
                    </span>
                  </div>

                  <h3 className="mt-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                    {data.title}
                  </h3>

                  <ul className="mt-3 space-y-2 text-xs text-slate-700">
                    {data.items.map((it, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 border-t border-slate-100 pt-3 text-[11px] text-slate-500">
                  <strong className="text-slate-700">Realistic Limitations:</strong>{' '}
                  {data.limitations}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
