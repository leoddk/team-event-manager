import dynamic from 'next/dynamic'

const DynamicHomeComponent = dynamic(() => import('../components/Home'), { ssr: false })

export default function Home() {
  return <DynamicHomeComponent />
}