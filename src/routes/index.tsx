import { createFileRoute } from '@tanstack/react-router'
import { Navbar } from '../components/layout/navbar'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <div>
      <Navbar />
    </div>
  )
}
