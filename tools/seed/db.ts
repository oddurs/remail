/**
 * Standalone Supabase client for the seed toolchain.
 * No dependency on Next.js — uses env vars directly.
 */

import { createClient } from "@supabase/supabase-js";
import type { Database } from "../../src/lib/supabase/types";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing env var ${name}. Run with --env-file=.env.local or set it in your environment.`
    );
  }
  return value;
}

export function createSeedClient() {
  const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");

  return createClient<Database>(url, serviceKey, {
    auth: { persistSession: false },
  });
}
