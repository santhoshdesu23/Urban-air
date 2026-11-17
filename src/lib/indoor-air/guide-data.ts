import { IndoorBudgetTier, IndoorChecklistItem, IndoorGuideItem } from '@/types/indoor';

export const INDOOR_GUIDE_ITEMS: IndoorGuideItem[] = [
  {
    id: 'indoor-hepa-filtration',
    category: 'filtration',
    title: 'True HEPA Filtration & Purifier Sizing',
    shortDescription:
      'Understanding True HEPA (H13/H14) mechanisms, CADR sizing, and ideal room positioning.',
    budgetTier: 'Moderate Budget',
    detailedGuide: [
      'True HEPA filters capture at least 99.97% of airborne particles as small as 0.3 microns through diffusion, interception, and impaction.',
      'Check the Clean Air Delivery Rate (CADR) in m³/hr or CFM. As a rule of thumb, multiply your room area (in sq. ft) by 1.5 to find the minimum recommended Smoke CADR.',
      'Placement rule: Elevate the purifier 2-3 feet off the floor if possible, and leave at least 1-2 feet of clear space around the air intake grilles. Avoid hiding the unit in tight corners or behind heavy curtains.',
      'Run continuously on auto or low/medium speed rather than bursting on turbo for 10 minutes. Continuous gentle air exchange maintains low baseline particle counts.',
    ],
    scientificBasis:
      'Peer-reviewed aerosol physics establishes that True HEPA mechanical filtration removes PM2.5 and ultrafine particles without generating secondary photochemical byproducts or toxic ozone.',
    limitationsAndCaveats:
      'Standard particulate HEPA filters do NOT capture gaseous pollutants like carbon monoxide (CO) or volatile organic compounds (VOCs) unless combined with a substantial activated carbon adsorbent stage.',
    dos: [
      'Choose purifiers certified by AHAM or certified True HEPA (EN 1822 H13).',
      'Vacuum or gently wash the external pre-filter mesh every 2-4 weeks to prolong HEPA lifespan.',
      'Keep doors and windows closed in the treated room to prevent rapid air dilution.',
    ],
    donts: [
      'NEVER purchase ozone-generating air "cleaners" or unverified ionizers; ozone is a severe lung irritant.',
      'Do NOT place purifiers flush against a wall where intake vents are suffocated.',
      'Avoid running the unit only when the room feels stuffy; fine particles are invisible to the naked eye.',
    ],
  },
  {
    id: 'indoor-smart-ventilation',
    category: 'ventilation',
    title: 'Outdoor-Aware Smart Ventilation Protocol',
    shortDescription:
      'How to time window opening safely based on solar dispersion and boundary-layer physics.',
    budgetTier: 'Free',
    detailedGuide: [
      'Never open windows blindly. Check your BreatheWise live AQI before cracking any window.',
      'During severe winter smog, diurnal temperature inversions trap pollutants overnight and in early mornings. Midday hours (12:00 PM - 3:00 PM) usually feature the deepest boundary layer and lowest surface PM2.5 concentrations.',
      'When outdoor AQI is below 100, create cross-ventilation by opening windows on opposite sides of your living space for 15-25 minutes to expel indoor carbon dioxide, humidity, and chemical vapors.',
      'When outdoor AQI exceeds 200, suspend open-window ventilation. Rely on internal air circulation with HEPA filtration.',
    ],
    scientificBasis:
      'Atmospheric physics demonstrates that surface thermal inversion layers break under solar irradiance, elevating the mixing height and reducing ambient pollutant density during midday.',
    limitationsAndCaveats:
      'Midday ozone (O3) can occasionally rise in summer sunny conditions even when PM2.5 is low. Check the dominant pollutant before long airing.',
    dos: [
      'Check the Hourly Forecast on BreatheWise to pinpoint today’s lowest AQI window.',
      'Use short, high-efficiency cross-ventilation flushes rather than leaving a window cracked all day long in dusty areas.',
    ],
    donts: [
      'Never open windows facing active vehicular thoroughfares or construction sites during morning rush hour.',
      'Do not keep windows wide open overnight in winter when stagnant cool air pools outdoors.',
    ],
  },
  {
    id: 'indoor-household-sources',
    category: 'sources',
    title: 'Controlling Indoor Particle & Chemical Emitters',
    shortDescription:
      'Minimizing incense, scented candles, frying fumes, tobacco smoke, and toxic cleaning solvents.',
    budgetTier: 'Free',
    detailedGuide: [
      'Burning a single traditional incense stick (agarbatti) in a closed room can elevate indoor PM2.5 beyond 300-500 µg/m³ within 20 minutes, releasing benzene and formaldehyde.',
      'Scented paraffin candles emit fine black carbon soot and volatile hydrocarbons.',
      'High-heat cooking (deep frying, searing, oil tempering/tadka) creates high aerosol spikes. Always use tight lids and turn on kitchen exhaust hood prior to heating oil.',
      'Strictly eliminate indoor tobacco smoking or vaping. Secondhand smoke clings to upholstery (thirdhand smoke) and continues off-gassing carcinogenic nitrosamines for months.',
    ],
    scientificBasis:
      'Combustion chemistry shows that incomplete burning of organic materials (resins, waxes, tobacco) produces condensed polycyclic aromatic hydrocarbons (PAHs) and ultrafine carbon cores.',
    limitationsAndCaveats:
      'Switching to "natural" or "organic" incense does not eliminate combustion particles; any burning organic material emits inhalable particulate matter.',
    dos: [
      'Switch to non-combustive alternatives: electric LED lamps or essential oil diffusers without smoke (used sparingly).',
      'Cover hot frying pans with splatter guards or tight-fitting lids.',
      'Store harsh chlorine or ammonia-based cleaners in sealed cabinets away from living quarters.',
    ],
    donts: [
      'Do NOT burn incense or dhoop in unventilated bedrooms, particularly where infants or elderly sleep.',
      'Do NOT rely on air fresheners or aerosol sprays to "freshen" air; they add synthetic fragrance VOCs without cleaning.',
    ],
  },
  {
    id: 'indoor-cleaning-maintenance',
    category: 'maintenance',
    title: 'Mopping, Dust Management & Sealing',
    shortDescription:
      'Wet dusting techniques, sealing door leaks, and kitchen exhaust maintenance.',
    budgetTier: 'Low Budget',
    detailedGuide: [
      'Dry sweeping with traditional brooms resuspends coarse dust and settled allergens back into breathing height. Use damp microfiber mopping and wet dusting cloths.',
      'Door sweep draft blockers: Install rubber or fabric door draft seals at the bottom of external entrance doors and window frames to minimize unconditioned infiltration of urban smog.',
      'Clean your kitchen exhaust hood grease mesh monthly in hot soapy water; a grease-clogged exhaust fan loses up to 60% of its air extraction capacity.',
      'Check AC mesh filters every two weeks during smog season to keep indoor air recirculation unimpeded.',
    ],
    scientificBasis:
      'Aerodynamic re-entrainment studies reveal that mechanical dry sweeping elevates localized respirable dust (PM10 and PM2.5) by over 300% for up to two hours post-cleaning.',
    limitationsAndCaveats:
      'Wet mopping addresses surface-settled dust but does not remove suspended fine aerosols (PM2.5) floating in the air column.',
    dos: [
      'Use a damp microfiber cloth for dusting bookshelves, tables, and TV units.',
      'Install affordable foam weatherstripping tape on leaky window sashes.',
      'Wash bed linen in warm water weekly to eliminate dust mites and settled soot particles.',
    ],
    donts: [
      'Do not use dry feather dusters or dry broom sweeping in closed bedrooms.',
      'Do not run vacuum cleaners that lack sealed HEPA exhaust filters, as they blow fine dust back into the air.',
    ],
  },
];

