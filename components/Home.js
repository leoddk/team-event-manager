// components/Home.js
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import EEEForm from './EEEForm'
import styles from '../styles/Home.module.css'

export default function Home() {
  const { user, signIn, signOut, signUp } = useAuth()
  const [events, setEvents] = useState([])
  const [error, setError] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (user) {
      fetchEvents()
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

  const handleSignIn = async (e) => {
    e.preventDefault()
    try {
      const { error } = await signIn({ email, password })
      if (error) throw error
    } catch (error) {
      alert(error.error_description || error.message)
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    try {
      const { error } = await signUp({ email, password })
      if (error) throw error
      alert('Check your email for the confirmation link!')
    } catch (error) {
      alert(error.error_description || error.message)
    }
  }

  if (!user) {
    return (
      <div className={styles.authContainer}>
        <form onSubmit={handleSignIn} className={styles.form}>
          <h1>Team Event Manager</h1>
          <p>Sign in to add and view events</p>
          <div>
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <button className={styles.button} type="submit">
              Sign In
            </button>
          </div>
          <div>
            <button className={styles.button} onClick={handleSignUp}>
              Sign Up
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <h1>Welcome to Team Event Manager</h1>
      <button onClick={signOut} className={styles.button}>Sign Out</button>
      {error && <p style={{color: 'red'}}>Error: {error}</p>}
      <div className={styles.form}>
        <EEEForm onEventAdded={fetchEvents} />
      </div>
      <h2>Upcoming Events</h2>
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