import {forEach, includes} from 'lodash'
import dateFormat from 'dateformat'
import { formatOfDate as format } from '../utils/constants'
/**
 * Service for ticking timers
 * 
 * @param {object} tree Baobab tree
 */
export default function tickTimers(tree) {
	let timeout = 1000

	return setInterval(() => {
		let timers = tree.select(['timers', 'allTimers']).get()
		let date = dateFormat(new Date(), format)

		forEach(timers, timer => {
			if (!includes(['active', 'triggered'], timer.status)) return

			tree.select(['timers', 'allTimers', timer.id, 'time', date]).set((timer.time[date] || 0) + timeout)
			tree.select(['timers', 'allTimers', timer.id, 'time_total']).set(timer.time_total + timeout)
		})
	}, timeout)
}