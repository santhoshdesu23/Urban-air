import { CommunityActionGuide, CommunityChallenge } from '@/types/community';

export const COMMUNITY_CHALLENGES: CommunityChallenge[] = [
  {
    id: 'chal-7day-commute',
    title: '7-Day Cleaner Commute Challenge',
    badge: '🚇 Green Commuter',
    durationDays: 7,
    category: 'commute',
    goal: 'Replace solo combustion car/cab journeys with metro, shared rides, cycling, or remote work for 7 days.',
    whyItMatters:
      'Peak rush-hour vehicle idling creates localized hyper-concentration zones of toxic NOx and PM2.5 outside school gates and office hubs.',
    personalContribution:
      'Eliminates ~10 - 20 kg of CO2e emissions and cuts your daily exposure to bumper-to-bumper tailpipe plumes.',
    collectiveImpactExplanation:
      'When 100 urban commuters in a neighborhood swap solo driving for mass transit for one week, up to 1.5 metric tons of greenhouse gas and hundreds of grams of fine particulate are prevented from entering community air.',
    steps: [
      {
        dayNumber: 1,
        title: 'Transit Mapping',
        description:
          'Map out the closest metro station or electric bus line to your workplace or college.',
        actionableTip: 'Download the local transit timetable or card recharge app.',
        completed: false,
      },
      {
        dayNumber: 2,
        title: 'First Mass Transit Ride',
        description:
          'Take metro or public transit for your journey; wear an N95 mask while waiting on platforms.',
        actionableTip: 'Notice the reduction in driving tension and parking hassle.',
        completed: false,
      },
      {
        dayNumber: 3,
        title: 'Carpool Exploration',
        description: 'Ask 2 colleagues or neighbors if they share a common route and schedule.',
        actionableTip: 'Set up a quick group chat to coordinate departure times.',
        completed: false,
      },
      {
        dayNumber: 4,
        title: 'Active Short Errand',
        description:
          'Walk or cycle for all neighborhood grocery or pharmacy errands under 1.5 km (if AQI < 100).',
        actionableTip: 'Leave the car keys at home for quick local tasks.',
        completed: false,
      },
      {
        dayNumber: 5,
        title: 'Trip Consolidation',
        description:
          'Chain your evening errands into one loop rather than multiple short cold-start engine runs.',
        actionableTip: 'Reduces excess cold engine emissions by up to 35%.',
        completed: false,
      },
      {
        dayNumber: 6,
        title: 'Remote Day or Shared Ride',
        description:
          'If permitted, work from home or participate in your first coordinated shared carpool.',
        actionableTip: 'Log your avoided kilometers in the BreatheWise Impact Tracker.',
        completed: false,
      },
      {
        dayNumber: 7,
        title: 'Challenge Review & Habit Lock',
        description:
          'Calculate your total week-long emissions saved and decide which habits to keep permanent.',
        actionableTip: 'Share your clean commute plan with your office sustainability team.',
        completed: false,
      },
    ],
  },
  {
    id: 'chal-smoke-free-home',
    title: 'Smoke-Free Home & Clean Air Sanctuary',
    badge: '🏡 Pure Sanctuary',
    durationDays: 7,
    category: 'home',
    goal: 'Eliminate indoor combustion sources (tobacco, incense, dhoop, unvented frying) and optimize filtration.',
    whyItMatters:
      'Indoor particle concentrations often exceed outdoor winter smog when combustion occurs in closed rooms.',
    personalContribution:
      'Lowers your family’s 24-hour PM2.5 inhalation volume by up to 50% without requiring expensive equipment.',
    collectiveImpactExplanation:
      'Creating smoke-free multi-family apartments stops toxic aerosol drift through shared ventilation shafts, balcony corridors, and window courtyards.',
    steps: [
      {
        dayNumber: 1,
        title: 'Incense & Smoke Audit',
        description:
          'Remove all burning incense sticks, coils, and dhoop from bedrooms and living areas.',
        actionableTip:
          'Switch to flameless electronic LED diyas or gentle electric aroma diffusers without smoke.',
        completed: false,
      },
      {
        dayNumber: 2,
        title: 'Exhaust Fan Maintenance',
        description:
          'Degrease kitchen exhaust mesh in warm soapy water to restore full extraction suction.',
        actionableTip: 'A clean exhaust hood extracts 50% more cooking aerosols.',
        completed: false,
      },
      {
        dayNumber: 3,
        title: 'Wet Mopping Protocol',
        description: 'Replace dry broom sweeping with damp microfiber mopping across all floors.',
        actionableTip: 'Traps coarse dust without tossing particles back into your breathing zone.',
        completed: false,
      },
      {
        dayNumber: 4,
        title: 'Draft & Leak Sealing',
        description:
          'Inspect main door bottom gaps and window frames for drafts; apply weatherstripping tape.',
        actionableTip: 'Keeps outside evening traffic exhaust from penetrating your living room.',
        completed: false,
      },
      {
        dayNumber: 5,
        title: 'Purifier Pre-Filter Wash',
        description: 'Vacuum or gently rinse your air purifier’s washable mesh pre-filter.',
        actionableTip: 'Extends the life of expensive True HEPA layers and boosts CADR airflow.',
        completed: false,
      },
      {
        dayNumber: 6,
        title: 'Covered Cooking Day',
        description:
          'Keep all cookware covered with lids while sauteing or boiling; close kitchen doors.',
        actionableTip: 'Saves cooking gas while keeping PM2.5 localized to the exhaust vent.',
        completed: false,
      },
      {
        dayNumber: 7,
        title: 'Household Air Pledge',
        description: 'Adopt permanent smoke-free living guidelines with all household members.',
        actionableTip: 'Notice the reduction in morning stuffiness and eye irritation.',
        completed: false,
      },
    ],
  },
  {
    id: 'chal-waste-disposal',
    title: 'Responsible Waste & Anti-Burning Campaign',
    badge: '♻️ Zero Burn Ally',
    durationDays: 5,
    category: 'waste',
    goal: 'Eliminate open garden waste burning, segregate household waste, and report illegal smoldering in your area.',
    whyItMatters:
      'Burning dry leaves, roadside garbage, and plastic wrappers releases deadly toxic furans, dioxins, and black carbon at ground breathing height.',
    personalContribution:
      'Prevents direct local toxic smoke plumes from wafting into surrounding residential windows.',
    collectiveImpactExplanation:
      'Active citizen vigilance and neighborhood waste segregation prevents municipal dumpsite fires and roadside leaf smoldering.',
    steps: [
      {
        dayNumber: 1,
        title: 'Waste Segregation Setup',
        description:
          'Place separate bins for wet kitchen waste (biodegradable) and dry packaging (recyclable).',
        actionableTip:
          'Dry waste stays clean and is far less likely to end up in illegal burning dumps.',
        completed: false,
      },
      {
        dayNumber: 2,
        title: 'Leaf Composting Awareness',
        description:
          'Instruct garden cleaners never to burn dry leaves; collect them in an earthen corner for natural compost.',
        actionableTip: 'Composted leaves create nutrient-rich mulch for trees and shrubs.',
        completed: false,
      },
      {
        dayNumber: 3,
        title: 'Reporting Tool Setup',
        description:
          'Save the municipal reporting helpline or download the official CPCB Sameer / Swachhata app.',
        actionableTip:
          'Taking a geotagged photo allows municipal inspectors to penalize violators.',
        completed: false,
      },
      {
        dayNumber: 4,
        title: 'Community Dialogue',
        description:
          'Speak with your residential security guards and sweeping staff about zero open burning.',
        actionableTip:
          'Provide electric heaters or thermal blankets so night guards avoid burning garbage for warmth.',
        completed: false,
      },
      {
        dayNumber: 5,
        title: 'Neighborhood Pledge',
        description:
          'Share a zero-burning advisory notice on your building or colony WhatsApp group.',
        actionableTip: 'Collective vigilance stops roadside fires before they start.',
        completed: false,
      },
    ],
  },
  {
    id: 'chal-clean-air-week',
    title: 'Clean-Air Community Awareness Week',
    badge: '📢 Air Ambassador',
    durationDays: 7,
    category: 'awareness',
    goal: 'Educate friends, family, and neighbors on understanding AQI, N95 protection, and low-emission choices.',
    whyItMatters:
      'Public misconceptions (e.g. relying on cloth masks or opening windows during morning inversion) leave thousands unknowingly exposed.',
    personalContribution:
      'Empowers vulnerable neighbors, pregnant mothers, and elderly citizens to take scientifically grounded precautions.',
    collectiveImpactExplanation:
      'Informed communities demand cleaner public transport, stricter construction dust barriers, and effective smog enforcement.',
    steps: [
      {
        dayNumber: 1,
        title: 'Understanding AQI Standards',
        description: 'Learn the difference between CPCB and US EPA AQI standards on BreatheWise.',
        actionableTip: 'Share the BreatheWise dashboard link with three close friends.',
        completed: false,
      },
      {
        dayNumber: 2,
        title: 'Mask Science Explainer',
        description:
          'Explain to family why standard cloth/surgical masks fail against fine PM2.5, whereas N95/FFP2 filters >95%.',
        actionableTip: 'Help family members check for a tight nasal seal without air leaks.',
        completed: false,
      },
      {
        dayNumber: 3,
        title: 'Vulnerable Groups Protection',
        description:
          'Review morning routine adjustments for seniors and young children during severe smog days.',
        actionableTip: 'Move outdoor play indoors on days when AQI exceeds 200.',
        completed: false,
      },
      {
        dayNumber: 4,
        title: 'Indoor Air Reality Check',
        description:
          'Debunk air quality myths (e.g., that houseplants replace HEPA filters or ozone generators are safe).',
        actionableTip: 'Share peer-reviewed indoor air facts from the BreatheWise Indoor Guide.',
        completed: false,
      },
      {
        dayNumber: 5,
        title: 'Construction Dust Vigilance',
        description:
          'Check whether local building repairs in your street use mandatory green windbreak nets and water misting.',
        actionableTip: 'Remind contractors to keep sand piles covered with tarpaulin.',
        completed: false,
      },
      {
        dayNumber: 6,
        title: 'Support Clean Transit',
        description:
          'Advocate for improved bus frequency or safer pedestrian footpaths in your municipal ward forum.',
        actionableTip: 'Public transport advocacy creates enduring structural change.',
        completed: false,
      },
      {
        dayNumber: 7,
        title: 'Printable Action Plan',
        description:
          'Download and post the BreatheWise Clean Air Routine on your building community notice board.',
        actionableTip: 'Knowledge and collective routine changes protect your entire neighborhood.',
        completed: false,
      },
    ],
  },
];

