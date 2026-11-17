export type IndoorBudgetTier = 'Free' | 'Low Budget' | 'Moderate Budget';

export interface IndoorGuideItem {
  id: string;
  category: 'filtration' | 'ventilation' | 'sources' | 'maintenance';
  title: string;
  shortDescription: string;
  detailedGuide: string[];
  budgetTier: IndoorBudgetTier;
  scientificBasis: string;
  limitationsAndCaveats: string;
  dos: string[];
  donts: string[];
}

export interface IndoorChecklistItem {
  id: string;
  label: string;
  category: 'filtration' | 'ventilation' | 'sources' | 'cleaning';
  timingHint: string;
  importance: 'Essential' | 'Recommended' | 'Good Practice';
  completed: boolean;
  scientificTip: string;
}
