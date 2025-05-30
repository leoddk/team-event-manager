// components/EEEForm.js
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import styles from '../styles/Home.module.css'

// List of common timezones (you can expand this)
const timezones = [
    'UTC',
    'America/Los_Angeles',
    'America/New_York',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo',
    'Asia/Shanghai',
];

export default function EEEForm({ onEventAdded }) {
    const { user } = useAuth()
    const [title, setTitle] = useState('')
    const [date, setDate] = useState('')
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')
    const [location, setLocation] = useState('')
    const [poc, setPoc] = useState('')
    const [eventTimezone, setEventTimezone] = useState('UTC') // New state for timezone
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!user) {
            setError('User not authenticated')
            return
        }

        // Combine date and time
        const startDateTime = `${date}T${startTime}:00`; // e.g., 2024-01-01T10:00:00
        const endDateTime = `${date}T${endTime}:00`;

        console.log('Submitting event:', {
            title,
            date: startDateTime, // Using combined date and time
            start_time: startDateTime, // also store start/end datetime
            end_time: endDateTime,
            location,
            poc,
            event_timezone: eventTimezone, // Include the timezone
            user_id: user.id,
        })

        try {
            const { data, error } = await supabase
                .from('eee')
                .insert([{
                    title,
                    date: startDateTime, // Save as combined DateTime value
                    start_time: startDateTime, // also store start/end datetime
                    end_time: endDateTime,
                    location,
                    poc,
                    event_timezone: eventTimezone, // Save the timezone
                    user_id: user.id,
                }])

            console.log('Supabase response:', { data, error })
            if (error) throw error

            setTitle('')
            setDate('')
            setStartTime('')
            setEndTime('')
            setLocation('')
            setPoc('')
            setEventTimezone('UTC') // Reset to default timezone
            onEventAdded()
        } catch (error) {
            console.error('Error adding event:', error)
            setError(error.message)
        }
    }

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <h2>Add New Event</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
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
                <label htmlFor="startTime">Start Time:</label>
                <input
                    type="time"
                    id="startTime"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="endTime">End Time:</label>
                <input
                    type="time"
                    id="endTime"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="eventTimezone">Event Timezone:</label>
                <select
                    id="eventTimezone"
                    value={eventTimezone}
                    onChange={(e) => setEventTimezone(e.target.value)}
                >
                    {timezones.map((tz) => (
                        <option key={tz} value={tz}>{tz}</option>
                    ))}
                </select>
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