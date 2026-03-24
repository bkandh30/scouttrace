import { createFileRoute } from '@tanstack/react-router'
import { SignupForm } from '@/components/layout/signup-form'

export const Route = createFileRoute('/_auth/signup/')({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div className="w-full">
			<SignupForm />
		</div>
	)
}
