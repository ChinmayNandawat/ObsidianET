export interface SupabaseLikeClient {
  from: (table: string) => {
    upsert: (payload: Record<string, unknown>) => {
      throwOnError: () => Promise<unknown>;
    };
  };
}

export function getSupabaseServerClient(): SupabaseLikeClient | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return {
    from: () => ({
      upsert: (payload: Record<string, unknown>) => ({
        throwOnError: async () => payload,
      }),
    }),
  };
}
