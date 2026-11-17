'use client';

import React from 'react';
import { DailyOutlookPoint } from '@/types/air-quality';
import { Calendar } from 'lucide-react';
import { getAQIColor } from '@/lib/air-quality/standards';

interface DailyOutlookProps {
  daily: DailyOutlookPoint[];
}

export function DailyOutlook({ daily }: DailyOutlookProps) {
  if (!daily || daily.length === 0) return null;

  return (
    <section aria-labelledby="daily-outlook-heading" className="mt-8">
      <div className="flex items-center justify-between">
        <div>
          <h2
            id="daily-outlook-heading"
            className="text-base font-bold text-slate-900 flex items-center gap-2"
          >
            <Calendar className="h-4 w-4 text-emerald-600" />
            5-Day Atmospheric Outlook
          </h2>
          <p className="text-xs text-slate-500">
            Anticipated daily ranges and windows of favorable vs elevated particulate risk.
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {daily.map((day) => {
          const colorInfo = getAQIColor(day.category);

          return (
            <div
              key={day.date}
              className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs transition hover:shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold text-slate-900">{day.dayOfWeek}</span>
                  <span className="text-[11px] text-slate-400">{day.date.slice(5)}</span>
                </div>

                <div className="mt-3 flex items-baseline justify-between">
                  <div>
                    <span className="text-2xl font-black text-slate-900">{day.avgAqi}</span>
                    <span className="text-[11px] text-slate-500 ml-1">Avg AQI</span>
                  </div>
                  <span
                    className="inline-flex rounded-lg px-2 py-0.5 text-[10px] font-bold border"
                    style={{
                      backgroundColor: `${colorInfo.hex}15`,
                      color: colorInfo.hex,
                      borderColor: `${colorInfo.hex}40`,
                    }}
                  >
                    {day.category}
                  </span>
                </div>

                <div className="mt-2 text-[11px] text-slate-500">
                  Range:{' '}
                  <strong className="text-slate-800">
                    {day.minAqi} - {day.maxAqi}
                  </strong>
                </div>

                {/* Range Bar */}
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      backgroundColor: colorInfo.hex,
                      width: `${Math.min(100, (day.avgAqi / 350) * 100)}%`,
                    }}
                  />
                </div>
              </div>

              <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-2 text-[11px]">
                <div className="flex items-start gap-1 text-slate-600">
                  <span className="font-semibold text-slate-700 min-w-[34px]">Best:</span>
                  <span className="truncate">{day.bestActivityWindow}</span>
                </div>
                <div className="flex items-start gap-1 text-slate-600">
                  <span className="font-semibold text-slate-700 min-w-[34px]">Peak:</span>
                  <span className="truncate">{day.highRiskPeriod}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
