import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Layout from '../components/Layout'
import EEETable from '../components/EEETable'

export default function Home() {
  const [eees, setEEEs] = useState([])

  useEffect(() => {
    fetchEEEs()
  }, [])

  async function fetchEEEs() {
    const { data, error } = await supabase
      .from('eees')
      .select('*')
    if (error) console.log('Error fetching EEEs:', error)
    else setEEEs(data)
  }

  return (
    <Layout>
      <h1>Team Event Management System</h1>
      <EEETable eees={eees} />
    </Layout>
  )
}