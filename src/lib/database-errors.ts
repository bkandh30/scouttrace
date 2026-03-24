export const DATABASE_WAKEUP_MESSAGE =
	'Database is waking up, retry in a moment.'

const databaseErrorPatterns = [
	DATABASE_WAKEUP_MESSAGE,
	'P1001',
	"Can't reach database server",
	'DatabaseNotReachable',
	'Service Unavailable',
]

export function isDatabaseWakeupError(error: unknown) {
	if (
		typeof error === 'object' &&
		error !== null &&
		'code' in error &&
		error.code === 'P1001'
	) {
		return true
	}

	if (!(error instanceof Error)) {
		return false
	}

	return databaseErrorPatterns.some((pattern) =>
		error.message.includes(pattern),
	)
}

export function getFriendlyDatabaseErrorMessage(
	error: unknown,
	fallback: string,
) {
	if (isDatabaseWakeupError(error)) {
		return DATABASE_WAKEUP_MESSAGE
	}

	return error instanceof Error && error.message ? error.message : fallback
}

export function createDatabaseWakeupResponse() {
	return new Response(DATABASE_WAKEUP_MESSAGE, {
		status: 503,
		headers: {
			'content-type': 'text/plain; charset=utf-8',
		},
	})
}
