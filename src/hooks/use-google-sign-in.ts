import { useCallback, useRef, useState } from 'react'

import { toast } from 'sonner'

import { authClient } from '@/lib/auth-client'

const GOOGLE_CALLBACK_URL = '/dashboard'

export function useGoogleSignIn() {
	const isSubmittingRef = useRef(false)
	const [isPending, setIsPending] = useState(false)

	const signInWithGoogle = useCallback(async () => {
		if (isSubmittingRef.current) {
			return
		}

		isSubmittingRef.current = true
		setIsPending(true)

		try {
			const { error } = await authClient.signIn.social({
				provider: 'google',
				callbackURL: GOOGLE_CALLBACK_URL,
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
					: 'Unable to continue with Google',
			)
		}
	}, [])

	return {
		isPending,
		signInWithGoogle,
	}
}
