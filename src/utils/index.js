/**
 * 
 * @param {Date} date date
 */
export function getTimeFromDayStart(date) {
	const start = new Date(
		`${date.getMonth() + 1}.${date.getDate()}.${date.getFullYear()}`
	)
	return date - start
}

/**
 * 
 * @param {Date} [date] if undefined, uses new Date()
 */
export function getTimeGapIndex(date) {
	date = date || new Date()
	return Math.floor(getTimeFromDayStart(date) / 1000 / 60 / 30)
}