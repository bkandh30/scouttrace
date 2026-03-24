import { createFileRoute } from '@tanstack/react-router'
import { LoginForm } from '@/components/layout/login-form'

export const Route = createFileRoute('/_auth/login/')({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div className="w-full">
			<LoginForm />
		</div>
	)
}
