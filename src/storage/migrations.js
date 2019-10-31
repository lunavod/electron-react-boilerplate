import {keys} from 'lodash'

const migrations = [
	{
		version: 1,
		description: 'Set up timers order',
		up: (tree) => {
			let timers = tree.select(['timers', 'allTimers']).get()
			let order = keys(timers)
			tree.select(['timers']).set('order', order)
		}
	}
]

export default migrations