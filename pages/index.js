// pages/index.js
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import styles from '../styles/Home.module.css';
import HomePageContent from '../components/HomePageContent';

export default function Home() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      console.log('User signed out');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }
    if (!user) {
        return (
            <div className={styles.authContainer}>
        </div>
        );
    }

  return (
      <div className={styles.container}>
      <HomePageContent />
        <button onClick={signOut} className={styles.button}>Sign Out</button>
    </div>
  );
}