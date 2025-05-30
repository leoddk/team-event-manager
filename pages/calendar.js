// pages/calendar.js
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import styles from '../styles/Home.module.css';
import MyCalendar from '../components/Calendar'; // Import the calendar component

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

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

  return (
    <div className={styles.container}>
      <h1>Event Calendar</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <MyCalendar events={events} /> {/* Use the imported calendar component */}
    </div>
  );
}