import { AirQualityData } from '@/types/air-quality';
import { DailyPlan, DailyRoutineItem, UserPlannerProfile } from '@/types/planner';

export const DEFAULT_PLANNER_PROFILE: UserPlannerProfile = {
  lifestyle: 'working_professional',
  transport: 'public_transit',
  wakeUpTime: '06:30',
  workHoursStart: '09:00',
  workHoursEnd: '17:30',
  typicalCommuteMinutes: 40,
  exercisePreference: 'morning_outdoor',
  householdType: 'family',
  hasChildren: true,
  hasSeniors: false,
  hasSensitiveMembers: false,
  hasAirPurifier: true,
  hasKitchenExhaust: true,
  windowsFrequentlyOpened: true,
  cookingFuel: 'lpg_gas',
  homeSizeCategory: 'medium',
  budgetTier: 'low_cost',
};

export function generateDailyPlan(
  profile: UserPlannerProfile,
  airQuality: AirQualityData
): DailyPlan {
  const currentAqi = airQuality.current.aqi;
  const dominant = airQuality.current.dominantPollutant;
  const isHighPollution = currentAqi > 150;
  const isSevere = currentAqi > 300;
  const bestWindow = airQuality.forecast.bestOutdoorWindow;
  const worstWindow = airQuality.forecast.highestRiskPeriod;

  const items: DailyRoutineItem[] = [];

  // 1. EARLY MORNING (Wake-up to Prep)
  if (isHighPollution) {
    items.push({
      id: 'routine-early-morning',
      phase: 'early_morning',
      phaseTitle: 'Early Morning Routine',
      timeSlot: `${profile.wakeUpTime} AM`,
      title: 'Pollution-Safe Wakeup & Morning Shield',
      recommendedAction:
        'Keep bedroom windows and balcony doors sealed during early morning. Postpone outdoor running or brisk walking.',
      reason: `Early morning atmospheric temperature inversion traps fine ${dominant} near ground level (Current AQI: ${currentAqi}).`,
      aqiContext: `Morning AQI stands at ${currentAqi} (${airQuality.current.category}). Typical morning inversion peaks before 08:30 AM.`,
      personalBenefit:
        'Prevents deep inhalation of fine particulate matter into the alveoli during vulnerable waking hours.',
      environmentalBenefit: 'No direct ambient AQI reduction claimed.',
      estimatedCost: 'Zero cost',
      difficulty: 'Easy',
      alternatives: [
        'Do a 20-minute indoor yoga or stretching routine with windows closed.',
        'If outdoor movement is mandatory, wear a snug-fitting N95/FFP2 respirator.',
      ],
      completed: false,
      skipped: false,
    });
  } else {
    items.push({
      id: 'routine-early-morning',
      phase: 'early_morning',
      phaseTitle: 'Early Morning Routine',
      timeSlot: `${profile.wakeUpTime} AM`,
      title: 'Favorable Outdoor Ventilation & Activity',
      recommendedAction:
        'Open windows for 20-30 minutes for fresh air exchange. Outdoor walking is favorable.',
      reason: `Ambient air quality is currently ${airQuality.current.category} (${currentAqi} AQI), making natural airflow beneficial.`,
      aqiContext: `Favorable air condition: ${dominant} levels remain well within manageable bounds.`,
      personalBenefit: 'Promotes indoor oxygenation and natural circadian awakening.',
      environmentalBenefit: 'Reduces electric ventilation energy use.',
      estimatedCost: 'Zero cost',
      difficulty: 'Easy',
      alternatives: ['Keep windows cracked open if outside temperature is very cold.'],
      completed: false,
      skipped: false,
    });
  }

  // 2. MORNING PREPARATION (Breakfast / Ventilation)
  const hasExhaust = profile.hasKitchenExhaust;
  items.push({
    id: 'routine-morning-prep',
    phase: 'morning_prep',
    phaseTitle: 'Breakfast & Indoor Air Shield',
    timeSlot: '07:45 AM',
    title: 'Controlled Cooking Emissions & Particle Minimization',
    recommendedAction: hasExhaust
      ? 'Turn on kitchen exhaust fan on high before igniting cooking burners and keep cookware lids covered.'
      : 'Cover all pots and pans with lids while boiling or sauteing; close bedroom doors to isolate cooking aerosols.',
    reason:
      'Cooking over gas or oil generates significant indoor PM2.5, ultrafine particles, and nitrogen dioxide that can exceed outdoor pollution levels.',
    aqiContext: `Outdoor AQI is ${currentAqi}; indoor spikes should be prevented from compounding ambient exposure.`,
    personalBenefit:
      profile.hasChildren || profile.hasSensitiveMembers
        ? 'Safeguards vulnerable household members from indoor respiratory irritation.'
        : 'Reduces indoor VOCs and particle concentrations during morning prep.',
    environmentalBenefit: 'Efficient covered cooking consumes up to 25% less fuel.',
    estimatedCost: 'Zero cost',
    difficulty: 'Easy',
    alternatives: [
      'Use microwave or electric electric kettle where practical to eliminate direct flame combustion.',
    ],
    completed: false,
    skipped: false,
  });

  // 3. COMMUTE (Travel to work / college)
  const commuteAdvice = getCommuteAdvice(profile, currentAqi, dominant);
  items.push({
    id: 'routine-travel-commute',
    phase: 'travel_commute',
    phaseTitle: 'Work / Study Commute',
    timeSlot: profile.workHoursStart ? `${profile.workHoursStart} (Departure)` : '08:45 AM',
    title: commuteAdvice.title,
    recommendedAction: commuteAdvice.action,
    reason: commuteAdvice.reason,
    aqiContext: `Peak morning traffic coincides with high particulate density (Worst window today: ${worstWindow?.start || '08:00 - 10:00'}).`,
    personalBenefit: commuteAdvice.personalBenefit,
    environmentalBenefit: commuteAdvice.environmentalBenefit,
    estimatedCost: commuteAdvice.cost,
    difficulty: commuteAdvice.difficulty,
    alternatives: commuteAdvice.alternatives,
    completed: false,
    skipped: false,
  });

  // 4. AFTERNOON (Midday ventilation & lunch)
  if (bestWindow && !isSevere) {
    items.push({
      id: 'routine-afternoon',
      phase: 'afternoon',
      phaseTitle: 'Afternoon Natural Window',
      timeSlot: `${bestWindow.start} - ${bestWindow.end}`,
      title: 'Smart Solar Ventilation Window',
      recommendedAction:
        bestWindow.aqi <= 120
          ? `Safest ventilation window: Open cross-ventilating windows for 15-20 minutes between ${bestWindow.start} and ${bestWindow.end}.`
          : `Outdoor air is at daily minimum (AQI ~${bestWindow.aqi}); if ventilating, do only brief 5-10 minute air flushes.`,
      reason:
        'Midday solar radiation breaks the boundary-layer inversion, causing pollutants to disperse upward.',
      aqiContext: `Forecast indicates best ambient window with AQI dipping to ~${bestWindow.aqi}.`,
      personalBenefit:
        'Flushes out indoor stale carbon dioxide without flooding rooms with peak morning smog.',
      environmentalBenefit: 'Natural cooling/heating balance reduces auxiliary ventilation.',
      estimatedCost: 'Zero cost',
      difficulty: 'Easy',
      alternatives: [
        'Rely strictly on HEPA air recirculation if anyone in the room has allergic rhinitis.',
      ],
      completed: false,
      skipped: false,
    });
  } else {
    items.push({
      id: 'routine-afternoon',
      phase: 'afternoon',
      phaseTitle: 'Afternoon Indoor Protocol',
      timeSlot: '01:00 PM',
      title: 'Continuous Indoor Filtration & Hydration',
      recommendedAction:
        'Keep windows sealed; eat lunch indoors away from active street traffic; stay well-hydrated.',
      reason: `Severe atmospheric conditions (AQI ${currentAqi}) persist even during midday hours.`,
      aqiContext: `High ambient particulate burden (${dominant} exceeding safe reference guidelines).`,
      personalBenefit: 'Hydration maintains mucosal moisture in the upper respiratory tract.',
      environmentalBenefit: 'No direct ambient AQI reduction claimed.',
      estimatedCost: 'Zero cost',
      difficulty: 'Easy',
      alternatives: ['Take a quiet walk inside an air-conditioned or filtered building corridor.'],
      completed: false,
      skipped: false,
    });
  }

  // 5. EVENING COMMUTE & TRANSIT
  items.push({
    id: 'routine-evening',
    phase: 'evening',
    phaseTitle: 'Evening Return & Arrival',
    timeSlot: profile.workHoursEnd ? `${profile.workHoursEnd} (Return)` : '06:00 PM',
    title: 'Post-Commute Decontamination & Air Cleaning',
    recommendedAction:
      'Wipe down your face and nasal area with water upon arriving home; change out of outdoor commuter clothes.',
    reason:
      'Fine and coarse particulates settle on clothing, skin, and hair, continuing to emit ultrafine particles indoors.',
    aqiContext: `Evening traffic rush brings a secondary spike in vehicular NO2 and PM2.5.`,
    personalBenefit:
      'Stops transfer of outdoor soot and dust onto bed linen and living room furniture.',
    environmentalBenefit: 'No direct ambient AQI reduction claimed.',
    estimatedCost: 'Zero cost',
    difficulty: 'Easy',
    alternatives: ['Quick shower immediately after returning from a long two-wheeler commute.'],
    completed: false,
    skipped: false,
  });

  // 6. EXERCISE & RECREATION
  const exerciseAdvice = getExerciseAdvice(profile, currentAqi, dominant);
  items.push({
    id: 'routine-exercise-recreation',
    phase: 'exercise_recreation',
    phaseTitle: 'Fitness & Physical Activity',
    timeSlot: '07:15 PM',
    title: exerciseAdvice.title,
    recommendedAction: exerciseAdvice.action,
    reason: exerciseAdvice.reason,
    aqiContext: `Evening AQI is estimated around ${currentAqi}; heavy respiration multiplies particle intake tenfold.`,
    personalBenefit: exerciseAdvice.personalBenefit,
    environmentalBenefit: exerciseAdvice.environmentalBenefit,
    estimatedCost: exerciseAdvice.cost,
    difficulty: exerciseAdvice.difficulty,
    alternatives: exerciseAdvice.alternatives,
    completed: false,
    skipped: false,
  });

  // 7. NIGHT ROUTINE
  items.push({
    id: 'routine-night-routine',
    phase: 'night_routine',
    phaseTitle: 'Night Sleep Sanctuary',
    timeSlot: '09:30 PM',
    title: 'Overnight Recovery & Bedroom Filtration',
    recommendedAction: profile.hasAirPurifier
      ? 'Position air purifier 3-5 feet from head of bed; set on quiet/medium continuous mode; close bedroom door.'
      : 'Wet-mop bedroom floor 30 minutes before sleep to trap settled dust; ensure windows are fully latched.',
    reason:
      'We spend 7-8 continuous hours breathing bedroom air. Nighttime pollution levels often peak around midnight.',
    aqiContext: `Overnight drop in wind speed concentrates ground-level pollutants until sunrise.`,
    personalBenefit:
      'Promotes uninterrupted restorative REM sleep and lowers nighttime airway inflammation.',
    environmentalBenefit:
      'Running modern BLDC purifiers uses less than 25-35 Watts of electricity.',
    estimatedCost: profile.hasAirPurifier ? 'Nominal electricity (< ₹5 / night)' : 'Zero cost',
    difficulty: 'Easy',
    alternatives: [
      'If no purifier, place a clean damp towel near the bedside draft or window border.',
    ],
    completed: false,
    skipped: false,
  });

  // Calculate exposure hours avoided estimate
  // If user followed outdoor avoidance during peak hours (e.g. morning + evening):
  const exposureHoursAvoided = isHighPollution ? (isSevere ? 4.5 : 2.5) : 1.0;

  const overallSummary = `Customized for your ${profile.lifestyle.replace('_', ' ')} routine in ${airQuality.location.name}. Current AQI is ${currentAqi} (${airQuality.current.category}). Our schedule strategically shields you during morning and evening particulate peaks while optimizing your travel and indoor air quality.`;

  return {
    id: `plan-${Date.now()}`,
    generatedAt: new Date().toISOString(),
    locationName: airQuality.location.name,
    aqiAtGeneration: currentAqi,
    aqiCategoryAtGeneration: airQuality.current.category,
    items,
    overallSummary,
    exposureHoursAvoided,
  };
}

