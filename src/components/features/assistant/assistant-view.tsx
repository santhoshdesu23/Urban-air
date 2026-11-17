'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context/app-context';
import { AssistantMessage } from '@/types/assistant';
import {
  Sparkles,
  Send,
  Loader2,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

const STARTER_PROMPTS = [
  'Is it safe to go running today?',
  'Should I open my windows right now?',
  'How should I travel to work/college today?',
  'What should my family do during severe smog?',
  'How can I improve indoor air without purchasing an expensive purifier?',
  'What does PM2.5 mean?',
  'Why is my city’s air quality becoming worse in winter?',
];

export function AssistantView() {
  const { currentLocation, airQuality, activeStandard, profile } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: `Hello! I am your BreatheWise Environmental Intelligence Advisor. I have synchronized with the latest atmospheric observations for ${currentLocation.name} (Current AQI: ${airQuality?.current.aqi ?? '...'}, ${airQuality?.current.category ?? '...'}, ${activeStandard} standard). Ask me anything about exposure mitigation, outdoor activity timing, indoor air purification, or sustainable commuting!`,
      createdAt: new Date().toISOString(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const handleSubmit = async (queryText?: string) => {
    const textToSend = queryText || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    setErrorText(null);
    const userMsg: AssistantMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: textToSend.trim(),
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const payload = {
        message: textToSend.trim(),
        locationName: currentLocation.name,
        currentAqi: airQuality?.current.aqi ?? 120,
        dominantPollutant: airQuality?.current.dominantPollutant ?? 'PM2.5',
        activeStandard,
        lifestyle: profile.lifestyle,
        transport: profile.transport,
        hasSensitiveMembers: profile.hasSensitiveMembers,
      };

      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `HTTP error ${res.status}`);
      }

      const data = await res.json();
      const assistantMsg: AssistantMessage = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        content: data.structuredResponse?.summary || 'Analysis complete.',
        createdAt: new Date().toISOString(),
        structuredResponse: data.structuredResponse,
        isDeterministicFallback: data.isDeterministicFallback,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: unknown) {
      console.error('Assistant error:', err);
      const msg = err instanceof Error ? err.message : 'Unable to generate advice right now. Please try again.';
      setErrorText(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 p-2 text-white">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              GenAI Environmental Air Advisor
            </h1>
            <p className="text-xs text-slate-500">
              Context-aware advisor grounded in real atmospheric data for {currentLocation.name}.
            </p>
          </div>
        </div>
      </div>

      {/* Context Badge Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-slate-50 px-4 py-2.5 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-900">Active Atmospheric Context:</span>
          <span className="rounded-md bg-white px-2 py-0.5 font-bold text-emerald-800 border border-slate-200">
            {currentLocation.name}
          </span>
          <span className="rounded-md bg-white px-2 py-0.5 font-bold text-slate-800 border border-slate-200">
            AQI: {airQuality?.current.aqi ?? '...'} ({airQuality?.current.category ?? '...'})
          </span>
          <span className="rounded-md bg-white px-2 py-0.5 font-bold text-slate-800 border border-slate-200">
            Dominant: {airQuality?.current.dominantPollutant ?? 'PM2.5'}
          </span>
        </div>

        <span className="text-[11px] text-slate-400">
          Strict schema validation with Zod · Never fabricates readings
        </span>
      </div>

      {/* Suggested Starter Prompts */}
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
          Recommended Inquiries:
        </span>
        <div className="flex flex-wrap gap-2">
          {STARTER_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSubmit(prompt)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-left text-xs font-medium text-slate-700 hover:border-emerald-500 hover:text-emerald-700 hover:bg-emerald-50/30 transition shadow-2xs"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Thread */}
      <div className="space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          const structured = msg.structuredResponse;

          return (
            <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
              {isUser ? (
                <div className="max-w-xl rounded-3xl rounded-tr-sm bg-emerald-600 px-5 py-3 text-xs font-semibold text-white shadow-xs">
                  {msg.content}
                </div>
              ) : (
                <div className="w-full max-w-3xl rounded-3xl rounded-tl-sm border border-slate-200/80 bg-white p-6 shadow-xs sm:p-7">
                  {/* Assistant Disclosure Notice */}
                  {msg.isDeterministicFallback !== undefined && (
                    <div className="mb-4 rounded-xl border border-slate-200/60 bg-slate-50 px-3 py-1.5 text-[11px] text-slate-500 flex items-center justify-between">
                      <span>
                        {msg.isDeterministicFallback
                          ? '🌱 Grounded via BreatheWise Deterministic Environmental Intelligence Engine'
                          : '⚡ Live Generative AI Response via Vercel AI SDK'}
                      </span>
                      {structured?.confidence && (
                        <span className="font-semibold text-emerald-800">
                          Confidence: {structured.confidence}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Summary */}
                  <p className="text-sm font-bold leading-relaxed text-slate-900">{msg.content}</p>

                  {/* Structured Content Breakdown */}
                  {structured && (
                    <div className="mt-5 space-y-4 text-xs">
                      {/* AQI Context */}
                      <div className="rounded-xl bg-slate-50 p-3 text-slate-600 border border-slate-200/50">
                        <strong className="text-slate-800 font-semibold block">
                          Atmospheric Context:
                        </strong>
                        {structured.aqiContext}
                      </div>

                      {/* Recommended Actions */}
                      <div>
                        <strong className="text-slate-800 font-bold block mb-1.5 uppercase text-[11px] tracking-wider">
                          Recommended Action Steps:
                        </strong>
                        <ul className="space-y-1.5">
                          {structured.recommendedActions.map((action, i) => (
                            <li key={i} className="flex items-start gap-2 text-slate-800">
                              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Reasons */}
                      <div>
                        <strong className="text-slate-800 font-bold block mb-1.5 uppercase text-[11px] tracking-wider">
                          Why It Is Recommended:
                        </strong>
                        <ul className="space-y-1 list-disc pl-4 text-slate-600">
                          {structured.reasons.map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Impacts Grid */}
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border border-teal-200/80 bg-teal-50/40 p-3">
                          <strong className="text-teal-900 font-bold block text-[11px] uppercase tracking-wider">
                            Personal Exposure Impact
                          </strong>
                          <p className="mt-1 text-teal-950">{structured.personalImpact}</p>
                        </div>
                        <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/40 p-3">
                          <strong className="text-emerald-900 font-bold block text-[11px] uppercase tracking-wider">
                            Environmental Footprint Impact
                          </strong>
                          <p className="mt-1 text-emerald-950">{structured.environmentalImpact}</p>
                        </div>
                      </div>

                      {/* Sources & Safety Caveats */}
                      <div className="border-t border-slate-100 pt-3 text-[11px] space-y-1 text-slate-400">
                        <div>
                          <strong className="text-slate-600">Guideline Sources:</strong>{' '}
                          {structured.sources.join(' · ')}
                        </div>
                        <div className="text-amber-800 flex items-start gap-1">
                          <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                          <span>{structured.safetyCaveats[0]}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 rounded-2xl bg-white border border-slate-200 p-4 text-xs text-slate-500 shadow-2xs">
            <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
            <span>Consulting atmospheric models and compiling validated advice...</span>
          </div>
        )}

        {errorText && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span>{errorText}</span>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="sticky bottom-4 z-20">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="flex items-center gap-2 rounded-2xl border border-slate-300 bg-white p-2 shadow-lg focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask BreatheWise about today's air, running, masks, window ventilation..."
            maxLength={1000}
            className="w-full bg-transparent px-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none sm:text-sm"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs transition hover:bg-emerald-700 disabled:opacity-40"
            aria-label="Send question"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
