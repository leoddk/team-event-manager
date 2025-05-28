import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [events, setEvents] = useState([])

  useEffect(() => {
    fetchEvents()
  }, [])

  async function fetchEvents() {
    const { data, error } = await supabase
      .from('eee')
      .select('*')
    if (error) console.error('Error fetching events:', error)
    else setEvents(data)
  }

  return (
    <div>
      <h1>Welcome to Team Event Manager</h1>
      <ul>
        {events.map(event => (
          <li key={event.id}>{event.title}</li>
        ))}
      </ul>
    </div>
  )
}