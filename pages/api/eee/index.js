import { supabase } from '../../../lib/supabase'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('eees')
      .select('*')
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }
  // Add POST method for creating new EEEs
}