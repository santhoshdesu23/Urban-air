export interface EmissionFactor {
  mode: string;
  factorKgCO2ePerKm: number;
  source: string;
  referenceYear: number;
  assumptions: string;
}

export interface TransportImpactCalculationInput {
  baselineMode: 'petrol_car' | 'diesel_car' | 'two_wheeler';
  alternativeMode: 'metro' | 'bus' | 'carpool_2p' | 'bicycle' | 'walking' | 'wfh';
  distanceKm: number;
  tripsCount: number;
}

export interface TransportImpactCalculationResult {
  baselineEmissionsKg: number;
  alternativeEmissionsKg: number;
  avoidedKgCO2e: number;
  distanceKmTotal: number;
  formula: string;
  sourceCitation: string;
  assumptions: string[];
}

export interface ImpactTrackerState {
  totalKmSwapped: number;
  totalKgCO2eAvoided: number;
  totalExposureHoursAvoided: number;
  indoorActionsCount: number;
  completedRoutineCount: number;
  activeStreakDays: number;
  weeklyHistory: {
    day: string;
    co2eAvoidedKg: number;
    exposureAvoidedHours: number;
  }[];
}
