import { AssistantChatRequest, AssistantStructuredResponse } from '@/types/assistant';

/**
 * BreatheWise Deterministic Environmental Intelligence Engine
 * Grounded in actual retrieved AQI data and peer-reviewed environmental health guidelines.
 */
export function generateDeterministicResponse(
  req: AssistantChatRequest
): AssistantStructuredResponse {
  const query = req.message.toLowerCase();
  const aqi = req.currentAqi || 120;
  const dominant = req.dominantPollutant || 'PM2.5';
  const location = req.locationName || 'your area';
  const standard = req.activeStandard || 'CPCB';
  const isHigh = aqi > 150;
  const isSevere = aqi > 300;

  // Question 1: Running / outdoor exercise
  if (
    query.includes('run') ||
    query.includes('exercise') ||
    query.includes('workout') ||
    query.includes('jog') ||
    query.includes('walk')
  ) {
    if (isSevere) {
      return {
        summary: `Outdoor running is strictly NOT recommended in ${location} right now due to Severe pollution (AQI: ${aqi}, dominant: ${dominant}).`,
        aqiContext: `The current AQI in ${location} is ${aqi} (${standard} standard). High concentrations of fine particulate matter (${dominant}) penetrate deep into pulmonary alveoli.`,
        recommendedActions: [
          'Shift your physical exercise completely indoors into a closed, air-filtered room.',
          'Engage in indoor bodyweight training, yoga, or indoor cycling.',
          'If you must leave home, avoid brisk walking and wear a tight-fitting N95/FFP2 respirator.',
        ],
        reasons: [
          'During intense cardiovascular exercise, human inhalation rate increases 6 to 10-fold, drawing deep particulate soot into alveolar tissue.',
          'Severe air pollution triggers acute airway inflammation and systemic cardiovascular strain.',
        ],
        personalImpact:
          'Avoids massive inhalation of particulate matter during high-respiratory effort.',
        environmentalImpact: 'Zero ambient impact.',
        confidence: 'High',
        sources: [
          'Central Pollution Control Board (CPCB) NAQI Guidelines',
          'WHO Global Air Quality Guidelines 2021',
        ],
        safetyCaveats: [
          'This advice provides exposure mitigation guidance and does not replace personal medical advice.',
          'Individuals with asthma or cardiovascular conditions should keep emergency inhalers readily accessible.',
        ],
      };
    }

    if (isHigh) {
      return {
        summary: `Outdoor running or strenuous exercise is not advised right now in ${location} as AQI is ${aqi} (${dominant} elevated).`,
        aqiContext: `Current air quality is Poor/Unhealthy (AQI: ${aqi}). Fine particulates are elevated above safe reference standards.`,
        recommendedActions: [
          'Move cardiovascular workouts indoors; keep room doors and windows closed.',
          'If exercising outdoors is mandatory, wait until midday (1:00 PM - 3:30 PM) when atmospheric mixing layer is deepest.',
          'Lower workout intensity to moderate pacing to keep breathing rates gentle.',
        ],
        reasons: [
          'High ambient particulate levels irritate bronchial passages and induce oxidative stress during heavy respiration.',
        ],
        personalImpact:
          'Substantially reduces total particulate burden deposited in pulmonary tissue.',
        environmentalImpact: 'Zero ambient emissions.',
        confidence: 'High',
        sources: ['CPCB Health Advisories', 'American Thoracic Society Guidelines'],
        safetyCaveats: ['Monitor for any coughing, wheezing, or chest tightness.'],
      };
    }

    return {
      summary: `Air quality in ${location} is currently favorable (AQI: ${aqi}). Outdoor running and exercise are safe for most individuals.`,
      aqiContext: `Current AQI is ${aqi} (${standard} standard). Pollutant levels are within manageable bounds.`,
      recommendedActions: [
        'Proceed with your outdoor run or cycling routine.',
        'Choose tree-lined interior residential avenues or public parks rather than high-traffic arterial roads.',
        'Stay well-hydrated throughout your workout.',
      ],
      reasons: [
        'Ambient particulate levels do not present an acute health risk for outdoor physical exertion.',
      ],
      personalImpact: 'Supports cardiovascular health, endurance, and mental well-being.',
      environmentalImpact: 'Zero fossil fuel transit emissions.',
      confidence: 'High',
      sources: ['CPCB NAQI Guidelines', 'Global Burden of Disease Comparative Risk Assessment'],
      safetyCaveats: ['Highly allergic individuals should monitor localized pollen and dust.'],
    };
  }

  // Question 2: Opening windows / ventilation
  if (
    query.includes('window') ||
    query.includes('ventilate') ||
    query.includes('fresh air') ||
    query.includes('open')
  ) {
    if (isHigh) {
      return {
        summary: `Keep windows closed during early morning and late evening hours in ${location}. Ventilate only briefly during peak solar midday if necessary.`,
        aqiContext: `Current ambient AQI is ${aqi} (${dominant} is the primary concern). Morning boundary-layer inversion pools pollution near ground level.`,
        recommendedActions: [
          'Keep windows, doors, and balcony sliders securely shut during morning rush hours.',
          'If the room feels stuffy, open windows for a brief 10-15 minute flush only between 1:00 PM and 3:00 PM when solar warming dilutes surface smog.',
          'Run an indoor air purifier or split AC on recirculation mode to clean existing indoor air.',
        ],
        reasons: [
          'Opening windows during poor outdoor conditions allows hundreds of thousands of fine soot particles to infiltrate furniture and carpets, creating an indoor pollution trap.',
        ],
        personalImpact: 'Maintains an indoor particle count 50-70% lower than outside street air.',
        environmentalImpact: 'No direct ambient reduction.',
        confidence: 'High',
        sources: [
          'ASHRAE Standard 62.1 Indoor Air Quality',
          'CPCB Winter Smog Management Protocols',
        ],
        safetyCaveats: [
          'If indoor CO2 levels rise in small crowded rooms, perform a brief 5-minute cross-ventilation.',
        ],
      };
    }

    return {
      summary: `Yes, you can safely open windows in ${location} today. Current air quality is favorable (AQI: ${aqi}).`,
      aqiContext: `Current AQI of ${aqi} indicates low ambient pollutant concentrations.`,
      recommendedActions: [
        'Open opposing windows for 20-30 minutes to generate cross-ventilation.',
        'Flush out stagnant indoor carbon dioxide, cooking odors, and residual chemical VOCs.',
      ],
      reasons: [
        'Natural ventilation replenishes indoor oxygen and prevents stale air stagnation without introducing dangerous particulates.',
      ],
      personalImpact: 'Improves mental alertness, reduces indoor CO2, and lowers humidity buildup.',
      environmentalImpact: 'Saves electrical energy by avoiding unnecessary powered exhaust fans.',
      confidence: 'High',
      sources: ['WHO Indoor Air Quality Guidelines', 'CPCB Guidelines'],
      safetyCaveats: ['Close windows if localized street dust or leaf burning occurs nearby.'],
    };
  }

  // Question 3: Commute / travel
  if (
    query.includes('commute') ||
    query.includes('travel') ||
    query.includes('transit') ||
    query.includes('car') ||
    query.includes('bike') ||
    query.includes('metro') ||
    query.includes('bus')
  ) {
    return {
      summary: `For your commute in ${location}, electrified metro or enclosed public transit is recommended today, combined with an N95 mask for open platform waiting.`,
      aqiContext: `Outdoor AQI is ${aqi} (${dominant} dominant). Arterial roads suffer from concentrated vehicular tailpipe emissions and resuspended road dust.`,
      recommendedActions: [
        'Choose the electric metro train or clean public transit over open two-wheelers or private solo driving.',
        'If driving a car, switch your cabin air system to RECIRCULATE mode to block outside exhaust fumes.',
        'Wear a snug-fitting N95 or FFP2 respirator while walking on roadsides or waiting at transit terminals.',
      ],
      reasons: [
        'Open two-wheeler riding directly exposes your airways to diesel particulate matter, NO2, and brake dust.',
        'Mass transit reduces your travel carbon footprint by over 70% compared to solo driving.',
      ],
      personalImpact: 'Shields airways from heavy roadside vehicle plumes.',
      environmentalImpact:
        'Saves an estimated 1.5 - 2.8 kg CO2e per 15 km trip avoided in a petrol car.',
      confidence: 'High',
      sources: ['DEFRA Transport Emissions Database', 'ARAI Indian Driving Cycle Studies'],
      safetyCaveats: [
        'Ensure the N95 mask has a tight metal nose-clip seal; loose cloth masks offer minimal sub-micron filtration.',
      ],
    };
  }

  // Question 4: Severe smog & family protection
  if (
    query.includes('severe') ||
    query.includes('smog') ||
    query.includes('family') ||
    query.includes('children') ||
    query.includes('baby') ||
    query.includes('senior')
  ) {
    return {
      summary: `During severe pollution in ${location} (AQI: ${aqi}), create a clean-air sanctuary room at home and strictly limit outdoor exposure for vulnerable members.`,
      aqiContext: `Ambient AQI is at a critical level (${aqi}). Particulate matter (${dominant}) is severely elevated.`,
      recommendedActions: [
        'Designate a primary bedroom as the household clean-air sanctuary; keep doors and windows sealed.',
        'Run a True HEPA air purifier continuously on medium/high speed in the sanctuary room.',
        'Wet-mop floors twice daily; strictly eliminate indoor incense, scented candles, and unvented frying.',
        'Keep infants, young children, pregnant women, and older adults indoors.',
        'Mandate certified N95 respirators for any household member who must venture outside.',
      ],
      reasons: [
        'Children inhale up to 50% more air per kilogram of body weight than adults, making developing lungs exceptionally susceptible to particulate trauma.',
        'Indoor sealing and continuous HEPA filtration can maintain safe indoor air even when outside air is hazardous.',
      ],
      personalImpact: 'Significantly reduces pediatric and geriatric respiratory distress.',
      environmentalImpact: 'Zero ambient impact.',
      confidence: 'High',
      sources: [
        'CPCB Emergency Smog Response Protocols (GRAP)',
        'UNICEF Clear the Air for Children',
      ],
      safetyCaveats: [
        'Consult a medical doctor if any family member develops persistent coughing, wheezing, or breathlessness.',
      ],
    };
  }

  // Question 5: Indoor air without expensive purifier
  if (
    query.includes('indoor') ||
    query.includes('without purifier') ||
    query.includes('cheap') ||
    query.includes('affordable') ||
    query.includes('purifier')
  ) {
    return {
      summary: `You can dramatically improve indoor air quality using high-impact, zero-cost and low-cost behavioral techniques in ${location}.`,
      aqiContext: `Current outdoor AQI is ${aqi}. The objective is preventing outdoor pollution infiltration while stopping indoor source emissions.`,
      recommendedActions: [
        'Damp-mop floors and wet-wipe surfaces daily with microfiber cloths instead of dry broom sweeping (which throws settled soot back into the air).',
        'Use tight-fitting lids on cooking pans and always run your kitchen exhaust fan before heating cooking oil.',
        'Eliminate all incense sticks (agarbatti), dhoop, mosquito coils, and scented paraffin candles from living areas.',
        'Seal the bottom of exterior doors and leaky window frames with low-cost foam weatherstripping tape.',
        'Time any necessary window opening strictly to sunny midday hours (1:00 PM - 3:00 PM) when outdoor AQI is lowest.',
      ],
      reasons: [
        'A single burning incense stick can spike indoor PM2.5 above 400 µg/m³ within 20 minutes.',
        'Damp dusting traps coarse and fine particles on cloths rather than aerosolizing them into breathing height.',
      ],
      personalImpact:
        'Can reduce indoor PM2.5 concentrations by 30-50% without purchasing electronic equipment.',
      environmentalImpact: 'Zero additional energy consumption.',
      confidence: 'High',
      sources: ['EPA Guide to Air Cleaners in the Home', 'CPCB Guidelines on Indoor Air Quality'],
      safetyCaveats: [
        'While zero-cost measures significantly reduce indoor hazards, an AHAM-certified True HEPA filter remains the gold standard for sub-micron particle removal during severe winter inversions.',
        'Beware of unscientific myths: potted plants and salt lamps do NOT replace mechanical filtration for particle removal.',
      ],
    };
  }

  // Question 6: Meaning of PM2.5 and pollutants
  if (
    query.includes('pm2.5') ||
    query.includes('what is') ||
    query.includes('pollutant') ||
    query.includes('meaning') ||
    query.includes('explain')
  ) {
    return {
      summary: `PM2.5 refers to microscopic airborne particles with aerodynamic diameters smaller than 2.5 micrometers—roughly 30 times thinner than a human hair.`,
      aqiContext: `In ${location}, current PM2.5 is a primary driver of the recorded AQI (${aqi}, ${standard} standard).`,
      recommendedActions: [
        'Monitor PM2.5 levels on BreatheWise to adjust your daily outdoor schedule.',
        'Use certified N95 respirators, which are specifically calibrated to filter particles down to 0.3 microns with >95% efficiency.',
        'Avoid simple cloth masks or surgical masks when PM2.5 is high, as they allow fine aerosols to pass freely through fabric gaps.',
      ],
      reasons: [
        'Because PM2.5 particles are so tiny, our nose hairs and mucous membranes cannot trap them; they penetrate straight into lung alveoli and can cross into the bloodstream.',
      ],
      personalImpact:
        'Understanding pollutant physics empowers effective personal protective decisions.',
      environmentalImpact: 'Awareness drives community demand for emission reductions.',
      confidence: 'High',
      sources: [
        'World Health Organization (WHO) Air Quality Guidelines',
        'US EPA Air Quality Criteria for Particulate Matter',
      ],
      safetyCaveats: [
        'PM2.5 values fluctuate diurnally; always check hourly trends rather than assuming static levels.',
      ],
    };
  }

  // Question 7: Why is air quality becoming worse?
  if (
    query.includes('why') ||
    query.includes('worse') ||
    query.includes('cause') ||
    query.includes('winter') ||
    query.includes('reason')
  ) {
    return {
      summary: `Urban air quality in ${location} deteriorates due to a combination of persistent emission sources (vehicles, construction, biomass burning) and seasonal meteorological temperature inversions.`,
      aqiContext: `Current AQI in ${location} is ${aqi} (${dominant} dominant).`,
      recommendedActions: [
        'Support localized emission cuts: use public transit, carpool, and avoid burning garden waste.',
        'Report open waste burning immediately via municipal helplines (Sameer app / 311).',
        'Plan high-exertion routines around meteorological dispersal hours.',
      ],
      reasons: [
        'During winter and calm weather, cold air near the ground is trapped under a layer of warmer air above (temperature inversion), acting as a physical lid that traps pollutants.',
        'Low surface wind speeds prevent horizontal dispersion, causing vehicular and industrial emissions to pool over urban neighborhoods.',
      ],
      personalImpact: 'Helps anticipate high-risk periods before they arrive.',
      environmentalImpact: 'Community reporting prevents localized toxic smoldering fires.',
      confidence: 'High',
      sources: [
        'CPCB National Clean Air Programme (NCAP)',
        'Copernicus Atmospheric Monitoring Service (CAMS)',
      ],
      safetyCaveats: [
        'Meteorological inversions are natural phenomena; emission reduction at the source is the only durable remedy.',
      ],
    };
  }

  // General / Fallback Environmental Intelligence Response
  return {
    summary: `Air quality in ${location} is currently ${isSevere ? 'Severe' : isHigh ? 'Poor' : 'Moderate'} with an AQI of ${aqi} (${standard} standard, ${dominant} dominant).`,
    aqiContext: `Based on current atmospheric observations for ${location}, ${dominant} is currently the primary pollutant influencing air quality.`,
    recommendedActions: [
      isHigh
        ? 'Minimize prolonged outdoor exertion, particularly during early morning and late evening rush hours.'
        : 'Outdoor activities are generally safe; observe sensible precautions near high-traffic roads.',
      'Check the BreatheWise Hourly Forecast before planning your commute or window ventilation.',
      'Adopt sustainable commuting habits (metro, carpooling) to reduce your personal contribution to urban emissions.',
    ],
    reasons: [
      `Elevated ${dominant} levels irritate the respiratory tract and reduce lung function efficiency during prolonged exposure.`,
      'Strategic timing of outdoor exposure significantly reduces your cumulative daily inhaled dose of particulate soot.',
    ],
    personalImpact:
      'Protects respiratory health and prevents avoidable exposure during peak pollution windows.',
    environmentalImpact:
      'Choosing public transit or carpooling avoids ~1.5 - 2.8 kg CO2e per 15 km urban commute.',
    confidence: 'High',
    sources: [
      'CPCB NAQI Standards',
      'WHO Air Quality Guidelines 2021',
      'DEFRA Transport Emissions Database',
    ],
    safetyCaveats: [
      'This guidance provides environmental exposure mitigation information and does not constitute medical diagnosis.',
      'Follow advisories issued by your local environmental and public health authorities.',
    ],
  };
}
