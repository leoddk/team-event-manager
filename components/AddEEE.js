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
  const [searchQuery, setSearchQuery] = useState('');
    const [filteredEvents, setFilteredEvents] = useState([]);
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
      setFilteredEvents(data || []); // Initialize filtered events
    } catch (error) {
      console.error('Error fetching events:', error);
      setError(error.message);
    }
  }

    useEffect(() => {
        // Update filtered events whenever events or searchQuery changes
        const filtered = events.filter(event =>
            event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.poc.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredEvents(filtered);
    }, [events, searchQuery]);
// Update the query results and be careful here.

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
      
             <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
            />
{/*Add test and look here - it gets text from you with every GUI test*/}
      <h2>Your Events</h2>
      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <ul>
          {filteredEvents.map(event => (
            <li key={event.id}>
              <strong>{event.title}</strong> - {format(new Date(event.date), 'yyyy-MM-dd HH:mm', { timeZone: event.event_timezone })}
              {(event.start_time || event.end_time) && 
                <div>
                  <small>
                    Time: {format(new Date(event.start_time), 'HH:mm', { timeZone: event.event_timezone })} - {format(new Date(event.end_time), 'HH:mm', { timeZone: event.event_timezone })} ({event.event_timezone})
                  </small>
                </div>
              }
              {event.location && <div><small>Location: {event.location}</small></div>}
              {event.poc && <div><small>Point of Contact: {event.poc}</small></div>}
              <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                <button 
                    style={{ 
                        backgroundColor: '#4a90e2', 
                        color: 'white',
                        padding: '5px 10px',
                        borderRadius: '4px',
                        border: 'none',
                        cursor: 'pointer'
                    }}
                    onClick={() => handleEdit(event.id)}
                >
                    Edit
                </button>
                <button 
                    style={{ 
                        backgroundColor: '#e25c5c', 
                        color: 'white',
                        padding: '5px 10px',
                        borderRadius: '4px',
                        border: 'none',
                        cursor: 'pointer'
                    }}
                    onClick={() => handleDelete(event.id)}
                >
                    Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}