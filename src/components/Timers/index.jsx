import React from 'react'

import styles from './styles.css'
import {useBranch} from 'baobab-react/hooks'
// import Logger from '../../utils/Logger'
import {map} from 'lodash'
import Timer from '../Timer/index.jsx'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import {setTimerStatus, resetTimerTime, updateTimerTriggerPath,
	updateTimerTriggerRegex, addTimerTrigger, removeTimerTrigger,
	removeTimer} from '../../actions/timer'

// import PropTypes from 'prop-types'

/**
 * Timers react component
 */
function Timers() {
	const { data, dispatch } = useBranch({
		data: ['timers']
	})

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
				reset={()=>dispatch(resetTimerTime, timer.name)}
				updatePath={(e, index)=>{
					e.preventDefault()
					dispatch(updateTimerTriggerPath, timer.name, index, e.target.value)
				}}
				updateRegex={(e, index)=>{
					e.preventDefault()
					dispatch(updateTimerTriggerRegex, timer.name, index, e.target.value)
				}}
				addTrigger={() => {
					dispatch(addTimerTrigger, timer.name)
				}}
				removeTrigger={(index)=>{
					dispatch(removeTimerTrigger, timer.name, index)
				}}
				removeTimer={() => dispatch(removeTimer, timer.name)}
			/>
		})}
	</div>
}

Timers.propTypes = {

}

export default Timers