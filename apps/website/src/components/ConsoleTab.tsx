import dynamic from 'next/dynamic'
import { Output } from './Output'

export default function ConsoleTab() {
  const Term = dynamic(() => import("@/components/XTerm"), { ssr: false },)

  return (
    <>
      <Output />
      <Term />
    </>
  )
}

