import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Calendar() {
  const [events, setEvents] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchEvents()
  }, [])

  async function fetchEvents() {
    try {
      const { data, error } = await supabase
        .from('eee')
        .select('*')
      if (error) throw error
      setEvents(data)
    } catch (error) {
      console.error('Error fetching events:', error)
      setError(error.message)
    }
  }

  return (
    <div>
      <h1>Calendar</h1>
      {error && <p>Error: {error}</p>}
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