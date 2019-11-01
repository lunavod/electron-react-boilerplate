import React, {useState} from 'react'

import {useBranch} from 'baobab-react/hooks'
import {map} from 'lodash'
import classNames from 'classnames'

import {updateBlackListItem, removeBlackListItem, addBlackListItem} from '../../actions/blackList'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import styles from './styles.css'
// import PropTypes from 'prop-types'


/**
 * BlackList react component
 */
function BlackList() {

	const [isOpen, setIsOpen] = useState(false)

	const {blackList, dispatch} = useBranch({
		blackList: ['blackList']
	})
	
	return <div className={styles.main}>
		<div className={classNames({
			[styles.title]: true,
			[styles.active]: isOpen
		})} onClick={() => setIsOpen(!isOpen)}>
			<FontAwesomeIcon icon={['fas', 'chevron-right']} />
			Черный список путей
		</div>
		
		{isOpen?
			<>
				{map(blackList, (item, index) => <div className={styles.item_wrapper} key={`blicklist_item_${index}`}>
					<input type="text" value={item}
						className={styles.item_input} onChange={e => {
							dispatch(updateBlackListItem, index, String.raw`${e.target.value}`)
						}} />
					<div className={styles.remove_item} onClick={() => dispatch(removeBlackListItem, index)}>
						<FontAwesomeIcon icon={['fas', 'times']} />
					</div>
				</div>)}
				<div className={styles.add_item} onClick={() => dispatch(addBlackListItem, '')}>Добавить</div>
			</>
			:
			<></>
		}
	</div>
}

BlackList.propTypes = {

}

export default BlackList