import React from 'react';
import Link from 'next/link';
import { Wind, ShieldAlert, Leaf } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Col 1: Identity & Philosophy */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
                <Wind className="h-4 w-4" aria-hidden="true" />
              </div>
              <span className="text-lg font-bold text-white">BreatheWise</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              &ldquo;Know your air. Change your routine. Protect your surroundings.&rdquo;
            </p>
            <p className="text-xs text-slate-400">
              An intelligent, accessible urban atmospheric health assistant designed for families,
              commuters, and communities navigating urban air pollution.
            </p>
          </div>

          {/* Col 2: Core Modules */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-100">
              Platform Modules
            </h3>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-emerald-400 transition">
                  Air Quality Dashboard
                </Link>
              </li>
              <li>
                <Link href="/planner" className="hover:text-emerald-400 transition">
                  AI Daily Routine Planner
                </Link>
              </li>
              <li>
                <Link href="/indoor-air" className="hover:text-emerald-400 transition">
                  Indoor Air Intelligence
                </Link>
              </li>
              <li>
                <Link href="/sustainable-choices" className="hover:text-emerald-400 transition">
                  Sustainable Alternatives
                </Link>
              </li>
              <li>
                <Link href="/impact" className="hover:text-emerald-400 transition">
                  Direct Impact Tracker
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-emerald-400 transition">
                  Community Action Center
                </Link>
              </li>
              <li>
                <Link href="/assistant" className="hover:text-emerald-400 transition">
                  Environmental AI Advisor
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Data Sources & Attribution */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-100">
              Data & Standards
            </h3>
            <ul className="mt-3 space-y-2 text-xs text-slate-400">
              <li>
                <span className="text-slate-200">Atmospheric Data:</span> Copernicus Atmosphere
                Monitoring Service (CAMS) via Open-Meteo API.
              </li>
              <li>
                <span className="text-slate-200">Indian Standard:</span> Central Pollution Control
                Board (CPCB) NAQI 2014 breakpoint guidelines.
              </li>
              <li>
                <span className="text-slate-200">International:</span> US EPA AQI & European
                Environment Agency (EEA) standards.
              </li>
              <li>
                <span className="text-slate-200">Emission Factors:</span> UK DEFRA & ARAI Urban
                Fleet Carbon Databases (2024).
              </li>
            </ul>
          </div>

          {/* Col 4: Scientific & Medical Notice */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-100 flex items-center gap-1.5">
              <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
              Health Disclaimer
            </h3>
            <p className="mt-3 text-xs leading-relaxed text-slate-400">
              BreatheWise provides atmospheric dispersion intelligence and behavioral exposure
              minimization advice. It is not an alternative to clinical medical diagnosis or
              official municipal civil emergency alerts.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-800 text-[11px] text-slate-500">
              Targeting WCAG 2.2 AA Accessibility. Optimized for 100% serverless Vercel edge
              deployment.
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            © {new Date().getFullYear()} BreatheWise Assistant. Open-source, environmental public
            benefit initiative.
          </p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 text-emerald-400">
              <Leaf className="h-3.5 w-3.5" /> Built for cleaner urban skies
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
