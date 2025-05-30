// pages/api/eee/index.js
import { supabase } from '../../../lib/supabase'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('eee')
        .select('*')
        .order('date', { ascending: true });
      
      if (error) throw error;
      
      return res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      return res.status(500).json({ error: error.message });
    }
  }
  
  // Handle POST request (create new event)
  if (req.method === 'POST') {
    try {
      const { title, date, start_time, end_time, location, poc, event_timezone, user_id } = req.body;
      
      const { data, error } = await supabase
        .from('eee')
        .insert([{ 
          title, 
          date, 
          start_time, 
          end_time, 
          location, 
          poc, 
          event_timezone,
          user_id 
        }]);
        
      if (error) throw error;
      
      return res.status(201).json(data);
    } catch (error) {
      console.error('Error creating event:', error);
      return res.status(500).json({ error: error.message });
    }
  }
  
  // Return 405 for other methods
  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}