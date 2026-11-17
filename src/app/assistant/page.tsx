import { AssistantView } from '@/components/features/assistant/assistant-view';

export const metadata = {
  title: 'GenAI Air Quality Assistant — BreatheWise',
  description:
    'Conversational environmental advisor grounded in real atmospheric observations and peer-reviewed safety rules.',
};

export default function AssistantPage() {
  return <AssistantView />;
}
