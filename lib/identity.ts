/*
-- CREATE TABLE user_profiles (
--   id TEXT PRIMARY KEY,
--   username TEXT UNIQUE,
--   profile JSONB,
--   messages JSONB,
--   recommendations JSONB,
--   profiling_complete BOOLEAN DEFAULT FALSE,
--   updated_at TIMESTAMPTZ DEFAULT NOW()
-- );

*/

import { UserIdentity, UserProfile, Message } from '../types';
import { supabase } from './server/supabase';

// Core ID generation
export function generateCoreId(username: string): string {
  const cleanUsername = username.toUpperCase().slice(0, 8);
  const randomHex = Array.from({ length: 4 }, () => 
    Math.floor(Math.random() * 16).toString(16).toUpperCase()
  ).join('');
  return `OX-${cleanUsername}-${randomHex}`;
}

// Local storage helpers
export function saveIdentityLocal(identity: UserIdentity): void {
  try {
    localStorage.setItem('obsidian_identity', JSON.stringify(identity));
    localStorage.setItem('obsidian_profile', JSON.stringify(identity.profile));
    localStorage.setItem('obsidian_messages', JSON.stringify(identity.messages));
  } catch (error) {
    console.warn('Failed to save identity to localStorage:', error);
  }
}

export function loadIdentityLocal(): UserIdentity | null {
  try {
    const stored = localStorage.getItem('obsidian_identity');
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.warn('Failed to load identity from localStorage:', error);
    return null;
  }
}

// Supabase helpers
export async function saveIdentitySupabase(identity: UserIdentity): Promise<void> {
  if (!identity?.coreId) {
    console.warn('saveIdentitySupabase called with no coreId');
    return;
  }

  if (!supabase) return;

  try {
    await supabase.from('user_profiles').upsert({
      id: identity.coreId,
      username: identity.username,
      profile: JSON.stringify(identity.profile),
      messages: JSON.stringify(identity.messages),
      recommendations: JSON.stringify(identity.recommendations),
      profiling_complete: identity.profilingComplete,
      updated_at: new Date().toISOString()
    });
  } catch (error) {
    console.warn('Failed to save identity to Supabase:', error);
  }
}

export async function loadIdentitySupabase(coreId: string): Promise<UserIdentity | null> {
  if (!coreId || coreId.trim() === '') {
    console.warn('loadIdentitySupabase called with empty coreId');
    return null;
  }

  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', coreId)
      .single();

    if (error || !data) return null;

    return {
      coreId: data.id,
      username: data.username,
      createdAt: data.created_at || new Date().toISOString(),
      lastActive: data.updated_at,
      profile: data.profile ? JSON.parse(data.profile) : null,
      messages: data.messages ? JSON.parse(data.messages) : [],
      profilingComplete: data.profiling_complete || false,
      recommendations: data.recommendations ? JSON.parse(data.recommendations) : []
    };
  } catch (error) {
    console.warn('Failed to load identity from Supabase:', error);
    return null;
  }
}

// Combined functions
export async function saveIdentity(identity: UserIdentity): Promise<void> {
  // Save to localStorage first (instant)
  saveIdentityLocal(identity);
  
  // Then save to Supabase (async)
  await saveIdentitySupabase(identity);
}

export async function loadIdentity(coreId: string): Promise<UserIdentity | null> {
  // Try Supabase first
  const supabaseIdentity = await loadIdentitySupabase(coreId);
  if (supabaseIdentity) return supabaseIdentity;
  
  // Fall back to localStorage
  return loadIdentityLocal();
}
