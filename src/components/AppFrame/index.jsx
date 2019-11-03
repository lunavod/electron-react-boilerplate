import React, {useState} from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
const { ipcRenderer } = global.require('electron')

import styles from './styles.css'
// import PropTypes from 'prop-types'


/**
 * AppFrame react component
 */
function AppFrame() {
	document.title = `Таймер ${isDev? '[dev]' : ''}`

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
		<div className={styles.title}>Таймер v{global.require('electron').remote.app.getVersion()} {isDev? '[dev]' : ''}</div>
		<div className={styles.actions}>
			<div onClick={onMinimize}>
				<FontAwesomeIcon icon={['far', 'window-minimize']} />
			</div>
			<div onClick={onMaximize}>
				{isMaximized? 
					<FontAwesomeIcon icon={['far', 'window-restore']} />
					:
					<FontAwesomeIcon icon={['far', 'window-maximize']} />
				}
			</div>
			<div onClick={onClose}><FontAwesomeIcon icon={['fas', 'times']} /></div>
		</div>
	</div>
}

AppFrame.propTypes = {

}

export default AppFrame