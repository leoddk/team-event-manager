import dynamic from 'next/dynamic'
import { supabase } from '../lib/supabase'

const DynamicHomeComponent = dynamic(() => import('../components/Home'), { ssr: false })

export default function Home() {
  return <DynamicHomeComponent supabase={supabase} />
}