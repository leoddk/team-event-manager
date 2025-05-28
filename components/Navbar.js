import Link from 'next/link'

export default function Navbar() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/calendar">Calendar</Link>
      <Link href="/add-eee">Add EEE</Link>
    </nav>
  )
}