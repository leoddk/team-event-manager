import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [events, setEvents] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchEvents()
  }, [])

  async function fetchEvents() {
    try {
      console.log('Fetching events...')
      const { data, error } = await supabase
        .from('eee')
        .select('*')
      console.log('Supabase response:', { data, error })
      if (error) throw error
      setEvents(data || [])
    } catch (error) {
      console.error('Error fetching events:', error)
      setError(error.message)
    }
  }

  return (
    <div>
      <h1>Welcome to Team Event Manager</h1>
      {error && <p>Error: {error}</p>}
      <p>Supabase connected. Events count: {events.length}</p>
      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <ul>
          {events.map(event => (
            <li key={event.id}>{event.title} - {new Date(event.date).toLocaleDateString()}</li>
          ))}
        </ul>
      )}
    </div>
  )
}