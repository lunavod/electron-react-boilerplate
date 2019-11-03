import React from 'react'

import {useBranch} from 'baobab-react/hooks'
import {shiftPopup} from '../../actions/popups'

import styles from './styles.css'

import Popup from './Popup/index.jsx'
// import PropTypes from 'prop-types'


/**
 * PopupQueue react component
 */
function PopupQueue() {
	let {queue, dispatch} = useBranch({queue: ['popupQueue']})

	if (!queue.popups.length) return <></>

	let popup = queue.popups[0]
	
	return <div className={styles.main}>
		<Popup popup={popup} removeFromQueue={()=>dispatch(shiftPopup)} key={`popup_${popup.id}`} />
	</div>
}

PopupQueue.propTypes = {

}

export default PopupQueue