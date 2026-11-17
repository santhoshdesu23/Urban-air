import { SustainableRecommendation } from '@/types/sustainability';

export const SUSTAINABLE_RECOMMENDATIONS: SustainableRecommendation[] = [
  {
    id: 'sus-public-transit',
    category: 'transport',
    title: 'Switching Solo Car Commute to Urban Metro / Rapid Bus',
    actionSummary:
      'Choose the city metro rail or electrified public bus for your daily office or college commute instead of driving a private petrol/diesel car.',
    whyItMatters:
      'Private combustion vehicles account for a major fraction of urban NOx, CO, and secondary aerosol precursors. Mass transit moves dozens of passengers per vehicle emission unit.',
    personalBenefit:
      'Avoids peak-hour traffic gridlock stress, saves fuel and parking costs, and allows relaxed reading or productivity during transit.',
    environmentalImpact: {
      estimatedSaving: '~1.8 to 2.8 kg CO2e per 15 km round trip',
      metric: 'kg CO2e avoided',
      factorBasis:
        'Calculated using standard urban fleet emission factors: Petrol car (~0.170 kg CO2e/pkm) vs Electric Metro (~0.018 kg CO2e/pkm).',
    },
    limitationsAndAssumptions:
      'Assumes a single-occupancy petrol car replaced by a typical passenger load on electric rail. Individual route convenience and last-mile connectivity vary.',
    difficulty: 'Easy',
    practicalSteps: [
      'Locate your nearest metro station or rapid transit bus stop using map navigators.',
      'Purchase an integrated smart mobility card or transit pass for seamless boarding.',
      'Equip yourself with a well-fitted mask during station platform waiting on smoggy days.',
    ],
  },
  {
    id: 'sus-carpooling',
    category: 'transport',
    title: 'Organized Workplace Carpooling & Ride-Sharing',
    actionSummary:
      'Pair up with colleagues or residential neighbors traveling the same corridor to share rides 2-3 times per week.',
    whyItMatters:
      'Doubling car occupancy instantly cuts per-passenger vehicular emissions by 50% without requiring changes in public infrastructure.',
    personalBenefit:
      'Divides monthly petrol, toll, and maintenance expenses among carpoolers; permits rotating driving duties.',
    environmentalImpact: {
      estimatedSaving: '~1.1 kg CO2e per 15 km trip per carpooler',
      metric: 'kg CO2e avoided',
      factorBasis:
        '50% reduction in vehicle-kilometers traveled per carpool pairing (DEFRA / ARAI passenger vehicle factors).',
    },
    limitationsAndAssumptions:
      'Requires synchronized morning and evening schedules among participating commuters.',
    difficulty: 'Moderate',
    practicalSteps: [
      'Create a neighborhood or office Slack/WhatsApp rideshare group.',
      'Establish fixed departure times and a mutual courtesy protocol regarding schedule delays.',
      'Keep cabin AC in recirculate mode to protect all passengers from highway exhaust.',
    ],
  },
  {
    id: 'sus-trip-chaining',
    category: 'transport',
    title: 'Trip Chaining (Consolidating Errands)',
    actionSummary:
      'Combine grocery shopping, pharmacy pickups, and school drop-offs into a single planned vehicular loop instead of multiple separate cold-start trips.',
    whyItMatters:
      'Internal combustion engines emit the majority of their pollutants (unburnt hydrocarbons, CO, VOCs) during the first 5 minutes of operation when catalytic converters are cold.',
    personalBenefit:
      'Saves 30-45 minutes of driving time weekly and avoids repeated vehicle warm-up fuel waste.',
    environmentalImpact: {
      estimatedSaving: '~0.6 to 1.2 kg CO2e per consolidated excursion',
      metric: 'Fuel & emissions efficiency',
      factorBasis:
        'Eliminating repeated cold-start cycles reduces excess engine warm-up emissions by 20-35%.',
    },
    limitationsAndAssumptions: 'Requires advance weekly errand planning and route sequencing.',
    difficulty: 'Easy',
    practicalSteps: [
      'Maintain a unified shared household shopping list.',
      'Map your errand stops sequentially on the return leg of your daily commute.',
    ],
  },
  {
    id: 'sus-active-mobility-clean-aqi',
    category: 'transport',
    title: 'Walking & Cycling on Clean Air Days',
    actionSummary:
      'Walk or cycle for short neighborhood trips (< 2 km) when BreatheWise indicates Good or Satisfactory AQI (< 100).',
    whyItMatters:
      'Short car journeys are the least fuel-efficient trips. Walking produces zero tailpipe emissions and zero tire-wear PM.',
    personalBenefit:
      'Boosts cardiovascular stamina and daily step count; zero transportation expense.',
    environmentalImpact: {
      estimatedSaving: '~0.34 kg CO2e per 2 km walk/cycle trip',
      metric: 'Zero-emission transit',
      factorBasis: 'Replaces ~0.170 kg CO2e/km automobile tailpipe emission completely.',
    },
    limitationsAndAssumptions:
      'ONLY recommended when outdoor AQI is below 100. Avoid walking alongside congested vehicular corridors when AQI is Poor or Severe.',
    difficulty: 'Easy',
    practicalSteps: [
      'Verify BreatheWise AQI dashboard before putting on running shoes or unlocking your bike.',
      'Choose tree-lined interior residential avenues rather than highway service roads.',
    ],
  },
  {
    id: 'sus-energy-conservation',
    category: 'energy',
    title: 'Phantom Load Elimination & Energy-Efficient Lighting',
    actionSummary:
      'Turn off appliances at the wall switch when idle and replace legacy bulbs with high-efficiency 5-star LEDs.',
    whyItMatters:
      'A substantial percentage of regional grid electricity still originates from thermal coal plants, which emit SO2, NOx, and fly ash particulates.',
    personalBenefit: 'Cuts monthly household electric utility bills by 8% to 15%.',
    environmentalImpact: {
      estimatedSaving: '~0.82 kg CO2e per kWh saved from the grid',
      metric: 'Grid emissions avoided',
      factorBasis:
        'Central Electricity Authority (CEA) India baseline grid emission factor (~0.82 kg CO2e/kWh).',
    },
    limitationsAndAssumptions:
      'Exact emission savings depend on the regional energy mix (coal vs hydro/solar) of your local electric utility.',
    difficulty: 'Easy',
    practicalSteps: [
      'Use multi-socket surge protectors with individual switches for TV, consoles, and computer desks.',
      'Switch off air conditioners 15 minutes before leaving a room.',
    ],
  },
  {
    id: 'sus-responsible-waste',
    category: 'community',
    title: 'Zero Open Burning & Municipal Reporting',
    actionSummary:
      'Compost garden leaves and wet kitchen waste; never burn dry leaves, plastic packaging, or domestic garbage. Report open burning through official channels.',
    whyItMatters:
      'Low-temperature smoldering of mixed plastics and organic waste releases dioxins, furans, black carbon, and hazardous VOCs directly at ground level.',
    personalBenefit:
      'Protects your immediate family and neighborhood children from toxic, acrid ground-level smoke plumes.',
    environmentalImpact: {
      estimatedSaving: 'Prevents direct local toxic PM2.5 and carcinogenic dioxin plumes',
      metric: 'Localized air toxicity mitigation',
      factorBasis:
        'Open municipal solid waste burning generates up to 8 g of PM2.5 per kg of waste.',
    },
    limitationsAndAssumptions:
      'Individual action protects the immediate micro-environment; municipal enforcement is required for large-scale illegal dumpsite burning.',
    difficulty: 'Moderate',
    practicalSteps: [
      'In India, report visible garbage burning via the CPCB Sameer App or municipal helpline (1916 / 311).',
      'Set up an earthen compost pot or vermicompost bin for dry autumn leaves and vegetable peels.',
      'Engage your Resident Welfare Association (RWA) or apartment management committee.',
    ],
  },
  {
    id: 'sus-urban-greenery',
    category: 'community',
    title: 'Urban Green Canopy & Dust Buffering',
    actionSummary:
      'Plant multi-layered native shrubs and broad-leaf canopy trees along building boundaries and road perimeters.',
    whyItMatters:
      'Dense foliage acts as a natural physical buffer, intercepting coarse dust particles (PM10) and lowering surface urban heat island effects.',
    personalBenefit:
      'Provides natural shade, lowers ambient summer temperatures, and reduces road noise.',
    environmentalImpact: {
      estimatedSaving: '~10 to 22 kg CO2 sequestered per mature native tree per year',
      metric: 'Particulate capture and carbon storage',
      factorBasis: 'Forestry and urban ecology particulate impaction studies.',
    },
    limitationsAndAssumptions:
      'Crucial note: Urban trees are a long-term supporting measure and micro-climate buffer; they CANNOT act as an immediate substitute for industrial or vehicular emission control.',
    difficulty: 'Involved',
    practicalSteps: [
      'Select species with high particulate capturing capacity (e.g. Peepal, Neem, Ashoka, Jamun).',
      'Wash roadside foliage with water sprays occasionally to clear clogged leaf stomata.',
    ],
  },
];
