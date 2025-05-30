import Link from 'next/link';
import styles from '../styles/Home.module.css';
import { useAuth } from '../lib/auth';

export default function Navbar() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      console.log('User signed out');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className={styles.nav}>
      <Link href="/" className={`${styles.navButton} ${styles.editButton}`}>Home</Link>
      <Link href="/calendar" className={`${styles.navButton} ${styles.editButton}`}>Calendar</Link>
      <Link href="/add-eee" className={`${styles.navButton} ${styles.editButton}`}>Add EEE</Link>
      {user && (
        <button className={`${styles.navButton} ${styles.signOutButton}`} onClick={handleSignOut}>
          Sign Out
        </button>
      )}
    </nav>
  );
}