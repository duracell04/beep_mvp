import { createClient } from '@supabase/supabase-js'
import type { Database } from '../supabase/types.generated'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// TODO: add auth later
