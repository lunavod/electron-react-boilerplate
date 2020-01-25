const ioHook = global.require('iohook')

const activeWin = global.require('active-win')

import { forEach, clone } from 'lodash'
import Logger from '../utils/Logger'

import dateFormat from 'dateformat'
import { getTimeGapIndex } from '../utils'
import { formatOfDate as format } from '../utils/constants'

let logger = new Logger({
	tree: false,
	timer: false,
	cur_win: false,
	timers: false,
	cursor_moved: false,
	win_changed: false
})

let timerId = 0

/**
 * Function that monitors statistics and writes it to tree
 *
 * @param {object} tree Baobab tree
 */
export default async function monitorWindowAndCursor(tree) {
	// return 2
	let win = { id: 0, app: '', path: '', title: '' }
	let pos = { x: 0, y: 0 }

	let last_change = Date.now()

	let timeout = 1000
	let isStopped = false

	let mouse_changed = false
	let keyboard_clicked = false

	ioHook.on('mousemove', event => {
		mouse_changed = true
	})

	ioHook.on('mouseclick', event => {
		mouse_changed = true
	})

	ioHook.on('mousewheel', event => {
		mouse_changed = true
	})

	ioHook.on('keydown', event => {
		keyboard_clicked = true
	})

	ioHook.start()

	// TODO: Refactor cognitive complexity?
	// eslint-disable-next-line
	timerId = setInterval(async () => {
		let data = { ...tree.select('statistics').get() }
		let timers = clone(tree.select(['timers', 'allTimers']).get())

		let date = dateFormat(new Date(), format)

		let cur_win = await activeWin()

		let win_changed = cur_win.id !== win.id

		if (win_changed || mouse_changed || keyboard_clicked) {
			last_change = Date.now()
			win = {
				id: cur_win.id,
				app: cur_win.owner.name,
				path: cur_win.owner.path,
				title: cur_win.title
			}
			logger.log('cur_win', [win])
			isStopped = false
		}

		// if (cursor_moved) logger.log('cursor_moved', [pos])
		if (win_changed) logger.log('win_changed', [cur_win])

		if (isStopped) return

		if (Date.now() - last_change >= 5 * 1000) {
			logger.log(Date.now() - last_change)
			tree
				.select(['statistics', win.app, 'time', date])
				.set(data[win.app].time[date] - (Date.now() - last_change))
			isStopped = true

			forEach(timers, (timer, name) => {
				if (timer.status == 'active') return

				let triggered = isTimerTriggered(timer.appTriggers, win)

				if (!triggered) return

				logger.log('timers', ['Stopping', timer, name])

				tree.select(['timers', 'allTimers', timer.id, 'status']).set('inactive')
				tree
					.select(['timers', 'allTimers', timer.id, 'time', date])
					.set(timer.time[date] - (Date.now() - last_change))
				tree
					.select(['timers', 'allTimers', timer.id, 'time_total'])
					.set(timer.time_total - (Date.now() - last_change))
				// timer.time -= (Date.now() - last_change)

				logger.log('timers', ['Stopped', timer, name])
			})

			return
		}

		// logger.log(cur_win, cur_pos, win, pos, Date.now() - last_change)
		if (!data[win.app]) {
			tree.select(['statistics']).set(win.app, {
				time: {
					[date]: timeout
				},
				timeline: {
					[date]: {
						[getTimeGapIndex()]: timeout
					}
				},
				path: win.path
			})
		} else if (!data[win.app].time[date] || !data[win.app].timeline[date]) {
			tree.select(['statistics', win.app, 'time']).set(date, timeout)
			tree
				.select(['statistics', win.app, 'timeline'])
				.set(date, { [getTimeGapIndex()]: timeout })
		} else {
			tree
				.select(['statistics', win.app, 'time', date])
				.set(data[win.app].time[date] + timeout)
			tree
				.select(['statistics', win.app, 'timeline', date, getTimeGapIndex()])
				.set(data[win.app].timeline[date][getTimeGapIndex()] + timeout)
		}

		forEach(timers, (timer, name) => {
			if (timer.status == 'active') return

			let triggered = isTimerTriggered(timer.appTriggers, win)

			// If timer status is 'triggered', but it is not triggered by current app, it should be inactive
			if (!triggered && timer.status == 'triggered') {
				tree.select(['timers', 'allTimers', timer.id, 'status']).set('inactive')
				timers[name] = timer
			}
			if (!triggered) return

			tree.select(['timers', 'allTimers', timer.id, 'status']).set('triggered')

			logger.log('timers', [timer, name])
		})
		logger.log('tree', [tree.get()])
		if (mouse_changed) console.log('CURSOR MOVED!')
		mouse_changed = false
		keyboard_clicked = false
	}, timeout)
	logger.log('timer', ['Timer:', timerId])
	return timerId
}

/**
 * Test, does this window trigger timer
 *
 * @param {Array} triggers appTriggers from timers
 * @param {object} win window to test
 */
function isTimerTriggered(triggers, win) {
	let triggered = false
	forEach(triggers, trigger => {
		if (trigger.path == win.path) {
			if (trigger.regex && !win.title.match(new RegExp(trigger.regex))) {
				logger.log('timers', [
					'Regex continue',
					new RegExp(trigger.regex),
					trigger.regex
				])
				return
			}
			logger.log('timers', ['Regex pass'])
			triggered = true
		}
	})
	return triggered
}

// Register and start hook

// Alternatively, pass true to start in DEBUG mode.
// ioHook.start(true)
