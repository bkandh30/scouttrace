import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Index Route</h1>
    </div>
  )
}
