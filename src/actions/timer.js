/**
 * Baobab action - changes timer status
 * 
 * @param {object} tree Baobab tree
 * @param {*} timerName name of timer
 * @param {*} status new status
 */
export function setTimerStatus(tree, timerName, status) {
	tree.select(['timers', 'allTimers', timerName, 'status']).set(status)
}

/**
 * Baobab action - resets timer time by name
 * 
 * @param {object} tree Baobab tree
 * @param {*} timerName name of timer
 */
export function resetTimerTime(tree, timerName) {
	tree.select(['timers', 'allTimers', timerName, 'time']).set(0)
}