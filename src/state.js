import Baobab from 'baobab'
const monkey = Baobab.monkey

import {forEach, keys} from 'lodash'
import dateFormat from 'dateformat'

import registerStored from './utils/BaobabStored'

const tree = new Baobab({
	timers: {
		allTimers: {
			'Working': {
				name: 'Working',
				time: 0,
				status: 'inactive',
				appTriggers: [
					{
						path: 'C:\\Users\\yegor\\AppData\\Local\\Programs\\Microsoft VS Code\\Code.exe',
						regex: '.+'
					},
					{
						path: 'C:\\Users\\yegor\\Documents\\timer\\node_modules\\electron\\dist\\electron.exe'
					}
				]
			},

			'Just test': {
				name: 'Just test',
				time: 0,
				status: 'inactive',
				appTriggers: []
			}
		}
	},
	statistics: {
		
	},
	statistics_today: monkey({
		cursors: {
			statistics: ['statistics']
		},
		get: function(data) {
			let today = {}
			forEach(keys(data.statistics), (key) => {
				let obj = data.statistics[key]
				if (obj[dateFormat(new Date(), 'dd.mm.yyyy')]) {
					today[key] = obj[dateFormat(new Date(), 'dd.mm.yyyy')]
				}
			})
			return today
		}
	})
})

const stored = [
	{
		path: ['statistics'],
		name: 'statistics'
	},
	{
		path: ['timers'],
		name: 'timers'
	}
]

registerStored(stored, tree)

window.tree = tree

export default tree