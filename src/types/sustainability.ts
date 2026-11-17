export type SustainableCategory = 'transport' | 'energy' | 'community';

export interface SustainableRecommendation {
  id: string;
  category: SustainableCategory;
  title: string;
  actionSummary: string;
  whyItMatters: string;
  personalBenefit: string;
  environmentalImpact: {
    estimatedSaving: string;
    metric: string;
    factorBasis: string;
  };
  limitationsAndAssumptions: string;
  difficulty: 'Easy' | 'Moderate' | 'Involved';
  practicalSteps: string[];
}
