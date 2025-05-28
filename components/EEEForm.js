// components/EEEForm.js
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import styles from '../styles/Home.module.css'

export default function EEEForm({ onEventAdded }) {
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('Submitting event:', { title, date })
    try {
      const { data, error } = await supabase
        .from('eee')
        .insert([{ title, date, user_id: user.id }])
      console.log('Supabase response:', { data, error })
      if (error) throw error
      setTitle('')
      setDate('')
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
        <label htmlFor="title">Title:</label>
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
      <button type="submit">Add Event</button>
    </form>
  )
}