// components/Home.js
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import styles from '../styles/Home.module.css';
import HomePageContent from './HomePageContent';

export default function Home() {
  const { user, signIn, signUp, signOut } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
    <HomePageContent />
  );
}