import { keys, forEach, includes } from 'lodash'

const migrations = [
	{
		version: 1,
		description: 'Set up timers order',
		up: tree => {
			let timers = tree.select(['timers', 'allTimers']).get()
			let order = keys(timers)
			tree.select(['timers']).set('order', order)
		}
	},
	{
		version: 2,
		description: 'Change timer name to timer id',
		up: tree => {
			let timers = tree.select(['timers', 'allTimers']).get()
			let order = tree.select(['timers', 'order']).get()

			let newTimers = {}
			let newOrder = Array.from(order)

			let lastId = -1
			forEach(keys(timers), timerName => {
				lastId++
				newTimers[lastId] = {
					...timers[timerName],
					id: lastId + ''
				}
				if (includes(order, timerName)) {
					newOrder[order.indexOf(timerName)] = lastId + ''
				}
			})
			tree.select(['timers', 'allTimers']).set(newTimers)
			tree.select(['timers', 'order']).set(newOrder)
		}
	},
	{
		version: 3,
		description: 'Set up timers order',
		up: tree => {
			let statistics = tree.select(['statistics']).get()
			forEach(keys(statistics), name => {
				if (!tree.select(['statistics', name, 'timeline']).get())
					tree.select(['statistics', name]).set('timeline', {})
			})
		}
	}
]

export default migrations
