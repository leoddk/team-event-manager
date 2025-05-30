import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../../../lib/supabase'
import { useAuth } from '../../../../lib/auth'
import styles from '../../../../styles/Home.module.css'

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
    const [eee, setEEE] = useState(null)
    const router = useRouter()
    const { id } = router.query
    const { user } = useAuth();

    const [title, setTitle] = useState('')
    const [date, setDate] = useState('')
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')
    const [location, setLocation] = useState('')
    const [poc, setPoc] = useState('')
    const [eventTimezone, setEventTimezone] = useState('UTC')
    const [error, setError] = useState(null)

    useEffect(() => {
        if (id) {
            fetchEEE();
        }
    }, [id]);

    async function fetchEEE() {
        try {
            const { data, error } = await supabase
                .from('eee')
                .select('*')
                .eq('id', id)
                .single()

            if (error) {
                console.error('Error fetching EEE:', error)
                setError(error.message);
            } else {
                setEEE(data);
                setTitle(data.title || '');
                setDate(data.date ? data.date.substring(0, 10) : '');
                setStartTime(data.start_time ? data.start_time.substring(11, 16) : '');
                setEndTime(data.end_time ? data.end_time.substring(11, 16) : '');
                setLocation(data.location || '');
                setPoc(data.poc || '');
                setEventTimezone(data.event_timezone || 'UTC');
            }
        } catch (err) {
            console.error("Unexpected error fetching event", err);
            setError(err.message);
        }
    }

    async function updateEEE() {
      if (!user) {
        setError('User not authenticated')
        return
      }

      const startDateTime = `${date}T${startTime}:00`;
      const endDateTime = `${date}T${endTime}:00`;

        try {
            const { data, error } = await supabase
                .from('eee')
                .update({
                    title: title,
                    date: startDateTime,
                    start_time: startDateTime,
                    end_time: endDateTime,
                    location: location,
                    poc: poc,
                    event_timezone: eventTimezone,
                })
                .eq('id', id);
            if (error) {
                throw error;
            } else {
                setEEE({
                    title: title,
                    date: startDateTime,
                    start_time: startDateTime,
                    end_time: endDateTime,
                    location: location,
                    poc: poc,
                    event_timezone: eventTimezone,
                });
                router.push('/'); // Redirect to home page after update
            }
        } catch (error) {
            console.error('Error updating EEE:', error);
            setError(error.message);
        }
    }

    if (!eee) return <div>Loading...</div>

    return (
        <div className={styles.container}>
            <h1>Edit Event</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    updateEEE();
                }}
                className={styles.form}
            >
                <div>
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="date">Date:</label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="startTime">Start Time:</label>
                    <input
                        type="time"
                        id="startTime"
                        name="startTime"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="endTime">End Time:</label>
                    <input
                        type="time"
                        id="endTime"
                        name="endTime"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="location">Location:</label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="poc">Point of Contact:</label>
                    <input
                        type="text"
                        id="poc"
                        name="poc"
                        value={poc}
                        onChange={(e) => setPoc(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="eventTimezone">Event Timezone:</label>
                    <select
                        id="eventTimezone"
                        name="eventTimezone"
                        value={eventTimezone}
                        onChange={(e) => setEventTimezone(e.target.value)}
                    >
                        {timezones.map((tz) => (
                            <option key={tz} value={tz}>{tz}</option>
                        ))}
                    </select>
                </div>
                <button type="submit">Save Changes</button>
            </form>
        </div>
    )
}