'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Navigation, X, Check, Loader2, AlertCircle } from 'lucide-react';
import { useApp } from '@/lib/context/app-context';
import { PRESET_LOCATIONS, PresetLocation } from '@/lib/air-quality/service';
import { GeocodingResult } from '@/types/air-quality';

export function LocationModal({ onClose }: { onClose: () => void }) {
  const { currentLocation, selectLocation, detectUserLocation, locationPermissionStatus } =
    useApp();

  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Debounced search
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      setSearchError(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      setSearchError(null);

      try {
        const res = await fetch(`/api/location/search?q=${encodeURIComponent(query.trim())}`);
        if (!res.ok) throw new Error('Search failed');
        const data = await res.json();
        setSearchResults(data.results || []);
        if ((data.results || []).length === 0) {
          setSearchError('No matching cities found. Try another spelling or locality.');
        }
      } catch {
        setSearchError('Unable to search locations right now. Check internet connection.');
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelectPreset = async (preset: PresetLocation) => {
    await selectLocation(preset);
    onClose();
  };

  const handleSelectGeocoding = async (item: GeocodingResult) => {
    const loc: PresetLocation = {
      name: item.name,
      admin1: item.admin1,
      country: item.country,
      latitude: item.latitude,
      longitude: item.longitude,
    };
    await selectLocation(loc);
    onClose();
  };

  const handleDetect = async () => {
    setIsDetecting(true);
    await detectUserLocation();
    setIsDetecting(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="location-modal-title"
    >
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl transition-all">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus-visible:ring-2 focus-visible:ring-emerald-500"
          aria-label="Close location selector"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-emerald-600" />
          <h2 id="location-modal-title" className="text-lg font-bold text-slate-900">
            Select Your Location
          </h2>
        </div>
        <p className="mt-1 text-xs text-slate-500">
          Choose your city to get real-time Copernicus atmospheric air quality and tailored daily
          guidance.
        </p>

        {/* GPS Detect Button */}
        <div className="mt-4">
          <button
            type="button"
            onClick={handleDetect}
            disabled={isDetecting}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-2.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 disabled:opacity-60"
          >
            {isDetecting ? (
              <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
            ) : (
              <Navigation className="h-4 w-4 text-emerald-600" />
            )}
            Detect My Current Location via GPS
          </button>
          {locationPermissionStatus === 'denied' && (
            <p className="mt-1 text-[11px] text-amber-700 flex items-center gap-1">
              <AlertCircle className="h-3.5 w-3.5" />
              Browser location permission was denied. Please select your city below.
            </p>
          )}
        </div>

        {/* Search Input */}
        <div className="relative mt-4">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search any global city or locality (e.g. Pune, Patna, Berlin)..."
            className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            aria-label="Search city or locality"
          />
          {isSearching && (
            <Loader2 className="absolute right-3.5 top-3 h-4 w-4 animate-spin text-emerald-600" />
          )}
        </div>

        {/* Search Results Dropdown List */}
        {searchResults.length > 0 && (
          <div className="mt-2 max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
            {searchResults.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectGeocoding(item)}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs hover:bg-slate-100 transition"
              >
                <div>
                  <span className="font-semibold text-slate-900">{item.name}</span>
                  {item.admin1 && <span className="text-slate-500">, {item.admin1}</span>}
                  <span className="ml-1 text-slate-400">({item.country})</span>
                </div>
                <span className="text-[10px] text-emerald-600 font-medium">Select</span>
              </button>
            ))}
          </div>
        )}

        {searchError && (
          <p className="mt-2 text-xs text-amber-600 flex items-center gap-1">
            <AlertCircle className="h-3.5 w-3.5" /> {searchError}
          </p>
        )}

        {/* Quick Presets */}
        <div className="mt-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Common Major Cities
          </span>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {PRESET_LOCATIONS.map((preset) => {
              const isSelected = currentLocation.name === preset.name;
              return (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`flex items-center justify-between rounded-xl border px-3 py-2 text-left text-xs transition ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/70 font-semibold text-emerald-900 ring-1 ring-emerald-500'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <span className="truncate">{preset.name}</span>
                  {isSelected && <Check className="h-3.5 w-3.5 text-emerald-600" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footnote */}
        <div className="mt-6 border-t border-slate-100 pt-3 text-center text-[11px] text-slate-400">
          Air quality coordinates are routed directly through Copernicus CAMS atmospheric models.
        </div>
      </div>
    </div>
  );
}
