import { supabase } from '../../../lib/supabase'

export default async function handler(req, res) {
  const { id } = req.query
  const { method } = req

  switch (method) {
    case 'GET':
      try {
        const { data, error } = await supabase
          .from('eee')
          .select('*')
          .eq('id', id)
          .single()

        if (error) throw error
        res.status(200).json(data)
      } catch (error) {
        res.status(400).json({ error: error.message })
      }
      break

    case 'PUT':
      try {
        const updates = req.body
        const { data, error } = await supabase
          .from('eee')
          .update(updates)
          .eq('id', id)

        if (error) throw error
        res.status(200).json(data)
      } catch (error) {
        res.status(400).json({ error: error.message })
      }
      break

    default:
      res.setHeader('Allow', ['GET', 'PUT'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}