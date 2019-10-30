import React, {useState} from 'react'

import styles from './styles.css'
import {useBranch} from 'baobab-react/hooks'
// import Logger from '../../utils/Logger'
import {map} from 'lodash'
import Timer from '../Timer/index.jsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import {setTimerStatus, resetTimerTime, updateTimerTriggerPath,
	updateTimerTriggerRegex, addTimerTrigger, removeTimerTrigger,
	removeTimer, addTimer} from '../../actions/timer'

// import PropTypes from 'prop-types'

/**
 * Timers react component
 */
function Timers() {
	const { data, dispatch } = useBranch({
		data: ['timers']
	})

	const [newTimerName, setNewTimerName] = useState('')

	function handleNewTimerInput(e) {
		e.preventDefault()
		setNewTimerName(e.target.value)
	}

	function onNewTimerKeyPress(e) {
		if (e.key == 'Enter') {
			dispatch(addTimer, newTimerName)
			setNewTimerName('')
		}
	}

	let timers = data.allTimers
	return <div className={styles.main}>
		<div className={styles.header}>
			<span>Таймеры:</span>
		</div>

		<div className={styles.add_timer_wrapper}>
			<input
				type="text"
				placeholder="Добавить таймер"
				className={styles.add_timer}
				value={newTimerName}
				onChange={handleNewTimerInput}
				onKeyPress={onNewTimerKeyPress} />
			<div className={styles.add_timer_button} onClick={()=>dispatch(addTimer, newTimerName)}>
				<FontAwesomeIcon icon={['fas', 'share']} className={styles.icon} />
			</div>
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