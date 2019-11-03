import Baobab from 'baobab'
const monkey = Baobab.monkey

import {forEach, keys, noop} from 'lodash'
import dateFormat from 'dateformat'
import {formatOfDate as format} from '../utils/constants'

import registerStored from '../utils/BaobabStored'

import setUpMigrations from '../utils/BaobabMigrations'
import migrations from './migrations'

const initialData = {
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
			statistics: ['statistics'],
			blackList: ['blackList']
		},
		get: function({statistics, blackList}) {
			let today = {}
			forEach(keys(statistics), (key) => {
				let obj = statistics[key]
				let ignore = false
				forEach(blackList, regex => {
					if (!regex) return
					try {
						regex = new RegExp(regex)
						if (obj.path.match(regex)) ignore = true
					} catch(e) {noop()}
					// console.log(regex, obj.path)
				})
				if (ignore) return
				if (obj.time[dateFormat(new Date(), 'dd.mm.yyyy')]) {
					today[key] = obj
				}
			})
			return today
		}
	}),
	blackList: ['C:\\\\Windows\\\\SystemApps'],
	popupQueue: {
		lastId: 0,
		popups: [
		]
	},
}

const tree = new Baobab(initialData)

const stored = [
	{
		path: ['statistics'],
		name: 'statistics'
	},
	{
		path: ['timers'],
		name: 'timers'
	},
	{
		path: ['blackList'],
		name: 'blackList'
	},
]

registerStored(stored, tree)
setUpMigrations(tree, migrations)

window.resetStoredItem = (type) => {
	localStorage.removeItem(`__stored_${type}`)
	location.reload()
}

import {addPopup} from '../actions/popups'

window.addPopup = () => {
	addPopup(tree, {type: 'message', title: 'Pushed!', message: 'Hiiii!'})
}


window.tree = tree

export default tree