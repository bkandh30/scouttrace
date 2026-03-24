import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from '@/components/ui/card'
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
	FieldSeparator,
	FieldError,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Link, useNavigate, useRouter } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { loginSchema } from '@/schemas/auth'
import { toast } from 'sonner'
import { authClient } from '@/lib/auth-client'
import { useTransition } from 'react'

export function LoginForm() {
	const navigate = useNavigate()
	const router = useRouter()
	const [isPending, startTransition] = useTransition()

	const form = useForm({
		defaultValues: {
			email: '',
			password: '',
		},
		validators: {
			onSubmit: loginSchema,
			onBlur: loginSchema,
		},
		onSubmit: ({ value }) => {
			startTransition(async () => {
				await authClient.signIn.email({
					email: value.email,
					password: value.password,
					fetchOptions: {
						onSuccess: async () => {
							await router.invalidate()
							toast.success('Logged in successfully')
							await navigate({
								to: '/',
							})
						},
						onError: ({ error }) => {
							toast.error(error.message)
						},
					},
				})
			})
		},
	})

	return (
		<Card className="auth-card-surface border-0 py-0 backdrop-blur-xl">
			<CardHeader className="gap-3 px-6 pb-0 pt-5 sm:px-7 sm:pt-7">
				<div className="auth-pill inline-flex w-fit items-center rounded-full border px-3 py-1 text-[0.68rem] font-medium uppercase tracking-[0.2em]">
					Secure sign in
				</div>
				<div className="space-y-2">
					<CardTitle className="text-[1.9rem] font-semibold tracking-[-0.035em] text-foreground">
						Welcome back
					</CardTitle>
					<CardDescription className="max-w-[27rem] text-sm leading-6 text-auth-body">
						Sign in to continue building your research library with{' '}
						ScoutTrace.
					</CardDescription>
				</div>
			</CardHeader>
			<CardContent className="px-6 pb-6 pt-5 sm:px-7 sm:pb-7">
				<form
					noValidate
					onSubmit={(e) => {
						e.preventDefault()
						form.handleSubmit()
					}}
				>
					<FieldGroup className="gap-4">
						<Field className="gap-3">
							<Button
								variant="outline"
								type="button"
								size="lg"
								className="auth-social-button h-12 justify-center rounded-2xl px-4 text-sm font-medium"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="currentColor"
									className="auth-social-icon"
								>
									<path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.082-.729.082-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.807 1.305 3.492.998.108-.776.418-1.305.76-1.605-2.665-.303-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23a11.49 11.49 0 0 1 3.005-.405c1.02.005 2.045.138 3.005.405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.435.375.81 1.102.81 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
								</svg>
								Continue with GitHub
							</Button>
							<Button
								variant="outline"
								type="button"
								size="lg"
								className="auth-social-button h-12 justify-center rounded-2xl px-4 text-sm font-medium"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									className="auth-social-icon"
								>
									<path
										d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
										fill="currentColor"
									/>
								</svg>
								Continue with Google
							</Button>
						</Field>
						<FieldSeparator className="auth-separator-login *:data-[slot=field-separator-content]:px-3 *:data-[slot=field-separator-content]:text-[0.72rem] *:data-[slot=field-separator-content]:font-medium *:data-[slot=field-separator-content]:uppercase *:data-[slot=field-separator-content]:tracking-[0.18em]">
							Or continue with email
						</FieldSeparator>
						<Field className="gap-3">
							<form.Field
								name="email"
								children={(field) => {
									const isInvalid =
										field.state.meta.isTouched &&
										!field.state.meta.isValid
									return (
										<Field
											data-invalid={isInvalid}
											className="gap-1.5 px-0.5"
										>
											<FieldLabel
												htmlFor={field.name}
												className="auth-field-label text-[0.72rem] font-medium tracking-[0.01em]"
											>
												Email
											</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) =>
													field.handleChange(
														e.target.value,
													)
												}
												aria-invalid={isInvalid}
												placeholder="john.doe@example.com"
												type="email"
												autoComplete="off"
												required
												className="auth-input-surface h-12 rounded-2xl px-3.5 text-sm"
											/>
											{isInvalid && (
												<FieldError
													errors={
														field.state.meta.errors
													}
												/>
											)}
										</Field>
									)
								}}
							/>
							<form.Field
								name="password"
								children={(field) => {
									const isInvalid =
										field.state.meta.isTouched &&
										!field.state.meta.isValid
									return (
										<Field
											data-invalid={isInvalid}
											className="gap-1.5 px-0.5"
										>
											<div className="flex items-center">
												<FieldLabel
													htmlFor={field.name}
													className="auth-field-label text-[0.72rem] font-medium tracking-[0.01em]"
												>
													Password
												</FieldLabel>
												<a
													href="#"
													className="auth-secondary-link ml-auto text-[0.76rem] font-medium transition-colors"
												>
													Forgot your password?
												</a>
											</div>
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) =>
													field.handleChange(
														e.target.value,
													)
												}
												aria-invalid={isInvalid}
												type="password"
												autoComplete="off"
												required
												className="auth-input-surface h-12 rounded-2xl px-3.5 text-sm"
											/>
											{isInvalid && (
												<FieldError
													errors={
														field.state.meta.errors
													}
												/>
											)}
										</Field>
									)
								}}
							/>
						</Field>
						<Field className="gap-2.5 pt-0.5">
							<Button
								type="submit"
								size="lg"
								className="auth-primary-button mt-1 h-12 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/92"
								disabled={isPending}
							>
								{isPending ? 'Logging in...' : 'Login'}
							</Button>
							<FieldDescription className="px-1 pt-0.5 text-center text-sm text-auth-muted">
								New to ScoutTrace?{' '}
								<Link
									to="/signup"
									className="auth-secondary-link font-medium underline-offset-4"
								>
									Create an account
								</Link>
							</FieldDescription>
						</Field>
					</FieldGroup>
				</form>
			</CardContent>
		</Card>
	)
}
