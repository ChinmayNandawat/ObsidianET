import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Run in Supabase SQL Editor:
// CREATE TABLE user_profiles (
//   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   email TEXT UNIQUE NOT NULL,
//   username TEXT UNIQUE NOT NULL,
//   password_hash TEXT NOT NULL,
//   created_at TIMESTAMPTZ DEFAULT NOW(),
//   last_active TIMESTAMPTZ DEFAULT NOW()
// );
// CREATE TABLE user_sessions (
//   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
//   messages JSONB DEFAULT '[]',
//   profile JSONB DEFAULT '{}',
//   recommendations JSONB DEFAULT '[]',
//   profiling_complete BOOLEAN DEFAULT FALSE,
//   answered_questions INTEGER DEFAULT 0,
//   updated_at TIMESTAMPTZ DEFAULT NOW()
// );
// CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);

// Singleton pattern to prevent multiple instances
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const globalForSupabase = global as typeof global & {
  supabase?: ReturnType<typeof createClient>
};

export const supabase = globalForSupabase.supabase ?? 
  createClient(supabaseUrl, supabaseAnonKey);

if (process.env.NODE_ENV !== 'production') {
  globalForSupabase.supabase = supabase;
}
