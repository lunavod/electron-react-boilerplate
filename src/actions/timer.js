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
 * @param {string} timerName name of timer
 */
export function resetTimerTime(tree, timerName) {
	tree.select(['timers', 'allTimers', timerName, 'time']).set(0)
}

/**
 * Baobab action - updates path of trigger
 * 
 * @param {object} tree Baobab tree
 * @param {string} timerName name of timer
 * @param {number} triggerIndex index of trigger
 * @param {string} path new path
 */
export function updateTimerTriggerPath(tree, timerName, triggerIndex, path) {
	tree.select(['timers', 'allTimers', timerName, 'appTriggers', triggerIndex, 'path']).set(path)
}

/**
 * Baobab action - updates regex of trigger
 * 
 * @param {object} tree Baobab tree
 * @param {*} timerName name of timer
 * @param {*} triggerIndex index of trigger
 * @param {string} regex new regex (string, not RegExp)
 */
export function updateTimerTriggerRegex(tree, timerName, triggerIndex, regex) {
	tree.select(['timers', 'allTimers', timerName, 'appTriggers', triggerIndex, 'regex']).set(regex)
}

/**
 * Baobab action - remover trigger from timer
 * 
 * @param {object} tree Baobab tree
 * @param {string} timerName name of timer
 * @param {string} triggerIndex index of trigger
 */
export function removeTimerTrigger(tree, timerName, triggerIndex) {
	tree.select(['timers', 'allTimers', timerName, 'appTriggers']).splice([triggerIndex, 1])
}

/**
 * Baobab action - adds new trigger to timer
 * 
 * @param {object} tree Baobab tree
 * @param {string} timerName name of trigger
 * @param {object} trigger new trigger ({path, regex})
 */
export function addTimerTrigger(tree, timerName, trigger={path: '', regex: ''}) {
	tree.select(['timers', 'allTimers', timerName, 'appTriggers']).push(trigger)
}

/**
 * Baobab action - removes timer
 * 
 * @param {object} tree Baobab tree
 * @param {string} timerName name of timer
 */
export function removeTimer(tree, timerName) {
	tree.select(['timers', 'allTimers']).unset(timerName)
}