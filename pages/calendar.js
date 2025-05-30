// pages/calendar.js
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

export default function CalendarView() {
    const { user } = useAuth();
    const router = useRouter();
    const [events, setEvents] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Redirect to home if not authenticated
        if (!user) {
            router.push('/');
            return;
        }
        
        fetchEvents();
    }, [user, router]);

    async function fetchEvents() {
        try {
            const { data, error } = await supabase
                .from('eee')
                .select('*')
                .order('date', { ascending: true });
            
            if (error) throw error;
            
            // Format events for react-big-calendar
            const formattedEvents = data.map(event => ({
                id: event.id,
                title: event.title,
                start: new Date(event.date),
                end: new Date(event.date),
            }));
            setEvents(formattedEvents || []);
        } catch (error) {
            console.error('Error fetching events:', error);
            setError(error.message);
        }
    }

    // Show nothing while checking authentication
    if (!user) return null;

    return (
        <div className={styles.container}>
            <h1>Event Calendar</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div style={{ height: '600px' }}>
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    titleAccessor="title"
                    style={{ margin: '20px' }}
                />
            </div>
        </div>
    );
}