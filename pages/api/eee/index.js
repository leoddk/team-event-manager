import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Layout from '../components/Layout'
import EEETable from '../components/EEETable'
import SearchFilter from '../components/SearchFilter'

export default function Dashboard() {
  const [eees, setEEEs] = useState([])
  const [filteredEEEs, setFilteredEEEs] = useState([])

  useEffect(() => {
    fetchEEEs()
  }, [])

  async function fetchEEEs() {
    const { data, error } = await supabase
      .from('eees')
      .select('*')
    if (error) console.error('Error fetching EEEs:', error)
    else {
      setEEEs(data)
      setFilteredEEEs(data)
    }
  }

  return (
    <Layout>
      <h1>EEE Dashboard</h1>
      <SearchFilter eees={eees} setFilteredEEEs={setFilteredEEEs} />
      <EEETable eees={filteredEEEs} onDelete={fetchEEEs} />
    </Layout>
  )
}