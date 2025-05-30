import { supabase } from '../../../lib/supabase'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Handle POST request to create a new event
    try {
      const { title, date, location, poc, event_timezone } = req.body;
      console.log('Received data:', { title, date, location, poc, event_timezone });

      const { data, error } = await supabase
        .from('eee')
        .insert([{
          title,
          date,
          location,
          poc,
          event_timezone,
          user_id: req.body.user_id // Assuming user_id is passed in the request body
        }]);

      if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({ error: error.message });
      }

      console.log('Created event:', data);
      return res.status(200).json({ message: 'Event created successfully!' });
    } catch (error) {
      console.error('Server error:', error);
      return res.status(500).json({ error: 'Failed to create event' });
    }
  } else if (req.method === 'GET') {
    // Handle GET request to fetch events
    try {
      const { data, error } = await supabase
        .from('eee')
        .select('*');

      if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({ error: error.message });
      }

      console.log('Fetched events:', data);
      return res.status(200).json(data);
    } catch (error) {
      console.error('Server error:', error);
      return res.status(500).json({ error: 'Failed to fetch events' });
    }
  } else {
    // Handle other methods
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}