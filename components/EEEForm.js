import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function EEEForm({ eee, onSubmit }) {
  const [formData, setFormData] = useState(eee || {
    name: '',
    start_date: '',
    end_date: '',
    location: '',
    attendees: '',
    poc: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (eee) {
      const { data, error } = await supabase
        .from('eees')
        .update(formData)
        .eq('id', eee.id)
      if (error) console.error('Error updating EEE:', error)
      else onSubmit(data)
    } else {
      const { data, error } = await supabase
        .from('eees')
        .insert(formData)
      if (error) console.error('Error adding EEE:', error)
      else onSubmit(data)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={formData.name} onChange={handleChange} placeholder="Event Name" required />
      <input name="start_date" type="datetime-local" value={formData.start_date} onChange={handleChange} required />
      <input name="end_date" type="datetime-local" value={formData.end_date} onChange={handleChange} required />
      <input name="location" value={formData.location} onChange={handleChange} placeholder="Location" required />
      <input name="attendees" value={formData.attendees} onChange={handleChange} placeholder="Attendees" required />
      <input name="poc" value={formData.poc} onChange={handleChange} placeholder="Point of Contact" required />
      <button type="submit">{eee ? 'Update' : 'Add'} EEE</button>
    </form>
  )
}