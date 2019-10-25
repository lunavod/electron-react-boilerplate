import Baobab from 'baobab'
import storage from './storage'

import {forEach, isArray, isEqual} from 'lodash'

const tree = new Baobab({
	versions: {
		electron: process.versions.electron,
		nodejs: process.versions.node,
		chromium: process.versions.chrome
	},
	timers: {

	},
	statistics: {

	}
})

const stored = [
	{
		path: ['statistics'],
		name: 'statistics_base'
	}
]

forEach(stored, options => {
	if (isArray(options)) options = {
		path: options
	}
	if (!options.name) options.name = options.path.join('.')

	const watcher = tree.watch({
		target: options.path
	})

	let val = storage.get(`__stored_${options.name}`, {
		model: options.model
	})

	// console.log('VAL', val)

	if (val) {
		tree.select(options.path).set(val)
	} else {
		storage.set(`__stored_${options.name}`, tree.select(options.path).get())
	}

	watcher.on('update', () => {
		const newVal = tree.select(options.path).get()
		// console.log(`${options.path.join(".")} was updated!!!:`, newVal)
		storage.set(`__stored_${options.name}`, newVal)
	})

	storage.listenChange(`__stored_${options.name}`, val => {
		val = storage.get(`__stored_${options.name}`, {
			model: true
		})
		// console.log('STORAGE CHANGED', `__stored_${options.name}`, val)
		if (!isEqual(JSON.stringify(val), JSON.stringify(tree.select(options.path).get()))) {
			// console.warn('UPDATED')
			tree.select(options.path).set(val)
		}
	})
})

window.tree = tree
window.storage = storage


export default tree