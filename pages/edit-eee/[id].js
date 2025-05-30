import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/auth'
import styles from '../../styles/Home.module.css'

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

export default function EditEEE() {
    const router = useRouter()
    const { id } = router.query
    const { user } = useAuth()
    
    const [eee, setEEE] = useState(null)
    const [title, setTitle] = useState('')
    const [date, setDate] = useState('')
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')
    const [location, setLocation] = useState('')
    const [poc, setPoc] = useState('')
    const [eventTimezone, setEventTimezone] = useState('UTC')
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (id) fetchEEE()
    }, [id])

    async function fetchEEE() {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('eee')
                .select('*')
                .eq('id', id)
                .single()

            if (error) {
                console.error('Error fetching event:', error)
                setError(error.message)
            } else {
                console.log('Fetched event:', data)
                setEEE(data)
                setTitle(data.title || '')
                
                // Handle date and time formatting
                if (data.date) {
                    const dateObj = new Date(data.date)
                    setDate(dateObj.toISOString().split('T')[0])
                }
                
                if (data.start_time) {
                    const startTimeObj = new Date(data.start_time)
                    setStartTime(startTimeObj.toTimeString().slice(0, 5))
                }
                
                if (data.end_time) {
                    const endTimeObj = new Date(data.end_time)
                    setEndTime(endTimeObj.toTimeString().slice(0, 5))
                }
                
                setLocation(data.location || '')
                setPoc(data.poc || '')
                setEventTimezone(data.event_timezone || 'UTC')
            }
        } catch (err) {
            console.error("Unexpected error fetching event", err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()
        if (!user) {
            setError('User not authenticated')
            return
        }

        try {
            // Combine date and time for storing
            const startDateTime = `${date}T${startTime}:00`
            const endDateTime = `${date}T${endTime}:00`
            
            const updates = {
                title,
                date: startDateTime,
                start_time: startDateTime,
                end_time: endDateTime,
                location,
                poc,
                event_timezone: eventTimezone
            }
            
            console.log('Updating event with:', updates)
            
            const { error } = await supabase
                .from('eee')
                .update(updates)
                .eq('id', id)

            if (error) throw error
            
            alert('Event updated successfully!')
            router.push('/')
        } catch (error) {
            console.error('Error updating event:', error)
            setError(error.message)
        }
    }

    if (loading) return <div>Loading...</div>
    if (error && !eee) return <div>Error: {error}</div>

    return (
        <div className={styles.container}>
            <h1>Edit Event</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            <form onSubmit={handleSubmit} className={styles.form}>
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
                
                <button type="submit">Save Changes</button>
                <button type="button" onClick={() => router.push('/')}>Cancel</button>
            </form>
        </div>
    )
}