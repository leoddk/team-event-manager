import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabase'

export default function EditEEE() {
  const [eee, setEEE] = useState(null)
  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    if (id) fetchEEE()
  }, [id])

  async function fetchEEE() {
    const { data, error } = await supabase
      .from('eee')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching EEE:', error)
    } else {
      setEEE(data)
    }
  }

  async function updateEEE(updates) {
    const { data, error } = await supabase
      .from('eee')
      .update(updates)
      .eq('id', id)

    if (error) {
      console.error('Error updating EEE:', error)
    } else {
      setEEE(data)
      router.push('/') // Redirect to home page after update
    }
  }

  if (!eee) return <div>Loading...</div>

  return (
    <div>
      <h1>Edit EEE</h1>
      <form onSubmit={(e) => {
        e.preventDefault()
        updateEEE({
          title: e.target.title.value,
          description: e.target.description.value,
          // Add other fields as necessary
        })
      }}>
        <div>
          <label htmlFor="title">Title:</label>
          <input id="title" name="title" defaultValue={eee.title} />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea id="description" name="description" defaultValue={eee.description} />
        </div>
        {/* Add other form fields as necessary */}
        <button type="submit">Save Changes</button>
      </form>
    </div>
  )
}