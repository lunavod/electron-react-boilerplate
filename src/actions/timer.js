import {keys, forEach} from 'lodash'

/**
 * Baobab action - adds timer
 * 
 * @param {object} tree Baobab tree
 * @param {string} name name for new timer
 */
export function addTimer(tree, name) {
	let max = 0
	forEach(keys(tree.select(['timers', 'allTimers']).get()), (id) => {
		id = parseInt(id),
		max = max>id? max : id
	})
	let newId = max+1+''
	tree.select(['timers', 'allTimers'])
		.set(newId, {name: name, id: newId, time: {}, time_total: 0, appTriggers: [], status: 'inactive'})
	tree.select(['timers', 'order']).push(newId)
}

/**
 * Baobab action - removes timer
 * 
 * @param {object} tree Baobab tree
 * @param {string} timerId id of timer
 */
export function removeTimer(tree, timerId) {
	let order = Array.from(tree.select(['timers', 'order']).get())
	order.splice(order.indexOf(timerId), 1)
	tree.select(['timers', 'order']).set(order)
	tree.select(['timers', 'allTimers']).unset(timerId)
}

/**
 * Baobab action - renames timer
 * 
 * @param {object} tree Baobab tree
 * @param {string} timerId id of timer
 * @param {string} newName new name for timer
 */
export function renameTimer(tree, timerId, newName) {
	tree.select(['timers', 'allTimers', timerId, 'name']).set(newName)
}

/**
 * Baobab action - changes timer status
 * 
 * @param {object} tree Baobab tree
 * @param {*} timerId id of timer
 * @param {*} status new status
 */
export function setTimerStatus(tree, timerId, status) {
	tree.select(['timers', 'allTimers', timerId, 'status']).set(status)
}

/**
 * Baobab action - resets timer time by name
 * 
 * @param {object} tree Baobab tree
 * @param {string} timerId id of timer
 */
export function resetTimerTime(tree, timerId) {
	tree.select(['timers', 'allTimers', timerId, 'time']).set(0)
	tree.select(['timers', 'allTimers', timerId, 'time_total']).set(0)
}

/**
 * Baobab action - reorders timers
 * 
 * @param {object} tree Baobab tree
 * @param {number} startIndex old index
 * @param {number} endIndex new index
 */
export function reorderTimers(tree, startIndex, endIndex) {
	let list = tree.select(['timers', 'order']).get()
	const result = Array.from(list)
	const [removed] = result.splice(startIndex, 1)
	result.splice(endIndex, 0, removed)
	tree.select(['timers', 'order']).set(result)
}


// ---
// Timer triggers
// ---

/**
 * Baobab action - adds new trigger to timer
 * 
 * @param {object} tree Baobab tree
 * @param {string} timerId name of trigger
 * @param {object} trigger new trigger ({path, regex})
 */
export function addTimerTrigger(tree, timerId, trigger={path: '', regex: ''}) {
	tree.select(['timers', 'allTimers', timerId, 'appTriggers']).push(trigger)
}

/**
 * Baobab action - removes trigger from timer
 * 
 * @param {object} tree Baobab tree
 * @param {string} timerId id of timer
 * @param {string} triggerIndex index of trigger
 */
export function removeTimerTrigger(tree, timerId, triggerIndex) {
	tree.select(['timers', 'allTimers', timerId, 'appTriggers']).splice([triggerIndex, 1])
}

/**
 * Baobab action - updates path of trigger
 * 
 * @param {object} tree Baobab tree
 * @param {string} timerId id of timer
 * @param {number} triggerIndex index of trigger
 * @param {string} path new path
 */
export function updateTimerTriggerPath(tree, timerId, triggerIndex, path) {
	tree.select(['timers', 'allTimers', timerId, 'appTriggers', triggerIndex, 'path']).set(path)
}

/**
 * Baobab action - updates regex of trigger
 * 
 * @param {object} tree Baobab tree
 * @param {*} timerId id of timer
 * @param {*} triggerIndex index of trigger
 * @param {string} regex new regex (string, not RegExp)
 */
export function updateTimerTriggerRegex(tree, timerId, triggerIndex, regex) {
	tree.select(['timers', 'allTimers', timerId, 'appTriggers', triggerIndex, 'regex']).set(regex)
}