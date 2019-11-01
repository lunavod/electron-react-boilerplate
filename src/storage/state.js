import Baobab from 'baobab'
const monkey = Baobab.monkey

import {forEach, keys} from 'lodash'
import dateFormat from 'dateformat'
import {formatOfDate as format} from '../utils/constants'

import registerStored from '../utils/BaobabStored'

import setUpMigrations from '../utils/BaobabMigrations'
import migrations from './migrations'

const tree = new Baobab({
	timers: {
		order: ['Working','Just test'],
		allTimers: {
			'0': {
				name: 'Working',
				id: 1,
				time_total: 0,
				time: {
					[dateFormat(new Date(), format)]: 0
				},
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

			'1': {
				name: 'Just test',
				id: 2,
				time: {
				},
				time_total: 0,
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
				if (obj.time[dateFormat(new Date(), 'dd.mm.yyyy')]) {
					today[key] = obj
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
setUpMigrations(tree, migrations)

window.tree = tree

export default tree