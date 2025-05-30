import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/auth'
import styles from '../../styles/Home.module.css'

export default function EditEEE() {
    const [eee, setEEE] = useState(null)
    const router = useRouter()
    const { id } = router.query
    const { user } = useAuth()
    const [error, setError] = useState(null)

    useEffect(() => {
        if (id) fetchEEE()
    }, [id])

    async function fetchEEE() {
        try {
            const { data, error } = await supabase
                .from('eee')
                .select('*')
                .eq('id', id)
                .single()

            if (error) {
                console.error('Error fetching EEE:', error)
                setError(error.message)
            } else {
                setEEE(data)
            }
        } catch (err) {
            console.error("Unexpected error fetching event", err)
            setError(err.message)
        }
    }

    async function updateEEE(updates) {
        try {
            const { data, error } = await supabase
                .from('eee')
                .update(updates)
                .eq('id', id)

            if (error) {
                console.error('Error updating EEE:', error)
                setError(error.message)
            } else {
                router.push('/')
            }
        } catch (error) {
            console.error('Error updating EEE:', error)
            setError(error.message)
        }
    }

    if (!eee) return <div>Loading...</div>

    return (
        <div className={styles.container}>
            <h1>Edit Event</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={(e) => {
                e.preventDefault()
                updateEEE({
                    title: e.target.title.value,
                    date: e.target.date.value,
                    location: e.target.location.value,
                    poc: e.target.poc.value
                })
            }} className={styles.form}>
                <div>
                    <label htmlFor="title">Title:</label>
                    <input id="title" name="title" defaultValue={eee.title} />
                </div>
                <div>
                    <label htmlFor="date">Date:</label>
                    <input id="date" name="date" type="date" defaultValue={eee.date ? eee.date.substring(0, 10) : ''} />
                </div>
                <div>
                    <label htmlFor="location">Location:</label>
                    <input id="location" name="location" defaultValue={eee.location || ''} />
                </div>
                <div>
                    <label htmlFor="poc">Point of Contact:</label>
                    <input id="poc" name="poc" defaultValue={eee.poc || ''} />
                </div>
                <button type="submit">Save Changes</button>
            </form>
        </div>
    )
}