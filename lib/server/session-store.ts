import { createFallbackPayload } from '../dummyData';
import { PersonalizationPayload } from '../../types';

// Use a true global in Next.js development so the cache isn't wiped out on every Hot Module Replacement (HMR)
const globalForSessionStore = global as unknown as {
  sessionStore: Map<string, PersonalizationPayload> | undefined;
};

const sessionStore = globalForSessionStore.sessionStore ?? new Map<string, PersonalizationPayload>();

if (process.env.NODE_ENV !== 'production') {
  globalForSessionStore.sessionStore = sessionStore;
}

export function getSession(sessionId: string): PersonalizationPayload | undefined {
  return sessionStore.get(sessionId);
}

export function getOrCreateSession(sessionId?: string): PersonalizationPayload {
  const id = sessionId || crypto.randomUUID();
  let session = sessionStore.get(id);
  
  if (!session) {
    session = createFallbackPayload(id);
    // Ensure the ID matches what we requested/created
    session.sessionId = id;
    sessionStore.set(id, session);
  }
  
  return session;
}

export function saveSession(session: PersonalizationPayload) {
  if (session.sessionId) {
    sessionStore.set(session.sessionId, session);
  }
  return session;
}
