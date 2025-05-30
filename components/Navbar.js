// components/Navbar.js
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import { useAuth } from '../lib/auth';
import { useRouter } from 'next/router';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      console.log('User signed out');
      router.push('/'); // Redirect to home which will show sign-in form
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!user) return null; // Don't render navbar if not signed in

  return (
    <nav className={styles.nav}>
      <Link href="/" className={`${styles.navButton} ${styles.editButton}`}>Home</Link>
      <Link href="/calendar" className={`${styles.navButton} ${styles.editButton}`}>Calendar</Link>
      <Link href="/add-eee" className={`${styles.navButton} ${styles.editButton}`}>Add EEE</Link>
      <button className={`${styles.navButton} ${styles.signOutButton}`} onClick={handleSignOut}>
        Sign Out
      </button>
    </nav>
  );
}