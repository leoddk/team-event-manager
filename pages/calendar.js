import dynamic from 'next/dynamic'

const DynamicCalendarComponent = dynamic(() => import('../components/Calendar'), { ssr: false })

export default function Calendar() {
  return <DynamicCalendarComponent />
}