import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Layout from '../components/Layout'
import Calendar from '../components/Calendar'

export default function CalendarView() {
  const [eees, setEEEs] = useState([])

  useEffect(() => {
    fetchEEEs()
  }, [])

  async function fetchEEEs() {
    const { data, error } = await supabase
      .from('eees')
      .select('*')
    if (error) console.error('Error fetching EEEs:', error)
    else setEEEs(data)
  }

  return (
    <Layout>
      <h1>EEE Calendar</h1>
      <Calendar eees={eees} />
    </Layout>
  )
}