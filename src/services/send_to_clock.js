import { forEach, includes } from 'lodash'
import dateFormat from 'dateformat'
import { formatOfDate as format } from '../utils/constants'
/**
 * Service for ticking timers
 * 
 * @param {object} tree Baobab tree
 */
let tmr = {}
let oldTime = ""
let isStill = false
export default function sendToClock(tree) {
	let timeout = 1000

	return setInterval(() => {
		let timers = tree.select(['timers', 'allTimers']).get()
		let date = dateFormat(new Date(), format)

		let newTmr

		forEach(timers, timer => {
			if (!includes(['active', 'triggered'], timer.status)) return
			newTmr = timer
			console.log('TIMER TIIIICK', formatTime(timer.time[date], 'MS'), timer.id)
		})

		fetch('http://192.168.1.40/clock', { method: 'POST', body: 'val=' + (d.getHours() + '').padStart(2, '0') + (d.getMinutes() + '').padStart(2, '0'), mode: 'no-cors' })

		if (!newTmr) {
			if (!isStill) {
				fetch('http://192.168.1.40/text', { method: 'POST', body: 'text=Watcha doing? :3', mode: 'no-cors' })
				isStill = true
			}
			return
		}
		// fetch('http://192.168.1.40/clock', { method: 'POST', body: 'val=' + formatTime(newTmr.time[date], 'H:M'), mode: 'no-cors' })
		console.log()
		let name = newTmr.name
		let time = formatTime(newTmr.time[date], 'H:M')
		if (tmr.id != newTmr.id || oldTime != time || isStill) {
			isStill = false
			fetch('http://192.168.1.40/text', { method: 'POST', body: 'text=' + newTmr.name + ''.padEnd(16 * 2 - name.length - time.length) + time, mode: 'no-cors' })
		}
		tmr = newTmr
		oldTime = time
	}, timeout)
}