export const INITIAL_INDOOR_CHECKLIST: IndoorChecklistItem[] = [
  {
    id: 'chk-check-aqi',
    label: 'Check live outdoor AQI before opening any windows or balcony doors',
    category: 'ventilation',
    timingHint: 'Morning & Midday',
    importance: 'Essential',
    completed: false,
    scientificTip: 'Only ventilate when outdoor levels drop below critical indoor thresholds.',
  },
  {
    id: 'chk-kitchen-exhaust',
    label: 'Turn on kitchen exhaust fan and use covered lids while cooking',
    category: 'sources',
    timingHint: 'Before cooking',
    importance: 'Essential',
    completed: false,
    scientificTip: 'Prevents aerosolized cooking oils and combustion byproducts from circulating.',
  },
  {
    id: 'chk-no-smoke-incense',
    label: 'Keep living spaces smoke-free; avoid indoor incense and scented candles',
    category: 'sources',
    timingHint: 'Throughout day',
    importance: 'Essential',
    completed: false,
    scientificTip: 'A single incense stick can exceed 300 µg/m³ PM2.5 in closed quarters.',
  },
  {
    id: 'chk-wet-mop',
    label: 'Damp-wipe surfaces and wet-mop floors instead of dry broom sweeping',
    category: 'cleaning',
    timingHint: 'Daily cleaning',
    importance: 'Recommended',
    completed: false,
    scientificTip: 'Dry brooms resuspend particulate matter directly into your breathing zone.',
  },
  {
    id: 'chk-purifier-filter',
    label: 'Inspect air purifier pre-filter mesh and verify continuous low-mode operation',
    category: 'filtration',
    timingHint: 'Weekly check',
    importance: 'Recommended',
    completed: false,
    scientificTip:
      'Clean pre-filters protect sensitive HEPA layers and preserve high CADR airflow.',
  },
  {
    id: 'chk-seal-gaps',
    label: 'Ensure external door bottom gaps and leaky window sashes are properly sealed',
    category: 'ventilation',
    timingHint: 'Before sunset',
    importance: 'Good Practice',
    completed: false,
    scientificTip: 'Weatherstripping dramatically reduces nighttime infiltration of highway smog.',
  },
];

