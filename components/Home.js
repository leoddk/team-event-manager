// components/Home.js
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import EEEForm from './EEEForm'
import styles from '../styles/Home.module.css'

export default function Home() {
  const { user, signOut } = useAuth()
  const [events, setEvents] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    if (user) {
      console.log('User is authenticated, fetching events')
      fetchEvents()
    } else {
      console.log('User is not authenticated')
    }
  }, [user])

  async function fetchEvents() {
    try {
      const { data, error } = await supabase
        .from('eee')
        .select('*')
        .order('date', { ascending: true })
      console.log('Fetched events:', data)
      if (error) throw error
      setEvents(data || [])
    } catch (error) {
      console.error('Error fetching events:', error)
      setError(error.message)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      console.log('User signed out')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (!user) {
    return <p>Please sign in to view and add events.</p>
  }

  return (
    <div className={styles.container}>
      <h1>Welcome to Team Event Manager</h1>
      <button onClick={handleSignOut} className={styles.button}>Sign Out</button>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <div className={styles.form}>
        <EEEForm onEventAdded={fetchEvents} />
      </div>
      <h2>Your Events</h2>
      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <ul className={styles.eventList}>
          {events.map(event => (
            <li key={event.id}>{event.title} - {new Date(event.date).toLocaleDateString()}</li>
          ))}
        </ul>
      )}
    </div>
  )
}