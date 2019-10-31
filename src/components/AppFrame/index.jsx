import React, {useState} from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
const { ipcRenderer } = global.require('electron')

import styles from './styles.css'
// import PropTypes from 'prop-types'


/**
 * AppFrame react component
 */
function AppFrame() {
	let [isMaximized, setIsMaximized] = useState(ipcRenderer.sendSync('is-maximized'))

	const onMinimize = () => {
		ipcRenderer.send('minimize')
	}

	const onMaximize = () => {
		if (!isMaximized) {
			ipcRenderer.send('maximize')
			setIsMaximized(true)
		} else {
			ipcRenderer.send('unmaximize')
			setIsMaximized(false)
		}
	}

	const onClose = () => {
		ipcRenderer.send('fake-close')
	}
	
	return <div className={styles.main}>
		<div className={styles.title}>Timer v{global.require('electron').remote.app.getVersion()}</div>
		<div className={styles.actions}>
			<div className={styles.minimize_icon} onClick={onMinimize}><FontAwesomeIcon icon={['far', 'window-minimize']} /></div>
			<div className={styles.maximize_icon} onClick={onMaximize}>{isMaximized? <FontAwesomeIcon icon={['far', 'window-restore']} /> : <FontAwesomeIcon icon={['far', 'window-maximize']} />}</div>
			<div className={styles.close_icon} onClick={onClose}><FontAwesomeIcon icon={['fas', 'times']} /></div>
		</div>
	</div>
}

AppFrame.propTypes = {

}

export default AppFrame