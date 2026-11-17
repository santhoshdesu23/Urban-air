import {
  EmissionFactor,
  TransportImpactCalculationInput,
  TransportImpactCalculationResult,
} from '@/types/impact';

/**
 * Transparent emission factors (Version 2024.1).
 * References:
 * - UK DEFRA / BEIS Greenhouse Gas Conversion Factors for Company Reporting (2023-2024)
 * - ARAI (Automotive Research Association of India) urban passenger vehicle emissions
 * - Central Electricity Authority (CEA) India CO2 Baseline Database (Version 19)
 */
export const EMISSION_FACTORS: Record<string, EmissionFactor> = {
  petrol_car: {
    mode: 'Petrol Passenger Car (Average 1.2L - 1.5L Urban Fleet)',
    factorKgCO2ePerKm: 0.17, // ~170 g CO2e / km
    source: 'DEFRA 2023 / ARAI Average Urban Vehicle Fleet Analysis',
    referenceYear: 2024,
    assumptions:
      'Single occupant driving an average gasoline internal combustion car in urban conditions.',
  },
  diesel_car: {
    mode: 'Diesel Passenger Car (Average Urban Fleet)',
    factorKgCO2ePerKm: 0.165,
    source: 'DEFRA 2023 Passenger Fleet',
    referenceYear: 2024,
    assumptions: 'Single occupant in a modern turbo-diesel vehicle.',
  },
  two_wheeler: {
    mode: 'Two-Wheeler (100cc - 150cc Scooter / Motorcycle)',
    factorKgCO2ePerKm: 0.045, // ~45 g CO2e / km
    source: 'ARAI Indian Urban Driving Cycle 2023',
    referenceYear: 2024,
    assumptions: 'Single rider on a 4-stroke 100-150cc commuter motorcycle/scooter.',
  },
  metro: {
    mode: 'Urban Heavy Rail / Metro (Electric)',
    factorKgCO2ePerKm: 0.018, // ~18 g CO2e / passenger-km
    source: 'Delhi Metro Rail Corporation (DMRC) / Central Electricity Authority Grid Factors',
    referenceYear: 2024,
    assumptions: 'High-density electric urban transit train operating on regional grid power.',
  },
  bus: {
    mode: 'Urban Public Bus (CNG / Clean Diesel average occupancy)',
    factorKgCO2ePerKm: 0.035, // ~35 g CO2e / passenger-km
    source: 'Urban Mass Transit Association / DEFRA local bus transit',
    referenceYear: 2024,
    assumptions: 'Average city bus with ~35-45 passengers during peak transit hours.',
  },
  carpool_2p: {
    mode: 'Carpooling (2 occupants in 1 passenger car)',
    factorKgCO2ePerKm: 0.085, // 50% of single car
    source: 'Derived from baseline passenger car divided by 2 occupants',
    referenceYear: 2024,
    assumptions: 'Splits car tailpipe emissions equally between 2 commuting adults.',
  },
  bicycle: {
    mode: 'Bicycle / Non-Motorized Transit',
    factorKgCO2ePerKm: 0.0,
    source: 'Intergovernmental Panel on Climate Change (IPCC) Guidelines',
    referenceYear: 2024,
    assumptions: 'Human-powered active transit with zero direct fossil emissions.',
  },
  walking: {
    mode: 'Walking',
    factorKgCO2ePerKm: 0.0,
    source: 'IPCC Guidelines',
    referenceYear: 2024,
    assumptions: 'Zero tailpipe emissions.',
  },
  wfh: {
    mode: 'Work / Study from Home (Zero Commute)',
    factorKgCO2ePerKm: 0.0,
    source: 'Zero transit displacement',
    referenceYear: 2024,
    assumptions: 'Eliminates travel distance completely.',
  },
};

/**
 * Calculates emissions avoided with full transparency, defined inputs, and citations.
 */
export function calculateAvoidedEmissions(
  input: TransportImpactCalculationInput
): TransportImpactCalculationResult {
  const { baselineMode, alternativeMode, distanceKm, tripsCount } = input;

  const validDistance = Math.max(0, distanceKm);
  const validTrips = Math.max(1, tripsCount);
  const totalKm = validDistance * validTrips;

  const baselineFactor = EMISSION_FACTORS[baselineMode] ?? EMISSION_FACTORS.petrol_car;
  const alternativeFactor = EMISSION_FACTORS[alternativeMode] ?? EMISSION_FACTORS.metro;

  const baselineEmissions = totalKm * baselineFactor.factorKgCO2ePerKm;
  const alternativeEmissions = totalKm * alternativeFactor.factorKgCO2ePerKm;

  const avoided = Math.max(0, baselineEmissions - alternativeEmissions);

  return {
    baselineEmissionsKg: Number(baselineEmissions.toFixed(2)),
    alternativeEmissionsKg: Number(alternativeEmissions.toFixed(2)),
    avoidedKgCO2e: Number(avoided.toFixed(2)),
    distanceKmTotal: Number(totalKm.toFixed(1)),
    formula: `Avoided Emissions (kg CO2e) = ${totalKm} km × (${baselineFactor.factorKgCO2ePerKm} kg/km [${baselineMode}] - ${alternativeFactor.factorKgCO2ePerKm} kg/km [${alternativeMode}])`,
    sourceCitation: `${baselineFactor.source} & ${alternativeFactor.source} (${baselineFactor.referenceYear})`,
    assumptions: [
      baselineFactor.assumptions,
      alternativeFactor.assumptions,
      'Calculations represent estimated lifecycle operational fuel savings; infrastructure embodied carbon is excluded.',
    ],
  };
}

/**
 * Explains personal exposure impact in cautious, non-medical terms.
 */
export function getPersonalExposureExplanation(
  hoursAvoided: number,
  averageAqi: number
): {
  headline: string;
  explanation: string;
  cautiousCaveat: string;
} {
  const roundedHours = Number(hoursAvoided.toFixed(1));

  if (averageAqi > 250) {
    return {
      headline: `${roundedHours} hours shielded from severe ambient pollution`,
      explanation: `By rescheduling outdoor cardio and transit during peak smog hours, you successfully reduced your estimated duration in high-concentration particulate air by approximately ${roundedHours} hours today.`,
      cautiousCaveat:
        'This calculation reflects duration of exposure mitigation; it does not constitute clinical medical diagnosis or personal health evaluation.',
    };
  }

  return {
    headline: `${roundedHours} hours of optimized exposure timing`,
    explanation: `By syncing workouts and travel with cleaner midday forecast windows, you maintained physical activities while reducing peak soot intake.`,
    cautiousCaveat:
      'Individual respiratory responses vary based on existing sensitivity, ambient humidity, and mask fit.',
  };
}
