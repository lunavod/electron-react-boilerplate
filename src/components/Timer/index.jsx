import React, {useState} from 'react'

import styles from './styles.css'
import classNames from 'classnames'
import {includes, map, noop} from 'lodash'
import PropTypes from 'prop-types'
import formatTime from '../../utils/TimeFormatter'
import dateFormat from 'dateformat'
import { formatOfDate as format } from '../../utils/constants'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


// TODO: Changing timer's name

/**
 * Timer react component
 * 
 * @param {object} props react props
 */
function Timer(props) {
	const timer = props.timer
	const date = dateFormat(new Date(), format)

	const [settingsVisible, setSettingsVisible] = useState(false)

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

	let provided = props.provided || {innerRef: noop, draggableProps: {}, dragHandleProps: {}}

	return <div className={classNames({
		[styles.timer]: true,
		[styles.active]: includes(['active', 'triggered'], timer.status)
	})}
	ref={provided.innerRef}
	{...provided.draggableProps}
	{...provided.dragHandleProps}
	>
		<div className={styles.info}>
			<div className={styles.action_wrapper} onClick={onActionClick}>
				{timer.status == 'active' ? 
					<FontAwesomeIcon icon={['fas', 'pause']} /> : <></>}
				{timer.status == 'inactive' ? 
					<FontAwesomeIcon icon={['fas', 'play']} /> : <></>}
				{timer.status == 'triggered' ? 
					<FontAwesomeIcon icon={['fas', 'hand-paper']} /> : <></>}
			</div>
			<div>
				<div>{timer.name}<span className={styles.status}> - {timer.status}</span></div>
				<div className={styles.time_info}>
					<span className={styles.time}>{formatTime(timer.time[date], 'H:M:S')}</span>
					&nbsp;сегодня, всего&nbsp;
					<span className={styles.time}>{formatTime(timer.time_total, 'H:M:S')}</span>
				</div>
			</div>
			<div className={styles.actions_right}>
				<div className={styles.wrench} onClick={()=>setSettingsVisible(!settingsVisible)}>
					<FontAwesomeIcon icon={['fas', 'wrench']} />
				</div>
				<div className={styles.reset} onClick={props.reset}>
					<FontAwesomeIcon icon={['fas', 'redo']} />
				</div>
			</div>
		</div>
		<div className={classNames({
			[styles.settings]: true,
			[styles.active]: settingsVisible
		})}>
			<div className={styles.remove_timer} onClick={()=>props.removeTimer()}>Удалить таймер</div>
			{map(timer.appTriggers, (trigger, index) => {
				return <div className={styles.trigger} key={`trigger_${index}`}>
					<div className={styles.inputs}>
						<input
							className={styles.trigger_path}
							type={'text'}
							value={trigger.path}
							placeholder='Путь к приложению'
							onChange={e => props.updatePath(e, index)} />
						<input
							className={styles.trigger_regex}
							type={'text'}
							value={trigger.regex? trigger.regex : ''}
							placeholder='Регулярное выражение'
							onChange={e => props.updateRegex(e, index)} />
					</div>
					<div className={styles.remove_trigger} onClick={()=>props.removeTrigger(index)}>
						<FontAwesomeIcon icon={['fas', 'times']} />
					</div>
				</div>
			})}
			<div className={styles.add_trigger} onClick={props.addTrigger}>
				{/* <FontAwesomeIcon icon={['fas', 'plus']} className={styles.icon} /> */}Добавить триггер 
			</div>
		</div>
	</div>
}

Timer.propTypes = {
	timer: PropTypes.object.isRequired,
	setActive: PropTypes.func.isRequired,
	setInactive: PropTypes.func.isRequired,
	reset: PropTypes.func.isRequired,
	updatePath: PropTypes.func.isRequired,
	updateRegex: PropTypes.func.isRequired,
	addTrigger: PropTypes.func.isRequired,
	removeTrigger: PropTypes.func.isRequired,
	removeTimer: PropTypes.func.isRequired,
	provided: PropTypes.object
}

export default Timer