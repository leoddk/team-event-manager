import { Component, useEffect } from 'react';
import { AuthProvider, useAuth } from '../lib/auth';
import '../styles/globals.css';
import Navbar from '../components/Navbar'; // Import the Navbar
import styles from '../styles/Home.module.css'; // Import the styles
import { useRouter } from 'next/router';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: 'red', maxWidth: '800px', margin: '0 auto' }}>
          <h1>Something went wrong</h1>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            <summary>Error details</summary>
            <p>{this.state.error && this.state.error.toString()}</p>
            <p>Component stack:</p>
            <pre>{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}

function MyApp({ Component, pageProps }) {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AuthCheck>
            <div className={styles.container}>
            <Component {...pageProps} />
        </div>
        </AuthCheck>
      </AuthProvider>
    </ErrorBoundary>
  );
}

function AuthCheck(props) {
  const { user, signOut } = useAuth()
  const router = useRouter();

  useEffect(() => {
    console.log('In useEffect, user is:', user);
    if (!user) {
      router.push('/')
    }
  }, [user, router]);

  return user ? (
    <>
          <Navbar/>
{props.children}
    </>
  ) : (
    <div>Loading...</div>
  );
}

export default MyApp