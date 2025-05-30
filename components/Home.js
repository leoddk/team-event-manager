import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import EEEForm from './EEEForm'
import styles from '../styles/Home.module.css'
import { format } from 'date-fns-tz'
import { useRouter } from 'next/router'

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
      router.push('/') // Redirect to the home page
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
    <HomePageContent />
  );
}