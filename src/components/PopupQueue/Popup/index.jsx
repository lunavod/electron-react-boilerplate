import React, {useState} from 'react'

import styles from './styles.css'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import UpdaterContent from './contents/UpdaterContent/index.jsx'


/**
 * Popup react component
 * 
 * @param {object} props component props
 */
function Popup(props) {
	let popup = props.popup
	const [hidden, setHidden] = useState(true)
	const [closed, setClosed] = useState(false)

	const close = () => {
		setClosed(true)
		setTimeout(()=>props.removeFromQueue(), 500)
	}

	setTimeout(()=> {if (!closed){setHidden(false)}}, 100)

	let content = ''

	switch(popup.type) { // eslint-disable-line sonarjs/no-small-switch
	case 'updater':
		content = <UpdaterContent removeFromQueue={props.removeFromQueue} />
		break
	default:
		content = <>
			{popup.title? <div className={styles.title}>{popup.title}</div> : <></>}
			{popup.message}
		</>
	}

	return <div className={classNames({
		[styles.main]: true,
		[styles.hidden]: hidden,
		[styles.closed]: closed
	})} onClick={close}>
		{content}
	</div>
}

Popup.propTypes = {
	popup: PropTypes.object.isRequired,
	removeFromQueue: PropTypes.func.isRequired
}

export default Popup