export interface CommunityChallenge {
  id: string;
  title: string;
  badge: string;
  durationDays: number;
  goal: string;
  whyItMatters: string;
  personalContribution: string;
  collectiveImpactExplanation: string;
  steps: {
    dayNumber: number;
    title: string;
    description: string;
    actionableTip: string;
    completed: boolean;
  }[];
  category: 'commute' | 'home' | 'waste' | 'awareness';
}

export interface CommunityActionGuide {
  id: string;
  title: string;
  category: 'reporting' | 'neighborhood' | 'schools' | 'workplaces';
  summary: string;
  steps: string[];
  officialChannelIndia?: string;
  officialChannelGlobal?: string;
  cautionNotice: string;
}
