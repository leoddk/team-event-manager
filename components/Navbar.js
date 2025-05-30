import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Navbar() {
  return (
    <nav className={styles.nav}>
      <Link href="/" className={`${styles.navButton} ${styles.editButton}`}>Home</Link>
      <Link href="/calendar" className={`${styles.navButton} ${styles.editButton}`}>Calendar</Link>
      <Link href="/add-eee" className={`${styles.navButton} ${styles.editButton}`}>Add EEE</Link>
    </nav>
  );
}