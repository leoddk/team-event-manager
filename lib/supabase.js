import { createClient } from '@supabase/supabase-js'

let supabase

if (typeof window !== 'undefined') {
  supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

export { supabase }