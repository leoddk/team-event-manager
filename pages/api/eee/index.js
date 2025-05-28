import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import Dashboard from '../components/Dashboard'
import Layout from '../components/Layout'

export default function Home() {
  const [events, setEvents] = useState([])

  useEffect(() => {
    fetchEvents()
  }, [])

  async function fetchEvents() {
    const { data, error } = await supabase
      .from('events')
      .select('*')
    if (error) console.log('Error fetching events:', error)
    else setEvents(data)
  }

  return (
    <Layout>
      <h1>Team Event Management System</h1>
      <Dashboard events={events} />
    </Layout>
  )
}