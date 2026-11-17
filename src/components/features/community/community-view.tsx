'use client';

import React, { useState, useEffect } from 'react';
import { COMMUNITY_ACTION_GUIDES, COMMUNITY_CHALLENGES } from '@/lib/community/challenges';
import { CommunityChallenge } from '@/types/community';
import { CheckCircle, Circle, Printer, Share2, Info } from 'lucide-react';

const COMMUNITY_STORAGE_KEY = 'breathewise_community_challenges';

export function CommunityView() {
  const [challenges, setChallenges] = useState<CommunityChallenge[]>(COMMUNITY_CHALLENGES);
  const [selectedChallengeId, setSelectedChallengeId] = useState<string>(
    COMMUNITY_CHALLENGES[0].id
  );
  const [copiedNotice, setCopiedNotice] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(COMMUNITY_STORAGE_KEY);
      if (saved) {
        setChallenges(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed to load community challenges:', e);
    }
  }, []);

  const toggleChallengeStep = (challengeId: string, dayNumber: number) => {
    const updated = challenges.map((ch) => {
      if (ch.id !== challengeId) return ch;
      return {
        ...ch,
        steps: ch.steps.map((st) =>
          st.dayNumber === dayNumber ? { ...st, completed: !st.completed } : st
        ),
      };
    });
    setChallenges(updated);
    try {
      localStorage.setItem(COMMUNITY_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save community challenges:', e);
    }
  };

  const activeChallenge = challenges.find((c) => c.id === selectedChallengeId) || challenges[0];

  const completedSteps = activeChallenge.steps.filter((s) => s.completed).length;
  const progressPercent = Math.round((completedSteps / activeChallenge.steps.length) * 100);

  const handleCopyPlan = () => {
    const planText = `BreatheWise Community Clean Air Action Plan\nChallenge: ${activeChallenge.title}\nGoal: ${activeChallenge.goal}\n\nDaily Steps:\n${activeChallenge.steps
      .map((s) => `Day ${s.dayNumber}: ${s.title} - ${s.description}`)
      .join('\n')}\n\nGenerated via BreatheWise Urban Air Assistant.`;

    navigator.clipboard.writeText(planText);
    setCopiedNotice(true);
    setTimeout(() => setCopiedNotice(false), 3000);
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
          Community Action Center
        </h1>
        <p className="mt-1 text-sm text-slate-600 max-w-3xl leading-relaxed">
          Clean air is a public collective good. Mobilize your family, apartment complex, school, or
          workplace with guided multi-day challenges and official municipal reporting protocols.
        </p>
      </div>

      {/* Honest Local Demonstration Notice */}
      <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-4 text-xs text-blue-900 flex items-start gap-3">
        <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <strong className="text-blue-950 font-bold">Local-Only Tracking Transparency: </strong>
          Your challenge steps and progress are stored entirely in your local browser storage.
          BreatheWise never displays fake online community member counts or fabricated user numbers.
        </div>
      </div>

      {/* Challenge Selector Pills */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {challenges.map((c) => {
          const isSelected = c.id === selectedChallengeId;
          const finished = c.steps.filter((s) => s.completed).length;

          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedChallengeId(c.id)}
              className={`flex flex-col justify-between rounded-3xl border p-5 text-left transition ${
                isSelected
                  ? 'border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div>
                <span className="text-lg">{c.badge.slice(0, 2)}</span>
                <h3 className="mt-2 text-xs font-bold text-slate-900">{c.title}</h3>
                <p className="mt-1 text-[11px] text-slate-500 line-clamp-2">{c.goal}</p>
              </div>

              <div className="mt-4 flex items-center justify-between text-[11px] font-semibold text-slate-600 border-t border-slate-100 pt-2">
                <span>
                  {finished}/{c.steps.length} Steps
                </span>
                <span className="text-emerald-700 font-bold">
                  {Math.round((finished / c.steps.length) * 100)}%
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Challenge Progress Card */}
      <section
        aria-labelledby="challenge-detail-heading"
        className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">{activeChallenge.badge.slice(0, 2)}</span>
              <h2 id="challenge-detail-heading" className="text-lg font-bold text-slate-900">
                {activeChallenge.title}
              </h2>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                {progressPercent}% Complete
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-600 max-w-2xl leading-relaxed">
              {activeChallenge.goal}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleCopyPlan}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
            >
              <Share2 className="h-3.5 w-3.5 text-emerald-600" />
              {copiedNotice ? 'Plan Copied!' : 'Copy Action Plan'}
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
            >
              <Printer className="h-3.5 w-3.5 text-slate-600" /> Print
            </button>
          </div>
        </div>

        {/* Collective vs Personal Impact */}
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 rounded-2xl bg-slate-50 p-4 border border-slate-200/60 text-xs">
          <div>
            <strong className="text-emerald-900 font-bold block">
              Your Personal Contribution:
            </strong>
            <p className="mt-1 text-slate-600 leading-relaxed">
              {activeChallenge.personalContribution}
            </p>
          </div>
          <div>
            <strong className="text-slate-900 font-bold block">
              Collective Community Multiplier:
            </strong>
            <p className="mt-1 text-slate-600 leading-relaxed">
              {activeChallenge.collectiveImpactExplanation}
            </p>
          </div>
        </div>

        {/* Steps Checklist */}
        <div className="mt-6 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Day-By-Day Guided Steps
          </h3>
          <div className="space-y-2">
            {activeChallenge.steps.map((step) => (
              <button
                key={step.dayNumber}
                type="button"
                onClick={() => toggleChallengeStep(activeChallenge.id, step.dayNumber)}
                className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition ${
                  step.completed
                    ? 'border-emerald-200 bg-emerald-50/40 text-slate-800'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800'
                }`}
              >
                <div className="shrink-0 mt-0.5">
                  {step.completed ? (
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                  ) : (
                    <Circle className="h-5 w-5 text-slate-300" />
                  )}
                </div>
                <div className="w-full">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-emerald-800">
                      Day {step.dayNumber}: {step.title}
                    </span>
                    <span className="text-slate-400">
                      {step.completed ? 'Completed' : 'Tap to mark complete'}
                    </span>
                  </div>
                  <div
                    className={`mt-1 text-xs ${step.completed ? 'line-through text-slate-500' : 'text-slate-800'}`}
                  >
                    {step.description}
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500">
                    <strong className="text-slate-700">Tip:</strong> {step.actionableTip}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Official Reporting & Institutional Action Guides */}
      <section aria-labelledby="institutional-guides-heading" className="space-y-4">
        <div>
          <h2 id="institutional-guides-heading" className="text-lg font-bold text-slate-900">
            Official Guidelines & Helplines
          </h2>
          <p className="text-xs text-slate-500">
            How to file complaints against open waste burning and implement institutional clean air
            policies.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {COMMUNITY_ACTION_GUIDES.map((guide) => (
            <div
              key={guide.id}
              className="flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs"
            >
              <div>
                <h3 className="text-sm font-bold text-slate-900">{guide.title}</h3>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">{guide.summary}</p>

                <div className="mt-4 space-y-1.5 text-xs text-slate-700">
                  <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider">
                    Execution Steps:
                  </span>
                  {guide.steps.map((st, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{st}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 border-t border-slate-100 pt-3 text-[11px] text-slate-500">
                {guide.officialChannelIndia && (
                  <div className="font-medium text-emerald-800">
                    🇮🇳 Official Portal: {guide.officialChannelIndia}
                  </div>
                )}
                <div className="mt-1 text-slate-400">{guide.cautionNotice}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
