import React, {useState, useEffect} from 'react'

import {map} from 'lodash'
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import styles from './styles.css'
import PropTypes from 'prop-types'

/**
 * Select component
 * 
 * @param {object} props React props
 */
export default function Select(props) {
	const [selected, setSelected] = useState(props.selected || 0)
	const [isActive, setIsActive] = useState(false)

	useEffect(() => {
		setSelected(props.selected)
	}, [props.selected])

	const select = (index) => {
		setSelected(index)
		setIsActive(false)
		if (props.onChange)
			props.onChange(props.options[index].value)
	}

	return <div className={classNames({
		[styles.wrapper]: true,
		[styles.active]: isActive
	})}>
		<div className={styles.select} onClick={()=>setIsActive(true)}>
			<span>{props.options[selected].name}</span>
			<div className={styles.chevron}>
				<FontAwesomeIcon icon={['fas', 'caret-left']} />
			</div>
		</div>
		<div className={styles.options}>
			{map(props.options, (option, index) => {
				return <div className={styles.option} key={option.value} onClick={()=>select(index)}>{option.name}</div>
			})}
		</div>
	</div>
}

Select.propTypes = {
	onChange: PropTypes.func,
	options: PropTypes.array.isRequired,
	selected: PropTypes.number
}