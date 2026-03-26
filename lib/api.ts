import { Message, Recommendation, UserProfile } from '../types';
import { DUMMY_MESSAGES, DUMMY_RECOMMENDATIONS, DUMMY_PROFILE } from './dummyData';

export async function analyzeUserMessage(message: string): Promise<string> {
  // Simulate AI thinking delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  return `I have analyzed your request: "${message}". Based on the current ET market flux, I recommend exploring our high-yield obsidian pools.`;
}

export async function getAIResponse(messages: Message[]): Promise<Message> {
  const lastMessage = messages[messages.length - 1];
  const responseContent = await analyzeUserMessage(lastMessage.content);
  
  return {
    id: Math.random().toString(36).substring(7),
    role: 'assistant',
    content: responseContent,
    timestamp: new Date(),
    status: 'complete'
  };
}

export async function getRecommendations(profile: UserProfile): Promise<Recommendation[]> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  return DUMMY_RECOMMENDATIONS;
}

export async function getUserProfile(): Promise<UserProfile> {
  return DUMMY_PROFILE;
}

export async function getHubState(): Promise<import('@/types').HubState> {
  // Keep the existing sessionId acquisition pattern used in this file
  const sessionId = (globalThis as any)?.localStorage?.getItem?.('sessionId') ?? undefined;

  try {
    const res = await fetch(`/api/hub?sessionId=${encodeURIComponent(String(sessionId))}`, {
      method: 'GET',
    });

    if (!res.ok) {
      throw new Error(`Non-ok response: ${res.status}`);
    }

    const data = (await res.json()) as import('@/types').HubState;
    return data;
  } catch {
    const { DEFAULT_HUB_ITEMS } = await import('@/lib/dummyData');
    return { hubItems: DEFAULT_HUB_ITEMS, profile: undefined, isPersonalized: false };
  }
}

export function isHubPersonalized(hubState: import('@/types').HubState): boolean {
  return hubState.isPersonalized === true && hubState.hubItems.length > 0;
}
