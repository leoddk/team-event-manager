// components/Home.js
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import EEEForm from './EEEForm';
import styles from '../styles/Home.module.css';
import { format } from 'date-fns-tz';
import { useRouter } from 'next/router';
import EventTable from './EventTable';

export default function Home() {
  const router = useRouter();
  const { user, signIn, signUp, signOut } = useAuth();
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    console.log('User state in Home:', user);
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

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      console.log('Attempting to sign in with email:', email);
      await signIn({ email, password });
      console.log('Sign in successful');
    } catch (error) {
      console.error('Sign in error:', error);
      alert(error.message);
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      console.log('Attempting to sign up with email:', email);
      await signUp({ email, password });
      console.log('Sign up successful');
      alert('Check your email for the confirmation link!');
    } catch (error) {
      console.error('Sign up error:', error);
      alert(error.message);
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      console.log('User signed out');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }

  if (!user) {
    return (
      <div className={styles.authContainer}>
        <form onSubmit={handleSignIn} className={styles.form}>
          <h1>Team Event Manager</h1>
          <p>Sign in to add and view events</p>
          <div>
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <button className={styles.button} type="submit">
              Sign In
            </button>
          </div>
          <div>
            <button className={styles.button} onClick={handleSignUp}>
              Sign Up
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1>Welcome to Team Event Manager</h1>
      <button onClick={handleSignOut} className={styles.button}>Sign Out</button>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <div className={styles.form}>
        <EEEForm onEventAdded={fetchEvents} />
      </div>
      <h2>Your Events</h2>
      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <ul>
          {events.map(event => (
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