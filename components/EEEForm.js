// components/EEEForm.js
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import styles from '../styles/Home.module.css'

export default function EEEForm({ onEventAdded }) {
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [location, setLocation] = useState('')
  const [poc, setPoc] = useState('') // Add POC state
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      setError('User not authenticated')
      return
    }
    console.log('Submitting event:', { title, date, location, poc, user_id: user.id })
    try {
      const { data, error } = await supabase
        .from('eee')
        .insert([{ title, date, location, poc, user_id: user.id }])
      console.log('Supabase response:', { data, error })
      if (error) throw error
      setTitle('')
      setDate('')
      setLocation('')
      setPoc('') // Clear POC field
      onEventAdded()
    } catch (error) {
      console.error('Error adding event:', error)
      setError(error.message)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2>Add New Event</h2>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <div>
        <label htmlFor="title">Event Name:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="date">Date:</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="location">Location:</label>
        <input
          type="text"
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="poc">Point of Contact:</label>
        <input
          type="text"
          id="poc"
          value={poc}
          onChange={(e) => setPoc(e.target.value)}
          placeholder="Name of contact person"
        />
      </div>
      <button type="submit">Add Event</button>
    </form>
  )
}