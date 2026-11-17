'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Wind, MapPin, RefreshCw, Menu, X, Sparkles } from 'lucide-react';
import { useApp } from '@/lib/context/app-context';
import { LocationModal } from '../features/location/location-modal';

export function Header() {
  const pathname = usePathname();
  const { currentLocation, isLoadingAqi, refreshAqi, activeStandard, setActiveStandard } = useApp();

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Overview' },
    { href: '/planner', label: 'Daily Planner' },
    { href: '/indoor-air', label: 'Indoor Air' },
    { href: '/sustainable-choices', label: 'Sustainable Choices' },
    { href: '/impact', label: 'Impact Tracker' },
    { href: '/community', label: 'Community' },
    { href: '/assistant', label: 'AI Assistant', highlight: true },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      {/* Top Banner: Verification & Source notice */}
      <div className="bg-slate-900 px-4 py-1.5 text-xs text-slate-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"
              aria-hidden="true"
            />
            <span className="font-medium text-slate-100">Live Atmospheric Intelligence</span>
            <span className="hidden sm:inline text-slate-400">
              | Powered by Copernicus CAMS & Open-Meteo
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-400">Model-Based Dispersion</span>
            <span className="rounded bg-emerald-950 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-800">
              Vercel Ready
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="group flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
            aria-label="BreatheWise Home"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-sm transition group-hover:scale-105">
              <Wind className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900">BreatheWise</span>
              <span className="hidden lg:block text-[11px] font-medium text-slate-500 -mt-1">
                Urban Air Quality Assistant
              </span>
            </div>
          </Link>

          {/* Location Selector Button */}
          <button
            type="button"
            onClick={() => setIsLocationModalOpen(true)}
            className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            aria-label={`Current location: ${currentLocation.name}. Click to change location.`}
          >
            <MapPin className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
            <span className="max-w-[140px] truncate sm:max-w-[200px]">{currentLocation.name}</span>
            <span className="text-slate-400">·</span>
            <span className="text-[11px] text-slate-500">{currentLocation.country}</span>
            <span className="rounded-full bg-emerald-100 px-1.5 py-0.2 text-[10px] text-emerald-800">
              Change
            </span>
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                } ${link.highlight ? 'text-emerald-700 flex items-center gap-1' : ''}`}
              >
                {link.highlight && <Sparkles className="h-3 w-3 text-emerald-600" />}
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Tools: Standard Selector & Refresh */}
        <div className="flex items-center gap-2">
          {/* AQI Standard Toggle */}
          <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setActiveStandard('CPCB')}
              className={`rounded-md px-2 py-1 font-semibold transition ${
                activeStandard === 'CPCB'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Indian Central Pollution Control Board (CPCB) Standard"
            >
              CPCB (India)
            </button>
            <button
              type="button"
              onClick={() => setActiveStandard('US_EPA')}
              className={`rounded-md px-2 py-1 font-semibold transition ${
                activeStandard === 'US_EPA'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="United States EPA AQI Standard"
            >
              US EPA
            </button>
            <button
              type="button"
              onClick={() => setActiveStandard('EUROPEAN')}
              className={`hidden sm:inline-block rounded-md px-2 py-1 font-semibold transition ${
                activeStandard === 'EUROPEAN'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="European Air Quality Index (EAQI)"
            >
              EAQI
            </button>
          </div>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={refreshAqi}
            disabled={isLoadingAqi}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:opacity-50"
            aria-label="Refresh air quality data"
            title="Refresh air quality data"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoadingAqi ? 'animate-spin text-emerald-600' : ''}`}
              aria-hidden="true"
            />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="xl:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-emerald-500"
            aria-label={isMobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-white px-4 py-3 shadow-lg">
          <nav className="flex flex-col gap-1.5" aria-label="Mobile Navigation">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 font-semibold'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {link.highlight && <Sparkles className="h-4 w-4 text-emerald-600" />}
                    {link.label}
                  </span>
                  {isActive && <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />}
                </Link>
              );
            })}
          </nav>
        </div>
      )}

      {/* Location Modal */}
      {isLocationModalOpen && <LocationModal onClose={() => setIsLocationModalOpen(false)} />}
    </header>
  );
}
