// pages/_app.js
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { AuthProvider, useAuth } from '../lib/auth';
import '../styles/globals.css';
import Navbar from '../components/Navbar';
import styles from '../styles/Home.module.css';
import { useRouter } from 'next/router';
import HomePageContent from '../components/HomePageContent';

function AppWrapper({ Component, pageProps }) {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent Component={Component} pageProps={pageProps} />
      </AuthProvider>
    </ErrorBoundary>
  );
}

function AppContent({ Component, pageProps }) {
  const { user, signOut } = useAuth();
  const router = useRouter();

  return (
    <div className={styles.container}>
      {user ? (
        <>
          <Navbar />
          <Component {...pageProps} />
        </>
      ) : (
        <HomePageContent />
      )}
    </div>
  );
}
function ErrorBoundary({ children }) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState(null);
  const [errorInfo, setErrorInfo] = useState(null);

  if (hasError) {
    return (
      <div style={{ padding: '20px', color: 'red', maxWidth: '800px', margin: '0 auto' }}>
        <h1>Something went wrong</h1>
        <details style={{ whiteSpace: 'pre-wrap' }}>
          <summary>Error details</summary>
          <p>{error && error.toString()}</p>
          <p>Component stack:</p>
          <pre>{errorInfo && errorInfo.componentStack}</pre>
        </details>
      </div>
    );
  }

  return children;
}

export default AppWrapper;