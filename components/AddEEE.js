// components/AddEEE.js
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import EEEForm from './EEEForm'
import styles from '../styles/Home.module.css'
import { format } from 'date-fns-tz'
import { useRouter } from 'next/router'

export default function AddEEE() {
  const router = useRouter();
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [user]);

  async function fetchEvents() {
    try {
      const { data, error } = await supabase
        .from('eee')
        .select('*')
        .order('date', { ascending: true });
      console.log('Fetched events:', data);
      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError(error.message);
    }
  }

  // Add delete function
  async function handleDelete(id) {
    if (confirm('Are you sure you want to delete this event?')) {
      try {
        const { error } = await supabase
          .from('eee')
          .delete()
          .eq('id', id);
        if (error) throw error;
        // Refresh the event list
        fetchEvents();
      } catch (error) {
        console.error('Error deleting event:', error);
        setError(error.message);
      }
    }
  }

  // Function to navigate to edit page
  function handleEdit(id) {
    router.push(`/edit-eee/${id}`);
  }

  return (
    <div className={styles.container}>
      <h1>Add and Manage Events</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className={styles.form}>
        <EEEForm onEventAdded={fetchEvents} />
      </div>
        </div>
  );
}