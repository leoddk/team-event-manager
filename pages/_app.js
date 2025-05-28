import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

function MyApp({ Component, pageProps }) {
  const [supabaseClient, setSupabaseClient] = useState(null)

  useEffect(() => {
    setSupabaseClient(supabase)
  }, [])

  return (
    <Component {...pageProps} supabase={supabaseClient} />
  )
}

export default MyApp