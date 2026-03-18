import { createFileRoute } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { Link, Outlet } from '@tanstack/react-router'
import { buttonVariants } from '@/components/ui/button'

export const Route = createFileRoute('/_auth')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-screen bg-muted">
      <div className="absolute top-8 left-8">
        <Link to="/" className={buttonVariants({ variant: 'outline' })}>
          <ArrowLeft className="size-4" />
          Back to Home
        </Link>
      </div>
      <div className="flex min-h-screen items-center justify-center">
        <Outlet />
      </div>
    </div>
  )
}
