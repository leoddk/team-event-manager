// lib/auth.js
import { createContext, useState, useEffect, useContext } from 'react'
import { supabase } from './supabase'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const session = supabase.auth.session()
    console.log('Initial session:', session)
    setUser(session?.user ?? null)
    setLoading(false)

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => {
      listener?.unsubscribe()
    }
  }, [])

  const value = {
    signUp: async (data) => {
      const { error } = await supabase.auth.signUp(data)
      if (error) throw error
    },
    signIn: async (data) => {
      const { error } = await supabase.auth.signIn(data)
      if (error) throw error
    },
    signOut: async () => {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
    },
    user,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}