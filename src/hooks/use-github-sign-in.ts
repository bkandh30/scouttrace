import { useCallback, useRef, useState } from 'react'

import { toast } from 'sonner'

import { authClient } from '@/lib/auth-client'

const GITHUB_CALLBACK_URL = '/dashboard'

export function useGithubSignIn() {
	const isSubmittingRef = useRef(false)
	const [isPending, setIsPending] = useState(false)

	const signInWithGithub = useCallback(async () => {
		if (isSubmittingRef.current) {
			return
		}

		isSubmittingRef.current = true
		setIsPending(true)

		try {
			const { error } = await authClient.signIn.social({
				provider: 'github',
				callbackURL: GITHUB_CALLBACK_URL,
			})

			if (error) {
				toast.error(error.message)
				isSubmittingRef.current = false
				setIsPending(false)
			}
		} catch (error) {
			isSubmittingRef.current = false
			setIsPending(false)
			toast.error(
				error instanceof Error
					? error.message
					: 'Unable to continue with GitHub',
			)
		}
	}, [])

	return {
		isPending,
		signInWithGithub,
	}
}