export const BUDGET_SOLUTIONS: Record<
  IndoorBudgetTier,
  { title: string; costRange: string; items: string[]; limitations: string }
> = {
  Free: {
    title: 'Zero-Cost Everyday Protocols',
    costRange: '₹0 / $0',
    items: [
      'Time your window ventilation strictly to midday solar peaks when ambient AQI is lowest.',
      'Eliminate indoor incense, scented candles, mosquito coils, and indoor smoking.',
      'Cover pots while cooking and keep kitchen door closed during frying.',
      'Wet-mop floors and damp-dust surfaces to trap particles without dry sweeping.',
      'Close curtains and external blinds during peak smog hours to reduce draft infiltration.',
    ],
    limitations:
      'Cannot actively filter sub-micron particles already suspended in the room. Helpful for avoiding added pollution, but cannot replace active mechanical filtration in severe smog.',
  },
  'Low Budget': {
    title: 'Low-Cost Maintenance & Barrier Upgrades',
    costRange: '₹200 - ₹1,500 ($3 - $20)',
    items: [
      'Install foam weatherstripping tape on loose window sills and doors.',
      'Install fabric door draft stoppers at the bottom of external entryways.',
      'Equip yourself and family with certified N95 / FFP2 respirators for all outdoor transit.',
      'Clean or replace washable mesh filters on split AC units every two weeks.',
      'Use high-density microfiber cleaning cloths with electrostatic dust attraction.',
    ],
    limitations:
      'Improves sealing and personal commuter protection, but does not continuously lower ambient room particulate without an air circulating fan and HEPA media.',
  },
  'Moderate Budget': {
    title: 'Targeted Mechanical Filtration & Monitoring',
    costRange: '₹5,000 - ₹15,000 ($60 - $180)',
    items: [
      'Purchase an AHAM-certified True HEPA (H13) air purifier sized appropriately for the main bedroom.',
      'Ensure a CADR rating of at least 250 - 350 m³/hr for standard 150-200 sq. ft rooms.',
      'Keep authentic manufacturer replacement HEPA filters in stock for prompt 6-12 month replacement.',
      'Upgrade kitchen exhaust with an efficient ducted range hood with non-return backdraft damper.',
    ],
    limitations:
      'Purifiers only clean closed rooms. If doors or windows remain wide open, clean air is rapidly diluted by outside pollution.',
  },
};
