// pages/_app.js
import { Component } from 'react'
import { AuthProvider, useAuth } from '../lib/auth'
import '../styles/globals.css'
import Navbar from '../components/Navbar'
import styles from '../styles/Home.module.css'
import { useRouter } from 'next/router'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo)
    this.setState({ errorInfo })
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
      )
    }
    return this.props.children
  }
}

function AppWrapper({ Component, pageProps }) {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent Component={Component} pageProps={pageProps} />
      </AuthProvider>
    </ErrorBoundary>
  )
}

function AppContent({ Component, pageProps }) {
  const { user } = useAuth()
  const router = useRouter()
  
  // Only show Navbar on authenticated routes, except for home page which has its own authentication check
  const showNavbar = user && router.pathname !== '/'
  
  return (
    <>
      {showNavbar && <Navbar />}
      <div className={styles.container}>
        <Component {...pageProps} />
      </div>
    </>
  )
}

export default AppWrapper