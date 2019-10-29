const activeWin = global.require('active-win')
import getCursorPos from 'windows-cursor-pos'
import tree from '../state.js'

import {forEach, clone} from 'lodash'
import Logger from 'Utils/Logger'

import dateFormat from 'dateformat'
let format = 'dd.mm.yyyy'

let logger = new Logger({
	tree: true,
	timer: false,
	cur_win: true,
	timers: true
})

let timerId = 0

/**
 * Function that monitors statistics and writes it to tree
 */
export default async function monitorWindowAndCursor() {
	let win = {id: 0, app: '', path: '', title: ''}
	let pos = {x: 0, y: 0}

	let last_change = Date.now()

	let timeout = 1000
	let isStopped = false

	// TODO: Refactor cognitive complexity?
	// eslint-disable-next-line
	timerId = setInterval(async () => {
		let data = {...tree.select('statistics').get()}
		let timers = clone(tree.select(['timers', 'allTimers']).get())

		let date = dateFormat(new Date(), format)

		let cur_win = await activeWin()
		let cur_pos = getCursorPos()

		let win_changed = cur_win.id !== win.id
		let cursor_moved = cur_pos.x !== pos.x && cur_pos.y !== pos.y

		if (win_changed || cursor_moved) {
			last_change = Date.now()
			win = {id: cur_win.id, app: cur_win.owner.name, path: cur_win.owner.path, title: cur_win.title}
			logger.log('cur_win', [win])
			pos = cur_pos
			isStopped = false
		}

		if (isStopped) return

		if (Date.now() - last_change >= 5 * 60 * 1000) {
			logger.log(Date.now() - last_change)
			logger.log('Saaaaame!')
			data[win.app][date] -= (Date.now() - last_change)
			isStopped = true

			forEach(timers, (timer, name) => {
				if (timer.status == 'active') return
	
				let triggered = isTimerTriggered(timer.appTriggers, win)
	
				if (!triggered) return

				logger.log('timers', ['Stopping', timer, name])
	
				tree.select(['timers', 'allTimers', timer.name, 'status']).set('inactive')
				tree.select(['timers', 'allTimers', timer.name, 'time']).set(timer.time - (Date.now() - last_change))
				timer.time -= (Date.now() - last_change)
				
				logger.log('timers', ['Stopped', timer, name])
			})
		}

		logger.log(cur_win, cur_pos, win, pos, Date.now() - last_change)
		if (!data[win.app]) {
			tree.select(['statistics']).set({...data, [win.app]: {[date]: timeout}})
		} else if (!data[win.app][date]) {
			tree.select(['statistics', win.app]).set({...data[win.app], [date]: timeout})
		} else {
			tree.select(['statistics', win.app, date]).set(data[win.app][date] + timeout)
		}

		forEach(timers, (timer, name) => {
			if (timer.status == 'active') return

			let triggered = isTimerTriggered(timer.appTriggers, win)

			// If timer status is 'triggered', but it is not triggered by current app, it should be inactive
			if (!triggered && timer.status == 'triggered') {
				tree.select(['timers', 'allTimers', timer.name, 'status']).set('inactive')
				timers[name] = timer
			}
			if (!triggered) return

			tree.select(['timers', 'allTimers', timer.name, 'status']).set('triggered')

			logger.log('timers', [timer, name])
		})
		logger.log('tree', [tree.get()])
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
			if (trigger.regex && !win.title.match(trigger.regex)) {
				logger.log('timers', ['Regex continue'])
				return
			}
			logger.log('timers', ['Regex pass'])
			triggered = true
		}
	})
	return triggered
}