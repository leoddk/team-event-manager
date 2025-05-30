// pages/index.js
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import styles from '../styles/Home.module.css';
import HomePageContent from '../components/HomePageContent';
import AddEEE from '../components/AddEEE';

export default function Home() {
  const { user, signOut } = useAuth();
  return (
      <div className={styles.container}>
      <h1>Welcome to Team Event Manager</h1>
      <button onClick={signOut} className={styles.button}>Sign Out</button>
    </div>
  );
}