function getCommuteAdvice(
  profile: UserPlannerProfile,
  aqi: number,
  _dominant: string
): {
  title: string;
  action: string;
  reason: string;
  personalBenefit: string;
  environmentalBenefit: string;
  cost: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  alternatives: string[];
} {
  const isHigh = aqi > 150;

  if (profile.transport === 'wfh') {
    return {
      title: 'Zero Commute Shield & Carbon Savings',
      action: 'Maintain remote work station; avoid peak traffic hours entirely.',
      reason:
        'Eliminating the commute completely removes exposure to vehicular tailpipe emissions.',
      personalBenefit: 'Avoids 100% of roadside particulate and toxic NO2 exposure.',
      environmentalBenefit: `Avoids ~${(profile.typicalCommuteMinutes * 0.4).toFixed(1)} kg CO2e vehicle emissions today.`,
      cost: 'Zero cost',
      difficulty: 'Easy',
      alternatives: ['Take periodic indoor posture and eye breaks every 45 minutes.'],
    };
  }

  if (
    profile.transport === 'two_wheeler' ||
    profile.transport === 'bicycle' ||
    profile.transport === 'walking'
  ) {
    if (isHigh) {
      return {
        title: 'High-Exertion Open Commute Protection',
        action:
          'Wear a well-fitted, certified N95 or FFP2 respirator with adjustable nose-clip throughout transit. If possible, consider public metro or bus for this leg.',
        reason:
          'Open road travel on bikes or walking directly exposes you to diesel exhaust and heavy road dust resuspension.',
        personalBenefit:
          'Filters >95% of fine airborne particulate (PM2.5) from entering your lungs.',
        environmentalBenefit:
          profile.transport === 'two_wheeler'
            ? 'Two-wheelers emit ~0.045 kg CO2/km.'
            : 'Zero tailpipe emissions.',
        cost: 'Low (~₹30 - ₹50 per reusable mask)',
        difficulty: 'Moderate',
        alternatives: [
          'Switch to metro/subway rail for the longest stretch of your commute.',
          'Take side streets rather than heavy truck bypass highways.',
        ],
      };
    } else {
      return {
        title: 'Active Commute with Routine Caution',
        action: 'Enjoy walking or cycling; maintain steady pacing without overexertion.',
        reason: `Air conditions (${aqi} AQI) are suitable for outdoor movement.`,
        personalBenefit: 'Cardiovascular activity and lower stress.',
        environmentalBenefit: 'Zero emissions; saves ~1.5 - 2.5 kg CO2e over a passenger car.',
        cost: 'Zero cost',
        difficulty: 'Easy',
        alternatives: ['Carry a light scarf or mask in case of localized dust.'],
      };
    }
  }

  if (profile.transport === 'car') {
    return {
      title: 'Cabin Recirculation & Ride-Sharing',
      action:
        'Set car air conditioning to RECIRCULATE mode before starting the engine; check cabin air filter; consider carpooling with a colleague.',
      reason:
        'Recirculation mode prevents fresh outside traffic exhaust (rich in NO2 and CO) from being sucked directly into your car interior.',
      personalBenefit:
        'Reduces in-cabin PM2.5 concentrations by 40-70% compared to outside bumper-to-bumper air.',
      environmentalBenefit: 'Carpooling cuts your journey emissions by 50%.',
      cost: 'Zero immediate cost',
      difficulty: 'Easy',
      alternatives: ['Use city metro transit instead of driving solo in congested corridors.'],
    };
  }

  // Public transit default
  return {
    title: 'Mass Transit Route with Station Masking',
    action:
      'Opt for electric metro or clean public bus; wear an N95 mask while waiting at above-ground stations and busy bus terminals.',
    reason:
      'Bus terminals and underground stations often harbor high concentrations of brake dust and idle exhaust.',
    personalBenefit:
      'Avoids driving stress and significantly reduces total personal exposure compared to walking on roadways.',
    environmentalBenefit:
      'Public transit emits 70-85% less CO2e per passenger-km than a private automobile.',
    cost: 'Standard transit fare',
    difficulty: 'Easy',
    alternatives: ['Car-pooling or micro-mobility last mile.'],
  };
}

