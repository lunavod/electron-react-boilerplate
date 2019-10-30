import React from 'react'
import styles from './styles.css'
import {useBranch} from 'baobab-react/hooks'

import {keys, map, reduce, replace, capitalize} from 'lodash'
import formatTime from '../../utils/TimeFormatter'
import dateFormat from 'dateformat'
import { formatOfDate as format } from '../../utils/constants'
const { clipboard } = require('electron')

window.formatTime = formatTime
// import PropTypes from 'prop-types'

/**
 * Statistics react component
 */
function Statistics() {
	let {data} = useBranch({
		data: ['statistics_today']
	})

	let date = dateFormat(new Date(), format)

	let apps = keys(data)
	apps.sort((a,b) => data[b].time[date] - data[a].time[date])

	if (!apps.length) return <></>

	let max = data[apps[0]].time[date]

	return <div className={styles.main}>
		<h1>Статистика приложений:</h1>
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
				</div>
			})}
		</div>
	</div>
}

Statistics.propTypes = {
}

export default Statistics