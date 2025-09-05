// Home Services Knowledge Base for Enhanced AI Responses
export interface ServiceQuestion {
  category: string;
  issue: string;
  questions: string[];
  followUpQuestions: string[];
  budgetRanges: Record<string, string>;
  timelineEstimates: Record<string, string>;
  technicalDetails: string[];
}

export const homeServicesKnowledge: Record<string, ServiceQuestion> = {
  'plumbing_leak': {
    category: 'plumbing',
    issue: 'leak',
    questions: [
      'Where exactly is the leak located? (faucet base, pipe joint, under sink, etc.)',
      'Is this a constant drip or does it only happen when the faucet is in use?',
      'Have you noticed any water damage, staining, or mold around the area?',
      'How long has this been happening?',
      'Have you tried tightening any connections or applying sealant?'
    ],
    followUpQuestions: [
      'What type of faucet do you have? (single-handle, double-handle, touchless)',
      'Is this a new installation or an older fixture?',
      'Are you experiencing any changes in water pressure?'
    ],
    budgetRanges: {
      'simple_repair': '$75-$150',
      'faucet_replacement': '$150-$400',
      'pipe_repair': '$200-$500',
      'major_plumbing': '$500-$1500'
    },
    timelineEstimates: {
      'simple_repair': '1-2 hours',
      'faucet_replacement': '2-4 hours',
      'pipe_repair': '4-8 hours',
      'major_plumbing': '1-3 days'
    },
    technicalDetails: [
      'Check for loose connections',
      'Inspect for worn washers or O-rings',
      'Look for pipe corrosion or cracks',
      'Verify shut-off valve functionality'
    ]
  },
  
  'plumbing_drain': {
    category: 'plumbing',
    issue: 'drain',
    questions: [
      'Which drains are affected? (kitchen sink, bathroom sink, shower, toilet)',
      'How long has this been happening?',
      'Have you tried any DIY solutions like drain cleaner or a plunger?',
      'Are there any unusual smells or gurgling sounds?',
      'Is the water backing up or just draining slowly?'
    ],
    followUpQuestions: [
      'What type of drain cleaner have you used?',
      'Are multiple drains affected at the same time?',
      'Have you noticed any changes in water pressure?'
    ],
    budgetRanges: {
      'drain_cleaning': '$100-$200',
      'snake_clearing': '$150-$300',
      'pipe_repair': '$300-$800',
      'sewer_line_repair': '$800-$3000'
    },
    timelineEstimates: {
      'drain_cleaning': '1-2 hours',
      'snake_clearing': '2-4 hours',
      'pipe_repair': '4-8 hours',
      'sewer_line_repair': '1-3 days'
    },
    technicalDetails: [
      'Check for hair and debris buildup',
      'Inspect pipe condition and alignment',
      'Test drain flow and pressure',
      'Look for tree root intrusion'
    ]
  },

  'electrical_outlet': {
    category: 'electrical',
    issue: 'outlet',
    questions: [
      'Is the outlet completely dead or does it work intermittently?',
      'Are other outlets in the same room affected?',
      'Do you have GFCI outlets that might have tripped?',
      'Is this in a kitchen, bathroom, or outdoor area?',
      'Have you checked the circuit breaker panel?'
    ],
    followUpQuestions: [
      'What type of devices were you trying to plug in?',
      'Are there any burning smells or unusual sounds?',
      'Is this a new issue or has it been ongoing?'
    ],
    budgetRanges: {
      'outlet_repair': '$100-$200',
      'outlet_replacement': '$150-$300',
      'gfci_installation': '$200-$400',
      'circuit_repair': '$300-$800'
    },
    timelineEstimates: {
      'outlet_repair': '1-2 hours',
      'outlet_replacement': '2-4 hours',
      'gfci_installation': '2-4 hours',
      'circuit_repair': '4-8 hours'
    },
    technicalDetails: [
      'Test outlet with multimeter',
      'Check GFCI reset buttons',
      'Inspect circuit breaker panel',
      'Verify proper grounding'
    ]
  },

  'electrical_lighting': {
    category: 'electrical',
    issue: 'lighting',
    questions: [
      'What type of lighting are you installing? (recessed, pendant, chandelier, track)',
      'Is there existing electrical in the ceiling or will new wiring be needed?',
      'What\'s your ceiling height and room dimensions?',
      'Do you want dimmable lights and smart controls?',
      'What\'s your preferred color temperature? (warm, cool, daylight)'
    ],
    followUpQuestions: [
      'How many lights are you planning to install?',
      'Do you have a specific spacing preference?',
      'Are you looking for energy-efficient LED options?'
    ],
    budgetRanges: {
      'recessed_lighting': '$200-$500 per light',
      'pendant_lighting': '$300-$800 per fixture',
      'chandelier_installation': '$400-$1200',
      'track_lighting': '$150-$400 per fixture'
    },
    timelineEstimates: {
      'recessed_lighting': '2-4 hours per light',
      'pendant_lighting': '1-2 hours per fixture',
      'chandelier_installation': '2-4 hours',
      'track_lighting': '1-2 hours per fixture'
    },
    technicalDetails: [
      'Calculate proper spacing and coverage',
      'Determine electrical load requirements',
      'Plan for proper insulation clearance',
      'Consider dimmer switch compatibility'
    ]
  },

  'painting_interior': {
    category: 'painting',
    issue: 'interior',
    questions: [
      'What\'s the approximate square footage of the room(s)?',
      'Are you looking for walls, ceilings, or trim painting?',
      'Do you have a specific color scheme in mind?',
      'What\'s the current condition of the walls? (smooth, textured, damaged)',
      'Do you need color consultation included?'
    ],
    followUpQuestions: [
      'Are there any furniture or fixtures that need to be moved?',
      'Do you want primer applied or just paint?',
      'What\'s your preferred finish? (flat, eggshell, satin, semi-gloss)'
    ],
    budgetRanges: {
      'single_room': '$300-$800',
      'multiple_rooms': '$800-$2000',
      'whole_house': '$2000-$8000',
      'premium_finish': '$500-$1500 per room'
    },
    timelineEstimates: {
      'single_room': '1-2 days',
      'multiple_rooms': '3-5 days',
      'whole_house': '1-2 weeks',
      'premium_finish': '2-3 days per room'
    },
    technicalDetails: [
      'Assess wall condition and prep needs',
      'Calculate paint quantity and coverage',
      'Plan for proper ventilation and safety',
      'Consider furniture protection and cleanup'
    ]
  },

  'hvac_repair': {
    category: 'hvac',
    issue: 'repair',
    questions: [
      'What type of HVAC system do you have? (central air, heat pump, furnace)',
      'What specific problem are you experiencing? (not cooling, not heating, strange noises)',
      'When did you last have the system serviced?',
      'Have you checked or changed the air filter recently?',
      'Are all rooms affected or just certain areas?'
    ],
    followUpQuestions: [
      'What\'s the age of your HVAC system?',
      'Have you noticed any unusual smells or sounds?',
      'Are your energy bills higher than usual?'
    ],
    budgetRanges: {
      'filter_replacement': '$20-$50',
      'thermostat_repair': '$100-$300',
      'refrigerant_charge': '$200-$500',
      'major_repair': '$500-$2000',
      'system_replacement': '$3000-$8000'
    },
    timelineEstimates: {
      'filter_replacement': '30 minutes',
      'thermostat_repair': '1-2 hours',
      'refrigerant_charge': '2-4 hours',
      'major_repair': '4-8 hours',
      'system_replacement': '1-2 days'
    },
    technicalDetails: [
      'Check refrigerant levels and leaks',
      'Inspect electrical connections',
      'Test thermostat functionality',
      'Clean coils and ductwork'
    ]
  }
};

export function getServiceQuestions(serviceType: string, issue: string): ServiceQuestion | null {
  const key = `${serviceType}_${issue}`;
  return homeServicesKnowledge[key] || null;
}

export function getRelevantQuestions(serviceType: string, issue: string): string[] {
  const service = getServiceQuestions(serviceType, issue);
  return service ? service.questions : [];
}

export function getBudgetRange(serviceType: string, issue: string, complexity: string): string {
  const service = getServiceQuestions(serviceType, issue);
  return service?.budgetRanges[complexity] || 'Contact for estimate';
}

export function getTimelineEstimate(serviceType: string, issue: string, complexity: string): string {
  const service = getServiceQuestions(serviceType, issue);
  return service?.timelineEstimates[complexity] || 'Contact for estimate';
}
