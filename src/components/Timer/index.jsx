import React from 'react'

import styles from './styles.css'
import classNames from 'classnames'
import {includes} from 'lodash'
import PropTypes from 'prop-types'
import formatTime from '../../utils/TimeFormatter'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

/**
 * Timer react component
 * 
 * @param {object} props react props
 */
function Timer(props) {
	const timer = props.timer

	/**
	 * Callback for timer action
	 */
	function onActionClick() {
		if (timer.status == 'active') {
			props.setInactive()
		} else {
			props.setActive()
		}
	}
	
	return <div className={classNames({
		[styles.timer]: true,
		[styles.active]: includes(['active', 'triggered'], timer.status)
	})}>
		<div className={styles.action_wrapper} onClick={onActionClick}>
			{timer.status == 'active' ? 
				<FontAwesomeIcon icon={['fas', 'pause']} /> : <></>}
			{timer.status == 'inactive' ? 
				<FontAwesomeIcon icon={['fas', 'play']} /> : <></>}
			{timer.status == 'triggered' ? 
				<FontAwesomeIcon icon={['fas', 'hand-paper']} /> : <></>}
		</div>
		<div className={styles.info}>
			<div>{timer.name}<span className={styles.status}> - {timer.status}</span></div>
			<div className={styles.time}>{formatTime(timer.time, 'H:M:S')}</div>
		</div>
		<div className={styles.reset} onClick={props.reset}>
			<FontAwesomeIcon icon={['fas', 'redo']} />
		</div>
	</div>
}

Timer.propTypes = {
	timer: PropTypes.object.isRequired,
	setActive: PropTypes.func.isRequired,
	setInactive: PropTypes.func.isRequired,
	reset:PropTypes.func.isRequired,
}

export default Timer