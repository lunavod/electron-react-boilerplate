import React from 'react'
import styles from './styles.css'
import {useBranch} from 'baobab-react/hooks'

import {keys, map, reduce, replace, capitalize} from 'lodash'
import formatTime from '../../utils/TimeFormatter'

window.formatTime = formatTime
// import PropTypes from 'prop-types'

/**
 * Statistics react component
 */
function Statistics() {
	let {data} = useBranch({
		data: ['statistics_today']
	})

	let apps = keys(data)
	apps.sort((a,b) => data[b]-data[a])

	let max = data[apps[0]]

	return <div className={styles.main}>
		<h1>Статистика приложений:</h1>
		<div className={styles.apps_list}>
			{map(apps, app => {
				let elementWidth = data[app]/(max/100)
				let allAppsTime = reduce(apps, (sum, el) => sum+data[el], 0)
				let totalPercent = Math.ceil(data[app]/(allAppsTime/100))

				return <div className={styles.app} style={{width: `${elementWidth}%`}} key={`app_${app}`}>
					<span className={styles.app_title}>{capitalize(replace(app, '.exe', ''))}</span>
					<span className={styles.app_info}>{totalPercent}% - {formatTime(data[app])}</span>
				</div>
			})}
		</div>
	</div>
}

Statistics.propTypes = {
}

export default Statistics