export type LifestyleType =
  'student' | 'working_professional' | 'work_from_home' | 'homemaker' | 'senior' | 'other';

export type TransportMode =
  'walking' | 'bicycle' | 'two_wheeler' | 'car' | 'public_transit' | 'carpool' | 'wfh';

export type RoutinePhase =
  | 'early_morning'
  | 'morning_prep'
  | 'travel_commute'
  | 'afternoon'
  | 'evening'
  | 'exercise_recreation'
  | 'night_routine';

export type BudgetTier = 'no_cost' | 'low_cost' | 'moderate_budget';

export interface UserPlannerProfile {
  lifestyle: LifestyleType;
  transport: TransportMode;
  wakeUpTime: string; // e.g. "06:30"
  workHoursStart: string; // e.g. "09:00"
  workHoursEnd: string; // e.g. "17:30"
  typicalCommuteMinutes: number; // e.g. 45
  exercisePreference:
    'morning_outdoor' | 'morning_indoor' | 'evening_outdoor' | 'evening_indoor' | 'none';
  householdType: 'individual' | 'family';
  hasChildren: boolean;
  hasSeniors: boolean;
  hasSensitiveMembers: boolean;
  hasAirPurifier: boolean;
  hasKitchenExhaust: boolean;
  windowsFrequentlyOpened: boolean;
  cookingFuel: 'lpg_gas' | 'electric_induction' | 'traditional_biomass' | 'other';
  homeSizeCategory: 'compact' | 'medium' | 'spacious';
  budgetTier: BudgetTier;
}

export interface DailyRoutineItem {
  id: string;
  phase: RoutinePhase;
  phaseTitle: string;
  timeSlot: string; // e.g. "06:30 AM"
  title: string;
  recommendedAction: string;
  reason: string;
  aqiContext: string;
  personalBenefit: string;
  environmentalBenefit: string;
  estimatedCost: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  alternatives: string[];
  completed: boolean;
  skipped: boolean;
}

export interface DailyPlan {
  id: string;
  generatedAt: string;
  locationName: string;
  aqiAtGeneration: number;
  aqiCategoryAtGeneration: string;
  items: DailyRoutineItem[];
  overallSummary: string;
  exposureHoursAvoided: number;
}