function getExerciseAdvice(
  profile: UserPlannerProfile,
  aqi: number,
  dominant: string
): {
  title: string;
  action: string;
  reason: string;
  personalBenefit: string;
  environmentalBenefit: string;
  cost: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  alternatives: string[];
} {
  const isHigh = aqi > 150;

  if (profile.exercisePreference === 'none') {
    return {
      title: 'Rest & Gentle Movement',
      action: 'Engage in gentle indoor walking or mobility stretching in a filtered room.',
      reason: 'Low respiratory rate keeps inhalation volumes modest during peak pollution.',
      personalBenefit: 'Maintains joint health without stressing the respiratory tract.',
      environmentalBenefit: 'Zero impact.',
      cost: 'Zero cost',
      difficulty: 'Easy',
      alternatives: ['Guided breathing exercises.'],
    };
  }

  if (isHigh) {
    return {
      title: 'Indoor Workout Adaptation',
      action:
        'Shift workout entirely indoors. Perform bodyweight training, yoga, or indoor cycling in an air-filtered environment.',
      reason: `Outdoor running during high pollution (${aqi} AQI, ${dominant}) forces deep pulmonary penetration of toxic soot due to 8x higher ventilation rate.`,
      personalBenefit:
        'Delivers full cardiovascular benefit while bypassing severe airway inflammation and oxidative stress.',
      environmentalBenefit: 'Zero ambient emissions.',
      cost: 'Zero cost',
      difficulty: 'Moderate',
      alternatives: [
        'Visit a gym equipped with commercial HEPA ventilation.',
        'Low-intensity indoor pilates or mobility work.',
      ],
    };
  }

  return {
    title: 'Outdoor Exercise Allowed',
    action:
      'Outdoor running or sports can proceed; choose green parks away from high-traffic roadways.',
    reason: `Air quality (${aqi} AQI) is acceptable for outdoor cardiovascular exertion.`,
    personalBenefit: 'Improves endurance, Vitamin D synthesis, and mental clarity.',
    environmentalBenefit: 'Zero energy footprint.',
    cost: 'Zero cost',
    difficulty: 'Easy',
    alternatives: ['Indoor training if localized pollen or dust is bothersome.'],
  };
}
