import React from 'react'
import styles from './styles.css'
import {useBranch} from 'baobab-react/hooks'

import {keys, map, forEach, noop, reduce, replace, capitalize, startsWith, endsWith} from 'lodash'
import formatTime from '../../utils/TimeFormatter'
import dateFormat from 'dateformat'
import { formatOfDate as format } from '../../utils/constants'
import {setDay} from '../../actions/statistics'
const { clipboard } = require('electron')
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Select from '../Select/index.jsx'
import classNames from 'classnames'

window.formatTime = formatTime
// import PropTypes from 'prop-types'

/**
 * Get statistcs info for only one date
 * 
 * @param {object} statistics statistics
 * @param {Array} blackList blackList
 * @param {string} date date
 */
function getStatisticsByDate(statistics, blackList, date) {
	let data = []
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
		if (obj.time[date]) {
			data[key] = obj
		}
	})
	return data
}

function getAppTotalTime(app_statistics) {
	let total = 0
	forEach(app_statistics.time, day_time => {
		total += day_time
	})
	return total
}

/**
 * Statistics react component
 */
function Statistics() {
	let {statistics, blackList, day, days, dispatch} = useBranch({
		statistics: ['statistics'],
		blackList: ['blackList'],
		day: ['statistics_day'],
		days: ['statistics_days'],
	})

	let today = dateFormat(new Date(), format)
	let date = day? day : today

	let data = getStatisticsByDate(statistics, blackList, date)

	let apps = keys(data)
	apps.sort((a,b) => data[b].time[date] - data[a].time[date])

	if (!apps.length) return <></>

	let max = data[apps[0]].time[date]

	let isFirstDay = startsWith(days, date)
	let isLastDay = endsWith(days, date)

	const setPrev = () => {
		if (isFirstDay) return
		let index = days.indexOf(date)
		dispatch(setDay, days[index-1])
	}

	const setNext = () => {
		if (isLastDay) return
		let index = days.indexOf(date)
		dispatch(setDay, days[index+1])
	}

	return <div className={styles.main}>
		<header className={styles.header}>
			<h1>Статистика приложений:</h1>
			<div className={styles.select_day_wrapper}>
				<div className={classNames({
					[styles.set_prev]: true,
					[styles.disabled]: isFirstDay
				})} onClick={setPrev}>
					<FontAwesomeIcon icon={['fas', 'chevron-left']} />
				</div>
				<Select
					options={map(days, day => ({name: day==today? `${day} (Сегодня)` : day, value: day}))}
					selected={days.indexOf(date)}
					onChange={day => dispatch(setDay, day)} />
				<div className={classNames({
					[styles.set_next]: true,
					[styles.disabled]: isLastDay
				})} onClick={setNext}>
					<FontAwesomeIcon icon={['fas', 'chevron-right']} />
				</div>
			</div>
		</header>
		<div className={styles.apps_list}>
			{map(apps, app => {
				let elementWidth = data[app].time[date]/(max/100)
				let allAppsTime = reduce(apps, (sum, el) => sum+data[el].time[date], 0)
				let totalPercent = Math.ceil(data[app].time[date]/(allAppsTime/100))

				return <div
					className={styles.app}style={{width: `${elementWidth}%`}}
					key={`app_${app}`} title={`${data[app].path} - click to copy`}
					onClick={()=>{clipboard.writeText(data[app].path)}}>
					<span className={styles.app_title}>{capitalize(replace(app, '.exe', ''))}</span>
					<span className={styles.app_info}>{totalPercent}% - {formatTime(data[app].time[date])}</span>
					<span className={styles.total_time}>
						{formatTime(getAppTotalTime(statistics[app]), 'H:M:S')} всего
					</span>
				</div>
			})}
		</div>
	</div>
}

Statistics.propTypes = {
}

export default Statistics