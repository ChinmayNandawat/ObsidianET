import { createFallbackPayload } from '../dummyData';
import { PersonalizationPayload } from '../../types';

const sessionStore = new Map<string, PersonalizationPayload>();

export function getOrCreateSession(sessionId?: string) {
  const id = sessionId || crypto.randomUUID();
  if (!sessionStore.has(id)) {
    sessionStore.set(id, createFallbackPayload(id));
  }
  return sessionStore.get(id)!;
}

export function saveSession(session: PersonalizationPayload) {
  sessionStore.set(session.sessionId, session);
  return session;
}
