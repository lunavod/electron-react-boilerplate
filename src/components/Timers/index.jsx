import React, {useState} from 'react'

import styles from './styles.css'
import {useBranch} from 'baobab-react/hooks'
// import Logger from '../../utils/Logger'
import {map, forEach, includes} from 'lodash'
import Timer from '../Timer/index.jsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd'

import {setTimerStatus, resetTimerTime, updateTimerTriggerPath,
	updateTimerTriggerRegex, addTimerTrigger, removeTimerTrigger,
	removeTimer, addTimer, reorderTimers, renameTimer} from '../../actions/timer'
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

	const handleNewTimerInput = (e) => {
		e.preventDefault()
		setNewTimerName(e.target.value)
	}

	const onNewTimerKeyPress = (e) => {
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

	const onDragEnd = (result) => {
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

	const sameElements = (a, b) => {
		if (a.length != b.length) return false
		
		let same = true
		forEach(a, el => {
			same = includes(b, el)
		})

		return same
	}

	if (!sameElements(data.order, order)) {
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
						{map(order, (timer_id, index) => {
							let timer = timers[timer_id]
							return <Draggable isDragDisabled={!inReorderMode} draggableId={timer_id}
								index={index} key={`${timer.id}_${index}`}>
								{provided => (
									<Timer
										provided={provided}
										timer={timer}
										key={`timer_${timer.id}`}
										setActive={()=>dispatch(setTimerStatus, timer.id, 'active')}
										setInactive={()=>dispatch(setTimerStatus, timer.id, 'inactive')}
										reset={()=>dispatch(resetTimerTime, timer.id)}
										updatePath={(e, index)=>{
											e.preventDefault()
											dispatch(updateTimerTriggerPath, timer.id, index, e.target.value)
										}}
										updateRegex={(e, index)=>{
											e.preventDefault()
											dispatch(updateTimerTriggerRegex, timer.id, index, e.target.value)
										}}
										addTrigger={() => {
											dispatch(addTimerTrigger, timer.id)
										}}
										removeTrigger={(index)=>{
											dispatch(removeTimerTrigger, timer.id, index)
										}}
										removeTimer={() => dispatch(removeTimer, timer.id)}
										renameTimer={e => dispatch(renameTimer, timer.id, e.target.value)}
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