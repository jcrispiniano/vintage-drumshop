import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export function isSupabaseConfigured() {
  return !!(supabaseUrl && supabaseAnonKey && supabaseServiceKey)
}

// createClient lança erro sem URL; sem as variáveis os clientes ficam nulos e todo
// uso deve ser protegido por isSupabaseConfigured() (fallback para lib/products.ts).
export const supabase = (
  isSupabaseConfigured() ? createClient(supabaseUrl!, supabaseAnonKey!) : null
) as SupabaseClient

export const supabaseAdmin = (
  isSupabaseConfigured() ? createClient(supabaseUrl!, supabaseServiceKey!) : null
) as SupabaseClient
