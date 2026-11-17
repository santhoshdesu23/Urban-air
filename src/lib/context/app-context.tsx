'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useTransition,
  useCallback,
} from 'react';
import { AirQualityData, AQIStandard } from '@/types/air-quality';
import { DEFAULT_PLANNER_PROFILE, generateDailyPlan } from '@/lib/planner/generator';
import { DailyPlan, UserPlannerProfile } from '@/types/planner';
import { PRESET_LOCATIONS, PresetLocation } from '@/lib/air-quality/service';

interface AppContextType {
  // Location & Air Quality
  currentLocation: PresetLocation;
  airQuality: AirQualityData | null;
  isLoadingAqi: boolean;
  aqiError: string | null;
  activeStandard: AQIStandard;
  setActiveStandard: (std: AQIStandard) => void;
  selectLocation: (loc: PresetLocation) => Promise<void>;
  detectUserLocation: () => Promise<void>;
  locationPermissionStatus: 'prompt' | 'granted' | 'denied' | 'unavailable';

  // Planner
  profile: UserPlannerProfile;
  updateProfile: (updates: Partial<UserPlannerProfile>) => void;
  dailyPlan: DailyPlan | null;
  toggleRoutineComplete: (itemId: string) => void;
  toggleRoutineSkip: (itemId: string) => void;
  regeneratePlan: () => void;

  // Global Refresh
  refreshAqi: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PROFILE: 'breathewise_user_profile',
  STANDARD: 'breathewise_aqi_standard',
  LOCATION: 'breathewise_selected_location',
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentLocation, setCurrentLocation] = useState<PresetLocation>(PRESET_LOCATIONS[0]);
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
  const [isLoadingAqi, setIsLoadingAqi] = useState<boolean>(true);
  const [aqiError, setAqiError] = useState<string | null>(null);
  const [activeStandard, setActiveStandardState] = useState<AQIStandard>('CPCB');
  const [locationPermissionStatus, setLocationPermissionStatus] = useState<
    'prompt' | 'granted' | 'denied' | 'unavailable'
  >('prompt');

  const [profile, setProfile] = useState<UserPlannerProfile>(DEFAULT_PLANNER_PROFILE);
  const [dailyPlan, setDailyPlan] = useState<DailyPlan | null>(null);
  const [, startTransition] = useTransition();

  const fetchAqiForLocation = useCallback(
    async (loc: PresetLocation) => {
      setIsLoadingAqi(true);
      setAqiError(null);

      try {
        const url = `/api/air-quality?lat=${loc.latitude}&lon=${loc.longitude}&name=${encodeURIComponent(
          loc.name
        )}&country=${encodeURIComponent(loc.country)}`;

        const res = await fetch(url);
        if (!res.ok) {
          const errJson = await res.json().catch(() => ({}));
          throw new Error(errJson.error || `HTTP ${res.status}`);
        }

        const data: AirQualityData = await res.json();
        setAirQuality(data);

        // Generate or update daily plan
        startTransition(() => {
          const plan = generateDailyPlan(profile, data);
          setDailyPlan(plan);
        });
      } catch (err: unknown) {
        console.error('Error fetching AQI:', err);
        const msg =
          err instanceof Error
            ? err.message
            : 'Unable to retrieve air quality data. Using cached/offline readings.';
        setAqiError(msg);
      } finally {
        setIsLoadingAqi(false);
      }
    },
    [profile]
  );

  const setActiveStandard = (std: AQIStandard) => {
    setActiveStandardState(std);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.STANDARD, std);
    }
  };

  // Load initial settings from localStorage on client mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const savedProfile = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }

      const savedStandard = localStorage.getItem(STORAGE_KEYS.STANDARD) as AQIStandard;
      if (
        savedStandard &&
        (savedStandard === 'CPCB' || savedStandard === 'US_EPA' || savedStandard === 'EUROPEAN')
      ) {
        setActiveStandardState(savedStandard);
      }

      const savedLoc = localStorage.getItem(STORAGE_KEYS.LOCATION);
      if (savedLoc) {
        const parsedLoc = JSON.parse(savedLoc);
        setCurrentLocation(parsedLoc);
        fetchAqiForLocation(parsedLoc);
        return;
      }
    } catch (e) {
      console.warn('Failed to parse cached local settings:', e);
    }

    // Default fetch
    fetchAqiForLocation(PRESET_LOCATIONS[0]);
  }, [fetchAqiForLocation]);

  const selectLocation = async (loc: PresetLocation) => {
    setCurrentLocation(loc);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.LOCATION, JSON.stringify(loc));
    }
    await fetchAqiForLocation(loc);
  };

  const detectUserLocation = async () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setLocationPermissionStatus('unavailable');
      return;
    }

    setIsLoadingAqi(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setLocationPermissionStatus('granted');
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        const loc: PresetLocation = {
          name: 'My Detected Location',
          latitude: lat,
          longitude: lon,
          country: 'Current Area',
        };

        setCurrentLocation(loc);
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEYS.LOCATION, JSON.stringify(loc));
        }
        await fetchAqiForLocation(loc);
      },
      (err) => {
        setIsLoadingAqi(false);
        if (err.code === err.PERMISSION_DENIED) {
          setLocationPermissionStatus('denied');
          setAqiError('Location permission denied. Please choose a city manually.');
        } else {
          setLocationPermissionStatus('unavailable');
          setAqiError('Location unavailable or timed out. Please select your city manually.');
        }
      },
      { timeout: 8000, enableHighAccuracy: false }
    );
  };

  const updateProfile = (updates: Partial<UserPlannerProfile>) => {
    const updated = { ...profile, ...updates };
    setProfile(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
    }
    if (airQuality) {
      const newPlan = generateDailyPlan(updated, airQuality);
      setDailyPlan(newPlan);
    }
  };

  const toggleRoutineComplete = (itemId: string) => {
    if (!dailyPlan) return;
    setDailyPlan({
      ...dailyPlan,
      items: dailyPlan.items.map((it) =>
        it.id === itemId ? { ...it, completed: !it.completed, skipped: false } : it
      ),
    });
  };

  const toggleRoutineSkip = (itemId: string) => {
    if (!dailyPlan) return;
    setDailyPlan({
      ...dailyPlan,
      items: dailyPlan.items.map((it) =>
        it.id === itemId ? { ...it, skipped: !it.skipped, completed: false } : it
      ),
    });
  };

  const regeneratePlan = () => {
    if (!airQuality) return;
    const newPlan = generateDailyPlan(profile, airQuality);
    setDailyPlan(newPlan);
  };

  const refreshAqi = async () => {
    await fetchAqiForLocation(currentLocation);
  };

  return (
    <AppContext.Provider
      value={{
        currentLocation,
        airQuality,
        isLoadingAqi,
        aqiError,
        activeStandard,
        setActiveStandard,
        selectLocation,
        detectUserLocation,
        locationPermissionStatus,
        profile,
        updateProfile,
        dailyPlan,
        toggleRoutineComplete,
        toggleRoutineSkip,
        regeneratePlan,
        refreshAqi,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
