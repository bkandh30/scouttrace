type ProgressState = {
	completed: number
	total: number
	isComplete: boolean
}

export function getDisplayProgress({
	completed,
	total,
	isComplete,
}: ProgressState) {
	if (isComplete) {
		return 100
	}

	if (!Number.isFinite(total) || total <= 0) {
		return 0
	}

	const safeCompleted = Number.isFinite(completed)
		? Math.max(0, Math.min(completed, total))
		: 0
	const percent = Math.floor((safeCompleted / total) * 100)

	return Math.min(percent, 99)
}
