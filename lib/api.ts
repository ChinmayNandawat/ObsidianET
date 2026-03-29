import { PersonalizationPayload } from '../types';

const SESSION_STORAGE_KEY = 'obsidian-et-session-id';

function getStoredSessionId() {
  if (typeof window === 'undefined') return undefined;
  return window.localStorage.getItem(SESSION_STORAGE_KEY) || undefined;
}

function storeSessionId(sessionId: string) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
}

export async function getSessionState(): Promise<PersonalizationPayload> {
  const sessionId = getStoredSessionId();
  const query = sessionId ? `?sessionId=${sessionId}` : '';
  const response = await fetch(`/api/session${query}`, { cache: 'no-store' });
  const data = await response.json();
  storeSessionId(data.sessionId);
  return data;
}

export async function sendChatMessage(message: string): Promise<PersonalizationPayload> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId: getStoredSessionId(), message }),
  });
  const data = await response.json();
  storeSessionId(data.sessionId);
  return data;
}

export async function getHubState() {
  const sessionId = getStoredSessionId();
  const query = sessionId ? `?sessionId=${sessionId}` : '';
  const response = await fetch(`/api/hub${query}`, { cache: 'no-store' });
  return response.json();
}

export async function getSimulationState() {
  const sessionId = getStoredSessionId();
  const query = sessionId ? `?sessionId=${sessionId}` : '';
  const response = await fetch(`/api/simulation${query}`, { cache: 'no-store' });
  return response.json();
}

export async function getSimulationReasoning(optimistic: string, expected: string) {
  const sessionId = getStoredSessionId();
  const query = sessionId ? `?sessionId=${sessionId}` : '';
  const response = await fetch(`/api/simulation-reasoning${query}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ optimistic, expected }),
  });
  return response.json();
}

export async function recalculateSimulation() {
  const sessionId = getStoredSessionId();
  const query = sessionId ? `?sessionId=${sessionId}` : '';
  const response = await fetch(`/api/simulation-recalculate${query}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  return response.json();
}

export async function sendSimulationChatMessage(message: string): Promise<{
  response: string;
  category: 'guidance' | 'analysis' | 'explanation';
  timestamp: string;
}> {
  const sessionId = getStoredSessionId();
  const query = sessionId ? `?sessionId=${sessionId}` : '';
  const response = await fetch(`/api/simulation-chat${query}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });
  return response.json();
}

export async function sendFinancialChatMessage(message: string): Promise<{
  response: string;
  category: 'stocks' | 'trading' | 'investment' | 'analysis' | 'guidance';
  timestamp: string;
}> {
  const response = await fetch('/api/financial-chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to get financial chat response');
  }
  
  return response.json();
}

export async function isHubPersonalized() {
  const sessionId = getStoredSessionId();
  const query = sessionId ? `?sessionId=${sessionId}` : '';
  const response = await fetch(`/api/hub/personalized${query}`, { cache: 'no-store' });
  return response.json();
}

export async function saveHubTrack(itemId: string, action: 'save' | 'remove') {
  const sessionId = getStoredSessionId();
  const query = sessionId ? `?sessionId=${sessionId}` : '';
  const response = await fetch(`/api/hub/track${query}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ itemId, action }),
  });
  return response.json();
}
