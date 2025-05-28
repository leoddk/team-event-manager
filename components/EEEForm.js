import { useState } from 'react'
import { supabase } from '../lib/supabase'
import styles from '../styles/Home.module.css'

export default function EEEForm({ onEventAdded }) {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    // ... (handleSubmit function remains the same)
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>  {/* Apply form class here */}
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