export const COMMUNITY_ACTION_GUIDES: CommunityActionGuide[] = [
  {
    id: 'guide-reporting-burning',
    title: 'How to Report Open Waste & Leaf Burning',
    category: 'reporting',
    summary:
      'Open burning of municipal solid waste, plastic, and horticultural dry leaves is illegal under environmental protection laws.',
    steps: [
      'Locate the smoldering fire from a safe distance upwind.',
      'Take a clear photograph or short video showing the location landmarks and smoke plume.',
      'In India, submit an instant geotagged complaint via the CPCB Sameer App or Ministry Swachhata App.',
      'Call the municipal emergency control room or ward officer helpline.',
      'Request the night security or sanitation supervisor to douse the smoldering embers with water or soil immediately.',
    ],
    officialChannelIndia:
      'CPCB Sameer App / MoHUA Swachhata App / National Grievance Portal (1916)',
    officialChannelGlobal:
      'Local Municipal Code Enforcement / Environmental Protection Agency helpline',
    cautionNotice:
      'Do not confront aggressive individuals alone. Always prioritize personal safety and use official reporting apps.',
  },
  {
    id: 'guide-apartment-rwa',
    title: 'Apartment Complex & RWA Smog Action Plan',
    category: 'neighborhood',
    summary:
      'Practical protocols Resident Welfare Associations (RWAs) can adopt during peak winter smog seasons.',
    steps: [
      'Prohibit all burning of dry garden clippings on society premises; mandate on-site composting pits.',
      'Provide certified electric oil heaters and heavy jackets for night security staff so they do not light coal/wood fires.',
      'Ensure society generator sets comply with dual-fuel or emission control retrofit standards.',
      'Spray treated water on society internal driveways twice daily to suppress resuspended road dust.',
      'Post daily morning BreatheWise AQI advisory in entrance lobbies and resident groups.',
    ],
    cautionNotice:
      'Ensure composting leaves are kept damp to prevent accidental combustion from stray discarded matches.',
  },
  {
    id: 'guide-school-awareness',
    title: 'School & College Morning Sports Smog Protocol',
    category: 'schools',
    summary:
      'Guidelines for parent-teacher associations to protect children during heavy particulate pollution.',
    steps: [
      'Encourage schools to check the BreatheWise 07:00 AM AQI prior to scheduling outdoor morning assemblies.',
      'When AQI exceeds 200 (Poor / Very Poor), suspend strenuous outdoor physical training (PT) and sports matches.',
      'Relocate morning assemblies to covered indoor auditoriums or classrooms.',
      'Ensure school bus drivers avoid prolonged engine idling outside pickup gates while waiting for children.',
    ],
    cautionNotice:
      'Children have higher respiratory rates relative to body weight, making peak smog exposure particularly hazardous to lung development.',
  },
];
