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
