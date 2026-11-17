export interface AssistantMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
  structuredResponse?: AssistantStructuredResponse;
  isDeterministicFallback?: boolean;
  providerNotice?: string;
}

export interface AssistantStructuredResponse {
  summary: string;
  aqiContext: string;
  recommendedActions: string[];
  reasons: string[];
  personalImpact: string;
  environmentalImpact: string;
  confidence: 'High' | 'Moderate' | 'Low';
  sources: string[];
  safetyCaveats: string[];
}

export interface AssistantChatRequest {
  message: string;
  locationName: string;
  currentAqi: number;
  dominantPollutant: string;
  activeStandard: string;
  lifestyle?: string;
  transport?: string;
  hasSensitiveMembers?: boolean;
}
