import React, {useState} from 'react'

import styles from './styles.css'
import {useBranch} from 'baobab-react/hooks'
// import Logger from '../../utils/Logger'
import {map} from 'lodash'
import Timer from '../Timer/index.jsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd'

import {setTimerStatus, resetTimerTime, updateTimerTriggerPath,
	updateTimerTriggerRegex, addTimerTrigger, removeTimerTrigger,
	removeTimer, addTimer, reorderTimers} from '../../actions/timer'
import classNames from 'classnames'

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
	let [order, setOrder] = useState(data.order)

	let [inReorderMode, setInReorderMode] = useState(false)

	const reorder = (list, startIndex, endIndex) => {
		const result = Array.from(list)
		const [removed] = result.splice(startIndex, 1)
		result.splice(endIndex, 0, removed)
		return result
	}

	function onDragEnd(result) {
		if (!result.destination) {
			return
		}

		if (result.destination.index === result.source.index) {
			return
		}
		setOrder(reorder(order, result.source.index, result.destination.index))
		dispatch(reorderTimers,result.source.index,
			result.destination.index)
	}

	if (data.order.length != order.length) {
		setOrder(data.order)
	}

	return <div className={styles.main}>
		<div className={styles.header}>
			<span>Таймеры:</span>
			<div onClick={()=>setInReorderMode(!inReorderMode)} className={classNames({
				[styles.toggle_reorder]: true,
				[styles.active]: inReorderMode
			})}
			title={inReorderMode? 'Отключить сортировку перетягиванием' : 'Включить сортировку перетягиванием'}>
				<FontAwesomeIcon icon={['fas', 'arrows-alt-v']} />
			</div>
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

		<DragDropContext onDragEnd={onDragEnd}>
			<Droppable droppableId="timers_list">
				{provided => (
					<div ref={provided.innerRef}>
						{map(order, (timer_name, index) => {
							let timer = timers[timer_name]
							return <Draggable isDragDisabled={!inReorderMode} draggableId={timer_name}
								index={index} key={`${timer_name}_${index}`}>
								{provided => (
									<Timer
										provided={provided}
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
								)}
							</Draggable>
						})}
						{provided.placeholder}
					</div>
				)}
				
			</Droppable>
		</DragDropContext>
	</div>
}

Timers.propTypes = {

}

export default Timers