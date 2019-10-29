import React from 'react'

import styles from './styles.css'
import {useBranch} from 'baobab-react/hooks'
import Logger from '../../utils/Logger'
import {map} from 'lodash'
import Timer from '../Timer/index.jsx'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import {setTimerStatus} from '../../actions/timer'

// import PropTypes from 'prop-types'

const logger = new Logger({
	data: true
})

/**
 * Timers react component
 */
function Timers() {
	const { data, dispatch } = useBranch({
		data: ['timers']
	})
	logger.log('data', [data])

	let timers = data.allTimers
	return <div className={styles.main}>
		<div className={styles.header}>
			<span>Таймеры:</span>
			{/* <div className={styles.add_timer}>
				<FontAwesomeIcon icon={['fas', 'plus']} />
			</div> */}
		</div>
		{map(timers, timer => {
			return <Timer
				timer={timer}
				key={`timer_${timer.name}`}
				setActive={()=>dispatch(setTimerStatus, timer.name, 'active')}
				setInactive={()=>dispatch(setTimerStatus, timer.name, 'inactive')}
			/>
		})}
	</div>
}

Timers.propTypes = {

}

export default Timers