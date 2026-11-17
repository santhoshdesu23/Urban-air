'use client';

import React, { useState } from 'react';
import { X, Sliders, Check, User, Home, DollarSign } from 'lucide-react';
import { useApp } from '@/lib/context/app-context';
import { LifestyleType, TransportMode, UserPlannerProfile } from '@/types/planner';

export function ProfileModal({ onClose }: { onClose: () => void }) {
  const { profile, updateProfile, regeneratePlan } = useApp();
  const [formData, setFormData] = useState<UserPlannerProfile>({ ...profile });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    regeneratePlan();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-modal-title"
    >
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus-visible:ring-2 focus-visible:ring-emerald-500"
          aria-label="Close Profile Editor"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-emerald-100 p-2 text-emerald-800">
            <Sliders className="h-5 w-5" />
          </div>
          <div>
            <h2 id="profile-modal-title" className="text-lg font-bold text-slate-900">
              Personalize Your Routine Planner
            </h2>
            <p className="text-xs text-slate-500">
              Tailor schedules to your real commute, household members, and home facilities.
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="mt-6 space-y-6">
          {/* Section 1: Lifestyle & Transport */}
          <div className="rounded-2xl border border-slate-200/80 p-4 bg-slate-50/50">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-emerald-600" /> Lifestyle & Daily Commute
            </span>

            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700">Lifestyle</label>
                <select
                  value={formData.lifestyle}
                  onChange={(e) =>
                    setFormData({ ...formData, lifestyle: e.target.value as LifestyleType })
                  }
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="working_professional">Working Professional</option>
                  <option value="student">Student / Academic</option>
                  <option value="work_from_home">Work From Home (Remote)</option>
                  <option value="homemaker">Homemaker</option>
                  <option value="senior">Senior Citizen</option>
                  <option value="other">Other / Freelance</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Primary Transport
                </label>
                <select
                  value={formData.transport}
                  onChange={(e) =>
                    setFormData({ ...formData, transport: e.target.value as TransportMode })
                  }
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="public_transit">Public Transit (Metro / Bus)</option>
                  <option value="two_wheeler">Two-Wheeler (Motorcycle / Scooter)</option>
                  <option value="car">Private Car (Solo)</option>
                  <option value="carpool">Carpool / Shared Cab</option>
                  <option value="walking">Walking</option>
                  <option value="bicycle">Bicycle</option>
                  <option value="wfh">No Daily Commute (Remote)</option>
                </select>
              </div>
            </div>

            {/* Routine hours */}
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700">Wake-Up</label>
                <input
                  type="time"
                  value={formData.wakeUpTime}
                  onChange={(e) => setFormData({ ...formData, wakeUpTime: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Work/Study Start
                </label>
                <input
                  type="time"
                  value={formData.workHoursStart}
                  onChange={(e) => setFormData({ ...formData, workHoursStart: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700">Return Time</label>
                <input
                  type="time"
                  value={formData.workHoursEnd}
                  onChange={(e) => setFormData({ ...formData, workHoursEnd: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700">Commute (mins)</label>
                <input
                  type="number"
                  min="0"
                  max="180"
                  value={formData.typicalCommuteMinutes}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      typicalCommuteMinutes: parseInt(e.target.value) || 0,
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900"
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-xs font-semibold text-slate-700">
                Exercise Preference
              </label>
              <select
                value={formData.exercisePreference}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    exercisePreference: e.target.value as UserPlannerProfile['exercisePreference'],
                  })
                }
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900"
              >
                <option value="morning_outdoor">
                  Early Morning Outdoor (Jogging / Walking / Cycling)
                </option>
                <option value="morning_indoor">Morning Indoor (Yoga / Gym)</option>
                <option value="evening_outdoor">Evening Outdoor Sports</option>
                <option value="evening_indoor">Evening Indoor Workout</option>
                <option value="none">Gentle Walking / Low Physical Exertion</option>
              </select>
            </div>
          </div>

          {/* Section 2: Household & Sensitive Members */}
          <div className="rounded-2xl border border-slate-200/80 p-4 bg-slate-50/50">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Home className="h-3.5 w-3.5 text-emerald-600" /> Household & Facilities
            </span>

            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
              <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-700 cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={formData.hasChildren}
                  onChange={(e) => setFormData({ ...formData, hasChildren: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Children at Home</span>
              </label>

              <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-700 cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={formData.hasSeniors}
                  onChange={(e) => setFormData({ ...formData, hasSeniors: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Older Adults (65+)</span>
              </label>

              <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-700 cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={formData.hasSensitiveMembers}
                  onChange={(e) =>
                    setFormData({ ...formData, hasSensitiveMembers: e.target.checked })
                  }
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Pollution Sensitive (Allergies)</span>
              </label>
            </div>

            {/* Indoor equipment */}
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-700 cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={formData.hasAirPurifier}
                  onChange={(e) => setFormData({ ...formData, hasAirPurifier: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Air Purifier Available</span>
              </label>

              <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-700 cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={formData.hasKitchenExhaust}
                  onChange={(e) =>
                    setFormData({ ...formData, hasKitchenExhaust: e.target.checked })
                  }
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Kitchen Exhaust Fan Available</span>
              </label>
            </div>
          </div>

          {/* Section 3: Budget Tier */}
          <div className="rounded-2xl border border-slate-200/80 p-4 bg-slate-50/50">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <DollarSign className="h-3.5 w-3.5 text-emerald-600" /> Solution Budget Preference
            </span>

            <div className="mt-3 grid grid-cols-3 gap-2">
              {(
                [
                  { id: 'no_cost', label: 'No-Cost', sub: 'Behavioral only' },
                  { id: 'low_cost', label: 'Low-Cost', sub: 'Masks & sealing' },
                  { id: 'moderate_budget', label: 'Moderate', sub: 'Purifiers & filters' },
                ] as const
              ).map((tier) => (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, budgetTier: tier.id })}
                  className={`flex flex-col rounded-xl border p-2.5 text-center text-xs transition ${
                    formData.budgetTier === tier.id
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold ring-1 ring-emerald-600'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{tier.label}</span>
                  <span className="text-[10px] text-slate-400 font-normal">{tier.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
            >
              <Check className="h-4 w-4" /> Save & Update Routine
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
