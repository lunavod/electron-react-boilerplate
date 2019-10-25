const activeWin = global.require('active-win')
import getCursorPos from 'windows-cursor-pos'
import tree from '../state.js'

import Logger from 'Utils/Logger'

let logger = new Logger({tree: true})

let timerId = 0

/**
 * Function that monitors statistics and writes it to tree
 */
export default async function monitorWindowAndCursor() {
	let data = {...tree.select('statistics').get()}
	let win = {id: 0, app: ''}
	let pos = {x: 0, y: 0}

	let last_change = Date.now()

	let timeout = 1000
	let isStopped = false

	timerId = setInterval(async () => {
		let cur_win = await activeWin()
		let cur_pos = getCursorPos()

		let win_changed = cur_win.id !== win.id
		let cursor_moved = cur_pos.x !== pos.x && cur_pos.y !== pos.y

		if (win_changed || cursor_moved) {
			last_change = Date.now()
			win = {id: cur_win.id, app: cur_win.owner.name}
			pos = cur_pos
			isStopped = false
		}

		if (isStopped) return

		if (Date.now() - last_change >= 5 * 60 * 1000) {
			logger.log(Date.now() - last_change)
			logger.log('Saaaaame!')
			data[win.app] -= (Date.now() - last_change)
			isStopped = true
		}

		logger.log(cur_win, cur_pos, win, pos, Date.now() - last_change)
		if (data[win.app]) {
			data[win.app] += timeout
		} else {
			data[win.app] = timeout
		}
		tree.select('statistics').set(data)
		logger.log(tree.get())
	}, timeout)
	logger.log('Timer:', timerId)
	return timerId
}