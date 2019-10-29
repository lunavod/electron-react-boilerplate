import {forEach, includes} from 'lodash'

/**
 * Service for ticking timers
 * 
 * @param {object} tree Baobab tree
 */
export default function tickTimers(tree) {
	let timeout = 1000

	return setInterval(() => {
		let timers = tree.select(['timers', 'allTimers']).get()
		forEach(timers, timer => {
			if (!includes(['active', 'triggered'], timer.status)) return

			tree.select(['timers', 'allTimers', timer.name, 'time']).set(timer.time + timeout)
		})
	}, timeout)
}