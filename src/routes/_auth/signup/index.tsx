import { createFileRoute } from '@tanstack/react-router'
import { SignupForm } from '@/components/layout/signup-form'

export const Route = createFileRoute('/_auth/signup/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center gap-2 self-center font-semibold tracking-tight">
          <div className="flex size-6 items-center justify-center rounded-md">
            <img
              src="scouttrace.png"
              alt="ScoutTrace Logo"
              className="size-10 rounded-md object-cover"
            />
          </div>
          ScoutTrace
        </div>
        <SignupForm />
      </div>
    </div>
  )
}
