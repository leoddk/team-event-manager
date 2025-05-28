// pages/_app.js
import { Component } from 'react'
import { AuthProvider } from '../lib/auth'
import '../styles/globals.css'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Error: {this.state.error.message}</h1>
    }
    return this.props.children
  }
}

function MyApp({ Component, pageProps }) {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default MyApp