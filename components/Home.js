import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import EEEForm from './EEEForm'
import styles from '../styles/Home.module.css'

export default function Home() {
  const [events, setEvents] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchEvents()
  }, [])

  async function fetchEvents() {
    // ... (fetchEvents function remains the same)
  }

  return (
    <div className={styles.container}>  {/* Apply container class here */}
      <h1>Welcome to Team Event Manager</h1>
      {error && <p style={{color: 'red'}}>Error: {error}</p>}
      <div className={styles.form}>  {/* Apply form class here */}
        <EEEForm onEventAdded={fetchEvents} />
      </div>
      <h2>Upcoming Events</h2>
      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <ul className={styles.eventList}>  {/* Apply eventList class here */}
          {events.map(event => (
            <li key={event.id}>{event.title} - {new Date(event.date).toLocaleDateString()}</li>
          ))}
        </ul>
      )}
    </div>
  )
}